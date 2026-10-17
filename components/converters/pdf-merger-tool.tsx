'use client';

import { useRef, useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { PdfDropZone } from '@/components/converters/pdf-drop-zone';

interface SelectedFile {
  file: File;
  order: number;
}

export function PdfMergerTool() {
  const [files, setFiles] = useState<SelectedFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (newFiles: FileList) => {
    const newSelectedFiles = Array.from(newFiles).map((file, index) => ({
      file,
      order: Math.max(-1, ...files.map(item => item.order)) + 1 + index,
    }));

    for (const { file } of newSelectedFiles) {
      if (file.type !== 'application/pdf') {
        setError('All files must be valid PDF files');
        return;
      }
    }

    setFiles([...files, ...newSelectedFiles]);
    setError('');
  };

  const handleRemoveFile = (order: number) => {
    setFiles(files.filter((f) => f.order !== order));
  };

  const handleReorder = (fromOrder: number, direction: 'up' | 'down') => {
    const fromIndex = files.findIndex((f) => f.order === fromOrder);
    if (direction === 'up' && fromIndex > 0) {
      const newFiles = [...files];
      [newFiles[fromIndex - 1], newFiles[fromIndex]] = [newFiles[fromIndex], newFiles[fromIndex - 1]];
      setFiles(newFiles);
    } else if (direction === 'down' && fromIndex < files.length - 1) {
      const newFiles = [...files];
      [newFiles[fromIndex], newFiles[fromIndex + 1]] = [newFiles[fromIndex + 1], newFiles[fromIndex]];
      setFiles(newFiles);
    }
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge');
      return;
    }

    setMerging(true);
    setError('');

    try {
      const mergedPdf = await PDFDocument.create();

      for (const { file } of files) {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'merged.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Merge failed');
    } finally {
      setMerging(false);
    }
  };

  return (
    <div className="space-y-6">
      <PdfDropZone
        inputRef={fileInputRef}
        onSelect={(selected) => selected instanceof FileList && handleFileSelect(selected)}
        title="Drop PDFs here"
        helperText="or click to browse (select multiple files)"
        multiple
      />

      {files.length > 0 && (
        <div className="theme-card rounded-2xl border p-6 space-y-4">
          <div>
            <p className="mb-4 text-sm font-semibold theme-title">Selected Files ({files.length})</p>
            <div className="space-y-2">
              {files.map((item, index) => (
                <div key={item.order} className="theme-card-soft flex items-center justify-between rounded-lg p-3">
                  <div className="flex flex-1 items-center gap-3">
                    <span className="theme-card rounded px-2 py-1 text-xs font-bold theme-title">
                      {index + 1}
                    </span>
                    <span className="flex-1 truncate text-sm theme-muted">{item.file.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReorder(item.order, 'up')}
                      disabled={index === 0}
                      className="theme-card rounded px-2 py-1 text-xs transition hover:brightness-95 disabled:opacity-50"
                    >
                      Up
                    </button>
                    <button
                      onClick={() => handleReorder(item.order, 'down')}
                      disabled={index === files.length - 1}
                      className="theme-card rounded px-2 py-1 text-xs transition hover:brightness-95 disabled:opacity-50"
                    >
                      Down
                    </button>
                    <button
                      onClick={() => handleRemoveFile(item.order)}
                      className="rounded bg-red-100 px-2 py-1 text-xs text-red-700 hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 border-t pt-4">
            <button
              onClick={handleMerge}
              disabled={merging}
              className="flex-1 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
            >
              {merging ? 'Merging...' : 'Merge PDFs'}
            </button>
            <button
              onClick={() => setFiles([])}
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
