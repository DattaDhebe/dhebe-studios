import { test, expect, type Page, type Download } from '@playwright/test';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { unzipSync } from 'fflate';

async function pdfFixture(pages = 2) {
  const pdf = await PDFDocument.create();
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  for (let number = 1; number <= pages; number++) {
    const page = pdf.addPage([612, 792]);
    page.drawText('Page ' + number + ' <script>test</script>', { x: 60, y: 700, font, size: 18 });
    page.drawRectangle({ x: 100, y: 150, width: 200, height: 200, color: rgb(0.1, 0.6, 0.7) });
  }
  return Buffer.from(await pdf.save());
}
async function fileBytes(download: Download) {
  const stream = await download.createReadStream();
  if (!stream) throw new Error('Download stream is unavailable');
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  return Buffer.concat(chunks);
}
async function uploadPdf(page: Page, pages = 2) {
  await expect(page.locator('input[type=file]')).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles({ name: 'sample.pdf', mimeType: 'application/pdf', buffer: await pdfFixture(pages) });
}
async function imageFixture(page: Page, width = 120, height = 80, type = 'image/png') {
  const data = await page.evaluate(({ width, height, type }) => {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#bb3333'; ctx.fillRect(20, 20, 40, 40);
    return canvas.toDataURL(type).split(',')[1];
  }, { width, height, type });
  return { name: type === 'image/jpeg' ? 'sample.jpg' : 'sample.png', mimeType: type, buffer: Buffer.from(data, 'base64') };
}

test('PDF worker renders pages and multi-page JPG export is a valid ZIP', async ({ page }) => {
  await page.goto('/pdf-to-jpg/');
  await uploadPdf(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Convert PDF to JPG', exact: true }).click();
  const result = await pending;
  expect(result.suggestedFilename()).toMatch(/\.zip$/);
  const images = unzipSync(await fileBytes(result));
  expect(Object.keys(images)).toHaveLength(2);
  expect([...Object.values(images)[0].slice(0, 2)]).toEqual([255, 216]);
});
test('Compression preserves an already-small original without enlarging its pages', async ({ page }) => {
  await page.goto('/compress-pdf/');
  await uploadPdf(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Balanced', exact: true }).click();
  const result = await PDFDocument.load(await fileBytes(await pending));
  expect(result.getPageCount()).toBe(2);
  expect(result.getPage(0).getSize()).toEqual({ width: 612, height: 792 });
  await expect(page.getByRole('status')).toContainText('original was kept');
});
test('PDF editing renders the selected page and exports text at the clicked coordinates', async ({ page }) => {
  await page.goto('/pdf-tools/edit-pdf/');
  await uploadPdf(page);
  const canvas = page.locator('canvas');
  await expect(canvas).toHaveAttribute('width', /[1-9]\d+/);
  await page.getByLabel('Editor page').fill('2');
  await expect(page.getByRole('status')).toHaveCount(0);
  await page.getByLabel('Text to add').fill('Added text');
  await canvas.click({ position: { x: 120, y: 120 } });
  await expect(page.getByRole('status')).toHaveCount(0);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download Edited PDF' }).click();
  const pdf = await PDFDocument.load(await fileBytes(await pending));
  expect(pdf.getPageCount()).toBe(2);
});

for (const tool of [
  { path: '/split-pdf/', button: 'Extract Pages', pages: 2 },
  { path: '/pdf-tools/extract-pdf-pages/', button: 'Extract Pages', pages: 1 },
  { path: '/pdf-tools/remove-pdf-pages/', button: 'Remove Pages', pages: 1 },
  { path: '/pdf-tools/rotate-pdf/', button: 'Rotate PDF', pages: 2 },
  { path: '/pdf-tools/add-page-numbers/', button: 'Add Page Numbers', pages: 2 },
  { path: '/pdf-tools/organize-pdf/', button: 'Save Organized PDF', pages: 2 },
  { path: '/pdf-tools/crop-pdf/', button: 'Crop PDF', pages: 2 },
  { path: '/pdf-tools/add-watermark/', button: 'Add Watermark', pages: 2 },
]) test(tool.button + ' exports a readable PDF at ' + tool.path, async ({ page }) => {
  await page.goto(tool.path);
  await uploadPdf(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: tool.button, exact: true }).click();
  const pdf = await PDFDocument.load(await fileBytes(await pending));
  expect(pdf.getPageCount()).toBe(tool.pages);
  if (tool.button === 'Rotate PDF') expect(pdf.getPage(0).getRotation().angle).toBe(90);
  if (tool.button === 'Crop PDF') expect(pdf.getPage(0).getCropBox().width).toBeCloseTo(550.8);
});
test('Merge remains correct after deleting and adding files', async ({ page }) => {
  await page.goto('/merge-pdf/');
  const buffer = await pdfFixture(1);
  const input = page.locator('input[type=file]');
  await input.setInputFiles([{ name: 'one.pdf', mimeType: 'application/pdf', buffer }, { name: 'two.pdf', mimeType: 'application/pdf', buffer }]);
  await page.getByRole('button', { name: 'Remove', exact: true }).first().click();
  await input.setInputFiles({ name: 'three.pdf', mimeType: 'application/pdf', buffer });
  await page.getByRole('button', { name: 'Remove', exact: true }).last().click();
  await expect(page.getByText('two.pdf', { exact: true })).toBeVisible();
  await input.setInputFiles({ name: 'four.pdf', mimeType: 'application/pdf', buffer });
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Merge PDFs', exact: true }).click();
  expect((await PDFDocument.load(await fileBytes(await pending))).getPageCount()).toBe(2);
});
test('Native Word conversion uses the approved server and downloads DOCX', async ({ page }) => {
  await page.route('https://tools.dhebe.com/api/tools/jobs/pdf-to-word', route => route.fulfill({ status: 200, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Expose-Headers': 'Content-Disposition', 'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'Content-Disposition': 'attachment; filename="result.docx"' }, body: Buffer.from('PK-test-response') }));
  await page.goto('/pdf-to-word/');
  await uploadPdf(page);
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Convert and Download' }).click();
  const result = await pending;
  expect(result.suggestedFilename()).toMatch(/\.docx$/);
});
test('Server failures are shown without a fake download', async ({ page }) => {
  await page.route('https://tools.dhebe.com/api/tools/jobs/pdf-to-powerpoint', route => route.fulfill({ status: 503, headers: { 'Access-Control-Allow-Origin': '*' }, contentType: 'application/json', body: JSON.stringify({ detail: 'Conversion service busy' }) }));
  await page.goto('/pdf-tools/pdf-to-powerpoint/');
  await uploadPdf(page);
  await page.getByRole('button', { name: 'Convert and Download' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Conversion service busy' })).toBeVisible();
});
test('Invalid page ranges cannot silently select a different page', async ({ page }) => {
  await page.goto('/pdf-tools/extract-pdf-pages/');
  await uploadPdf(page);
  await page.getByPlaceholder('Example: 1,3-5').fill('1-2-3');
  await expect(page.getByRole('button', { name: 'Extract Pages', exact: true })).toBeDisabled();
});

for (const [slug, label, extension] of [['jpg-to-png', 'PNG', 'png'], ['png-to-jpg', 'JPG', 'jpg'], ['webp-converter', 'WebP', 'webp']]) test('Image conversion: ' + slug, async ({ page }) => {
  await page.goto('/image-tools/' + slug + '/');
  await page.locator('input[type=file]').setInputFiles(await imageFixture(page));
  await page.getByRole('button', { name: 'Convert to ' + label, exact: true }).click();
  await page.getByRole('button', { name: 'Download ' + label, exact: true }).waitFor();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download ' + label, exact: true }).click();
  const result = await pending;
  expect(result.suggestedFilename()).toMatch(new RegExp('\\.' + extension + '$'));
  if (slug === 'png-to-jpg') {
    const data = (await fileBytes(result)).toString('base64');
    const pixel = await page.evaluate(async data => {
      const image = new Image(); image.src = 'data:image/jpeg;base64,' + data; await image.decode();
      const canvas = document.createElement('canvas'); canvas.width = canvas.height = 1;
      const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0);
      return [...context.getImageData(0, 0, 1, 1).data];
    }, data);
    expect(pixel[0]).toBeGreaterThan(240);
    expect(pixel[1]).toBeGreaterThan(240);
  }
});
test('Image compression never offers a larger result', async ({ page }) => {
  await page.goto('/image-tools/image-compressor/');
  const file = await imageFixture(page);
  await page.locator('input[type=file]').setInputFiles(file);
  await page.getByRole('button', { name: 'Compress Images', exact: true }).click();
  const download = page.getByRole('button', { name: 'Download', exact: true });
  await download.waitFor();
  const pending = page.waitForEvent('download'); await download.click();
  expect((await fileBytes(await pending)).length).toBeLessThanOrEqual(file.buffer.length);
});
test('Image crop export stays inside valid bounds', async ({ page }) => {
  await page.goto('/image-tools/image-cropper/');
  await page.locator('input[type=file]').setInputFiles(await imageFixture(page));
  await expect(page.locator('input[type=range]').first()).toHaveAttribute('max', '20');
  await page.getByRole('button', { name: 'Apply Crop', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Download Cropped', exact: true })).toBeVisible();
});
test('Image resizing handles mixed source aspect ratios', async ({ page }) => {
  await page.goto('/image-tools/image-resizer/');
  await page.locator('input[type=file]').setInputFiles([await imageFixture(page, 120, 80), { ...await imageFixture(page, 80, 120), name: 'portrait.png' }]);
  await page.locator('input[type=number]').first().fill('60');
  await page.getByRole('button', { name: 'Apply Resizing', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Download Resized', exact: true })).toHaveCount(2);
});
test('Base64 text roundtrip supports Unicode', async ({ page }) => {
  await page.goto('/tools/text-to-base64/');
  await page.locator('textarea').first().fill('नमस्ते 😀');
  await page.getByRole('button', { name: 'Convert to Base64', exact: true }).click();
  await expect(page.locator('textarea').last()).toHaveValue(Buffer.from('नमस्ते 😀').toString('base64'));
});
test('Date duration uses calendar months', async ({ page }) => {
  await page.goto('/date-difference-calculator/');
  await page.locator('input[type=date]').first().fill('2024-01-31');
  await page.locator('input[type=date]').last().fill('2024-02-29');
  await expect(page.getByText('29 days', { exact: true })).toBeVisible();
});
test('Email HTML preview is sandboxed', async ({ page }) => {
  await page.goto('/email-template-editor/');
  await page.getByRole('button', { name: 'Preview', exact: true }).click();
  await expect(page.locator('iframe[title="Email template preview"]')).toHaveAttribute('sandbox', '');
});

test('Email design survives refresh and undo restores one change', async ({ page }) => {
  await page.goto('/email-template-editor/');
  const heading = page.getByRole('textbox', { name: 'Heading', exact: true });
  await heading.fill('Saved regression heading');
  await expect(page.getByText('Saved on this device', { exact: true })).toBeVisible();
  await page.reload();
  await expect(heading).toHaveValue('Saved regression heading');
  await heading.fill('One edit');
  await page.getByRole('button', { name: 'Undo', exact: true }).click();
  await expect(heading).toHaveValue('Saved regression heading');
});
test('JPG and scanned images become readable PDFs', async ({ page }) => {
  for (const [path, button] of [['/jpg-to-pdf/', 'Convert JPG to PDF'], ['/pdf-tools/scan-to-pdf/', 'Build Scan PDF']]) {
    await page.goto(path);
    await expect(page.locator('input[type=file]')).toBeEnabled();
    await page.locator('input[type=file]').setInputFiles(await imageFixture(page, 120, 80, 'image/jpeg'));
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: button, exact: true }).click();
    expect((await PDFDocument.load(await fileBytes(await pending))).getPageCount()).toBe(1);
  }
});
test('Typed signature exports a valid PDF', async ({ page }) => {
  await page.goto('/sign-pdf/');
  await uploadPdf(page);
  await page.getByPlaceholder('Enter your name').fill('Regression test');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Sign PDF', exact: true }).click();
  expect((await PDFDocument.load(await fileBytes(await pending))).getPageCount()).toBe(2);
});
test('Browser OCR recognizes every page and exports a searchable PDF', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/pdf-tools/ocr-pdf/');
  await uploadPdf(page);
  const pending = page.waitForEvent('download', { timeout: 110_000 });
  await page.getByRole('button', { name: 'Create Searchable PDF', exact: true }).click();
  const pdf = await PDFDocument.load(await fileBytes(await pending));
  expect(pdf.getPageCount()).toBe(2);
  expect(pdf.getPage(0).getSize()).toEqual({ width: 612, height: 792 });
  await expect(page.locator('pre')).toContainText('Page 2');
});
for (const [kind, source, expected] of [
  ['text', 'Hello 😀', Buffer.from('Hello 😀').toString('base64')],
  ['hex', '48656c6c6f', 'SGVsbG8='],
  ['url', 'https://example.com/path?q=1', Buffer.from('https://example.com/path?q=1').toString('base64')],
  ['html', '<h1>Test</h1>', Buffer.from('<h1>Test</h1>').toString('base64')],
  ['css', 'body { color: red; }', Buffer.from('body { color: red; }').toString('base64')],
]) test('Base64 source encoder: ' + kind, async ({ page }) => {
  await page.goto('/tools/' + kind + '-to-base64/');
  await page.locator('textarea').first().fill(source);
  await page.getByRole('button', { name: 'Convert to Base64', exact: true }).click();
  await expect(page.locator('textarea[readonly]')).toHaveValue(expected);
});
for (const kind of ['text', 'hex', 'url', 'html', 'css']) test('Base64 source decoder: ' + kind, async ({ page }) => {
  const value = kind === 'url' ? 'https://example.com' : kind === 'hex' ? 'Hello' : '<Test> 😀';
  await page.goto('/tools/base64-to-' + kind + '/');
  await page.locator('textarea').first().fill(Buffer.from(value).toString('base64'));
  await page.getByRole('button', { name: 'Decode Base64', exact: true }).click();
  await expect(page.locator('textarea[readonly]')).toHaveValue(kind === 'hex' ? Buffer.from(value).toString('hex') : value);
});
for (const kind of ['file', 'image', 'pdf', 'audio']) test('Base64 file encoder: ' + kind, async ({ page }) => {
  await page.goto('/tools/' + kind + '-to-base64/');
  const file = kind === 'image' ? await imageFixture(page) : kind === 'pdf' ? { name: 'test.pdf', mimeType: 'application/pdf', buffer: await pdfFixture(1) } : { name: kind === 'audio' ? 'test.wav' : 'test.bin', mimeType: kind === 'audio' ? 'audio/wav' : 'application/octet-stream', buffer: Buffer.from('fixture') };
  await expect(page.locator('input[type=file]')).toBeEnabled();
  await page.locator('input[type=file]').setInputFiles(file);
  await expect(page.locator('textarea[readonly]')).toHaveValue('data:' + file.mimeType + ';base64,' + file.buffer.toString('base64'));
});
for (const route of ['/age-calculator/', '/bmi-calculator/', '/percentage-calculator/', '/emi-calculator/', '/loan-calculator/', '/sip-calculator/', '/gst-calculator/', '/salary-calculator/', '/pregnancy-due-date-calculator/', '/calories-calculator/', '/tools/circle/']) test('Calculator initializes without invalid numbers: ' + route, async ({ page }) => {
  await page.goto(route);
  await expect(page.locator('main').first()).not.toContainText(/NaN|Invalid Date|Infinity/);
  await expect(page.locator('input').first()).toBeVisible();
});
