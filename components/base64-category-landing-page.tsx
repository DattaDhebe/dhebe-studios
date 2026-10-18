import Link from 'next/link';
import { Base64Workbench } from '@/components/base64-workbench';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import {
  type Base64CategoryView,
  getBase64CategoryPage,
} from '@/lib/base64-category-pages';
import {
  base64ToolPages,
  getBase64ToolPath,
  type Base64ToolPageEntry,
} from '@/lib/base64-tool-pages';
import { SITE_NAME, siteRoute } from '@/lib/site';

interface Base64CategoryLandingPageProps {
  view: Base64CategoryView;
}

export function Base64CategoryLandingPage({ view }: Base64CategoryLandingPageProps) {
  const page = getBase64CategoryPage(view);
  const tools = base64ToolPages.filter((tool) =>
    view === 'all' ? true : view === 'converter' ? tool.kind === 'converter' : tool.kind === 'decoder',
  );

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${page.seoTitle} | ${SITE_NAME}`,
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        url: siteRoute(page.path),
        description: page.metaDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((faq) => ({
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

  const initialTool =
    view === 'decoder'
      ? { kind: 'decoder' as const, id: 'text' }
      : { kind: 'converter' as const, id: 'text' };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          {
            name:
              view === 'all'
                ? 'Base64 Converter'
                : view === 'converter'
                  ? 'Base64 Encoder'
                  : 'Base64 Decoder',
            item: page.path,
          },
        ]}
      />
      <script
        id={`base64-category-structured-data-${view}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Base64Workbench initialTool={view === 'all' ? undefined : initialTool} />
      <section className="tool-guide tone-code mx-auto max-w-[1240px] px-4 pb-16 pt-8">
        <div className="mx-auto max-w-[1600px] space-y-8">
          <section className="rounded-[2rem] border p-6 theme-panel sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-orange-600">
              Free Base64 Tools
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight theme-title sm:text-5xl">
              {page.seoTitle}
            </h2>
            <p className="mt-4 max-w-4xl text-sm leading-7 theme-muted sm:text-base">
              {page.intro}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/base64-converter/"
                className="inline-flex items-center rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Browse all Base64 tools
              </Link>
              <Link
                href="/support/"
                className="inline-flex items-center rounded-full border border-[var(--app-card-border)] px-4 py-2 text-sm font-semibold theme-title transition hover:bg-orange-50"
              >
                View support
              </Link>
            </div>
          </section>

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]">
            <div className="grid gap-6">
              {page.sections.map((section) => (
                <article key={section.title} className="rounded-[2rem] border p-6 theme-panel sm:p-8">
                  <h2 className="text-2xl font-semibold tracking-tight theme-title">
                    {section.title}
                  </h2>
                  <p className="mt-3 text-sm leading-7 theme-muted sm:text-base">
                    {section.body}
                  </p>
                </article>
              ))}
            </div>

            <aside className="rounded-[2rem] border p-6 theme-panel">
              <h2 className="text-lg font-semibold theme-title">
                {view === 'all'
                  ? 'Popular Base64 pages'
                  : view === 'converter'
                    ? 'Popular encoder pages'
                    : 'Popular decoder pages'}
              </h2>
              <div className="mt-4 grid gap-3">
                {tools.slice(0, 8).map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </div>
            </aside>
          </section>

          <section className="rounded-[2rem] border p-6 theme-panel sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-600">
              Tool Directory
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
              Browse dedicated Base64 pages
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
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
              {page.faqs.map((faq) => (
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

function ToolCard({ tool }: { tool: Base64ToolPageEntry }) {
  return (
    <Link
      href={getBase64ToolPath(tool)}
      className="rounded-[1.5rem] border p-5 theme-card-soft transition hover:-translate-y-1 hover:border-orange-300"
      prefetch={false}
    >
      <p className="text-sm font-semibold theme-title">{tool.label}</p>
      <p className="mt-2 text-sm leading-6 theme-muted">{tool.description}</p>
    </Link>
  );
}
