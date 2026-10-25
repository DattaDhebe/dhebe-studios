interface ImageGuide {
  title: string;
  description: string;
  steps: string[];
  note: string;
  related: string[];
}

export const imageToolGuides: Record<string, ImageGuide> = {
  'image-compressor': {
    title: 'Image Compressor - Reduce JPG, PNG and WebP Size',
    description: 'Compress JPG, PNG, and WebP images free in your browser. Adjust quality, compare file sizes, and download smaller images without uploading.',
    steps: ['Select one or more JPG, PNG, or WebP images.', 'Adjust quality and run compression.', 'Compare the result sizes and download the images you need.'],
    note: 'PNG may be converted to WebP for a smaller result. If recompression is larger, the original file is retained. Lossy compression can change image detail; a target size is not guaranteed.', related: ['image-resizer', 'webp-converter', 'png-to-jpg'],
  },
  'image-resizer': {
    title: 'Image Resizer - Resize Images by Width and Height',
    description: 'Resize JPG, PNG, and WebP images to pixel dimensions online. Keep the aspect ratio or set width and height, then download locally.',
    steps: ['Select the images to resize.', 'Enter pixel width and height. Keep the aspect ratio enabled to avoid stretching.', 'Run resize and download the results.'],
    note: 'Enlarging an image cannot restore missing detail. This tool changes pixel dimensions; use Image Compressor when the main goal is a smaller file size.', related: ['image-compressor', 'image-cropper', 'jpg-to-png'],
  },
  'background-remover': {
    title: 'Background Remover - Create a Transparent PNG',
    description: 'Remove a photo background online and download a transparent PNG. Choose a JPG, PNG, or WebP image up to 25 MB for temporary server processing.',
    steps: ['Choose a JPG, PNG, or WebP photo up to 25 MB.', 'Select Convert and Download to run background removal.', 'Inspect the subject edges in the downloaded PNG.'],
    note: 'AI results can need cleanup around hair, transparent objects, and complex edges. Only the file you select is uploaded; temporary source files are deleted after conversion.', related: ['image-cropper', 'image-resizer', 'png-to-jpg'],
  },
  'jpg-to-png': {
    title: 'JPG to PNG Converter - Convert JPEG Images Free',
    description: 'Convert JPG or JPEG images to PNG online for free. Select images, convert in your browser, and download PNG files without an upload.',
    steps: ['Select the JPG or JPEG images you want to convert.', 'Choose Convert to PNG and wait for completion.', 'Download each PNG or use Download All.'],
    note: 'PNG encoding does not recover detail lost in the original JPEG. Conversion keeps the existing background; use Background Remover if you need a transparent subject.', related: ['png-to-jpg', 'background-remover', 'image-compressor'],
  },
  'png-to-jpg': {
    title: 'PNG to JPG Converter - Convert PNG Images Free',
    description: 'Convert PNG images to JPG online in your browser. Transparent areas become white, and you can download the converted JPEG images free.',
    steps: ['Choose the PNG images to convert.', 'Select Convert to JPG.', 'Download the JPEG results and check the background and image quality.'],
    note: 'JPG has no transparency and uses lossy compression. Transparent areas are flattened onto white. A JPG is not always smaller than the original PNG.', related: ['jpg-to-png', 'webp-converter', 'image-compressor'],
  },
  'webp-converter': {
    title: 'WebP Converter - Convert JPG or PNG to WebP',
    description: 'Convert JPG and PNG images to WebP free in your browser. Create downloadable WebP images for websites without uploading your files.',
    steps: ['Choose images supported by your browser, such as JPG or PNG.', 'Select Convert to WebP.', 'Download the WebP results and compare their quality and file size.'],
    note: 'This page outputs WebP. To turn an existing WebP into PNG or JPG, open the PNG or JPG converter linked below; both accept browser-supported WebP images.', related: ['jpg-to-png', 'png-to-jpg', 'image-compressor'],
  },
  'image-cropper': {
    title: 'Image Cropper - Crop Images Online Free',
    description: 'Crop JPG, PNG, and WebP images in your browser. Set a percentage-based crop area and download the trimmed image without uploading.',
    steps: ['Select the images to crop.', 'Set the crop position, width, and height as percentages.', 'Run crop and download the results.'],
    note: 'The same percentage rectangle applies to each selected image. Cropping removes edges rather than resizing the whole picture; keep originals if you may need a different crop.', related: ['image-resizer', 'image-compressor', 'background-remover'],
  },
};
