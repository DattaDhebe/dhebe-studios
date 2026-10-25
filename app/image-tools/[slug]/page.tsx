import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegacyRedirectPage } from '@/components/legacy-redirect-page';
import { ImageToolsWorkbench } from '@/components/image-tools-workbench';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { getImageToolPageBySlug, getImageToolPath, imageToolPages } from '@/lib/image-tools-pages';
import { SITE_NAME, siteRoute } from '@/lib/site';
import Link from 'next/link';
import { imageToolGuides } from '@/lib/image-tool-guides';

interface ImageToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return imageToolPages.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: ImageToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getImageToolPageBySlug(slug);

  if (!tool) {
    return {};
  }

  const targetPath = getImageToolPath(tool);
  const isLegacyPath = targetPath !== `/image-tools/${tool.slug}`;
  const guide = imageToolGuides[tool.id];

  return {
    title: guide.title,
    description: guide.description,
    robots: isLegacyPath
      ? {
          index: false,
          follow: true,
          googleBot: {
            index: false,
            follow: true,
          },
        }
      : undefined,
    alternates: {
      canonical: siteRoute(targetPath),
    },
    openGraph: { images: ['/social-preview.png'],
      title: guide.title,
      description: guide.description,
      url: siteRoute(targetPath),
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: { images: ['/social-preview.png'],
      card: 'summary_large_image',
      title: guide.title,
      description: guide.description,
    },
  };
}

export default async function ImageToolPage({ params }: ImageToolPageProps) {
  const { slug } = await params;
  const tool = getImageToolPageBySlug(slug);

  if (!tool) {
    notFound();
  }

  const targetPath = getImageToolPath(tool);
  const normalizedTargetPath = targetPath.endsWith('/') ? targetPath : `${targetPath}/`;

  if (targetPath !== `/image-tools/${tool.slug}`) {
    return <LegacyRedirectPage href={normalizedTargetPath} label={tool.label} />;
  }
  const guide = imageToolGuides[tool.id];

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${tool.label} | Image Studio`,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: siteRoute(targetPath),
        description: guide.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Image Studio', item: '/image-studio/' },
          { name: tool.label, item: targetPath },
        ]}
      />
      <script
        id={`image-tool-structured-data-${tool.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ImageToolsWorkbench
        initialTool={tool.id}
      />
      <section className="tool-guide tone-image mx-auto max-w-[1240px] px-4 pb-16 pt-8 xl:px-6" aria-label={`${tool.label} guide`}>
        <div className="theme-panel rounded-[2rem] border p-6 sm:p-8">
          <h2 className="text-2xl font-semibold theme-title">How to use {tool.label}</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7 theme-muted">{guide.steps.map(step => <li key={step}>{step}</li>)}</ol>
          <h2 className="mt-8 text-xl font-semibold theme-title">Before you download</h2>
          <p className="mt-3 text-sm leading-7 theme-muted">{guide.note}</p>
          <h2 className="mt-8 text-xl font-semibold theme-title">Useful next tools</h2>
          <ul className="mt-4 flex flex-wrap gap-4">{guide.related.map(id => {
            const related = imageToolPages.find(page => page.id === id)!;
            return <li key={id}><Link className="text-sm font-semibold underline underline-offset-4 theme-title" href={getImageToolPath(related)}>{related.label}</Link></li>;
          })}</ul>
        </div>
      </section>
    </>
  );
}
