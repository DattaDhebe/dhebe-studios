'use client';

import { useId } from 'react';

interface ConversionOutputProps {
  title: string;
  description: string;
  base64: string;
  loading: boolean;
  copied: boolean;
  copyLabel?: string;
  onCopy: () => Promise<void>;
  onDownload: () => void;
  outputSizeLabel: string | null;
  emptyState: string;
}

export function ConversionOutput({
  title,
  description,
  base64,
  loading,
  copied,
  copyLabel = 'Copy Base64',
  onCopy,
  onDownload,
  outputSizeLabel,
  emptyState,
}: ConversionOutputProps) {
  const outputId = useId();
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,_#fff_0%,_#f8fafc_100%)] p-5 sm:p-6">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 id={outputId} className="text-xl font-semibold text-slate-950">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
        </div>
        {outputSizeLabel ? (
          <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
            {outputSizeLabel}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-slate-200 bg-slate-50 px-6 text-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-sky-600" />
            <p className="mt-4 text-sm font-medium text-slate-700">Encoding in progress...</p>
          </div>
        ) : base64 ? (
          <div className="space-y-4">
            <textarea
              aria-labelledby={outputId}
              value={base64}
              readOnly
              className="min-h-80 w-full rounded-3xl border border-slate-200 bg-white p-4 font-mono text-xs leading-6 text-slate-700 outline-none ring-0"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={onCopy}
                className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                {copied ? 'Copied' : copyLabel}
              </button>
              <button
                type="button"
                onClick={onDownload}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
              >
                Download TXT
              </button>
            </div>
          </div>
        ) : (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
            <p className="max-w-md text-sm leading-7 text-slate-500">{emptyState}</p>
          </div>
        )}
      </div>
    </div>
  );
}
