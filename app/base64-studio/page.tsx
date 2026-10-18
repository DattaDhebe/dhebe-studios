import type { Metadata } from 'next';
import { LegacyRedirectPage } from '@/components/legacy-redirect-page';
import { SITE_NAME, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Base64 Studio Redirect',
  description: 'This legacy Base64 Studio route now redirects to the current Base64 Converter page.',
  alternates: {
    canonical: siteRoute('/base64-converter/'),
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
    title: `Base64 Studio Redirect | ${SITE_NAME}`,
    description: 'This legacy Base64 Studio route now redirects to the current Base64 Converter page.',
    url: siteRoute('/base64-converter/'),
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: { images: ['/social-preview.png'],
    card: 'summary',
    title: `Base64 Studio Redirect | ${SITE_NAME}`,
    description: 'This legacy Base64 Studio route now redirects to the current Base64 Converter page.',
  },
};

export default function LegacyBase64StudioPage() {
  return <LegacyRedirectPage href="/base64-converter/" label="Base64 Converter" />;
}
