import { AndroidTesterPage, androidAppMetadata } from '@/components/android-tester-page';
export const metadata = androidAppMetadata('rivetprep');
export default function RivetPrepPage() { return <AndroidTesterPage appId="rivetprep" />; }
