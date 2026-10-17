export async function loadImage(file: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => {
        if (image.naturalWidth * image.naturalHeight > 40_000_000) reject(new Error('Choose an image smaller than 40 megapixels.'));
        else resolve(image);
      };
      image.onerror = () => reject(new Error('This image cannot be decoded. Use JPG, PNG, or WebP.'));
      image.src = url;
    });
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function transformImage(file: Blob, options: {
  width?: number; height?: number; maintainAspectRatio?: boolean; type?: string;
  quality?: number; crop?: { x: number; y: number; w: number; h: number };
}) {
  const image = await loadImage(file);
  const crop = options.crop ?? { x: 0, y: 0, w: 100, h: 100 };
  if (![crop.x, crop.y, crop.w, crop.h].every(Number.isFinite) || crop.x < 0 || crop.y < 0 || crop.w <= 0 || crop.h <= 0 || crop.x + crop.w > 100 || crop.y + crop.h > 100) throw new Error('Keep the crop area inside the image.');
  const sourceWidth = image.naturalWidth * crop.w / 100;
  const sourceHeight = image.naturalHeight * crop.h / 100;
  const width = Math.round(options.width ?? sourceWidth);
  const height = Math.round(options.maintainAspectRatio && options.width ? width * sourceHeight / sourceWidth : options.height ?? sourceHeight);
  if (![width, height].every(Number.isFinite) || width < 1 || height < 1 || width > 16384 || height > 16384 || width * height > 40_000_000) throw new Error('Choose valid dimensions up to 16,384 pixels and 40 megapixels.');
  const type = options.type ?? (['image/jpeg', 'image/png', 'image/webp'].includes(file.type) ? file.type : 'image/png');
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  try {
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable.');
    if (type === 'image/jpeg') {
      context.fillStyle = '#fff';
      context.fillRect(0, 0, width, height);
    }
    context.drawImage(image, image.naturalWidth * crop.x / 100, image.naturalHeight * crop.y / 100, sourceWidth, sourceHeight, 0, 0, width, height);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, type, options.quality ?? 0.9));
    if (!blob || blob.type !== type) throw new Error('Your browser does not support this output format. Try PNG or JPG.');
    return blob;
  } finally {
    canvas.width = canvas.height = 0;
  }
}

export function imageFilename(name: string, mime: string, prefix = '') {
  const extension = mime === 'image/jpeg' ? 'jpg' : mime === 'image/webp' ? 'webp' : 'png';
  return `${prefix}${name.replace(/\.[^.]+$/, '')}.${extension}`;
}
