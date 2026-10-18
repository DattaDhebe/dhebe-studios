import type { Metadata } from 'next';
import { SupportClient } from '@/components/support-client';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { SITE_NAME, SUPPORT_EMAIL, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Support',
  description:
    `Get help for the Base64 Converter, PDF Studio, Calculator Studio, Email Template Editor, and DhebeVoice. Learn tool usage, privacy-first processing, and common workflows across all ${SITE_NAME} products.`,
  alternates: {
    canonical: siteRoute('/support'),
  },
  openGraph: { images: ['/social-preview.png'],
    title: `Support | ${SITE_NAME}`,
    description:
      'Support and help page for Base64, PDF, calculator, email, and DhebeVoice products, including usage guides, privacy, and contact information.',
    url: siteRoute('/support'),
    type: 'website',
  },
};

export default function SupportPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ContactPage',
        name: `${SITE_NAME} Support`,
        url: siteRoute('/support'),
        description:
          `Support page for ${SITE_NAME} covering Base64, PDF, calculator, email, and DhebeVoice products with privacy and usage guidance.`,
        mainEntity: {
          '@type': 'Organization',
          name: SITE_NAME,
          email: SUPPORT_EMAIL,
          url: siteRoute('/'),
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'customer support',
            email: SUPPORT_EMAIL,
            url: siteRoute('/support'),
            availableLanguage: ['English'],
          },
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Do DHEBE tools upload files to a server?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Core conversion workflows are designed for browser-side processing and privacy-first handling. Files are processed locally in your session.',
            },
          },
          {
            '@type': 'Question',
            name: 'Which tools are available in DHEBE Studios?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'DHEBE Studios includes a Base64 Converter for encode and decode workflows, PDF tools for compression and editing, calculator tools for high-demand utility pages, an Email Template Editor for responsive campaign layouts, and DhebeVoice app pages for Play policy and product information.',
            },
          },
          {
            '@type': 'Question',
            name: 'What if preview is not available for a file?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Some formats and browsers have preview limitations. You can still download the generated file and open it in the appropriate desktop or mobile app.',
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Support', item: '/support/' },
        ]}
      />
      <SupportClient structuredData={structuredData} />
    </>
  );
}
