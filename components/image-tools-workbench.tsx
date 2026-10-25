'use client';

import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';
import { ToolWorkspace } from '@/components/tool-workspace';

const ImageCompressorTool = dynamic(() => import('./converters/image-compressor-tool').then(mod => mod.ImageCompressorTool));
const ImageResizerTool = dynamic(() => import('./converters/image-resizer-tool').then(mod => mod.ImageResizerTool));
const ImageFormatConverterTool = dynamic(() => import('./converters/image-format-converter-tool').then(mod => mod.ImageFormatConverterTool));
const ImageCropperTool = dynamic(() => import('./converters/image-cropper-tool').then(mod => mod.ImageCropperTool));
const ServerConverterTool = dynamic(() => import('./converters/server-converter-tool').then(mod => mod.ServerConverterTool));
import { imageTools } from '@/lib/image-tools';
import { getImageToolPath, imageToolPages } from '@/lib/image-tools-pages';

interface ImageToolsWorkbenchProps {
  initialTool?: string;
}

const toolComponents: Record<string, ComponentType> = {
  'image-compressor': ImageCompressorTool,
  'image-resizer': ImageResizerTool,
  'background-remover': () => <ServerConverterTool tool="background-remover" />,
  'jpg-to-png': () => (
    <ImageFormatConverterTool
      targetFormat="image/png"
      label="PNG"
    />
  ),
  'png-to-jpg': () => (
    <ImageFormatConverterTool
      targetFormat="image/jpeg"
      label="JPG"
    />
  ),
  'webp-converter': () => (
    <ImageFormatConverterTool
      targetFormat="image/webp"
      label="WebP"
    />
  ),
  'image-cropper': ImageCropperTool,
};

export function ImageToolsWorkbench({ initialTool = 'image-compressor' }: ImageToolsWorkbenchProps) {
  const activeTool = initialTool;
  const activeOption = imageTools.find(tool => tool.id === activeTool) ?? imageTools[0];
  const ActiveComponent = toolComponents[activeTool];
  const options = imageToolPages.map(page => ({ ...imageTools.find(tool => tool.id === page.id)!, href: getImageToolPath(page) }));
  return (
    <ToolWorkspace studio="Image Studio" studioHref="/image-studio/" icon="image" tone="image" title={activeOption.label} description={activeOption.longDescription} activeId={activeTool} groups={[{ label: 'All image tools', options }]} serverProcessing={activeTool === 'background-remover'}>
      {ActiveComponent ? <ActiveComponent key={activeTool} /> : <p className="theme-muted">This tool is not available yet.</p>}
    </ToolWorkspace>
  );
}
