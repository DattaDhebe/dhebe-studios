import { pdfToolPages, getPdfToolPath } from './pdf-tools-pages';
import { imageToolPages, getImageToolPath } from './image-tools-pages';
import { calculatorToolPages } from './calculator-tool-pages';
import { converterOptions } from './converters';
import { decoderOptions } from './decoders';

export interface DirectoryTool {
  label: string;
  description: string;
  href: string;
  category: string;
}

// Build the small client search index on the server, not from full page copy.
export const toolDirectory: DirectoryTool[] = [
  ...pdfToolPages.map(tool => ({ label: tool.label, description: tool.description, href: getPdfToolPath(tool), category: 'PDF' })),
  ...imageToolPages.map(tool => ({ label: tool.label, description: tool.description, href: getImageToolPath(tool), category: 'Images' })),
  ...calculatorToolPages.map(tool => ({ label: tool.label, description: tool.description, href: tool.path, category: 'Calculators' })),
  ...converterOptions.map(tool => ({ label: tool.label, description: tool.description, href: `/tools/${tool.id}-to-base64/`, category: 'Base64' })),
  ...decoderOptions.map(tool => ({ label: tool.label, description: tool.description, href: `/tools/base64-to-${tool.id}/`, category: 'Base64' })),
  { label: 'Email Template Editor', description: 'Design, preview, and export responsive emails.', href: '/email-template-editor/', category: 'Email' },
  { label: 'Circle Calculator', description: 'Calculate area and circumference.', href: '/tools/circle/', category: 'Calculators' },
];
