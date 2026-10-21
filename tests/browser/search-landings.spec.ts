import { test, expect } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dhebe-analytics-consent-v1', 'denied'));
});

const landings = [
  { path: '/email-template-editor/', title: 'Free HTML Email Editor', heading: 'Email Template Editor' },
  { path: '/split-pdf/', title: 'Extract a Page Range Free', heading: 'Split PDF' },
  { path: '/tools/base64-to-image/', title: 'Preview and Download PNG or JPG', heading: 'Base64 to Image' },
];

for (const tool of landings) for (const width of [390, 1280]) {
  test(`Search landing stays direct and usable: ${tool.path} at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const response = await page.goto(tool.path);
    expect(response?.status()).toBe(200);
    await expect(page).toHaveURL(new RegExp(tool.path + '$'));
    await expect(page).toHaveTitle(new RegExp(tool.title));
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(tool.heading);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://www.dhebe.com' + tool.path);
    expect(await page.locator('main').innerText()).not.toMatch(/Core Keywords|High Intent Keywords|Builder Keywords|Newsletter Keywords|\bSEO\b/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  });
}

test('Email guide exposes a real workflow and image preparation links, not keyword lists', async ({ page }) => {
  await page.goto('/email-template-editor/');
  const workflow = page.getByRole('complementary', { name: 'From idea to test email' });
  await expect(workflow.getByRole('listitem')).toHaveCount(5);
  await expect(workflow.getByRole('link', { name: 'Resize an email image' })).toHaveAttribute('href', '/image-tools/image-resizer/');
  await expect(workflow.getByRole('link', { name: 'Compress an email image' })).toHaveAttribute('href', '/image-tools/image-compressor/');
  await expect(page.getByText('This editor creates templates;', { exact: false })).toBeVisible();
});

test('PDF splitter labels select exactly the documented continuous range', async ({ page }) => {
  await page.goto('/split-pdf/');
  const pdf = await PDFDocument.create();
  for (const width of [400, 500, 600]) pdf.addPage([width, 700]);
  const input = page.locator('input[type=file]');
  await expect(input).toBeEnabled({ timeout: 30000 });
  await input.setInputFiles({ name: 'synthetic.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) });
  await page.getByLabel('Start Page', { exact: false }).fill('2');
  await page.getByLabel('End Page', { exact: false }).fill('3');
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Extract Pages', exact: true }).click();
  const download = await pending;
  const output = await PDFDocument.load(await readFile((await download.path())!));
  expect(output.getPageCount()).toBe(2);
  expect(output.getPages().map(page => page.getWidth())).toEqual([500, 600]);
  await expect(page.getByRole('link').filter({ hasText: /^Extract Pages/ }).first()).toHaveAttribute('href', '/pdf-tools/extract-pdf-pages/');
});

test('Image decoder guide distinguishes byte recovery from format conversion', async ({ page }) => {
  await page.goto('/tools/base64-to-image/');
  await expect(page.getByText('Raw Base64 without a prefix defaults to PNG.', { exact: false })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Does Base64 to JPG convert a PNG into JPEG?' })).toBeVisible();
  await expect(page.getByRole('link').filter({ hasText: /^Image to Base64/ }).first()).toHaveAttribute('href', '/tools/image-to-base64/');
});
