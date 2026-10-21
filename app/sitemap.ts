import type { MetadataRoute } from 'next';
import { calculatorToolPages } from '@/lib/calculator-tool-pages';
import { getPdfToolPath, pdfToolPages } from '@/lib/pdf-tools-pages';
import { base64ToolPages, getBase64ToolPath } from '@/lib/base64-tool-pages';
import { base64CategoryPages } from '@/lib/base64-category-pages';
import { getImageToolPath, imageToolPages } from '@/lib/image-tools-pages';
import { siteRoute } from '@/lib/site';
import { utilityTools } from '@/lib/utility-tools';

export const dynamic = 'force-static';

// Update only when published content changes, not on every rebuild.
const CONTENT_UPDATED = '2026-10-19';
const REFRESHED_URLS = new Set([
  siteRoute('/email-template-editor/'), siteRoute('/split-pdf/'),
  ...base64ToolPages.map(tool => siteRoute(getBase64ToolPath(tool))),
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    '/', '/support/', '/privacy/', '/dhebevoice/', '/dhebevoice/privacy-policy/',
    '/image-studio/', '/pdf-studio/', '/calculator-studio/',
    '/email-template-editor/', '/pdf-tools/', '/calculator-tools/',
    ...Object.values(base64CategoryPages).map(page => page.path),
    ...pdfToolPages.map(getPdfToolPath),
    ...imageToolPages.map(getImageToolPath),
    ...calculatorToolPages.map(tool => tool.path),
    ...base64ToolPages.map(getBase64ToolPath),
    ...Object.values(utilityTools).map(tool => tool.path),
  ];
  return [...new Set(paths.map(path => siteRoute(path)))].map(url => ({
    url,
    lastModified: new Date(REFRESHED_URLS.has(url) ? '2026-10-21' : CONTENT_UPDATED),
  }));
}
