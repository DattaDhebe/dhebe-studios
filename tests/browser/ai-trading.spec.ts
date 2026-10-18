import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dhebe-analytics-consent-v1', 'denied'));
});

for (const startPath of ['/', '/compress-pdf/']) {
  for (const width of [390, 1280]) {
    test(`Header shortcut scrolls to AI Trading from ${startPath} at ${width}px`, async ({ page, context }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(startPath);
      if (width < 901) await page.getByRole('button', { name: 'Open navigation' }).click();
      const navigation = page.getByRole('navigation', { name: width < 901 ? 'Mobile Primary' : 'Primary', exact: true });
      const link = navigation.getByRole('link', { name: 'AI Trading', exact: true });
      await expect(link).toHaveAttribute('href', '/#ai-trading');
      await expect(link).not.toHaveAttribute('target', '_blank');
      await link.click();
      await expect(page).toHaveURL(/\/#ai-trading$/);
      await expect(page.locator('#mobile-navigation')).toHaveCount(0);
      const section = page.getByRole('region', { name: 'AI Trading', exact: true });
      await expect(section).toHaveAttribute('id', 'ai-trading');
      await expect.poll(async () => {
        const top = await section.evaluate(element => element.getBoundingClientRect().top);
        const headerBottom = await page.locator('header.site-header').evaluate(element => element.getBoundingClientRect().bottom);
        return top >= headerBottom && top <= 150;
      }).toBe(true);
      expect(context.pages()).toHaveLength(1);
    });
  }
}

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

test('Trading section explains automation without promising investment income', async ({ page }) => {
  await page.goto('/#ai-trading');
  const section = page.getByRole('region', { name: 'AI Trading', exact: true });
  await expect(section.getByRole('article')).toHaveCount(4);
  await expect(section.getByRole('heading', { name: 'Choose automatic or hands-on.' })).toBeVisible();
  await expect(section).toContainText('Both use virtual funds and the same data and risk checks');
  await expect(section).toContainText('does not accept investment deposits or place real broker orders');
  await expect(section).toContainText('Trained AI prediction models are not enabled');
  await expect(section).toContainText('profitable performance has not been established');
  await expect(section).toContainText('not a hands-free income service');
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

for (const width of [360, 390, 768, 901, 1024, 1100, 1280]) {
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
