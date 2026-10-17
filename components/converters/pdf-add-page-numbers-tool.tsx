'use client';

import { useRef, useState } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { isPdfFile } from '@/lib/download';

export function PdfAddPageNumbersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(null);
    if (!isPdfFile(selectedFile)) {
      setError('Please select a valid PDF file');
      return;
    }
    setFile(selectedFile);
    setError('');
  };

  const handleAddNumbers = async () => {
    if (!file) return;
    setProcessing(true);
    setError('');
    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const pages = pdfDoc.getPages();
      pages.forEach((page, index) => {
        const { width } = page.getSize();
        page.drawText(`${index + 1}`, {
          x: width / 2 - 4,
          y: 20,
          size: 11,
          color: rgb(0.25, 0.25, 0.25),
        });
      });
      const bytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `numbered-${file.name}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add page numbers');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfDropZone inputRef={fileInputRef} onSelect={(f) => f instanceof File && handleFileSelect(f)} title="Drop your PDF here" />
      {file && (
        <div className="theme-card rounded-2xl border p-6 space-y-4">
          <p className="text-sm theme-muted">Selected: {file.name}</p>
          <button onClick={handleAddNumbers} disabled={processing} className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white disabled:opacity-50">
            {processing ? 'Processing...' : 'Add Page Numbers'}
          </button>
        </div>
      )}
      {error && <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-900">{error}</div>}
    </div>
  );
}
