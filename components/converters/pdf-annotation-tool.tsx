'use client';
import { downloadBlob } from '@/lib/download';

import { useState, useRef } from 'react';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';

export function PdfAnnotationTool() {
  const [file, setFile] = useState<File | null>(null);
  const [annotatingError, setAnnotatingError] = useState<string>('');
  const [annotationText, setAnnotationText] = useState<string>('');
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [annotating, setAnnotating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (selectedFile: File) => {
    if (selectedFile.type !== 'application/pdf') {
      setAnnotatingError('Please select a valid PDF file');
      return;
    }

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPageCount();

      setFile(selectedFile);
      setTotalPages(pages);
      setSelectedPage(1);
      setAnnotatingError('');
    } catch (err) {
      setAnnotatingError('Failed to load PDF file');
    }
  };

  const handleAnnotate = async () => {
    if (!file || !annotationText) {
      setAnnotatingError('Please enter annotation text');
      return;
    }

    if (selectedPage < 1 || selectedPage > totalPages) {
      setAnnotatingError(`Please select a valid page (1 - ${totalPages})`);
      return;
    }

    setAnnotating(true);
    setAnnotatingError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const page = pages[selectedPage - 1];

      if (!page) throw new Error('Page not found');

      const { height } = page.getSize();

      // Add annotation as text at the bottom of the page
      page.drawText(annotationText, {
        x: 50,
        y: height - 100,
        size: 12,
        color: rgb(1, 0, 0),
      });

      const annotatedPdf = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(annotatedPdf)], { type: 'application/pdf' });
      downloadBlob(blob, `annotated-${file.name}`);

      setAnnotationText('');
    } catch (err) {
      setAnnotatingError(err instanceof Error ? err.message : 'Annotation failed');
    } finally {
      setAnnotating(false);
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
                Select Page (1 - {totalPages})
              </label>
              <input
                type="number"
                min="1"
                max={totalPages}
                value={selectedPage}
                onChange={(e) => setSelectedPage(parseInt(e.target.value) || 1)}
                className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold theme-title">
                Annotation Text
              </label>
              <textarea
                value={annotationText}
                onChange={(e) => setAnnotationText(e.target.value)}
                className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your annotation text"
                rows={4}
              />
            </div>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleAnnotate}
              disabled={annotating}
              className="flex-1 rounded-lg bg-rose-600 px-4 py-3 font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {annotating ? 'Adding Annotation...' : 'Add Annotation'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setAnnotationText('');
                setTotalPages(0);
              }}
              className="theme-card rounded-lg px-4 py-3 font-semibold theme-title transition hover:brightness-95"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {annotatingError && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm font-semibold text-red-900">{annotatingError}</p>
        </div>
      )}
    </div>
  );
}
