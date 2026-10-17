'use client';

import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import type { PageViewport } from 'pdfjs-dist';
import { PdfDropZone } from './pdf-drop-zone';
import { loadPdf } from '@/lib/pdfjs';
import { downloadBlob, isPdfFile } from '@/lib/download';

interface Mark { id: string; page: number; x: number; y: number; text: string }

async function buildEditedPdf(file: File, marks: Mark[]) {
  const pdf = await PDFDocument.load(await file.arrayBuffer());
  for (const mark of marks) {
    pdf.getPage(mark.page - 1).drawText(mark.text, { x: mark.x, y: mark.y, size: 14, color: rgb(0, 0, 0) });
  }
  return pdf.save();
}

export function PdfEditTool() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('Sample text');
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [marks, setMarks] = useState<Mark[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [rendering, setRendering] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewportRef = useRef<PageViewport | null>(null);
  const selection = useRef(0);

  const select = async (selected: File) => {
    const version = ++selection.current;
    setFile(null);
    setMarks([]);
    setError('');
    if (!isPdfFile(selected)) return setError('Please select a PDF file.');
    try {
      const pdf = await PDFDocument.load(await selected.arrayBuffer());
      if (version !== selection.current) return;
      setCount(pdf.getPageCount());
      setPage(1);
      setFile(selected);
    } catch {
      if (version === selection.current) setError('Unable to read PDF. Check that it is unlocked and opens correctly.');
    }
  };

  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    let task: Awaited<ReturnType<typeof loadPdf>> | undefined;
    viewportRef.current = null;
    setRendering(true);
    const timer = setTimeout(async () => {
      try {
        const bytes = await buildEditedPdf(file, marks);
        if (cancelled) return;
        task = await loadPdf(bytes);
        const pdf = await task.promise;
        const pdfPage = await pdf.getPage(page);
        const viewport = pdfPage.getViewport({ scale: 1.4 });
        // Render offscreen so an obsolete task cannot overwrite the current page.
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Canvas is unavailable.');
        await pdfPage.render({ canvas, canvasContext: context, viewport }).promise;
        if (cancelled || !canvasRef.current) return;
        const visible = canvasRef.current;
        visible.width = canvas.width;
        visible.height = canvas.height;
        visible.getContext('2d')?.drawImage(canvas, 0, 0);
        viewportRef.current = viewport;
        setError('');
        setRendering(false);
        canvas.width = canvas.height = 0;
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Preview failed.');
          setRendering(false);
        }
      } finally {
        await task?.destroy().catch(() => {});
      }
    }, 150);
    return () => { cancelled = true; clearTimeout(timer); void task?.destroy().catch(() => {}); };
  }, [file, marks, page]);

  const place = (event: MouseEvent<HTMLCanvasElement>) => {
    const viewport = viewportRef.current;
    if (!viewport || rendering || !text.trim()) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const [x, y] = viewport.convertToPdfPoint((event.clientX - rect.left) * viewport.width / rect.width, (event.clientY - rect.top) * viewport.height / rect.height);
    setMarks(current => [...current, { id: crypto.randomUUID(), page, x, y, text: text.trim() }]);
  };

  const download = async () => {
    if (!file) return;
    setBusy(true);
    try {
      downloadBlob(new Blob([new Uint8Array(await buildEditedPdf(file, marks))], { type: 'application/pdf' }), `edited-${file.name}`);
    } catch (err) { setError(err instanceof Error ? err.message : 'Export failed.'); }
    finally { setBusy(false); }
  };

  return <div className="space-y-6">
    <PdfDropZone inputRef={inputRef} disabled={busy} onSelect={selected => selected instanceof File && select(selected)} title="Drop your PDF here" />
    {file && <div className="theme-card space-y-4 rounded-2xl border p-6">
      <p className="break-all text-sm theme-title">{file.name}</p>
      <label className="block text-sm theme-title">Page (1-{count})<input aria-label="Editor page" type="number" min={1} max={count} value={page} onChange={event => setPage(Math.min(count, Math.max(1, Number(event.target.value) || 1)))} className="theme-card mt-2 w-full rounded-lg border p-3" /></label>
      <label className="block text-sm theme-title">Text to add<input aria-label="Text to add" value={text} onChange={event => setText(event.target.value)} className="theme-card mt-2 w-full rounded-lg border p-3" /></label>
      <p className="text-sm theme-muted">Click the page to add text. This adds text over the existing document.</p>
      {rendering && <p role="status" className="text-sm theme-muted">Updating page preview...</p>}
      <canvas ref={canvasRef} onClick={place} aria-label="PDF page preview" className="mx-auto h-auto w-full cursor-crosshair border bg-white" />
      <div className="flex flex-wrap gap-3">
        <button disabled={!marks.length} onClick={() => setMarks(current => current.slice(0, -1))} className="theme-card rounded-lg border p-3 disabled:opacity-50">Undo Last Text</button>
        <button disabled={busy || rendering} onClick={download} className="rounded-lg bg-cyan-600 p-3 font-semibold text-white disabled:opacity-50">{busy ? 'Preparing...' : 'Download Edited PDF'}</button>
      </div>
    </div>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-900">{error}</p>}
  </div>;
}
