import { pdfToolPages, getPdfToolPath } from './pdf-tools-pages';
import { imageToolPages, getImageToolPath } from './image-tools-pages';
import { calculatorToolPages } from './calculator-tool-pages';
import { converterOptions } from './converters';
import { decoderOptions } from './decoders';
import { utilityTools } from './utility-tools';

export interface DirectoryTool {
  label: string;
  description: string;
  href: string;
  category: string;
  workspace?: string;
}

// Build the small client search index on the server, not from full page copy.
export const toolDirectory: DirectoryTool[] = [
  ...Object.values(utilityTools).map(tool => ({ label: tool.label, description: tool.description, href: tool.path, category: tool.category })),
  ...pdfToolPages.map(tool => ({ label: tool.label, description: tool.description, href: getPdfToolPath(tool), category: 'PDF', workspace: `pdf:${tool.id}` })),
  ...imageToolPages.map(tool => ({ label: tool.label, description: tool.description, href: getImageToolPath(tool), category: 'Images', workspace: `image:${tool.id}` })),
  ...calculatorToolPages.map(tool => ({ label: tool.label, description: tool.description, href: tool.path, category: 'Calculators', workspace: `calculator:${tool.id}` })),
  ...converterOptions.map(tool => ({ label: tool.label, description: tool.description, href: `/tools/${tool.id}-to-base64/`, category: 'Base64', workspace: `code:converter:${tool.id}` })),
  ...decoderOptions.map(tool => ({ label: tool.label, description: tool.description, href: `/tools/base64-to-${tool.id}/`, category: 'Base64', workspace: `code:decoder:${tool.id}` })),
  { label: 'Email Template Editor', description: 'Design, preview, and export responsive emails.', href: '/email-template-editor/', category: 'Email' },
];
