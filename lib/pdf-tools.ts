export interface PdfTool {
  id: string;
  label: string;
  description: string;
  longDescription: string;
  status: 'ready' | 'soon';
}

const toolDefinitions: PdfTool[] = [
  {
    id: 'pdf-to-word',
    label: 'PDF to WORD',
    description: 'Convert PDF to editable Word.',
    longDescription:
      'Turn PDF files into Word-readable documents for editing, review, and office workflows.',
    status: 'ready',
  },
  {
    id: 'jpg-to-pdf',
    label: 'JPG to PDF',
    description: 'Convert images into one PDF.',
    longDescription:
      'Combine JPG, JPEG, or PNG images into a single PDF for forms, submissions, and document sharing.',
    status: 'ready',
  },
  {
    id: 'pdf-to-jpg',
    label: 'PDF to JPG',
    description: 'Convert PDF pages to images.',
    longDescription:
      'Export PDF pages as JPG images for previews, design handoff, or easy sharing.',
    status: 'ready',
  },
  {
    id: 'merge',
    label: 'Merge PDF',
    description: 'Combine multiple PDFs into one.',
    longDescription:
      'Merge PDF files in sequence and download one combined document without extra clutter.',
    status: 'ready',
  },
  {
    id: 'compress',
    label: 'Compress PDF',
    description: 'Reduce file size for uploads.',
    longDescription:
      'Compress PDF files for email attachments, college uploads, and form portals while keeping them readable.',
    status: 'ready',
  },
  {
    id: 'word-to-pdf',
    label: 'WORD to PDF',
    description: 'Convert Word-style content to PDF.',
    longDescription:
      'Turn Word-style document content into a shareable PDF for office, student, and printable workflows.',
    status: 'ready',
  },
  {
    id: 'split',
    label: 'Split PDF',
    description: 'Extract pages from PDF.',
    longDescription:
      'Split large PDFs by page ranges or selected pages to create smaller document files.',
    status: 'ready',
  },
  {
    id: 'sign',
    label: 'Sign PDF',
    description: 'Add signature to PDF online.',
    longDescription:
      'Place a signature on PDF documents for contracts, forms, and approvals in a browser-based workflow.',
    status: 'ready',
  },
  {
    id: 'organize',
    label: 'Organize PDF',
    description: 'Reorder PDF pages quickly.',
    longDescription:
      'Rearrange page order and structure for final delivery.',
    status: 'ready',
  },
  {
    id: 'remove-pages',
    label: 'Remove Pages',
    description: 'Delete unwanted pages.',
    longDescription:
      'Remove selected pages and download a clean file.',
    status: 'ready',
  },
  {
    id: 'extract-pages',
    label: 'Extract Pages',
    description: 'Extract pages into a new PDF.',
    longDescription:
      'Select exact pages and export just those pages.',
    status: 'ready',
  },
  {
    id: 'scan-to-pdf',
    label: 'Scan to PDF',
    description: 'Convert scanned images into a PDF.',
    longDescription:
      'Combine JPG or PNG scan images into a clean PDF document.',
    status: 'ready',
  },
  {
    id: 'optimize',
    label: 'Optimize PDF',
    description: 'Optimize PDF for web or sharing.',
    longDescription:
      'Reduce PDF size for quicker sharing with browser-side compression presets.',
    status: 'ready',
  },
  {
    id: 'repair',
    label: 'Repair PDF',
    description: 'Rebuild a clean copy of a PDF.',
    longDescription:
      'Load and rewrite a PDF in the browser to fix minor structure issues.',
    status: 'ready',
  },
  {
    id: 'ocr',
    label: 'OCR PDF',
    description: 'Make scanned PDFs searchable.',
    longDescription:
      'Recognize text from scanned PDFs for search and copy workflows.',
    status: 'ready',
  },
  {
    id: 'convert-to-pdf',
    label: 'Convert to PDF',
    description: 'Convert images, text, or HTML into PDF.',
    longDescription:
      'Build PDFs from browser-friendly image, text, or HTML content.',
    status: 'ready',
  },
  {
    id: 'convert-from-pdf',
    label: 'Convert from PDF',
    description: 'Export PDF content to other formats.',
    longDescription:
      'Export PDF content into Word, text, or JPG outputs.',
    status: 'ready',
  },
  {
    id: 'edit',
    label: 'Edit PDF',
    description: 'Live-edit text on PDF pages.',
    longDescription:
      'Place and edit content directly with live preview before export.',
    status: 'ready',
  },
  {
    id: 'rotate',
    label: 'Rotate PDF',
    description: 'Rotate specific pages.',
    longDescription:
      'Rotate single, range, or custom selected pages.',
    status: 'ready',
  },
  {
    id: 'add-page-numbers',
    label: 'Add Page Numbers',
    description: 'Number all pages automatically.',
    longDescription:
      'Insert page numbers in chosen positions across the document.',
    status: 'ready',
  },
  {
    id: 'watermark',
    label: 'Add Watermark',
    description: 'Overlay text watermark on pages.',
    longDescription:
      'Apply text watermarks with opacity and placement control.',
    status: 'ready',
  },
  {
    id: 'crop-pdf',
    label: 'Crop PDF',
    description: 'Crop page area and margins.',
    longDescription:
      'Trim outer whitespace by applying consistent crop margins.',
    status: 'ready',
  },
  {
    id: 'powerpoint-to-pdf',
    label: 'POWERPOINT to PDF',
    description: 'Turn slide outlines into PDF.',
    longDescription:
      'Paste slide titles and notes, then generate a presentation-style PDF.',
    status: 'ready',
  },
  {
    id: 'excel-to-pdf',
    label: 'EXCEL to PDF',
    description: 'Convert table data into PDF.',
    longDescription:
      'Paste CSV or tabular data and export a clean PDF table.',
    status: 'ready',
  },
  {
    id: 'html-to-pdf',
    label: 'HTML to PDF',
    description: 'Convert HTML content to PDF.',
    longDescription:
      'Turn pasted HTML text and headings into a readable PDF layout.',
    status: 'ready',
  },
  {
    id: 'pdf-to-powerpoint',
    label: 'PDF to POWERPOINT',
    description: 'Export PDF text into slides.',
    longDescription:
      'Convert page text into a slide-ready deck file for presentation cleanup.',
    status: 'ready',
  },
  {
    id: 'pdf-to-excel',
    label: 'PDF to EXCEL',
    description: 'Export PDF text into sheets.',
    longDescription:
      'Extract page text into an Excel-readable sheet export.',
    status: 'ready',
  },
  {
    id: 'pdf-to-pdfa',
    label: 'PDF to PDF/A',
    description: 'Create an archival-style PDF copy.',
    longDescription:
      'Produce a cleaned archival-style PDF copy with normalized metadata.',
    status: 'ready',
  },
];

const serviceTools = new Set(['word-to-pdf', 'powerpoint-to-pdf', 'excel-to-pdf', 'html-to-pdf', 'pdf-to-powerpoint', 'pdf-to-excel', 'pdf-to-pdfa', 'repair']);
export const pdfTools: PdfTool[] = toolDefinitions.map(tool => serviceTools.has(tool.id) ? { ...tool, status: 'ready', longDescription: 'Upload your document for conversion. Temporary files are deleted after the result is prepared.' } : tool);

export function getPdfToolById(id: string): PdfTool | undefined {
  return pdfTools.find((tool) => tool.id === id);
}
