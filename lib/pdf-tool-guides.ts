interface PdfGuide {
  title: string;
  description: string;
  steps: string[];
  note: string;
  related: string[];
}

// Describe the controls and output of the actual tool, not keyword variations.
export const pdfToolGuides: Record<string, PdfGuide> = {
  organize: {
    title: 'Organize PDF - Reorder Pages Online',
    description: 'Reorder PDF pages in your browser. Move pages up or down and download the rearranged document without uploading it.',
    steps: ['Choose a PDF and wait for the page list.', 'Use the up and down controls to change the page order.', 'Export the organized PDF and check its page sequence.'],
    note: 'This changes page order, not the text inside a page. Keep the original file until you have checked the result.', related: ['remove-pages', 'extract-pages', 'merge'],
  },
  'remove-pages': {
    title: 'Remove PDF Pages - Delete Selected Pages Free',
    description: 'Delete unwanted pages from a PDF online. Enter page numbers or ranges, keep the remaining pages, and download locally.',
    steps: ['Choose the PDF you want to shorten.', 'Enter the page numbers or ranges to remove.', 'Download the PDF containing the remaining pages.'],
    note: 'At least one page must remain. Page numbers refer to the document order, which may differ from numbers printed on a page.', related: ['extract-pages', 'split', 'organize'],
  },
  'extract-pages': {
    title: 'Extract PDF Pages - Save Selected Pages or Ranges',
    description: 'Extract specific PDF pages into a new document. Select individual pages or ranges such as 1-3, 5, and download without uploading.',
    steps: ['Choose a PDF and check its total page count.', 'Enter pages to keep, for example 1-3, 5.', 'Select Extract Pages to download the selected pages as one PDF.'],
    note: 'Use document page positions, not printed page labels. Repeated page numbers are included only once.', related: ['split', 'remove-pages', 'merge'],
  },
  'scan-to-pdf': {
    title: 'Scan to PDF - Combine Scan Images into a PDF',
    description: 'Turn JPG and PNG scan images into a PDF in your browser. Combine saved scans or photos into one downloadable document.',
    steps: ['Select the JPG or PNG images containing your scans.', 'Check that the images are in the order you want.', 'Create and download the combined PDF.'],
    note: 'This uses existing image files; it does not operate a scanner. Image-only pages need OCR if you want searchable text.', related: ['ocr', 'jpg-to-pdf', 'rotate'],
  },
  optimize: {
    title: 'Optimize PDF - Reduce PDF Size for Sharing',
    description: 'Optimize PDF size for sharing and uploads. Choose a compression setting, compare the result, and download from your browser.',
    steps: ['Choose the PDF you need to share.', 'Select a compression preset and run the optimizer.', 'Compare the original and output sizes before downloading.'],
    note: 'Some PDFs are already compressed. Raster-based compression can reduce image quality and remove selectable text, links, or interactive content. Keep your original.', related: ['compress', 'split', 'pdf-to-jpg'],
  },
  repair: {
    title: 'Repair PDF - Try Rebuilding a Damaged Document',
    description: 'Try rebuilding a readable PDF with minor structural problems. Upload a file up to 25 MB and download the repaired copy if recovery succeeds.',
    steps: ['Choose the PDF with opening or structural errors.', 'Select Convert and Download to attempt server-side repair.', 'Open the downloaded copy and check all pages.'],
    note: 'Repair cannot recover missing data or guarantee success for a severely damaged file. Only your selected file is uploaded; temporary source files are deleted after conversion.', related: ['compress', 'organize', 'pdf-to-pdfa'],
  },
  ocr: {
    title: 'OCR PDF - Recognize Text in Scanned PDF Pages',
    description: 'Recognize English text in scanned PDF pages in your browser. Download extracted text or a searchable PDF after reviewing the OCR result.',
    steps: ['Choose a scanned PDF with clear, upright pages.', 'Run OCR and wait for the English recognition model and page processing.', 'Review the recognized text and download text or a searchable PDF.'],
    note: 'OCR accuracy depends on scan quality. This tool uses English recognition; proofreading is needed for handwriting, complex layouts, and unclear scans. Document processing stays on your device.', related: ['scan-to-pdf', 'rotate', 'pdf-to-word'],
  },
  'convert-to-pdf': {
    title: 'Convert to PDF - Create PDF from Images or Text',
    description: 'Create a PDF from JPG or PNG images, pasted text, or simple HTML content. Choose a source type and generate the document in your browser.',
    steps: ['Choose images, text, or HTML as the source type.', 'Select images or paste the source content.', 'Create and download the generated PDF.'],
    note: 'Text and HTML use a simplified layout, not a full browser-page capture. Use the dedicated Word, Excel, or PowerPoint converter for Office files.', related: ['jpg-to-pdf', 'word-to-pdf', 'html-to-pdf'],
  },
  'powerpoint-to-pdf': {
    title: 'PowerPoint to PDF Converter - Convert PPT or PPTX',
    description: 'Convert PowerPoint presentations to PDF online. Upload a PPT, PPTX, or ODP file up to 25 MB and download the converted document.',
    steps: ['Choose a PPT, PPTX, or ODP presentation up to 25 MB.', 'Select Convert and Download to start server conversion.', 'Check the exported slides, fonts, and page layout.'],
    note: 'Fonts and complex slide effects can change during conversion. This uploads only the selected presentation; temporary source files are deleted after conversion.', related: ['pdf-to-powerpoint', 'compress', 'merge'],
  },
  'excel-to-pdf': {
    title: 'Excel to PDF Converter - Convert XLSX, XLS or CSV',
    description: 'Convert Excel spreadsheets to PDF online. Choose XLS, XLSX, ODS, or CSV up to 25 MB and download printable pages.',
    steps: ['Choose an XLS, XLSX, ODS, or CSV file up to 25 MB.', 'Start conversion with Convert and Download.', 'Check column widths and page breaks in the downloaded PDF.'],
    note: 'Set print areas and page orientation in your spreadsheet first for more predictable output. The selected file is uploaded temporarily and deleted after conversion.', related: ['pdf-to-excel', 'merge', 'compress'],
  },
  'html-to-pdf': {
    title: 'HTML to PDF Converter - Convert an HTML File Online',
    description: 'Convert an HTML or HTM file to PDF online. Upload your selected file up to 25 MB and download a PDF for sharing or printing.',
    steps: ['Choose an HTML or HTM file up to 25 MB.', 'Start conversion with Convert and Download.', 'Review the resulting PDF before sharing it.'],
    note: 'This accepts a file, not a live website URL. Scripts and external page assets may not be reproduced. Temporary uploaded source files are deleted after conversion.', related: ['convert-to-pdf', 'word-to-pdf', 'compress'],
  },
  'convert-from-pdf': {
    title: 'Convert from PDF - Export Text, JPG or PNG',
    description: 'Export a PDF as selectable text, JPG pages, PNG pages, or Word-readable HTML. Choose the output format and convert in your browser.',
    steps: ['Choose the export format before selecting your PDF.', 'Select a PDF and adjust any format-specific settings.', 'Run the export and download the result.'],
    note: 'Word-readable HTML is not a DOCX document. Use PDF to Word for DOCX. Text extraction requires selectable text; scans need OCR first.', related: ['pdf-to-jpg', 'pdf-to-png', 'pdf-to-word', 'ocr'],
  },
  'pdf-to-powerpoint': {
    title: 'PDF to PowerPoint Converter - Save PDF Pages as Slides',
    description: 'Convert PDF pages into a PowerPoint PPTX presentation. Each page becomes an image slide, preserving its appearance for presenting.',
    steps: ['Choose a PDF up to 25 MB.', 'Run Convert and Download to generate the PPTX.', 'Open the presentation and check the slide images.'],
    note: 'Slide content is a rendered page image, not individually editable text or shapes. Only the selected PDF is uploaded, and temporary source files are deleted after conversion.', related: ['powerpoint-to-pdf', 'pdf-to-png', 'pdf-to-jpg'],
  },
  'pdf-to-excel': {
    title: 'PDF to Excel Converter - Extract Tables and Text',
    description: 'Convert PDF tables and selectable text into an Excel XLSX workbook online. Upload a PDF up to 25 MB and review the extracted cells.',
    steps: ['Choose a PDF with selectable text or tables.', 'Run Convert and Download to extract a workbook.', 'Review column alignment, numbers, and table boundaries in Excel.'],
    note: 'Scanned pages need OCR first. Complex tables may need cleanup; verify extracted data before using it. Uploaded source files are deleted after conversion.', related: ['excel-to-pdf', 'ocr', 'pdf-to-word'],
  },
  'pdf-to-pdfa': {
    title: 'PDF to PDF/A Converter - Prepare an Archival Copy',
    description: 'Convert a PDF to an archival PDF/A output online. Upload a document up to 25 MB, download the result, and validate it for your archive requirements.',
    steps: ['Choose the PDF you want to archive.', 'Run Convert and Download to prepare the archival output.', 'Validate the result against the PDF/A profile required by your receiving system.'],
    note: 'A filename alone does not prove PDF/A compliance. Check the output with an independent validator before long-term archival submission. Temporary uploaded source files are deleted after conversion.', related: ['repair', 'word-to-pdf', 'compress'],
  },
  edit: {
    title: 'Edit PDF Online - Add Text with a Page Preview',
    description: 'Add text to PDF pages with a live preview in your browser. Position text, export a copy, and keep your original document unchanged.',
    steps: ['Choose a PDF and load the page preview.', 'Add text and position it on the page.', 'Export the edited copy and inspect the result.'],
    note: 'This adds text overlays. It does not rewrite existing paragraphs or safely redact confidential content.', related: ['sign', 'watermark', 'add-page-numbers'],
  },
  rotate: {
    title: 'Rotate PDF Pages Online - Fix Page Orientation',
    description: 'Rotate selected PDF pages in your browser. Correct sideways scans and download a copy without uploading the document.',
    steps: ['Choose a PDF and enter the pages to rotate.', 'Select the rotation angle.', 'Download the PDF and check page orientation.'],
    note: 'Rotation changes page orientation, not the order of pages. Choose Organize PDF to change the page sequence.', related: ['organize', 'ocr', 'crop-pdf'],
  },
  'add-page-numbers': {
    title: 'Add Page Numbers to PDF Online Free',
    description: 'Add page numbers to a PDF free in your browser. Number every page from 1 at the bottom center and download without uploading your document.',
    steps: ['Choose the PDF to number.', 'Select Add Page Numbers to number every page from 1.', 'Download the numbered copy and check its bottom margins.'],
    note: 'Numbers appear at the bottom center with a fixed style. Existing printed numbers are not automatically removed, and the starting number cannot be changed.', related: ['organize', 'merge', 'watermark'],
  },
  watermark: {
    title: 'Watermark PDF - Add a Text Watermark Online',
    description: 'Add a text watermark to PDF pages online. Customize the watermark and download the stamped copy from your browser.',
    steps: ['Choose your PDF and enter watermark text.', 'Adjust the available appearance settings.', 'Apply the watermark and download a copy.'],
    note: 'A watermark is a visible label, not encryption or a guarantee against copying. Keep the original document.', related: ['edit', 'sign', 'add-page-numbers'],
  },
  'crop-pdf': {
    title: 'Crop PDF Online - Trim Page Margins',
    description: 'Trim PDF margins by percentage in your browser. Adjust the visible page area and download a cropped PDF without uploading it.',
    steps: ['Choose a PDF and enter a margin from 0 to 45 percent.', 'Apply the same margin on each side of every page.', 'Download the cropped PDF and check that required content remains visible.'],
    note: 'Cropping hides content outside the page boundary; it does not permanently redact or delete hidden information.', related: ['rotate', 'pdf-to-png', 'organize'],
  },
};
