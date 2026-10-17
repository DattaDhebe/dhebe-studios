'use client';

import { useRef, useState } from 'react';
import { createWorker } from 'tesseract.js';
import { PDFDocument } from 'pdf-lib';
import { PdfDropZone } from './pdf-drop-zone';
import { loadPdf } from '@/lib/pdfjs';
import { downloadBlob, isPdfFile } from '@/lib/download';

export function PdfOcrTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const running = useRef(false);

  const recognize = async () => {
    if (!file || running.current) return;
    running.current = true;
    setBusy(true);
    setText('');
    setError('');
    let worker: Awaited<ReturnType<typeof createWorker>> | undefined;
    let task: Awaited<ReturnType<typeof loadPdf>> | undefined;
    try {
      setStatus('Loading PDF and English OCR model...');
      task = await loadPdf(await file.arrayBuffer());
      const source = await task.promise;
      worker = await createWorker('eng');
      const output = await PDFDocument.create();
      const texts: string[] = [];
      for (let number = 1; number <= source.numPages; number++) {
        setStatus('Recognizing page ' + number + ' of ' + source.numPages);
        const page = await source.getPage(number);
        const physical = page.getViewport({ scale: 1 });
        const scale = Math.min(2, 4096 / Math.max(physical.width, physical.height));
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        try {
          canvas.width = Math.ceil(viewport.width);
          canvas.height = Math.ceil(viewport.height);
          const context = canvas.getContext('2d');
          if (!context) throw new Error('Unable to create an OCR canvas.');
          await page.render({ canvas, canvasContext: context, viewport }).promise;
          const result = await worker.recognize(canvas, {}, { pdf: true, text: true });
          if (!result.data.pdf) throw new Error('OCR could not create a searchable page.');
          const [embedded] = await output.embedPdf(new Uint8Array(result.data.pdf));
          output.addPage([physical.width, physical.height]).drawPage(embedded, { width: physical.width, height: physical.height });
          texts.push('Page ' + number + '\n' + result.data.text.trim());
        } finally {
          canvas.width = canvas.height = 0;
          page.cleanup();
        }
      }
      setText(texts.join('\n\n'));
      downloadBlob(new Blob([new Uint8Array(await output.save())], { type: 'application/pdf' }), 'searchable-' + file.name);
      setStatus('Searchable PDF downloaded.');
    } catch (err) {
      setStatus('');
      setError(err instanceof Error ? err.message : 'OCR failed.');
    } finally {
      await worker?.terminate().catch(() => {});
      await task?.destroy().catch(() => {});
      running.current = false;
      setBusy(false);
    }
  };

  return <div className="space-y-5">
    <PdfDropZone inputRef={inputRef} disabled={busy} title="Drop your PDF here" onSelect={selected => {
      if (!(selected instanceof File) || running.current) return;
      setFile(isPdfFile(selected) ? selected : null);
      setError(isPdfFile(selected) ? '' : 'Please select a PDF file.');
      setText('');
      setStatus('');
    }} />
    <p className="text-sm theme-muted">Recognizes English text on every page and creates a searchable PDF. The OCR model downloads on first use; your document stays on your device.</p>
    {file && <button onClick={recognize} disabled={busy} className="w-full rounded-lg bg-amber-600 p-3 font-semibold text-white disabled:opacity-50">{busy ? 'Recognizing...' : 'Create Searchable PDF'}</button>}
    {status && <p role="status" className="text-sm theme-title">{status}</p>}
    {text && <div className="space-y-3"><pre className="theme-card max-h-80 overflow-auto whitespace-pre-wrap rounded-lg border p-4 text-sm">{text}</pre><button className="text-sm font-semibold theme-title" onClick={() => downloadBlob(new Blob([text], { type: 'text/plain;charset=utf-8' }), 'ocr-text.txt')}>Download Recognized Text</button></div>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-900">{error}</p>}
  </div>;
}
