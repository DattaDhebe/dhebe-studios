import Link from 'next/link';
import Script from 'next/script';
import { EmailStudioClient } from '@/components/email-studio-client';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import {
  emailTemplateEditorBenefits,
  emailTemplateEditorFaqs,
  emailTemplateEditorKeywordGroups,
  emailTemplateEditorMetaDescription,
  emailTemplateEditorPath,
  emailTemplateEditorSections,
  emailTemplateEditorSeoTitle,
  emailTemplateTypes,
} from '@/lib/email-template-page';
import { SITE_NAME, siteRoute } from '@/lib/site';

export function EmailTemplateLandingPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${emailTemplateEditorSeoTitle} | ${SITE_NAME}`,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        url: siteRoute(emailTemplateEditorPath),
        description: emailTemplateEditorMetaDescription,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: emailTemplateEditorFaqs.map((faq) => ({
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
          { name: 'Email Template Editor', item: emailTemplateEditorPath },
        ]}
      />
      <Script
        id="email-template-editor-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <section className="email-page theme-page-email text-[var(--app-text)] px-4 py-6 xl:px-6">
        <div className="mx-auto max-w-[1600px] space-y-8">
          <header className="editor-page-heading">
            <div><p className="eyebrow">EMAIL STUDIO</p><h1>Email Template Editor</h1><p>Start with a template. Make it yours. Preview and export your HTML.</p></div>
            <Link href="/support/">Need a hand?</Link>
          </header>
          <EmailStudioClient />

          <section className="grid gap-8 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]">
            <div className="grid gap-6">
              {emailTemplateEditorSections.map((section) => (
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

            <aside className="grid gap-6">
              {emailTemplateEditorKeywordGroups.map((group) => (
                <section key={group.title} className="rounded-[2rem] border p-6 theme-panel">
                  <h2 className="text-lg font-semibold theme-title">{group.title}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((keyword) => (
                      <span
                        key={keyword}
                        className="rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-900 sm:text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </section>
              ))}
            </aside>
          </section>

          <section className="rounded-[2rem] border p-6 theme-panel sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-600">
              Why Use It
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
              Why use our email template editor?
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {emailTemplateEditorBenefits.map((benefit) => (
                <div key={benefit} className="rounded-[1.5rem] border p-5 theme-card-soft">
                  <p className="text-sm leading-7 theme-muted sm:text-base">{benefit}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[2rem] border p-6 theme-panel sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
              Popular Templates
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
              Popular email template types
            </h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {emailTemplateTypes.map((template) => (
                <article key={template.title} className="rounded-[1.5rem] border p-5 theme-card-soft">
                  <h3 className="text-lg font-semibold theme-title">{template.title}</h3>
                  <p className="mt-3 text-sm leading-7 theme-muted">{template.description}</p>
                </article>
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
              {emailTemplateEditorFaqs.map((faq) => (
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
