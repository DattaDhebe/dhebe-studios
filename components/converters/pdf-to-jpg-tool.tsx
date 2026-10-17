'use client';

import { useRef, useState } from 'react';
import { zipSync } from 'fflate';
import { PdfDropZone } from './pdf-drop-zone';
import { loadPdf } from '@/lib/pdfjs';
import { downloadBlob, isPdfFile } from '@/lib/download';

export function PdfToJpgTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const ref = useRef<HTMLInputElement>(null);
  const running = useRef(false);
  const convert = async () => {
    if (!file || running.current) return;
    running.current = true;
    setBusy(true);
    setError('');
    let task: Awaited<ReturnType<typeof loadPdf>> | undefined;
    try {
      task = await loadPdf(await file.arrayBuffer());
      const pdf = await task.promise;
      const images: Record<string, Uint8Array> = {};
      const name = file.name.replace(/\.pdf$/i, '');
      let totalBytes = 0;
      for (let number = 1; number <= pdf.numPages; number++) {
        setStatus('Rendering page ' + number + ' of ' + pdf.numPages);
        const page = await pdf.getPage(number);
        const physical = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: Math.min(1.8, 4096 / Math.max(physical.width, physical.height)) });
        const canvas = document.createElement('canvas');
        try {
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Canvas is unavailable.');
          await page.render({ canvas, canvasContext: context, viewport }).promise;
          const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.92));
          if (!blob) throw new Error('Unable to export a page as JPG.');
          totalBytes += blob.size;
          if (totalBytes > 150 * 1024 * 1024) throw new Error('This export is too large for the browser. Split the PDF and export smaller groups.');
          images[name + '-page-' + number + '.jpg'] = new Uint8Array(await blob.arrayBuffer());
        } finally {
          canvas.width = canvas.height = 0;
          page.cleanup();
        }
      }
      const entries = Object.entries(images);
      const blob = entries.length === 1 ? new Blob([new Uint8Array(entries[0][1])], { type: 'image/jpeg' }) : new Blob([new Uint8Array(zipSync(images, { level: 0 }))], { type: 'application/zip' });
      downloadBlob(blob, entries.length === 1 ? entries[0][0] : name + '-pages.zip');
      setStatus('Export downloaded.');
    } catch (err) { setError(err instanceof Error ? err.message : 'Conversion failed.'); setStatus(''); }
    finally { await task?.destroy().catch(() => {}); running.current = false; setBusy(false); }
  };

  return <div className="space-y-6">
    <PdfDropZone inputRef={ref} disabled={busy} title="Drop your PDF here" onSelect={selected => {
      if (!(selected instanceof File) || busy) return;
      setFile(isPdfFile(selected) ? selected : null);
      setError(isPdfFile(selected) ? '' : 'Please select a PDF file.');
      setStatus('');
    }} />
    {file && <button onClick={convert} disabled={busy} className="w-full rounded-lg bg-cyan-600 p-3 font-semibold text-white disabled:opacity-50">{busy ? 'Converting...' : 'Convert PDF to JPG'}</button>}
    <p className="text-sm theme-muted">Multiple pages download together in a ZIP archive.</p>
    {status && <p role="status" className="text-sm theme-title">{status}</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-900">{error}</p>}
  </div>;
}
