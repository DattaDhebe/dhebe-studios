import type { Metadata } from 'next';
import { CircleCalculatorTool } from '@/components/calculators/circle-calculator-tool';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { SITE_NAME, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Circle Calculator - Calculate Area, Circumference & Diameter',
  description:
    'Free circle calculator to calculate area, circumference, diameter, and radius online.',
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: 'https://www.dhebe.com/tools/circle/',
  },
  openGraph: { images: ['/social-preview.png'],
    title: 'Circle Calculator - Area, Circumference & Diameter | DHEBE',
    description: 'Free circle calculator to calculate area, circumference, diameter, and radius online.',
    url: 'https://www.dhebe.com/tools/circle/',
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: { images: ['/social-preview.png'],
    card: 'summary_large_image',
    title: 'Circle Calculator - Area, Circumference & Diameter',
    description: 'Free circle calculator to calculate area, circumference, diameter, and radius online.',
  },
};

export default function CirclePage() {
  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Calculator Studio', item: '/calculator-studio/' },
          { name: 'Circle Calculator', item: '/tools/circle/' },
        ]}
      />
      <main className="theme-page-home min-h-screen px-4 py-16 text-[var(--app-text)] transition-colors duration-200">
      <div className="mx-auto max-w-4xl">
        <section className="mb-12 rounded-[2rem] border p-8 theme-panel text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">
            Calculator Tool
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight theme-title">
            Circle Calculator
          </h1>
          <p className="mt-4 text-sm leading-7 theme-muted sm:text-base max-w-2xl mx-auto">
            Calculate circle area, circumference, diameter, and radius online. This free tool helps you find geometric properties instantly in your browser.
          </p>
        </section>

        <CircleCalculatorTool />

        <section className="mt-12 rounded-[2rem] border p-8 theme-panel">
          <h2 className="text-2xl font-semibold tracking-tight theme-title">About Circle Calculations</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-[1.5rem] border p-5 theme-card-soft">
              <h3 className="font-semibold theme-title">Radius & Diameter</h3>
              <p className="mt-2 text-sm leading-6 theme-muted">
                The radius is the distance from the center to any point on the edge. The diameter is twice the radius and passes through the center.
              </p>
            </div>
            <div className="rounded-[1.5rem] border p-5 theme-card-soft">
              <h3 className="font-semibold theme-title">Circumference & Area</h3>
              <p className="mt-2 text-sm leading-6 theme-muted">
                Circumference is the distance around the circle (2πr). Area is the total space enclosed within the circle (πr²).
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
