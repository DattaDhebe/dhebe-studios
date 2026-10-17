import { cp, mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const packagePath = require.resolve('pdfjs-dist/package.json');
const { version } = JSON.parse(await readFile(packagePath, 'utf8'));
const source = path.dirname(packagePath);
const destination = path.resolve('public', 'pdfjs', version);
await mkdir(destination, { recursive: true });
// Shared hosts often serve .mjs as text/plain, which module workers reject.
await cp(path.join(source, 'legacy/build/pdf.worker.min.mjs'), path.join(destination, 'pdf.worker.min.js'));
for (const directory of ['cmaps', 'standard_fonts', 'wasm']) {
  await cp(path.join(source, directory), path.join(destination, directory), { recursive: true });
}
console.log(`PDF.js ${version}: worker, fonts, CMaps and WASM synchronized.`);
