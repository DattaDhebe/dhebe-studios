import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegacyRedirectPage } from '@/components/legacy-redirect-page';
import { ImageToolsWorkbench } from '@/components/image-tools-workbench';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import { getImageToolPageBySlug, getImageToolPath, imageToolPages } from '@/lib/image-tools-pages';
import { SITE_NAME, siteRoute } from '@/lib/site';

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

  return {
    title: `${tool.label} | Image Studio`,
    description: tool.description,
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
      title: `${tool.label} | Image Studio`,
      description: tool.description,
      url: siteRoute(targetPath),
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: { images: ['/social-preview.png'],
      card: 'summary_large_image',
      title: `${tool.label} | Image Studio`,
      description: tool.description,
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

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `${tool.label} | Image Studio`,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: siteRoute(targetPath),
        description: tool.description,
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
    </>
  );
}
