import { readFile, readdir, access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { staticSearchConfig } from './static-search-config.mjs';

const root = path.resolve('out');
const origin = 'https://www.dhebe.com';
const sitemap = await readFile(path.join(root, 'sitemap.xml'), 'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(match => match[1]);
const errors = [];
const aliases = [];
const indexable = new Set();
const titles = new Set();
const descriptions = new Set();
const links = new Map();

async function walk(directory) {
  const files = [];
  for (const item of await readdir(directory, { withFileTypes: true })) {
    const filename = path.join(directory, item.name);
    if (item.isDirectory()) files.push(...await walk(filename));
    else files.push(filename);
  }
  return files;
}

for (const file of (await walk(root)).filter(file => file.endsWith('.html'))) {
  const html = await readFile(file, 'utf8');
  const relative = path.relative(root, file).split(path.sep).join('/');
  const pathname = relative === 'index.html' ? '/' : '/' + relative.replace(/index\.html$/, '');
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (/<meta name="robots" content="[^"]*noindex/.test(html)) {
    if (canonical && new URL(canonical).pathname !== pathname) aliases.push([pathname, new URL(canonical).pathname]);
    continue;
  }
  if (!canonical || canonical !== origin + pathname) errors.push(`${pathname}: missing or incorrect canonical`);
  else indexable.add(canonical);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  if (!title || titles.has(title)) errors.push(`${pathname}: missing or duplicate title`);
  titles.add(title);
  const description = html.match(/<meta name="description" content="([^"]+)"/)?.[1];
  if (!description || descriptions.has(description)) errors.push(`${pathname}: missing or duplicate description`);
  descriptions.add(description);
  if ([...html.matchAll(/<h1[\s>]/g)].length !== 1) errors.push(`${pathname}: expected one main heading`);
  for (const property of ['og:image', 'twitter:image']) {
    const image = html.match(new RegExp(`<meta (?:property|name)="${property}" content="([^"]+)"`))?.[1];
    if (!image) errors.push(`${pathname}: missing ${property}`);
    else if (new URL(image).origin === origin) {
      try { await access(path.join(root, new URL(image).pathname)); } catch { errors.push(`${pathname}: missing social image asset`); }
    }
  }
  for (const [, json] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) {
    try { JSON.parse(json); } catch { errors.push(`${pathname}: invalid structured data`); }
  }
  const targets = new Set();
  for (const [, href] of html.matchAll(/<a[^>]*href="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    if (href.startsWith('//') || href.startsWith('/api/')) continue;
    targets.add(origin + href);
    const target = path.join(root, decodeURIComponent(href));
    try { await access(href.endsWith('/') ? path.join(target, 'index.html') : target); }
    catch { errors.push(`${pathname}: broken internal link ${href}`); }
  }
  links.set(origin + pathname, targets);
}
if (new Set(urls).size !== urls.length) errors.push('Duplicate sitemap URLs');
for (const url of urls) if (!indexable.has(url)) errors.push(`Sitemap includes a missing, redirected, or noindex page: ${url}`);
for (const url of indexable) if (!urls.includes(url)) errors.push(`Sitemap omits ${url}`);
const reachable = new Set([origin + '/']);
const pending = [...reachable];
while (pending.length) {
  const current = pending.pop();
  for (const target of links.get(current) || []) if (indexable.has(target) && !reachable.has(target)) { reachable.add(target); pending.push(target); }
}
for (const url of indexable) if (!reachable.has(url)) errors.push(`Public page has no crawlable link path from the homepage: ${url}`);
const home = await readFile(path.join(root, 'index.html'), 'utf8');
const directory = home.match(/<section\b[^>]*\bid="tool-directory"[^>]*>[\s\S]*?<\/details>\s*<\/section>/)?.[0] || '';
const toolLinks = [...directory.matchAll(/<a\b([^>]*\bdata-tool-id="[^"]+"[^>]*)>/g)];
const toolPaths = new Set();
for (const [, attributes] of toolLinks) {
  const href = attributes.match(/\bhref="([^"]+)"/)?.[1];
  const workspace = attributes.match(/\bdata-tool-workspace="([^"]+)"/)?.[1];
  if (!href || !href.startsWith('/') || href.startsWith('//')) { errors.push('Tool directory must contain local direct URLs'); continue; }
  const url = origin + href.replace(/\/?$/, '/');
  if (toolPaths.has(url)) errors.push(`Duplicate tool directory entry: ${url}`);
  toolPaths.add(url);
  if (!indexable.has(url)) { errors.push(`Tool is not a canonical, indexable landing page: ${url}`); continue; }
  const html = await readFile(path.join(root, new URL(url).pathname, 'index.html'), 'utf8');
  if (workspace && !html.includes(`data-active-tool="${workspace}"`)) errors.push(`${url}: wrong tool rendered for a direct search visit`);
  const schemas = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map(([, json]) => JSON.parse(json));
  const applications = schemas.flatMap(schema => schema['@graph'] || [schema]).filter(schema => schema['@type'] === 'WebApplication');
  if (!applications.some(application => application.url === url)) errors.push(`${url}: missing matching tool application URL`);
}
if (!toolPaths.size) errors.push('Missing crawlable tool directory');
if (errors.length) throw new Error(errors.join('\n'));

await writeFile(path.join(root, '.htaccess'), staticSearchConfig([...indexable], aliases));
console.log(`[audit] ${indexable.size} canonical pages, ${aliases.length} permanent aliases, ${toolPaths.size} direct tool landings, no indexing or internal-link errors.`);
