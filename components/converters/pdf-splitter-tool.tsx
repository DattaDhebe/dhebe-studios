'use client';

import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { downloadBlob, isPdfFile } from '@/lib/download';

export function PdfSplitterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [startPage, setStartPage] = useState<string>('1');
  const [endPage, setEndPage] = useState<string>('1');
  const [splitting, setSplitting] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selection = useRef(0);

  const handleFileSelect = async (selectedFile: File) => {
    const version = ++selection.current;
    setFile(null);
    setTotalPages(0);
    setError('');
    if (!isPdfFile(selectedFile)) {
      setError('Please select a valid PDF file');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPageCount();
      if (version !== selection.current) return;

      setFile(selectedFile);
      setTotalPages(pages);
      setStartPage('1');
      setEndPage(String(pages));
      setError('');
    } catch (err) {
      if (version === selection.current) setError('Failed to load PDF file');
    }
  };

  const handleSplit = async () => {
    if (!file) return;

    const start = Number(startPage);
    const end = Number(endPage);

    if (!Number.isInteger(start) || !Number.isInteger(end) || start < 1 || end > totalPages || start > end) {
      setError(`Please enter valid page range (1 - ${totalPages})`);
      return;
    }

    setSplitting(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const sourceDoc = await PDFDocument.load(arrayBuffer);
      const newDoc = await PDFDocument.create();

      const pagesToExtract = [];
      for (let i = start - 1; i < end; i++) {
        pagesToExtract.push(i);
      }

      const copiedPages = await newDoc.copyPages(sourceDoc, pagesToExtract);
      copiedPages.forEach((page) => newDoc.addPage(page));

      const newPdfBytes = await newDoc.save();
      const blob = new Blob([new Uint8Array(newPdfBytes)], { type: 'application/pdf' });
      downloadBlob(blob, `extracted-pages-${start}-${end}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Split failed');
    } finally {
      setSplitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfDropZone
        inputRef={fileInputRef}
        onSelect={(selected) => selected instanceof File && handleFileSelect(selected)}
        title="Drop your PDF here"
      />

      {file && totalPages > 0 && (
        <div className="theme-card rounded-2xl border p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold theme-title">Selected File</p>
            <p className="mt-2 text-base theme-muted">{file.name}</p>
            <p className="mt-1 text-sm theme-muted">Total Pages: {totalPages}</p>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold theme-title">
                Start Page (1 - {totalPages})
              </label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={startPage}
                onChange={(e) => setStartPage(e.target.value)}
                className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold theme-title">
                End Page (1 - {totalPages})
              </label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={endPage}
                onChange={(e) => setEndPage(e.target.value)}
                className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleSplit}
              disabled={splitting}
              className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {splitting ? 'Splitting...' : 'Extract Pages'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setTotalPages(0);
              }}
              className="theme-card rounded-lg px-4 py-3 font-semibold theme-title transition hover:brightness-95"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-semibold text-red-900">{error}</p>
        </div>
      )}
    </div>
  );
}
