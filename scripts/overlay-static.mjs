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

export async function uploadBatch({ root, files, url, auth_key, rest_auth_key, concurrency = 5 }) {
  if (new URL(url).protocol !== 'https:' || !new URL(url).hostname.endsWith('-files.hstgr.io')) throw new Error('Unexpected upload host.');
  const headers = { 'X-Auth': auth_key, 'X-Auth-Rest': rest_auth_key, 'Tus-Resumable': '1.0.0' };
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
        const created = await fetch(destination, { method: 'POST', redirect: 'manual', headers: { ...headers, 'Upload-Length': String(content.length), 'Upload-Offset': '0' } });
        if (created.status !== 201) throw new Error('Create returned ' + created.status);
        // Hostinger's Location omits /rest; the documented PATCH uses the original URL.
        const uploaded = await fetch(destination, { method: 'PATCH', redirect: 'manual', headers: { ...headers, 'Content-Type': 'application/offset+octet-stream', 'Upload-Offset': '0' }, body: content });
        if (uploaded.status !== 204 || Number(uploaded.headers.get('upload-offset')) !== content.length) throw new Error('Upload returned ' + uploaded.status);
      } catch (error) {
        failures.push({ relative: file.relative, error: error instanceof Error ? error.message : 'Upload failed' });
      }
    }
  }));
  return { attempted: files.length, failures };
}
