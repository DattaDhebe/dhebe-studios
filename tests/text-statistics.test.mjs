import test from 'node:test';
import assert from 'node:assert/strict';
import ts from 'typescript';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../lib/text-statistics.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { textStatistics } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('Word counter handles empty text, paragraph breaks, and timing estimates', () => {
  assert.deepEqual(textStatistics(''), { words: 0, characters: 0, charactersWithoutSpaces: 0, paragraphs: 0, readingSeconds: 0, speakingSeconds: 0 });
  const result = textStatistics('One two.\n\nThree four.');
  assert.equal(result.words, 4);
  assert.equal(result.paragraphs, 2);
  assert.equal(textStatistics('word '.repeat(225)).readingSeconds, 60);
  assert.equal(textStatistics('word '.repeat(150)).speakingSeconds, 60);
});

test('Word counter counts combined characters and supports non-Latin text', () => {
  assert.equal(textStatistics('e\u0301').characters, 1);
  assert.equal(textStatistics('\u{1f468}\u200d\u{1f469}\u200d\u{1f467}').characters, 1);
  assert.ok(textStatistics('\u4f60\u597d\u4e16\u754c').words >= 1);
  assert.equal(textStatistics(' \n\t ').paragraphs, 0);
});
