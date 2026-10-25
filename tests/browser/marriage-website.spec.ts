import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('dhebe-analytics-consent-v1', 'denied'));
});

test('Homepage source describes Milan and links to the real website without duplicating its editor', async ({ page }) => {
  const response = await page.goto('/');
  const source = await response!.text();
  expect(source).toContain('id="marriage-biodata"'); expect(source).toContain('https://shaadi.dhebe.com/');
  expect(source).toContain('30 templates');
  await expect(page).toHaveTitle('Free Online Tools & Marriage Biodata | DHEBE Studios');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.dhebe.com/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://www.dhebe.com/home-preview.png');
  await expect(page.locator('h1')).toHaveCount(1);
  const card = page.locator('#all-studios a#marriage-biodata');
  await expect(card).toHaveCount(1);
  await expect(page.locator('#all-studios .studio-card')).toHaveCount(6);
  await expect(card).toHaveAttribute('href', 'https://shaadi.dhebe.com/');
  await expect(card).toHaveAttribute('target', '_blank');
  await expect(card).toHaveAttribute('rel', 'noopener noreferrer');
  await expect(card.locator('input, textarea, form')).toHaveCount(0);
  await expect(page.locator('.marriage-website-section, .marriage-website-card')).toHaveCount(0);
  await expect(page.locator('main')).not.toContainText(/\bSEO\b|guaranteed ranking|rank #1/i);
  const schema = await page.locator('#home-structured-data').evaluate(element => JSON.parse(element.textContent || '{}'));
  expect(schema['@graph'].find((row: { '@type': string }) => row['@type'] === 'ItemList').itemListElement[0].url).toBe('https://shaadi.dhebe.com/');
  expect(schema['@graph'].find((row: { '@type': string }) => row['@type'] === 'WebPage').hasPart['@id']).toBe('https://www.dhebe.com/#marriage-biodata');
});

test('Clicking the marriage tile opens Milan in a new tab and retains the original website', async ({ page, context }) => {
  await context.route('https://shaadi.dhebe.com/**', route => route.fulfill({ contentType: 'text/html', body: '<h1>Milan destination fixture</h1>' }));
  await page.goto('/');
  const pending = page.waitForEvent('popup');
  await page.locator('#marriage-biodata').click();
  const popup = await pending; await popup.waitForLoadState();
  expect(popup.url()).toBe('https://shaadi.dhebe.com/');
  await expect(page).toHaveURL(/\/$/); await popup.close();
});

test('Finder recognizes biodata and wedding website searches with an explicit external destination', async ({ page }) => {
  await page.goto('/');
  for (const query of ['marriage biodata', 'biodata', 'milan', 'shaadi', 'marrige']) {
    await page.getByRole('textbox', { name: 'Search all tools' }).fill(query);
    const result = page.getByRole('region', { name: 'Tool search results' }).getByRole('link', { name: /Marriage Biodata Maker/ });
    await expect(result).toHaveAttribute('href', 'https://shaadi.dhebe.com/');
    await expect(result).toHaveAttribute('target', '_blank'); await expect(result).toContainText('Separate website / Opens in a new tab');
  }
});

for (const width of [360, 390, 800, 1024, 1280, 1440]) test(`Compact biodata card fits ${width}px in both themes`, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 900 }); await page.goto('/');
  const card = page.locator('#marriage-biodata');
  await expect(card.getByRole('heading', { name: 'Marriage Biodata', exact: true })).toBeVisible();
  if (width >= 1280) {
    const cards = page.locator('#all-studios .studio-card');
    const third = await cards.nth(2).boundingBox(); const fifth = await cards.nth(4).boundingBox(); const sixth = await card.boundingBox();
    expect(Math.abs(sixth!.x - third!.x)).toBeLessThan(1);
    expect(Math.abs(sixth!.y - fifth!.y)).toBeLessThan(1);
    expect(sixth!.width).toBeLessThan(500);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  if (width === 1280 || width === 390) await (width === 1280 ? page.locator('#all-studios') : card).screenshot({ path: testInfo.outputPath('milan-light.png') });
  await page.getByRole('button', { name: 'Switch to dark mode' }).click();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  if (width === 1280 || width === 390) await (width === 1280 ? page.locator('#all-studios') : card).screenshot({ path: testInfo.outputPath('milan-dark.png') });
});

test('Create and send filter includes the biodata card alongside the email editor', async ({ page }) => {
  await page.goto('/'); await page.getByRole('button', { name: 'Create & send', exact: true }).click();
  const cards = page.locator('#all-studios .studio-card');
  await expect(cards).toHaveCount(2); await expect(cards.nth(0)).toContainText('Email Editor'); await expect(cards.nth(1)).toContainText('Marriage Biodata');
});

test('Milan click events remain consent-only and never contain search queries or personal details', async ({ page, context, baseURL }) => {
  await context.route('https://www.dhebe.com/**', async route => {
    const url = new URL(route.request().url());
    const response = await context.request.get(new URL(url.pathname + url.search, baseURL!).href);
    await route.fulfill({ response });
  });
  await context.route('**/*googletagmanager.com/**', route => route.fulfill({ contentType: 'text/javascript', body: '' }));
  await context.route('**/*google-analytics.com/**', route => route.abort());
  await page.goto('https://www.dhebe.com/?email=private@example.com#private');
  await page.locator('#marriage-biodata').evaluate(link => link.addEventListener('click', event => event.preventDefault()));
  await page.locator('#marriage-biodata').click(); await expect(page.locator('#google-analytics')).toHaveCount(0);
  await page.getByRole('button', { name: 'Cookie preferences' }).click();
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await page.locator('#marriage-biodata').click();
  const events = () => page.evaluate(() => ((window as Window & { dataLayer?: unknown[][] }).dataLayer || []).filter(event => event[0] === 'event' && event[1] === 'website_select'));
  expect(await events()).toEqual([expect.objectContaining({ 2: { website_id: 'milan', placement: 'featured' } })]);
  expect(JSON.stringify(await events())).not.toMatch(/private|email|https|shaadi|name|photo|biodata_content/);
  await page.getByRole('button', { name: 'Cookie preferences' }).click(); await page.getByRole('button', { name: 'No thanks', exact: true }).click();
  await page.locator('#marriage-biodata').click(); expect(await events()).toHaveLength(1);
});
