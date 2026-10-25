import { PdfToolLandingPage } from '@/components/pdf-tool-landing-page';
import { buildPdfToolMetadata, getPdfSeoPageById } from '@/lib/pdf-seo-pages';
import { getPdfToolPageById } from '@/lib/pdf-tools-pages';

const tool = getPdfToolPageById('pdf-to-png')!;
export const metadata = buildPdfToolMetadata(tool);

export default function PdfToPngPage() {
  return <PdfToolLandingPage tool={tool} seoPage={getPdfSeoPageById(tool.id)!} />;
}
