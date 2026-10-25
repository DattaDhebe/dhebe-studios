import { test, expect, type Page, type Download } from '@playwright/test';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { readFile } from 'node:fs/promises';
import { unzipSync } from 'fflate';
import jsQR from 'jsqr';

const routes = [
  ['/photo-signature-formatter/', 'Photo or signature image'], ['/image-to-text/', 'Image or screenshot'],
  ['/heic-to-jpg/', 'HEIC or HEIF photos'], ['/json-formatter/', 'JSON input'],
  ['/invoice-generator/', 'Document type'], ['/pdf-to-text/', 'PDF document'],
  ['/text-diff-checker/', 'Original text'], ['/favicon-generator/', 'Source icon or logo'],
] as const;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dhebe-analytics-consent-v1', 'denied'));
});
async function bytes(download: Download) { return readFile((await download.path())!); }
async function picture(page: Page, text = false) {
  const base64 = await page.evaluate(text => {
    const canvas = document.createElement('canvas'); canvas.width = 800; canvas.height = 300;
    const context = canvas.getContext('2d')!; context.fillStyle = '#fff'; context.fillRect(0, 0, 800, 300);
    if (text) { context.fillStyle = '#000'; context.font = '64px sans-serif'; context.fillText('HELLO WORLD 123', 35, 160); }
    else { context.fillStyle = '#225544'; context.fillRect(60, 40, 500, 180); }
    return canvas.toDataURL('image/png').split(',')[1];
  }, text);
  return { name: 'synthetic.png', mimeType: 'image/png', buffer: Buffer.from(base64, 'base64') };
}
async function pdfFixture(withText = true, pageCount = 2) {
  const pdf = await PDFDocument.create(); const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let number = 1; number <= pageCount; number++) { const page = pdf.addPage([612, 792]); if (withText) page.drawText(`EXTRACT PAGE ${number}`, { x: 60, y: 600, size: 30, font }); }
  return Buffer.from(await pdf.save());
}
async function decodedQr(page: Page) {
  const image = page.getByAltText('Generated QR code'); await expect(image).toBeVisible();
  const pixels = await image.evaluate(async node => {
    const image = node as HTMLImageElement; await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0);
    return { width: canvas.width, height: canvas.height, data: Array.from(context.getImageData(0, 0, canvas.width, canvas.height).data) };
  });
  return jsQR(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height)?.data;
}

for (const [route, label] of routes) for (const width of [390, 1280]) {
  test(`Direct search landing opens the correct usable tool: ${route} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(route); expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(route + '$'));
    await expect(page.locator('h1')).toHaveCount(1); await expect(page.getByLabel(label, { exact: true })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.dhebe.com' + route);
    const source = await response!.text(); expect(source).toContain('application/ld+json'); expect(source).toContain('WebApplication');
    expect(source).toContain('id="' + (route === '/json-formatter/' ? 'json-input' : route === '/invoice-generator/' ? 'invoice-kind' : route === '/text-diff-checker/' ? 'diff-before' : route === '/photo-signature-formatter/' ? 'photo-file' : route === '/heic-to-jpg/' ? 'heic-files' : route === '/favicon-generator/' ? 'favicon-image' : 'extract-file') + '"');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  });
}

test('Directory exposes 78 unique, crawlable tool links and finder opens exact new routes', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/');
  const directory = page.locator('#tool-directory'); await directory.locator('summary').click();
  const hrefs = await directory.getByRole('link').evaluateAll(links => links.map(link => link.getAttribute('href')));
  expect(hrefs).toHaveLength(78); expect(new Set(hrefs).size).toBe(78);
  for (const [route] of routes) expect(hrefs).toContain(route);
  await page.getByLabel('Search all tools').fill('JSON formatter');
  await page.getByRole('region', { name: 'Tool search results' }).getByRole('link').first().click();
  await expect(page).toHaveURL(/\/json-formatter\/$/, { timeout: 30000 }); await expect(page.getByLabel('JSON input')).toBeVisible();
});

test('JSON formatter preserves large numbers, rejects invalid data and clears stale output', async ({ page }) => {
  await page.goto('/json-formatter/');
  await page.getByLabel('JSON input').fill('{"id":123456789012345678901,"html":"<script>window.injected=1</script>"}');
  await page.getByRole('button', { name: 'Validate and format JSON' }).click();
  await expect(page.getByLabel('Formatted JSON')).toHaveValue(/123456789012345678901/);
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download JSON' }).click();
  expect((await bytes(await pending)).toString()).toContain('123456789012345678901');
  expect(await page.evaluate(() => (window as Window & { injected?: number }).injected)).toBeUndefined();
  await page.getByLabel('JSON input').fill('{broken');
  await expect(page.getByLabel('Formatted JSON')).toHaveValue('');
  await expect(page.getByRole('button', { name: 'Download JSON' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Validate and format JSON' }).click(); await expect(page.locator('.utility-error[role=alert]')).toBeVisible();
});

test('Diff checker displays safe added and removed text and exports a real report', async ({ page }) => {
  await page.goto('/text-diff-checker/'); await page.getByLabel('Original text').fill('same\nold');
  await page.getByLabel('Updated text').fill('same\n<script>new</script>');
  await page.getByRole('button', { name: 'Compare texts' }).click();
  await expect(page.locator('.diff-added')).toContainText('<script>new</script>'); await expect(page.locator('.diff-removed')).toContainText('old');
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download comparison' }).click();
  expect((await bytes(await pending)).toString()).toContain('+ <script>new</script>');
  await page.getByLabel('Updated text').fill('changed'); await expect(page.getByRole('region', { name: 'Text comparison result' })).toHaveCount(0);
});

test('Photo formatter meets pixel and byte limits without leaving a stale download', async ({ page }) => {
  await page.goto('/photo-signature-formatter/'); await page.getByLabel('Photo or signature image').setInputFiles(await picture(page));
  await page.getByRole('button', { name: 'Prepare JPG' }).click();
  const image = page.getByAltText('Prepared photo or signature preview'); await expect(image).toBeVisible();
  expect(await image.evaluate(async node => { const image = node as HTMLImageElement; await image.decode(); return [image.naturalWidth, image.naturalHeight]; })).toEqual([300, 100]);
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download prepared JPG' }).click();
  const output = await bytes(await pending); expect(output.length).toBeLessThanOrEqual(20000); expect([...output.slice(0, 2)]).toEqual([255, 216]);
  await page.getByLabel('Width (pixels)').fill('0'); await expect(page.getByRole('button', { name: 'Download prepared JPG' })).toHaveCount(0);
  await page.getByRole('button', { name: 'Prepare JPG' }).click(); await expect(page.locator('.utility-error[role=alert]')).toContainText('16 and 4,096');
});

test('HEIC worker converts a real upstream fixture to JPG, PNG and a valid ZIP', async ({ page }) => {
  test.setTimeout(120000); await page.goto('/heic-to-jpg/');
  await page.getByLabel('HEIC or HEIF photos').setInputFiles('tests/fixtures/rainbow.heic');
  for (const [format, extension] of [['image/jpeg', 'jpg'], ['image/png', 'png']]) {
    await page.getByLabel('Output format').selectOption(format);
    await page.getByRole('button', { name: 'Convert HEIC photos' }).click();
    await expect(page.getByRole('button', { name: `Download 1-rainbow.${extension}`, exact: true })).toBeVisible({ timeout: 95000 });
    const pending = page.waitForEvent('download'); await page.getByRole('button', { name: `Download 1-rainbow.${extension}`, exact: true }).click();
    const output = await bytes(await pending); expect(output.length).toBeGreaterThan(1000);
    const zipPending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download successful images as ZIP' }).click();
    expect(Object.keys(unzipSync(await bytes(await zipPending)))).toEqual([`1-rainbow.${extension}`]);
  }
});

test('HEIC rejects corrupt data and cancellation permits a fresh conversion', async ({ page, context }) => {
  test.setTimeout(120000); await page.goto('/heic-to-jpg/');
  await page.getByLabel('HEIC or HEIF photos').setInputFiles({ name: 'broken.heic', mimeType: 'image/heic', buffer: Buffer.from('invalid') });
  await page.getByRole('button', { name: 'Convert HEIC photos' }).click(); await expect(page.locator('.utility-error[role=alert]')).toBeVisible({ timeout: 95000 });
  await context.route('**/heic/heic-to-1.6.6.js', route => route.fulfill({ contentType: 'text/javascript', body: 'await new Promise(() => {}); export const isHeic = () => true; export const heicTo = () => {};' }));
  await page.getByLabel('HEIC or HEIF photos').setInputFiles('tests/fixtures/rainbow.heic');
  await page.getByRole('button', { name: 'Convert HEIC photos' }).click(); await page.getByRole('button', { name: 'Cancel processing' }).click();
  await expect(page.getByAltText('Converted HEIC preview')).toHaveCount(0);
  await context.unroute('**/heic/heic-to-1.6.6.js');
  await page.getByRole('button', { name: 'Convert HEIC photos' }).click();
  await expect(page.getByAltText('Converted HEIC preview')).toBeVisible({ timeout: 95000 });
});

test('Icon ZIP contains valid dimensions, an ICO header and a starter manifest', async ({ page }) => {
  await page.goto('/favicon-generator/'); await page.getByLabel('Source icon or logo').setInputFiles(await picture(page));
  await page.getByRole('button', { name: 'Generate icon package' }).click(); await expect(page.getByAltText('32 pixel favicon preview')).toBeVisible();
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download icon ZIP' }).click();
  const entries = unzipSync(await bytes(await pending)); expect(Object.keys(entries)).toHaveLength(9);
  for (const size of [16, 32, 48, 192, 512]) { const png = Buffer.from(entries[`icon-${size}.png`]); expect(png.readUInt32BE(16)).toBe(size); expect(png.readUInt32BE(20)).toBe(size); }
  const ico = Buffer.from(entries['favicon.ico']); expect(ico.readUInt16LE(2)).toBe(1); expect(ico.readUInt32LE(18)).toBe(22);
  expect(JSON.parse(Buffer.from(entries['site.webmanifest']).toString()).icons).toHaveLength(2);
});

test('Invoice totals and downloaded PDF agree and the draft is never persisted', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/invoice-generator/'); await page.getByLabel('Issue date').fill('2026-10-19');
  await page.getByLabel('Your business and address').fill('Test Studio'); await page.getByLabel('Customer and address').fill('Demo Client');
  await page.getByLabel('Item 1', { exact: true }).fill('Consulting'); await page.getByLabel('Quantity 1', { exact: true }).fill('2');
  await page.getByLabel('Unit price 1', { exact: true }).fill('100'); await page.getByLabel('Discount (%)', { exact: true }).fill('10');
  await page.getByLabel('Tax after discount (%)').fill('18'); await page.getByRole('button', { name: 'Preview document' }).click();
  await expect(page.locator('.invoice-totals')).toContainText('INR 212.40');
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download PDF', exact: true }).click();
  const output = await bytes(await pending); expect((await PDFDocument.load(output)).getPageCount()).toBeGreaterThan(0);
  await page.reload(); await expect(page.getByLabel('Your business and address')).toHaveValue('');
  await page.goto('/pdf-to-text/'); await page.getByLabel('PDF document').setInputFiles({ name: 'invoice.pdf', mimeType: 'application/pdf', buffer: output });
  await page.getByRole('button', { name: 'Extract text', exact: true }).click();
  await expect(page.getByLabel('Extracted text (editable)')).toHaveValue(/212\.40/, { timeout: 30000 });
});

test('PDF text extraction reads all pages and reports image-only documents without fake output', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/pdf-to-text/'); await page.getByLabel('PDF document').setInputFiles({ name: 'pages.pdf', mimeType: 'application/pdf', buffer: await pdfFixture() });
  await page.getByRole('button', { name: 'Extract text', exact: true }).click();
  await expect(page.getByLabel('Extracted text (editable)')).toHaveValue(/EXTRACT PAGE 2/, { timeout: 30000 });
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download text' }).click(); expect((await bytes(await pending)).toString()).toContain('EXTRACT PAGE 1');
  await page.getByLabel('PDF document').setInputFiles({ name: 'blank.pdf', mimeType: 'application/pdf', buffer: await pdfFixture(false) });
  await page.getByRole('button', { name: 'Extract text', exact: true }).click();
  await expect(page.locator('.utility-error[role=alert]')).toContainText('No selectable text', { timeout: 30000 }); await expect(page.getByRole('button', { name: 'Download text' })).toHaveCount(0);
});

test('Image OCR recognizes a synthetic screenshot and exports edited text', async ({ page }) => {
  test.setTimeout(120000); await page.goto('/image-to-text/'); await page.getByLabel('Image or screenshot').setInputFiles(await picture(page, true));
  await page.getByRole('button', { name: 'Extract text', exact: true }).click();
  const text = page.getByLabel('Extracted text (editable)'); await expect(text).toHaveValue(/HELLO WORLD 123/, { timeout: 110000 });
  await text.fill('Proofread result'); const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download text' }).click();
  expect((await bytes(await pending)).toString()).toBe('Proofread result');
});

test('Target PDF mode preserves text by default and does not claim an impossible limit', async ({ page }) => {
  test.setTimeout(90000);
  await page.goto('/compress-pdf/'); const pdf = await PDFDocument.create(); const font = await pdf.embedFont(StandardFonts.Helvetica);
  const sourcePage = pdf.addPage([612, 792]); sourcePage.drawText('PRESERVED TEXT', { x: 50, y: 600, size: 20, font });
  const field = pdf.getForm().createTextField('retained-field'); field.setText('Retained value'); field.addToPage(sourcePage, { x: 50, y: 400, width: 200, height: 30 });
  let seed = 12345; pdf.setSubject(Array.from({ length: 60000 }, () => { seed ^= seed << 13; seed ^= seed >>> 17; seed ^= seed << 5; return String.fromCharCode(32 + (seed >>> 0) % 90); }).join(''));
  await expect(page.locator('input[type=file]')).toBeEnabled({ timeout: 30000 });
  await page.locator('input[type=file]').setInputFiles({ name: 'large.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) });
  await page.getByLabel('Target PDF size (KB)').fill('10'); await page.getByRole('button', { name: 'Try target size', exact: true }).click();
  await expect(page.locator('.target-pdf-result')).toContainText('Target not reached');
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download best available PDF' }).click();
  const output = await bytes(await pending); expect(output.length).toBeGreaterThan(10000);
  expect((await PDFDocument.load(output)).getForm().getTextField('retained-field').getText()).toBe('Retained value');
  await page.getByLabel('Target compression method', { exact: true }).selectOption('flatten');
  await expect(page.getByRole('button', { name: 'Try target size', exact: true })).toBeDisabled();
  await page.goto('/pdf-to-text/'); await page.getByLabel('PDF document').setInputFiles({ name: 'preserved.pdf', mimeType: 'application/pdf', buffer: output });
  await page.getByRole('button', { name: 'Extract text', exact: true }).click(); await expect(page.getByLabel('Extracted text (editable)')).toHaveValue(/PRESERVED TEXT/, { timeout: 30000 });
});

test('Wi-Fi, contact and UPI QR modes encode exact payloads without network submissions', async ({ page }) => {
  const posts: string[] = []; page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/qr-code-generator/'); await page.getByLabel('Content type').selectOption('wifi');
  await page.getByLabel('Wi-Fi network name').fill('Test;Network'); await page.getByLabel('Wi-Fi password').fill('secret:test');
  await page.getByRole('button', { name: 'Generate QR code', exact: true }).click(); expect(await decodedQr(page)).toBe('WIFI:T:WPA;S:Test\\;Network;P:secret\\:test;;');
  await page.getByLabel('Content type').selectOption('contact'); await page.getByLabel('Contact name').fill('Demo Contact');
  await page.getByLabel('Contact email (optional)').fill('demo@example.com'); await page.getByRole('button', { name: 'Generate QR code', exact: true }).click();
  expect(await decodedQr(page)).toContain('FN:Demo Contact\r\nEMAIL:demo@example.com');
  await page.getByLabel('Content type').selectOption('upi'); await page.getByLabel('Payee name').fill('Demo Shop'); await page.getByLabel('UPI ID', { exact: true }).fill('demo@bank');
  await page.getByLabel('Amount in INR (optional)').fill('25.50'); await page.getByRole('button', { name: 'Generate QR code', exact: true }).click();
  const payload = new URL((await decodedQr(page))!); expect(payload.searchParams.get('am')).toBe('25.50'); expect(payload.searchParams.get('pa')).toBe('demo@bank');
  expect(posts).toEqual([]);
});

test('PDF-to-text OCR reads an image-only page only when explicitly enabled', async ({ page }) => {
  test.setTimeout(120000); await page.goto('/pdf-to-text/');
  const image = await picture(page, true); const pdf = await PDFDocument.create(); const embedded = await pdf.embedPng(image.buffer);
  pdf.addPage([800, 300]).drawImage(embedded, { x: 0, y: 0, width: 800, height: 300 });
  await page.getByLabel('PDF document').setInputFiles({ name: 'scan.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) });
  await page.getByRole('button', { name: 'Extract text', exact: true }).click(); await expect(page.locator('.utility-error[role=alert]')).toContainText('Enable English OCR', { timeout: 30000 });
  await page.getByLabel('Recognize scanned pages with English OCR').check(); await page.getByRole('button', { name: 'Extract text', exact: true }).click();
  await expect(page.getByLabel('Extracted text (editable)')).toHaveValue(/HELLO WORLD 123/, { timeout: 110000 });
});

test('Explicit scan flattening reaches a feasible byte target and keeps physical page size', async ({ page }) => {
  test.setTimeout(90000); await page.goto('/compress-pdf/');
  const image = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 700; canvas.height = 900; const context = canvas.getContext('2d')!;
    const pixels = context.createImageData(700, 900); let seed = 42;
    for (let index = 0; index < pixels.data.length; index += 4) { seed = (seed * 1664525 + 1013904223) >>> 0; pixels.data[index] = seed & 255; pixels.data[index + 1] = seed >>> 8 & 255; pixels.data[index + 2] = seed >>> 16 & 255; pixels.data[index + 3] = 255; }
    context.putImageData(pixels, 0, 0); return canvas.toDataURL('image/png').split(',')[1];
  });
  const pdf = await PDFDocument.create(); const embedded = await pdf.embedPng(Buffer.from(image, 'base64'));
  pdf.addPage([612, 792]).drawImage(embedded, { x: 0, y: 0, width: 612, height: 792 });
  await expect(page.locator('input[type=file]')).toBeEnabled({ timeout: 30000 });
  await page.locator('input[type=file]').setInputFiles({ name: 'scan.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) });
  await page.getByLabel('Target PDF size (KB)').fill('100'); await page.getByLabel('Target compression method', { exact: true }).selectOption('flatten');
  await page.getByRole('checkbox', { name: /I understand that flattening/ }).check(); await page.getByRole('button', { name: 'Try target size', exact: true }).click();
  await expect(page.locator('.target-pdf-result')).toContainText('Target reached.', { timeout: 80000 });
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download target PDF' }).click();
  const output = await bytes(await pending); expect(output.length).toBeLessThanOrEqual(100000);
  const result = await PDFDocument.load(output); expect(result.getPage(0).getSize()).toEqual({ width: 612, height: 792 });
});
