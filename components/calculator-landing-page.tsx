import Link from 'next/link';
import Script from 'next/script';
import { CalculatorToolsWorkbench } from '@/components/calculator-tools-workbench';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import type { CalculatorToolPageEntry } from '@/lib/calculator-tool-pages';
import { siteRoute } from '@/lib/site';

interface CalculatorLandingPageProps {
  tool: CalculatorToolPageEntry;
}

export function CalculatorLandingPage({ tool }: CalculatorLandingPageProps) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${tool.seoTitle} | Calculator Studio`,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        url: siteRoute(tool.path),
        description: tool.metaDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Calculator Studio', item: '/calculator-studio/' },
          { name: tool.label, item: tool.path },
        ]}
      />
      <Script
        id={`calculator-tool-structured-data-${tool.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CalculatorToolsWorkbench initialTool={tool.id} />

      <section className="tool-guide tone-calculator mx-auto max-w-[1240px] px-4 pb-16 pt-8 xl:px-6">
        <div className="grid gap-8">
          <div className="theme-panel rounded-[2rem] border p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Tool Overview
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight theme-title sm:text-4xl">
              {tool.seoTitle}
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 theme-muted sm:text-base">
              {tool.metaDescription}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/calculator-studio/"
                className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Open Calculator Studio
              </Link>
              <Link
                href="/calculator-tools/"
                className="inline-flex items-center rounded-full border border-[var(--app-card-border)] px-4 py-2 text-sm font-semibold theme-title transition hover:bg-emerald-50"
              >
                Browse all calculator pages
              </Link>
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.9fr)]">
            <div className="grid gap-6">
              {tool.sections.map((section) => (
                <article key={section.title} className="theme-panel rounded-[2rem] border p-6 sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight theme-title">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 theme-muted sm:text-base">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>

            <aside className="grid gap-6">
              {tool.keywordGroups.map((group) => (
                <section key={group.title} className="theme-panel rounded-[2rem] border p-6">
                  <h2 className="text-lg font-semibold theme-title">{group.title}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900 sm:text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                  {group.note ? (
                    <p className="mt-4 text-xs leading-6 theme-muted sm:text-sm">{group.note}</p>
                  ) : null}
                </section>
              ))}
            </aside>
          </div>

          <section className="theme-panel rounded-[2rem] border p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
              Frequently asked questions
            </h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {tool.faqs.map((faq) => (
                <article key={faq.question} className="theme-card-soft rounded-[1.5rem] border p-5">
                  <h3 className="text-lg font-semibold theme-title">{faq.question}</h3>
                  <p className="mt-3 text-sm leading-7 theme-muted">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
