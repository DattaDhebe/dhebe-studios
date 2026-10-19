'use client';

import { useRef, useState } from 'react';
import { downloadBlob } from '@/lib/download';
import { ConversionOutput } from '@/components/converters/conversion-output';
import { FileDropZone } from '@/components/converters/file-drop-zone';
import { fileToDataUrl, formatBytes, formatTextSize } from '@/lib/base64';

export function FileToBase64Converter() {
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
          : 'Unable to convert this file.',
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

    const safeName = (file?.name ?? 'file')
      .replace(/\.[^.]+$/, '')
      .replace(/[^a-z0-9-_]+/gi, '-')
      .toLowerCase();

    downloadBlob(new Blob([base64], { type: 'text/plain;charset=utf-8' }), `${safeName || 'file'}.base64.txt`);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="space-y-6">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Upload Any File</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Convert documents, archives, media, and other local assets into a Base64 data URL.
              </p>
            </div>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              Any file
            </span>
          </div>

          <FileDropZone
            accept="*/*"
            activeFileName={file?.name ?? null}
            inputRef={fileInputRef}
            onSelect={handleSelect}
            helperText="Drag a file here or browse locally. The conversion happens in your browser."
          />

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-slate-950">File Summary</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Check the original file details and the resulting data footprint before you export the Base64 text.
          </p>

          {file ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              Select a local file to inspect it here.
            </div>
          )}
        </div>
      </div>

      <ConversionOutput
        title="Base64 Output"
        description="The converted payload is a standard data URL string that you can copy, store, or send."
        base64={base64}
        loading={loading}
        copied={copied}
        onCopy={copyToClipboard}
        onDownload={downloadOutput}
        outputSizeLabel={base64 ? formatTextSize(base64.length) : null}
        emptyState="Upload a file to generate the Base64 output."
      />
    </div>
  );
}
