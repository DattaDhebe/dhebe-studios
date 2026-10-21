import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { uploadBatch } from '../scripts/overlay-static.mjs';

test('Large static files upload in bounded TUS chunks with checked offsets', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dhebe-upload-'));
  const originalFetch = globalThis.fetch; const calls = []; let creation;
  try {
    await writeFile(path.join(root, '__next.$d$slug.__PAGE__.txt'), new Uint8Array(2 * 1024 * 1024 + 5));
    globalThis.fetch = async (url, options) => {
      calls.push({ url, method: options.method, offset: Number(options.headers['Upload-Offset']), size: options.body?.length });
      if (options.method === 'POST') {
        creation = new Response('created', { status: 201, headers: { Location: '/token/api/tus/public_html/__next.$d$slug.__PAGE__.txt' } });
        return creation;
      }
      assert.ok(creation.bodyUsed, 'The creation response must be drained before uploading.');
      return new Response(null, { status: 204, headers: { 'Upload-Offset': String(Number(options.headers['Upload-Offset']) + options.body.length) } });
    };
    const result = await uploadBatch({ root, files: [{ relative: '__next.$d$slug.__PAGE__.txt' }], url: 'https://example-files.hstgr.io/rest/token/api/tus/public_html', auth_key: 'test-only', rest_auth_key: 'test-only' });
    assert.deepEqual(result.failures, []);
    assert.deepEqual(calls.filter(call => call.method === 'PATCH').map(call => [call.offset, call.size]), [[0, 1048576], [1048576, 1048576], [2097152, 5]]);
    assert.ok(calls.filter(call => call.method === 'PATCH').every(call => call.url === 'https://example-files.hstgr.io/rest/token/api/tus/public_html/__next.$d$slug.__PAGE__.txt'));
  } finally {
    globalThis.fetch = originalFetch;
    const owned = path.resolve(root);
    assert.ok(owned.startsWith(path.join(path.resolve(tmpdir()), 'dhebe-upload-')));
    await rm(owned, { recursive: true, force: true });
  }
});

test('TUS upload locations cannot redirect credentials or change the target file', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dhebe-upload-'));
  const originalFetch = globalThis.fetch;
  try {
    await writeFile(path.join(root, 'test.js'), 'test');
    for (const location of ['https://example.com/test.js', '/rest/other.js', '/rest/test.js%2Fother']) {
      const methods = [];
      globalThis.fetch = async (_url, options) => { methods.push(options.method); return new Response('created', { status: 201, headers: { Location: location } }); };
      const result = await uploadBatch({ root, files: [{ relative: 'test.js' }], url: 'https://example-files.hstgr.io/rest', auth_key: 'test-only', rest_auth_key: 'test-only' });
      assert.deepEqual(methods, ['POST']);
      assert.match(result.failures[0].error, /Unexpected upload location/);
    }
  } finally {
    globalThis.fetch = originalFetch;
    const owned = path.resolve(root);
    assert.ok(owned.startsWith(path.join(path.resolve(tmpdir()), 'dhebe-upload-')));
    await rm(owned, { recursive: true, force: true });
  }
});

test('Deployment refuses unexpected hosts and invalid chunk sizes', async () => {
  await assert.rejects(uploadBatch({ root: '.', files: [], url: 'https://example.com/' }), /Unexpected upload host/);
  await assert.rejects(uploadBatch({ root: '.', files: [], url: 'http://example-files.hstgr.io/' }), /Unexpected upload host/);
  await assert.rejects(uploadBatch({ root: '.', files: [], url: 'https://example-files.hstgr.io/', chunkSize: 1 }), /Invalid upload chunk size/);
  await assert.rejects(uploadBatch({ root: '.', files: [], url: 'https://example-files.hstgr.io/', concurrency: 0 }), /Invalid upload concurrency/);
});
