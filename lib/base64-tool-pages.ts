import type { Metadata } from 'next';
import { toolPages, type ToolPageEntry } from '@/lib/tool-pages';
import { SITE_NAME, siteRoute } from '@/lib/site';

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface Base64ToolPageEntry extends ToolPageEntry {
  path: string;
  seoTitle: string;
  metaDescription: string;
  intro: string;
  keywords: string[];
  faqs: ToolFaq[];
  relatedSlugs: string[];
}

interface Base64ToolSeoConfig {
  seoTitle: string;
  metaDescription: string;
  intro: string;
  keywords: string[];
  faqs: ToolFaq[];
  relatedSlugs: string[];
}

const seoConfigBySlug: Record<string, Base64ToolSeoConfig> = {
  'text-to-base64': {
    seoTitle: 'Text to Base64 Converter - Encode and Decode Base64 Text',
    metaDescription: 'Convert text to Base64 online for free. Encode plain text, strings, and UTF-8 content into clean Base64 instantly.',
    intro: 'Use this text to Base64 converter to encode plain text, UTF-8 strings, and multi-language content in your browser. It is fast, simple, and useful for developer and content workflows.',
    keywords: ['text to base64', 'base64 to text', 'text to base64 converter', 'encode text to base64', 'decode base64 to text', 'base64 encode text', 'base64 decode text', 'string to base64', 'base64 to utf8'],
    faqs: [
      { question: 'How to convert text to Base64?', answer: 'Paste your text into the input field, run the conversion, and copy the Base64 result shown in the output panel.' },
      { question: 'How to decode Base64 to text?', answer: 'Open the matching Base64 to Text tool, paste the Base64 string, and decode it back into readable UTF-8 text.' },
      { question: 'Is Base64 encoding safe for UTF-8 text?', answer: 'Yes. This tool encodes text as UTF-8 before converting it to Base64, so multi-language content and symbols are handled correctly.' },
    ],
    relatedSlugs: ['base64-to-text', 'html-to-base64', 'base64-to-html', 'file-to-base64'],
  },
  'image-to-base64': {
    seoTitle: 'Image to Base64 Converter - Convert Base64 to Image Online',
    metaDescription: 'Convert images to Base64 online for free. Encode JPG, PNG, SVG, WEBP, and other image files into Base64 or data URI output.',
    intro: 'This image to Base64 converter helps you encode PNG, JPG, JPEG, SVG, WEBP, and similar assets into Base64 strings or data URI output for HTML, CSS, JSON, and inline embeds.',
    keywords: ['image to base64', 'base64 to image', 'image to base64 converter', 'base64 image converter', 'jpg to base64', 'png to base64', 'svg to base64', 'base64 to png', 'image to data uri'],
    faqs: [
      { question: 'How to convert image to Base64?', answer: 'Upload the image file, let the browser generate the encoded result, and then copy the Base64 string or data URI output.' },
      { question: 'How to decode Base64 image?', answer: 'Use the Base64 to Image tool to paste the encoded string and recover a previewable image file.' },
      { question: 'How to create Base64 image data URI?', answer: 'This tool can generate a data URI format that includes the file type prefix followed by the Base64 image payload.' },
    ],
    relatedSlugs: ['base64-to-image', 'css-to-base64', 'base64-to-css', 'file-to-base64'],
  },
  'url-to-base64': {
    seoTitle: 'URL to Base64 Converter - Encode and Decode Base64 URL',
    metaDescription: 'Convert URL to Base64 online for free. Encode and decode links, URL-safe strings, and Base64URL-style payloads quickly.',
    intro: 'Use this URL to Base64 converter to encode links, route parameters, and URL-based strings for transport, testing, or storage. It works well for developer payloads and quick browser-based checks.',
    keywords: ['url to base64', 'base64 to url', 'url base64 encode', 'url base64 decode', 'encode url to base64', 'decode base64 url', 'base64url encoder', 'url safe base64'],
    faqs: [
      { question: 'How to encode URL to Base64?', answer: 'Paste the URL into the input area, run the conversion, and copy the encoded Base64 string from the output.' },
      { question: 'How to decode Base64 URL?', answer: 'Use the Base64 to URL tool to paste the Base64 string and recover the original link text.' },
      { question: 'What is URL-safe Base64?', answer: 'URL-safe Base64 is a variant that avoids certain reserved URL characters, making it easier to pass encoded values in routes and query strings.' },
    ],
    relatedSlugs: ['base64-to-url', 'text-to-base64', 'base64-to-text', 'file-to-base64'],
  },
  'hex-to-base64': {
    seoTitle: 'Hex to Base64 Converter - Convert Base64 to Hex Online',
    metaDescription: 'Convert hex to Base64 online for free. Encode hexadecimal strings into Base64 and decode Base64 back into hex instantly.',
    intro: 'Use this Hex to Base64 converter to transform hexadecimal strings into Base64 for APIs, debugging, and protocol tooling. It is designed for quick browser-based conversion and validation.',
    keywords: ['hex to base64', 'base64 to hex', 'hex to base64 converter', 'base64 to hex converter', 'convert hex to base64', 'base64 to hexadecimal', 'hex string to base64'],
    faqs: [
      { question: 'How to convert Hex to Base64?', answer: 'Paste the hexadecimal string into the input field and run the conversion to generate the Base64 output.' },
      { question: 'How to convert Base64 to Hex?', answer: 'Use the Base64 to Hex tool to decode the Base64 payload and inspect the bytes as hexadecimal output.' },
      { question: 'What is Hex to Base64 conversion?', answer: 'It is the process of translating bytes written as hexadecimal into the Base64 character set for transport or storage.' },
    ],
    relatedSlugs: ['base64-to-hex', 'text-to-base64', 'base64-to-file', 'file-to-base64'],
  },
  'pdf-to-base64': {
    seoTitle: 'PDF to Base64 Converter - Convert Base64 to PDF Online',
    metaDescription: 'Convert PDF to Base64 online for free. Encode PDF files into Base64 strings or decode Base64 back into previewable PDF documents.',
    intro: 'Use this PDF to Base64 converter to encode document files for APIs, storage, downloads, and browser-based workflow checks. It runs entirely on the client side.',
    keywords: ['pdf to base64', 'base64 to pdf', 'pdf to base64 converter', 'base64 to pdf converter', 'convert pdf to base64', 'decode base64 to pdf', 'pdf file to base64'],
    faqs: [
      { question: 'How to convert PDF to Base64?', answer: 'Upload the PDF file, let the browser process it locally, and then copy or download the Base64 output.' },
      { question: 'How to decode Base64 to PDF?', answer: 'Use the Base64 to PDF tool to paste the encoded string and recover a previewable or downloadable PDF document.' },
      { question: 'Can I convert Base64 string to PDF?', answer: 'Yes. The Base64 to PDF page is designed to convert Base64 or PDF data URI content back into a document file.' },
    ],
    relatedSlugs: ['base64-to-pdf', 'file-to-base64', 'base64-to-file', 'text-to-base64'],
  },
  'html-to-base64': {
    seoTitle: 'HTML to Base64 Converter - Decode Base64 to HTML Online',
    metaDescription: 'Convert HTML to Base64 online for free. Encode HTML markup and decode Base64 back into HTML code instantly in your browser.',
    intro: 'This HTML to Base64 converter helps you encode snippets, templates, and full markup documents into Base64 for transport, testing, or system integration workflows.',
    keywords: ['html to base64', 'base64 to html', 'html to base64 converter', 'base64 to html converter', 'convert html to base64', 'decode base64 to html', 'html code to base64'],
    faqs: [
      { question: 'How to convert HTML to Base64?', answer: 'Paste the HTML code into the source input, run the conversion, and then copy the Base64 result from the output.' },
      { question: 'How to decode Base64 to HTML?', answer: 'Use the Base64 to HTML tool to paste the encoded string and recover the original HTML markup.' },
      { question: 'Can I convert Base64 back to HTML?', answer: 'Yes. The matching Base64 to HTML decoder is designed to recover readable markup from Base64 strings.' },
    ],
    relatedSlugs: ['base64-to-html', 'css-to-base64', 'base64-to-css', 'text-to-base64'],
  },
  'css-to-base64': {
    seoTitle: 'CSS to Base64 Converter - Decode Base64 to CSS Online',
    metaDescription: 'Convert CSS to Base64 online for free. Encode stylesheet code and decode Base64 back into CSS instantly.',
    intro: 'Use this CSS to Base64 converter to encode stylesheet code, snippets, and small data URI workflows directly in your browser.',
    keywords: ['css to base64', 'base64 to css', 'css to base64 converter', 'base64 to css converter', 'convert css to base64', 'decode base64 to css', 'css data uri converter'],
    faqs: [
      { question: 'How to convert CSS to Base64?', answer: 'Paste the stylesheet code into the input and run the conversion to generate a Base64 string instantly.' },
      { question: 'How to decode Base64 to CSS?', answer: 'Use the Base64 to CSS tool to decode the Base64 payload back into readable stylesheet code.' },
      { question: 'Can I encode stylesheet code to Base64?', answer: 'Yes. Paste your stylesheet or CSS snippet into the input area and the tool will encode it locally in the browser.' },
    ],
    relatedSlugs: ['base64-to-css', 'image-to-base64', 'base64-to-image', 'html-to-base64'],
  },
  'file-to-base64': {
    seoTitle: 'File to Base64 Converter - Decode Base64 to File Online',
    metaDescription: 'Convert file to Base64 online for free. Encode documents, images, and binary files into Base64 or decode Base64 back into downloadable files.',
    intro: 'This file to Base64 converter is useful when you need to encode a file but do not want to choose a narrower type-specific tool. Upload a file and generate Base64 directly in your browser.',
    keywords: ['file to base64', 'base64 to file', 'file to base64 converter', 'base64 to file converter', 'convert file to base64', 'convert base64 to file', 'binary file to base64'],
    faqs: [
      { question: 'How to convert file to Base64?', answer: 'Upload the local file, run the conversion in the browser, and copy or download the resulting Base64 output.' },
      { question: 'How to decode Base64 to file?', answer: 'Open the Base64 to File tool, paste the Base64 content, and download the recovered binary file.' },
      { question: 'Can I encode any file to Base64?', answer: 'Yes. This page is designed for broad file-to-Base64 workflows, including documents, binaries, and other local file types.' },
    ],
    relatedSlugs: ['base64-to-file', 'pdf-to-base64', 'base64-to-pdf', 'image-to-base64'],
  },
  'audio-to-base64': {
    seoTitle: 'Audio to Base64 Converter - Convert Base64 to Audio Online',
    metaDescription: 'Convert audio to Base64 online for free. Encode MP3, WAV, OGG, and other audio files into Base64 or decode Base64 back into playable audio.',
    intro: 'Use this audio to Base64 converter to encode MP3, WAV, OGG, and similar audio files into Base64 for browser, embed, or API-related workflows.',
    keywords: ['audio to base64', 'base64 to audio', 'audio to base64 converter', 'base64 to audio converter', 'mp3 to base64', 'wav to base64', 'base64 to mp3', 'base64 audio data uri'],
    faqs: [
      { question: 'How to convert audio to Base64?', answer: 'Upload the audio file, let the browser encode it locally, and then copy or download the Base64 output.' },
      { question: 'How to decode Base64 audio?', answer: 'Use the Base64 to Audio tool to paste the encoded payload and recover playable or downloadable media.' },
      { question: 'How to convert MP3 to Base64?', answer: 'Choose the MP3 file in this tool and it will generate the Base64 output directly in the browser.' },
    ],
    relatedSlugs: ['base64-to-audio', 'file-to-base64', 'base64-to-file', 'text-to-base64'],
  },
  'base64-to-text': {
    seoTitle: 'Base64 to Text Converter - Decode Base64 Text Online',
    metaDescription: 'Decode Base64 to text online for free. Convert Base64 strings back into readable UTF-8 text instantly in your browser.',
    intro: 'Use this Base64 to Text converter to decode Base64 strings back into readable UTF-8 content. It is useful for debugging payloads, checking API responses, and recovering plain text.',
    keywords: ['base64 to text', 'text to base64', 'base64 to string', 'decode base64 to text', 'base64 to utf8', 'base64 string decoder', 'base64 decode text'],
    faqs: [
      { question: 'How to decode Base64 to text?', answer: 'Paste the Base64 string into the decoder input and the tool will recover the readable UTF-8 text instantly.' },
      { question: 'How to convert text to Base64?', answer: 'Use the Text to Base64 page when you need to encode plain text or strings into Base64 output.' },
      { question: 'Can I decode UTF-8 Base64 strings online?', answer: 'Yes. This tool is designed to decode UTF-8 text content directly in the browser.' },
    ],
    relatedSlugs: ['text-to-base64', 'base64-to-html', 'base64-to-css', 'base64-to-url'],
  },
  'base64-to-image': {
    seoTitle: 'Base64 to Image - Preview and Download PNG or JPG',
    metaDescription: 'Decode a Base64 image or image data URL, preview it, and download the recovered file. PNG, JPG, WebP and SVG data URLs; browser-based, no signup.',
    intro: 'Paste a Base64 image or a complete data URL to recover the image bytes, preview the result, and download the file. For JPG, WebP, or SVG, keep the image MIME prefix, such as data:image/jpeg;base64,. Raw Base64 without a prefix defaults to PNG. Decoding does not convert the image into a different format.',
    keywords: ['base64 to image', 'image to base64', 'base64 image decoder', 'convert base64 to image', 'base64 to jpg', 'base64 to png', 'base64 data uri image'],
    faqs: [
      { question: 'How do I decode and download a Base64 image?', answer: 'Paste the image Base64 or its complete data URL, select Decode Base64, check the image preview, then download the recovered file.' },
      { question: 'What is the difference between Base64 and an image data URL?', answer: 'A data URL includes a type prefix such as data:image/png;base64, before the encoded bytes. Keep that prefix when available so the download has the matching MIME type and extension. Raw input defaults to image/png.' },
      { question: 'Does Base64 to JPG convert a PNG into JPEG?', answer: 'No. Base64 decoding recovers the original bytes. A JPEG image data URL downloads as JPG, and a PNG remains PNG; changing the prefix does not transcode the image.' },
      { question: 'Why is my decoded image not displaying?', answer: 'Check that you copied the complete image data, not a URL, JSON object, or truncated string. A valid Base64 string may still contain a non-image file or an image format your browser cannot display. Use Base64 to File for other file types.' },
      { question: 'Is my Base64 image uploaded or saved?', answer: 'Decoding runs in this browser without a server upload. The temporary blob preview URL belongs to this browser session, not a public image host; download the file if you want to keep it.' },
    ],
    relatedSlugs: ['image-to-base64', 'base64-to-file', 'file-to-base64', 'base64-to-html'],
  },
  'base64-to-url': {
    seoTitle: 'Base64 to URL Decoder - Decode Base64 URL Online',
    metaDescription: 'Decode Base64 to URL format online for free. Fast, private and browser-based Base64 URL converter.',
    intro: 'Use this Base64 to URL converter to recover links, route segments, and URL-based payloads from Base64 strings. It is useful for developer debugging and transport checks.',
    keywords: ['base64 to url', 'url to base64', 'decode base64 url', 'base64 url converter', 'base64url decoder', 'base64 to link', 'url safe base64'],
    faqs: [
      { question: 'How to decode Base64 URL?', answer: 'Paste the Base64 string into the tool and it will decode the payload back into readable URL text.' },
      { question: 'How to encode URL to Base64?', answer: 'Use the URL to Base64 page to encode full links or route strings for storage and transport workflows.' },
      { question: 'What is Base64URL encoding?', answer: 'Base64URL is a URL-safe Base64 variation that avoids certain characters that are awkward in routes and query strings.' },
    ],
    relatedSlugs: ['url-to-base64', 'base64-to-text', 'text-to-base64', 'base64-to-html'],
  },
  'base64-to-hex': {
    seoTitle: 'Base64 to Hex Converter - Decode Base64 to Hex Online',
    metaDescription: 'Decode Base64 to hex online for free. Convert Base64 payloads back into hexadecimal output instantly in your browser.',
    intro: 'Use this Base64 to Hex converter to inspect Base64 payloads as hexadecimal output. It is useful for byte-level debugging, protocols, and developer tooling.',
    keywords: ['base64 to hex', 'hex to base64', 'base64 to hex converter', 'convert base64 to hex', 'base64 to hexadecimal', 'base64 hex decoder'],
    faqs: [
      { question: 'How to convert Base64 to Hex?', answer: 'Paste the Base64 string into the input field and the tool will decode it into a hexadecimal representation of the underlying bytes.' },
      { question: 'How to convert Hex to Base64?', answer: 'Use the Hex to Base64 page to paste hexadecimal input and generate the Base64 equivalent.' },
      { question: 'Can I decode Base64 into hexadecimal online?', answer: 'Yes. This tool is designed to recover hex output from Base64 directly in the browser.' },
    ],
    relatedSlugs: ['hex-to-base64', 'base64-to-file', 'file-to-base64', 'base64-to-text'],
  },
  'base64-to-pdf': {
    seoTitle: 'Base64 to PDF Converter - Decode Base64 to PDF Online',
    metaDescription: 'Convert Base64 to PDF online for free. Decode Base64 strings or data URIs into previewable and downloadable PDF files.',
    intro: 'Use this Base64 to PDF converter to recover previewable PDF documents from Base64 strings or data URIs. It works well for debugging upload payloads, API responses, and document transport workflows.',
    keywords: ['base64 to pdf', 'pdf to base64', 'base64 to pdf converter', 'convert base64 to pdf', 'decode base64 to pdf', 'base64 string to pdf'],
    faqs: [
      { question: 'How to decode Base64 to PDF?', answer: 'Paste the Base64 payload into the decoder and the tool will recover a previewable PDF document in the browser.' },
      { question: 'How to convert PDF to Base64?', answer: 'Use the PDF to Base64 tool to upload a document and encode it into Base64 output for transport or storage.' },
      { question: 'Can I convert Base64 string to PDF online?', answer: 'Yes. This tool is designed to convert Base64 PDF content back into a usable document file directly in the browser.' },
    ],
    relatedSlugs: ['pdf-to-base64', 'base64-to-file', 'file-to-base64', 'text-to-base64'],
  },
  'base64-to-html': {
    seoTitle: 'Base64 to HTML Converter - Decode Base64 to HTML Online',
    metaDescription: 'Decode Base64 to HTML online for free. Convert Base64 strings back into readable HTML markup instantly in your browser.',
    intro: 'Use this Base64 to HTML converter to recover markup from Base64 strings or encoded HTML payloads. It is helpful for template debugging, stored content review, and developer workflows.',
    keywords: ['base64 to html', 'html to base64', 'base64 to html converter', 'decode base64 to html', 'base64 html decoder', 'base64 to html code'],
    faqs: [
      { question: 'How to decode Base64 to HTML?', answer: 'Paste the Base64 string into the input and the tool will recover readable HTML source directly in the browser.' },
      { question: 'How to convert HTML to Base64?', answer: 'Use the HTML to Base64 page when you need to encode markup into Base64 output for transport or storage.' },
      { question: 'Can I convert Base64 back to HTML?', answer: 'Yes. This decoder is designed to turn Base64 content back into readable HTML markup.' },
    ],
    relatedSlugs: ['html-to-base64', 'base64-to-css', 'css-to-base64', 'base64-to-text'],
  },
  'base64-to-css': {
    seoTitle: 'Base64 to CSS Converter - Decode Base64 to CSS Online',
    metaDescription: 'Decode Base64 to CSS online for free. Convert Base64 strings back into readable stylesheet code instantly in your browser.',
    intro: 'Use this Base64 to CSS converter to recover stylesheet source from Base64 payloads. It is helpful for debugging encoded CSS, stored snippets, and inline transport workflows.',
    keywords: ['base64 to css', 'css to base64', 'base64 to css converter', 'decode base64 to css', 'base64 css decoder', 'base64 stylesheet decoder'],
    faqs: [
      { question: 'How to decode Base64 to CSS?', answer: 'Paste the Base64 payload into the tool and it will decode it back into readable CSS source.' },
      { question: 'How to convert CSS to Base64?', answer: 'Use the CSS to Base64 page to encode a stylesheet or CSS snippet into Base64 output.' },
      { question: 'Can I decode stylesheet code online?', answer: 'Yes. This page is designed to recover readable CSS from Base64 without leaving the browser.' },
    ],
    relatedSlugs: ['css-to-base64', 'base64-to-html', 'html-to-base64', 'base64-to-image'],
  },
  'base64-to-file': {
    seoTitle: 'Base64 to File Converter - Decode Base64 to File Online',
    metaDescription: 'Convert Base64 to file online for free. Decode Base64 strings and recover downloadable files directly in your browser.',
    intro: 'Use this Base64 to File converter to recover downloadable files from Base64 strings or data URLs. It is a flexible option when you have encoded file content but do not want to assume a narrower type.',
    keywords: ['base64 to file', 'file to base64', 'base64 to file converter', 'decode base64 to file', 'download base64 as file', 'base64 string to file'],
    faqs: [
      { question: 'How to decode Base64 to file?', answer: 'Paste the Base64 string into the tool and it will recover the binary payload so you can download it as a file.' },
      { question: 'How to convert file to Base64?', answer: 'Use the File to Base64 page to upload a local file and encode it into Base64 output.' },
      { question: 'Can I recover binary files from Base64?', answer: 'Yes. This page is designed to decode Base64 content back into a downloadable binary file.' },
    ],
    relatedSlugs: ['file-to-base64', 'base64-to-pdf', 'pdf-to-base64', 'base64-to-image'],
  },
  'base64-to-audio': {
    seoTitle: 'Base64 to Audio Converter - Decode Base64 to Audio Online',
    metaDescription: 'Convert Base64 to audio online for free. Decode Base64 strings or data URIs into playable and downloadable audio files.',
    intro: 'Use this Base64 to Audio converter to recover playable media from Base64 payloads or audio data URIs. It is useful for testing, preview, and developer debugging workflows.',
    keywords: ['base64 to audio', 'audio to base64', 'base64 to audio converter', 'convert base64 to audio', 'base64 to mp3', 'base64 to wav', 'base64 audio decoder'],
    faqs: [
      { question: 'How to decode Base64 audio?', answer: 'Paste the Base64 payload into the tool and it will recover playable audio directly in the browser.' },
      { question: 'How to convert MP3 to Base64?', answer: 'Use the Audio to Base64 page to upload an MP3 or similar audio file and generate Base64 output.' },
      { question: 'How to convert Base64 to MP3?', answer: 'Paste the encoded payload into this page, preview the recovered audio, and download it if needed.' },
    ],
    relatedSlugs: ['audio-to-base64', 'base64-to-file', 'file-to-base64', 'text-to-base64'],
  },
};

export const base64ToolPages: Base64ToolPageEntry[] = toolPages.map((tool) => {
  const config = seoConfigBySlug[tool.slug];

  return {
    ...tool,
    path: `/tools/${tool.slug}/`,
    seoTitle: config.seoTitle,
    metaDescription: config.metaDescription,
    intro: config.intro,
    keywords: config.keywords,
    faqs: config.faqs,
    relatedSlugs: config.relatedSlugs,
  };
});

export function getBase64ToolPageBySlug(slug: string) {
  return base64ToolPages.find((tool) => tool.slug === slug);
}

export function getBase64ToolPath(tool: Base64ToolPageEntry) {
  return tool.path;
}

export function buildBase64ToolMetadata(tool: Base64ToolPageEntry): Metadata {
  return {
    title: tool.seoTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    alternates: {
      canonical: siteRoute(tool.path),
    },
    openGraph: { images: ['/social-preview.png'],
      title: tool.seoTitle,
      description: tool.metaDescription,
      url: siteRoute(tool.path),
      type: 'website',
      siteName: SITE_NAME,
    },
    twitter: { images: ['/social-preview.png'],
      card: 'summary_large_image',
      title: tool.seoTitle,
      description: tool.metaDescription,
    },
  };
}
