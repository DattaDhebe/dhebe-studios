import { UtilityLandingPage } from '@/components/utility-landing-page';
import { TextDiffTool } from '@/components/text-diff-tool';
import { utilityMetadata } from '@/lib/utility-tools';

export const metadata = utilityMetadata('text-diff-checker');
export default function TextDiffPage() {
  return <UtilityLandingPage id="text-diff-checker"><TextDiffTool /></UtilityLandingPage>;
}
