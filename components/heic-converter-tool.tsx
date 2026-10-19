'use client';

import { useState } from 'react';
import { zipSync } from 'fflate';
import { downloadBlob } from '@/lib/download';
import { convertHeic } from '@/lib/heic-conversion';
import { BlobImage } from './converters/blob-image';
import { useUtilityTask, UtilityTaskFeedback } from './utility-task';

interface ConvertedImage { blob: Blob; name: string; width: number; height: number }
export function HeicConverterTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [format, setFormat] = useState<'image/jpeg' | 'image/png'>('image/jpeg');
  const task = useUtilityTask<{ images: ConvertedImage[]; failures: string[] }>('heic-to-jpg');
  const convert = () => task.run(async (signal, progress) => {
    if (!files.length || files.length > 10) throw new Error('Choose between 1 and 10 HEIC files.');
    if (files.some(file => file.size > 15_000_000) || files.reduce((size, file) => size + file.size, 0) > 30_000_000) throw new Error('Use files below 15 MB each and 30 MB combined.');
    progress('Loading the HEIC decoder...');
    signal.throwIfAborted();
    const images: ConvertedImage[] = []; const failures: string[] = [];
    let total = 0;
    for (const [index, file] of files.entries()) {
      signal.throwIfAborted(); progress(`Converting image ${index + 1} of ${files.length}...`);
      try {
        const { blob, width, height } = await convertHeic(file, format, signal);
        signal.throwIfAborted();
        total += blob.size;
        if (total > 50_000_000) throw new Error('The output batch exceeds 50 MB. Convert fewer photos.');
        images.push({ blob, width, height, name: `${index + 1}-${file.name.replace(/\.[^.]+$/, '').replace(/[^a-z\d_-]/gi, '_').slice(0, 70) || 'photo'}.${format === 'image/jpeg' ? 'jpg' : 'png'}` });
      } catch (caught) {
        signal.throwIfAborted(); failures.push(`Image ${index + 1}: ${caught instanceof Error ? caught.message : 'The decoder could not read this image.'}`);
      }
    }
    if (!images.length) throw new Error(failures.join(' '));
    return { images, failures };
  });
  const downloadZip = async () => {
    if (!task.result) return;
    const entries: Record<string, Uint8Array> = {};
    for (const image of task.result.images) entries[image.name] = new Uint8Array(await image.blob.arrayBuffer());
    downloadBlob(new Blob([new Uint8Array(zipSync(entries, { level: 0 }))], { type: 'application/zip' }), 'converted-photos.zip');
  };
  return <div className="utility-workspace">
    <label className="utility-label" htmlFor="heic-files">HEIC or HEIF photos</label><input id="heic-files" type="file" accept=".heic,.heif,image/heic,image/heif" multiple onChange={event => { task.reset(); setFiles(Array.from(event.target.files || [])); }} />
    <p className="utility-note">{files.length} selected / up to 10 files, 15 MB each, 30 MB combined.</p><label className="utility-label" htmlFor="heic-format">Output format</label><select id="heic-format" value={format} onChange={event => { task.reset(); setFormat(event.target.value as typeof format); }}><option value="image/jpeg">JPG</option><option value="image/png">PNG</option></select>
    <button className="button-primary mt-6" type="button" disabled={!files.length || task.busy} onClick={convert}>Convert HEIC photos</button><UtilityTaskFeedback task={task} />
    {task.result && <><div className="utility-result-grid">{task.result.images.map(image => <div className="image-size-result" key={image.name}><BlobImage blob={image.blob} alt="Converted HEIC preview" className="utility-preview-image" /><p>{image.width} x {image.height} pixels / {(image.blob.size / 1000).toFixed(1)} KB</p><button className="utility-secondary" type="button" onClick={() => downloadBlob(image.blob, image.name)}>Download {image.name}</button></div>)}</div>{task.result.failures.map(failure => <p className="utility-error" key={failure}>{failure}</p>)}<button className="utility-secondary mt-4" type="button" onClick={downloadZip}>Download successful images as ZIP</button></>}
    <p className="utility-note">Conversion stays on your device in a cancellable worker. Only the first still image is exported. Original metadata, extra frames, depth, and HDR presentation are not retained. Large decoder downloads and photo processing can take time on phones. Output batches are limited to 50 MB. <a href="/third-party/heic-to-NOTICE.txt">Decoder license and source</a>.</p>
  </div>;
}
