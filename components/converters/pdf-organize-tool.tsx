'use client';

import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { isPdfFile } from '@/lib/download';

interface PageOrder {
  originalIndex: number;
  displayIndex: number;
}

export function PdfOrganizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageOrder, setPageOrder] = useState<PageOrder[]>([]);
  const [organizing, setOrganizing] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selection = useRef(0);

  const handleFileSelect = async (selectedFile: File) => {
    const version = ++selection.current;
    setFile(null);
    setTotalPages(0);
    setPageOrder([]);
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

      const order: PageOrder[] = [];
      for (let i = 0; i < pages; i += 1) {
        order.push({ originalIndex: i, displayIndex: i + 1 });
      }
      setPageOrder(order);
      setError('');
    } catch {
      if (version === selection.current) setError('Failed to load PDF file');
    }
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newOrder = [...pageOrder];
    [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
    setPageOrder(newOrder);
  };

  const handleMoveDown = (index: number) => {
    if (index === pageOrder.length - 1) return;
    const newOrder = [...pageOrder];
    [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
    setPageOrder(newOrder);
  };

  const handleOrganize = async () => {
    if (!file || pageOrder.length === 0) return;

    setOrganizing(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      for (const item of pageOrder) {
        const [copiedPage] = await newPdf.copyPages(pdfDoc, [item.originalIndex]);
        newPdf.addPage(copiedPage);
      }

      const organizedBytes = await newPdf.save();
      const blob = new Blob([new Uint8Array(organizedBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `organized-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Organization failed');
    } finally {
      setOrganizing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfDropZone
        inputRef={fileInputRef}
        onSelect={(selected) => selected instanceof File && handleFileSelect(selected)}
        title="Drop your PDF here"
      />

      {file && pageOrder.length > 0 && (
        <div className="theme-card rounded-2xl border p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold theme-title">Selected File</p>
            <p className="mt-2 text-base theme-muted">{file.name}</p>
            <p className="mt-1 text-sm theme-muted">Total Pages: {totalPages}</p>
          </div>

          <div className="border-t pt-4">
            <p className="mb-3 text-sm font-semibold theme-title">Reorder Pages</p>
            <div className="max-h-[400px] space-y-2 overflow-y-auto">
              {pageOrder.map((item, index) => (
                <div
                  key={`${item.originalIndex}-${index}`}
                  className="theme-card-soft flex items-center justify-between rounded-lg p-3"
                >
                  <span className="theme-card rounded px-2 py-1 text-xs font-bold theme-title">
                    Page {item.displayIndex}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMoveUp(index)}
                      disabled={index === 0}
                      className="theme-card rounded px-2 py-1 text-xs transition hover:brightness-95 disabled:opacity-50"
                    >
                      Up
                    </button>
                    <button
                      onClick={() => handleMoveDown(index)}
                      disabled={index === pageOrder.length - 1}
                      className="theme-card rounded px-2 py-1 text-xs transition hover:brightness-95 disabled:opacity-50"
                    >
                      Down
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleOrganize}
              disabled={organizing}
              className="flex-1 rounded-lg bg-violet-600 px-4 py-3 font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
            >
              {organizing ? 'Organizing...' : 'Save Organized PDF'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setPageOrder([]);
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
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-900">{error}</p>
        </div>
      )}
    </div>
  );
}
