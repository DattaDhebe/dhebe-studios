import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../lib/pdf-image-export.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { PDF_IMAGE_LIMITS: limits, pdfImageScale, pdfImageBasename } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('PDF raster sizes respect requested DPI, edge and area limits', () => {
  for (const [width, height] of [[612, 792], [100000, 10], [10000, 10000], [10, 100000], [1, 1]]) {
    for (const dpi of [72, 144, 200, 300]) {
      const scale = pdfImageScale(width, height, dpi);
      const w = Math.max(1, Math.floor(width * scale)), h = Math.max(1, Math.floor(height * scale));
      assert.ok(w <= limits.edge && h <= limits.edge);
      assert.ok(w * h <= limits.pixels);
      assert.ok(scale <= dpi / 72);
    }
  }
  assert.equal(pdfImageScale(612, 792, 144), 2);
});

test('Invalid raster dimensions and resolutions are rejected', () => {
  for (const invalid of [0, -1, NaN, Infinity]) {
    assert.throws(() => pdfImageScale(invalid, 792, 144));
    assert.throws(() => pdfImageScale(612, invalid, 144));
    assert.throws(() => pdfImageScale(612, 792, invalid));
  }
});

test('PDF image filenames cannot create archive paths or hidden dotfiles', () => {
  for (const input of ['../../secret.pdf', '..\\..\\secret.pdf', '\0file.pdf', '.pdf', 'a'.repeat(300) + '.PDF']) {
    const output = pdfImageBasename(input);
    assert.ok(output.length > 0 && output.length <= 100);
    assert.doesNotMatch(output, /^[.]|[\\/\x00-\x1f]/);
  }
  assert.equal(pdfImageBasename('My document.PDF'), 'My document');
});
