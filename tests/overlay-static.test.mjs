import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { uploadBatch } from '../scripts/overlay-static.mjs';

test('Large static files upload in bounded TUS chunks with checked offsets', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'dhebe-upload-'));
  const originalFetch = globalThis.fetch; const calls = [];
  try {
    await writeFile(path.join(root, 'decoder.js'), new Uint8Array(2 * 1024 * 1024 + 5));
    globalThis.fetch = async (_url, options) => {
      calls.push({ method: options.method, offset: Number(options.headers['Upload-Offset']), size: options.body?.length });
      return new Response(null, { status: options.method === 'POST' ? 201 : 204, headers: { 'Upload-Offset': String(Number(options.headers['Upload-Offset']) + (options.body?.length || 0)) } });
    };
    const result = await uploadBatch({ root, files: [{ relative: 'decoder.js' }], url: 'https://example-files.hstgr.io/rest', auth_key: 'test-only', rest_auth_key: 'test-only' });
    assert.deepEqual(result.failures, []);
    assert.deepEqual(calls.filter(call => call.method === 'PATCH').map(call => [call.offset, call.size]), [[0, 1048576], [1048576, 1048576], [2097152, 5]]);
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
