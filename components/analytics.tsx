'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ANALYTICS_CONSENT_KEY, privacySignalEnabled, setAnalyticsEnabled, trackPageView } from '@/lib/analytics';

export function Analytics() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    const respectSignal = privacySignalEnabled();
    setBlocked(respectSignal);
    let preference: string | null = null;
    try { preference = localStorage.getItem(ANALYTICS_CONSENT_KEY); } catch { /* Default to no analytics when storage is unavailable. */ }
    setAnalyticsEnabled(!respectSignal && preference === 'granted');
    setVisible(!respectSignal && preference !== 'granted' && preference !== 'denied');
    const open = () => { setBlocked(privacySignalEnabled()); setVisible(true); };
    const sync = (event: StorageEvent) => {
      if (event.key !== ANALYTICS_CONSENT_KEY && event.key !== null) return;
      const allowed = event.newValue === 'granted';
      setAnalyticsEnabled(allowed);
      if (allowed) trackPageView();
    };
    window.addEventListener('dhebe-privacy-settings', open);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('dhebe-privacy-settings', open);
      window.removeEventListener('storage', sync);
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(trackPageView, 0);
    return () => window.clearTimeout(timer);
  }, [pathname]);

  const choose = (allowed: boolean) => {
    try { localStorage.setItem(ANALYTICS_CONSENT_KEY, allowed ? 'granted' : 'denied'); } catch { /* The choice still applies to this visit. */ }
    setAnalyticsEnabled(allowed);
    if (allowed) trackPageView();
    setVisible(false);
  };

  if (!visible) return null;
  return (
    <section className="analytics-choice" aria-label="Analytics privacy choices">
      <div><h2>A small choice, before you carry on.</h2><p>{blocked ? 'Your browser requests no tracking. Analytics stays off.' : 'May we use Google Analytics cookies to understand which tools are useful? Optional analytics stays off until you allow it. Your file contents, inputs, and email address are not sent.'} <Link href="/privacy/">Privacy details</Link></p></div>
      <div className="analytics-choice-actions"><button type="button" onClick={() => choose(false)}>{blocked ? 'Close' : 'No thanks'}</button>{!blocked && <button type="button" onClick={() => choose(true)}>Allow analytics</button>}</div>
    </section>
  );
}

export function AnalyticsPreferencesButton() {
  return <button type="button" className="privacy-settings-button" onClick={() => window.dispatchEvent(new Event('dhebe-privacy-settings'))}>Cookie preferences</button>;
}
