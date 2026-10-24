import { testerApps, type TesterAppId } from '@/lib/tester-apps';
import { UiIcon } from './ui-icon';

export function AppPlayLinks({ appId, compact = false }: { appId: TesterAppId; compact?: boolean }) {
  const app = testerApps[appId];
  const joinUrl = 'https://play.google.com/apps/testing/' + app.packageName;
  const storeUrl = 'https://play.google.com/store/apps/details?id=' + app.packageName;

  return <div className={'app-play-access' + (compact ? ' app-play-access-compact' : '')}>
    {!compact && <p className="app-play-intro">Already invited? Start here.</p>}
    <div className="app-play-actions" role="group" aria-label={app.name + ' testing and installation'}>
      <a href={joinUrl} className="app-play-link app-play-join" aria-label={'Join test on Google Play for ' + app.name}>Join test on Google Play <UiIcon name="arrow" width="16" height="16" /></a>
      <a href={storeUrl} className="app-play-link app-play-install" aria-label={'Install from Play Store for ' + app.name}>Install from Play Store <UiIcon name="arrow" width="16" height="16" /></a>
    </div>
    {!compact && <p className="app-play-note">Join the closed test with your invited Google account first. Then install using the same account in the Play Store. Access is limited to eligible testers. Not invited yet? <a href="#tester-signup">Request an invitation</a> using the form on this page.</p>}
  </div>;
}
