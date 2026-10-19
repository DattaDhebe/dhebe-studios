'use client';

import { useState } from 'react';
import { formatPhoto } from '@/lib/photo-format';
import { downloadBlob } from '@/lib/download';
import { BlobImage } from './converters/blob-image';
import { useUtilityTask, UtilityTaskFeedback } from './utility-task';

export function PhotoSignatureTool() {
  const [file, setFile] = useState<File | null>(null);
  const [width, setWidth] = useState('300'); const [height, setHeight] = useState('100'); const [target, setTarget] = useState('20');
  const [fit, setFit] = useState('contain'); const [x, setX] = useState('50'); const [y, setY] = useState('50');
  const task = useUtilityTask<Awaited<ReturnType<typeof formatPhoto>>>('photo-signature-formatter');
  const update = (setter: (value: string) => void, value: string) => { task.reset(); setter(value); };
  return <div className="utility-workspace utility-split"><div>
    <label className="utility-label" htmlFor="photo-file">Photo or signature image</label><input id="photo-file" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { task.reset(); setFile(event.target.files?.[0] || null); }} />
    <div className="utility-presets" aria-label="Starting dimensions"><button type="button" onClick={() => { task.reset(); setWidth('300'); setHeight('100'); setTarget('20'); setFit('contain'); }}>Signature starting size</button><button type="button" onClick={() => { task.reset(); setWidth('600'); setHeight('800'); setTarget('200'); setFit('cover'); }}>Portrait starting size</button></div>
    <div className="utility-two-fields"><div><label className="utility-label" htmlFor="photo-width">Width (pixels)</label><input id="photo-width" type="number" min="16" max="4096" step="1" value={width} onChange={event => update(setWidth, event.target.value)} /></div><div><label className="utility-label" htmlFor="photo-height">Height (pixels)</label><input id="photo-height" type="number" min="16" max="4096" step="1" value={height} onChange={event => update(setHeight, event.target.value)} /></div></div>
    <label className="utility-label" htmlFor="photo-target">Maximum JPG size (KB)</label><input id="photo-target" type="number" min="1" max="10000" value={target} onChange={event => update(setTarget, event.target.value)} />
    <label className="utility-label" htmlFor="photo-fit">Fit method</label><select id="photo-fit" value={fit} onChange={event => update(setFit, event.target.value)}><option value="contain">Keep entire image with white padding</option><option value="cover">Crop to fill without stretching</option></select>
    {fit === 'cover' && <><label className="utility-label" htmlFor="photo-x">Horizontal crop position: {x}%</label><input id="photo-x" type="range" min="0" max="100" value={x} onChange={event => update(setX, event.target.value)} /><label className="utility-label" htmlFor="photo-y">Vertical crop position: {y}%</label><input id="photo-y" type="range" min="0" max="100" value={y} onChange={event => update(setY, event.target.value)} /></>}
    <button className="button-primary mt-6" type="button" disabled={!file || task.busy} onClick={() => task.run(signal => formatPhoto(file!, { width: Number(width), height: Number(height), target: Number(target) * 1000, fit, x: Number(x), y: Number(y) }, signal))}>Prepare JPG</button><UtilityTaskFeedback task={task} />
    <p className="utility-note">Dimensions remain exactly as entered. 1 KB = 1,000 bytes. Presets are starting points, not official requirements. Check the current form: some require a live photo, minimum file size, specific dimensions, or a different background. This tool does not verify identity or guarantee acceptance. Maximum input: 25 MB / 40 megapixels.</p>
  </div><div className="image-size-result">{task.result ? <><BlobImage blob={task.result.blob} alt="Prepared photo or signature preview" className="utility-preview-image" /><p>{task.result.width} x {task.result.height} pixels / {(task.result.blob.size / 1000).toFixed(2)} KB</p><button className="utility-secondary" type="button" onClick={() => downloadBlob(task.result!.blob, 'prepared-photo-signature.jpg')}>Download prepared JPG</button></> : <p>Your prepared JPG appears here. Check the entire image is readable before using it.</p>}</div></div>;
}
