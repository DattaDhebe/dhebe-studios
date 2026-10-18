import Link from 'next/link';
import { Base64Workbench } from '@/components/base64-workbench';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import {
  type Base64ToolPageEntry,
  getBase64ToolPageBySlug,
  getBase64ToolPath,
} from '@/lib/base64-tool-pages';
import { SITE_NAME, siteRoute } from '@/lib/site';

interface Base64ToolLandingPageProps {
  tool: Base64ToolPageEntry;
}

export function Base64ToolLandingPage({ tool }: Base64ToolLandingPageProps) {
  const relatedTools = tool.relatedSlugs
    .map((slug) => getBase64ToolPageBySlug(slug))
    .filter((entry): entry is Base64ToolPageEntry => Boolean(entry));

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${tool.seoTitle} | ${SITE_NAME}`,
        applicationCategory: 'DeveloperApplication',
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

  const usageSteps = buildUsageSteps(tool);
  const features = buildFeaturePoints(tool);
  const heading = tool.seoTitle.split(' - ')[0] ?? tool.seoTitle;

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Base64 Converter', item: '/base64-converter/' },
          { name: tool.label, item: tool.path },
        ]}
      />
      <script
        id={`base64-tool-structured-data-${tool.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Base64Workbench
        initialTool={{
          kind: tool.kind,
          id: tool.id,
        }}
      />

      <section className="tool-guide tone-code mx-auto max-w-[1240px] px-4 pb-16 pt-8 xl:px-6">
        <div className="grid gap-8">
          <section className="rounded-[2rem] border p-6 theme-panel sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-600">
              Free Base64 Tool
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title sm:text-4xl">
              {heading}
            </h2>
            <p className="mt-3 max-w-4xl text-sm leading-7 theme-muted sm:text-base">
              {tool.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {tool.keywords.slice(0, 8).map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 sm:text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </section>

          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
            <section className="rounded-[2rem] border p-6 theme-panel sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight theme-title">
                How to use {tool.label}
              </h2>
              <div className="mt-5 grid gap-4">
                {usageSteps.map((step, index) => (
                  <div key={step} className="rounded-[1.35rem] border p-4 theme-card-soft">
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                      Step {index + 1}
                    </p>
                    <p className="mt-2 text-sm leading-7 theme-muted sm:text-base">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[2rem] border p-6 theme-panel sm:p-8">
              <h2 className="text-2xl font-semibold tracking-tight theme-title">
                Why use this {tool.label.toLowerCase()} tool
              </h2>
              <div className="mt-5 grid gap-3">
                {features.map((feature) => (
                  <div key={feature} className="rounded-[1.35rem] border p-4 theme-card-soft">
                    <p className="text-sm leading-7 theme-muted sm:text-base">{feature}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-[2rem] border p-6 theme-panel sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
                  Related Tools
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
                  Explore related Base64 tools
                </h2>
              </div>
              <Link
                href="/base64-converter/"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--app-title)] transition hover:opacity-80"
              >
                Browse all Base64 tools
                <span aria-hidden="true">-&gt;</span>
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={getBase64ToolPath(relatedTool)}
                  className="rounded-[1.5rem] border p-5 theme-card-soft transition hover:-translate-y-1 hover:border-cyan-300"
                >
                  <p className="text-sm font-semibold theme-title">{relatedTool.label}</p>
                  <p className="mt-2 text-sm leading-6 theme-muted">{relatedTool.description}</p>
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border p-6 theme-panel sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-600">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
              Frequently asked questions
            </h2>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {tool.faqs.map((faq) => (
                <article key={faq.question} className="rounded-[1.5rem] border p-5 theme-card-soft">
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

function buildUsageSteps(tool: Base64ToolPageEntry) {
  if (tool.kind === 'converter') {
    return [
      `Add your source ${tool.id === 'text' || tool.id === 'url' || tool.id === 'hex' || tool.id === 'html' || tool.id === 'css' ? 'content' : 'file'} to the ${tool.label} tool.`,
      'Run the conversion locally in the browser to generate clean Base64 output.',
      'Copy or download the result for API, storage, preview, or debugging workflows.',
    ];
  }

  return [
    'Paste the Base64 string or data URI into the decoder input.',
    `Run the ${tool.label} tool to recover readable or previewable output.`,
    'Copy, preview, or download the recovered content directly in your browser.',
  ];
}

function buildFeaturePoints(tool: Base64ToolPageEntry) {
  const basePoints = [
    'Runs entirely in the browser for privacy-first Base64 conversion.',
    'Supports quick copy and download workflows without sign-up.',
  ];

  if (tool.kind === 'converter') {
    return [
      `${tool.label} is useful for transport-safe payloads, data URI tasks, and developer workflows.`,
      ...basePoints,
      `Pairs naturally with the matching ${formatSlug(tool.relatedSlugs[0]) ?? 'decoder'} page for round-trip testing.`,
    ];
  }

  return [
    `${tool.label} helps recover readable, previewable, or downloadable output from encoded payloads.`,
    ...basePoints,
    `Pairs naturally with the matching ${formatSlug(tool.relatedSlugs[0]) ?? 'encoder'} page for round-trip testing.`,
  ];
}

function formatSlug(value: string | undefined) {
  if (!value) {
    return null;
  }

  return value.replace(/-/g, ' ');
}
