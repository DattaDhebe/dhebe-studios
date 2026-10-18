import type { Metadata } from 'next';
import Link from 'next/link';
import { calculatorToolPages } from '@/lib/calculator-tool-pages';
import { SITE_NAME, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Calculator Tools Directory - Age, BMI, Percentage, EMI, SIP & GST Calculators',
  description:
    'Browse free online calculators for age, BMI, percentage, EMI, SIP, and GST on dedicated DHEBE tool pages.',
  keywords: [
    'age calculator',
    'bmi calculator',
    'percentage calculator',
    'emi calculator',
    'sip calculator',
    'gst calculator',
    'calculator tools',
  ],
  alternates: {
    canonical: siteRoute('/calculator-tools'),
  },
  openGraph: { images: ['/social-preview.png'],
    title: 'Calculator Tools Directory | DHEBE',
    description:
      'Open dedicated pages for age, BMI, percentage, EMI, SIP, and GST calculators.',
    url: siteRoute('/calculator-tools'),
    type: 'website',
    siteName: SITE_NAME,
  },
};

export default function CalculatorToolsDirectoryPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CollectionPage',
        name: 'Calculator Tools Directory',
        url: siteRoute('/calculator-tools'),
        description:
          `Directory page for dedicated calculator tool pages on ${SITE_NAME}.`,
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
            name: 'Calculator Tools',
            item: siteRoute('/calculator-tools'),
          },
        ],
      },
    ],
  };

  return (
    <main className="theme-page-calculator min-h-screen px-4 py-10 text-[var(--app-text)]">
      <script
        id="calculator-tools-directory-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto max-w-6xl">
        <div className="theme-panel rounded-[2rem] border p-6 sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-600">
            Calculator Directory
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight theme-title">
            Open the exact calculator you need
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 theme-muted sm:text-base">
            Browse dedicated pages for everyday, health, finance, and tax calculators. You can also open the full studio for a unified workbench experience.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {calculatorToolPages.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.path}
                className="theme-card-soft rounded-[1.6rem] border p-5 transition hover:-translate-y-1 hover:border-emerald-300"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-emerald-600">
                  Calculator
                </p>
                <h2 className="mt-3 text-xl font-semibold theme-title">{tool.label}</h2>
                <p className="mt-2 text-sm leading-6 theme-muted">{tool.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-8 rounded-[1.6rem] border border-amber-200 bg-amber-50 px-5 py-5">
            <h2 className="text-lg font-semibold text-amber-950">Want everything in one place?</h2>
            <p className="mt-2 text-sm leading-6 text-amber-900">
              Open Calculator Studio to switch between all six live calculators from a single workbench.
            </p>
            <Link
              href="/calculator-studio/"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-600"
            >
              Open Calculator Studio
              <span aria-hidden="true">-&gt;</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
