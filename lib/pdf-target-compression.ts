import { PDFDocument } from 'pdf-lib';
import { loadPdf } from './pdfjs';

export async function compressPdfToTarget(file: File, target: number, mode: 'preserve' | 'flatten', signal: AbortSignal, progress: (message: string) => void) {
  if (file.size > 25_000_000) throw new Error('Choose a PDF below 25 MB.');
  if (!Number.isFinite(target) || target < 10_000 || target > 10_000_000) throw new Error('Choose a target from 10 to 10,000 KB.');
  const original = await file.arrayBuffer(); signal.throwIfAborted();
  const editable = await PDFDocument.load(original.slice(0));
  const pageCount = editable.getPageCount();
  if (pageCount > 150) throw new Error('Choose a PDF with at most 150 pages.');
  if (file.size <= target) return { blob: file as Blob, reached: true, original: true };
  let best = file as Blob;
  if (mode === 'preserve') {
    progress('Repacking PDF objects without rendering pages...');
    const bytes = await editable.save({ useObjectStreams: true }); signal.throwIfAborted();
    if (bytes.byteLength < file.size) best = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  } else {
    if (pageCount > 50) throw new Error('Target-size scan compression is limited to 50 pages. Split the document or use structure-preserving mode.');
    const task = await loadPdf(original.slice(0));
    const abort = () => { void task.destroy().catch(() => {}); };
    signal.addEventListener('abort', abort, { once: true });
    try {
      const source = await task.promise;
      for (const [attempt, settings] of [{ scale: 1.2, quality: 0.65 }, { scale: 0.9, quality: 0.4 }, { scale: 0.6, quality: 0.2 }].entries()) {
        const output = await PDFDocument.create();
        for (let number = 1; number <= source.numPages; number++) {
          signal.throwIfAborted(); progress(`Attempt ${attempt + 1} of 3: page ${number} of ${source.numPages}`);
          const page = await source.getPage(number); const physical = page.getViewport({ scale: 1 });
          const viewport = page.getViewport({ scale: Math.min(settings.scale, 3000 / Math.max(physical.width, physical.height)) });
          const canvas = document.createElement('canvas'); canvas.width = Math.max(1, Math.ceil(viewport.width)); canvas.height = Math.max(1, Math.ceil(viewport.height));
          try {
            const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas is unavailable.');
            await page.render({ canvas, canvasContext: context, viewport, background: 'rgb(255,255,255)' }).promise;
            const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', settings.quality));
            signal.throwIfAborted(); if (!blob) throw new Error('Page compression failed.');
            const image = await output.embedJpg(await blob.arrayBuffer());
            output.addPage([physical.width, physical.height]).drawImage(image, { x: 0, y: 0, width: physical.width, height: physical.height });
          } finally { canvas.width = canvas.height = 0; page.cleanup(); }
          await new Promise(resolve => setTimeout(resolve, 0));
        }
        const bytes = await output.save({ useObjectStreams: true }); signal.throwIfAborted();
        if (bytes.byteLength < best.size) best = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
        if (best.size <= target) break;
      }
    } finally { signal.removeEventListener('abort', abort); await task.destroy().catch(() => {}); }
  }
  return { blob: best, reached: best.size <= target, original: best === file };
}
