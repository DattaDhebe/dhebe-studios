export const PDF_IMAGE_LIMITS = { inputBytes: 25 * 1024 * 1024, documentPages: 150, outputPages: 50, outputBytes: 50 * 1024 * 1024, edge: 4096, pixels: 8_000_000 };

export function pdfImageScale(width: number, height: number, dpi: number) {
  if (![width, height, dpi].every(value => Number.isFinite(value) && value > 0)) throw new Error('Invalid page dimensions or resolution.');
  return Math.min(dpi / 72, PDF_IMAGE_LIMITS.edge / Math.max(width, height), Math.sqrt(PDF_IMAGE_LIMITS.pixels / (width * height)));
}

export function pdfImageBasename(filename: string) {
  return filename.replace(/\.pdf$/i, '').replace(/[^a-zA-Z0-9 _.-]/g, '_').replace(/^\.+/, '').trim().slice(0, 100) || 'document';
}
