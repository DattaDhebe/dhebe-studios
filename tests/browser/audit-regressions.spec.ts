import { test, expect, type Page } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

const api = 'https://tools.dhebe.com/api/tools/jobs/';
const docxType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

async function upload(page: Page, mimeType = 'application/pdf') {
  const pdf = await PDFDocument.create();
  pdf.addPage();
  pdf.addPage();
  const input = page.locator('input[type=file]');
  await expect(input).toBeEnabled();
  await input.setInputFiles({ name: 'sample.pdf', mimeType, buffer: Buffer.from(await pdf.save()) });
}

for (const contentType of ['application/json', 'text/html', 'text/plain']) {
  test(`Server conversion rejects successful ${contentType} responses without downloading`, async ({ page }) => {
    let downloads = 0;
    page.on('download', () => downloads++);
    await page.route(api + 'pdf-to-word', route => route.fulfill({
      headers: { 'Access-Control-Allow-Origin': '*' }, contentType, body: '{"detail":"Unexpected upstream response"}',
    }));
    await page.goto('/pdf-to-word/');
    await upload(page);
    await page.getByRole('button', { name: 'Convert and Download' }).click();
    await expect(page.getByRole('alert').filter({ hasText: 'invalid file' })).toBeVisible();
    expect(downloads).toBe(0);
    await expect(page.getByText('Conversion complete. Your download is ready.')).toHaveCount(0);
  });
}

test('A stalled conversion upload times out and releases the controls', async ({ page }) => {
  await page.clock.install();
  await page.route(api + 'pdf-to-word', () => {});
  await page.goto('/pdf-to-word/');
  await upload(page);
  const request = page.waitForRequest(api + 'pdf-to-word');
  await page.getByRole('button', { name: 'Convert and Download' }).click();
  await request;
  await page.clock.fastForward(300_001);
  await expect(page.getByRole('alert').filter({ hasText: 'Conversion timed out' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Convert and Download' })).toBeEnabled();
});

test('Conversion polling shares the overall timeout instead of restarting it', async ({ page }) => {
  await page.clock.install();
  await page.route(api + '**', route => route.fulfill({ status: 202, headers: { 'Access-Control-Allow-Origin': '*' }, json: { job: 'pending-test-job' } }));
  await page.goto('/pdf-to-word/');
  await upload(page);
  const response = page.waitForResponse(api + 'pdf-to-word');
  await page.getByRole('button', { name: 'Convert and Download' }).click();
  await response;
  await page.clock.fastForward(300_001);
  await expect(page.getByRole('alert').filter({ hasText: 'Conversion timed out' })).toBeVisible();
});

test('Server conversion without a filename keeps the actual output extension', async ({ page }) => {
  await page.route(api + 'pdf-to-word', route => route.fulfill({ headers: { 'Access-Control-Allow-Origin': '*' }, contentType: docxType, body: 'PK-test-response' }));
  await page.goto('/pdf-to-word/');
  await upload(page);
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Convert and Download' }).click();
  expect((await download).suggestedFilename()).toBe('converted-sample.docx');
});

test('Cancelled conversions can be retried without a stale busy state', async ({ page }) => {
  let requests = 0;
  await page.route(api + 'pdf-to-word', route => {
    requests++;
    if (requests > 1) return route.fulfill({ headers: { 'Access-Control-Allow-Origin': '*' }, contentType: docxType, body: 'PK-test-response' });
  });
  await page.goto('/pdf-to-word/');
  await upload(page);
  await page.getByRole('button', { name: 'Convert and Download' }).click();
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Conversion cancelled.' })).toBeVisible();
  const download = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Convert and Download' }).click();
  await download;
  expect(requests).toBe(2);
});

const pdfTools = [
  { path: '/split-pdf/', button: 'Extract Pages' },
  { path: '/pdf-tools/extract-pdf-pages/', button: 'Extract Pages' },
  { path: '/pdf-tools/remove-pdf-pages/', button: 'Remove Pages' },
  { path: '/pdf-tools/rotate-pdf/', button: 'Rotate PDF' },
  { path: '/pdf-tools/organize-pdf/', button: 'Save Organized PDF' },
  { path: '/sign-pdf/', button: 'Sign PDF' },
  { path: '/pdf-tools/add-watermark/', button: 'Add Watermark' },
  { path: '/pdf-tools/add-page-numbers/', button: 'Add Page Numbers' },
  { path: '/pdf-tools/crop-pdf/', button: 'Crop PDF' },
];

for (const { path, button } of pdfTools) test(`Rejecting a replacement clears the old PDF at ${path}`, async ({ page }) => {
  await page.goto(path);
  await upload(page);
  await expect(page.getByRole('button', { name: button, exact: true })).toBeVisible();
  await page.locator('input[type=file]').setInputFiles({ name: 'invalid.txt', mimeType: 'text/plain', buffer: Buffer.from('not a PDF') });
  await expect(page.getByText(/Please select a valid PDF file/)).toBeVisible();
  await expect(page.getByRole('button', { name: button, exact: true })).toHaveCount(0);
});

test('PDF tools accept valid PDFs when the browser omits a MIME type', async ({ page }) => {
  await page.goto('/pdf-tools/rotate-pdf/');
  await upload(page, '');
  await expect(page.getByRole('button', { name: 'Rotate PDF', exact: true })).toBeVisible();
});

test('A corrupt PDF replacement cannot leave the old document selected', async ({ page }) => {
  await page.goto('/pdf-tools/rotate-pdf/');
  await upload(page);
  await expect(page.getByRole('button', { name: 'Rotate PDF', exact: true })).toBeVisible();
  await page.locator('input[type=file]').setInputFiles({ name: 'broken.pdf', mimeType: 'application/pdf', buffer: Buffer.from('invalid PDF') });
  await expect(page.getByText('Failed to load PDF file')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Rotate PDF', exact: true })).toHaveCount(0);
});

test('Split PDF rejects blank and fractional page numbers without downloading', async ({ page }) => {
  let downloads = 0;
  page.on('download', () => downloads++);
  await page.goto('/split-pdf/');
  await upload(page);
  const start = page.locator('input[type=number]').first();
  for (const invalid of ['1.5', '']) {
    await start.fill(invalid);
    await page.getByRole('button', { name: 'Extract Pages', exact: true }).click();
    await expect(page.getByText('Please enter valid page range (1 - 2)')).toBeVisible();
    expect(downloads).toBe(0);
  }
});
