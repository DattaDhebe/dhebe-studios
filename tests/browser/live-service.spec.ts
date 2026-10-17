import { test, expect } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { unzipSync } from 'fflate';

test('Live DhebeVoice tester form confirms a synthetic signup', async ({ page }) => {
  test.skip(!process.env.TEST_BASE_URL || !process.env.TEST_TESTER_EMAIL, 'Requires an explicit disposable example.com address and subsequent private database verification.');
  expect(process.env.TEST_TESTER_EMAIL).toMatch(/^dv-smoke-[a-z0-9-]+@example\.com$/);
  await page.goto('/dhebevoice/');
  await page.getByRole('textbox', { name: 'Your email address' }).fill(process.env.TEST_TESTER_EMAIL!);
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Join the tester list' }).click();
  await expect(page.getByRole('status')).toContainText("You're on the tester list.");
});

test('Live website converts a generated PDF to a real DOCX over the approved VPS API', async ({ page }) => {
  test.skip(!process.env.TEST_BASE_URL, 'Run only after frontend publication.');
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('/pdf-to-word/');
  const pdf = await PDFDocument.create();
  pdf.addPage().drawText('Public conversion regression document');
  const input = page.locator('input[type=file]');
  await expect(input).toBeEnabled();
  await input.setInputFiles({ name: 'public-test.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) });
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Convert and Download' }).click();
  const download = await pending;
  expect(download.suggestedFilename()).toMatch(/\.docx$/);
  const chunks = [];
  for await (const chunk of (await download.createReadStream())!) chunks.push(chunk);
  const archive = unzipSync(Buffer.concat(chunks));
  expect(new TextDecoder().decode(archive['word/document.xml'])).toContain('Public conversion regression document');
  expect(errors).toEqual([]);
});

for (const route of ['/compress-pdf/', '/pdf-tools/optimize-pdf/']) test(`Live ${route} loads its matching worker and downloads a readable PDF`, async ({ page }) => {
  test.skip(!process.env.TEST_BASE_URL, 'Run only after frontend publication.');
  await page.goto(route);
  const pdf = await PDFDocument.create();
  pdf.addPage([612, 792]).drawText('Public compressor regression');
  const input = page.locator('input[type=file]');
  await expect(input).toBeEnabled();
  await input.setInputFiles({ name: 'public-test.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) });
  const pending = page.waitForEvent('download');
  const workerResponse = page.waitForResponse(response => response.url().endsWith('/pdf.worker.min.js'));
  await page.getByRole('button', { name: 'Balanced', exact: true }).click();
  const worker = await workerResponse;
  expect(worker.ok()).toBe(true);
  expect(worker.headers()['content-type']).toMatch(/javascript/);
  const chunks = [];
  for await (const chunk of (await (await pending).createReadStream())!) chunks.push(chunk);
  const result = await PDFDocument.load(Buffer.concat(chunks));
  expect(result.getPage(0).getSize()).toEqual({ width: 612, height: 792 });
});
