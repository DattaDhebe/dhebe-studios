import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const exportRoot = fileURLToPath(new URL('../out/', import.meta.url));
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.txt': 'text/plain; charset=utf-8',
  '.wasm': 'application/wasm', '.svg': 'image/svg+xml', '.png': 'image/png',
  '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.pdf': 'application/pdf',
};

export async function startStaticPreview({ root = exportRoot, port = 3000, mjsType = 'text/javascript' } = {}) {
  root = path.resolve(root);
  if (!Number.isInteger(port) || port < 0 || port > 65535) throw new Error('PORT must be an integer from 0 to 65535.');
  if (!(await stat(root).catch(() => null))?.isDirectory()) throw new Error('Static export not found. Run npm run build first.');

  const server = createServer(async (request, response) => {
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    if (!['GET', 'HEAD'].includes(request.method ?? '')) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end();
      return;
    }
    let pathname;
    let url;
    try {
      url = new URL(request.url ?? '/', 'http://localhost');
      pathname = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400).end('Invalid URL');
      return;
    }
    let file = path.resolve(root, '.' + pathname);
    if (file !== root && !file.startsWith(root + path.sep)) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    try {
      if ((await stat(file)).isDirectory()) {
        if (!url.pathname.endsWith('/')) {
          response.writeHead(308, { Location: url.pathname + '/' + url.search }).end();
          return;
        }
        file = path.join(file, 'index.html');
      }
      const content = await readFile(file);
      response.writeHead(200, {
        'Content-Type': path.extname(file) === '.mjs' ? mjsType : mimeTypes[path.extname(file)] ?? 'application/octet-stream',
        'Content-Length': content.length,
      });
      response.end(request.method === 'HEAD' ? undefined : content);
    } catch {
      const content = await readFile(path.join(root, '404.html')).catch(() => Buffer.from('Not found'));
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      response.end(request.method === 'HEAD' ? undefined : content);
    }
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return server;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  startStaticPreview({ port: Number(process.env.PORT ?? 3000) })
    .then(server => console.log(`Dhebe Studios preview: http://127.0.0.1:${server.address().port}`))
    .catch(error => { console.error(error.message); process.exitCode = 1; });
}
