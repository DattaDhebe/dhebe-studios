'use client';

import { useRef, useState } from 'react';
import { downloadBlob } from '@/lib/download';
import { ConversionOutput } from '@/components/converters/conversion-output';
import { FileDropZone } from '@/components/converters/file-drop-zone';
import { fileToDataUrl, formatBytes, formatTextSize } from '@/lib/base64';

export function ImageToBase64Converter() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSelect = async (selectedFile: File | null) => {
    if (!selectedFile) {
      return;
    }

    if (!selectedFile.type.startsWith('image/')) {
      setError('Choose an image file such as PNG, JPG, WEBP, GIF, or SVG.');
      return;
    }

    setError('');
    setLoading(true);
    setFile(selectedFile);
    setBase64('');
    setCopied(false);

    try {
      const encoded = await fileToDataUrl(selectedFile);
      setBase64(encoded);
    } catch (conversionError) {
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : 'Unable to convert this image.',
      );
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!base64) {
      return;
    }

    try {
      await navigator.clipboard.writeText(base64);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Clipboard access was blocked. You can still copy manually from the output box.');
    }
  };

  const downloadOutput = () => {
    if (!base64) {
      return;
    }

    const safeName = (file?.name ?? 'image')
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9-_]+/gi, '-')
      .toLowerCase();

    downloadBlob(new Blob([base64], { type: 'text/plain;charset=utf-8' }), `${safeName || 'image'}.base64.txt`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="space-y-6">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Upload Image</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Convert a local image into a Base64 data URL for inline previews, APIs, or storage.
              </p>
            </div>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
              Image/*
            </span>
          </div>

          <FileDropZone
            accept="image/*"
            activeFileName={file?.name ?? null}
            inputRef={fileInputRef}
            onSelect={handleSelect}
            helperText="Drag an image here or browse locally. PNG, JPG, GIF, WEBP, and SVG all work."
          />

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-slate-950">Image Preview</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Confirm the selected image before exporting the Base64 string.
          </p>

          {file && base64 ? (
            <div className="mt-5 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    File Name
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-900">
                    {file.name}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    File Size
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>

              <div className="flex min-h-72 items-center justify-center rounded-[1.75rem] border border-slate-200 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.1),_transparent_34%),linear-gradient(180deg,_#f8fafc_0%,_#ffffff_100%)] p-6">
                <img
                  src={base64}
                  alt={file.name}
                  className="max-h-80 w-auto rounded-2xl object-contain shadow-[0_20px_50px_rgba(15,23,42,0.12)]"
                />
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              Select an image to preview it here.
            </div>
          )}
        </div>
      </div>

      <ConversionOutput
        title="Base64 Output"
        description="The encoded image remains local to your browser and is ready to paste into CSS, HTML, or APIs."
        base64={base64}
        loading={loading}
        copied={copied}
        onCopy={copyToClipboard}
        onDownload={downloadOutput}
        outputSizeLabel={base64 ? formatTextSize(base64.length) : null}
        emptyState="Upload an image to generate the Base64 output."
      />
    </div>
  );
}
