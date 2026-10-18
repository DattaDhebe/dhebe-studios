import type { Metadata } from 'next';
import { PdfToolsWorkbench } from '@/components/pdf-tools-workbench';
import Link from 'next/link';
import { getPdfToolPath, pdfToolPages } from '@/lib/pdf-tools-pages';
import { SITE_NAME, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Free Online PDF Tools - Merge, Compress & Convert PDF',
  description:
    'Use free online PDF tools to merge, compress, split, sign, and convert PDF files. Fast, simple, and easy to use.',
  keywords: [
    'online pdf tools',
    'free pdf tools',
    'pdf converter',
    'pdf editor',
    'pdf tools online',
    'all pdf tools',
    'merge compress convert pdf',
    'pdf tools free',
    'pdf tools without watermark',
    'pdf tools no signup',
    'pdf to word',
    'jpg to pdf',
    'pdf to jpg',
    'merge pdf',
    'compress pdf',
    'word to pdf',
    'split pdf',
    'sign pdf',
  ],
  alternates: {
    canonical: siteRoute('/pdf-tools'),
  },
  openGraph: { images: ['/social-preview.png'],
    title: 'Free Online PDF Tools - Merge, Compress & Convert PDF | DHEBE',
    description:
      'Use free online PDF tools to merge, compress, split, sign, and convert PDF files with browser-based workflows.',
    url: siteRoute('/pdf-tools'),
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: { images: ['/social-preview.png'],
    title: 'Free Online PDF Tools - Merge, Compress & Convert PDF',
    description:
      'Fast, simple online PDF tools for merge, compress, split, sign, and conversion workflows.',
  },
};

export default function PdfToolsPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'PDF Tools Suite | DHEBE',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteRoute('/pdf-tools'),
        description:
          'Free online PDF tools for merge, compress, split, sign, and convert workflows with browser-based processing.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: [
          'PDF to Word',
          'JPG to PDF',
          'PDF to JPG',
          'PDF Merger',
          'PDF Compressor',
          'Word to PDF',
          'PDF Splitter',
          'Sign PDF',
          'Edit PDF',
          'Protect PDF',
          'OCR PDF',
          'Organize PDF',
          'PDF Rotator',
          'PDF Page Remover',
          'No file uploads required',
          'Client-side processing',
          'Privacy guaranteed',
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Home',
            item: siteRoute('/'),
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'PDF Tools',
            item: siteRoute('/pdf-tools'),
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        id="pdf-tools-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PdfToolsWorkbench />

      <section className="mx-auto max-w-[1600px] px-4 pb-16 pt-8 xl:px-6">
        <div className="grid gap-8">
          <div className="theme-panel rounded-[2rem] border p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-800 dark:text-purple-400">
              Online PDF Tools
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title sm:text-4xl">
              Free Online PDF Tools - Merge, Compress &amp; Convert PDF
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 theme-muted sm:text-base">
              Merge, compress, split, sign, and convert PDF files. Open the workflow you need below, including PDF to Word, JPG to PDF, and PDF to JPG. Each tool explains whether it processes files locally or temporarily on our server.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="theme-accent-chip-purple rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                No signup
              </span>
              <span className="theme-accent-chip-purple rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                No watermark
              </span>
              <span className="theme-accent-chip-purple rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                Fast PDF converter
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <section className="theme-panel rounded-[2rem] border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight theme-title">
                Most searched PDF tools
              </h2>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {pdfToolPages
                  .filter((tool) =>
                    ['pdf-to-word', 'jpg-to-pdf', 'pdf-to-jpg', 'merge', 'compress', 'word-to-pdf', 'split', 'sign'].includes(tool.id),
                  )
                  .map((tool) => (
                    <Link
                      key={tool.id}
                      href={getPdfToolPath(tool)}
                      className="theme-card-soft rounded-[1.5rem] border p-5 transition hover:-translate-y-1 hover:border-purple-300"
                    >
                      <p className="text-sm font-semibold theme-title">{tool.label}</p>
                      <p className="mt-2 text-sm leading-6 theme-muted">{tool.description}</p>
                    </Link>
                  ))}
              </div>
            </section>

            <section className="theme-panel rounded-[2rem] border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight theme-title">
                Why use our free PDF tools
              </h2>
              <div className="mt-5 grid gap-3">
                <div className="theme-card-soft rounded-[1.4rem] border p-4">
                  <p className="text-sm leading-7 theme-muted">
                    Use a secure PDF tool online without long setup or bulky installs.
                  </p>
                </div>
                <div className="theme-card-soft rounded-[1.4rem] border p-4">
                  <p className="text-sm leading-7 theme-muted">
                    Manage PDF files for students, office work, job forms, and everyday document sharing.
                  </p>
                </div>
                <div className="theme-card-soft rounded-[1.4rem] border p-4">
                  <p className="text-sm leading-7 theme-muted">
                    Open dedicated pages for each major workflow like merge PDF, compress PDF, PDF to Word, and JPG to PDF.
                  </p>
                </div>
                <div className="theme-card-soft rounded-[1.4rem] border p-4">
                  <p className="text-sm leading-7 theme-muted">
                    Keep the main workflow browser-based so common PDF editing and conversion tasks stay fast and simple.
                  </p>
                </div>
              </div>
            </section>
          </div>

          <section className="theme-panel rounded-[2rem] border p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-800 dark:text-cyan-400">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
              Frequently asked questions
            </h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              <article className="theme-card-soft rounded-[1.5rem] border p-5">
                <h3 className="text-lg font-semibold theme-title">Which PDF tools are most useful?</h3>
                <p className="mt-3 text-sm leading-7 theme-muted">
                  The highest-intent workflows are usually PDF to Word, JPG to PDF, PDF to JPG, merge PDF, compress PDF, Word to PDF, split PDF, and sign PDF.
                </p>
              </article>
              <article className="theme-card-soft rounded-[1.5rem] border p-5">
                <h3 className="text-lg font-semibold theme-title">Can I use these PDF tools without signup?</h3>
                <p className="mt-3 text-sm leading-7 theme-muted">
                  Yes. The goal of PDF Studio is to keep common PDF tasks fast, simple, and easy to open without a long signup flow.
                </p>
              </article>
              <article className="theme-card-soft rounded-[1.5rem] border p-5">
                <h3 className="text-lg font-semibold theme-title">Are these PDF tools useful for students and office work?</h3>
                <p className="mt-3 text-sm leading-7 theme-muted">
                  Yes. Tools like compress PDF, JPG to PDF, split PDF, and PDF to Word are commonly used for assignments, forms, and office documents.
                </p>
              </article>
              <article className="theme-card-soft rounded-[1.5rem] border p-5">
                <h3 className="text-lg font-semibold theme-title">Can I manage PDF files online in one place?</h3>
                <p className="mt-3 text-sm leading-7 theme-muted">
                  Yes. The workbench and dedicated PDF pages let you merge, compress, split, sign, convert, and manage PDF files from one tool suite.
                </p>
              </article>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
