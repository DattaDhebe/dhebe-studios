'use client';

import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { useEffect, useState } from 'react';
import { UiIcon } from '@/components/ui-icon';

interface PdfDropZoneProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onSelect: (files: FileList | File | null) => void;
  multiple?: boolean;
  accept?: string;
  title?: string;
  helperText?: string;
  disabled?: boolean;
}

export function PdfDropZone({
  inputRef,
  onSelect,
  multiple = false,
  accept = 'application/pdf',
  title = 'Drop PDF files here',
  helperText = 'or click to browse',
  disabled = false,
}: PdfDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      const files = event.target.files;
      onSelect(files ?? null);
      setUploadMessage(files && files.length > 0 ? `${files.length} file(s) selected successfully.` : '');
      return;
    }

    const file = event.target.files?.[0] ?? null;
    onSelect(file);
    setUploadMessage(file ? `Upload complete: ${file.name}` : '');
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    if (disabled || !ready) return;

    if (multiple) {
      const files = event.dataTransfer.files ?? null;
      onSelect(files);
      setUploadMessage(files && files.length > 0 ? `${files.length} file(s) dropped successfully.` : '');
      return;
    }

    const file = event.dataTransfer.files?.[0] ?? null;
    onSelect(file);
    setUploadMessage(file ? `Upload complete: ${file.name}` : '');
  };

  return (
    <div className="upload-container">
      <label
        className={`upload-zone ${isDragging ? 'is-dragging' : ''}`}
        onDrop={handleDrop}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          setIsDragging(false);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          aria-label={title}
          accept={accept}
          multiple={multiple}
          disabled={disabled || !ready}
          onChange={handleInputChange}
          onClick={(event) => { event.currentTarget.value = ''; }}
          className="sr-only"
        />
        <div className="text-center">
          <span className="upload-icon"><UiIcon name="upload" width="22" height="22" /></span>
          <p className="upload-title">{title}</p>
          <p className="upload-helper">{helperText}</p>
          <span className="upload-browse">Choose {multiple ? 'files' : 'file'}</span>
        </div>
      </label>
      {uploadMessage && (
        <p className="upload-message" aria-live="polite">{uploadMessage.replace('Upload complete:', 'Selected:')}</p>
      )}
    </div>
  );
}
