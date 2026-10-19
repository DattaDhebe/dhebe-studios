'use client';

import { useState, useRef } from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { downloadBlob, isPdfFile } from '@/lib/download';

export function PdfWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('WATERMARK');
  const [opacity, setOpacity] = useState<number>(0.3);
  const [watermarking, setWatermarking] = useState(false);
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

  const handleWatermark = async () => {
    if (!file || !watermarkText) return;

    setWatermarking(true);
    setError('');

    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

      for (const page of pages) {
        const box = page.getCropBox();
        const fontSize = Math.min(60, Math.min(box.width, box.height) * 0.8 / Math.max(font.widthOfTextAtSize(watermarkText, 1), 1));
        const textWidth = font.widthOfTextAtSize(watermarkText, fontSize);
        const textHeight = font.heightAtSize(fontSize);
        const diagonal = Math.SQRT1_2;
        const x = box.x + box.width / 2 - (textWidth - textHeight) * diagonal / 2;
        const y = box.y + box.height / 2 - (textWidth + textHeight) * diagonal / 2;

        page.drawText(watermarkText, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
          opacity,
          rotate: degrees(45),
        });
      }

      const watermarkedPdf = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(watermarkedPdf)], { type: 'application/pdf' });
      downloadBlob(blob, `watermarked-${file.name}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Watermarking failed');
    } finally {
      setWatermarking(false);
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
            <p className="mt-1 text-sm theme-muted">Size: {(file.size / 1024).toFixed(2)} KB</p>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div>
              <label className="mb-2 block text-sm font-semibold theme-title">
                Watermark Text
              </label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter watermark text"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold theme-title">
                Opacity: {(opacity * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={opacity}
                onChange={(e) => setOpacity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleWatermark}
              disabled={watermarking}
              className="flex-1 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {watermarking ? 'Adding Watermark...' : 'Add Watermark'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setWatermarkText('WATERMARK');
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
