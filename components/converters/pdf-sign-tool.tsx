'use client';

import { useState, useRef } from 'react';
import { PDFDocument, rgb } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { downloadBlob, isPdfFile } from '@/lib/download';

export function PdfSignTool() {
  const [file, setFile] = useState<File | null>(null);
  const [signatureName, setSignatureName] = useState<string>('');
  const [signatureDate, setSignatureDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [selectedPage, setSelectedPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [signing, setSigning] = useState(false);
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
      setSelectedPage(pages); // Default to last page for signature
      setError('');
    } catch (err) {
      if (version === selection.current) setError('Failed to load PDF file');
    }
  };

  const handleSign = async () => {
    if (!file || !signatureName) {
      setError('Please enter your name');
      return;
    }

    if (selectedPage < 1 || selectedPage > totalPages) {
      setError(`Please select a valid page (1 - ${totalPages})`);
      return;
    }

    setSigning(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();
      const page = pages[selectedPage - 1];

      if (!page) throw new Error('Page not found');

      const { height } = page.getSize();

      // Draw signature box
      page.drawRectangle({
        x: 50,
        y: 50,
        width: 200,
        height: 80,
        borderColor: rgb(0, 0, 0),
        borderWidth: 2,
      });

      // Add signature text
      page.drawText('Signed by:', {
        x: 60,
        y: 110,
        size: 10,
        color: rgb(0, 0, 0),
      });

      page.drawText(signatureName, {
        x: 60,
        y: 95,
        size: 12,
        color: rgb(0, 0, 0),
      });

      page.drawText(`Date: ${signatureDate}`, {
        x: 60,
        y: 80,
        size: 10,
        color: rgb(0, 0, 0),
      });

      const signedPdf = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(signedPdf)], { type: 'application/pdf' });
      downloadBlob(blob, `signed-${file.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Signing failed');
    } finally {
      setSigning(false);
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
                Your Name (Signature)
              </label>
              <input
                type="text"
                value={signatureName}
                onChange={(e) => setSignatureName(e.target.value)}
                className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold theme-title">
                Signature Date
              </label>
              <input
                type="date"
                value={signatureDate}
                onChange={(e) => setSignatureDate(e.target.value)}
                className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold theme-title">
                Sign on Page (1 - {totalPages})
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
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleSign}
              disabled={signing}
              className="flex-1 rounded-lg bg-emerald-600 px-4 py-3 font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {signing ? 'Signing...' : 'Sign PDF'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setSignatureName('');
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
