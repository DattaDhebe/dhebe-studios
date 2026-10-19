import { UtilityLandingPage } from '@/components/utility-landing-page';
import { PhotoSignatureTool } from '@/components/photo-signature-tool';
import { utilityMetadata } from '@/lib/utility-tools';

export const metadata = utilityMetadata('photo-signature-formatter');
export default function PhotoSignaturePage() {
  return <UtilityLandingPage id="photo-signature-formatter"><PhotoSignatureTool /></UtilityLandingPage>;
}
