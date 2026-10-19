'use client';

import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { PdfDropZone } from './pdf-drop-zone';
import { loadPdf } from '@/lib/pdfjs';
import { downloadBlob, isPdfFile } from '@/lib/download';
import { formatBytes } from '@/lib/base64';
import { TargetPdfCompression } from '@/components/target-pdf-compression';
import { trackToolEvent } from '@/lib/analytics';

type Level = 'low' | 'medium' | 'high';
const presets = { low: { scale: 1.8, quality: 0.92 }, medium: { scale: 1.4, quality: 0.75 }, high: { scale: 1.1, quality: 0.55 } };

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [progress, setProgress] = useState(0);
  const [size, setSize] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const running = useRef(false);
  const [selection, setSelection] = useState(0);
  const [targetBusy, setTargetBusy] = useState(false);

  const select = (selected: File) => {
    if (running.current || targetBusy) return;
    setFile(null);
    setSize(0);
    setProgress(0);
    setStatus('');
    setError('');
    if (!isPdfFile(selected)) return setError('Please select a PDF file.');
    setFile(selected);
    setSelection(value => value + 1);
  };

  const compress = async (level: Level) => {
    if (!file || running.current || targetBusy) return;
    running.current = true;
    setBusy(true);
    setError('');
    setSize(0);
    setProgress(0);
    setStatus('Reading PDF...');
    trackToolEvent('start');
    let task: Awaited<ReturnType<typeof loadPdf>> | undefined;
    try {
      const original = await file.arrayBuffer();
      if (original.byteLength > 25_000_000) throw new Error('Choose a PDF below 25 MB.');
      task = await loadPdf(original.slice(0));
      const source = await task.promise;
      if (source.numPages > 150) throw new Error('Choose a PDF with at most 150 pages.');
      const output = await PDFDocument.create();
      const settings = presets[level];
      for (let index = 1; index <= source.numPages; index++) {
        setStatus(`Compressing page ${index} of ${source.numPages}`);
        const page = await source.getPage(index);
        const physical = page.getViewport({ scale: 1 });
        const scale = Math.min(settings.scale, 4096 / Math.max(physical.width, physical.height), Math.sqrt(16_000_000 / (physical.width * physical.height)));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        try {
          canvas.width = Math.max(1, Math.ceil(viewport.width));
          canvas.height = Math.max(1, Math.ceil(viewport.height));
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Unable to create a rendering canvas.');
          await page.render({ canvas, canvasContext: context, viewport, background: 'rgb(255,255,255)' }).promise;
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', settings.quality));
          if (!blob) throw new Error(`Could not compress page ${index}.`);
          const image = await output.embedJpg(await blob.arrayBuffer());
          // Render resolution must not change the physical page dimensions.
          output.addPage([physical.width, physical.height]).drawImage(image, { x: 0, y: 0, width: physical.width, height: physical.height });
        } finally {
          canvas.width = canvas.height = 0;
          page.cleanup();
        }
        setProgress(Math.round((index / source.numPages) * 95));
        await new Promise(resolve => setTimeout(resolve, 0));
      }
      setStatus('Saving PDF...');
      const result = await output.save({ useObjectStreams: true });
      const smaller = result.byteLength < original.byteLength;
      const blob = smaller ? new Blob([new Uint8Array(result)], { type: 'application/pdf' }) : file;
      setSize(blob.size);
      setProgress(100);
      setStatus(smaller ? 'Compressed PDF downloaded.' : 'This PDF is already smaller than the compressed copy. The original was kept.');
      downloadBlob(blob, smaller ? `compressed-${file.name}` : file.name);
      trackToolEvent('success');
    } catch (err) {
      trackToolEvent('error');
      setStatus('');
      setError(err instanceof Error ? err.message : 'Compression failed.');
    } finally {
      await task?.destroy().catch(() => {});
      running.current = false;
      setBusy(false);
    }
  };

  return <div className="space-y-6">
    <PdfDropZone inputRef={fileInputRef} disabled={busy || targetBusy} onSelect={selected => selected instanceof File && select(selected)} title="Drop your PDF here" />
    {file && <div className="theme-card space-y-4 rounded-2xl border p-6">
      <p className="break-all font-semibold theme-title">{file.name}</p>
      <p className="text-sm theme-muted">Original: {formatBytes(file.size)}</p>
      <p className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">Best for scans and image-heavy PDFs. Compression flattens pages into images, so selectable text, links, forms, and accessibility tags are removed. The original is kept if it is smaller.</p>
      {status && <div role="status" aria-live="polite" className="space-y-3 text-sm theme-title">
        <p>{status}</p>
        <progress aria-label="Compression progress" value={progress} max={100} className="w-full accent-cyan-600" />
      </div>}
      {size > 0 && <p className="text-sm theme-title">Result: {formatBytes(size)} ({Math.max(0, (1 - size / file.size) * 100).toFixed(1)}% smaller)</p>}
      <div className="grid gap-3 sm:grid-cols-3">{(['low', 'medium', 'high'] as const).map(level => <button key={level} disabled={busy || targetBusy} onClick={() => compress(level)} className="rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{level === 'low' ? 'Better Quality' : level === 'medium' ? 'Balanced' : 'Smaller Size'}</button>)}</div>
    </div>}
    {file && !busy && <TargetPdfCompression key={selection} file={file} onBusyChange={setTargetBusy} />}
    {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">{error}</p>}
  </div>;
}
