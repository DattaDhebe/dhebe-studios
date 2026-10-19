import { UtilityLandingPage } from '@/components/utility-landing-page';
import { FaviconGeneratorTool } from '@/components/favicon-generator-tool';
import { utilityMetadata } from '@/lib/utility-tools';
export const metadata = utilityMetadata('favicon-generator');
export default function FaviconGeneratorPage() { return <UtilityLandingPage id="favicon-generator"><FaviconGeneratorTool /></UtilityLandingPage>; }
