import Link from 'next/link';
import { PdfToolsWorkbench } from '@/components/pdf-tools-workbench';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import type { PdfSeoPage } from '@/lib/pdf-seo-pages';
import type { PdfToolPageEntry } from '@/lib/pdf-tools-pages';
import { getPdfToolPageById, getPdfToolPath } from '@/lib/pdf-tools-pages';
import { siteRoute } from '@/lib/site';

interface PdfToolLandingPageProps {
  tool: PdfToolPageEntry;
  seoPage: PdfSeoPage;
}

export function PdfToolLandingPage({ tool, seoPage }: PdfToolLandingPageProps) {
  const heading = seoPage.seoTitle.split(' - ')[0] ?? seoPage.seoTitle;
  const relatedTools = seoPage.relatedToolIds
    .map((id) => getPdfToolPageById(id))
    .filter((entry): entry is PdfToolPageEntry => Boolean(entry));

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${seoPage.seoTitle} | PDF Studio`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        url: siteRoute(getPdfToolPath(tool)),
        description: seoPage.metaDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      ...(seoPage.faqs.length ? [{
        '@type': 'FAQPage',
        mainEntity: seoPage.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }] : []),
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'PDF Studio', item: '/pdf-studio/' },
          { name: tool.label, item: getPdfToolPath(tool) },
        ]}
      />
      <script
        id={`pdf-tool-structured-data-${tool.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PdfToolsWorkbench initialTool={tool.id} />

      <section className="tool-guide tone-pdf mx-auto max-w-[1240px] px-4 pb-16 pt-8 xl:px-6">
        <div className="grid gap-8">
          <div className="theme-panel rounded-[2rem] border p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-purple-600">
              Free Online PDF Tool
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title sm:text-4xl">
              {heading}
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 theme-muted sm:text-base">
              {seoPage.intro}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="theme-accent-chip-purple rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                No signup required
              </span>
              <span className="theme-accent-chip-purple rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                No watermark
              </span>
              <span className="theme-accent-chip-purple rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
                Clear file-handling details
              </span>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <section className="theme-panel rounded-[2rem] border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight theme-title">
                {seoPage.howToTitle}
              </h2>
              <div className="mt-5 grid gap-4">
                {seoPage.howToSteps.map((step, index) => (
                  <div key={step} className="theme-card-soft rounded-[1.4rem] border p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-purple-600">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 text-sm leading-7 theme-muted sm:text-base">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="theme-panel rounded-[2rem] border p-6 sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight theme-title">
                {seoPage.featuresTitle}
              </h2>
              <div className="mt-5 grid gap-3">
                {seoPage.features.map((feature) => (
                  <div key={feature} className="theme-card-soft rounded-[1.4rem] border p-4">
                    <p className="text-sm leading-7 theme-muted sm:text-base">{feature}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="theme-panel rounded-[2rem] border p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                  Related Tools
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
                  {seoPage.relatedTitle}
                </h2>
              </div>
              <Link
                href="/pdf-tools/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--app-title)] transition hover:opacity-80"
              >
                Browse all PDF tools
                <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.id}
                  href={getPdfToolPath(relatedTool)}
                  className="theme-card-soft rounded-[1.5rem] border p-5 transition hover:-translate-y-1 hover:border-cyan-300"
                >
                  <p className="text-sm font-semibold theme-title">{relatedTool.label}</p>
                  <p className="mt-2 text-sm leading-6 theme-muted">{relatedTool.description}</p>
                </Link>
              ))}
            </div>
          </section>

          {seoPage.faqs.length > 0 && <section className="theme-panel rounded-[2rem] border p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
              Frequently Asked Questions
            </h2>
            <div className="guide-faqs mt-6">
              {seoPage.faqs.map((faq) => (
                <details key={faq.question}>
                  <summary>{faq.question}</summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>}
        </div>
      </section>
    </>
  );
}
