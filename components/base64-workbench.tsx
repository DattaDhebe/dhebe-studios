'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { converterOptions } from '@/lib/converters';
import { decoderOptions } from '@/lib/decoders';
import { ToolWorkspace } from '@/components/tool-workspace';

const AudioToBase64Converter = dynamic(() => import('@/components/converters/audio-to-base64-converter').then(mod => mod.AudioToBase64Converter), { loading: () => <div className="p-12 text-center theme-muted">Loading converter...</div> });
const CssToBase64Converter = dynamic(() => import('@/components/converters/css-to-base64-converter').then(mod => mod.CssToBase64Converter));
const FileToBase64Converter = dynamic(() => import('@/components/converters/file-to-base64-converter').then(mod => mod.FileToBase64Converter));
const HexToBase64Converter = dynamic(() => import('@/components/converters/hex-to-base64-converter').then(mod => mod.HexToBase64Converter));
const HtmlToBase64Converter = dynamic(() => import('@/components/converters/html-to-base64-converter').then(mod => mod.HtmlToBase64Converter));
const ImageToBase64Converter = dynamic(() => import('@/components/converters/image-to-base64-converter').then(mod => mod.ImageToBase64Converter));
const PdfToBase64Converter = dynamic(() => import('@/components/converters/pdf-to-base64-converter').then(mod => mod.PdfToBase64Converter));
const TextToBase64Converter = dynamic(() => import('@/components/converters/text-to-base64-converter').then(mod => mod.TextToBase64Converter));
const UrlToBase64Converter = dynamic(() => import('@/components/converters/url-to-base64-converter').then(mod => mod.UrlToBase64Converter));

const Base64ToAudioDecoder = dynamic(() => import('@/components/converters/base64-to-audio-decoder').then(mod => mod.Base64ToAudioDecoder), { loading: () => <div className="p-12 text-center theme-muted">Loading decoder...</div> });
const Base64ToCssDecoder = dynamic(() => import('@/components/converters/base64-to-css-decoder').then(mod => mod.Base64ToCssDecoder));
const Base64ToFileDecoder = dynamic(() => import('@/components/converters/base64-to-file-decoder').then(mod => mod.Base64ToFileDecoder));
const Base64ToHexDecoder = dynamic(() => import('@/components/converters/base64-to-hex-decoder').then(mod => mod.Base64ToHexDecoder));
const Base64ToHtmlDecoder = dynamic(() => import('@/components/converters/base64-to-html-decoder').then(mod => mod.Base64ToHtmlDecoder));
const Base64ToImageDecoder = dynamic(() => import('@/components/converters/base64-to-image-decoder').then(mod => mod.Base64ToImageDecoder));
const Base64ToPdfDecoder = dynamic(() => import('@/components/converters/base64-to-pdf-decoder').then(mod => mod.Base64ToPdfDecoder));
const Base64ToTextDecoder = dynamic(() => import('@/components/converters/base64-to-text-decoder').then(mod => mod.Base64ToTextDecoder));
const Base64ToUrlDecoder = dynamic(() => import('@/components/converters/base64-to-url-decoder').then(mod => mod.Base64ToUrlDecoder));
const ComingSoonConverter = dynamic(() => import('@/components/converters/coming-soon-converter').then(mod => mod.ComingSoonConverter));

const implementedConverters = {
  audio: AudioToBase64Converter,
  css: CssToBase64Converter,
  file: FileToBase64Converter,
  hex: HexToBase64Converter,
  html: HtmlToBase64Converter,
  image: ImageToBase64Converter,
  pdf: PdfToBase64Converter,
  text: TextToBase64Converter,
  url: UrlToBase64Converter,
} as const;

const implementedDecoders = {
  audio: Base64ToAudioDecoder,
  css: Base64ToCssDecoder,
  file: Base64ToFileDecoder,
  hex: Base64ToHexDecoder,
  html: Base64ToHtmlDecoder,
  image: Base64ToImageDecoder,
  pdf: Base64ToPdfDecoder,
  text: Base64ToTextDecoder,
  url: Base64ToUrlDecoder,
} as const;

type ActiveTool =
  | { kind: 'converter'; id: string }
  | { kind: 'decoder'; id: string };

interface Base64WorkbenchProps {
  initialTool?: ActiveTool;
}

export function Base64Workbench({ initialTool }: Base64WorkbenchProps) {
  const [activeTool, setActiveTool] = useState<ActiveTool>(initialTool ?? { kind: 'converter', id: 'text' });
  useEffect(() => {
    if (initialTool) setActiveTool(initialTool);
  }, [initialTool?.kind, initialTool?.id]);
  const isDecoder = activeTool.kind === 'decoder';
  const options = isDecoder ? decoderOptions : converterOptions;
  const activeOption = options.find(option => option.id === activeTool.id) ?? options[0];
  const components = isDecoder ? implementedDecoders : implementedConverters;
  const ActiveComponent = components[activeTool.id as keyof typeof components];
  const groups = [
    { label: 'Encode to Base64', options: converterOptions.map(option => ({ ...option, id: 'converter:' + option.id })) },
    { label: 'Decode from Base64', options: decoderOptions.map(option => ({ ...option, id: 'decoder:' + option.id })) },
  ];
  return (
    <ToolWorkspace studio="Base64 Studio" studioHref="/base64-converter/" icon="code" tone="code" title={activeOption.label} description={activeOption.longDescription} activeId={activeTool.kind + ':' + activeTool.id} groups={groups} onSelect={value => { const [kind, id] = value.split(':'); setActiveTool({ kind: kind as ActiveTool['kind'], id }); }}>
      {ActiveComponent ? <ActiveComponent key={activeTool.kind + ':' + activeTool.id} /> : <ComingSoonConverter label={activeOption.label} nextHint="Try another tool from the list." />}
    </ToolWorkspace>
  );
}
