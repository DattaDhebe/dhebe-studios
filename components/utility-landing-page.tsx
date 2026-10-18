import type { ReactNode } from 'react';
import Link from 'next/link';
import { BreadcrumbSchema } from './breadcrumb-schema';
import { utilityTools, type UtilityToolId } from '@/lib/utility-tools';
import { siteRoute } from '@/lib/site';

export function UtilityLandingPage({ id, children }: { id: UtilityToolId; children: ReactNode }) {
  const tool = utilityTools[id];
  const structuredData = { '@context': 'https://schema.org', '@type': 'WebApplication', name: tool.label, url: siteRoute(tool.path), description: tool.description, applicationCategory: 'UtilitiesApplication', operatingSystem: 'Web', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } };
  return (
    <article className="utility-page content-container">
      <BreadcrumbSchema items={[{ name: 'Home', item: '/' }, { name: tool.label, item: tool.path }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <nav aria-label="Breadcrumb" className="workspace-breadcrumb"><Link href="/">Home</Link><span>/</span><span aria-current="page">{tool.label}</span></nav>
      <header className="utility-heading"><p className="eyebrow">A LITTLE LESS BUSYWORK</p><h1>{tool.title}</h1><p>{tool.intro}</p><span className="utility-local">Free to use / Runs on your device / No account needed</span></header>
      {children}
      <section className="utility-guide"><div><h2>How to use it</h2><ol>{tool.steps.map(step => <li key={step}>{step}</li>)}</ol></div><div><h2>A few useful answers</h2>{tool.faqs.map(faq => <details key={faq.question}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}</div></section>
      <section className="utility-related"><h2>Keep things moving</h2><div>{Object.entries(utilityTools).filter(([key]) => key !== id).map(([key, related]) => <Link href={related.path} key={key} prefetch={false}>{related.label}<span>{related.description}</span></Link>)}<Link href="/compress-pdf/" prefetch={false}>Compress PDF<span>Make a document smaller before sharing it.</span></Link></div></section>
    </article>
  );
}
