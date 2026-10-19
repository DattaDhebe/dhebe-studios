export function formatJson(input: string, indent: '2' | '4' | 'tab' | 'minify') {
  if (!input.trim()) throw new Error('Enter JSON to format.');
  if (input.length > 1_000_000) throw new Error('Keep JSON below 1 million characters.');
  JSON.parse(input);
  const tokens = input.match(/"(?:\\[\s\S]|[^"\\])*"|true|false|null|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?|[{}\[\]:,]/g) || [];
  if (indent === 'minify') return tokens.join('');
  const unit = indent === 'tab' ? '\t' : indent === '4' ? '    ' : '  ';
  const output: string[] = []; let depth = 0; let length = 0;
  const push = (text: string) => { length += text.length; if (length > 5_000_000) throw new Error('Formatted output exceeds 5 million characters. Use minified output.'); output.push(text); };
  // Format validated tokens, not parsed numeric values, so large integers stay exact.
  tokens.forEach((token, index) => {
    if (token === '{' || token === '[') {
      if (++depth > 100) throw new Error('JSON nesting exceeds 100 levels.');
      push(token);
      if (tokens[index + 1] !== (token === '{' ? '}' : ']')) push('\n' + unit.repeat(depth));
    } else if (token === '}' || token === ']') {
      depth--;
      if (tokens[index - 1] !== (token === '}' ? '{' : '[')) push('\n' + unit.repeat(depth));
      push(token);
    } else if (token === ',') push(',\n' + unit.repeat(depth));
    else push(token === ':' ? ': ' : token);
  });
  return output.join('');
}

export interface DiffLine { kind: 'same' | 'removed' | 'added'; text: string }
export function compareText(before: string, after: string): DiffLine[] {
  if (before.length > 100_000 || after.length > 100_000) throw new Error('Keep each text below 100,000 characters.');
  const a = before ? before.replace(/\r\n?/g, '\n').split('\n') : [];
  const b = after ? after.replace(/\r\n?/g, '\n').split('\n') : [];
  if (a.length * b.length > 2_000_000 || a.length > 3000 || b.length > 3000) throw new Error('Compare smaller sections: at most 3,000 lines and 2 million line pairs.');
  const columns = b.length + 1;
  const lengths = new Uint16Array((a.length + 1) * columns);
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) {
    lengths[i * columns + j] = a[i] === b[j] ? 1 + lengths[(i + 1) * columns + j + 1] : Math.max(lengths[(i + 1) * columns + j], lengths[i * columns + j + 1]);
  }
  const result: DiffLine[] = [];
  let i = 0; let j = 0;
  while (i < a.length || j < b.length) {
    if (i < a.length && j < b.length && a[i] === b[j]) { result.push({ kind: 'same', text: a[i++] }); j++; }
    else if (j >= b.length || (i < a.length && lengths[(i + 1) * columns + j] >= lengths[i * columns + j + 1])) result.push({ kind: 'removed', text: a[i++] });
    else result.push({ kind: 'added', text: b[j++] });
  }
  return result;
}

export type QrMode = 'url' | 'text' | 'wifi' | 'contact' | 'upi';
export interface QrFields { text: string; ssid: string; password: string; security: string; name: string; phone: string; email: string; upi: string; amount: string }
const wifiEscape = (text: string) => text.replace(/([\\;,:"])/g, '\\$1');
const cardEscape = (text: string) => text.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/([;,])/g, '\\$1');
export function qrPayload(mode: QrMode, fields: QrFields) {
  let payload: string;
  if (mode === 'wifi') {
    if (!fields.ssid.trim() || fields.ssid.length > 32) throw new Error('Enter a Wi-Fi network name up to 32 characters.');
    if (/[\r\n\0]/.test(fields.ssid + fields.password)) throw new Error('Wi-Fi details cannot contain line breaks or null characters.');
    if (!['WPA', 'WEP', 'nopass'].includes(fields.security)) throw new Error('Choose a supported Wi-Fi security type.');
    if (fields.security !== 'nopass' && !fields.password) throw new Error('Enter the Wi-Fi password.');
    payload = `WIFI:T:${fields.security};S:${wifiEscape(fields.ssid)};P:${fields.security === 'nopass' ? '' : wifiEscape(fields.password)};;`;
  } else if (mode === 'contact') {
    if (!fields.name.trim()) throw new Error('Enter a contact name.');
    if (fields.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) throw new Error('Enter a valid contact email.');
    if (fields.phone && !/^[+\d ()-]{3,30}$/.test(fields.phone)) throw new Error('Enter a valid contact phone number.');
    payload = ['BEGIN:VCARD', 'VERSION:3.0', `FN:${cardEscape(fields.name.trim())}`, fields.phone && `TEL:${fields.phone}`, fields.email && `EMAIL:${fields.email}`, 'END:VCARD'].filter(Boolean).join('\r\n');
  } else if (mode === 'upi') {
    if (!/^[a-z\d._-]{2,256}@[a-z\d.-]{2,64}$/i.test(fields.upi.trim()) || !fields.name.trim()) throw new Error('Enter a UPI ID and payee name.');
    if (fields.amount && (!/^\d{1,7}(\.\d{1,2})?$/.test(fields.amount) || Number(fields.amount) <= 0)) throw new Error('Use a positive amount with at most two decimal places.');
    const params = new URLSearchParams({ pa: fields.upi.trim(), pn: fields.name.trim(), cu: 'INR' });
    if (fields.amount) params.set('am', Number(fields.amount).toFixed(2));
    payload = 'upi://pay?' + params.toString();
  } else {
    payload = fields.text.trim();
    if (!payload) throw new Error('Enter a website URL or some text first.');
    if (mode === 'url') {
      let url: URL;
      try { url = new URL(payload); } catch { throw new Error('Enter a full URL starting with https:// or http://.'); }
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Use an http or https URL without embedded login credentials.');
    }
  }
  if (new TextEncoder().encode(payload).length > 2000) throw new Error('Keep the encoded content below 2,000 UTF-8 bytes.');
  return payload;
}

export interface InvoiceLine { description: string; quantity: string; price: string }
function decimal(value: string, label: string, maximum: number) {
  if (!/^\d{1,9}(\.\d{1,2})?$/.test(value) || Number(value) > maximum) throw new Error(`${label} must be a non-negative number with at most two decimal places.`);
  const [whole, fraction = ''] = value.split('.');
  return Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
}
export function invoiceTotals(lines: InvoiceLine[], discount: string, tax: string) {
  if (!lines.length || lines.length > 30) throw new Error('Add between 1 and 30 invoice items.');
  const amounts = lines.map(line => {
    if (!line.description.trim()) throw new Error('Describe each invoice item.');
    const quantity = decimal(line.quantity, 'Quantity', 10000);
    if (quantity === 0) throw new Error('Quantity must be greater than zero.');
    return Number((BigInt(quantity) * BigInt(decimal(line.price, 'Unit price', 1_000_000)) + 50n) / 100n);
  });
  const subtotal = amounts.reduce((sum, amount) => sum + amount, 0);
  const discountAmount = Number((BigInt(subtotal) * BigInt(decimal(discount, 'Discount', 100)) + 5000n) / 10000n);
  const taxAmount = Number((BigInt(subtotal - discountAmount) * BigInt(decimal(tax, 'Tax', 100)) + 5000n) / 10000n);
  return { amounts, subtotal, discount: discountAmount, tax: taxAmount, total: subtotal - discountAmount + taxAmount };
}

export function pngToIco(png: Uint8Array, size: number) {
  if (![16, 32, 48, 64, 128, 256].includes(size)) throw new Error('Unsupported ICO size.');
  const bytes = new Uint8Array(22 + png.length);
  const view = new DataView(bytes.buffer);
  view.setUint16(2, 1, true); view.setUint16(4, 1, true);
  bytes[6] = bytes[7] = size === 256 ? 0 : size;
  view.setUint16(10, 1, true); view.setUint16(12, 32, true);
  view.setUint32(14, png.length, true); view.setUint32(18, 22, true);
  bytes.set(png, 22);
  return bytes;
}
