'use client';

import { useEffect, useState } from 'react';
import { ConversionOutput } from '@/components/converters/conversion-output';
import { formatTextSize } from '@/lib/base64';

interface Base64SourceDecoderProps {
  inputLabel: string;
  inputDescription: string;
  inputPlaceholder: string;
  outputTitle: string;
  outputDescription: string;
  emptyState: string;
  downloadName: string;
  actionLabel?: string;
  transform: (input: string) => string;
}

export function Base64SourceDecoder({
  inputLabel,
  inputDescription,
  inputPlaceholder,
  outputTitle,
  outputDescription,
  emptyState,
  downloadName,
  actionLabel = 'Decode Base64',
  transform,
}: Base64SourceDecoderProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [source, setSource] = useState('');
  const [decoded, setDecoded] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleDecode = () => {
    if (!source.trim()) {
      setError('Add a Base64 value before decoding.');
      setDecoded('');
      return;
    }

    try {
      setDecoded(transform(source));
      setError('');
      setCopied(false);
    } catch (decodeError) {
      setError(
        decodeError instanceof Error ? decodeError.message : 'Unable to decode this Base64 content.',
      );
      setDecoded('');
    }
  };

  const handleCopy = async () => {
    if (!decoded) {
      return;
    }

    try {
      await navigator.clipboard.writeText(decoded);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Clipboard access was blocked. You can still copy manually from the output box.');
    }
  };

  const handleDownload = () => {
    if (!decoded) {
      return;
    }

    const link = document.createElement('a');
    link.href = `data:text/plain;charset=utf-8,${encodeURIComponent(decoded)}`;
    link.download = `${downloadName}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <div className="space-y-6">
        <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-5 sm:p-6">
          <div className="mb-5">
            <h3 className="text-xl font-semibold text-slate-950">{inputLabel}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{inputDescription}</p>
          </div>

          <textarea
            disabled={!ready}
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder={inputPlaceholder}
            className="min-h-72 w-full rounded-[1.5rem] border border-slate-200 bg-white p-4 font-mono text-sm leading-7 text-slate-700 outline-none transition focus:border-sky-400"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              {source ? formatTextSize(source.length) : 'Ready for Base64 input'}
            </div>
            <button
              type="button"
              disabled={!ready}
              onClick={handleDecode}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {actionLabel}
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-slate-950">Decode Notes</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Raw Base64 and `data:*;base64,...` input are both supported. Whitespace and line breaks are ignored automatically.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Input Length
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {source ? `${source.length} characters` : 'No content yet'}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Output Length
              </p>
              <p className="mt-2 text-sm font-medium text-slate-900">
                {decoded ? `${decoded.length} characters` : 'No output yet'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConversionOutput
        title={outputTitle}
        description={outputDescription}
        base64={decoded}
        loading={false}
        copied={copied}
        onCopy={handleCopy}
        onDownload={handleDownload}
        outputSizeLabel={decoded ? formatTextSize(decoded.length) : null}
        emptyState={emptyState}
      />
    </div>
  );
}
