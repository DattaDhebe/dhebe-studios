import type { Metadata } from 'next';
import Link from 'next/link';
import { androidApps, type AndroidAppId } from '@/lib/android-apps';
import { testerApps } from '@/lib/tester-apps';
import { SITE_NAME, siteAsset, siteRoute } from '@/lib/site';
import { AppTesterForm } from './dhebevoice-tester-form';
import { AppTesterList } from './dhebevoice-tester-list';
import { BreadcrumbSchema } from './breadcrumb-schema';
import { UiIcon } from './ui-icon';
import { AppPlayLinks } from './app-play-links';

export function androidAppMetadata(appId: AndroidAppId): Metadata {
  const app = androidApps[appId];
  const title = `${app.name} Early Access - Volunteer Android Testers`;
  return {
    title, description: app.shortDescription,
    alternates: { canonical: siteRoute(`/apps/${appId}/`) },
    openGraph: { title: `${app.name} | ${SITE_NAME}`, description: app.shortDescription, type: 'website', url: siteRoute(`/apps/${appId}/`), images: [{ url: siteAsset('/social-preview.png'), alt: SITE_NAME }] },
    twitter: { card: 'summary_large_image', title, description: app.shortDescription, images: [siteAsset('/social-preview.png')] },
  };
}

export function AndroidTesterPage({ appId }: { appId: AndroidAppId }) {
  const app = androidApps[appId];
  const schema = { '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: app.name, applicationCategory: app.category, operatingSystem: 'Android 8.0+', description: app.shortDescription, url: siteRoute(`/apps/${appId}/`), image: siteAsset(app.icon), publisher: { '@type': 'Organization', name: SITE_NAME, url: siteRoute('/') } };
  return <>
    <BreadcrumbSchema items={[{ name: 'Home', item: '/' }, { name: app.name, item: `/apps/${appId}/` }]} />
    <script id={appId + '-structured-data'} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
    <div className={`voice-page android-app-page tone-${app.tone}`}>
      <section id="early-access" className="voice-hero content-container">
        <div className="voice-copy">
          <div className="voice-identity"><img src={app.icon} alt={app.name + ' app logo'} width={72} height={72} /><div><p>{app.name}</p><span>Android 8.0+ / Tester invitations</span></div></div>
          <p className="eyebrow">{app.kicker}</p>
          <h1>{app.name}.<br /><span>{app.headline}</span></h1>
          <p className="voice-description">{app.description}</p>
          <ul className="voice-highlights">{app.highlights.map(text => <li key={text}><UiIcon name="check" width="17" height="17" />{text}</li>)}</ul>
          <AppPlayLinks appId={appId} />
          <div className="voice-project-links"><a href={app.appPrivacy} target="_blank" rel="noopener noreferrer">Android app privacy policy <UiIcon name="arrow" width="16" height="16" /></a><Link href={testerApps[appId].privacyPath}>Website tester privacy</Link></div>
        </div>
        <AppTesterForm appId={appId} />
      </section>
      <section className="android-app-features content-container" aria-labelledby="app-features-title">
        <div className="section-heading"><div><p className="eyebrow">A CLOSER LOOK</p><h2 id="app-features-title">What you can help us improve.</h2></div><p>Built for Android. Shaped by feedback.<br />Features may vary between testing builds.</p></div>
        <div className="android-feature-grid">{app.features.map(([title, description], index) => <article key={title}><span className="eyebrow">0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>
      <section className="voice-testing content-container" aria-labelledby="testing-steps-title">
        <div className="section-heading"><div><p className="eyebrow">WHAT HAPPENS NEXT</p><h2 id="testing-steps-title">A little feedback goes a long way.</h2></div></div>
        <div className="voice-steps"><article><span>01</span><h3>Verify your email</h3><p>Use the email linked to your Google Play account and enter the one-time code. You are signing up for {app.name} only, not our other apps.</p></article><article><span>02</span><h3>Wait for an invitation</h3><p>We will contact selected verified volunteers when a testing build is ready. This is not an immediate download or a promise of access.</p></article><article><span>03</span><h3>Try it. Tell us.</h3><p>{app.testingTask}</p></article></div>
      </section>
      <AppTesterList appId={appId} />
      <section className="voice-about content-container"><div><UiIcon name="shield" width="28" height="28" /><h2>Your app data and your choice.</h2><p>{app.dataNote}</p><p>The optional website tester list is separate from the Android app and from our other app lists. Read the <Link href={testerApps[appId].privacyPath}>tester signup privacy details</Link> before joining.</p></div><div className="voice-testing-note"><h3>{app.limitationTitle}</h3><p>{app.limitation}</p><a href={`mailto:support@dhebe.com?subject=${encodeURIComponent(app.name + ' tester feedback')}`}>Share feedback by email <UiIcon name="arrow" width="16" height="16" /></a></div></section>
    </div>
  </>;
}
