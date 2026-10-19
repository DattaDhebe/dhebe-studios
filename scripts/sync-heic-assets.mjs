import { cp, mkdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const source = require.resolve('heic-to/next');
const packageRoot = path.resolve(path.dirname(source), '../..');
const { version } = JSON.parse(await readFile(path.join(packageRoot, 'package.json'), 'utf8'));
if (version !== '1.6.6') throw new Error('Review the HEIC worker source and license notice when changing decoder versions.');
const destination = path.resolve('public/heic');
await mkdir(destination, { recursive: true });
// Keep the replaceable LGPL decoder separate from the application bundles.
await cp(source, path.join(destination, `heic-to-${version}.js`));
await cp(path.join(packageRoot, 'LICENSE'), path.join(destination, 'LICENSE.txt'));
await cp(path.join(packageRoot, 'README.md'), path.join(destination, 'README.txt'));
console.log(`HEIC decoder ${version}: unmodified browser module and license synchronized.`);
