import { test, expect, type Page } from '@playwright/test';
import { PDFDocument } from 'pdf-lib';

type AuditWindow = Window & { revokedUrls?: string[]; failCopy?: () => void };

const base64Tools = [
  { path: '/tools/text-to-base64/', label: 'Type Text', source: 'FIRST', replacement: 'SECOND', action: 'Convert to Base64', download: 'Download TXT' },
  { path: '/tools/base64-to-text/', label: 'Paste Base64', source: 'RklSU1Q=', replacement: 'U0VDT05E', action: 'Decode Base64', download: 'Download TXT' },
  { path: '/tools/base64-to-file/', label: 'Paste Base64', source: 'RklSU1Q=', replacement: 'U0VDT05E', action: 'Decode Base64', download: 'Download File' },
];

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dhebe-analytics-consent-v1', 'denied'));
});

for (const tool of base64Tools) {
  test(`Editing input invalidates the old download at ${tool.path}`, async ({ page }) => {
    await page.goto(tool.path);
    const input = page.locator('textarea:not([readonly])');
    await expect(input).toBeEnabled();
    await input.fill(tool.source);
    await page.getByRole('button', { name: tool.action, exact: true }).click();
    await expect(page.getByRole('button', { name: tool.download, exact: true })).toBeVisible();
    await input.fill(tool.replacement);
    await expect(page.getByRole('button', { name: tool.download, exact: true })).toHaveCount(0);
    await expect(page.locator('textarea[readonly]')).toHaveCount(0);
    if (tool.path === '/tools/text-to-base64/') await page.screenshot({ path: test.info().outputPath('cleared-output.png') });
    await page.getByRole('button', { name: tool.action, exact: true }).click();
    await expect(page.getByRole('button', { name: tool.download, exact: true })).toBeVisible();
  });

  test(`Base64 input, output and errors are accessible at ${tool.path}`, async ({ page }) => {
    await page.goto(tool.path);
    const input = page.getByRole('textbox', { name: tool.label, exact: true });
    await expect(input).toBeEnabled();
    await input.fill(tool.source);
    await page.getByRole('button', { name: tool.action, exact: true }).click();
    await expect(page.locator('textarea[readonly]')).toHaveAccessibleName(/output|recovered/i);
    await input.fill('');
    await page.getByRole('button', { name: tool.action, exact: true }).click();
    await expect(page.getByRole('alert').filter({ hasText: /Add/ })).toBeVisible();
  });
}

test('Changing a decoded image revokes the old preview URL', async ({ page }) => {
  await page.addInitScript(() => {
    const revoke = URL.revokeObjectURL;
    (window as AuditWindow).revokedUrls = [];
    URL.revokeObjectURL = value => {
      (window as AuditWindow).revokedUrls!.push(value);
      revoke.call(URL, value);
    };
  });
  await page.goto('/tools/base64-to-image/');
  const image = await page.evaluate(() => {
    const canvas = document.createElement('canvas'); canvas.width = canvas.height = 8;
    return canvas.toDataURL('image/png');
  });
  const input = page.getByRole('textbox', { name: 'Paste Base64', exact: true });
  await expect(input).toBeEnabled(); await input.fill(image);
  await page.getByRole('button', { name: 'Decode Base64', exact: true }).click();
  const url = await page.locator('textarea[readonly]').inputValue();
  await input.fill('changed input');
  await expect(page.getByAltText('Decoded Base64 preview')).toHaveCount(0);
  await expect.poll(() => page.evaluate(value => (window as AuditWindow).revokedUrls!.includes(value), url)).toBe(true);
});

test('A late clipboard failure cannot overwrite feedback for a new input', async ({ page }) => {
  await page.goto('/tools/text-to-base64/');
  await page.evaluate(() => {
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: () => new Promise((_resolve, reject) => {
        (window as AuditWindow).failCopy = () => reject(new Error('test-only failure'));
      }),
    } });
  });
  const input = page.getByRole('textbox', { name: 'Type Text', exact: true });
  await expect(input).toBeEnabled(); await input.fill('FIRST');
  await page.getByRole('button', { name: 'Convert to Base64', exact: true }).click();
  await page.getByRole('button', { name: 'Copy Base64', exact: true }).click();
  await input.fill('SECOND');
  await page.getByRole('button', { name: 'Convert to Base64', exact: true }).click();
  await page.evaluate(() => (window as AuditWindow).failCopy!());
  await expect(page.getByRole('alert').filter({ hasText: 'Clipboard access was blocked' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Copy Base64', exact: true })).toBeVisible();
});

test('Only the newest clipboard attempt can update copy feedback', async ({ page }) => {
  await page.goto('/tools/text-to-base64/');
  await page.evaluate(() => {
    let attempts = 0;
    Object.defineProperty(navigator, 'clipboard', { configurable: true, value: {
      writeText: () => ++attempts === 1 ? new Promise((_resolve, reject) => {
        (window as AuditWindow).failCopy = () => reject(new Error('test-only failure'));
      }) : Promise.resolve(),
    } });
  });
  const input = page.getByRole('textbox', { name: 'Type Text', exact: true });
  await expect(input).toBeEnabled(); await input.fill('FIRST');
  await page.getByRole('button', { name: 'Convert to Base64', exact: true }).click();
  await page.getByRole('button', { name: 'Copy Base64', exact: true }).click();
  await page.getByRole('button', { name: 'Copy Base64', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Copied', exact: true })).toBeVisible();
  await page.evaluate(() => (window as AuditWindow).failCopy!());
  await expect(page.getByRole('alert').filter({ hasText: 'Clipboard access was blocked' })).toHaveCount(0);
});

type DelayedWindow = Window & { releasePdfRead?: () => Promise<void>; pdfReadStarted?: boolean; pdfReadFinished?: boolean };

async function delayedExport(page: Page, route: string) {
  await page.goto(route);
  await page.evaluate(() => {
    const read = File.prototype.arrayBuffer;
    let reads = 0;
    File.prototype.arrayBuffer = function () {
      if (this.name === 'delayed.pdf' && ++reads === 2) {
        (window as DelayedWindow).pdfReadStarted = true;
        return new Promise(resolve => {
          (window as DelayedWindow).releasePdfRead = async () => {
            resolve(await read.call(this));
            (window as DelayedWindow).pdfReadFinished = true;
          };
        });
      }
      return read.call(this);
    };
  });
  const pdf = await PDFDocument.create(); pdf.addPage(); pdf.addPage();
  const input = page.locator('input[type=file]'); await expect(input).toBeEnabled();
  await input.setInputFiles({ name: 'delayed.pdf', mimeType: 'application/pdf', buffer: Buffer.from(await pdf.save()) });
  await page.getByRole('button', { name: 'Extract Pages', exact: true }).click();
  await expect.poll(() => page.evaluate(() => (window as DelayedWindow).pdfReadStarted)).toBe(true);
}

for (const route of ['/split-pdf/', '/pdf-tools/extract-pdf-pages/']) {
  test(`Pending PDF export locks selection and editable page controls at ${route}`, async ({ page }) => {
    await delayedExport(page, route);
    await expect(page.locator('input[type=file]')).toBeDisabled();
    for (const control of await page.locator('.theme-card input').all()) await expect(control).toBeDisabled();
    await page.evaluate(() => (window as DelayedWindow).releasePdfRead!());
    await expect(page.getByRole('button', { name: 'Extract Pages', exact: true })).toBeEnabled();
  });

  test(`Switching tools discards a pending PDF download at ${route}`, async ({ page }) => {
    let downloads = 0; page.on('download', () => downloads++);
    await delayedExport(page, route);
    await page.getByRole('link', { name: 'Open Merge PDF', exact: true }).click();
    await expect(page.locator('.workspace-heading h1')).toHaveText('Merge PDF');
    await page.evaluate(() => (window as DelayedWindow).releasePdfRead!());
    await expect.poll(() => page.evaluate(() => (window as DelayedWindow).pdfReadFinished)).toBe(true);
    await page.evaluate(() => new Promise(resolve => setTimeout(resolve, 500)));
    expect(downloads).toBe(0);
  });
}
