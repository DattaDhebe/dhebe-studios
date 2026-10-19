'use client';

import { useRef, useState, useEffect } from 'react';
import { downloadBlob } from '@/lib/download';
import { BlobImage } from './blob-image';
import { transformImage, imageFilename, loadImage } from '@/lib/image-processing';
import { ImageDropZone } from './image-drop-zone';

interface ConvertedFile {
  original: File;
  converted: Blob | null;
  status: 'pending' | 'converting' | 'completed' | 'error';
}

interface ImageFormatConverterToolProps {
  targetFormat: 'image/jpeg' | 'image/png' | 'image/webp';
  label: string;
}

export function ImageFormatConverterTool({ targetFormat, label }: ImageFormatConverterToolProps) {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | File | null) => {
    if (!selectedFiles) return;
    
    let newFiles: File[] = [];
    if (selectedFiles instanceof FileList) {
      newFiles = Array.from(selectedFiles);
    } else {
      newFiles = [selectedFiles];
    }

    const wrappedFiles: ConvertedFile[] = newFiles.map(file => ({
      original: file,
      converted: null,
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

  const convertImage = async (file: ConvertedFile): Promise<ConvertedFile> => {
    try {
      const converted = await transformImage(file.original, { type: targetFormat, quality: 0.92 });
      return { ...file, converted, status: 'completed' };
    } catch { return { ...file, status: 'error' }; }
  };

  const handleConvert = async () => {
    setFiles(prev => prev.map(f => ({ ...f, status: 'converting' })));
    
    const results: ConvertedFile[] = [];
    for (const file of files) results.push(await convertImage(file));
    setFiles(results);
  };

  const downloadFile = (file: ConvertedFile) => {
    if (!file.converted) return;
    downloadBlob(file.converted, imageFilename(file.original.name, file.converted.type, 'converted_'));
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
          title={`Drop images to convert to ${label}`}
          helperText={`Convert any image to high-quality ${label} format instantly.`}
        />
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold theme-title">
              {files.length} {files.length === 1 ? 'Image' : 'Images'} Selected
            </h3>
            <button
              disabled={files.some(f => f.status === 'converting')} onClick={handleReset}
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
                  {file.status === 'converting' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-rose-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold theme-title">{file.original.name}</p>
                  <p className="mt-1 text-xs theme-muted">
                    Target: {label}
                  </p>
                  {file.status === 'error' && <p role="alert" className="mt-2 text-xs text-red-700">Could not process this image. Check its format, size, and settings.</p>}
                  {file.status === 'completed' && (
                    <button
                      onClick={() => downloadFile(file)}
                      className="mt-3 w-full rounded-xl bg-rose-100 py-2 text-xs font-bold text-rose-700 transition hover:bg-rose-200"
                    >
                      Download {label}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border bg-slate-50 p-6 dark:bg-slate-900/50">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold theme-title">Conversion Ready</p>
                <p className="mt-1 text-sm theme-muted">
                  Images will be converted to {label} format with high quality.
                </p>
              </div>
              <button
                onClick={handleConvert}
                disabled={files.some(f => f.status === 'converting')}
                className="inline-flex min-w-[12rem] items-center justify-center rounded-2xl bg-slate-950 px-5 py-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50 dark:bg-rose-600 dark:hover:bg-rose-700"
              >
                {files.some(f => f.status === 'converting') ? 'Converting...' : `Convert to ${label}`}
              </button>
            </div>

            {files.some(f => f.status === 'completed') && (
              <button
                onClick={downloadAll}
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl border border-slate-950 px-5 py-4 text-sm font-semibold theme-title transition hover:bg-slate-100"
              >
                Download All Converted
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
