'use client';
import { downloadBlob } from '@/lib/download';

import { useRef, useState } from 'react';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { getPdfJs } from '@/lib/pdfjs';

function escapeHtml(value: string) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

export function PdfToWordTool() {
  const [file, setFile] = useState<File | null>(null);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState<string>('');
  const [pageCount, setPageCount] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a valid PDF file.');
      return;
    }

    try {
      const buffer = await selectedFile.arrayBuffer();
      const { getDocument } = await getPdfJs();
      const loadingTask = getDocument({ data: buffer } as never);
      const pdf = await loadingTask.promise;
      setPageCount(pdf.numPages);
      await loadingTask.destroy();
      setFile(selectedFile);
      setError('');
    } catch {
      setError('Failed to read PDF. The file may be corrupted or password-protected.');
    }
  };

  const handleConvert = async () => {
    if (!file) return;

    setConverting(true);
    setError('');

    try {
      const buffer = await file.arrayBuffer();
      const { getDocument } = await getPdfJs();
      const loadingTask = getDocument({ data: buffer } as never);
      const pdf = await loadingTask.promise;

      const pages: string[] = [];
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const text = textContent.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ')
          .replace(/\s+/g, ' ')
          .trim();

        pages.push(`<h2>Page ${pageNumber}</h2><p>${escapeHtml(text) || '[No selectable text found on this page]'}</p>`);
      }

      const htmlDoc = `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>${escapeHtml(file.name)}</title>
  <style>
    body { font-family: Calibri, Arial, sans-serif; margin: 24px; line-height: 1.5; }
    h1 { font-size: 20px; margin-bottom: 12px; }
    h2 { font-size: 15px; margin-top: 20px; margin-bottom: 8px; }
    p { margin: 0 0 12px 0; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>Converted from PDF: ${escapeHtml(file.name)}</h1>
  ${pages.join('\n')}
</body>
</html>`;

      await loadingTask.destroy();
      const outName = `${file.name.replace(/\.pdf$/i, '')}.html`;
      const blob = new Blob([htmlDoc], { type: 'text/html;charset=utf-8' });
      downloadBlob(blob, outName);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      setConverting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfDropZone
        inputRef={fileInputRef}
        onSelect={(selected) => selected instanceof File && handleFileSelect(selected)}
        title="Drop your PDF here"
      />

      {file && (
        <div className="theme-card rounded-2xl border p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold theme-title">Selected File</p>
            <p className="mt-2 text-base theme-muted">{file.name}</p>
            <p className="mt-1 text-sm theme-muted">Pages: {pageCount}</p>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <p className="text-sm text-blue-900">
              Exports selectable text as a Word-readable HTML file. Native DOCX conversion requires the conversion service. Scanned pages need OCR first.
            </p>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleConvert}
              disabled={converting}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {converting ? 'Converting...' : 'Download Word-readable HTML'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setPageCount(0);
              }}
              className="theme-card rounded-lg px-4 py-3 font-semibold theme-title transition hover:brightness-95"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">{error}</p>
        </div>
      )}
    </div>
  );
}
