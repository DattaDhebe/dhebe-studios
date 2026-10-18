'use client';

import { useEffect, useRef, useState } from 'react';
import { reduceImageToSize } from '@/lib/image-target-size';
import { downloadBlob } from '@/lib/download';
import { BlobImage } from '@/components/converters/blob-image';

export function ImageSizeTool() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState('100');
  const [format, setFormat] = useState<'image/jpeg' | 'image/webp'>('image/jpeg');
  const [result, setResult] = useState<Awaited<ReturnType<typeof reduceImageToSize>> | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const controller = useRef<AbortController | null>(null);
  useEffect(() => () => controller.current?.abort(), []);
  const reset = () => { controller.current?.abort(); setBusy(false); setResult(null); setError(''); };
  const reduce = async () => {
    if (!file) return;
    reset(); const operation = new AbortController(); controller.current = operation;
    setBusy(true);
    try { const output = await reduceImageToSize(file, Number(target) * 1000, format, operation.signal); if (!operation.signal.aborted) setResult(output); }
    catch (caught) { if (!operation.signal.aborted) setError(caught instanceof Error ? caught.message : 'Could not process this image.'); }
    finally { if (!operation.signal.aborted) setBusy(false); }
  };
  return (
    <div className="utility-workspace utility-split">
      <div><label className="utility-label" htmlFor="size-image">Choose a JPG, PNG, or WebP image</label><input id="size-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { reset(); const selected = event.target.files?.[0] || null; setFile(selected); if (selected && !['image/jpeg', 'image/png', 'image/webp'].includes(selected.type)) { setError('Choose a JPG, PNG, or WebP image.'); setFile(null); } }} />
        {file && <p className="utility-note">Selected: {file.name} ({(file.size / 1000).toFixed(1)} KB)</p>}
        <label className="utility-label" htmlFor="target-size">Maximum file size (KB)</label><input id="target-size" type="number" min="1" max="10000" step="1" value={target} onChange={event => { reset(); setTarget(event.target.value); }} />
        <div className="utility-presets" aria-label="Common upload limits">{[20, 50, 100, 200, 500].map(value => <button type="button" key={value} aria-pressed={target === String(value)} onClick={() => { reset(); setTarget(String(value)); }}>{value} KB</button>)}</div>
        <label className="utility-label" htmlFor="size-format">Output format</label><select id="size-format" value={format} onChange={event => { reset(); setFormat(event.target.value as typeof format); }}><option value="image/jpeg">JPG (white background)</option><option value="image/webp">WebP (supports transparency)</option></select>
        <button className="button-primary mt-6" type="button" disabled={!file || busy || !Number.isFinite(Number(target)) || Number(target) < 1 || Number(target) > 10000} onClick={reduce}>{busy ? 'Reducing image...' : 'Reduce image size'}</button>{busy && <button type="button" className="utility-secondary ml-3" onClick={reset}>Cancel</button>}{error && <p role="alert" className="utility-error">{error}</p>}
        <p className="utility-note">1 KB = 1,000 bytes. This tool reduces quality and, when necessary, image dimensions to stay under your limit. Small limits can make details unreadable. Check the preview and your form&apos;s minimum dimensions before uploading. Maximum input: 25 MB / 40 megapixels. Processing stays on your device.</p>
      </div>
      <div className="image-size-result">{result ? <><BlobImage blob={result.blob} alt="Reduced image preview" className="max-h-80 max-w-full object-contain mx-auto" /><p role="status">Ready: {(result.blob.size / 1000).toFixed(2)} KB / {result.width} x {result.height} pixels</p><button className="utility-secondary" onClick={() => downloadBlob(result.blob, `reduced-image.${result.blob.type === 'image/jpeg' ? 'jpg' : 'webp'}`)}>Download image</button></> : <p>Your reduced image will appear here.</p>}</div>
    </div>
  );
}
