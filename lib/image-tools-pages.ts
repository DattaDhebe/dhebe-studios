export interface ImageToolPageEntry {
  slug: string;
  id: string;
  label: string;
  description: string;
  longDescription: string;
  path?: string;
}

export const imageToolPages: ImageToolPageEntry[] = [
  {
    slug: 'image-compressor',
    id: 'image-compressor',
    label: 'Image Compressor',
    description: 'Compress JPG, PNG, and WebP images online.',
    longDescription: 'Reduce image file size with adjustable quality. PNG images may be saved as WebP.',
    path: '/image-tools/image-compressor',
  },
  {
    slug: 'image-resizer',
    id: 'image-resizer',
    label: 'Image Resizer',
    description: 'Resize images to any dimension.',
    longDescription: 'Change pixel dimensions or scale by percentage.',
    path: '/image-tools/image-resizer',
  },
  {
    slug: 'background-remover',
    id: 'background-remover',
    label: 'Background Remover',
    description: 'Remove background from images automatically.',
    longDescription: 'Create transparent PNGs with AI-powered removal.',
    path: '/image-tools/background-remover',
  },
  {
    slug: 'jpg-to-png',
    id: 'jpg-to-png',
    label: 'JPG to PNG',
    description: 'Convert JPG images to PNG format.',
    longDescription: 'Convert JPEG to PNG in your browser. The original background is kept; this does not remove backgrounds.',
    path: '/image-tools/jpg-to-png',
  },
  {
    slug: 'png-to-jpg',
    id: 'png-to-jpg',
    label: 'PNG to JPG',
    description: 'Convert PNG images to JPG format.',
    longDescription: 'Efficient conversion for smaller file sizes.',
    path: '/image-tools/png-to-jpg',
  },
  {
    slug: 'webp-converter',
    id: 'webp-converter',
    label: 'WebP Converter',
    description: 'Convert JPG and PNG images to WebP format.',
    longDescription: 'Modern web format conversion for better performance.',
    path: '/image-tools/webp-converter',
  },
  {
    slug: 'image-cropper',
    id: 'image-cropper',
    label: 'Image Cropper',
    description: 'Crop and trim your images online.',
    longDescription: 'Adjust aspect ratios and focus on your subjects.',
    path: '/image-tools/image-cropper',
  },
];

export function getImageToolPath(tool: ImageToolPageEntry) {
  return tool.path ?? `/image-tools/${tool.slug}`;
}

export function getImageToolPageBySlug(slug: string): ImageToolPageEntry | undefined {
  return imageToolPages.find((tool) => tool.slug === slug);
}

export function getImageToolPageById(id: string): ImageToolPageEntry | undefined {
  return imageToolPages.find((tool) => tool.id === id);
}
