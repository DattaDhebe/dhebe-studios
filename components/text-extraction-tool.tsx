'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Worker } from 'tesseract.js';
import { downloadBlob, isPdfFile } from '@/lib/download';
import { loadImage } from '@/lib/image-processing';
import { loadPdf } from '@/lib/pdfjs';
import { useUtilityTask, UtilityTaskFeedback } from './utility-task';

export function TextExtractionTool({ kind }: { kind: 'image' | 'pdf' }) {
  const [file, setFile] = useState<File | null>(null);
  const [language, setLanguage] = useState('eng');
  const [ocr, setOcr] = useState(false);
  const [edited, setEdited] = useState<string | null>(null);
  const task = useUtilityTask<string>(kind === 'image' ? 'image-to-text' : 'pdf-to-text');
  const reset = () => { task.reset(); setEdited(null); };
  const extract = () => task.run(async (signal, progress) => {
    if (!file) throw new Error('Choose a file first.');
    if (file.size > 25_000_000) throw new Error('Choose a file below 25 MB.');
    let worker: Worker | undefined;
    let document: Awaited<ReturnType<typeof loadPdf>> | undefined;
    const abort = () => { void worker?.terminate().catch(() => {}); void document?.destroy().catch(() => {}); };
    signal.addEventListener('abort', abort, { once: true });
    const recognize = async (canvas: HTMLCanvasElement) => {
      signal.throwIfAborted();
      if (!worker) {
        progress('Downloading the OCR model on first use...');
        const { createWorker } = await import('tesseract.js');
        worker = await createWorker(kind === 'pdf' ? 'eng' : language);
        if (signal.aborted) { await worker.terminate(); signal.throwIfAborted(); }
      }
      return (await worker.recognize(canvas)).data.text.trim();
    };
    try {
      if (kind === 'image') {
        const image = await loadImage(file); signal.throwIfAborted();
        const scale = Math.min(1, 4096 / Math.max(image.naturalWidth, image.naturalHeight));
        const canvas = window.document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(image.naturalWidth * scale)); canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
        try {
          const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas is unavailable.');
          context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); context.drawImage(image, 0, 0, canvas.width, canvas.height);
          const text = await recognize(canvas);
          if (!text) throw new Error('No readable text was recognized. Try a clearer image and the correct language.');
          return text;
        } finally { canvas.width = canvas.height = 0; }
      }
      if (!isPdfFile(file)) throw new Error('Choose a PDF file.');
      document = await loadPdf(await file.arrayBuffer());
      const pdf = await document.promise;
      if (pdf.numPages > 150) throw new Error('Choose a PDF with at most 150 pages.');
      const pages: string[] = [];
      let characters = 0;
      let blank = 0;
      for (let number = 1; number <= pdf.numPages; number++) {
        signal.throwIfAborted(); progress(`Reading page ${number} of ${pdf.numPages}...`);
        const page = await pdf.getPage(number);
        try {
          const content = await page.getTextContent();
          let text = content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('').trim();
          if (!text && ocr) {
            const physical = page.getViewport({ scale: 1 });
            const scale = Math.min(2, 3000 / Math.max(physical.width, physical.height));
            const viewport = page.getViewport({ scale });
            const canvas = window.document.createElement('canvas'); canvas.width = Math.ceil(viewport.width); canvas.height = Math.ceil(viewport.height);
            try {
              const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas is unavailable.');
              await page.render({ canvas, canvasContext: context, viewport, background: 'rgb(255,255,255)' }).promise;
              text = await recognize(canvas);
            } finally { canvas.width = canvas.height = 0; }
          }
          if (!text) blank++;
          characters += text.length;
          if (characters > 2_000_000) throw new Error('The extracted text exceeds 2 million characters. Split the PDF into smaller sections.');
          pages.push(`--- Page ${number} ---\n${text || '[No readable text on this page]'}`);
        } finally { page.cleanup(); }
      }
      if (blank === pdf.numPages) throw new Error(ocr ? 'No readable text was found. Try clearer scans.' : 'No selectable text was found. Enable English OCR for scanned pages.');
      return pages.join('\n\n');
    } finally {
      signal.removeEventListener('abort', abort);
      await worker?.terminate().catch(() => {}); await document?.destroy().catch(() => {});
    }
  });
  return <div className="utility-workspace">
    <label className="utility-label" htmlFor="extract-file">{kind === 'pdf' ? 'PDF document' : 'Image or screenshot'}</label><input id="extract-file" type="file" accept={kind === 'pdf' ? 'application/pdf,.pdf' : 'image/jpeg,image/png,image/webp'} onChange={event => { reset(); setFile(event.target.files?.[0] || null); }} />
    {kind === 'image' ? <><label className="utility-label" htmlFor="ocr-language">Text language</label><select id="ocr-language" value={language} onChange={event => { reset(); setLanguage(event.target.value); }}><option value="eng">English</option><option value="hin">Hindi</option><option value="mar">Marathi</option></select></> : <label className="utility-check"><input type="checkbox" checked={ocr} onChange={event => { reset(); setOcr(event.target.checked); }} />Recognize scanned pages with English OCR</label>}
    <button className="button-primary mt-6" type="button" disabled={!file || task.busy} onClick={extract}>{task.busy ? 'Extracting text...' : 'Extract text'}</button><UtilityTaskFeedback task={task} />
    {task.result !== null && <><label className="utility-label" htmlFor="extracted-text">Extracted text (editable)</label><textarea id="extracted-text" rows={14} value={edited ?? task.result} onChange={event => setEdited(event.target.value)} /><button className="utility-secondary mt-4" type="button" onClick={() => downloadBlob(new Blob([edited ?? task.result!], { type: 'text/plain;charset=utf-8' }), 'extracted-text.txt')}>Download text</button></>}
    <p className="utility-note">Files and recognized text stay on your device. OCR downloads its engine and language model on first use. Clear printed text works best; proofread important content. Maximum input: 25 MB{kind === 'pdf' ? ' / 150 pages' : ' / 40 megapixels'}. Reloading clears your result.</p>{kind === 'pdf' && <p className="utility-note">Need a searchable PDF instead? <Link href="/pdf-tools/ocr-pdf/">Open OCR PDF</Link>.</p>}
  </div>;
}
