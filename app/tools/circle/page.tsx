import { CalculatorLandingPage } from '@/components/calculator-landing-page';
import { buildCalculatorToolMetadata, getCalculatorToolPageById } from '@/lib/calculator-tool-pages';

const tool = getCalculatorToolPageById('circle')!;
export const metadata = buildCalculatorToolMetadata(tool);

export default function CirclePage() {
  return <CalculatorLandingPage tool={tool} />;
}
