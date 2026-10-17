'use client';

import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { isPdfFile } from '@/lib/download';

export function PdfCropTool() {
  const [file, setFile] = useState<File | null>(null);
  const [marginPercent, setMarginPercent] = useState('5');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(null);
    if (!isPdfFile(selectedFile)) {
      setError('Please select a valid PDF file.');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleCrop = async () => {
    if (!file) {
      return;
    }

    const cropValue = Number.parseFloat(marginPercent);
    if (!Number.isFinite(cropValue) || cropValue < 0 || cropValue > 45) {
      setError('Enter a margin percentage between 0 and 45.');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());

      for (const page of pdfDoc.getPages()) {
        const { x, y, width, height } = page.getCropBox();
        const marginX = (width * cropValue) / 100;
        const marginY = (height * cropValue) / 100;
        page.setCropBox(x + marginX, y + marginY, width - marginX * 2, height - marginY * 2);
      }

      const bytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `cropped-${file.name}`;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cropping failed.');
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

      {file && (
        <div className="theme-card rounded-2xl border p-6 space-y-4">
          <div>
            <p className="text-sm font-semibold theme-title">Crop PDF</p>
            <p className="mt-2 text-base theme-muted">{file.name}</p>
          </div>

          <div className="border-t pt-4">
            <label className="mb-2 block text-sm font-semibold theme-title">
              Crop margin on each side (%)
            </label>
            <input
              type="number"
              min="0"
              max="45"
              step="1"
              value={marginPercent}
              onChange={(event) => setMarginPercent(event.target.value)}
              className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <p className="mt-2 text-xs theme-muted">
              A small value trims outer whitespace while preserving most of the page.
            </p>
            <p className="mt-2 text-xs theme-muted">Cropping hides content outside the page boundary; it does not permanently redact it.</p>
          </div>

          <button
            onClick={handleCrop}
            disabled={processing}
            className="w-full rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white hover:bg-cyan-700 disabled:opacity-50"
          >
            {processing ? 'Cropping...' : 'Crop PDF'}
          </button>
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
