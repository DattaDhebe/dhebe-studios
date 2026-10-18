import { UtilityLandingPage } from '@/components/utility-landing-page';
import { WordCounterTool } from '@/components/word-counter-tool';
import { utilityMetadata } from '@/lib/utility-tools';

export const metadata = utilityMetadata('word-counter');

export default function WordCounterPage() {
  return <UtilityLandingPage id="word-counter"><WordCounterTool /></UtilityLandingPage>;
}
