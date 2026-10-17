'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { SUPPORT_EMAIL } from '@/lib/site';
import { UiIcon } from './ui-icon';

const signupUrl = '/api/dhebevoice-signup.php';

export function DhebeVoiceTesterForm() {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state === 'submitting') return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setState('submitting');
    setMessage('');
    try {
      const response = await fetch(signupUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: String(values.get('email') ?? '').trim(), consent: values.get('consent') === 'on', website: values.get('website') ?? '' }),
        signal: AbortSignal.timeout(15000),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(typeof data?.detail === 'string' ? data.detail : 'We could not save your request. Please try again.');
      if (data?.request_received !== true) throw new Error('Your request could not be confirmed. Please try again.');
      setState('success');
      form.reset();
    } catch (error) {
      setState('error');
      setMessage(error instanceof Error && !['TimeoutError', 'TypeError'].includes(error.name) ? error.message : 'We could not reach the signup service. Please try again or email us.');
    }
  };

  return (
    <section id="early-access" className="tester-signup" aria-labelledby="tester-signup-title">
      <span className="tester-signup-icon"><UiIcon name="mail" width="24" height="24" /></span>
      <p className="eyebrow">VOLUNTEER TESTERS WANTED</p>
      <h2 id="tester-signup-title">Be one of the first to try DhebeVoice.</h2>
      <p className="tester-intro">Have an Android phone and a little curiosity? Volunteer to test the app, share your feedback, and help shape what comes next.</p>
      {state === 'success' ? <div className="tester-success" role="status"><UiIcon name="check" /><div><strong>You're on the tester list.</strong><p>We'll email you with early-access instructions when testing access is ready. No invitation has been sent yet.</p></div></div> : <form onSubmit={submit} aria-label="DhebeVoice early-access signup">
        <label className="tester-email-label" htmlFor="tester-email">Your email address</label>
        <input className="tester-email-input" id="tester-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" maxLength={254} required disabled={!ready || state === 'submitting'} aria-describedby="tester-privacy" />
        <div className="tester-honeypot" aria-hidden="true"><label htmlFor="tester-website">Leave this field empty</label><input id="tester-website" name="website" tabIndex={-1} autoComplete="off" /></div>
        <label className="tester-consent"><input type="checkbox" name="consent" required disabled={!ready || state === 'submitting'} aria-describedby="tester-privacy" /><span>I volunteer to test DhebeVoice and agree to receive emails about testing and early access.</span></label>
        <button className="button-primary tester-submit" disabled={!ready || state === 'submitting'} type="submit">{state === 'submitting' ? 'Joining...' : 'Join the tester list'}<UiIcon name="arrow" width="18" height="18" /></button>
        <p id="tester-privacy" className="tester-privacy">This optional website signup saves your email and consent in our private tester list for up to 180 days. It is separate from using the app. <a href="/dhebevoice/privacy-policy/#website-testers">Tester signup privacy details</a>. To leave the list, email <a href={`mailto:${SUPPORT_EMAIL}?subject=DhebeVoice%20tester%20list%20removal`}>{SUPPORT_EMAIL}</a>.</p>
        {state === 'error' && <p className="tester-error" role="alert">{message} <a href={`mailto:${SUPPORT_EMAIL}?subject=DhebeVoice%20early%20access`}>Contact us by email</a>.</p>}
      </form>}
      <p className="tester-footnote">An invitation request, not an immediate app download. Please use the email linked to your Google Play account.</p>
    </section>
  );
}
