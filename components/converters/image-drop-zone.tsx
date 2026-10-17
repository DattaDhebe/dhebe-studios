'use client';

import type { ChangeEvent, DragEvent, RefObject } from 'react';
import { useState } from 'react';
import { UiIcon } from '@/components/ui-icon';

interface ImageDropZoneProps {
  inputRef: RefObject<HTMLInputElement | null>;
  onSelect: (files: FileList | File | null) => void;
  multiple?: boolean;
  accept?: string;
  title?: string;
  helperText?: string;
}

export function ImageDropZone({
  inputRef,
  onSelect,
  multiple = false,
  accept = 'image/jpeg,image/png,image/webp',
  title = 'Drop images here',
  helperText = 'or click to browse from your device',
}: ImageDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string>('');

  const select = (selection: FileList | File | null) => {
    const files = selection instanceof FileList ? Array.from(selection) : selection ? [selection] : [];
    const valid = files.every(file => /\.(jpe?g|png|webp)$/i.test(file.name) || ['image/jpeg', 'image/png', 'image/webp'].includes(file.type));
    if (!valid) { setUploadMessage('Choose JPG, PNG, or WebP images.'); return false; }
    onSelect(selection);
    return true;
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (multiple) {
      const files = event.target.files;
      if (!select(files ?? null)) return;
      setUploadMessage(files && files.length > 0 ? `${files.length} file(s) selected successfully.` : '');
      return;
    }

    const file = event.target.files?.[0] ?? null;
    if (!select(file)) return;
    setUploadMessage(file ? `Upload complete: ${file.name}` : '');
  };

  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    if (multiple) {
      const files = event.dataTransfer.files ?? null;
      if (!select(files)) return;
      setUploadMessage(files && files.length > 0 ? `${files.length} file(s) dropped successfully.` : '');
      return;
    }

    const file = event.dataTransfer.files?.[0] ?? null;
    if (!select(file)) return;
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
          onChange={handleInputChange}
          onClick={event => { event.currentTarget.value = ''; }}
          className="sr-only"
        />
        <div className="text-center">
          <span className="upload-icon"><UiIcon name="image" width="22" height="22" /></span>
          <p className="upload-title">{title}</p>
          <p className="upload-helper">{helperText}</p>
          <span className="upload-browse">Choose {multiple ? 'images' : 'image'}</span>
        </div>
      </label>
      {uploadMessage && (
        <p className="upload-message" aria-live="polite">{uploadMessage.replace('Upload complete:', 'Selected:')}</p>
      )}
    </div>
  );
}
