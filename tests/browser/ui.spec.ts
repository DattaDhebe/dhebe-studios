import { test, expect } from '@playwright/test';

test('Home tool finder searches real tools and handles empty results', async ({ page }) => {
  await page.goto('/');
  const search = page.getByRole('textbox', { name: 'Search all tools' });
  await search.fill('compress pdf');
  const results = page.getByRole('region', { name: 'Tool search results' });
  await expect(results.getByRole('link', { name: /Compress PDF/ }).first()).toHaveAttribute('href', '/compress-pdf/');
  await search.fill('no-such-tool-9283');
  await expect(results).toContainText('0 tools found');
  await page.getByRole('button', { name: 'Clear tool search' }).click();
  await expect(results).toHaveCount(0);
  await expect(search).toHaveValue('');
});

test('Studio category filters are functional', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Documents', exact: true }).click();
  await expect(page.locator('#all-studios .studio-card')).toHaveCount(1);
  await expect(page.locator('#all-studios .studio-card')).toContainText('PDF Studio');
  await page.getByRole('button', { name: 'All studios', exact: true }).click();
  await expect(page.locator('#all-studios .studio-card')).toHaveCount(6);
  await expect(page.locator('#android-apps .android-app-card')).toHaveCount(3);
});

test('Home finder supports shared search URLs', async ({ page }) => {
  await page.goto('/?q=resize');
  await expect(page.getByRole('textbox', { name: 'Search all tools' })).toHaveValue('resize');
  await expect(page.getByRole('region', { name: 'Tool search results' })).toContainText('Image Resizer');
});

test('Tool navigation can filter and switch workflows', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/pdf-studio/');
  const search = page.getByRole('searchbox', { name: 'Search PDF Studio tools' });
  await search.fill('merge');
  const navigation = page.getByRole('navigation', { name: 'PDF Studio tools', exact: true });
  await expect(navigation.getByRole('button')).toHaveCount(1);
  await navigation.getByRole('button', { name: 'Open Merge PDF' }).click();
  await expect(page.locator('.workspace-heading h1')).toHaveText('Merge PDF');
  await search.fill('nothing-matches-984');
  await expect(navigation).toContainText('No matching tools.');
  await navigation.getByRole('button', { name: 'Clear search' }).click();
  await expect(navigation.getByRole('button')).toHaveCount(28);
});

test('Mobile navigation is reachable and closes after choosing a studio', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.getByRole('button', { name: 'Open navigation' }).click();
  const navigation = page.getByRole('navigation', { name: 'Mobile Primary' });
  await expect(navigation).toBeVisible();
  await navigation.getByRole('link', { name: 'PDF tools' }).click();
  await expect(page).toHaveURL(/\/pdf-studio\//);
  await expect(navigation).toHaveCount(0);
});

test('Mobile tool selector is compact and the upload area remains near the top', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/compress-pdf/');
  const toggle = page.getByRole('button', { name: 'Browse PDF Studio tools' });
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  const box = await page.locator('.upload-zone').boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y + box!.height).toBeLessThan(750);
  await toggle.click();
  await page.getByRole('searchbox', { name: 'Search PDF Studio tools' }).fill('merge');
  await page.getByRole('navigation', { name: 'PDF Studio tools', exact: true }).getByRole('button', { name: 'Open Merge PDF' }).click();
  await expect(page).toHaveURL(/\/merge-pdf\//);
  await expect(page.locator('.workspace-heading h1')).toHaveText('Merge PDF');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
});

test('Theme selection persists on refresh', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  await page.getByRole('button', { name: 'Switch to light mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light');
});

test('Theme switching still works when browser storage is blocked', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Storage blocked', 'SecurityError'); } });
  });
  await page.goto('/');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  expect(errors).toEqual([]);
});

test('Selected email sidebar controls have readable dark-mode contrast', async ({ page }) => {
  await page.goto('/email-template-editor/');
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  const contrast = await page.locator('#email-editor aside button.bg-sky-50').first().evaluate(button => {
    const text = button.querySelector('.theme-title')!;
    const luminance = (color: string) => {
      const channels = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => { const n = value / 255; return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; });
      return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
    };
    const foreground = luminance(getComputedStyle(text).color);
    const background = luminance(getComputedStyle(button).backgroundColor);
    return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
});

test('Skip link and upload controls support keyboard focus', async ({ page }) => {
  await page.goto('/compress-pdf/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  const input = page.locator('input[type=file]');
  await expect(input).toBeEnabled();
  await input.focus();
  await expect(input).toBeFocused();
  expect(await page.locator('.upload-zone').evaluate(label => label.matches(':focus-within'))).toBe(true);
});

test('Self-hosted fonts load and server conversion is clearly labeled', async ({ page }) => {
  await page.goto('/pdf-to-word/');
  await page.evaluate(() => document.fonts.ready);
  expect(await page.evaluate(() => [...document.fonts].filter(font => font.status === 'loaded').map(font => font.family))).toEqual(expect.arrayContaining(['DM Sans', 'Space Grotesk']));
  await expect(page.locator('.processing-badge')).toContainText('Temporary server processing');
  await expect(page.locator('.workspace-privacy')).toContainText('Source files are deleted after conversion');
});

for (const route of ['/base64-converter/', '/base64-encoder/', '/base64-decoder/', '/email-template-editor/']) {
  test(`Mobile workspace starts before long introductions on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(route);
    const workspace = route.includes('email') ? page.locator('#email-editor') : page.locator('.workspace-heading');
    await expect(workspace).toBeVisible();
    const box = await workspace.boundingBox();
    expect(box!.y).toBeLessThan(320);
  });
}

for (const width of [390, 768, 1280]) {
  for (const route of ['/', '/compress-pdf/', '/image-tools/image-resizer/', '/age-calculator/', '/base64-converter/', '/email-template-editor/', '/support/']) {
    test(`No page overflow at ${width}px on ${route}`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(route);
      await expect(page.locator('header.site-header')).toBeVisible();
      await expect(page.locator('.site-footer')).toBeAttached();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    });
  }
}
