'use client';

import dynamic from 'next/dynamic';
import { type ComponentType, useEffect, useState } from 'react';
import { ToolWorkspace } from '@/components/tool-workspace';
import { usePathname, useRouter } from 'next/navigation';

const PdfCompressorTool = dynamic(() => import('@/components/converters/pdf-compressor-tool').then(mod => mod.PdfCompressorTool), { loading: () => <div className="p-12 text-center theme-muted">Loading compressor...</div> });
const PdfComingSoonTool = dynamic(() => import('@/components/converters/pdf-coming-soon-tool').then(mod => mod.PdfComingSoonTool));
const PdfMergerTool = dynamic(() => import('@/components/converters/pdf-merger-tool').then(mod => mod.PdfMergerTool), { loading: () => <div className="p-12 text-center theme-muted">Loading merger...</div> });
const PdfRemovePagesTool = dynamic(() => import('@/components/converters/pdf-remove-pages-tool').then(mod => mod.PdfRemovePagesTool));
const PdfRotateTool = dynamic(() => import('@/components/converters/pdf-rotate-tool').then(mod => mod.PdfRotateTool));
const PdfSplitterTool = dynamic(() => import('@/components/converters/pdf-splitter-tool').then(mod => mod.PdfSplitterTool));
const PdfWatermarkTool = dynamic(() => import('@/components/converters/pdf-watermark-tool').then(mod => mod.PdfWatermarkTool));
const PdfAnnotationTool = dynamic(() => import('@/components/converters/pdf-annotation-tool').then(mod => mod.PdfAnnotationTool));
const PdfFormFillerTool = dynamic(() => import('@/components/converters/pdf-form-filler-tool').then(mod => mod.PdfFormFillerTool));
const PdfEditTool = dynamic(() => import('@/components/converters/pdf-edit-tool').then(mod => mod.PdfEditTool));
const PdfSignTool = dynamic(() => import('@/components/converters/pdf-sign-tool').then(mod => mod.PdfSignTool));
const PdfOrganizeTool = dynamic(() => import('@/components/converters/pdf-organize-tool').then(mod => mod.PdfOrganizeTool));
const PdfOcrTool = dynamic(() => import('@/components/converters/pdf-ocr-tool').then(mod => mod.PdfOcrTool));
const PdfExtractPagesTool = dynamic(() => import('@/components/converters/pdf-extract-pages-tool').then(mod => mod.PdfExtractPagesTool));
const PdfAddPageNumbersTool = dynamic(() => import('@/components/converters/pdf-add-page-numbers-tool').then(mod => mod.PdfAddPageNumbersTool));
const PdfToJpgTool = dynamic(() => import('@/components/converters/pdf-to-jpg-tool').then(mod => mod.PdfToJpgTool));
const JpgToPdfTool = dynamic(() => import('@/components/converters/jpg-to-pdf-tool').then(mod => mod.JpgToPdfTool));
const PdfBuilderTool = dynamic(() => import('@/components/converters/pdf-builder-tool').then(mod => mod.PdfBuilderTool));
const PdfExporterTool = dynamic(() => import('@/components/converters/pdf-exporter-tool').then(mod => mod.PdfExporterTool));
const PdfCropTool = dynamic(() => import('@/components/converters/pdf-crop-tool').then(mod => mod.PdfCropTool));
const ServerConverterTool = dynamic(() => import('@/components/converters/server-converter-tool').then(mod => mod.ServerConverterTool));
import { pdfTools } from '@/lib/pdf-tools';
import { serverToolIds } from '@/lib/tool-service';
import { getPdfToolPath, pdfToolPages } from '@/lib/pdf-tools-pages';

interface PdfToolsWorkbenchProps {
  initialTool?: string;
}

const toolComponents: Record<string, ComponentType> = {
  compress: PdfCompressorTool,
  merge: PdfMergerTool,
  split: PdfSplitterTool,
  rotate: PdfRotateTool,
  'remove-pages': PdfRemovePagesTool,
  watermark: PdfWatermarkTool,
  annotate: PdfAnnotationTool,
  'form-fill': PdfFormFillerTool,
  protect: () => <ServerConverterTool tool="protect" />,
  'pdf-to-word': () => <ServerConverterTool tool="pdf-to-word" />,
  edit: PdfEditTool,
  sign: PdfSignTool,
  organize: PdfOrganizeTool,
  ocr: PdfOcrTool,
  'extract-pages': PdfExtractPagesTool,
  'add-page-numbers': PdfAddPageNumbersTool,
  'pdf-to-jpg': PdfToJpgTool,
  'jpg-to-pdf': JpgToPdfTool,
  'scan-to-pdf': () => <PdfBuilderTool mode="scan-to-pdf" />,
  optimize: PdfCompressorTool,
  repair: () => <ServerConverterTool tool="repair" />,
  'convert-to-pdf': () => <PdfBuilderTool mode="convert-to-pdf" />,
  'word-to-pdf': () => <ServerConverterTool tool="word-to-pdf" />,
  'powerpoint-to-pdf': () => <ServerConverterTool tool="powerpoint-to-pdf" />,
  'excel-to-pdf': () => <ServerConverterTool tool="excel-to-pdf" />,
  'html-to-pdf': () => <ServerConverterTool tool="html-to-pdf" />,
  'convert-from-pdf': () => <PdfExporterTool mode="convert-from-pdf" />,
  'pdf-to-powerpoint': () => <ServerConverterTool tool="pdf-to-powerpoint" />,
  'pdf-to-excel': () => <ServerConverterTool tool="pdf-to-excel" />,
  'pdf-to-pdfa': () => <ServerConverterTool tool="pdf-to-pdfa" />,
  'crop-pdf': PdfCropTool,
};

export function PdfToolsWorkbench({ initialTool = 'pdf-to-word' }: PdfToolsWorkbenchProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [activeTool, setActiveTool] = useState(initialTool);
  useEffect(() => setActiveTool(initialTool), [initialTool]);
  const activeOption = pdfTools.find(tool => tool.id === activeTool) ?? pdfTools[0];
  const activeToolPage = pdfToolPages.find(tool => tool.id === activeTool);
  const isDedicatedToolPage = activeToolPage
    ? pathname.replace(/\/+$/, '') === getPdfToolPath(activeToolPage).replace(/\/+$/, '')
    : false;
  const ActiveComponent = toolComponents[activeTool];
  const handleToolSelect = (id: string) => {
    const target = pdfToolPages.find(tool => tool.id === id);
    if (isDedicatedToolPage && target) router.push(getPdfToolPath(target));
    else setActiveTool(id);
  };
  return (
    <ToolWorkspace studio="PDF Studio" studioHref="/pdf-studio/" icon="pdf" tone="pdf" title={activeOption.label} description={activeOption.longDescription} activeId={activeTool} groups={[{ label: 'All PDF tools', options: pdfTools }]} onSelect={handleToolSelect} serverProcessing={serverToolIds.has(activeTool)}>
      {ActiveComponent ? <ActiveComponent key={activeTool} /> : <PdfComingSoonTool label={activeOption.label} description={activeOption.longDescription} />}
    </ToolWorkspace>
  );
}
