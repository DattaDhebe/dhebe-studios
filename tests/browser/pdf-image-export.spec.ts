import { test, expect, type Page } from '@playwright/test';
import { PDFDocument, rgb } from 'pdf-lib';
import { readFile } from 'node:fs/promises';
import { unzipSync } from 'fflate';

async function fixture(count = 2, size: [number, number] = [612, 792]) {
  const pdf = await PDFDocument.create();
  for (let i = 0; i < count; i++) {
    const page = pdf.addPage(size);
    page.drawRectangle({ x: 20, y: 20, width: 100, height: 100, color: rgb(0.1, 0.5, 0.3) });
  }
  return Buffer.from(await pdf.save());
}
async function upload(page: Page, buffer = undefined as Buffer | undefined, name = 'synthetic.pdf') {
  const input = page.locator('input[type=file]');
  await expect(input).toBeEnabled();
  await input.setInputFiles({ name, mimeType: /\.pdf$/i.test(name) ? 'application/pdf' : 'text/plain', buffer: buffer ?? await fixture() });
}
async function convert(page: Page) {
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Convert PDF to PNG', exact: true }).click();
  const download = await pending;
  return { name: download.suggestedFilename(), bytes: await readFile((await download.path())!) };
}
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dhebe-analytics-consent-v1', 'denied'));
});

test('PNG page selection produces genuine PNG files with requested dimensions and no upload', async ({ page }) => {
  const posts: string[] = [];
  page.on('request', request => { if (request.method() === 'POST') posts.push(request.url()); });
  await page.goto('/pdf-to-png/'); await upload(page, await fixture(3));
  await page.getByLabel('Pages (blank = all)').fill('1, 3');
  await page.getByLabel('Resolution', { exact: true }).selectOption('144');
  const result = await convert(page);
  expect(result.name).toBe('synthetic-pages.zip');
  const files = unzipSync(result.bytes);
  expect(Object.keys(files)).toEqual(['synthetic-page-1.png', 'synthetic-page-3.png']);
  for (const bytes of Object.values(files)) {
    const png = Buffer.from(bytes);
    expect([...png.subarray(0, 8)]).toEqual([137, 80, 78, 71, 13, 10, 26, 10]);
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([1224, 1584]);
    const pixels = await page.evaluate(async base64 => {
      const bytes = Uint8Array.from(atob(base64), char => char.charCodeAt(0));
      const image = await createImageBitmap(new Blob([bytes], { type: 'image/png' }));
      const canvas = document.createElement('canvas'); canvas.width = image.width; canvas.height = image.height;
      const context = canvas.getContext('2d')!; context.drawImage(image, 0, 0); image.close();
      return { white: [...context.getImageData(0, 0, 1, 1).data], green: [...context.getImageData(60, canvas.height - 60, 1, 1).data] };
    }, png.toString('base64'));
    expect(pixels.white).toEqual([255, 255, 255, 255]);
    expect(pixels.green[1]).toBeGreaterThan(pixels.green[0]);
    expect(pixels.green[3]).toBe(255);
  }
  expect(posts).toEqual([]);
});

test('One PNG downloads without ZIP and oversized pages are safely downscaled', async ({ page }) => {
  await page.goto('/pdf-to-png/'); await upload(page, await fixture(1, [10000, 10000]));
  await page.getByLabel('Resolution', { exact: true }).selectOption('300');
  const result = await convert(page);
  expect(result.name).toBe('synthetic-page-1.png');
  const width = result.bytes.readUInt32BE(16), height = result.bytes.readUInt32BE(20);
  expect(width).toBeLessThanOrEqual(4096); expect(height).toBeLessThanOrEqual(4096);
  expect(width * height).toBeLessThanOrEqual(8_000_000);
});

test('Invalid ranges and too many pages show actionable errors and permit a valid retry', async ({ page }) => {
  await page.goto('/pdf-to-png/'); await upload(page, await fixture(51));
  await page.getByRole('button', { name: 'Convert PDF to PNG', exact: true }).click();
  await expect(page.locator('.workspace-tool [role=alert]')).toContainText('up to 50 pages');
  await page.getByLabel('Pages (blank = all)').fill('52');
  await page.getByRole('button', { name: 'Convert PDF to PNG', exact: true }).click();
  await expect(page.locator('.workspace-tool [role=alert]')).toContainText('outside 1-51');
  await page.getByLabel('Pages (blank = all)').fill('2');
  expect((await convert(page)).name).toBe('synthetic-page-2.png');
});

test('Invalid replacement, excessive input and corrupt PDFs cannot reuse an old valid selection', async ({ page }) => {
  await page.goto('/pdf-to-png/'); await upload(page);
  await upload(page, Buffer.from('not a pdf'), 'wrong.txt');
  await expect(page.locator('.workspace-tool [role=alert]')).toContainText('select a PDF');
  await expect(page.getByRole('button', { name: 'Convert PDF to PNG', exact: true })).toHaveCount(0);
  await upload(page, Buffer.alloc(25 * 1024 * 1024 + 1));
  await expect(page.locator('.workspace-tool [role=alert]')).toContainText('25 MB or less');
  await upload(page, Buffer.from('%PDF-1.7\ncorrupt'));
  await page.getByRole('button', { name: 'Convert PDF to PNG', exact: true }).click();
  await expect(page.locator('.workspace-tool [role=alert]')).not.toBeEmpty();
  await expect(page.getByRole('button', { name: 'Convert PDF to PNG', exact: true })).toBeEnabled();
});

test('Documents over the source page limit fail before rasterization', async ({ page }) => {
  await page.goto('/pdf-to-png/'); await upload(page, await fixture(151));
  await page.getByLabel('Pages (blank = all)').fill('1');
  await page.getByRole('button', { name: 'Convert PDF to PNG', exact: true }).click();
  await expect(page.locator('.workspace-tool [role=alert]')).toContainText('150 pages or fewer');
});

for (const leave of [false, true]) test(`Pending image export is discarded on ${leave ? 'tool navigation' : 'cancel'}`, async ({ page }) => {
  let downloads = 0;
  page.on('download', () => downloads++);
  await page.addInitScript(() => {
    const read = File.prototype.arrayBuffer;
    File.prototype.arrayBuffer = async function () {
      const data = await read.call(this);
      await new Promise<void>(resolve => { (window as Window & { releaseRead?: () => void }).releaseRead = resolve; });
      return data;
    };
  });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pdf-to-png/'); await upload(page);
  await page.getByRole('button', { name: 'Convert PDF to PNG', exact: true }).click();
  await expect.poll(() => page.evaluate(() => typeof (window as Window & { releaseRead?: () => void }).releaseRead)).toBe('function');
  if (leave) {
    await page.getByRole('link', { name: 'Open PDF to JPG', exact: true }).click();
    await expect(page).toHaveURL(/\/pdf-to-jpg\/$/);
  } else await page.getByRole('button', { name: 'Cancel conversion', exact: true }).click();
  await page.evaluate(() => (window as Window & { releaseRead?: () => void }).releaseRead!());
  if (!leave) {
    await expect(page.getByRole('status')).toContainText('cancelled');
    await expect(page.getByRole('button', { name: 'Convert PDF to PNG', exact: true })).toBeEnabled();
  }
  await page.waitForTimeout(300);
  expect(downloads).toBe(0);
});
