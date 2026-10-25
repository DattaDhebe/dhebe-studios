import test from 'node:test';
import assert from 'node:assert/strict';
import { staticRedirects, staticSearchConfig } from '../scripts/static-search-config.mjs';

const urls = ['https://www.dhebe.com/', 'https://www.dhebe.com/compress-pdf/', 'https://www.dhebe.com/apps/rivetprep/'];
const aliases = [['/pdf-tools/compress-pdf/', '/compress-pdf/']];

function target(path, { host = 'www.dhebe.com', explicitIndex = true } = {}) {
  for (const rule of staticRedirects(urls, aliases)) {
    if (!(rule.bareHost ? /^dhebe\.com$/i : /^(?:www\.)?dhebe\.com$/i).test(host) || (rule.explicitIndex && !explicitIndex)) continue;
    const match = new RegExp(rule.pattern).exec(path.slice(1));
    if (match) return rule.target.replace('$1', match[1] || '').replace('%{REQUEST_URI}', path);
  }
  return null;
}

test('Known index.html copies and legacy URLs redirect directly to the clean canonical URL', () => {
  for (const path of ['/index.html', '/compress-pdf/index.html', '/pdf-tools/compress-pdf/index.html', '/pdf-tools/compress-pdf/', '/compress-pdf']) {
    assert.equal(target(path), 'https://www.dhebe.com' + (path === '/index.html' ? '/' : '/compress-pdf/'));
  }
  assert.equal(target('/compress-pdf/'), null);
  assert.equal(target('/compress-pdf/', { host: 'dhebe.com' }), 'https://www.dhebe.com/compress-pdf/');
  assert.equal(target('/compress-pdf/index.html', { explicitIndex: false }), null);
});

test('Redirects never capture private endpoints, assets, unknown pages or separate app hosts', () => {
  for (const path of ['/api/index.html', '/trade/index.html', '/shaadi/index.html', '/rivetprep/index.html', '/rostercairn/index.html', '/_next/static/code.js', '/unknown/index.html']) assert.equal(target(path), null);
  for (const host of ['shaadi.dhebe.com', 'rivetprep.dhebe.com', 'rostercairn.dhebe.com', 'trade.dhebe.com', 'dhebe.com.evil.test']) assert.equal(target('/index.html', { host }), null);
  assert.equal(target('/apps/rivetprep/index.html'), 'https://www.dhebe.com/apps/rivetprep/');
});

test('Generated server rules are host-guarded, avoid DirectoryIndex loops, and noindex internal data', () => {
  const config = staticSearchConfig(urls, aliases);
  assert.equal((config.match(/^RewriteCond %\{HTTP_HOST\}/gm) || []).length, (config.match(/^RewriteRule /gm) || []).length);
  assert.match(config, /THE_REQUEST/); assert.match(config, /api\|heic\|third-party/);
  assert.match(config, /Header set X-Robots-Tag "noindex"/);
  assert.match(config, /max-age=31536000, immutable/);
});

test('Redirect generation refuses unrelated origins and privately managed app paths', () => {
  for (const invalid of ['https://shaadi.dhebe.com/', 'https://www.dhebe.com/api/', 'https://www.dhebe.com/shaadi/', 'https://www.dhebe.com/compress-pdf/?email=private', 'https://www.dhebe.com/../api/']) assert.throws(() => staticRedirects([...urls, invalid], []));
});
