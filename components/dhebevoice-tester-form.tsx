'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { SUPPORT_EMAIL } from '@/lib/site';
import { trackTesterSignup } from '@/lib/analytics';
import { testerApps, type TesterAppId } from '@/lib/tester-apps';
import { UiIcon } from './ui-icon';

export function AppTesterForm({ appId = 'dhebevoice' }: { appId?: TesterAppId }) {
  return <TesterSignup key={appId} appId={appId} />;
}

export const DhebeVoiceTesterForm = AppTesterForm;

function TesterSignup({ appId }: { appId: TesterAppId }) {
  const app = testerApps[appId];
  const signupUrl = `/api/${appId}-signup.php`;
  const contactUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(app.name + ' early access')}`;
  const removalUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(app.name + ' tester list removal')}`;
  const [state, setState] = useState<'idle' | 'submitting' | 'code' | 'verifying' | 'success'>('idle');
  const [message, setMessage] = useState('');
  const [pending, setPending] = useState<{ email: string; requestId: string; publicOptIn: boolean; displayName: string; publicEmail: boolean } | null>(null);
  const [publicOptIn, setPublicOptIn] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const active = useRef<AbortController | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => { setReady(true); return () => active.current?.abort(); }, []);
  useEffect(() => {
    if (!resendSeconds) return;
    const timer = setTimeout(() => setResendSeconds(value => Math.max(0, value - 1)), 1000);
    return () => clearTimeout(timer);
  }, [resendSeconds]);

  const request = async (body: object) => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    const response = await fetch(signupUrl, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body), cache: 'no-store',
      signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
    });
    const data = await response.json().catch(() => null);
    controller.signal.throwIfAborted();
    if (!response.ok) throw new Error(typeof data?.detail === 'string' ? data.detail : 'We could not save your request. Please try again.');
    return data;
  };

  const reportError = (error: unknown) => {
    if (active.current?.signal.aborted) return;
    setState(pending ? 'code' : 'idle');
    setMessage(error instanceof Error && !['TimeoutError', 'TypeError'].includes(error.name) ? error.message : 'We could not reach the signup service. Please try again or email us.');
  };

  const sendCode = async (email: string, website = '', publicOptIn = false, displayName = '', publicEmail = false) => {
    setState('submitting');
    setMessage('');
    try {
      const data = await request({ email: email.trim(), consent: true, website, public_opt_in: publicOptIn, display_name: displayName.trim(), public_email: publicEmail });
      if (data?.verification_required !== true || typeof data.request_id !== 'string' || !/^[a-f0-9]{64}$/.test(data.request_id)) {
        throw new Error('Email verification could not be confirmed. Please try again or contact support.');
      }
      setPending({ email: email.trim(), requestId: data.request_id, publicOptIn, displayName: displayName.trim(), publicEmail });
      setResendSeconds(60);
      setState('code');
    } catch (error) { reportError(error); }
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === 'submitting' || state === 'verifying') return;
    const form = event.currentTarget;
    const values = new FormData(form);
    if (values.get('consent') !== 'on') return;
    await sendCode(String(values.get('email') ?? ''), String(values.get('website') ?? ''), values.get('public_opt_in') === 'on', String(values.get('display_name') ?? ''), values.get('public_email') === 'on');
  };

  const verify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!pending || state !== 'code') return;
    const code = String(new FormData(event.currentTarget).get('code') ?? '').trim();
    setState('verifying');
    setMessage('');
    try {
      const data = await request({ action: 'verify', request_id: pending.requestId, code });
      if (data?.verified !== true || data?.request_received !== true) throw new Error('Your email verification could not be confirmed. Please try again.');
      setState('success');
      trackTesterSignup(appId);
      window.dispatchEvent(new Event(appId + '-tester-verified'));
      setPending(null);
    } catch (error) { reportError(error); }
  };

  return (
    <section id="early-access" className="tester-signup" aria-labelledby="tester-signup-title">
      <span className="tester-signup-icon"><UiIcon name="mail" width="24" height="24" /></span>
      <p className="eyebrow">VOLUNTEER TESTERS WANTED</p>
      <h2 id="tester-signup-title">Be one of the first to try {app.name}.</h2>
      <p className="tester-intro">Have an Android phone and a little curiosity? Volunteer to test the app, share your feedback, and help shape what comes next.</p>
      {state !== 'success' && <aside id="tester-delivery-warning" className="tester-delivery-warning" role="note" aria-labelledby="tester-delivery-title"><UiIcon name="mail" /><div><strong id="tester-delivery-title">Important: check Spam or Junk</strong><p>Verification emails may be filtered there. Look for &quot;Verify your {app.name} tester email&quot; and mark it as Not spam or Not junk if found. Allow a few minutes before resending; only the latest code works, and it expires after 10 minutes.</p></div></aside>}
      {state === 'success' ? <div className="tester-success" role="status"><UiIcon name="check" /><div><strong>Email verified. You're on the tester list.</strong><p>Your address is saved once, even if you sign up again. We'll email you when testing access is ready. No app invitation has been sent yet.</p></div></div> : pending ? <form onSubmit={verify} aria-label="Verify your tester email">
        <p className="tester-intro" role="status">Check {pending.email} for an 8-digit verification code. It expires in 10 minutes. Mail delivery can take a few minutes.</p>
        <label className="tester-email-label" htmlFor="tester-code">Verification code</label>
        <input className="tester-email-input" id="tester-code" name="code" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{8}" minLength={8} maxLength={8} required disabled={state !== 'code'} aria-describedby="tester-code-help tester-delivery-warning" />
        <p className="tester-privacy" id="tester-code-help">Your email is added to the confirmed list only after you verify it. Never share this code.</p>
        <button className="button-primary tester-submit" disabled={state !== 'code'} type="submit">{state === 'verifying' ? 'Verifying...' : 'Verify email and join'}<UiIcon name="arrow" width="18" height="18" /></button>
        <p className="tester-privacy">Your choice: {pending.publicOptIn ? `${pending.displayName ? pending.displayName + ' and ' : ''}${pending.publicEmail ? 'your full email' : 'your masked email'} will appear publicly after verification.` : 'stay private; nothing will appear in the public list.'}</p>
        <div className="tester-actions"><button type="button" disabled={state !== 'code' || resendSeconds > 0} onClick={() => void sendCode(pending.email, '', pending.publicOptIn, pending.displayName, pending.publicEmail)}>{resendSeconds ? `Resend code in ${resendSeconds}s` : 'Resend code'}</button><button type="button" disabled={state !== 'code'} onClick={() => { active.current?.abort(); setPending(null); setPublicOptIn(false); setMessage(''); setState('idle'); }}>Use a different email</button></div>
        {message && <p className="tester-error" role="alert">{message}</p>}
      </form> : <form onSubmit={submit} aria-label={app.name + ' early-access signup'}>
        <label className="tester-email-label" htmlFor="tester-email">Your email address</label>
        <input className="tester-email-input" id="tester-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" pattern="[^\s@]+@[^\s@]+\.[^\s@]+" maxLength={254} required disabled={!ready || state === 'submitting'} aria-describedby="tester-privacy tester-delivery-warning" />
        <div className="tester-honeypot" aria-hidden="true"><label htmlFor="tester-website">Leave this field empty</label><input id="tester-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <label className="tester-consent"><input type="checkbox" name="consent" required disabled={!ready || state === 'submitting'} aria-describedby="tester-privacy" /><span>I volunteer to test {app.name} and agree to receive emails about testing and early access.</span></label>
        <label className="tester-consent"><input type="checkbox" name="public_opt_in" checked={publicOptIn} onChange={event => setPublicOptIn(event.target.checked)} disabled={!ready || state === 'submitting'} aria-describedby="tester-public-help" /><span>Optional: include me in the public tester list after verification.</span></label>
        <p id="tester-public-help" className="tester-privacy">Leave this unchecked to stay private. The public list uses a masked email by default, such as r***@e***.com. You can change your choice by signing up and verifying again, or email us for removal.</p>
        {publicOptIn && <fieldset className="tester-public-options"><legend>Choose what to share publicly</legend><label className="tester-email-label" htmlFor="tester-display-name">Public display name (optional)</label><input className="tester-email-input" id="tester-display-name" name="display_name" autoComplete="nickname" maxLength={60} disabled={state === 'submitting'} aria-describedby="tester-name-help" /><p className="tester-privacy" id="tester-name-help">This name will be visible to everyone. Leave it blank to show only your email choice. Names are self-provided, not identity-verified.</p><label className="tester-consent"><input type="checkbox" name="public_email" disabled={state === 'submitting'} aria-describedby="tester-full-email-warning" /><span>I also choose to display my full email address publicly.</span></label><p className="tester-privacy" id="tester-full-email-warning">Anyone, including search engines and spammers, may view and copy your full address. Keep this unchecked to mask it. Removing it later cannot recall copies others have already made.</p></fieldset>}
        <button className="button-primary tester-submit" disabled={!ready || state === 'submitting'} type="submit">{state === 'submitting' ? 'Sending code...' : 'Join the tester list'}<UiIcon name="arrow" width="18" height="18" /></button>
        <p id="tester-privacy" className="tester-privacy">We'll send a one-time code to verify inbox access. Unconfirmed requests expire after 10 minutes. Confirmed emails and consent stay in our tester database for up to 180 days. Public listing, a display name, and showing a full email are separate optional choices. <a href={app.privacyPath}>Tester signup privacy details</a>. To leave, email <a href={removalUrl}>{SUPPORT_EMAIL}</a>.</p>
        {message && <p className="tester-error" role="alert">{message} <a href={contactUrl}>Contact us by email</a>.</p>}
      </form>}
      <p className="tester-footnote">An invitation request, not an immediate app download. Please use the email linked to your Google Play account.</p>
    </section>
  );
}
