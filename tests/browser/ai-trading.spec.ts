import { test, expect } from '@playwright/test';

test('Homepage describes private paper research without offering live execution', async ({ page }) => {
  await page.goto('/');
  const section = page.getByRole('region', { name: 'AI Trading', exact: true });
  await expect(section).toContainText('Market screening & research');
  await expect(section).toContainText('Decision journal & paper trades');
  await expect(section).toContainText('System health & risk checks');
  await expect(section).toContainText('Sign-in required. Opens in a new tab.');
  await expect(section).toContainText('Research and simulation only, not investment advice.');
  await expect(section).toContainText('not an open-signup trading service');
});

test('Trading card opens the exact dashboard in a new tab and preserves the current page', async ({ page, context }) => {
  await context.route('https://trade.dhebe.com/**', route => route.fulfill({ contentType: 'text/html', body: '<!doctype html><title>Test trading destination</title><h1>Trading sign-in fixture</h1>' }));
  await page.goto('/');
  const currentUrl = page.url();
  const link = page.getByRole('region', { name: 'AI Trading', exact: true }).getByRole('link');
  await expect(link).toHaveAttribute('href', 'https://trade.dhebe.com/');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  await link.focus();
  await expect(link).toBeFocused();
  const opened = context.waitForEvent('page');
  await link.press('Enter');
  const trading = await opened;
  await expect(trading).toHaveURL('https://trade.dhebe.com/');
  await expect(trading.getByRole('heading')).toHaveText('Trading sign-in fixture');
  expect(await trading.evaluate(() => window.opener)).toBeNull();
  await expect(page).toHaveURL(currentUrl);
  await trading.close();
});

test('Footer trading link also explicitly opens a safe new tab', async ({ page }) => {
  await page.goto('/');
  const link = page.locator('footer').getByRole('link', { name: /AI Trading/ });
  await expect(link).toHaveAttribute('href', 'https://trade.dhebe.com/');
  await expect(link).toHaveAttribute('target', '_blank');
  await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(link).toHaveAccessibleName(/opens in a new tab/);
});

for (const width of [360, 390, 768, 1280]) {
  test(`Trading section fits the existing layout at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.getByRole('region', { name: 'AI Trading', exact: true })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  });
}
