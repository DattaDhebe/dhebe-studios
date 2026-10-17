'use client';

import { useRef, useState } from 'react';
import { degrees, PDFDocument } from 'pdf-lib';
import { formatPageSummary, parsePageSelection } from '@/lib/pdf-page-selection';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';
import { isPdfFile } from '@/lib/download';

const rotationChoices = [
  { label: '90° clockwise', value: 90 },
  { label: '180°', value: 180 },
  { label: '270° clockwise', value: 270 },
] as const;

export function PdfRotateTool() {
  const [file, setFile] = useState<File | null>(null);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageInput, setPageInput] = useState<string>('1');
  const [rotation, setRotation] = useState<number>(90);
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
      const initialPages = [1];

      setFile(selectedFile);
      setTotalPages(pages);
      setPageInput('1');
      setSelectedPages(initialPages);
      setError('');
    } catch {
      if (version === selection.current) setError('Failed to load PDF file');
    }
  };

  const handlePageInputChange = (value: string) => {
    setPageInput(value);

    if (!totalPages) {
      return;
    }

    try {
      const parsedPages = parsePageSelection(value, totalPages);
      setSelectedPages(parsedPages);
      setError('');
    } catch (err) {
      setSelectedPages([]);
      setError(err instanceof Error ? err.message : 'Invalid page selection');
    }
  };

  const handleRotate = async () => {
    if (!file) return;

    let pagesToRotate: number[];
    try {
      pagesToRotate = parsePageSelection(pageInput, totalPages);
      setSelectedPages(pagesToRotate);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid page selection');
      return;
    }

    setProcessing(true);
    setError('');

    try {
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      const pages = pdfDoc.getPages();

      pagesToRotate.forEach((pageNumber) => {
        const page = pages[pageNumber - 1];
        const currentAngle = page.getRotation().angle;
        page.setRotation(degrees((currentAngle + rotation) % 360));
      });

      const rotatedBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(rotatedBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `rotated-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rotation failed');
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

          <div className="grid gap-4 border-t pt-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold theme-title">
                Pages to rotate
              </label>
              <input
                type="text"
                value={pageInput}
                onChange={(e) => handlePageInputChange(e.target.value)}
                placeholder="Example: 1, 3-5, 9"
                className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="mt-2 text-xs theme-muted-2">
                Use commas and ranges. Example: `1, 3-5, 9`
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold theme-title">
                Rotation amount
              </label>
              <select
                value={rotation}
                onChange={(e) => setRotation(Number(e.target.value))}
                className="theme-card w-full rounded-lg border px-4 py-2 theme-title focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {rotationChoices.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="rounded-xl border p-4 theme-card-soft">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] theme-muted-2">
              Pages Selected
            </p>
            <p className="mt-2 text-sm theme-title">{formatPageSummary(selectedPages)}</p>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleRotate}
              disabled={processing || selectedPages.length === 0}
              className="flex-1 rounded-lg bg-purple-600 px-4 py-3 font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
            >
              {processing ? 'Rotating...' : 'Rotate PDF'}
            </button>
            <button
              onClick={() => {
                setFile(null);
                setTotalPages(0);
                setPageInput('1');
                setSelectedPages([]);
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
