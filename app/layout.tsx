import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Analytics } from '@/components/analytics';
import { SITE_NAME, SITE_URL, siteAsset, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} - Base64, PDF, Calculator & Email Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    'Free online tools to compress, merge and convert PDFs, resize images, encode Base64, calculate everyday numbers, and design HTML emails. No account needed.',
  applicationName: SITE_NAME,
  keywords: [
    'base64 converter',
    'base64 encoder',
    'pdf compressor',
    'pdf merger',
    'pdf splitter',
    'age calculator',
    'emi calculator',
    'gst calculator',
    'online tools',
    'free tools',
    'dhebe studios',
  ],
  icons: {
    icon: [
      {
        url: '/logo.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/logo.svg',
  },
  authors: [{ name: 'DHEBE Teams', url: siteRoute('/') }],
  creator: 'DHEBE',
  publisher: SITE_NAME,
  referrer: 'origin-when-cross-origin',
  category: 'technology',
  openGraph: { images: ['/social-preview.png'],
    type: 'website',
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Professional Tools Suite`,
    description:
      'Free online tools for Base64, PDF, calculators, and email design. Local editing with temporary server processing for document conversions.',
    locale: 'en_US',
  },
  twitter: { images: ['/social-preview.png'],
    card: 'summary_large_image',
    title: `${SITE_NAME} - Professional Tools Suite`,
    description:
      'Free online Base64, PDF, calculator, and email tools with local editing and temporary document conversion.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: siteRoute('/'),
    logo: siteAsset('/logo4-optimized.webp'),
    sameAs: ['https://github.com/DattaDhebe'],
  };


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preload" href="/fonts/dm-sans-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/space-grotesk-latin.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script id="theme-init" dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('app-theme')==='dark')document.documentElement.dataset.theme='dark'}catch(e){}" }} />
      </head>
      <body>
        <script
          id="site-structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        <div className="min-h-screen flex flex-col">
          <a href="#main-content" className="skip-link">Skip to content</a>
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">{children}</main>
          <Footer />
          <Analytics />
        </div>
      </body>
    </html>
  );
}
