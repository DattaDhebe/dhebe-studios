import type { Metadata } from 'next';
import Link from 'next/link';
import { CalculatorToolsWorkbench } from '@/components/calculator-tools-workbench';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { calculatorToolPages } from '@/lib/calculator-tool-pages';
import { calculatorTools } from '@/lib/calculator-tools';
import { SITE_NAME, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Calculator Studio - Free Online Age, BMI, EMI, SIP, GST & Percentage Calculators',
  description:
    'Free Calculator Studio with live Age, BMI, Percentage, EMI, SIP, and GST calculators. Fast browser-based calculations, privacy-first, and mobile friendly.',
  keywords: [
    'calculator studio',
    'age calculator',
    'bmi calculator',
    'percentage calculator',
    'emi calculator',
    'sip calculator',
    'gst calculator',
    'free online calculator',
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
    canonical: siteRoute('/calculator-studio'),
  },
  openGraph: { images: ['/social-preview.png'],
    title: 'Calculator Studio - Free Online Calculators | DHEBE',
    description:
      'Use DHEBE Calculator Studio for popular health, finance, tax, and percentage calculations with instant browser-based results.',
    url: siteRoute('/calculator-studio'),
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: { images: ['/social-preview.png'],
    card: 'summary_large_image',
    title: 'Calculator Studio - Free Online Calculators',
    description:
      'Popular age, BMI, EMI, SIP, GST, and percentage calculators in one privacy-first studio.',
  },
};

export default function CalculatorStudioPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `Calculator Studio | ${SITE_NAME}`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        url: siteRoute('/calculator-studio'),
        description:
          'Free online calculator studio covering age, BMI, percentage, EMI, SIP, and GST calculations.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: calculatorTools.map((tool) => tool.label),
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Calculator Studio', item: '/calculator-studio/' },
        ]}
      />
      <script
        id="calculator-studio-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorToolsWorkbench />

      <section className="mx-auto max-w-[1600px] px-4 pb-16 pt-8 xl:px-6">
        <div className="theme-panel rounded-[2rem] border p-6 sm:p-8">
          <div className="grid gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Tool Directory
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
                Dedicated Pages for Everyday and Finance Calculators
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 theme-muted sm:text-base">
                Open a specific calculator directly from search, links, or the studio directory. Each page focuses on one high-demand workflow.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <CalculatorToolLinkGroup
                title="Everyday Calculators"
                tools={calculatorToolPages.filter((tool) =>
                  ['age', 'bmi', 'percentage', 'gst'].includes(tool.id),
                )}
                accentClass="text-emerald-600"
              />
              <CalculatorToolLinkGroup
                title="Finance Calculators"
                tools={calculatorToolPages.filter((tool) =>
                  ['emi', 'sip'].includes(tool.id),
                )}
                accentClass="text-amber-600"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface CalculatorToolLinkGroupProps {
  title: string;
  accentClass: string;
  tools: typeof calculatorToolPages;
}

function CalculatorToolLinkGroup({
  title,
  accentClass,
  tools,
}: CalculatorToolLinkGroupProps) {
  return (
    <div>
      <h3 className={`text-sm font-semibold uppercase tracking-[0.22em] ${accentClass}`}>
        {title}
      </h3>
      <div className="mt-4 space-y-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={tool.path}
            className="theme-card-soft block rounded-[1.5rem] border px-4 py-4 transition hover:border-[var(--app-card-border)]"
          >
            <p className="break-words text-sm font-semibold theme-title">{tool.label}</p>
            <p className="mt-1 break-words text-xs leading-6 theme-muted sm:text-sm">
              {tool.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
