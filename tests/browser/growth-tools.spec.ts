import { test, expect } from '@playwright/test';
import jsQR from 'jsqr';
import { readFile } from 'node:fs/promises';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dhebe-analytics-consent-v1', 'denied'));
});

test('QR generator creates a decodable static code and downloads both formats', async ({ page }) => {
  await page.goto('/qr-code-generator/');
  await page.getByLabel('Website URL', { exact: true }).fill('https://example.com/menu?table=7');
  await page.getByRole('button', { name: 'Generate QR code', exact: true }).click();
  const image = page.getByAltText('Generated QR code');
  await expect(image).toBeVisible();
  const pixels = await image.evaluate(async node => {
    const image = node as HTMLImageElement;
    await image.decode();
    const canvas = document.createElement('canvas'); canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
    const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0);
    return { width: canvas.width, height: canvas.height, data: Array.from(context.getImageData(0, 0, canvas.width, canvas.height).data) };
  });
  expect(jsQR(new Uint8ClampedArray(pixels.data), pixels.width, pixels.height)?.data).toBe('https://example.com/menu?table=7');
  for (const format of ['PNG', 'SVG']) {
    const pending = page.waitForEvent('download');
    await page.getByRole('button', { name: `Download ${format}` }).click();
    const download = await pending;
    expect(download.suggestedFilename()).toBe(`qr-code.${format.toLowerCase()}`);
    const content = await readFile((await download.path())!);
    if (format === 'SVG') expect(content.toString()).toContain('<svg');
    else expect(content.subarray(0, 8)).toEqual(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  }
  await page.getByLabel('Website URL', { exact: true }).fill('javascript:alert(1)');
  await expect(image).toHaveCount(0);
  await page.getByRole('button', { name: 'Generate QR code', exact: true }).click();
  await expect(page.locator('.utility-error')).toContainText('http or https');
});

test('QR text mode accepts Unicode and rejects blank input', async ({ page }) => {
  await page.goto('/qr-code-generator/');
  await page.getByLabel('Content type').selectOption('text');
  await page.getByRole('button', { name: 'Generate QR code', exact: true }).click();
  await expect(page.locator('.utility-error')).toContainText('Enter a website URL or some text');
  await page.getByLabel('Text to encode').fill('Hello \u4e16\u754c');
  await page.getByRole('button', { name: 'Generate QR code', exact: true }).click();
  await expect(page.getByAltText('Generated QR code')).toBeVisible();
});

test('Word counter counts live text and never persists a draft', async ({ page }) => {
  await page.goto('/word-counter/');
  const text = page.getByLabel('Your text', { exact: true });
  await text.fill('One two.\n\nThree four.');
  const stats = page.getByRole('group', { name: 'Text statistics', exact: true });
  await expect(stats.locator('div').filter({ has: page.locator('dt', { hasText: /^Words$/ }) }).locator('dd')).toHaveText('4');
  await expect(stats.locator('div').filter({ has: page.locator('dt', { hasText: /^Paragraphs$/ }) }).locator('dd')).toHaveText('2');
  await page.reload();
  await expect(text).toHaveValue('');
  await text.fill('e\u0301');
  await expect(stats.locator('div').filter({ has: page.locator('dt', { hasText: /^Characters$/ }) }).locator('dd')).toHaveText('1');
  await page.getByRole('button', { name: 'Clear text' }).click();
  await expect(text).toHaveValue('');
});

test('Image size reducer produces a real JPG below the chosen byte limit', async ({ page }) => {
  await page.goto('/image-size-reducer/');
  const dataUrl = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1000; canvas.height = 750;
    const context = canvas.getContext('2d')!; const pixels = context.createImageData(canvas.width, canvas.height);
    let state = 12345;
    for (let i = 0; i < pixels.data.length; i += 4) { state = (state * 1664525 + 1013904223) >>> 0; pixels.data[i] = state & 255; pixels.data[i + 1] = (state >>> 8) & 255; pixels.data[i + 2] = (state >>> 16) & 255; pixels.data[i + 3] = 255; }
    context.putImageData(pixels, 0, 0); return canvas.toDataURL('image/png');
  });
  await page.getByLabel('Choose a JPG, PNG, or WebP image').setInputFiles({ name: 'synthetic.png', mimeType: 'image/png', buffer: Buffer.from(dataUrl.split(',')[1], 'base64') });
  await page.getByRole('button', { name: '20 KB', exact: true }).click();
  await page.getByRole('button', { name: 'Reduce image size', exact: true }).click();
  await expect(page.getByRole('status')).toContainText('Ready:', { timeout: 30000 });
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download image' }).click();
  const download = await pending; const content = await readFile((await download.path())!);
  expect(content.length).toBeLessThanOrEqual(20000);
  expect(content.subarray(0, 2)).toEqual(Buffer.from([255, 216]));
  await page.getByLabel('Maximum file size (KB)').fill('50');
  await expect(page.getByRole('button', { name: 'Download image' })).toHaveCount(0);
});

test('Image reducer reports corrupt images and invalid limits', async ({ page }) => {
  await page.goto('/image-size-reducer/');
  await page.getByLabel('Choose a JPG, PNG, or WebP image').setInputFiles({ name: 'broken.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('not an image') });
  await page.getByRole('button', { name: 'Reduce image size', exact: true }).click();
  await expect(page.locator('.utility-error')).toContainText('cannot be decoded');
  await page.getByLabel('Maximum file size (KB)').fill('0');
  await expect(page.getByRole('button', { name: 'Reduce image size', exact: true })).toBeDisabled();
});

for (const route of ['/qr-code-generator/', '/word-counter/', '/image-size-reducer/']) {
  test(`New tool is discoverable and usable on mobile: ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); await page.goto(route);
    await expect(page.locator('h1')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(391);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.dhebe.com${route}`);
  });
}

test('Homepage finder includes all three new workflows', async ({ page }) => {
  await page.goto('/');
  for (const query of ['QR code', 'word', 'image size']) {
    await page.getByRole('textbox', { name: 'Search all tools' }).fill(query);
    await expect(page.getByRole('region', { name: 'Tool search results' }).getByRole('link').first()).toBeVisible();
  }
});
