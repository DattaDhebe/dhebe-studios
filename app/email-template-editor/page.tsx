import type { Metadata } from 'next';
import { EmailTemplateLandingPage } from '@/components/email-template-landing-page';
import {
  emailTemplateEditorKeywords,
  emailTemplateEditorMetaDescription,
  emailTemplateEditorPath,
  emailTemplateEditorSeoTitle,
} from '@/lib/email-template-page';
import { SITE_NAME, siteRoute } from '@/lib/site';

export const metadata: Metadata = {
  title: emailTemplateEditorSeoTitle,
  description: emailTemplateEditorMetaDescription,
  keywords: emailTemplateEditorKeywords,
  alternates: {
    canonical: siteRoute(emailTemplateEditorPath),
  },
  openGraph: { images: ['/social-preview.png'],
    title: emailTemplateEditorSeoTitle,
    description: emailTemplateEditorMetaDescription,
    url: siteRoute(emailTemplateEditorPath),
    type: 'website',
    siteName: SITE_NAME,
  },
  twitter: { images: ['/social-preview.png'],
    card: 'summary_large_image',
    title: emailTemplateEditorSeoTitle,
    description: emailTemplateEditorMetaDescription,
  },
};

export default function EmailTemplateEditorPage() {
  return <EmailTemplateLandingPage />;
}
