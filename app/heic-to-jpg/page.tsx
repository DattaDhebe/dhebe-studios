import { UtilityLandingPage } from '@/components/utility-landing-page';
import { HeicConverterTool } from '@/components/heic-converter-tool';
import { utilityMetadata } from '@/lib/utility-tools';
export const metadata = utilityMetadata('heic-to-jpg');
export default function HeicToJpgPage() { return <UtilityLandingPage id="heic-to-jpg"><HeicConverterTool /></UtilityLandingPage>; }
