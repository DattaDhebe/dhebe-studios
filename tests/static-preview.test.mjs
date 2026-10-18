import { after, before, test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { startStaticPreview } from '../scripts/serve-static.mjs';

let root;
let server;
let base;
const fixtures = { 'index.html': '<h1>Preview fixture</h1>', '404.html': '<h1>Missing page</h1>', 'asset.mjs': 'export default 1;', 'styles.css': 'body { color: black; }' };

before(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'dhebe-studios-preview-'));
  for (const [name, content] of Object.entries(fixtures)) await writeFile(path.join(root, name), content);
  server = await startStaticPreview({ root, port: 0 });
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise(resolve => server.close(resolve));
  if (root) {
    for (const name of Object.keys(fixtures)) await unlink(path.join(root, name));
    await rmdir(root);
  }
});

test('Static preview serves only the export and disables caching', async () => {
  const response = await fetch(base + '/');
  assert.equal(response.status, 200);
  assert.equal(await response.text(), fixtures['index.html']);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
});

test('Static preview serves correct module and stylesheet MIME types', async () => {
  assert.match((await fetch(base + '/asset.mjs')).headers.get('content-type'), /javascript/);
  assert.match((await fetch(base + '/styles.css')).headers.get('content-type'), /text\/css/);
});

test('Static preview supports HEAD without a response body', async () => {
  const response = await fetch(base + '/', { method: 'HEAD' });
  assert.equal(response.status, 200);
  assert.equal(await response.text(), '');
  assert.equal(Number(response.headers.get('content-length')), Buffer.byteLength(fixtures['index.html']));
});

test('Static preview refuses writes and encoded path traversal', async () => {
  const write = await fetch(base + '/', { method: 'POST' });
  assert.equal(write.status, 405);
  assert.equal(write.headers.get('allow'), 'GET, HEAD');
  assert.equal((await fetch(base + '/%2e%2e%2fpackage.json')).status, 403);
});

test('Static preview returns the exported 404 page without exposing source files', async () => {
  const response = await fetch(base + '/package.json');
  assert.equal(response.status, 404);
  assert.equal(await response.text(), fixtures['404.html']);
});

test('Static preview rejects malformed URLs and invalid configuration', async () => {
  assert.equal((await fetch(base + '/%ZZ')).status, 400);
  await assert.rejects(startStaticPreview({ root, port: NaN }), /PORT/);
  await assert.rejects(startStaticPreview({ root: path.join(root, 'missing'), port: 0 }), /npm run build/);
});
