import type { Metadata } from 'next';
import { PdfToolsWorkbench } from '@/components/pdf-tools-workbench';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import Link from 'next/link';
import { getPdfToolPath, pdfToolPages } from '@/lib/pdf-tools-pages';
import { pdfTools } from '@/lib/pdf-tools';
import { SITE_NAME, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: 'PDF Studio - Free Online PDF Tools for Merge, Split, Compress, Convert & More',
  description:
    'Free online PDF Studio for PDF to Word, JPG to PDF, merge, compress, sign, and split. Local PDF editing with temporary server processing for document conversions.',
  keywords: [
    'online pdf converter',
    'pdf converter online',
    'pdf tools',
    'free online pdf tool',
    'pdf tool online',
    'pdf tools without watermark',
    'merge pdf',
    'compress pdf',
    'pdf to jpg',
    'jpg to pdf',
    'pdf to word',
    'word to pdf',
    'sign pdf',
    'split pdf',
    'edit pdf online',
    'rotate pdf',
    'remove pdf pages',
    'add page numbers to pdf',
    'extract pdf pages',
    'ocr pdf online',
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
  alternates: {
    canonical: siteRoute('/pdf-studio'),
  },
  openGraph: { images: ['/social-preview.png'],
    title: 'PDF Studio - Free Online PDF Tools | DHEBE',
    description:
      'Use PDF Studio for PDF to Word, JPG to PDF, PDF to JPG, merge PDF, compress PDF, sign PDF, and other high-demand browser-based workflows.',
    url: siteRoute('/pdf-studio'),
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: { images: ['/social-preview.png'],
    card: 'summary_large_image',
    title: 'PDF Studio - Free Online PDF Tools',
    description:
      'Popular online PDF workflows with privacy-first browser processing and dedicated landing pages for each major tool.',
  },
};

export default function PdfStudioPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `PDF Studio | ${SITE_NAME}`,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteRoute('/pdf-studio'),
        description:
          'Free online PDF studio covering PDF to Word, JPG to PDF, PDF to JPG, merge, compress, sign, split, OCR, and page-management workflows.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: pdfTools.map((tool) => tool.label),
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'PDF Studio', item: '/pdf-studio/' },
        ]}
      />
      <script
        id="pdf-studio-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PdfToolsWorkbench />

      <section className="mx-auto max-w-[1600px] px-4 pb-16 xl:px-6 pt-8">
        <div className="theme-panel rounded-[2rem] border p-6 sm:p-8">
          <div className="grid gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-600">
                Tool Directory
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
                Dedicated Pages for Every PDF Workflow
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 theme-muted sm:text-base">
                Browse a dedicated page for each PDF tool. These pages make it easy to open the exact workflow you need from direct links or the studio directory.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <PdfToolLinkGroup
              title="Core Tools"
                tools={pdfToolPages.filter((tool) =>
                  ['pdf-to-word', 'jpg-to-pdf', 'pdf-to-jpg', 'pdf-to-png', 'merge', 'compress', 'word-to-pdf', 'split', 'sign'].includes(tool.id),
                )}
                accentClass="text-purple-600"
              />
              <PdfToolLinkGroup
                title="More Tools"
                tools={pdfToolPages.filter((tool) =>
                  !['pdf-to-word', 'jpg-to-pdf', 'pdf-to-jpg', 'pdf-to-png', 'merge', 'compress', 'word-to-pdf', 'split', 'sign'].includes(tool.id),
                )}
                accentClass="text-cyan-600"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface PdfToolLinkGroupProps {
  title: string;
  accentClass: string;
  tools: typeof pdfToolPages;
}

function PdfToolLinkGroup({ title, accentClass, tools }: PdfToolLinkGroupProps) {
  return (
    <div>
      <h3 className={`text-sm font-semibold uppercase tracking-[0.22em] ${accentClass}`}>
        {title}
      </h3>
      <div className="mt-4 space-y-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={getPdfToolPath(tool)}
            className="theme-card-soft rounded-[1.5rem] border px-4 py-4 transition hover:border-[var(--app-card-border)] block"
            prefetch={false}
          >
            <p className="text-sm font-semibold theme-title break-words">{tool.label}</p>
            <p className="mt-1 text-xs sm:text-sm leading-6 theme-muted break-words">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
