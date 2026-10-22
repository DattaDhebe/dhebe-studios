export const ANALYTICS_ID = 'G-D9BJ344ZDV';
export const ANALYTICS_CONSENT_KEY = 'dhebe-analytics-consent-v1';

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  'ga-disable-G-D9BJ344ZDV'?: boolean;
};

let enabled = false;
let lastPage = '';

export function privacySignalEnabled() {
  return navigator.doNotTrack === '1'
    || (window as Window & { doNotTrack?: string }).doNotTrack === '1'
    || (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

function productionHost() {
  return location.hostname === 'www.dhebe.com' || location.hostname === 'dhebe.com';
}

function clearAnalyticsCookies() {
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!/^_ga(?:_|$)/.test(name)) continue;
    for (const domain of ['', location.hostname, '.dhebe.com']) {
      document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? `; Domain=${domain}` : ''}`;
    }
  }
}

export function setAnalyticsEnabled(allowed: boolean) {
  const target = window as AnalyticsWindow;
  enabled = allowed && productionHost() && !privacySignalEnabled() && publicPageLocation() !== null;
  target[`ga-disable-${ANALYTICS_ID}`] = !enabled;
  if (!enabled) {
    lastPage = '';
    clearAnalyticsCookies();
    return;
  }
  if (target.gtag) return;

  target.dataLayer = target.dataLayer || [];
  target.gtag = function () { target.dataLayer!.push(arguments); };
  target.gtag('consent', 'default', {
    analytics_storage: 'granted', ad_storage: 'denied',
    ad_user_data: 'denied', ad_personalization: 'denied',
  });
  target.gtag('js', new Date());
  target.gtag('set', { page_location: publicPageLocation(), page_referrer: safeReferrer() });
  target.gtag('config', ANALYTICS_ID, {
    send_page_view: false,
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
    cookie_flags: 'SameSite=Lax;Secure',
  });
  const script = document.createElement('script');
  script.id = 'google-analytics';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_ID}`;
  document.head.appendChild(script);
}

function safeReferrer() {
  try { return document.referrer ? new URL(document.referrer).origin + '/' : ''; }
  catch { return ''; }
}

function publicPageLocation() {
  const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href;
  const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')?.content || '';
  const pathname = location.pathname.endsWith('/') ? location.pathname : location.pathname + '/';
  const page = 'https://www.dhebe.com' + pathname;
  return canonical === page && !robots.includes('noindex') ? page : null;
}

export function trackPageView() {
  if (!enabled || privacySignalEnabled()) return;
  const pathname = location.pathname.endsWith('/') ? location.pathname : location.pathname + '/';
  const page = publicPageLocation();
  if (!page || page === lastPage) return;
  const referrer = lastPage || safeReferrer();
  lastPage = page;
  const gtag = (window as AnalyticsWindow).gtag;
  // Global defaults also protect automatic engagement events from raw URL queries.
  gtag?.('set', { page_location: page, page_referrer: referrer });
  gtag?.('event', 'page_view', { page_location: page, page_path: pathname, page_referrer: referrer, page_title: document.title });
}

export function trackToolSelection(toolId: string, studio: string) {
  if (!enabled || privacySignalEnabled() || !publicPageLocation() || !/^[a-z0-9:-]{1,64}$/.test(toolId) || !/^[a-z-]{1,24}$/.test(studio)) return;
  (window as AnalyticsWindow).gtag?.('event', 'tool_select', { tool_id: toolId, studio });
}

function currentToolId() {
  const workspace = document.querySelector<HTMLElement>('[data-active-tool]');
  const active = workspace?.dataset?.activeTool;
  return active && /^[a-z0-9:-]{1,64}$/.test(active) ? active : location.pathname.replace(/^\/+|\/+$/g, '').replace(/\//g, ':') || 'home';
}

export function trackToolEvent(stage: 'start' | 'success' | 'error', toolId?: string, reason?: 'cancelled' | 'processing_failed') {
  if (!enabled || privacySignalEnabled() || !publicPageLocation() || !['start', 'success', 'error'].includes(stage)) return;
  const id = toolId || currentToolId();
  if (!/^[a-z0-9:-]{1,64}$/.test(id)) return;
  (window as AnalyticsWindow).gtag?.('event', 'tool_' + stage, { tool_id: id, ...(stage === 'error' ? { error_code: reason === 'cancelled' ? 'cancelled' : 'processing_failed' } : {}) });
}

export function trackDownload(type: string) {
  if (!enabled || privacySignalEnabled() || !publicPageLocation()) return;
  const format = ({ 'application/pdf': 'pdf', 'application/zip': 'zip', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/svg+xml': 'svg', 'image/x-icon': 'ico', 'application/json': 'json', 'text/plain': 'txt', 'text/html': 'html' } as Record<string, string>)[type.split(';')[0]] || 'other';
  (window as AnalyticsWindow).gtag?.('event', 'tool_download', { file_type: format, tool_id: currentToolId() });
}

export function trackTesterSignup(appId = 'dhebevoice') {
  if (enabled && !privacySignalEnabled() && publicPageLocation() && ['dhebevoice', 'rivetprep', 'rostercairn'].includes(appId)) {
    (window as AnalyticsWindow).gtag?.('event', 'tester_signup', { app_id: appId });
  }
}
