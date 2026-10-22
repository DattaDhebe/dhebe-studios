import { AndroidTesterPage, androidAppMetadata } from '@/components/android-tester-page';
export const metadata = androidAppMetadata('rostercairn');
export default function RosterCairnPage() { return <AndroidTesterPage appId="rostercairn" />; }
