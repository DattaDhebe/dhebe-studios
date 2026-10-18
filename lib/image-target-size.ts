import { loadImage } from './image-processing';

export async function reduceImageToSize(file: File, targetBytes: number, type: 'image/jpeg' | 'image/webp', signal?: AbortSignal) {
  if (!Number.isFinite(targetBytes) || targetBytes < 1000 || targetBytes > 10000000) throw new Error('Choose a target from 1 to 10,000 KB.');
  if (file.size > 25000000) throw new Error('Choose a file smaller than 25 MB.');
  const image = await loadImage(file);
  const canvas = document.createElement('canvas');
  let width = Math.min(4096, image.naturalWidth);
  let height = Math.max(1, Math.round(image.naturalHeight * width / image.naturalWidth));
  if (height > 4096) { width = Math.max(1, Math.round(width * 4096 / height)); height = 4096; }
  const encode = async (quality: number) => {
    signal?.throwIfAborted();
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, quality));
    signal?.throwIfAborted();
    if (!blob || blob.type !== type) throw new Error('Your browser cannot export that format. Try JPG.');
    return blob;
  };
  try {
    for (let attempt = 0; attempt < 16; attempt++) {
      signal?.throwIfAborted();
      canvas.width = width; canvas.height = height;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Image processing is not available in this browser.');
      if (type === 'image/jpeg') { context.fillStyle = '#fff'; context.fillRect(0, 0, width, height); }
      context.drawImage(image, 0, 0, width, height);
      const high = await encode(0.95);
      if (high.size <= targetBytes) return { blob: high, width, height };
      let best = await encode(0.25);
      if (best.size <= targetBytes) {
        let low = 0.25; let highQuality = 0.95;
        for (let step = 0; step < 7; step++) {
          const middle = (low + highQuality) / 2;
          const candidate = await encode(middle);
          if (candidate.size <= targetBytes) { best = candidate; low = middle; } else highQuality = middle;
        }
        return { blob: best, width, height };
      }
      if (width === 1 && height === 1) break;
      const scale = Math.max(0.2, Math.min(0.85, Math.sqrt(targetBytes / best.size) * 0.9));
      width = Math.max(1, Math.floor(width * scale)); height = Math.max(1, Math.floor(height * scale));
    }
    throw new Error('This target could not be reached. Try a larger size.');
  } finally { canvas.width = canvas.height = 0; }
}
