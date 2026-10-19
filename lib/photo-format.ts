import { loadImage } from './image-processing';

export async function formatPhoto(file: File, options: { width: number; height: number; target: number; fit: string; x: number; y: number }, signal: AbortSignal) {
  if (file.size > 25_000_000) throw new Error('Choose an image below 25 MB.');
  if (![options.width, options.height].every(value => Number.isInteger(value) && value >= 16 && value <= 4096)) throw new Error('Choose whole-number dimensions between 16 and 4,096 pixels.');
  if (!Number.isFinite(options.target) || options.target < 1000 || options.target > 10_000_000) throw new Error('Choose a maximum size from 1 to 10,000 KB.');
  if (![options.x, options.y].every(value => Number.isFinite(value) && value >= 0 && value <= 100)) throw new Error('Keep the crop position between 0 and 100.');
  const image = await loadImage(file);
  signal.throwIfAborted();
  const canvas = document.createElement('canvas'); canvas.width = options.width; canvas.height = options.height;
  try {
    const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas is unavailable.');
    context.fillStyle = '#fff'; context.fillRect(0, 0, canvas.width, canvas.height);
    const scale = (options.fit === 'cover' ? Math.max : Math.min)(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
    const width = image.naturalWidth * scale; const height = image.naturalHeight * scale;
    context.drawImage(image, (canvas.width - width) * options.x / 100, (canvas.height - height) * options.y / 100, width, height);
    const encode = async (quality: number) => {
      signal.throwIfAborted();
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/jpeg', quality));
      signal.throwIfAborted();
      if (!blob) throw new Error('Could not export a JPG.');
      return blob;
    };
    let best = await encode(0.1);
    if (best.size > options.target) throw new Error('The size limit cannot be reached at these dimensions. Increase the KB limit or choose smaller dimensions; no stretched or oversized file was created.');
    let low = 0.1; let high = 0.98;
    for (let step = 0; step < 9; step++) {
      const quality = (low + high) / 2; const candidate = await encode(quality);
      if (candidate.size <= options.target) { best = candidate; low = quality; } else high = quality;
    }
    return { blob: best, width: canvas.width, height: canvas.height };
  } finally { canvas.width = canvas.height = 0; }
}
