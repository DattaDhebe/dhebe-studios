'use client';

import { useEffect, useRef, useState } from 'react';

type Tester = { id: string; email_label: string; email_visibility: 'full' | 'masked'; display_name: string; joined_on: string };
type List = { testers: Tester[]; total: number; page: number; page_size: number };

function validTester(row: Tester) {
  if (!row || !/^[a-f0-9]{32}$/.test(row.id) || typeof row.email_label !== 'string'
    || typeof row.display_name !== 'string' || row.display_name.length > 120
    || !/^\d{4}-\d{2}-\d{2}$/.test(row.joined_on)) return false;
  return row.email_visibility === 'full'
    ? row.email_label.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email_label)
    : row.email_visibility === 'masked' && /^[^\s@]\*{3}@[A-Za-z0-9]\*{3}\.[A-Za-z0-9-]{1,63}$/.test(row.email_label);
}

export function DhebeVoiceTesterList() {
  const [list, setList] = useState<List | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const active = useRef<AbortController | null>(null);
  const currentPage = useRef(0);

  const load = async (page = 0) => {
    active.current?.abort();
    const controller = new AbortController();
    active.current = controller;
    setBusy(true); setMessage('');
    try {
      const response = await fetch('/api/dhebevoice-testers.php?page=' + page, {
        cache: 'no-store', credentials: 'omit',
        signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15000)]),
      });
      const data = await response.json().catch(() => null);
      controller.signal.throwIfAborted();
      if (!response.ok) throw new Error('The tester list is temporarily unavailable. Please try again.');
      if (!Array.isArray(data?.testers) || !Number.isInteger(data.total) || data.total < data.testers.length
        || !Number.isInteger(data.page) || data.page < 0 || data.page_size !== 24 || data.testers.length > 24
        || !data.testers.every(validTester)) throw new Error('The tester list could not be confirmed.');
      currentPage.current = data.page;
      setList(data);
    } catch (error) {
      if (controller.signal.aborted) return;
      setList(null);
      setMessage(error instanceof Error && !['TimeoutError', 'TypeError'].includes(error.name) ? error.message : 'Unable to reach the tester list. Please try again.');
    } finally {
      if (active.current === controller) { active.current = null; setBusy(false); }
    }
  };

  useEffect(() => {
    void load();
    const refresh = () => { if (!document.hidden && !active.current) void load(currentPage.current); };
    const timer = setInterval(refresh, 60_000);
    window.addEventListener('dhebevoice-tester-verified', refresh);
    return () => { clearInterval(timer); window.removeEventListener('dhebevoice-tester-verified', refresh); active.current?.abort(); };
  }, []);

  return <section id="tester-list" className="voice-tester-list content-container" aria-labelledby="tester-list-title" aria-busy={busy}>
    <div className="section-heading"><div><p className="eyebrow">THE EARLY LISTENERS</p><h2 id="tester-list-title">Meet the volunteer testers.</h2></div></div>
    <p className="tester-intro">A small community helping DhebeVoice find its voice. Only email-verified testers who choose to appear are listed. Each person chooses a public name and whether their email is masked or shown in full.</p>
    <div className="tester-list-controls"><p role="status">{list ? list.total + ' public ' + (list.total === 1 ? 'volunteer' : 'volunteers') : busy ? 'Loading volunteers...' : 'Tester list not loaded'}</p><button type="button" disabled={busy} onClick={() => void load(currentPage.current)}>Refresh tester list</button></div>
    {list?.testers.length ? <ul className="tester-public-grid" aria-label="Opted-in verified testers">{list.testers.map(row => <li key={row.id}><span className="tester-avatar" aria-hidden="true">{Array.from(row.display_name || row.email_label)[0].toUpperCase()}</span><div>{row.display_name && <p className="tester-public-name">{row.display_name}</p>}<p>{row.email_label}</p><span className="tester-privacy">Joined <time dateTime={row.joined_on}>{row.joined_on}</time></span></div><span className="tester-badge tester-badge-verified">Email verified</span></li>)}</ul> : list && <p className="tester-empty">Be one of the first to appear here. Join, verify your email, and choose the optional public-list checkbox.</p>}
    {list && list.total > list.page_size && <div className="tester-list-controls"><button type="button" disabled={busy || list.page === 0} onClick={() => void load(list.page - 1)}>Previous page</button><span>Page {list.page + 1} of {Math.ceil(list.total / list.page_size)}</span><button type="button" disabled={busy || (list.page + 1) * list.page_size >= list.total} onClick={() => void load(list.page + 1)}>Next page</button></div>}
    {message && <p className="tester-error" role="alert">{message}</p>}
    <p className="tester-privacy">Not appearing? Your email may still need verification, or you chose to stay private. You can change your choices by signing up and verifying again. Names are self-provided, not identity-verified. Existing testers are not published automatically.</p>
  </section>;
}
