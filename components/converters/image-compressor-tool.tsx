'use client';

import { useRef, useState } from 'react';
import { BlobImage } from './blob-image';
import { transformImage, imageFilename, loadImage } from '@/lib/image-processing';
import { ImageDropZone } from './image-drop-zone';

interface CompressedFile {
  original: File;
  compressed: Blob | null;
  compressedSize: number | null;
  status: 'pending' | 'compressing' | 'completed' | 'error';
}

export function ImageCompressorTool() {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [quality, setQuality] = useState(80);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | File | null) => {
    if (!selectedFiles) return;
    
    let newFiles: File[] = [];
    if (selectedFiles instanceof FileList) {
      newFiles = Array.from(selectedFiles);
    } else {
      newFiles = [selectedFiles];
    }

    const wrappedFiles: CompressedFile[] = newFiles.map(file => ({
      original: file,
      compressed: null,
      compressedSize: null,
      status: 'pending'
    }));

    setFiles(prev => [...prev, ...wrappedFiles]);
  };

  const handleReset = () => {
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const compressImage = async (file: CompressedFile): Promise<CompressedFile> => {
    try {
      const type = file.original.type === 'image/png' ? 'image/webp' : file.original.type;
      const result = await transformImage(file.original, { type, quality: quality / 100 });
      const blob = result.size < file.original.size ? result : file.original;
      return { ...file, compressed: blob, compressedSize: blob.size, status: 'completed' };
    } catch { return { ...file, status: 'error' }; }
  };

  const handleCompress = async () => {
    setFiles(prev => prev.map(f => ({ ...f, status: 'compressing' })));
    
    const results: CompressedFile[] = [];
    for (const file of files) results.push(await compressImage(file));
    setFiles(results);
  };

  const downloadFile = (file: CompressedFile) => {
    if (!file.compressed) return;
    const url = URL.createObjectURL(file.compressed);
    const a = document.createElement('a');
    a.href = url;
    a.download = imageFilename(file.original.name, file.compressed.type, 'compressed_');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadAll = () => {
    files.forEach(f => {
      if (f.status === 'completed') {
        downloadFile(f);
      }
    });
  };

  return (
    <div className="space-y-8">
      {files.length === 0 ? (
        <ImageDropZone
          inputRef={inputRef}
          onSelect={handleFileSelect}
          multiple
          title="Drop images here to compress"
          helperText="Supports JPG, PNG, and WebP formats. All processing is 100% private."
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold theme-title">
              {files.length} {files.length === 1 ? 'Image' : 'Images'} Selected
            </h3>
            <button
              disabled={files.some(f => f.status === 'compressing')} onClick={handleReset}
              className="text-sm font-medium text-rose-600 hover:text-rose-700"
            >
              Clear all
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file, index) => (
              <div
                key={`${file.original.name}-${index}`}
                className="flex flex-col rounded-2xl border p-4 theme-card"
              >
                <div className="relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                  <BlobImage
                    blob={file.original}
                    alt={file.original.name}
                    className="h-full w-full object-contain"
                  />
                  {file.status === 'compressing' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold theme-title">{file.original.name}</p>
                  <div className="mt-1 flex items-center justify-between text-xs">
                    <span className="theme-muted">
                      {(file.original.size / 1024).toFixed(1)} KB
                    </span>
                    {file.compressedSize && (
                      <span className="font-bold text-emerald-600">
                        → {(file.compressedSize / 1024).toFixed(1)} KB
                      </span>
                    )}
                  </div>
                  {file.status === 'error' && <p role="alert" className="mt-2 text-xs text-red-700">Could not process this image. Check its format, size, and settings.</p>}
                  {file.status === 'completed' && (
                    <button
                      onClick={() => downloadFile(file)}
                      className="mt-3 w-full rounded-xl bg-rose-100 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-200"
                    >
                      Download
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-slate-50 p-6 dark:bg-slate-900/50">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold theme-title">Compression Settings</p>
                <p className="mt-1 text-sm theme-muted">
                  PNG images use WebP for compression. The original is kept when it is smaller.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium theme-title">Quality: {quality}%</span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  className="h-2 w-32 cursor-pointer appearance-none rounded-lg bg-slate-200 accent-rose-600 dark:bg-slate-700"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={handleCompress}
                disabled={files.some(f => f.status === 'compressing')}
                className="inline-flex flex-1 items-center justify-center rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-rose-600 dark:hover:bg-rose-700"
              >
                {files.some(f => f.status === 'compressing') ? 'Compressing...' : 'Compress Images'}
              </button>
              {files.some(f => f.status === 'completed') && (
                <button
                  onClick={downloadAll}
                  className="inline-flex flex-1 items-center justify-center rounded-2xl border border-slate-950 px-5 py-4 text-sm font-semibold theme-title transition hover:bg-slate-100"
                >
                  Download All
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
