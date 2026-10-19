'use client';

import { useRef, useState } from 'react';
import { downloadBlob } from '@/lib/download';
import { qrPayload, type QrFields, type QrMode } from '@/lib/utility-operations';
import { trackToolEvent } from '@/lib/analytics';

export function QrCodeTool() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<QrMode>('url');
  const [fields, setFields] = useState<Omit<QrFields, 'text'>>({ ssid: '', password: '', security: 'WPA', name: '', phone: '', email: '', upi: '', amount: '' });
  const [size, setSize] = useState('512');
  const [result, setResult] = useState<{ png: string; svg: string } | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const version = useRef(0);
  const resetResult = () => { version.current++; setResult(null); setError(''); setBusy(false); };
  const generate = async () => {
    const current = ++version.current;
    setResult(null); setError(''); setBusy(true);
    trackToolEvent('start', 'qr-code-generator');
    try {
      const payload = qrPayload(mode, { text, ...fields });
      const qr = await import('qrcode');
      const options = { width: Number(size), margin: 4, errorCorrectionLevel: 'M' as const, color: { dark: '#000000', light: '#ffffff' } };
      const png = await qr.toDataURL(payload, options);
      const svg = await qr.toString(payload, { ...options, type: 'svg' });
      if (current === version.current) { setResult({ png, svg }); trackToolEvent('success', 'qr-code-generator'); }
      else trackToolEvent('error', 'qr-code-generator', 'cancelled');
    } catch (caught) {
      trackToolEvent('error', 'qr-code-generator', current === version.current ? 'processing_failed' : 'cancelled');
      if (current === version.current) setError(caught instanceof Error ? caught.message : 'Could not generate this code. Try shorter text.');
    } finally { if (current === version.current) setBusy(false); }
  };
  const field = (key: keyof typeof fields, value: string) => { resetResult(); setFields(previous => ({ ...previous, [key]: value })); };
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
      <div><label className="utility-label" htmlFor="qr-mode">Content type</label><select id="qr-mode" value={mode} onChange={event => { resetResult(); setMode(event.target.value as QrMode); }}><option value="url">Website URL</option><option value="text">Plain text</option><option value="wifi">Wi-Fi network</option><option value="contact">Contact card (vCard)</option><option value="upi">UPI payment details</option></select>
        {(mode === 'url' || mode === 'text') && <><label className="utility-label" htmlFor="qr-content">{mode === 'url' ? 'Website URL' : 'Text to encode'}</label><textarea id="qr-content" rows={5} maxLength={2000} value={text} onChange={event => { resetResult(); setText(event.target.value); }} placeholder={mode === 'url' ? 'https://example.com' : 'Enter text...'} /></>}
        {mode === 'wifi' && <><label className="utility-label" htmlFor="qr-ssid">Wi-Fi network name</label><input id="qr-ssid" maxLength={32} value={fields.ssid} onChange={event => field('ssid', event.target.value)} /><label className="utility-label" htmlFor="qr-security">Wi-Fi security</label><select id="qr-security" value={fields.security} onChange={event => field('security', event.target.value)}><option value="WPA">WPA / WPA2</option><option value="WEP">WEP (legacy)</option><option value="nopass">Open network</option></select>{fields.security !== 'nopass' && <><label className="utility-label" htmlFor="qr-password">Wi-Fi password</label><input id="qr-password" type="password" autoComplete="off" maxLength={128} value={fields.password} onChange={event => field('password', event.target.value)} /></>}<p className="utility-note">A Wi-Fi QR contains the password in readable form. Share it only with people who should have network access. Enterprise Wi-Fi is not supported.</p></>}
        {(mode === 'contact' || mode === 'upi') && <><label className="utility-label" htmlFor="qr-name">{mode === 'upi' ? 'Payee name' : 'Contact name'}</label><input id="qr-name" maxLength={100} value={fields.name} onChange={event => field('name', event.target.value)} /></>}
        {mode === 'contact' && <><label className="utility-label" htmlFor="qr-phone">Contact phone (optional)</label><input id="qr-phone" type="tel" maxLength={30} value={fields.phone} onChange={event => field('phone', event.target.value)} /><label className="utility-label" htmlFor="qr-email">Contact email (optional)</label><input id="qr-email" type="email" maxLength={254} value={fields.email} onChange={event => field('email', event.target.value)} /></>}
        {mode === 'upi' && <><label className="utility-label" htmlFor="qr-upi">UPI ID</label><input id="qr-upi" maxLength={321} value={fields.upi} placeholder="name@bank" onChange={event => field('upi', event.target.value)} /><label className="utility-label" htmlFor="qr-amount">Amount in INR (optional)</label><input id="qr-amount" type="number" min="0.01" step="0.01" max="9999999.99" value={fields.amount} onChange={event => field('amount', event.target.value)} /><p className="utility-note">This encodes the details you enter. It does not verify the UPI ID, establish merchant approval, collect money, or confirm payment. Scan-test in your own payment app and verify the actual recipient before displaying or paying.</p></>}
        <label className="utility-label" htmlFor="qr-size">PNG size</label><select id="qr-size" value={size} onChange={event => { resetResult(); setSize(event.target.value); }}><option value="512">512 x 512</option><option value="1024">1024 x 1024</option><option value="2048">2048 x 2048</option></select>
        <button className="button-primary mt-6" type="button" disabled={busy} onClick={generate}>{busy ? 'Generating...' : 'Generate QR code'}</button>{error && <p role="alert" className="utility-error">{error}</p>}
        <p className="utility-note">Generated on your device. No sign-up, watermark, redirect service, or scan tracking. Static codes cannot be edited after printing. Always scan-test your downloaded code before sharing.</p>
      </div>
      <div className="qr-preview">{result ? <><img src={result.png} alt="Generated QR code" width={280} height={280} /><div className="utility-actions"><button className="utility-secondary" onClick={() => download('png')}>Download PNG</button><button className="utility-secondary" onClick={() => download('svg')}>Download SVG</button></div></> : <p>Your QR code will appear here.</p>}</div>
    </div>
  );
}
