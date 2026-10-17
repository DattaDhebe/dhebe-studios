import type { Metadata } from 'next';
import { StudiosHub } from '@/components/studios-hub';
import { toolDirectory } from '@/lib/tool-directory';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { SITE_NAME, SUPPORT_EMAIL, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE_NAME} - Free Online Tools, Studios & Mobile Apps`,
  description:
    'Professional tools suite featuring a Base64 Converter, PDF Studio, Calculator Studio, Email Template Editor, and DhebeVoice app pages. Encode, decode, compress, merge, calculate, design, and access privacy-first product information.',
  keywords: [
    'dhebe studios',
    'free online tools',
    'base64 tools',
    'pdf tools',
    'calculator tools',
    'email templates',
    'text reader app',
    'dhebevoice privacy policy',
    'encoding tools',
    'online utilities',
  ],
  alternates: {
    canonical: siteRoute('/'),
  },
  openGraph: {
    title: `${SITE_NAME} - Professional Tools Suite`,
    description:
      'Free online tools for Base64 encoding, PDF workflows, calculators, email design, and DhebeVoice app information with public privacy-policy access.',
    url: siteRoute('/'),
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Professional Tools Suite`,
    description: 'Free online tools plus DhebeVoice app information. Local editing and temporary document conversion.',
  },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        name: SITE_NAME,
        url: siteRoute('/'),
        description:
          'Professional tools suite featuring a Base64 Converter, PDF Studio, Calculator Studio, Email Template Editor, and DhebeVoice app information.',
        potentialAction: {
          '@type': 'SearchAction',
          target: siteRoute('/?q={search_term_string}'),
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        name: SITE_NAME,
        url: siteRoute('/'),
        email: SUPPORT_EMAIL,
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'customer support',
          email: SUPPORT_EMAIL,
          availableLanguage: ['English'],
          url: siteRoute('/'),
        },
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
        ]}
      />
      <script
        id="home-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <StudiosHub tools={toolDirectory} />
    </>
  );
}
