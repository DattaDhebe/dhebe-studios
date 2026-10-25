export interface PdfToolPageEntry {
  slug: string;
  id: string;
  label: string;
  description: string;
  longDescription: string;
  path?: string;
}

export const pdfToolPages: PdfToolPageEntry[] = [
  {
    slug: 'pdf-to-word',
    id: 'pdf-to-word',
    label: 'PDF to WORD',
    description: 'Convert PDF to editable Word online.',
    longDescription: 'Extract text and generate Word-readable output.',
    path: '/pdf-to-word/',
  },
  {
    slug: 'jpg-to-pdf',
    id: 'jpg-to-pdf',
    label: 'JPG to PDF',
    description: 'Convert JPG images into PDF.',
    longDescription: 'Combine one or more JPG files into a PDF.',
    path: '/jpg-to-pdf/',
  },
  {
    slug: 'pdf-to-jpg',
    id: 'pdf-to-jpg',
    label: 'PDF to JPG',
    description: 'Convert PDF pages to JPG.',
    longDescription: 'Export each page as an image file.',
    path: '/pdf-to-jpg/',
  },
  {
    slug: 'pdf-to-png',
    id: 'pdf-to-png',
    label: 'PDF to PNG',
    description: 'Convert selected PDF pages to PNG images free in your browser. Choose resolution and download one PNG or a ZIP, with no file upload.',
    longDescription: 'Save whole PDF pages as PNG images. Select a page range and resolution; your PDF stays on your device.',
    path: '/pdf-to-png/',
  },
  {
    slug: 'merge-pdf',
    id: 'merge',
    label: 'Merge PDF',
    description: 'Combine multiple PDFs into one.',
    longDescription: 'Merge files in order and export a single document.',
    path: '/merge-pdf/',
  },
  {
    slug: 'compress-pdf',
    id: 'compress',
    label: 'Compress PDF',
    description: 'Reduce PDF file size online.',
    longDescription: 'Compress documents using browser-side processing.',
    path: '/compress-pdf/',
  },
  {
    slug: 'word-to-pdf',
    id: 'word-to-pdf',
    label: 'WORD to PDF',
    description: 'Convert Word-style text to PDF.',
    longDescription: 'Paste text content and generate a PDF document.',
    path: '/word-to-pdf/',
  },
  {
    slug: 'split-pdf',
    id: 'split',
    label: 'Split PDF',
    description: 'Split by page range and export.',
    longDescription: 'Create smaller PDFs from larger source files.',
    path: '/split-pdf/',
  },
  {
    slug: 'sign-pdf',
    id: 'sign',
    label: 'Sign PDF',
    description: 'Add signature to PDF online.',
    longDescription: 'Place a drawn or typed signature and export a signed PDF.',
    path: '/sign-pdf/',
  },
  {
    slug: 'organize-pdf',
    id: 'organize',
    label: 'Organize PDF',
    description: 'Reorder and structure PDF pages online.',
    longDescription: 'Organize page order and flow for polished documents.',
  },
  {
    slug: 'remove-pdf-pages',
    id: 'remove-pages',
    label: 'Remove Pages',
    description: 'Delete unwanted pages from PDF.',
    longDescription: 'Remove selected pages and keep the rest.',
  },
  {
    slug: 'extract-pdf-pages',
    id: 'extract-pages',
    label: 'Extract Pages',
    description: 'Extract specific pages into a PDF.',
    longDescription: 'Pick exact pages and export them as a new file.',
  },
  {
    slug: 'scan-to-pdf',
    id: 'scan-to-pdf',
    label: 'Scan to PDF',
    description: 'Convert scanned images into PDF.',
    longDescription: 'Build PDF files from JPG or PNG scan images.',
  },
  {
    slug: 'optimize-pdf',
    id: 'optimize',
    label: 'Optimize PDF',
    description: 'Optimize files for sharing and speed.',
    longDescription: 'Compress PDFs for lighter web-friendly delivery.',
  },
  {
    slug: 'repair-pdf',
    id: 'repair',
    label: 'Repair PDF',
    description: 'Rebuild a clean PDF copy.',
    longDescription: 'Rewrite a PDF in the browser to fix minor structure issues.',
  },
  {
    slug: 'ocr-pdf',
    id: 'ocr',
    label: 'OCR PDF',
    description: 'Make scanned PDFs searchable.',
    longDescription: 'Run OCR to extract selectable text from scans.',
  },
  {
    slug: 'convert-to-pdf',
    id: 'convert-to-pdf',
    label: 'Convert to PDF',
    description: 'Convert images, text, or HTML to PDF.',
    longDescription: 'Create PDFs from browser-friendly source content.',
  },
  {
    slug: 'powerpoint-to-pdf',
    id: 'powerpoint-to-pdf',
    label: 'POWERPOINT to PDF',
    description: 'Convert slide outlines to PDF.',
    longDescription: 'Turn slide notes into a presentation-style PDF.',
  },
  {
    slug: 'excel-to-pdf',
    id: 'excel-to-pdf',
    label: 'EXCEL to PDF',
    description: 'Convert table data to PDF.',
    longDescription: 'Transform CSV or tabular content into a PDF table.',
  },
  {
    slug: 'html-to-pdf',
    id: 'html-to-pdf',
    label: 'HTML to PDF',
    description: 'Convert HTML content into PDF.',
    longDescription: 'Generate PDF output from pasted HTML text and headings.',
  },
  {
    slug: 'convert-from-pdf',
    id: 'convert-from-pdf',
    label: 'Convert from PDF',
    description: 'Convert PDF into Word, text, or JPG.',
    longDescription: 'Export PDF content into browser-friendly output formats.',
  },
  {
    slug: 'pdf-to-powerpoint',
    id: 'pdf-to-powerpoint',
    label: 'PDF to POWERPOINT',
    description: 'Export PDF text into slides.',
    longDescription: 'Create a slide-ready deck file from PDF page text.',
  },
  {
    slug: 'pdf-to-excel',
    id: 'pdf-to-excel',
    label: 'PDF to EXCEL',
    description: 'Export PDF text into Excel.',
    longDescription: 'Create an Excel-readable sheet export from PDF text.',
  },
  {
    slug: 'pdf-to-pdfa',
    id: 'pdf-to-pdfa',
    label: 'PDF to PDF/A',
    description: 'Create an archival-style PDF copy.',
    longDescription: 'Prepare a cleaned archival-style PDF copy in the browser.',
  },
  {
    slug: 'edit-pdf',
    id: 'edit',
    label: 'Edit PDF',
    description: 'Edit content on PDF with live preview.',
    longDescription: 'Place text visually and export edited PDF output.',
  },
  {
    slug: 'rotate-pdf',
    id: 'rotate',
    label: 'Rotate PDF',
    description: 'Rotate selected pages.',
    longDescription: 'Adjust page orientation for scans and exports.',
  },
  {
    slug: 'add-page-numbers',
    id: 'add-page-numbers',
    label: 'Add Page Numbers',
    description: 'Insert page numbers in PDF.',
    longDescription: 'Apply consistent page numbering across documents.',
  },
  {
    slug: 'add-watermark',
    id: 'watermark',
    label: 'Add Watermark',
    description: 'Apply text watermark to pages.',
    longDescription: 'Overlay watermark text for branding or draft marking.',
  },
  {
    slug: 'crop-pdf',
    id: 'crop-pdf',
    label: 'Crop PDF',
    description: 'Crop margins and page area.',
    longDescription: 'Trim outer whitespace with adjustable crop margins.',
  },
];

export function getPdfToolPath(tool: PdfToolPageEntry) {
  return tool.path ?? `/pdf-tools/${tool.slug}`;
}

export function getPdfToolPageBySlug(slug: string): PdfToolPageEntry | undefined {
  return pdfToolPages.find((tool) => tool.slug === slug);
}

export function getPdfToolPageById(id: string): PdfToolPageEntry | undefined {
  return pdfToolPages.find((tool) => tool.id === id);
}
