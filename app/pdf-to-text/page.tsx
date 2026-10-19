import { UtilityLandingPage } from '@/components/utility-landing-page';
import { TextExtractionTool } from '@/components/text-extraction-tool';
import { utilityMetadata } from '@/lib/utility-tools';
export const metadata = utilityMetadata('pdf-to-text');
export default function PdfToTextPage() { return <UtilityLandingPage id="pdf-to-text"><TextExtractionTool kind="pdf" /></UtilityLandingPage>; }
