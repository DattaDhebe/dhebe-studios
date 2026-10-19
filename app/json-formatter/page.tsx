import { UtilityLandingPage } from '@/components/utility-landing-page';
import { JsonFormatterTool } from '@/components/json-formatter-tool';
import { utilityMetadata } from '@/lib/utility-tools';

export const metadata = utilityMetadata('json-formatter');
export default function JsonFormatterPage() {
  return <UtilityLandingPage id="json-formatter"><JsonFormatterTool /></UtilityLandingPage>;
}
