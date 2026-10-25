'use client';

import { useRef, useState } from 'react';
import { PdfDropZone } from './pdf-drop-zone';
import { ServerRequiredTool } from './server-required-tool';
import { PdfToJpgTool } from './pdf-to-jpg-tool';
import { PdfToPngTool } from './pdf-to-png-tool';
import { PdfToWordTool } from './pdf-to-word-tool';
import { loadPdf } from '@/lib/pdfjs';
import { downloadBlob, isPdfFile } from '@/lib/download';

export function PdfExporterTool({ mode }: { mode: 'repair' | 'convert-from-pdf' | 'pdf-to-powerpoint' | 'pdf-to-excel' | 'pdf-to-pdfa' }) {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState('text');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  const extract = async () => {
    if (!file || busy) return;
    setBusy(true);
    setError('');
    let task: Awaited<ReturnType<typeof loadPdf>> | undefined;
    try {
      task = await loadPdf(await file.arrayBuffer());
      const pdf = await task.promise;
      const pages: string[] = [];
      for (let number = 1; number <= pdf.numPages; number++) {
        const page = await pdf.getPage(number);
        const content = await page.getTextContent();
        pages.push(content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join(''));
        page.cleanup();
      }
      if (!pages.some(page => page.trim())) throw new Error('No selectable text found. Use OCR for scanned pages.');
      downloadBlob(new Blob([pages.join('\n\n')], { type: 'text/plain;charset=utf-8' }), file.name.replace(/\.pdf$/i, '') + '.txt');
    } catch (err) { setError(err instanceof Error ? err.message : 'Extraction failed.'); }
    finally { await task?.destroy().catch(() => {}); setBusy(false); }
  };

  if (mode !== 'convert-from-pdf') return <ServerRequiredTool />;
  return <div className="space-y-5">
    <label className="block text-sm theme-title">Export format<select aria-label="Export format" value={format} onChange={event => setFormat(event.target.value)} className="theme-card mt-2 block w-full rounded-lg border p-3"><option value="text">Text (.txt)</option><option value="jpg">JPG pages</option><option value="png">PNG pages</option><option value="word">Word-readable HTML</option></select></label>
    {format === 'jpg' ? <PdfToJpgTool /> : format === 'png' ? <PdfToPngTool /> : format === 'word' ? <PdfToWordTool /> : <>
      <PdfDropZone inputRef={ref} disabled={busy} onSelect={selected => { if (selected instanceof File) { setFile(isPdfFile(selected) ? selected : null); setError(isPdfFile(selected) ? '' : 'Please select a PDF file.'); } }} title="Drop your PDF here" />
      {file && <button onClick={extract} disabled={busy} className="w-full rounded-lg bg-cyan-600 p-3 font-semibold text-white disabled:opacity-50">{busy ? 'Extracting...' : 'Download Text'}</button>}
    </>}
    {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
  </div>;
}
