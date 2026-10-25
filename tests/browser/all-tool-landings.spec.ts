import { test, expect } from '@playwright/test';
import { toolDirectory } from '../../lib/tool-directory';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dhebe-analytics-consent-v1', 'denied'));
});

for (const tool of toolDirectory) {
  const path = tool.href.replace(/\/?$/, '/');
  test(`Every tool has a direct search landing: ${path}`, async ({ page }) => {
    for (const width of [390, 1280]) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(path);
      expect(response?.status()).toBe(200);
      await expect(page).toHaveURL(new RegExp(path + '$'));
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).not.toBeEmpty();
      await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://www.dhebe.com' + path);
      const source = await response!.text();
      expect(source).not.toMatch(/<meta name="robots" content="[^"]*noindex/);
      expect(source).toContain('WebApplication');
      if (tool.workspace) {
        expect(source).toContain(`data-active-tool="${tool.workspace}"`);
        const workspace = page.locator('[data-active-tool]');
        await expect(workspace).toHaveAttribute('data-active-tool', tool.workspace);
        await expect(workspace.locator('input, textarea, select, button').first()).toBeEnabled();
        await expect(workspace.locator('.workspace-tool')).not.toBeEmpty();
      }
      expect(await page.locator('main').innerText()).not.toMatch(/\bSEO\b|Core Keywords|Long-tail searches/);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    }
  });
}

for (const [start, next, label, active] of [
  ['/pdf-studio/', '/pdf-to-png/', 'PDF to PNG', 'pdf:pdf-to-png'],
  ['/image-studio/', '/image-tools/png-to-jpg/', 'PNG to JPG', 'image:png-to-jpg'],
  ['/calculator-studio/', '/tools/circle/', 'Circle Calculator', 'calculator:circle'],
  ['/tools/text-to-base64/', '/tools/base64-to-text/', 'Base64 to Text', 'code:decoder:text'],
]) {
  test(`Tool links preserve exact URLs, reload and browser history from ${start}`, async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(start);
    const link = page.getByRole('link', { name: `Open ${label}`, exact: true });
    await expect(link).toHaveAttribute('href', next);
    await link.click();
    await expect(page).toHaveURL(new RegExp(next + '$'));
    await expect(page.locator('[data-active-tool]')).toHaveAttribute('data-active-tool', active);
    await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href', 'https://www.dhebe.com' + next);
    await page.reload();
    await expect(page.locator('[data-active-tool]')).toHaveAttribute('data-active-tool', active);
    await page.goBack(); await expect(page).toHaveURL(new RegExp(start + '$'));
    await page.goForward(); await expect(page.locator('[data-active-tool]')).toHaveAttribute('data-active-tool', active);
  });
}
