'use client';

import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { formatPageSummary, parsePageSelection } from '@/lib/pdf-page-selection';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { isPdfFile } from '@/lib/download';

export function PdfRemovePagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageInput, setPageInput] = useState<string>('1');
  const [pagesToRemove, setPagesToRemove] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selection = useRef(0);

  const handleFileSelect = async (selectedFile: File) => {
    const version = ++selection.current;
    setFile(null);
    setTotalPages(0);
    setPagesToRemove([]);
    setError('');
    if (!isPdfFile(selectedFile)) {
      setError('Please select a valid PDF file');
      return;
    }

    try {
      const pdfDoc = await PDFDocument.load(await selectedFile.arrayBuffer());
      const pages = pdfDoc.getPageCount();
      if (version !== selection.current) return;

      setFile(selectedFile);
      setTotalPages(pages);
      setPageInput('1');
      setPagesToRemove([1]);
      setError('');
    } catch {
      if (version === selection.current) setError('Failed to load PDF file');
    }
  };

  const handlePageInputChange = (value: string) => {
    setPageInput(value);

    if (!totalPages) return;

    try {
      const parsedPages = parsePageSelection(value, totalPages);
      setPagesToRemove(parsedPages);
      setError('');
    } catch (err) {
      setPagesToRemove([]);
      setError(err instanceof Error ? err.message : 'Invalid page selection');
    }
  };

  const handleRemovePages = async () => {
    if (!file) return;

    let parsedPages: number[];
    try {
      parsedPages = parsePageSelection(pageInput, totalPages);
      if (parsedPages.length >= totalPages) {
        setError('You must leave at least one page in the PDF.');
        return;
      }
      setPagesToRemove(parsedPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid page selection');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      [...parsedPages]
        .sort((a, b) => b - a)
        .forEach((pageNumber) => {
          pdfDoc.removePage(pageNumber - 1);
        });

      const nextBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(nextBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `pages-removed-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Removing pages failed');
    } finally {
      setProcessing(false);
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
        <div className="theme-card space-y-4 rounded-2xl border p-6">
          <div>
            <p className="text-sm font-semibold theme-title">Selected File</p>
            <p className="mt-2 text-base theme-muted">{file.name}</p>
            <p className="mt-1 text-sm theme-muted">Total Pages: {totalPages}</p>
          </div>

          <div className="border-t pt-4">
            <label className="mb-2 block text-sm font-semibold theme-title">
              Pages to remove
            </label>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => handlePageInputChange(e.target.value)}
              placeholder="Example: 2, 4-6"
              className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <p className="mt-2 text-xs theme-muted-2">
              Use commas and ranges. The tool keeps all pages not listed here.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border p-4 theme-card-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">
                Removing
              </p>
              <p className="mt-2 text-sm theme-title">{formatPageSummary(pagesToRemove)}</p>
            </div>
            <div className="rounded-xl border p-4 theme-card-soft">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">
                Remaining Pages
              </p>
              <p className="mt-2 text-sm theme-title">
                {Math.max(totalPages - pagesToRemove.length, 0)} page(s)
              </p>
            </div>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleRemovePages}
              disabled={processing || pagesToRemove.length === 0}
              className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {processing ? 'Updating PDF...' : 'Remove Pages'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setTotalPages(0);
                setPageInput('1');
                setPagesToRemove([]);
                setError('');
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
