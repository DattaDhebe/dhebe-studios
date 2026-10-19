'use client';

import { useState } from 'react';
import { zipSync, strToU8 } from 'fflate';
import { loadImage } from '@/lib/image-processing';
import { pngToIco } from '@/lib/utility-operations';
import { downloadBlob } from '@/lib/download';
import { BlobImage } from './converters/blob-image';
import { useUtilityTask, UtilityTaskFeedback } from './utility-task';

export function FaviconGeneratorTool() {
  const [file, setFile] = useState<File | null>(null); const [background, setBackground] = useState('#ffffff');
  const task = useUtilityTask<{ zip: Blob; preview: Blob }>('favicon-generator');
  const generate = () => task.run(async signal => {
    if (!file || file.size > 25_000_000) throw new Error('Choose an image below 25 MB.');
    const image = await loadImage(file); signal.throwIfAborted();
    const entries: Record<string, Uint8Array> = {};
    let preview: Blob | undefined;
    for (const size of [16, 32, 48, 180, 192, 512]) {
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = size;
      try {
        const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas is unavailable.');
        context.fillStyle = background; context.fillRect(0, 0, size, size);
        const scale = Math.min(size / image.naturalWidth, size / image.naturalHeight);
        const width = image.naturalWidth * scale; const height = image.naturalHeight * scale;
        context.drawImage(image, (size - width) / 2, (size - height) / 2, width, height);
        const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
        signal.throwIfAborted(); if (!blob) throw new Error('Could not create a PNG icon.');
        const png = new Uint8Array(await blob.arrayBuffer());
        const name = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`;
        entries[name] = png;
        if (size === 32) { entries['favicon.ico'] = pngToIco(png, 32); preview = blob; }
      } finally { canvas.width = canvas.height = 0; }
    }
    entries['site.webmanifest'] = strToU8(JSON.stringify({ name: 'Your app', short_name: 'App', start_url: '/', display: 'standalone', background_color: background, theme_color: background, icons: [192, 512].map(size => ({ src: `/icon-${size}.png`, sizes: `${size}x${size}`, type: 'image/png', purpose: 'any' })) }, null, 2));
    entries['SETUP.txt'] = strToU8('Upload the icons to your website root. Edit site.webmanifest for your app name, paths, colors, and start URL. Then add these links to your HTML head:\n<link rel="icon" href="/favicon.ico" sizes="any">\n<link rel="icon" type="image/png" sizes="32x32" href="/icon-32.png">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n<link rel="manifest" href="/site.webmanifest">\nThis is a starter icon set, not a native app or a maskable-icon certification. Test your final icons at small sizes.\n');
    return { zip: new Blob([new Uint8Array(zipSync(entries))], { type: 'application/zip' }), preview: preview! };
  });
  return <div className="utility-workspace utility-split"><div><label className="utility-label" htmlFor="favicon-image">Source icon or logo</label><input id="favicon-image" type="file" accept="image/jpeg,image/png,image/webp" onChange={event => { task.reset(); setFile(event.target.files?.[0] || null); }} /><label className="utility-label" htmlFor="favicon-background">Icon background color</label><input id="favicon-background" type="color" value={background} onChange={event => { task.reset(); setBackground(event.target.value); }} /><button className="button-primary mt-6" type="button" disabled={!file || task.busy} onClick={generate}>Generate icon package</button><UtilityTaskFeedback task={task} /><p className="utility-note">The full design is fitted inside a square without stretching. Includes PNG icons at 16, 32, 48, 180, 192, and 512 pixels, a PNG-backed ICO, and starter setup files. Maximum input: 25 MB / 40 megapixels. Nothing is uploaded.</p></div><div className="image-size-result">{task.result ? <><BlobImage blob={task.result.preview} alt="32 pixel favicon preview" className="favicon-preview" /><p>32 pixel preview, shown enlarged. Inspect it at its natural size too.</p><button className="utility-secondary" type="button" onClick={() => downloadBlob(task.result!.zip, 'website-icons.zip')}>Download icon ZIP</button></> : <p>Your favicon preview appears here.</p>}</div></div>;
}
