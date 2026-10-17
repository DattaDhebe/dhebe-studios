'use client';

import { useRef, useState } from 'react';
import { BlobImage } from './blob-image';
import { ImageDropZone } from './image-drop-zone';

interface ImageToolShellProps {
  title: string;
  helperText: string;
}

export function ImageToolShell({ title, helperText }: ImageToolShellProps) {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFiles: FileList | File | null) => {
    if (!selectedFiles) return;
    
    if (selectedFiles instanceof FileList) {
      setFiles(Array.from(selectedFiles));
    } else {
      setFiles([selectedFiles]);
    }
  };

  const handleReset = () => {
    setFiles([]);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      {files.length === 0 ? (
        <ImageDropZone
          inputRef={inputRef}
          onSelect={handleFileSelect}
          multiple
          title={title}
          helperText={helperText}
        />
      ) : (
        <div className="space-y-6 text-center">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold theme-title">
              {files.length} {files.length === 1 ? 'Image' : 'Images'} Selected
            </h3>
            <button
              onClick={handleReset}
              className="text-sm font-medium text-rose-600 hover:text-rose-700"
            >
              Clear all
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {files.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className="flex flex-col rounded-2xl border p-4 theme-card"
              >
                <div className="mb-3 aspect-video w-full overflow-hidden rounded-xl bg-slate-100">
                  <BlobImage
                    blob={file}
                    alt={file.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold theme-title">{file.name}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-rose-200 bg-rose-50/50 p-12 dark:border-rose-900/50 dark:bg-rose-900/20">
             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600">
                <span className="text-2xl font-bold">Soon</span>
              </div>
              <h3 className="mt-4 text-xl font-bold theme-title">Feature Coming Soon</h3>
              <p className="mt-2 text-sm theme-muted max-w-md mx-auto">
                The processing logic for this tool is currently being finalized. All your files remain 100% private and never leave your browser.
              </p>
          </div>
        </div>
      )}
    </div>
  );
}
