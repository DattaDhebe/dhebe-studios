import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../lib/utility-operations.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ES2022 } });
const { formatJson, compareText, qrPayload, invoiceTotals, pngToIco } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);

test('JSON formatting validates syntax and preserves exact number and string tokens', () => {
  const input = '{"id":123456789012345678901,"tiny":-0,"huge":1e400,"text":"a  b\\n","empty":[]}';
  const formatted = formatJson(input, '2');
  assert.ok(formatted.includes('123456789012345678901'));
  assert.ok(formatted.includes('1e400')); assert.ok(formatted.includes('"tiny": -0'));
  assert.equal(formatJson(formatted, 'minify'), input);
  assert.equal(formatJson('null', '4'), 'null');
  assert.throws(() => formatJson('{"missing":}', '2'));
  assert.throws(() => formatJson(' '.repeat(1000001), '2'));
  assert.throws(() => formatJson('['.repeat(101) + '0' + ']'.repeat(101), '2'));
});

test('Line diff reconstructs both inputs and keeps whitespace and Unicode differences', () => {
  const before = 'same\nold\n\u4e16\u754c'; const after = 'same\nnew\n\u4e16\u754c ';
  const result = compareText(before, after);
  assert.equal(result.filter(line => line.kind !== 'added').map(line => line.text).join('\n'), before);
  assert.equal(result.filter(line => line.kind !== 'removed').map(line => line.text).join('\n'), after);
  assert.deepEqual(compareText('', ''), []);
  assert.deepEqual(compareText('', 'added'), [{ kind: 'added', text: 'added' }]);
  assert.throws(() => compareText('a\n'.repeat(2000), 'b\n'.repeat(2000)), /smaller sections/);
});

const fields = { text: '', ssid: '', password: '', security: 'WPA', name: '', phone: '', email: '', upi: '', amount: '' };
test('QR URL, Wi-Fi and vCard payloads validate and escape their own data formats', () => {
  assert.throws(() => qrPayload('url', { ...fields, text: 'javascript:alert(1)' }));
  assert.throws(() => qrPayload('url', { ...fields, text: 'https://user:pass@example.com' }));
  assert.equal(qrPayload('wifi', { ...fields, ssid: 'A;B', password: 'x:y' }), 'WIFI:T:WPA;S:A\\;B;P:x\\:y;;');
  assert.equal(qrPayload('wifi', { ...fields, ssid: 'Public WiFi', security: 'nopass' }), 'WIFI:T:nopass;S:Public WiFi;P:;;');
  assert.throws(() => qrPayload('wifi', { ...fields, ssid: 'injected\nvalue', password: 'test' }));
  const card = qrPayload('contact', { ...fields, name: 'A;B\nC', email: 'hello@example.com' });
  assert.ok(card.includes('FN:A\\;B\\nC\r\n'));
  assert.throws(() => qrPayload('contact', { ...fields, name: 'Name', email: 'invalid' }));
});

test('UPI codes encode exactly the provided details without a payment or tracking service', () => {
  const payload = new URL(qrPayload('upi', { ...fields, upi: 'sample@bank', name: 'Test Shop', amount: '25.50' }));
  assert.equal(payload.protocol, 'upi:'); assert.equal(payload.hostname, 'pay');
  assert.equal(payload.searchParams.get('pn'), 'Test Shop');
  assert.equal(payload.searchParams.get('am'), '25.50'); assert.equal(payload.searchParams.get('cu'), 'INR');
  assert.throws(() => qrPayload('upi', { ...fields, upi: 'bad', name: 'Shop' }));
  assert.throws(() => qrPayload('upi', { ...fields, upi: 'test@bank', name: 'Shop', amount: '1e3' }));
});

test('Invoice arithmetic uses cent rounding and applies tax after discount', () => {
  const result = invoiceTotals([{ description: 'Service', quantity: '2', price: '100.00' }], '10', '18');
  assert.deepEqual(result, { amounts: [20000], subtotal: 20000, discount: 2000, tax: 3240, total: 21240 });
  assert.equal(invoiceTotals([{ description: 'Fractional', quantity: '0.5', price: '0.01' }], '0', '0').total, 1);
  assert.throws(() => invoiceTotals([{ description: 'Bad', quantity: '0', price: '1' }], '0', '0'));
  assert.throws(() => invoiceTotals([{ description: 'Bad', quantity: '1', price: '-1' }], '0', '0'));
  assert.throws(() => invoiceTotals([{ description: '', quantity: '1', price: '1' }], '0', '0'));
  assert.throws(() => invoiceTotals([{ description: 'Bad', quantity: '1', price: '1' }], '101', '0'));
});

test('PNG-backed ICO has the correct little-endian header and image offset', () => {
  const png = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
  const ico = pngToIco(png, 32); const view = new DataView(ico.buffer);
  assert.equal(view.getUint16(2, true), 1); assert.equal(view.getUint16(4, true), 1);
  assert.equal(ico[6], 32); assert.equal(view.getUint32(18, true), 22);
  assert.deepEqual(ico.slice(22), png);
  assert.throws(() => pngToIco(png, 37));
});
