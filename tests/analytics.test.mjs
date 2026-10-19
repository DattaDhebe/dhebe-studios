import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import ts from 'typescript';

const source = await readFile(new URL('../lib/analytics.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });

function environment({ hostname = 'www.dhebe.com', signal = false, noindex = false } = {}) {
  const scripts = [];
  const location = { hostname, pathname: '/word-counter/', search: '?email=private%40example.com', hash: '#private' };
  const document = {
    cookie: '', title: 'Word Counter', referrer: 'https://example.com/private?email=private@example.com',
    querySelector(selector) { return selector.includes('canonical') ? { href: 'https://www.dhebe.com' + location.pathname } : { content: noindex ? 'noindex' : 'index, follow' }; },
    createElement: () => ({}), head: { appendChild: script => scripts.push(script) },
  };
  const window = {};
  const context = vm.createContext({ location, document, window, navigator: { globalPrivacyControl: signal }, URL });
  vm.runInContext(outputText.replace(/^export /gm, '') + '\nglobalThis.api = { setAnalyticsEnabled, trackPageView, trackDownload, trackTesterSignup, trackToolSelection, trackToolEvent };', context);
  return { api: context.api, window, location, scripts };
}

test('Analytics stays off before opt-in, on previews, under privacy signals and on noindex pages', () => {
  const initial = environment(); initial.api.trackPageView(); assert.equal(initial.scripts.length, 0);
  for (const options of [{ hostname: 'localhost' }, { signal: true }, { noindex: true }]) {
    const state = environment(options); state.api.setAnalyticsEnabled(true); state.api.trackPageView();
    assert.equal(state.scripts.length, 0);
  }
});

test('Analytics strips query strings and referrer paths and deduplicates canonical navigation', () => {
  const state = environment(); state.api.setAnalyticsEnabled(true);
  state.api.trackPageView(); state.api.trackPageView();
  state.location.pathname = '/qr-code-generator/'; state.api.trackPageView();
  const views = state.window.dataLayer.filter(event => event[0] === 'event' && event[1] === 'page_view');
  assert.equal(views.length, 2);
  assert.equal(views[0][2].page_referrer, 'https://example.com/');
  assert.equal(views[1][2].page_referrer, 'https://www.dhebe.com/word-counter/');
  assert.doesNotMatch(JSON.stringify(state.window.dataLayer), /private|email=|#/);
  const config = state.window.dataLayer.find(event => event[0] === 'config')[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
});

test('Withdrawal stops all events and re-enabling never creates a second tag', () => {
  const state = environment(); state.api.setAnalyticsEnabled(true); state.api.trackPageView();
  state.api.trackToolSelection('image-compressor', 'image'); state.api.trackDownload('image/jpeg'); state.api.trackTesterSignup();
  state.api.setAnalyticsEnabled(false); const count = state.window.dataLayer.length;
  state.api.trackPageView(); state.api.trackDownload('image/png'); state.api.trackTesterSignup(); state.api.trackToolSelection('merge', 'pdf');
  state.api.trackToolEvent('start', 'json-formatter');
  assert.equal(state.window.dataLayer.length, count);
  assert.equal(state.window['ga-disable-G-D9BJ344ZDV'], true);
  state.api.setAnalyticsEnabled(true); state.api.trackPageView();
  assert.equal(state.scripts.length, 1);
});

test('Tool funnels and downloads include only safe IDs, formats and categorical errors', () => {
  const state = environment(); state.api.setAnalyticsEnabled(true);
  state.api.trackToolEvent('start', 'json-formatter');
  state.api.trackToolEvent('success', 'json-formatter');
  state.api.trackToolEvent('error', 'json-formatter', 'private@example.com');
  state.api.trackDownload('text/plain;charset=utf-8');
  const events = state.window.dataLayer.filter(event => event[0] === 'event');
  assert.deepEqual(Array.from(events, event => event[1]), ['tool_start', 'tool_success', 'tool_error', 'tool_download']);
  assert.equal(events[2][2].error_code, 'processing_failed');
  assert.equal(events[3][2].tool_id, 'word-counter'); assert.equal(events[3][2].file_type, 'txt');
  state.api.trackToolEvent('success', 'private@example.com'); state.api.trackToolSelection('json', 'private@example.com');
  assert.equal(state.window.dataLayer.filter(event => event[0] === 'event').length, 4);
  assert.doesNotMatch(JSON.stringify(events), /private|email|filename|\?/);
});
