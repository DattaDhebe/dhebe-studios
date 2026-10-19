import { heicTo, isHeic } from './heic/heic-to-1.6.6.js';

self.onmessage = async event => {
  let bitmap;
  try {
    const { file, format } = event.data;
    if (!(file instanceof Blob) || !['image/jpeg', 'image/png'].includes(format) || !(await isHeic(file))) throw new Error('Invalid HEIC input.');
    bitmap = await heicTo({ blob: file, type: 'bitmap' });
    if (bitmap.width * bitmap.height > 40_000_000) throw new Error('Image exceeds 40 megapixels.');
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Offscreen canvas is unavailable.');
    if (format === 'image/jpeg') { context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height); }
    context.drawImage(bitmap, 0, 0);
    const blob = await canvas.convertToBlob({ type: format, quality: 0.9 });
    self.postMessage({ blob, width: bitmap.width, height: bitmap.height });
    canvas.width = canvas.height = 1;
  } catch {
    self.postMessage({ error: 'This HEIC image could not be decoded. Use a supported still photo below 40 megapixels.' });
  } finally { bitmap?.close(); }
};
