import type { Metadata } from 'next';
import { LegacyRedirectPage } from '@/components/legacy-redirect-page';
import { emailTemplateEditorPath } from '@/lib/email-template-page';
import { SITE_NAME, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Email Studio Redirect',
  description: 'This legacy email editor route now redirects to the current Email Template Editor page.',
  alternates: {
    canonical: siteRoute(emailTemplateEditorPath),
  },
  robots: {
    index: false,
    follow: true,
    googleBot: {
      index: false,
      follow: true,
    },
  },
  openGraph: { images: ['/social-preview.png'],
    title: `Email Studio Redirect | ${SITE_NAME}`,
    description: 'This legacy email editor route now redirects to the current Email Template Editor page.',
    url: siteRoute(emailTemplateEditorPath),
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: { images: ['/social-preview.png'],
    card: 'summary',
    title: `Email Studio Redirect | ${SITE_NAME}`,
    description: 'This legacy email editor route now redirects to the current Email Template Editor page.',
  },
};

export default function LegacyEmailStudioPage() {
  const targetPath = emailTemplateEditorPath.endsWith('/') ? emailTemplateEditorPath : `${emailTemplateEditorPath}/`;
  return <LegacyRedirectPage href={targetPath} label="Email Template Editor" />;
}
