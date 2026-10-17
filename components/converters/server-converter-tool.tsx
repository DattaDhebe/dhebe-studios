'use client';

import { useEffect, useRef, useState } from 'react';
import { PdfDropZone } from './pdf-drop-zone';
import { convertOnServer } from '@/lib/tool-service';
import { downloadBlob } from '@/lib/download';

const accepts: Record<string, string> = {
  'word-to-pdf': '.doc,.docx,.odt',
  'powerpoint-to-pdf': '.ppt,.pptx,.odp',
  'excel-to-pdf': '.xls,.xlsx,.ods,.csv',
  'html-to-pdf': '.html,.htm',
  'background-remover': 'image/png,image/jpeg,image/webp',
};

export function ServerConverterTool({ tool }: { tool: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const request = useRef<AbortController | null>(null);
  useEffect(() => () => request.current?.abort(), []);

  const convert = async () => {
    if (!file || request.current) return;
    if (tool === 'protect' && password.length < 8) return setError('Use a password with at least 8 characters.');
    request.current = new AbortController();
    setBusy(true);
    setError('');
    setDone(false);
    try {
      const result = await convertOnServer(tool, file, password, request.current.signal);
      downloadBlob(result.blob, result.filename);
      setDone(true);
      setPassword('');
    } catch (err) {
      setError(err instanceof Error && err.name === 'AbortError' ? 'Conversion cancelled.' : err instanceof Error ? err.message : 'Conversion failed.');
    } finally {
      request.current = null;
      setBusy(false);
    }
  };

  return <div className="space-y-5">
    <p className="theme-card-soft rounded-xl border p-4 text-sm theme-muted">This conversion securely uploads your file for processing. Files are deleted after the download is prepared. Maximum file size: 25 MB.</p>
    {tool === 'pdf-to-powerpoint' && <p className="text-sm theme-muted">Each PDF page becomes an image on its own slide, preserving its appearance.</p>}
    {tool === 'pdf-to-excel' && <p className="text-sm theme-muted">Extracts tables and selectable text. Scanned pages need OCR first.</p>}
    <PdfDropZone inputRef={inputRef} disabled={busy} accept={accepts[tool] ?? 'application/pdf,.pdf'} title="Choose a file to convert" onSelect={selected => {
      if (!(selected instanceof File) || busy) return;
      setDone(false);
      setError('');
      setFile(null);
      if (selected.size > 25 * 1024 * 1024) return setError('Please select a file smaller than 25 MB.');
      setFile(selected);
    }} />
    {tool === 'protect' && <label className="block text-sm theme-title">PDF password<input aria-label="PDF password" type="password" minLength={8} autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} disabled={busy} className="theme-card mt-2 block w-full rounded-lg border p-3" /></label>}
    {file && <div className="space-y-3"><p className="break-all text-sm theme-title">{file.name}</p><button onClick={convert} disabled={busy} className="w-full rounded-lg bg-cyan-600 px-4 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Converting...' : tool === 'protect' ? 'Encrypt PDF' : 'Convert and Download'}</button></div>}
    {busy && <button onClick={() => request.current?.abort()} className="text-sm theme-muted">Cancel</button>}
    {done && <p role="status" className="text-sm text-emerald-700">Conversion complete. Your download is ready.</p>}
    {error && <p role="alert" className="rounded-lg bg-red-50 p-4 text-sm text-red-900">{error}</p>}
  </div>;
}
