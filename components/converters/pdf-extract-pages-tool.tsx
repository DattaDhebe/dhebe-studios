'use client';

import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { formatPageSummary, parsePageSelection } from '@/lib/pdf-page-selection';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { isPdfFile } from '@/lib/download';

export function PdfExtractPagesTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageInput, setPageInput] = useState<string>('1');
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selection = useRef(0);

  const handleFileSelect = async (selectedFile: File) => {
    const version = ++selection.current;
    setFile(null);
    setTotalPages(0);
    setSelectedPages([]);
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
      setSelectedPages([1]);
      setError('');
    } catch {
      if (version === selection.current) setError('Failed to load PDF file');
    }
  };

  const handleInput = (value: string) => {
    setPageInput(value);
    if (!totalPages) return;
    try {
      setSelectedPages(parsePageSelection(value, totalPages));
      setError('');
    } catch (err) {
      setSelectedPages([]);
      setError(err instanceof Error ? err.message : 'Invalid page selection');
    }
  };

  const handleExtract = async () => {
    if (!file) return;
    let pages: number[] = [];
    try {
      pages = parsePageSelection(pageInput, totalPages);
      setSelectedPages(pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid page selection');
      return;
    }

    setProcessing(true);
    setError('');
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const out = await PDFDocument.create();
      const copied = await out.copyPages(src, pages.map((p) => p - 1));
      copied.forEach((p) => out.addPage(p));
      const bytes = await out.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `extracted-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extract failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfDropZone inputRef={fileInputRef} onSelect={(f) => f instanceof File && handleFileSelect(f)} title="Drop your PDF here" />
      {file && totalPages > 0 && (
        <div className="theme-card space-y-4 rounded-2xl border p-6">
          <div>
            <p className="text-sm font-semibold theme-title">Selected File</p>
            <p className="mt-2 text-base theme-muted">{file.name}</p>
            <p className="mt-1 text-sm theme-muted">Total Pages: {totalPages}</p>
          </div>
          <div className="border-t pt-4">
            <label className="mb-2 block text-sm font-semibold theme-title">Pages to extract</label>
            <input value={pageInput} onChange={(e) => handleInput(e.target.value)} className="theme-card w-full rounded-lg border px-4 py-2 theme-title" placeholder="Example: 1,3-5" />
            <p className="mt-2 text-xs theme-muted-2">Use commas and ranges.</p>
          </div>
          <div className="rounded-xl border p-4 theme-card-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">Extracting</p>
            <p className="mt-2 text-sm theme-title">{formatPageSummary(selectedPages)}</p>
          </div>
          <div className="flex gap-3 border-t pt-4">
            <button onClick={handleExtract} disabled={processing || selectedPages.length === 0} className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
              {processing ? 'Extracting...' : 'Extract Pages'}
            </button>
          </div>
        </div>
      )}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-900">{error}</div>}
    </div>
  );
}
