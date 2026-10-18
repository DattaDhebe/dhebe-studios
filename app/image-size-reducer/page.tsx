import { UtilityLandingPage } from '@/components/utility-landing-page';
import { ImageSizeTool } from '@/components/image-size-tool';
import { utilityMetadata } from '@/lib/utility-tools';

export const metadata = utilityMetadata('image-size-reducer');

export default function ImageSizePage() {
  return <UtilityLandingPage id="image-size-reducer"><ImageSizeTool /></UtilityLandingPage>;
}
