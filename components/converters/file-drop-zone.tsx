'use client';

import { useEffect, useState, type ChangeEvent, type DragEvent, type RefObject } from 'react';
import { UiIcon } from '@/components/ui-icon';

interface FileDropZoneProps {
  accept: string;
  activeFileName: string | null;
  helperText: string;
  inputRef: RefObject<HTMLInputElement | null>;
  onSelect: (file: File | null) => void;
}

export function FileDropZone({ accept, activeFileName, helperText, inputRef, onSelect }: FileDropZoneProps) {
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  useEffect(() => setReady(true), []);
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => onSelect(event.target.files?.[0] ?? null);
  const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    if (ready) onSelect(event.dataTransfer.files?.[0] ?? null);
  };
  return (
    <label className={`upload-zone ${dragging ? 'is-dragging' : ''}`} onDrop={handleDrop} onDragOver={event => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)}>
      <input ref={inputRef} type="file" disabled={!ready} aria-label="Choose a file" onClick={event => { event.currentTarget.value = ''; }} accept={accept} onChange={handleInputChange} className="sr-only" />
      <span><span className="upload-icon"><UiIcon name="upload" width="22" height="22" /></span><span className="upload-title block">{activeFileName ?? 'Drop a file here'}</span><span className="upload-helper block">{helperText}</span><span className="upload-browse">Choose file</span></span>
    </label>
  );
}
