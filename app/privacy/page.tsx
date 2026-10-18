import type { Metadata } from 'next';
import Link from 'next/link';
import { siteRoute, SUPPORT_EMAIL } from '@/lib/site';
import { AnalyticsPreferencesButton } from '@/components/analytics';

export const metadata: Metadata = {
  title: 'Website Privacy and Cookie Choices',
  description: 'How DHEBE Studios handles tool inputs, temporary file conversions, optional Google Analytics cookies, and DhebeVoice tester signups.',
  alternates: { canonical: siteRoute('/privacy/') },
};

export default function PrivacyPage() {
  return (
    <article className="content-container py-16 max-w-3xl space-y-8">
      <header><p className="eyebrow">YOUR CHOICES MATTER</p><h1 className="text-4xl theme-title mt-4">Website privacy</h1><p className="theme-muted mt-4">Updated October 18, 2026. This notice covers the DHEBE Studios website, not the Android app.</p></header>
      <section><h2 className="text-2xl theme-title">Files and tool inputs</h2><p className="theme-muted mt-3 leading-7">Most tools process files and inputs in your browser. Tools marked for temporary server processing upload only the file you select to tools.dhebe.com. Source files are deleted after conversion. Do not submit sensitive documents unless you are comfortable with the tool&apos;s stated processing mode.</p></section>
      <section><h2 className="text-2xl theme-title">Optional Google Analytics</h2><p className="theme-muted mt-3 leading-7">Analytics is off until you choose &quot;Allow analytics&quot;. If you allow it, Google receives page views, general device and traffic information, tool selections, supported download formats, and successful tester-signup events. Analytics cookies help distinguish visits. We do not send file contents, filenames, tool inputs, email addresses, URL query strings, or URL fragments in these events. Advertising personalization and Google signals are disabled in our tag.</p><p className="theme-muted mt-3 leading-7">Google processes analytics data under its <a className="underline" href="https://policies.google.com/privacy" rel="noreferrer">privacy policy</a>. Browser Do Not Track and Global Privacy Control signals keep analytics off. You can withdraw consent at any time below; this stops future analytics and clears this site&apos;s Google Analytics cookies. Browser blocking may also prevent analytics from loading.</p><div className="mt-4 underline"><AnalyticsPreferencesButton /></div></section>
      <section><h2 className="text-2xl theme-title">Browser storage and hosting</h2><p className="theme-muted mt-3 leading-7">We store your analytics choice and display theme in your browser. The email editor also uses browser storage for its editing workflow. Hosting and conversion providers may process technical request information to deliver and protect these services. These operational requests are separate from optional Google Analytics.</p></section>
      <section><h2 className="text-2xl theme-title">DhebeVoice testers</h2><p className="theme-muted mt-3 leading-7">Joining the tester list requires separate, explicit email consent. Email addresses and consent records are stored privately on Hostinger, outside the public website directory, for up to 180 days. Analytics consent is not required to join. See the <Link className="underline" href="/dhebevoice/privacy-policy/#website-testers">tester signup details and app privacy policy</Link>.</p></section>
      <section><h2 className="text-2xl theme-title">Contact</h2><p className="theme-muted mt-3 leading-7">For privacy questions or tester-list removal, email <a className="underline" href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p></section>
    </article>
  );
}
