import type { Metadata } from 'next';
import { ImageToolsWorkbench } from '@/components/image-tools-workbench';
import { BreadcrumbSchema } from '@/components/breadcrumb-schema';
import Link from 'next/link';
import { getImageToolPath, imageToolPages } from '@/lib/image-tools-pages';
import { imageTools } from '@/lib/image-tools';
import { SITE_NAME, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Image Studio - Free Online Image Tools for Compress, Resize, Crop & Convert',
  description:
    'Free Image Studio for compression, resizing, cropping, and format conversion on your device, with temporary server processing for background removal.',
  keywords: [
    'online image editor',
    'image compressor online',
    'image resizer',
    'background remover',
    'jpg to png converter',
    'png to jpg',
    'webp converter',
    'image cropper online',
    'free image tools',
    'privacy first image editor',
  ],
  alternates: {
    canonical: siteRoute('/image-studio'),
  },
  openGraph: { images: ['/social-preview.png'],
    title: 'Image Studio - Free Online Image Tools | DHEBE',
    description:
      'Use Image Studio for high-quality image compression, resizing, background removal, and format conversion directly in your browser.',
    url: siteRoute('/image-studio'),
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: { images: ['/social-preview.png'],
    card: 'summary_large_image',
    title: 'Image Studio - Free Online Image Tools',
    description:
      'Popular online image workflows with privacy-first browser processing and dedicated landing pages for each tool.',
  },
};

export default function ImageStudioPage() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `Image Studio | ${SITE_NAME}`,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Web',
        url: siteRoute('/image-studio'),
        description:
          'Free online image studio for compression, resizing, background removal, cropping, and format conversion.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        featureList: imageTools.map((tool) => tool.label),
      },
    ],
  };

  return (
    <>
      <BreadcrumbSchema
        items={[
          { name: 'Home', item: '/' },
          { name: 'Image Studio', item: '/image-studio/' },
        ]}
      />
      <script
        id="image-studio-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <ImageToolsWorkbench />

      <section className="mx-auto max-w-[1600px] px-4 pb-16 xl:px-6 pt-8">
        <div className="theme-panel rounded-[2rem] border p-6 sm:p-8">
          <div className="grid gap-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-rose-600">
                Tool Directory
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight theme-title">
                Dedicated Pages for Every Image Workflow
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 theme-muted sm:text-base">
                Browse a dedicated page for each image tool. These pages make it easy to open the exact workflow you need from direct links or the studio directory.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              <ImageToolLinkGroup
                title="Format & Compression"
                tools={imageToolPages.filter((tool) =>
                  ['image-compressor', 'jpg-to-png', 'png-to-jpg', 'webp-converter'].includes(tool.id),
                )}
                accentClass="text-rose-600"
              />
              <ImageToolLinkGroup
                title="Editing & Adjustment"
                tools={imageToolPages.filter((tool) =>
                  ['image-resizer', 'background-remover', 'image-cropper'].includes(tool.id),
                )}
                accentClass="text-rose-400"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface ImageToolLinkGroupProps {
  title: string;
  accentClass: string;
  tools: typeof imageToolPages;
}

function ImageToolLinkGroup({ title, accentClass, tools }: ImageToolLinkGroupProps) {
  return (
    <div>
      <h3 className={`text-sm font-semibold uppercase tracking-[0.22em] ${accentClass}`}>
        {title}
      </h3>
      <div className="mt-4 space-y-3">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={getImageToolPath(tool)}
            className="theme-card-soft rounded-[1.5rem] border px-4 py-4 transition hover:border-[var(--app-card-border)] block"
            prefetch={false}
          >
            <p className="text-sm font-semibold theme-title break-words">{tool.label}</p>
            <p className="mt-1 text-xs sm:text-sm leading-6 theme-muted break-words">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
