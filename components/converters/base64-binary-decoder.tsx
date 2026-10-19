'use client';

import { useEffect, useState } from 'react';
import { trackDownload } from '@/lib/analytics';
import { base64ToBytes, bytesToBlobUrl, formatBytes, formatTextSize, parseBase64Input } from '@/lib/base64';

interface Base64BinaryDecoderProps {
  inputLabel: string;
  inputDescription: string;
  inputPlaceholder: string;
  outputTitle: string;
  outputDescription: string;
  emptyState: string;
  downloadName: string;
  defaultMimeType: string;
  previewLabel: string;
  renderPreview?: (blobUrl: string, mimeType: string) => React.ReactNode;
}

export function Base64BinaryDecoder({
  inputLabel,
  inputDescription,
  inputPlaceholder,
  outputTitle,
  outputDescription,
  emptyState,
  downloadName,
  defaultMimeType,
  previewLabel,
  renderPreview,
}: Base64BinaryDecoderProps) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const [source, setSource] = useState('');
  const [blobUrl, setBlobUrl] = useState('');
  const [mimeType, setMimeType] = useState(defaultMimeType);
  const [bytes, setBytes] = useState<Uint8Array | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [blobUrl]);

  const handleDecode = () => {
    if (!source.trim()) {
      setError('Add a Base64 value before decoding.');
      setBytes(null);
      setBlobUrl('');
      return;
    }

    try {
      const parsed = parseBase64Input(source);
      const nextBytes = base64ToBytes(source);
      const nextMimeType = parsed.mimeType || defaultMimeType;
      if (renderPreview && (defaultMimeType === 'application/pdf' ? nextMimeType !== 'application/pdf' : !nextMimeType.startsWith(defaultMimeType.split('/')[0] + '/'))) {
        throw new Error('The data URL type does not match this decoder. Use Base64 to File for other file types.');
      }
      const nextBlobUrl = bytesToBlobUrl(nextBytes, nextMimeType);

      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }

      setBytes(nextBytes);
      setMimeType(nextMimeType);
      setBlobUrl(nextBlobUrl);
      setCopied(false);
      setError('');
    } catch (decodeError) {
      setError(
        decodeError instanceof Error ? decodeError.message : 'Unable to decode this Base64 content.',
      );
      setBytes(null);
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
      setBlobUrl('');
    }
  };

  const handleCopy = async () => {
    if (!blobUrl) {
      return;
    }

    try {
      await navigator.clipboard.writeText(blobUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Clipboard access was blocked. You can still download the recovered file directly.');
    }
  };

  const handleDownload = () => {
    if (!blobUrl) {
      return;
    }

    const known: Record<string, string> = { 'application/octet-stream': 'bin', 'image/jpeg': 'jpg', 'image/svg+xml': 'svg', 'audio/mpeg': 'mp3', 'application/pdf': 'pdf' };
    const extension = known[mimeType] ?? mimeType.split('/')[1]?.split(';')[0].replace(/[^a-z0-9]/gi, '') ?? 'bin';
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = `${downloadName}.${extension}`;
    document.body.appendChild(link);
    link.click();
    trackDownload(mimeType);
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
            className="min-h-72 w-full rounded-[1.5rem] border border-slate-200 bg-white p-4 font-mono text-sm leading-7 text-slate-700 outline-none transition focus:border-cyan-400"
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
              Decode Base64
            </button>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-5 sm:p-6">
          <h3 className="text-xl font-semibold text-slate-950">{previewLabel}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Decode the Base64 payload to preview the recovered asset and download the original content.
          </p>

          {blobUrl && bytes ? (
            <div className="mt-5 space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Mime Type
                  </p>
                  <p className="mt-2 break-all text-sm font-medium text-slate-900">{mimeType}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Recovered Size
                  </p>
                  <p className="mt-2 text-sm font-medium text-slate-900">{formatBytes(bytes.byteLength)}</p>
                </div>
              </div>

              {renderPreview ? (
                renderPreview(blobUrl, mimeType)
              ) : (
                <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
                  Binary content recovered successfully. Use the download button to save the file.
                </div>
              )}
            </div>
          ) : (
            <div className="mt-5 rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center text-sm text-slate-500">
              {emptyState}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-[1.75rem] border border-slate-200 bg-[linear-gradient(180deg,_#fff_0%,_#f8fafc_100%)] p-5 sm:p-6">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">{outputTitle}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{outputDescription}</p>
          </div>
          {bytes ? (
            <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold text-cyan-700">
              {formatBytes(bytes.byteLength)}
            </span>
          ) : null}
        </div>

        <div className="mt-5">
          {blobUrl ? (
            <div className="space-y-4">
              <textarea
                value={blobUrl}
                readOnly
                className="min-h-80 w-full rounded-3xl border border-slate-200 bg-white p-4 font-mono text-xs leading-6 text-slate-700 outline-none ring-0"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  {copied ? 'Copied' : 'Copy Blob URL'}
                </button>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  Download File
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
    </div>
  );
}
