import type { Metadata } from 'next';
import { SITE_NAME, siteRoute } from './site';

export const utilityTools = {
  'image-size-reducer': {
    label: 'Image Size Reducer', path: '/image-size-reducer/', category: 'Images',
    title: 'Reduce Image Size in KB - 20, 50, 100 or 200 KB',
    description: 'Reduce a JPG, PNG or WebP image below a chosen KB limit. Preview the result and download JPG or WebP for forms and uploads. No account or upload needed.',
    intro: 'A form asks for a smaller photo, but the usual quality slider leaves you guessing. Choose your maximum size in KB and let the browser find a smaller image. Review the result before you use it.',
    steps: ['Choose a JPG, PNG, or WebP from your device.', 'Enter a size limit or choose 20, 50, 100, 200, or 500 KB. Choose JPG for broad form compatibility.', 'Reduce the image, check its dimensions and legibility, then download the result.'],
    faqs: [
      { question: 'Will my image be exactly 100 KB?', answer: 'The result is at or below the selected limit, not padded to an exact size. This tool uses 1 KB = 1,000 bytes to keep below common upload limits.' },
      { question: 'Does compression change the image dimensions?', answer: 'It first tries lower image quality, then reduces dimensions if needed. Large images are initially limited to a maximum edge of 4,096 pixels. The final dimensions are shown before download.' },
      { question: 'Can I use this for a photo or signature upload?', answer: 'Yes, but always check the current form instructions. A size limit alone does not guarantee accepted dimensions, aspect ratio, format, background, or readable detail. JPG flattens transparent areas onto white.' },
    ],
  },
  'qr-code-generator': {
    label: 'QR Code Generator', path: '/qr-code-generator/', category: 'Utilities',
    title: 'Free QR Code Generator - Download PNG and SVG',
    description: 'Create a static QR code for a website URL or text. Download sharp PNG or scalable SVG without a sign-up, watermark, expiry service, or tracking redirect.',
    intro: 'Make a scannable link for a menu, flyer, event, or business card. Your destination is encoded directly in the QR code, not routed through a subscription or tracking service.',
    steps: ['Choose a website URL or plain text, then enter the content to encode.', 'Choose a PNG size and generate your black-and-white code.', 'Download PNG for digital use or SVG for print. Scan-test the downloaded file before distributing it.'],
    faqs: [
      { question: 'Do these QR codes expire?', answer: 'A static QR code has no expiry service. A linked website still needs to remain available, and its address cannot be changed inside an already printed code.' },
      { question: 'What is the difference between PNG and SVG?', answer: 'PNG is a bitmap image for everyday sharing. SVG scales cleanly for printing. Keep the white margin around either format, maintain contrast, and test at the final print size.' },
      { question: 'Is my QR content uploaded or tracked?', answer: 'No. Generation happens in your browser. We do not store the encoded content, create a redirect, or record scans. Opening a linked website is subject to that website\'s own privacy practices.' },
    ],
  },
  'word-counter': {
    label: 'Word and Character Counter', path: '/word-counter/', category: 'Text',
    title: 'Word Counter - Characters, Paragraphs and Reading Time',
    description: 'Count words, characters with and without whitespace, and paragraphs as you type. Estimate reading and speaking time. Free, browser-only, and no sign-up.',
    intro: 'Check an essay, application, caption, script, or draft without sending it to a server. Counts update as you type, with estimated reading and speaking times to help plan your next edit.',
    steps: ['Paste or type your text into the editor.', 'Review word, character, whitespace-free character, and paragraph counts.', 'Use the timing estimates as a guide, and clear the editor when you are finished.'],
    faqs: [
      { question: 'Why might the count differ from my writing app?', answer: 'Different editors treat hyphens, punctuation, emoji, and language boundaries differently. Modern browsers use language-aware segmentation here. Paragraphs are separated by blank lines; a single line break does not create another paragraph.' },
      { question: 'How is reading time calculated?', answer: 'Reading time assumes 225 words per minute and speaking time assumes 150. These are planning estimates, not measurements of your reading ability or an exact presentation duration.' },
      { question: 'Is my draft saved or uploaded?', answer: 'No. The editor keeps text only in the current page memory. Reloading or leaving the page clears it. It does not rewrite, generate, or evaluate your text.' },
    ],
  },
} as const;

export type UtilityToolId = keyof typeof utilityTools;

export function utilityMetadata(id: UtilityToolId): Metadata {
  const tool = utilityTools[id];
  return {
    title: tool.title, description: tool.description,
    alternates: { canonical: siteRoute(tool.path) },
    openGraph: { images: ['/social-preview.png'], title: tool.title, description: tool.description, url: siteRoute(tool.path), type: 'website', siteName: SITE_NAME },
    twitter: { images: ['/social-preview.png'], card: 'summary_large_image', title: tool.title, description: tool.description },
  };
}
