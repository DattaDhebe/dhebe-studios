'use client';

import { useEffect, useState } from 'react';
import { downloadBlob } from '@/lib/download';
import { ConversionOutput } from '@/components/converters/conversion-output';
import { formatTextSize } from '@/lib/base64';

interface TextSourceConverterProps {
  inputLabel: string;
  inputDescription: string;
  inputPlaceholder: string;
  outputTitle: string;
  outputDescription: string;
  emptyState: string;
  downloadName: string;
  transform: (input: string) => string;
}

export function TextSourceConverter({
  inputLabel,
  inputDescription,
  inputPlaceholder,
  outputTitle,
  outputDescription,
  emptyState,
  downloadName,
  transform,
}: TextSourceConverterProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [source, setSource] = useState('');
  const [base64, setBase64] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleConvert = () => {
    if (!source.trim()) {
      setError('Add some content before converting.');
      setBase64('');
      return;
    }

    try {
      setBase64(transform(source));
      setError('');
      setCopied(false);
    } catch (conversionError) {
      setError(
        conversionError instanceof Error
          ? conversionError.message
          : 'Unable to convert this content.',
      );
      setBase64('');
    }
  };

  const handleCopy = async () => {
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

  const handleDownload = () => {
    if (!base64) {
      return;
    }

    downloadBlob(new Blob([base64], { type: 'text/plain;charset=utf-8' }), `${downloadName}.base64.txt`);
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
            className="min-h-72 w-full rounded-[1.5rem] border border-slate-200 bg-white p-4 font-mono text-sm leading-7 text-slate-700 outline-none transition focus:border-orange-400"
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-500">
              {source ? formatTextSize(source.length) : 'Ready for input'}
            </div>
            <button
              type="button"
              disabled={!ready}
              onClick={handleConvert}
              className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              Convert to Base64
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-slate-950">Conversion Notes</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Input text is encoded as UTF-8 before the Base64 conversion, so symbols and multi-language content stay stable.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                Source Length
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
                {base64 ? `${base64.length} characters` : 'No output yet'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <ConversionOutput
        title={outputTitle}
        description={outputDescription}
        base64={base64}
        loading={false}
        copied={copied}
        onCopy={handleCopy}
        onDownload={handleDownload}
        outputSizeLabel={base64 ? formatTextSize(base64.length) : null}
        emptyState={emptyState}
      />
    </div>
  );
}
