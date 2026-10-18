import type { Metadata } from 'next';
import { SITE_NAME, siteRoute } from '@/lib/site';

export type Base64CategoryView = 'all' | 'converter' | 'decoder';

interface Base64CategoryPage {
  view: Base64CategoryView;
  path: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  keywords: string[];
  highlights: string[];
  sections: Array<{
    title: string;
    body: string;
  }>;
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export const base64CategoryPages: Record<Base64CategoryView, Base64CategoryPage> = {
  all: {
    view: 'all',
    path: '/base64-converter/',
    seoTitle: 'Base64 Converter - Encode and Decode Base64 Online',
    metaDescription: 'Use this free Base64 converter to encode and decode text, images, URLs, HTML, CSS, PDF, audio, hex, and files online.',
    intro: 'Use our free Base64 converter to encode and decode text, images, URLs, hex, PDF, HTML, CSS, audio, and files online. Fast, simple, and browser-based.',
    keywords: ['base64 converter', 'base64 encoder', 'base64 decoder', 'base64 encode', 'base64 decode', 'online base64 converter', 'free base64 converter', 'base64 converter online', 'base64 to text', 'text to base64', 'base64 to file', 'file to base64'],
    highlights: ['base64 converter', 'base64 encoder', 'base64 decoder', 'online base64 converter', 'developer base64 tools', 'free base64 converter'],
    sections: [
      { title: 'Encode and Decode Base64 Online', body: 'This Base64 converter page is built for developers, marketers, students, and power users who need to switch between readable content and Base64 payloads quickly. Use it for text, images, URLs, files, PDF, HTML, CSS, hex, and audio workflows in one place.' },
      { title: 'Free Base64 Converter for Text, Image, PDF, and File Workflows', body: 'Instead of opening separate apps, you can use the browser-based workbench to handle common Base64 encoding and decoding tasks locally. It helps with API payloads, data URI generation, transport-safe strings, and recovery of encoded assets.' },
      { title: 'Developer Base64 Tools with Privacy-First Browser Processing', body: 'All major Base64 tools run client-side so your text, files, and decoded output stay on your device. That makes the page useful for fast testing, debugging, and everyday conversion work without server-side file retention.' },
    ],
    faqs: [
      { question: 'What is a Base64 converter?', answer: 'A Base64 converter is a tool that helps you encode readable text or files into Base64 and decode Base64 payloads back into usable content.' },
      { question: 'How to encode and decode Base64 online?', answer: 'Choose the right converter or decoder, paste text or upload a file, run the conversion, and copy or download the output directly in the browser.' },
      { question: 'What can I convert with Base64?', answer: 'This page supports text, images, URLs, HTML, CSS, PDF, audio, hex, and broad file-to-Base64 or Base64-to-file workflows.' },
      { question: 'Is this Base64 converter private?', answer: 'Yes. The workbench is designed for client-side browser processing, so your conversion data stays in your session.' },
    ],
  },
  converter: {
    view: 'converter',
    path: '/base64-encoder/',
    seoTitle: 'Base64 Encoder - Convert Text, Files, Images and PDF to Base64',
    metaDescription: 'Use this free Base64 encoder to convert text, images, URLs, HTML, CSS, PDF, audio, hex, and files to Base64 online.',
    intro: 'Use this Base64 encoder to convert text, files, images, PDF, HTML, CSS, URLs, audio, and hex into Base64 online with fast browser-based processing.',
    keywords: ['base64 encoder', 'base64 encode', 'encode base64', 'text to base64', 'image to base64', 'file to base64', 'pdf to base64', 'online base64 encoder'],
    highlights: ['base64 encoder', 'encode base64', 'text to base64', 'image to base64', 'file to base64', 'pdf to base64'],
    sections: [
      { title: 'Convert Text, Images, PDF, and Files to Base64', body: 'This Base64 encoder page focuses on the input side of the workflow. It helps you convert local files, plain text, markup, media, and developer strings into Base64 output for APIs, storage, and transport-safe payloads.' },
      { title: 'Base64 Encode Online with Browser-Based Tools', body: 'Choose the tool that matches your source type and generate Base64 output instantly. It works well for text to Base64, image to Base64, file to Base64, PDF to Base64, and related frontend workflows.' },
    ],
    faqs: [
      { question: 'What does a Base64 encoder do?', answer: 'A Base64 encoder converts source content such as text or files into a Base64 string that is easier to transport and store in text-safe systems.' },
      { question: 'How to encode file to Base64 online?', answer: 'Open the matching encoder tool, upload the file, and the browser will generate the Base64 output for you instantly.' },
      { question: 'Which Base64 encoder tools are available?', answer: 'This page includes tools for text, image, URL, hex, PDF, HTML, CSS, file, and audio to Base64 workflows.' },
    ],
  },
  decoder: {
    view: 'decoder',
    path: '/base64-decoder/',
    seoTitle: 'Base64 Decoder - Convert Base64 to Text, Image, PDF and File',
    metaDescription: 'Use this free Base64 decoder to convert Base64 to text, images, URLs, HTML, CSS, PDF, audio, hex, and files online.',
    intro: 'Use this Base64 decoder to recover text, images, URLs, HTML, CSS, PDF, audio, hex, and files from Base64 online with browser-based tools.',
    keywords: ['base64 decoder', 'base64 decode', 'decode base64', 'base64 to text', 'base64 to image', 'base64 to file', 'base64 to pdf', 'online base64 decoder'],
    highlights: ['base64 decoder', 'decode base64', 'base64 to text', 'base64 to image', 'base64 to file', 'base64 to pdf'],
    sections: [
      { title: 'Decode Base64 to Text, Image, PDF, and Files', body: 'This Base64 decoder page focuses on recovering usable output from encoded Base64 payloads. It is useful for debugging responses, restoring assets, checking uploads, and recovering readable or downloadable content.' },
      { title: 'Base64 Decode Online with Preview and Download Tools', body: 'Choose a decoder for the type you expect, paste the Base64 string or data URI, and recover the original text, image, PDF, audio, or file content directly in your browser.' },
    ],
    faqs: [
      { question: 'What does a Base64 decoder do?', answer: 'A Base64 decoder converts an encoded Base64 string back into readable text or a usable binary output such as an image, PDF, audio file, or downloadable file.' },
      { question: 'How to decode Base64 online?', answer: 'Open the matching decoder tool, paste the Base64 string, and let the browser recover the original content instantly.' },
      { question: 'Which Base64 decoder tools are available?', answer: 'This page includes tools for Base64 to text, image, URL, hex, PDF, HTML, CSS, file, and audio workflows.' },
    ],
  },
};

export function getBase64CategoryPage(view: Base64CategoryView) {
  return base64CategoryPages[view];
}

export function buildBase64CategoryMetadata(view: Base64CategoryView): Metadata {
  const page = getBase64CategoryPage(view);

  return {
    title: page.seoTitle,
    description: page.metaDescription,
    keywords: page.keywords,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    alternates: {
      canonical: siteRoute(page.path),
    },
    openGraph: { images: ['/social-preview.png'],
      title: page.seoTitle,
      description: page.metaDescription,
      url: siteRoute(page.path),
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: { images: ['/social-preview.png'],
      card: 'summary_large_image',
      title: page.seoTitle,
      description: page.metaDescription,
    },
  };
}
