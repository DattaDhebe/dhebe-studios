import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegacyRedirectPage } from '@/components/legacy-redirect-page';
import { PdfToolLandingPage } from '@/components/pdf-tool-landing-page';
import { buildPdfToolMetadata, getPdfSeoPageById } from '@/lib/pdf-seo-pages';
import { getPdfToolPageBySlug, getPdfToolPath, pdfToolPages } from '@/lib/pdf-tools-pages';

interface PdfToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return pdfToolPages.map((tool) => ({
    slug: tool.slug,
  }));
}

export async function generateMetadata({ params }: PdfToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getPdfToolPageBySlug(slug);

  if (!tool) {
    return {};
  }

  const targetPath = getPdfToolPath(tool);
  const isLegacyPath = targetPath !== `/pdf-tools/${tool.slug}`;

  return {
    ...buildPdfToolMetadata(tool),
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
  };
}

export default async function PdfToolPage({ params }: PdfToolPageProps) {
  const { slug } = await params;
  const tool = getPdfToolPageBySlug(slug);

  if (!tool) {
    notFound();
  }

  const targetPath = getPdfToolPath(tool);
  const normalizedTargetPath = targetPath.endsWith('/') ? targetPath : `${targetPath}/`;

  if (targetPath !== `/pdf-tools/${tool.slug}`) {
    return <LegacyRedirectPage href={normalizedTargetPath} label={tool.label} />;
  }

  return <PdfToolLandingPage tool={tool} seoPage={getPdfSeoPageById(tool.id)!} />;
}
