import type { Metadata } from 'next';
import type { PdfToolPageEntry } from '@/lib/pdf-tools-pages';
import { getPdfToolPath } from '@/lib/pdf-tools-pages';
import { SITE_NAME, siteRoute } from '@/lib/site';

export interface PdfFaqEntry {
  question: string;
  answer: string;
}

export interface PdfSeoPage {
  id: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  intro: string;
  howToTitle: string;
  howToSteps: string[];
  featuresTitle: string;
  features: string[];
  relatedTitle: string;
  relatedToolIds: string[];
  faqs: PdfFaqEntry[];
}

const sharedPdfKeywords = [
  'free online pdf tool',
  'pdf tool online',
  'no signup required',
  'no watermark',
  'secure pdf tool',
  'fast pdf converter',
  'online pdf converter',
  'convert pdf online',
  'manage pdf files',
  'pdf tools for students',
  'pdf tools for office work',
];

export const pdfSeoPages: PdfSeoPage[] = [
  {
    id: 'merge',
    seoTitle: 'Merge PDF Online - Combine PDF Files for Free',
    metaDescription:
      'Merge PDF files online for free. Combine multiple PDFs into one file quickly without signup or watermark.',
    keywords: [
      'merge pdf',
      'merge pdf online',
      'combine pdf',
      'combine pdf files',
      'pdf merger',
      'merge pdf files',
      'merge two pdf files',
      'merge multiple pdf files',
      'merge pdf free',
      'combine pdf online',
      'join pdf files',
      'pdf joiner',
      'merge documents into one pdf',
      'merge pdf without watermark',
      'free pdf merger',
      ...sharedPdfKeywords,
    ],
    intro:
      'Use this free PDF merger to merge PDF online without signup, downloads, or watermark. Combine two PDF files or merge multiple PDF files into one clean document right in your browser.',
    howToTitle: 'How to Merge PDF Files',
    howToSteps: [
      'Upload two or more PDF files in the order you want them combined.',
      'Rearrange the file order if needed before processing.',
      'Click merge to combine PDF files into one document.',
      'Download the merged PDF file instantly to your device.',
    ],
    featuresTitle: 'Why Use Our Free PDF Merger',
    features: [
      'Merge PDF files online for free with no signup required.',
      'Combine multiple PDF files into one output without watermark.',
      'Keep file ordering simple for office work, forms, and student submissions.',
      'Process documents in the browser so the main workflow stays private.',
    ],
    relatedTitle: 'Related PDF Tools',
    relatedToolIds: ['compress', 'split', 'pdf-to-word', 'jpg-to-pdf'],
    faqs: [
      {
        question: 'How to merge PDF files online?',
        answer:
          'Upload the PDFs, arrange them in the right order, and start the merge. The tool combines the selected files into one downloadable PDF.',
      },
      {
        question: 'How to combine multiple PDF files into one?',
        answer:
          'Select all the files you want, reorder them if needed, and run the merge process to combine multiple PDF files into one document.',
      },
      {
        question: 'Can I merge PDF files for free?',
        answer:
          'Yes. This merge PDF tool is free to use and designed for quick browser-based combining without signup.',
      },
      {
        question: 'How to merge two PDF files?',
        answer:
          'Upload both PDF files, confirm their order, and click merge. The tool will generate a single combined PDF.',
      },
      {
        question: 'Is it safe to merge PDF online?',
        answer:
          'This PDF merger is designed around local browser processing so your documents stay on your device during the main workflow.',
      },
    ],
  },
  {
    id: 'compress',
    seoTitle: 'Compress PDF Online - Reduce PDF File Size Free',
    metaDescription:
      'Compress PDF locally with quality presets or try a 100, 200, or 500 KB target. Repack objects or explicitly flatten scans; review the actual size before download.',
    keywords: [
      'compress pdf',
      'compress pdf online',
      'reduce pdf size',
      'reduce pdf file size',
      'pdf compressor',
      'compress pdf file',
      'compress pdf free',
      'make pdf smaller',
      'shrink pdf',
      'pdf size reducer',
      'compress pdf without losing quality',
      'compress pdf to 1mb',
      'compress pdf to 500kb',
      'compress pdf to 200kb',
      'compress pdf to 100kb',
      'reduce pdf size online',
      ...sharedPdfKeywords,
    ],
    intro:
      'Prepare a PDF for an upload limit or email attachment without sending it to a server. Choose quality presets for image-heavy files, or enter a target such as 100, 200, or 500 KB. Targets are not guaranteed: the tool shows the actual size and keeps the smaller original when appropriate.',
    howToTitle: 'How to Compress PDF File Size',
    howToSteps: [
      'Upload the PDF file you want to compress.',
      'Choose a quality preset, or enter a KB target and select structure-preserving or explicitly accepted scan flattening.',
      'Preview the reduced file size and download the compressed PDF.',
      'Repeat with different files when you need to reduce PDF size online again.',
    ],
    featuresTitle: 'Why Use Our PDF Compressor',
    features: [
      'Compress PDF online for common size limits like email and form uploads.',
      'Reduce PDF file size free without a long signup flow.',
      'Make PDF smaller for office, student, and application workflows.',
      'Keep the process fast and browser-based for better privacy.',
    ],
    relatedTitle: 'Related PDF Tools',
    relatedToolIds: ['merge', 'split', 'jpg-to-pdf', 'pdf-to-jpg'],
    faqs: [
      {
        question: 'How to compress PDF file size?',
        answer:
          'Upload the PDF, run the compression step, and download the smaller version. This is useful when you need to fit portal or email size limits.',
      },
      {
        question: 'How to reduce PDF size online?',
        answer:
          'Use the compress PDF tool to shrink the file and download the optimized copy after processing finishes.',
      },
      {
        question: 'How to compress PDF without losing quality?',
        answer:
          'Repacking objects avoids rasterizing pages but may not reduce size enough. Quality presets and scan mode flatten pages and remove selectable text, links, forms, and accessibility structure. Any rewrite can invalidate digital signatures; keep signed originals and inspect the result.',
      },
      {
        question: 'How to compress PDF to 1MB?',
        answer:
          'Select the 1,000 KB preset under target size, choose a method, and try compression. The same control supports 100, 200, and 500 KB or a custom limit. If it cannot reach the target, it says so and offers the best available file without claiming it fits.',
      },
      {
        question: 'How to make PDF smaller?',
        answer:
          'The easiest method is to use a PDF compressor that rewrites the document for a lighter download and sharing size.',
      },
    ],
  },
  {
    id: 'pdf-to-word',
    seoTitle: 'PDF to Word Converter - Convert PDF to DOCX Online',
    metaDescription:
      'Convert PDF to Word online for free. Turn PDF files into editable DOCX documents quickly and easily.',
    keywords: [
      'pdf to word',
      'pdf to word converter',
      'convert pdf to word',
      'pdf to docx',
      'convert pdf to docx',
      'pdf into word',
      'pdf to word online',
      'pdf to word free',
      'convert pdf to editable word',
      'pdf to word document',
      'pdf file to word',
      'pdf to doc',
      'online pdf to word converter',
      'free pdf to word converter',
      'pdf to word without losing formatting',
      ...sharedPdfKeywords,
    ],
    intro:
      'Use this PDF to Word converter to convert PDF to editable Word online for free. It is a fast PDF to DOCX style workflow for extracting text from PDF files into a Word-readable document without a long signup process.',
    howToTitle: 'How to Convert PDF to Word',
    howToSteps: [
      'Upload the PDF file you want to convert.',
      'Let the tool read the document and prepare text extraction.',
      'Start the PDF to Word conversion and wait for processing to finish.',
      'Download the generated Word-readable file and edit it locally.',
    ],
    featuresTitle: 'Why Use Our PDF to Word Converter',
    features: [
      'Convert PDF to Word online without a complex setup.',
      'Useful for editable drafts, office paperwork, and study notes.',
      'Works well for selectable-text PDFs that need Word-friendly output.',
      'Uploads your selected file for temporary conversion and deletes it after processing.',
    ],
    relatedTitle: 'Related PDF Tools',
    relatedToolIds: ['word-to-pdf', 'pdf-to-jpg', 'jpg-to-pdf', 'compress'],
    faqs: [
      {
        question: 'How to convert PDF to Word?',
        answer:
          'Upload the PDF and start the conversion. The tool extracts readable text and packages it into a Word-readable file for download.',
      },
      {
        question: 'How to convert PDF to editable Word?',
        answer:
          'This PDF to Word converter is designed to make text-based PDFs easier to edit after export in a Word-compatible document.',
      },
      {
        question: 'Can I convert PDF to DOCX for free?',
        answer:
          'Yes. This page is built as a free PDF to Word workflow for quick browser-based conversions.',
      },
      {
        question: 'How to convert scanned PDF to Word?',
        answer:
          'Scanned PDFs often need OCR before they become fully editable. If the PDF is image-based, try OCR first for better results.',
      },
      {
        question: 'How to convert PDF to Word without losing formatting?',
        answer:
          'Formatting preservation depends on how the original PDF was built. Text-heavy documents usually convert more cleanly than complex layouts or scans.',
      },
    ],
  },
  {
    id: 'word-to-pdf',
    seoTitle: 'Word to PDF Converter - Convert DOCX to PDF Online',
    metaDescription:
      'Convert Word to PDF online for free. Change DOC and DOCX files into PDF documents quickly.',
    keywords: [
      'word to pdf',
      'word to pdf converter',
      'convert word to pdf',
      'docx to pdf',
      'doc to pdf',
      'convert docx to pdf',
      'word file to pdf',
      'ms word to pdf',
      'word document to pdf',
      'convert word document to pdf',
      'word to pdf online',
      'word to pdf free',
      'docx to pdf converter',
      'free word to pdf converter',
      'convert word to pdf without losing formatting',
      ...sharedPdfKeywords,
    ],
    intro:
      'Convert Word to PDF online for free when you need a clean shareable document. This DOCX to PDF workflow is useful for office files, assignments, reports, and printable records.',
    howToTitle: 'How to Convert Word to PDF',
    howToSteps: [
      'Choose the Word or Word-style content you want to turn into PDF.',
      'Load the document details into the converter workflow.',
      'Start the conversion to create a PDF output.',
      'Download the generated PDF and share or print it as needed.',
    ],
    featuresTitle: 'Why Use Our Word to PDF Converter',
    features: [
      'Convert Word to PDF online without a heavy desktop workflow.',
      'Helpful for DOCX sharing, job applications, assignments, and forms.',
      'Designed for quick PDF creation from Word-style content.',
      'Converts uploaded Office documents and deletes temporary files after processing.',
    ],
    relatedTitle: 'Related PDF Tools',
    relatedToolIds: ['pdf-to-word', 'jpg-to-pdf', 'merge', 'compress'],
    faqs: [
      {
        question: 'How to convert Word to PDF?',
        answer:
          'Load the Word-style content, run the converter, and download the PDF output once processing completes.',
      },
      {
        question: 'How to convert DOCX to PDF?',
        answer:
          'DOCX to PDF follows the same flow: prepare the content, run the conversion, and download the generated PDF file.',
      },
      {
        question: 'Can I convert Word to PDF online?',
        answer:
          'Yes. This Word to PDF converter is built as a browser-based online workflow for quick document export.',
      },
      {
        question: 'How to save Word document as PDF?',
        answer:
          'You can export from desktop software directly or use an online converter like this page when you need a quick browser workflow.',
      },
      {
        question: 'How to convert Word to PDF without losing formatting?',
        answer:
          'Formatting accuracy depends on the source content and layout complexity. Simpler documents usually produce cleaner PDF results.',
      },
    ],
  },
  {
    id: 'jpg-to-pdf',
    seoTitle: 'JPG to PDF Converter - Convert Images to PDF Free',
    metaDescription:
      'Convert JPG images to PDF online for free. Combine multiple JPG, PNG, or JPEG images into one PDF file.',
    keywords: [
      'jpg to pdf',
      'jpg to pdf converter',
      'convert jpg to pdf',
      'image to pdf',
      'jpeg to pdf',
      'png to pdf',
      'photo to pdf',
      'picture to pdf',
      'images to pdf',
      'convert image to pdf',
      'jpg to pdf online',
      'jpg to pdf free',
      'multiple jpg to pdf',
      'combine jpg into pdf',
      'convert photos to pdf',
      'jpg to pdf without watermark',
      'photo to pdf converter',
      'marksheet photo to pdf',
      'document photo to pdf',
      'id proof photo to pdf',
      'passport photo to pdf',
      ...sharedPdfKeywords,
    ],
    intro:
      'Use this JPG to PDF converter to turn photos and scanned images into PDF online for free. It works for JPG, JPEG, PNG, and mixed image uploads, which makes it useful for marksheet photo to PDF, ID proof uploads, and office documents.',
    howToTitle: 'How to Convert JPG to PDF',
    howToSteps: [
      'Upload one or more JPG, JPEG, or PNG images.',
      'Arrange the images in the order you want them to appear in the PDF.',
      'Run the converter to build a single PDF from the selected images.',
      'Download the final PDF file for sharing, printing, or submission.',
    ],
    featuresTitle: 'Why Use Our JPG to PDF Converter',
    features: [
      'Convert image to PDF online for free without a signup wall.',
      'Combine multiple JPG files into one PDF for easier submission.',
      'Useful for student documents, photos, forms, and office paperwork.',
      'Great for common searches like photo to PDF converter and picture to PDF.',
    ],
    relatedTitle: 'Related PDF Tools',
    relatedToolIds: ['pdf-to-jpg', 'merge', 'compress', 'word-to-pdf'],
    faqs: [
      {
        question: 'How to convert JPG to PDF?',
        answer:
          'Upload your images, arrange them in the preferred order, and start the conversion. The tool combines them into a downloadable PDF.',
      },
      {
        question: 'How to convert multiple images to one PDF?',
        answer:
          'Select all the images you need, reorder them if necessary, and run the JPG to PDF conversion to create one file.',
      },
      {
        question: 'How to convert photo to PDF?',
        answer:
          'A photo to PDF converter works the same way: upload the photo, convert it, and download the generated PDF file.',
      },
      {
        question: 'Can I convert JPG to PDF for free?',
        answer:
          'Yes. This JPG to PDF tool is designed as a free online workflow without a long signup requirement.',
      },
      {
        question: 'How to make PDF from images?',
        answer:
          'Upload the images you want, arrange them, and export them together as a single PDF document.',
      },
    ],
  },
  {
    id: 'split',
    seoTitle: 'Split PDF Online - Extract Pages from PDF Free',
    metaDescription:
      'Split PDF files online for free. Extract pages, separate PDF pages, or save selected pages as a new PDF.',
    keywords: [
      'split pdf',
      'split pdf online',
      'pdf splitter',
      'separate pdf pages',
      'extract pdf pages',
      'extract pages from pdf',
      'split pdf file',
      'split pdf into pages',
      'split pdf free',
      'divide pdf',
      'remove pages from pdf',
      'save one page from pdf',
      'separate pdf file',
      'extract selected pages from pdf',
      'split large pdf',
      ...sharedPdfKeywords,
    ],
    intro:
      'Split PDF online to separate PDF pages, extract selected pages, or save one page from a PDF as a new document. This free PDF splitter is useful for assignments, legal packets, office files, and long form uploads.',
    howToTitle: 'How to Split PDF Pages',
    howToSteps: [
      'Upload the PDF file you want to split.',
      'Choose the pages or page range you want to extract.',
      'Start the split process to create a smaller PDF file.',
      'Download the extracted pages or new PDF segment.',
    ],
    featuresTitle: 'Why Use Our Free PDF Splitter',
    features: [
      'Split PDF online without a multi-step desktop workflow.',
      'Extract pages from PDF for forms, assignments, and office sharing.',
      'Useful when you need to save one page from PDF or split large PDF files.',
      'Runs in the browser for a fast privacy-first experience.',
    ],
    relatedTitle: 'Related PDF Tools',
    relatedToolIds: ['merge', 'compress', 'pdf-to-jpg', 'jpg-to-pdf'],
    faqs: [
      {
        question: 'How to split PDF pages?',
        answer:
          'Upload the file, choose the pages or ranges you want, and download the extracted result as a separate PDF.',
      },
      {
        question: 'How to extract pages from PDF?',
        answer:
          'Use the PDF splitter to select specific pages and export only those pages into a new document.',
      },
      {
        question: 'How to save one page from a PDF?',
        answer:
          'Select just that page during the split workflow and export it as a new single-page PDF.',
      },
      {
        question: 'How to separate PDF pages online?',
        answer:
          'The online split PDF flow lets you choose pages or ranges and download them as a new PDF file after processing.',
      },
      {
        question: 'Can I split PDF files for free?',
        answer:
          'Yes. This split PDF page is designed as a free online tool for extracting and separating pages quickly.',
      },
    ],
  },
  {
    id: 'pdf-to-jpg',
    seoTitle: 'PDF to JPG Converter - Convert PDF Pages to Images',
    metaDescription:
      'Convert PDF to JPG online for free. Turn PDF pages into high-quality JPG images quickly.',
    keywords: [
      'pdf to jpg',
      'pdf to jpg converter',
      'convert pdf to jpg',
      'pdf to image',
      'pdf to jpeg',
      'convert pdf to image',
      'pdf pages to jpg',
      'pdf to jpg online',
      'pdf to jpg free',
      'pdf to png',
      'convert pdf pages to images',
      'pdf image converter',
      'extract images from pdf',
      'pdf to photo',
      'convert pdf to high quality jpg',
      ...sharedPdfKeywords,
    ],
    intro:
      'Use this PDF to JPG converter to turn PDF pages into high-quality images online. It is ideal for slides, document previews, design exports, and sharing single pages as JPG files.',
    howToTitle: 'How to Convert PDF to JPG',
    howToSteps: [
      'Upload the PDF file you want to convert.',
      'Let the tool load the document pages for image export.',
      'Run the PDF to JPG conversion to generate page images.',
      'Download the JPG output for each page or use the exported images as needed.',
    ],
    featuresTitle: 'Why Use Our PDF to JPG Converter',
    features: [
      'Convert PDF pages to images directly in the browser.',
      'Useful for previews, design handoff, image sharing, and slide exports.',
      'Works as a PDF to image and PDF to JPEG style workflow.',
      'Fast for common searches like convert PDF to high quality JPG and PDF pages to JPG.',
    ],
    relatedTitle: 'Related PDF Tools',
    relatedToolIds: ['jpg-to-pdf', 'pdf-to-word', 'compress', 'split'],
    faqs: [
      {
        question: 'How to convert PDF to JPG?',
        answer:
          'Upload the PDF, run the conversion, and download the generated JPG images for the document pages.',
      },
      {
        question: 'How to convert PDF pages to images?',
        answer:
          'The tool reads each page and exports image output so you can save or share the document as pictures.',
      },
      {
        question: 'Can I convert PDF to JPG online?',
        answer:
          'Yes. This page is built as an online PDF to JPG converter for quick browser-based use.',
      },
      {
        question: 'How to extract images from PDF?',
        answer:
          'This tool is focused on turning full pages into images. Embedded-image extraction is a different workflow from page export.',
      },
      {
        question: 'How to convert PDF to PNG?',
        answer:
          'This page focuses on PDF to JPG output. PNG export can be added as a related image conversion workflow later.',
      },
    ],
  },
  {
    id: 'sign',
    seoTitle: 'Sign PDF Online - Add Signature to PDF Free',
    metaDescription:
      'Sign PDF documents online for free. Add your digital signature to PDF files quickly and securely.',
    keywords: [
      'sign pdf',
      'sign pdf online',
      'add signature to pdf',
      'pdf signature',
      'digital signature pdf',
      'esign pdf',
      'e sign pdf',
      'online pdf signature',
      'sign document online',
      'sign pdf free',
      'add digital signature to pdf',
      'draw signature on pdf',
      'upload signature to pdf',
      'electronic signature pdf',
      'pdf signer',
      ...sharedPdfKeywords,
    ],
    intro:
      'Sign PDF online for free when you need to add signature to PDF contracts, letters, forms, and approvals. This PDF signer is designed for quick browser-based signing without a slow account setup flow.',
    howToTitle: 'How to Sign PDF Online',
    howToSteps: [
      'Upload the PDF document that needs a signature.',
      'Create, draw, or place the signature in the right location.',
      'Apply the signature to the document and confirm the placement.',
      'Download the signed PDF file for sharing or submission.',
    ],
    featuresTitle: 'Why Use Our PDF Signer',
    features: [
      'Add signature to PDF online without a heavy desktop editor.',
      'Useful for business approvals, office paperwork, and common document signing tasks.',
      'Supports quick browser-based e sign PDF style workflows.',
      'Designed as a no-signup-required PDF tool for fast document handling.',
    ],
    relatedTitle: 'Related PDF Tools',
    relatedToolIds: ['edit', 'pdf-to-word', 'merge', 'compress'],
    faqs: [
      {
        question: 'How to sign PDF online?',
        answer:
          'Upload the PDF, place your signature, and download the signed document once the changes are applied.',
      },
      {
        question: 'How to add signature to PDF?',
        answer:
          'Open the sign PDF tool, choose or draw your signature, position it on the document, and export the signed file.',
      },
      {
        question: 'Can I sign PDF for free?',
        answer:
          'Yes. This sign PDF page is built as a free online signing workflow for everyday document use.',
      },
      {
        question: 'How to create digital signature on PDF?',
        answer:
          'For everyday document signing, you can draw or place a signature visually on the PDF. Certificate-based enterprise signing is a separate advanced workflow.',
      },
      {
        question: 'How to draw signature on PDF?',
        answer:
          'Upload the PDF, use the signature tool to draw your signature, place it on the page, and then export the signed document.',
      },
    ],
  },
];

export function getPdfSeoPageById(id: string) {
  return pdfSeoPages.find((page) => page.id === id);
}

export function buildPdfToolMetadata(tool: PdfToolPageEntry): Metadata {
  const seoPage = getPdfSeoPageById(tool.id);

  if (seoPage) {
    return {
      title: seoPage.seoTitle,
      description: seoPage.metaDescription,
      keywords: seoPage.keywords,
      alternates: {
        canonical: siteRoute(getPdfToolPath(tool)),
      },
      openGraph: { images: ['/social-preview.png'],
        title: `${seoPage.seoTitle} | PDF Studio`,
        description: seoPage.metaDescription,
        url: siteRoute(getPdfToolPath(tool)),
        type: 'website',
        siteName: SITE_NAME,
      },
      twitter: { images: ['/social-preview.png'],
        card: 'summary_large_image',
        title: `${seoPage.seoTitle} | PDF Studio`,
        description: seoPage.metaDescription,
      },
    };
  }

  const title = `${tool.label} Online`;
  const baseKeyword = tool.label.toLowerCase();
  const normalized = baseKeyword.replace(/\s+/g, ' ').trim();
  const onlineVariant = normalized.includes('online') ? normalized : `${normalized} online`;
  const converterVariant = normalized.includes('to') ? `${normalized} converter` : `${normalized} tool`;

  return {
    title,
    description: tool.description,
    keywords: [
      normalized,
      onlineVariant,
      converterVariant,
      'online pdf converter',
      'pdf tools',
      'online pdf tools',
      'free pdf tools',
    ],
    alternates: {
      canonical: siteRoute(getPdfToolPath(tool)),
    },
    openGraph: { images: ['/social-preview.png'],
      title: `${title} | PDF Studio`,
      description: tool.description,
      url: siteRoute(getPdfToolPath(tool)),
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: { images: ['/social-preview.png'],
      card: 'summary_large_image',
      title: `${title} | PDF Studio`,
      description: tool.description,
    },
  };
}
