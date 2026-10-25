export interface ImageTool {
  id: string;
  label: string;
  description: string;
  longDescription: string;
  status: 'ready' | 'soon';
}

export const imageTools: ImageTool[] = [
  {
    id: 'image-compressor',
    label: 'Image Compressor',
    description: 'Reduce image file size.',
    longDescription:
      'Compress JPG, PNG, and WebP images to reduce file size while maintaining visual quality for web and sharing.',
    status: 'ready',
  },
  {
    id: 'image-resizer',
    label: 'Image Resizer',
    description: 'Change image dimensions.',
    longDescription:
      'Resize images to specific pixel widths and heights for social media, blogs, and print.',
    status: 'ready',
  },
  {
    id: 'background-remover',
    label: 'Background Remover',
    description: 'Remove image background.',
    longDescription:
      'Automatically detect and remove backgrounds from photos to create clean, transparent PNG outputs.',
    status: 'ready',
  },
  {
    id: 'jpg-to-png',
    label: 'JPG to PNG',
    description: 'Convert JPG to PNG format.',
    longDescription:
      'Convert JPEG images to PNG in your browser. Conversion keeps the background and cannot restore detail lost in the original JPEG.',
    status: 'ready',
  },
  {
    id: 'png-to-jpg',
    label: 'PNG to JPG',
    description: 'Convert PNG to JPG format.',
    longDescription:
      'Convert PNG images to JPEG format to reduce file size and ensure compatibility with all platforms.',
    status: 'ready',
  },
  {
    id: 'webp-converter',
    label: 'WebP Converter',
    description: 'Convert JPG and PNG to WebP.',
    longDescription:
      'Convert JPG, PNG, or other browser-supported images to WebP for your website. Use the PNG or JPG converter for other output formats.',
    status: 'ready',
  },
  {
    id: 'image-cropper',
    label: 'Image Cropper',
    description: 'Crop and trim images.',
    longDescription:
      'Crop images to specific aspect ratios or custom areas to focus on what matters most.',
    status: 'ready',
  },
];

export function getImageToolById(id: string): ImageTool | undefined {
  return imageTools.find((tool) => tool.id === id);
}
