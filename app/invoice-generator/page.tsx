import { UtilityLandingPage } from '@/components/utility-landing-page';
import { InvoiceGeneratorTool } from '@/components/invoice-generator-tool';
import { utilityMetadata } from '@/lib/utility-tools';
export const metadata = utilityMetadata('invoice-generator');
export default function InvoiceGeneratorPage() { return <UtilityLandingPage id="invoice-generator"><InvoiceGeneratorTool /></UtilityLandingPage>; }
