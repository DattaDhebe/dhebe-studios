import { UtilityLandingPage } from '@/components/utility-landing-page';
import { QrCodeTool } from '@/components/qr-code-tool';
import { utilityMetadata } from '@/lib/utility-tools';

export const metadata = utilityMetadata('qr-code-generator');

export default function QrCodePage() {
  return <UtilityLandingPage id="qr-code-generator"><QrCodeTool /></UtilityLandingPage>;
}
