export const moreUtilities = {
  'photo-signature-formatter': {
    label: 'Photo and Signature Formatter', path: '/photo-signature-formatter/', category: 'Images',
    title: 'Photo and Signature Resizer - Dimensions and KB Limit',
    description: 'Prepare a photo or signature with exact pixel dimensions and a maximum JPG size in KB. Crop or add white padding, preview, and download privately in your browser.',
    intro: 'Get a photo or signature ready for an upload form in one place. Set the required width, height, and file-size limit without stretching the image. Review the final JPG before submitting it.',
    steps: ['Select a clear JPG, PNG, or WebP photo or signature.', 'Enter the dimensions and maximum KB from your current form. Choose padding or adjust the crop position.', 'Prepare the JPG, inspect its readability, and download it. Confirm any minimum-size or live-photo rules separately.'],
    faqs: [
      { question: 'Are the presets official passport or exam requirements?', answer: 'No. They are starting dimensions only. Requirements vary by application and year; some forms require a live photograph and do not accept an existing image. Follow the instructions on the actual form.' },
      { question: 'Will the dimensions change to meet the KB limit?', answer: 'No. This formatter keeps your chosen pixel dimensions and adjusts JPG quality. If the target is impossible at those dimensions, it reports that instead of producing an oversized or stretched file.' },
    ],
  },
  'image-to-text': {
    label: 'Image to Text', path: '/image-to-text/', category: 'Text',
    title: 'Image to Text Converter - Extract Text from Photos',
    description: 'Extract editable text from a photo or screenshot with browser OCR. Choose English, Hindi, or Marathi, review the result, and download a TXT file without uploading.',
    intro: 'Copy the words in a screenshot, printed page, or clear photo without retyping them. Recognition runs on your device, and you can correct the extracted text before saving it.',
    steps: ['Choose a clear JPG, PNG, or WebP image and select its text language.', 'Extract the text. The recognition model downloads on first use; your image is not uploaded.', 'Proofread or edit the result, then download the text file.'],
    faqs: [
      { question: 'Does OCR recognize handwriting perfectly?', answer: 'No. Clear printed text works best. Handwriting, decorative fonts, columns, blur, glare, and mixed languages can produce errors. Always proofread important names and numbers.' },
      { question: 'Which languages and files can I use?', answer: 'English, Hindi, and Marathi models are available. Choose one language per run. Inputs are limited to 25 MB and 40 megapixels and are resized for recognition to limit memory use.' },
    ],
  },
  'heic-to-jpg': {
    label: 'HEIC to JPG Converter', path: '/heic-to-jpg/', category: 'Images',
    title: 'HEIC to JPG Converter - Batch JPG and PNG Export',
    description: 'Convert HEIC or HEIF phone photos to JPG or PNG on your device. Process a small batch, preview each result, and download individual images or a ZIP.',
    intro: 'Make phone photos easier to open, attach, or upload. Convert HEIC files locally and choose JPG for compatibility or PNG for lossless output pixels.',
    steps: ['Select up to 10 HEIC or HEIF images, with a combined input size below 30 MB.', 'Choose JPG or PNG and convert the batch. The decoder loads only when needed.', 'Review each successful image and download it individually or as a ZIP.'],
    faqs: [
      { question: 'Does this preserve Live Photos, HDR, or every frame?', answer: 'No. It exports the first decoded still image in ordinary browser color output. Live Photo video, extra frames, depth information, HDR presentation, and original metadata are not preserved.' },
      { question: 'Why might a HEIC file fail?', answer: 'Damaged files, unsupported codecs, and large images may fail. Inputs are limited to 15 MB each and 30 MB per batch. Memory checks limit output dimensions, but decoder memory also depends on the file and device. Failed items never become fake downloads.' },
    ],
  },
  'json-formatter': {
    label: 'JSON Formatter and Validator', path: '/json-formatter/', category: 'Developer',
    title: 'JSON Formatter and Validator - Beautify or Minify JSON',
    description: 'Validate JSON, find syntax errors, and format or minify it in your browser. Copy or download the result with no uploads, saved drafts, or public sharing.',
    intro: 'Turn a dense API response or configuration into readable JSON. Validate it, choose your indentation, or minify it for transport without sending the content to a server.',
    steps: ['Paste JSON into the input editor.', 'Choose an indentation style or minified output, then validate and format.', 'Review the output, copy it, or download a JSON file.'],
    faqs: [
      { question: 'Will it repair invalid JSON automatically?', answer: 'No. Invalid syntax is reported so you can fix it deliberately. Automatically guessing missing quotes or changing values can alter meaning.' },
      { question: 'Are large integers preserved exactly?', answer: 'Yes. Syntax is validated, then the original number tokens are formatted without converting them into JavaScript numbers. Large integers, negative zero, and exponent notation remain intact. Input is limited to 1 million characters and pretty-printing to 100 nesting levels.' },
    ],
  },
  'invoice-generator': {
    label: 'Invoice and Quotation Generator', path: '/invoice-generator/', category: 'Business',
    title: 'Free Invoice and Quotation Generator - PDF Download',
    description: 'Create an invoice or quotation with line items, discount, tax, and clear totals. Preview and download a PDF locally without an account or saving customer details.',
    intro: 'Prepare a clear invoice or quotation for a client without setting up a billing account. Add the details, review the arithmetic, and export a document you can send yourself.',
    steps: ['Choose invoice or quotation, enter your details and your customer details.', 'Add items, quantities, unit prices, discount, and the tax rate you need.', 'Review the preview and download a PDF. Sending, payment collection, and accounting remain outside this tool.'],
    faqs: [
      { question: 'Is this a tax-compliance or e-invoicing service?', answer: 'No. Tax rates are entered by you; calculations alone do not ensure legal compliance. Add any required identifiers and notes, check your local rules, and use an approved service when e-invoice registration is required.' },
      { question: 'Are customer details saved or sent anywhere?', answer: 'No. The draft lives only in this page and is cleared when you reload. Download PDF uses a limited built-in font and reports unsupported characters. Print / save PDF uses your browser fonts for other languages; choose Save as PDF in the print dialog.' },
    ],
  },
  'pdf-to-text': {
    label: 'PDF to Text Converter', path: '/pdf-to-text/', category: 'PDF',
    title: 'PDF to Text Converter - Extract Text and Download TXT',
    description: 'Extract selectable text from a PDF locally and download TXT. Enable English OCR for scanned pages, review the output, and keep your document on your device.',
    intro: 'Get the words out of a PDF without converting it into another office document. Extract selectable text quickly, or enable OCR for scanned pages that have no text layer.',
    steps: ['Choose a PDF up to 25 MB and 150 pages. Enable English OCR if it contains scanned pages.', 'Extract the text and follow the page progress. OCR models load only when needed.', 'Review the reading order, correct the text, and download TXT.'],
    faqs: [
      { question: 'Will TXT keep the tables, fonts, and page layout?', answer: 'No. TXT contains plain text and page separators, not the original layout. Columns, tables, unusual encodings, and reading order may need manual correction.' },
      { question: 'What happens when a PDF is a scan?', answer: 'Without OCR, image-only pages have no text to extract. Enable English OCR to recognize those pages. Recognition takes longer and can make mistakes; password-protected PDFs must be opened by their owner first.' },
    ],
  },
  'text-diff-checker': {
    label: 'Text and Code Diff Checker', path: '/text-diff-checker/', category: 'Developer',
    title: 'Text Diff Checker - Compare Text and Code Online',
    description: 'Compare two texts or code snippets and highlight added, removed, and unchanged lines. Download a comparison report with no uploads or saved document contents.',
    intro: 'See what changed between two versions without scanning them line by line yourself. Paste the original and updated text, compare, and inspect the highlighted differences.',
    steps: ['Paste the original text and its updated version.', 'Compare the texts to see added, removed, and unchanged lines.', 'Review or download the plain-text comparison. Clear both editors when finished.'],
    faqs: [
      { question: 'Does this detect plagiarism or equivalent code?', answer: 'No. It compares lines exactly, including spaces and letter case. It does not interpret meaning, execute code, or detect paraphrasing.' },
      { question: 'Why is there a comparison limit?', answer: 'Each side supports up to 100,000 characters and 3,000 lines, with at most 2 million line pairs. These limits keep the browser responsive. Compare smaller sections for very large documents.' },
    ],
  },
  'favicon-generator': {
    label: 'Favicon and App Icon Generator', path: '/favicon-generator/', category: 'Developer',
    title: 'Favicon Generator - Download ICO, PNG and App Icons',
    description: 'Turn a JPG, PNG, or WebP into favicon.ico, PNG favicons, an Apple touch icon, and app icons. Download a ZIP with a starter manifest and setup instructions.',
    intro: 'Give a website or web app a consistent icon set from one image. Fit the full design inside a square, choose the padding color, and download the files together.',
    steps: ['Choose a clear square-friendly JPG, PNG, or WebP image.', 'Choose a background color and generate the icon package.', 'Preview the result, download the ZIP, and adapt its starter manifest and HTML links to your site.'],
    faqs: [
      { question: 'Which files are included?', answer: 'The ZIP contains 16, 32, 48, 180, 192, and 512 pixel PNG files, a 32 pixel PNG-backed ICO, and a starter web manifest. It does not create a native app or install anything.' },
      { question: 'Will a detailed rectangular logo work well?', answer: 'The full image is fitted without stretching, which can leave padding. Small favicons work best with a simple, high-contrast symbol. Review the small previews before publishing.' },
    ],
  },
} as const;
