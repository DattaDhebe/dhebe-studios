'use client';

import { useEffect, useRef, useState } from 'react';
import { zipSync } from 'fflate';
import { PdfDropZone } from './pdf-drop-zone';
import { loadPdf } from '@/lib/pdfjs';
import { downloadBlob, isPdfFile } from '@/lib/download';
import { parsePageSelection } from '@/lib/pdf-page-selection';
import { PDF_IMAGE_LIMITS, pdfImageBasename, pdfImageScale } from '@/lib/pdf-image-export';
import { runToolOperation } from '@/lib/tool-operation';

interface ImageExportOperation {
  cancelled: boolean;
  task?: Awaited<ReturnType<typeof loadPdf>>;
  render?: { cancel: () => void };
}

export function PdfToImageTool({ format }: { format: 'jpg' | 'png' }) {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState('');
  const [dpi, setDpi] = useState(144);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const operation = useRef<ImageExportOperation | null>(null);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (operation.current) {
        operation.current.cancelled = true;
        operation.current.render?.cancel();
        void operation.current.task?.destroy().catch(() => {});
      }
    };
  }, []);
  const label = format.toUpperCase();
  const convert = async () => {
    if (!file || operation.current) return;
    const current: ImageExportOperation = { cancelled: false };
    operation.current = current;
    const check = () => { if (current.cancelled || !mounted.current) throw new DOMException('Conversion cancelled.', 'AbortError'); };
    setBusy(true); setError(''); setStatus('Loading PDF...');
    try {
      await runToolOperation('pdf-to-' + format, async () => {
        const data = await file.arrayBuffer(); check();
        current.task = await loadPdf(data);
        const pending = current.task.promise;
        // Cancellation can happen while PDF.js is being imported.
        void pending.catch(() => {});
        check();
        const pdf = await pending; check();
        if (pdf.numPages > PDF_IMAGE_LIMITS.documentPages) throw new Error('Use a PDF with 150 pages or fewer. Split a larger document first.');
        const selected = parsePageSelection(pages.trim() || `1-${pdf.numPages}`, pdf.numPages);
        if (selected.length > PDF_IMAGE_LIMITS.outputPages) throw new Error('Export up to 50 pages at a time. Enter a smaller page range.');
        const images: Record<string, Uint8Array> = {};
        const name = pdfImageBasename(file.name);
        const mime = format === 'png' ? 'image/png' : 'image/jpeg';
        let totalBytes = 0;
        for (const number of selected) {
          check(); setStatus(`Rendering page ${number} (${Object.keys(images).length + 1} of ${selected.length})...`);
          const page = await pdf.getPage(number);
          const canvas = document.createElement('canvas');
          try {
            check();
            const physical = page.getViewport({ scale: 1 });
            const viewport = page.getViewport({ scale: pdfImageScale(physical.width, physical.height, dpi) });
            canvas.width = Math.max(1, Math.floor(viewport.width));
            canvas.height = Math.max(1, Math.floor(viewport.height));
            const context = canvas.getContext('2d');
            if (!context) throw new Error('Canvas is unavailable.');
            const render = page.render({ canvas, canvasContext: context, viewport, background: '#ffffff' });
            current.render = render;
            await render.promise; check();
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, mime, 0.92)); check();
            if (!blob || blob.type !== mime) throw new Error(`This browser could not export ${label}.`);
            totalBytes += blob.size;
            if (totalBytes > PDF_IMAGE_LIMITS.outputBytes) throw new Error('Output exceeds 50 MB. Choose fewer pages or a lower resolution.');
            images[`${name}-page-${number}.${format}`] = new Uint8Array(await blob.arrayBuffer());
          } finally {
            current.render = undefined;
            canvas.width = canvas.height = 0;
            page.cleanup();
          }
        }
        check();
        const entries = Object.entries(images);
        const blob = entries.length === 1
          ? new Blob([new Uint8Array(entries[0][1])], { type: mime })
          : new Blob([new Uint8Array(zipSync(images, { level: 0 }))], { type: 'application/zip' });
        check();
        downloadBlob(blob, entries.length === 1 ? entries[0][0] : name + '-pages.zip');
        setStatus('Export downloaded.');
      });
    } catch (err) {
      if (mounted.current) {
        setStatus(current.cancelled ? 'Conversion cancelled. You can try again.' : '');
        setError(current.cancelled ? '' : err instanceof Error && err.name === 'PasswordException' ? 'This PDF is password protected. Use an unlocked copy.' : err instanceof Error ? err.message : 'Conversion failed.');
      }
    } finally {
      await current.task?.destroy().catch(() => {});
      if (operation.current === current) operation.current = null;
      if (mounted.current) setBusy(false);
    }
  };
  return <div className="space-y-5">
    <PdfDropZone inputRef={input} disabled={busy} title="Drop your PDF here" helperText="PDF up to 25 MB. Files stay on your device." onSelect={selected => {
      if (!(selected instanceof File) || operation.current) return;
      const message = !isPdfFile(selected) ? 'Please select a PDF file.' : selected.size > PDF_IMAGE_LIMITS.inputBytes ? 'Choose a PDF of 25 MB or less.' : '';
      setFile(message ? null : selected); setError(message); setStatus('');
    }} />
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="text-sm theme-title">Pages (blank = all)<input value={pages} onChange={event => { setPages(event.target.value); setStatus(''); }} disabled={busy} placeholder="e.g. 1-3, 5" className="theme-card mt-2 block w-full rounded-lg border p-3" /></label>
      <label className="text-sm theme-title">Resolution<select aria-label="Resolution" value={dpi} onChange={event => { setDpi(Number(event.target.value)); setStatus(''); }} disabled={busy} className="theme-card mt-2 block w-full rounded-lg border p-3">{[72, 144, 200, 300].map(value => <option value={value} key={value}>{value} DPI</option>)}</select></label>
    </div>
    {file && <button type="button" onClick={convert} disabled={busy} className="w-full rounded-lg bg-cyan-600 p-3 font-semibold text-white disabled:opacity-50">{busy ? 'Converting...' : `Convert PDF to ${label}`}</button>}
    {busy && <button type="button" className="theme-card w-full rounded-lg border p-3" onClick={() => {
      if (operation.current) { operation.current.cancelled = true; operation.current.render?.cancel(); void operation.current.task?.destroy().catch(() => {}); }
    }}>Cancel conversion</button>}
    <p className="text-sm theme-muted">One page downloads as {label}; multiple pages download in one ZIP. Up to 50 selected pages from a PDF of 150 pages or fewer. Output is capped at 50 MB and each image at 4096 pixels per side and 8 megapixels, so large pages may use a lower effective DPI. Pages have a white background.</p>
    {status && <p role="status" className="text-sm theme-title">{status}</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-900">{error}</p>}
  </div>;
}
