'use client';

import { useRef, useState } from 'react';
import { downloadBlob } from '@/lib/download';

export function QrCodeTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('url');
  const [size, setSize] = useState('512');
  const [result, setResult] = useState<{ png: string; svg: string } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const version = useRef(0);
  const resetResult = () => { version.current++; setResult(null); setError(''); setBusy(false); };
  const generate = async () => {
    const current = ++version.current;
    setResult(null); setError(''); setBusy(true);
    try {
      const payload = text.trim();
      if (!payload) throw new Error('Enter a website URL or some text first.');
      if (new TextEncoder().encode(payload).length > 2000) throw new Error('Keep the encoded content below 2,000 UTF-8 bytes.');
      if (mode === 'url') {
        let url: URL;
        try { url = new URL(payload); } catch { throw new Error('Enter a full URL starting with https:// or http://.'); }
        if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Use an http or https URL without embedded login credentials.');
      }
      const qr = await import('qrcode');
      const options = { width: Number(size), margin: 4, errorCorrectionLevel: 'M' as const, color: { dark: '#000000', light: '#ffffff' } };
      const png = await qr.toDataURL(payload, options);
      const svg = await qr.toString(payload, { ...options, type: 'svg' });
      if (current === version.current) setResult({ png, svg });
    } catch (caught) {
      if (current === version.current) setError(caught instanceof Error ? caught.message : 'Could not generate this code. Try shorter text.');
    } finally { if (current === version.current) setBusy(false); }
  };
  const download = async (format: 'png' | 'svg') => {
    if (!result) return;
    if (format === 'svg') downloadBlob(new Blob([result.svg], { type: 'image/svg+xml' }), 'qr-code.svg');
    else {
      const bytes = Uint8Array.from(atob(result.png.split(',')[1]), character => character.charCodeAt(0));
      downloadBlob(new Blob([bytes], { type: 'image/png' }), 'qr-code.png');
    }
  };
  return (
    <div className="utility-workspace utility-split">
      <div><label className="utility-label" htmlFor="qr-mode">Content type</label><select id="qr-mode" value={mode} onChange={event => { resetResult(); setMode(event.target.value); }}><option value="url">Website URL</option><option value="text">Plain text</option></select>
        <label className="utility-label" htmlFor="qr-content">{mode === 'url' ? 'Website URL' : 'Text to encode'}</label><textarea id="qr-content" rows={5} maxLength={2000} value={text} onChange={event => { resetResult(); setText(event.target.value); }} placeholder={mode === 'url' ? 'https://example.com' : 'Enter text...'} />
        <label className="utility-label" htmlFor="qr-size">PNG size</label><select id="qr-size" value={size} onChange={event => { resetResult(); setSize(event.target.value); }}><option value="512">512 x 512</option><option value="1024">1024 x 1024</option><option value="2048">2048 x 2048</option></select>
        <button className="button-primary mt-6" type="button" disabled={busy} onClick={generate}>{busy ? 'Generating...' : 'Generate QR code'}</button>{error && <p role="alert" className="utility-error">{error}</p>}
        <p className="utility-note">Generated on your device. No sign-up, watermark, redirect service, or scan tracking. Static codes cannot be edited after printing. Always scan-test your downloaded code before sharing.</p>
      </div>
      <div className="qr-preview">{result ? <><img src={result.png} alt="Generated QR code" width={280} height={280} /><div className="utility-actions"><button className="utility-secondary" onClick={() => download('png')}>Download PNG</button><button className="utility-secondary" onClick={() => download('svg')}>Download SVG</button></div></> : <p>Your QR code will appear here.</p>}</div>
    </div>
  );
}
