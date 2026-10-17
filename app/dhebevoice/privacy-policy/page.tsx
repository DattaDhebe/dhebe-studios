import type { Metadata } from 'next';
import Link from 'next/link';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { SITE_NAME, SUPPORT_EMAIL, siteRoute } from '@/lib/site';

const effectiveDate = 'October 17, 2026';
const DHEBEVOICE_PRIVACY_POLICY_URL = siteRoute('/dhebevoice/privacy-policy/');

export const metadata: Metadata = {
  title: 'DhebeVoice Privacy Policy',
  description:
    'Public privacy policy for the DhebeVoice Android text reader app, including local processing, web import behavior, and contact details for Google Play compliance.',
  keywords: [
    'DhebeVoice privacy policy',
    'privacy policy',
    'text reader app policy',
    'Google Play privacy policy',
  ],
  alternates: {
    canonical: DHEBEVOICE_PRIVACY_POLICY_URL,
  },
  openGraph: {
    title: `DhebeVoice Privacy Policy | ${SITE_NAME}`,
    description:
      'Public privacy policy page for the DhebeVoice Android app hosted on DHEBE Studios.',
    url: DHEBEVOICE_PRIVACY_POLICY_URL,
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: `DhebeVoice Privacy Policy | ${SITE_NAME}`,
    description: 'Public privacy policy page for the DhebeVoice Android app.',
  },
};

export default function DhebeVoicePrivacyPolicyPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        name: 'DhebeVoice Privacy Policy',
        url: DHEBEVOICE_PRIVACY_POLICY_URL,
        description: 'Public privacy policy for the DhebeVoice Android app.',
      },
      {
        '@type': 'SoftwareApplication',
        name: 'DhebeVoice',
        operatingSystem: 'Android',
        applicationCategory: 'UtilitiesApplication',
        privacyPolicy: DHEBEVOICE_PRIVACY_POLICY_URL,
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'DhebeVoice', item: '/dhebevoice/' },
          { name: 'Privacy Policy', item: DHEBEVOICE_PRIVACY_POLICY_URL },
        ]}
      />
      <script
        id="dhebevoice-privacy-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="theme-page-home text-[var(--app-text)]">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <article className="rounded-[2rem] border p-6 theme-panel sm:p-8">
            <div className="border-b border-[var(--app-card-border)] pb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-700 dark:text-cyan-400">
                Public Privacy Policy
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight theme-title">
                Privacy Policy for DhebeVoice
              </h1>
              <p className="mt-4 text-sm theme-muted">Effective date: {effectiveDate}</p>
              <p className="mt-4 text-base leading-7 theme-muted">
                DhebeVoice is a text-to-speech reader app developed by Datta Dhebe. This Privacy Policy explains how
                DhebeVoice handles user information.
              </p>
            </div>

            <div className="mt-8 space-y-8 text-sm leading-7 theme-muted">
              <section>
                <h2 className="text-xl font-bold theme-title">Information We Collect</h2>
                <p className="mt-3">
                  The DhebeVoice Android app does not collect, store, sell, or share personal information.
                </p>
                <p className="mt-3">
                  The app does not require account registration, login, or personal profile creation.
                </p>
              </section>

              <section id="website-testers" className="scroll-mt-28">
                <h2 className="text-xl font-bold theme-title">Optional Website Tester Signup</h2>
                <p className="mt-3">
                  The volunteer tester form on this website is separate from using the Android app. If you choose
                  to sign up and give consent, we save your email address, signup time, and consent version in a
                  private database on our Hostinger Premium hosting account, outside the public website folder.
                </p>
                <p className="mt-3">
                  We use this list for DhebeVoice testing and early-access emails, not unrelated marketing. Entries
                  expire after 180 days. Signup requests do not automatically send an invitation or grant app access.
                  To leave the tester list earlier, email{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}?subject=DhebeVoice%20tester%20list%20removal`} className="underline">
                    {SUPPORT_EMAIL}
                  </a>.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Text and Files</h2>
                <p className="mt-3">
                  Text that users type, paste, import, or share into DhebeVoice is processed locally on the user&apos;s
                  device for text-to-speech reading.
                </p>
                <p className="mt-3">
                  DhebeVoice may allow users to import local text files or share text from other apps. This content
                  remains on the user&apos;s device and is not uploaded to our server.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Text-to-Speech</h2>
                <p className="mt-3">
                  DhebeVoice uses the text-to-speech engine installed on the user&apos;s Android device. Voice
                  availability depends on the user&apos;s device and installed TTS services, such as Google Speech
                  Services or other Android TTS engines.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Web Import</h2>
                <p className="mt-3">
                  If users choose to import content from a web page or URL, the app may connect to the requested
                  website to retrieve the page content. The requested website may receive normal technical information
                  such as the URL request, IP address, device or browser request information, or other information
                  according to that website&apos;s own privacy practices.
                </p>
                <p className="mt-3">
                  DhebeVoice does not store web import history on our server and does not sell or share web import
                  data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Advertising</h2>
                <p className="mt-3">The current version of DhebeVoice does not contain ads.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Analytics</h2>
                <p className="mt-3">The current version of DhebeVoice does not use analytics services.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Data Sharing</h2>
                <p className="mt-3">The DhebeVoice Android app does not share user data with third parties.</p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Data Retention and Deletion</h2>
                <p className="mt-3">
                  DhebeVoice may save app settings, selected voice options, reading preferences, and last reading text
                  locally on the user&apos;s device. Users can delete this data by clearing the app data or
                  uninstalling the app.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Children&apos;s Privacy</h2>
                <p className="mt-3">
                  DhebeVoice is intended for users aged 18 and over. The app is not directed to children.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Security</h2>
                <p className="mt-3">
                  The Android app does not upload reading content to our servers. Optional website tester contact
                  details are stored separately in the private list described above. Users should avoid pasting or
                  importing sensitive personal information if they do not want it
                  processed by their device&apos;s text-to-speech engine.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Changes to This Privacy Policy</h2>
                <p className="mt-3">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold theme-title">Contact</h2>
                <p className="mt-3">If you have questions about this Privacy Policy, contact:</p>
                <p className="mt-3">Datta Dhebe</p>
                <p className="mt-1">
                  Email:{' '}
                  <a href="mailto:dattadhebe75@gmail.com" className="font-medium text-cyan-700 underline dark:text-cyan-400">
                    dattadhebe75@gmail.com
                  </a>
                </p>
              </section>
            </div>

            <div className="mt-10 border-t border-[var(--app-card-border)] pt-6">
              <Link
                href="/dhebevoice/"
                className="inline-flex items-center rounded-full border border-[var(--app-card-border)] px-5 py-3 text-sm font-semibold theme-title transition hover:bg-white/70"
                prefetch={false}
              >
                Back to DhebeVoice
              </Link>
            </div>
          </article>
        </div>
      </section>
    </>
  );
}
