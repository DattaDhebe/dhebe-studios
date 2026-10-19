import { UtilityLandingPage } from '@/components/utility-landing-page';
import { TextExtractionTool } from '@/components/text-extraction-tool';
import { utilityMetadata } from '@/lib/utility-tools';
export const metadata = utilityMetadata('image-to-text');
export default function ImageToTextPage() { return <UtilityLandingPage id="image-to-text"><TextExtractionTool kind="image" /></UtilityLandingPage>; }
