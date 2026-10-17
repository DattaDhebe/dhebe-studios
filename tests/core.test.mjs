import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

async function sourceModule(path) {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
}
const base64 = await sourceModule('lib/base64.ts');
const calculations = await sourceModule('lib/calculators.ts');
const { parsePageSelection } = await sourceModule('lib/pdf-page-selection.ts');

test('Unicode and binary Base64 round trips', () => {
  for (const text of ['Hello', 'Hindi: नमस्ते; 日本語; 😀', 'a'.repeat(300_000)]) {
    assert.equal(base64.base64ToText(base64.textToBase64(text)), text);
  }
  const bytes = Uint8Array.from({ length: 256 }, (_, i) => i);
  assert.deepEqual(base64.base64ToBytes(base64.bytesToBase64(bytes)), bytes);
});
test('ASCII payloads larger than the function argument limit decode', () => {
  assert.equal(base64.base64ToAscii(base64.textToBase64('a'.repeat(300_000))), 'a'.repeat(300_000));
  assert.throws(() => base64.base64ToAscii(base64.textToBase64('é')));
});
test('Base64 accepts whitespace, data URLs, URL-safe characters and omitted padding', () => {
  assert.equal(base64.base64ToText('data:text/plain;charset=utf-8;base64, SGVs\nbG8='), 'Hello');
  assert.equal(base64.base64ToText('SGVsbG8'), 'Hello');
  assert.deepEqual(base64.base64ToBytes('-_8='), new Uint8Array([251, 255]));
});
test('Base64 rejects misplaced, excessive, and incomplete padding', () => {
  for (const input of ['A', 'ab=c', 'SGVsbG8===', 'AA=', 'AAA==', '=', '!!!']) assert.throws(() => base64.base64ToBytes(input), input);
});
test('Hex conversion validates digits and byte boundaries', () => {
  assert.equal(base64.hexToBase64('0x48 65 6c 6c 6f'), 'SGVsbG8=');
  for (const input of ['0', 'zz', 'aab']) assert.throws(() => base64.hexToBase64(input));
});
test('Page selection validates the entire input and deduplicates ranges', () => {
  assert.deepEqual(parsePageSelection('1, 3-5, 4', 6), [1, 3, 4, 5]);
  for (const value of ['', ',', '1,', '1,,2', '1x', '1.5', '1-2-3', '2-1', '0', '7']) assert.throws(() => parsePageSelection(value, 6), value);
  assert.throws(() => parsePageSelection('1', 0));
});
test('Calendar duration respects leap days and month boundaries', () => {
  const month = calculations.calculateAge('2024-01-31', '2024-02-29');
  assert.equal(month.months, 1);
  assert.equal(month.days, 0);
  assert.equal(month.totalDays, 29);
  assert.equal(calculations.calculateAge('2023-01-01', '2024-01-01').years, 1);
  assert.equal(calculations.calculateAge('2024-02-30', '2024-03-01'), null);
  assert.equal(calculations.calculateAge('2025-01-01', '2024-01-01'), null);
});
test('EMI handles zero interest and avoids overflow at long tenures', () => {
  assert.equal(calculations.calculateEmi(1200, 0, 12).emi, 100);
  assert.ok(Math.abs(calculations.calculateEmi(100000, 12, 12).emi - 8884.8789) < 0.001);
  assert.ok(Number.isFinite(calculations.calculateEmi(1e6, 100, 120000).emi));
  for (const bad of [NaN, Infinity]) assert.equal(calculations.calculateEmi(bad, 12, 12), null);
  assert.equal(calculations.calculateEmi(1000, 12, 1.5), null);
});
test('SIP, GST, BMI and percentage helpers reject invalid numeric inputs', () => {
  assert.equal(calculations.calculateSip(100, 0, 12).maturityValue, 1200);
  assert.equal(calculations.calculateSip(100, 1e6, 1200), null);
  assert.equal(calculations.calculateGstFromBase(100, 18).grossAmount, 118);
  assert.ok(Math.abs(calculations.calculateGstFromGross(118, 18).baseAmount - 100) < 1e-9);
  assert.equal(calculations.calculateBmiMetric(70, 175).category, 'Healthy weight');
  assert.equal(calculations.calculateWhatPercent(1, 0), null);
  for (const bad of [NaN, Infinity]) {
    assert.equal(calculations.calculateSip(100, bad, 12), null);
    assert.equal(calculations.calculateGstFromBase(bad, 18), null);
    assert.equal(calculations.calculateBmiMetric(bad, 175), null);
  }
});
