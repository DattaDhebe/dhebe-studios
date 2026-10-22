import type { Metadata } from 'next';
import Link from 'next/link';
import { androidApps, type AndroidAppId } from '@/lib/android-apps';
import { siteRoute, SUPPORT_EMAIL } from '@/lib/site';
import { BreadcrumbSchema } from './breadcrumb-schema';

export function appTesterPrivacyMetadata(appId: AndroidAppId): Metadata {
  const title = `${androidApps[appId].name} Website Tester Privacy`;
  return { title, description: `How the optional ${androidApps[appId].name} website tester signup handles verification, consent, public listing, and deletion.`, alternates: { canonical: siteRoute(`/apps/${appId}/tester-privacy/`) }, openGraph: { title, images: ['/social-preview.png'] }, twitter: { card: 'summary', title, images: ['/social-preview.png'] } };
}

export function AppTesterPrivacy({ appId }: { appId: AndroidAppId }) {
  const app = androidApps[appId];
  return <>
    <BreadcrumbSchema items={[{ name: 'Home', item: '/' }, { name: app.name, item: `/apps/${appId}/` }, { name: 'Tester Privacy', item: `/apps/${appId}/tester-privacy/` }]} />
    <article className={`tester-policy content-container tone-${app.tone}`}>
      <p className="eyebrow">OPTIONAL WEBSITE SIGNUP / OCTOBER 22, 2026</p>
      <h1>{app.name} tester privacy.</h1>
      <p>This policy covers the website tester list, not the Android app. Read the separate <a href={app.appPrivacy} target="_blank" rel="noopener noreferrer">Android app privacy policy</a> for app data and optional integrations.</p>
      <section id="website-testers"><h2>What we save and why</h2><p>With your consent, we send a one-time email code to confirm access to your inbox. Verified signup records contain your email, signup and verification times, and the consent version. Optional public-list choices, a display name, and full-email visibility are saved only when you choose them. The list is used for {app.name} testing and early-access invitations, not unrelated marketing.</p><p>Your records are kept in a separate private database on Hostinger Premium hosting, outside public_html. Signing up does not enroll you in DhebeVoice or our other app lists. The services share the authenticated Hostinger mail transport, not tester consent or public lists.</p></section>
      <section><h2>Verification and retention</h2><p>Unconfirmed requests and hashed codes expire after 10 minutes and are removed on the next pruning run. Confirmed records expire after 180 days; duplicate requests do not extend the original signup date. Short-lived counters help limit abuse. The signup service does not store raw visitor IP addresses; hosting infrastructure may maintain its own access logs. Verification confirms inbox access, not a person's identity, app access, or an invitation.</p></section>
      <section><h2>Public only when you choose</h2><p>Public listing is optional and unchecked by default. After verification, opted-in testers can show a masked email and join date, an optional self-provided display name, and, with a separate unchecked-by-default choice, their full email. Anyone, including search engines and spammers, can copy public information. Removing a listing cannot recall third-party copies. Existing testers are not automatically published or transferred between apps.</p></section>
      <section><h2>Change your choices or leave</h2><p>Sign up and verify again to change your public-list preferences. To request removal earlier, contact <a href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(app.name + ' tester list removal')}`}>{SUPPORT_EMAIL}</a> and name the app. We never ask you to email a verification code or mailbox password.</p></section>
      <section><h2>Website analytics</h2><p>Analytics consent is separate and not required for signup. When enabled, signup events identify the app only, never your email, name, code, or challenge token. Read the <Link href="/privacy/">website privacy policy</Link> for website analytics and hosting details.</p></section>
      <Link className="button-primary" href={`/apps/${appId}/#early-access`}>Back to {app.name}</Link>
    </article>
  </>;
}
