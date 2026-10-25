import type { Metadata } from 'next';
import { StudiosHub } from '@/components/studios-hub';
import { AiTradingSection } from '@/components/ai-trading-section';
import { ToolDirectorySection } from '@/components/tool-directory-section';
import { toolDirectory } from '@/lib/tool-directory';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { SITE_NAME, SUPPORT_EMAIL, siteRoute } from '@/lib/site';
import { marriageWebsite } from '@/lib/featured-websites';

const homeTitle = `Free Online Tools & Marriage Biodata | ${SITE_NAME}`;
const homeDescription = 'Use free PDF, image and Base64 tools, calculators, and an email editor. Discover Milan, our marriage biodata maker at shaadi.dhebe.com.';

export const metadata: Metadata = {
  title: { absolute: homeTitle },
  description: homeDescription,
  alternates: {
    canonical: siteRoute('/'),
  },
  openGraph: { images: [{ url: '/home-preview.png', width: 1200, height: 630, alt: 'DHEBE Studios free online tools and Milan marriage biodata maker' }],
    title: homeTitle,
    description: homeDescription,
    url: siteRoute('/'),
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: { images: ['/home-preview.png'],
    card: 'summary_large_image',
    title: homeTitle,
    description: homeDescription,
  },
};

export default function Home() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': siteRoute('/#website'),
        name: SITE_NAME,
        url: siteRoute('/'),
        description: homeDescription,
        publisher: { '@id': siteRoute('/#organization') },
        potentialAction: {
          '@type': 'SearchAction',
          target: siteRoute('/?q={search_term_string}'),
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': siteRoute('/#organization'),
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
      {
        '@type': 'WebPage', '@id': siteRoute('/#webpage'), url: siteRoute('/'),
        name: homeTitle, description: homeDescription,
        isPartOf: { '@id': siteRoute('/#website') },
        mainEntity: { '@id': siteRoute('/#toolkit') },
        hasPart: { '@type': 'WebPageElement', '@id': siteRoute('/#marriage-biodata'), name: 'Marriage biodata maker on Milan', description: marriageWebsite.description, url: siteRoute('/#marriage-biodata') },
      },
      {
        '@type': 'ItemList', '@id': siteRoute('/#toolkit'), name: 'DHEBE Studios tools and websites',
        itemListElement: [
          [marriageWebsite.label + ' on Milan', marriageWebsite.href],
          ['PDF tools', siteRoute('/pdf-studio/')], ['Image tools', siteRoute('/image-studio/')],
          ['Calculators', siteRoute('/calculator-studio/')], ['Base64 converter', siteRoute('/base64-converter/')],
          ['Email template editor', siteRoute('/email-template-editor/')],
        ].map(([name, url], index) => ({ '@type': 'ListItem', position: index + 1, name, url })),
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
      <StudiosHub tools={toolDirectory} featuredApp={<AiTradingSection />} toolIndex={<ToolDirectorySection />} />
    </>
  );
}
