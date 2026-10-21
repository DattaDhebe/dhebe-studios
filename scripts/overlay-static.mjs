import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';

export async function staticManifest(root) {
  const files = [];
  async function visit(relative = '') {
    for (const entry of await readdir(path.join(root, relative), { withFileTypes: true })) {
      const name = relative ? relative + '/' + entry.name : entry.name;
      if (entry.isDirectory()) await visit(name);
      else if (entry.isFile()) files.push({ relative: name, size: (await stat(path.join(root, name))).size });
    }
  }
  await visit();
  // Upload assets before route data, and HTML last. Existing assets are retained.
  const priority = file => file.relative.endsWith('.html') ? 2 : file.relative.endsWith('.txt') ? 1 : 0;
  return files.sort((a, b) => priority(a) - priority(b));
}

export async function uploadBatch({ root, files, url, auth_key, rest_auth_key, concurrency = 5, chunkSize = 1024 * 1024 }) {
  if (new URL(url).protocol !== 'https:' || !new URL(url).hostname.endsWith('-files.hstgr.io')) throw new Error('Unexpected upload host.');
  if (!Number.isInteger(chunkSize) || chunkSize < 65536 || chunkSize > 8 * 1024 * 1024) throw new Error('Invalid upload chunk size.');
  if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 16) throw new Error('Invalid upload concurrency.');
  const headers = { 'X-Auth': auth_key, 'X-Auth-Rest': rest_auth_key, 'Tus-Resumable': '1.0.0', Connection: 'close' };
  const samePath = (left, right) => JSON.stringify(left.split('/').map(decodeURIComponent)) === JSON.stringify(right.split('/').map(decodeURIComponent));
  let cursor = 0;
  const failures = [];
  await Promise.all(Array.from({ length: concurrency }, async () => {
    while (cursor < files.length) {
      const file = files[cursor++];
      const absolute = path.resolve(root, file.relative);
      if (!absolute.startsWith(path.resolve(root) + path.sep)) throw new Error('Invalid file path.');
      try {
        const content = await readFile(absolute);
        const destination = url.replace(/\/$/, '') + '/' + file.relative.split('/').map(encodeURIComponent).join('/') + '?override=true';
        const created = await fetch(destination, { method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(30000), headers: { ...headers, 'Upload-Length': String(content.length), 'Upload-Offset': '0' } });
        await created.arrayBuffer();
        if (created.status !== 201) throw new Error('Create returned ' + created.status);
        const expected = new URL(destination);
        const uploadUrl = new URL(created.headers.get('location') || destination, destination);
        if (uploadUrl.origin !== expected.origin) throw new Error('Unexpected upload location.');
        // Hostinger returns the TUS path without its /rest gateway prefix.
        if (expected.pathname.startsWith('/rest/') && samePath(uploadUrl.pathname, expected.pathname.slice(5))) uploadUrl.pathname = '/rest' + uploadUrl.pathname;
        if (!samePath(uploadUrl.pathname, expected.pathname)) throw new Error('Unexpected upload location.');
        uploadUrl.searchParams.delete('override');
        for (let offset = 0; offset < content.length; offset += chunkSize) {
          const chunk = content.subarray(offset, Math.min(offset + chunkSize, content.length));
          const uploaded = await fetch(uploadUrl.href, { method: 'PATCH', redirect: 'manual', signal: AbortSignal.timeout(30000), headers: { ...headers, 'Content-Type': 'application/offset+octet-stream', 'Upload-Offset': String(offset) }, body: chunk });
          await uploaded.arrayBuffer();
          if (uploaded.status !== 204 || Number(uploaded.headers.get('upload-offset')) !== offset + chunk.length) throw new Error('Upload returned ' + uploaded.status + ' or an unexpected offset');
        }
      } catch (error) {
        failures.push({ relative: file.relative, error: error instanceof Error ? error.message : 'Upload failed' });
      }
    }
  }));
  return { attempted: files.length, failures };
}
