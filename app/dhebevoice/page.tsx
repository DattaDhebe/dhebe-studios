import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { DhebeVoiceTesterForm } from '@/components/dhebevoice-tester-form';
import { DhebeVoiceTesterList } from '@/components/dhebevoice-tester-list';
import { UiIcon } from '@/components/ui-icon';
import { SITE_NAME, siteAsset, siteRoute } from '@/lib/site';

const projectUrl = 'https://github.com/DattaDhebe/dhebevoice-app#dhebevoice';

export const metadata: Metadata = {
  title: 'DhebeVoice Early Access - Volunteer Android Testers',
  description: 'Volunteer to test DhebeVoice, an Android text-to-speech reader for text, books, and readable web pages. Leave your email to request early-access testing instructions.',
  alternates: { canonical: siteRoute('/dhebevoice/') },
  openGraph: {
    title: `Test DhebeVoice Early | ${SITE_NAME}`,
    description: 'Help shape an Android reading companion. Volunteer as a tester and request early access.',
    url: siteRoute('/dhebevoice/'),
    type: 'website',
    images: [{ url: siteAsset('/dhebevoice-app-icon.png'), alt: 'DhebeVoice app logo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Volunteer to Test DhebeVoice',
    description: 'Leave your email for Android testing and early-access invitations.',
    images: [siteAsset('/dhebevoice-app-icon.png')],
  },
};

export default function DhebeVoicePage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'DhebeVoice',
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Android',
    description: 'An Android text-to-speech reading companion in closed testing.',
    publisher: { '@type': 'Organization', name: SITE_NAME, url: siteRoute('/') },
    url: siteRoute('/dhebevoice/'),
    image: siteAsset('/dhebevoice-app-icon.png'),
  };
  return (
    <>
      <BreadcrumbSchema items={[{ name: 'Home', item: '/' }, { name: 'DhebeVoice', item: '/dhebevoice/' }]} />
      <script id="dhebevoice-structured-data" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <div className="voice-page tone-voice">
        <section className="voice-hero content-container">
          <div className="voice-copy">
            <div className="voice-identity"><img src="/dhebevoice-app-icon.png" alt="DhebeVoice app logo" width={72} height={72} /><div><p>DhebeVoice</p><span>Android / Closed testing</span></div></div>
            <p className="eyebrow">CALLING CURIOUS LISTENERS</p>
            <h1>Your reading.<br /><span>Out loud.</span></h1>
            <p className="voice-description">Turn text, books, and readable web pages into listening time. We're looking for volunteer Android testers to try DhebeVoice and help make it better.</p>
            <ul className="voice-highlights"><li><UiIcon name="check" width="17" height="17" />Try early builds on your Android phone.</li><li><UiIcon name="check" width="17" height="17" />Tell us what works and what could be simpler.</li><li><UiIcon name="check" width="17" height="17" />Help shape a more useful reading companion.</li></ul>
            <div className="voice-project-links"><a href={projectUrl} target="_blank" rel="noopener noreferrer">Explore the GitHub project <UiIcon name="arrow" width="16" height="16" /></a><Link href="/dhebevoice/privacy-policy/">App privacy policy</Link></div>
          </div>
          <DhebeVoiceTesterForm />
        </section>
        <section className="voice-testing content-container" aria-labelledby="testing-steps-title">
          <div className="section-heading"><div><p className="eyebrow">WHAT HAPPENS NEXT</p><h2 id="testing-steps-title">A small part in something useful.</h2></div></div>
          <div className="voice-steps"><article><span>01</span><h3>Verify your email</h3><p>Use your Google Play email, agree to testing invitations, and enter the one-time code from your inbox.</p></article><article><span>02</span><h3>Wait for your invitation</h3><p>We'll contact selected verified volunteers with testing access and setup instructions when a build is ready.</p></article><article><span>03</span><h3>Listen. Explore. Share.</h3><p>Try the reading and playback experience with content you can use, then tell us about bugs and confusing moments.</p></article></div>
        </section>
        <DhebeVoiceTesterList />
        <section className="voice-about content-container">
          <div><UiIcon name="voice" width="28" height="28" /><h2>A reader worth listening to.</h2><p>The project supports pasted text, TXT, EPUB, text-based PDF, and readable web imports, with local reading progress and playback controls. Features can vary between testing builds.</p></div>
          <div className="voice-testing-note"><h3>Early access means a work in progress.</h3><p>Testing access is not automatic, and signing up does not download or install the app. Source code may include changes that are not in the current Google Play build.</p><a href="https://github.com/DattaDhebe/dhebevoice-app/issues" target="_blank" rel="noopener noreferrer">Share feedback on GitHub <UiIcon name="arrow" width="16" height="16" /></a></div>
        </section>
      </div>
    </>
  );
}
