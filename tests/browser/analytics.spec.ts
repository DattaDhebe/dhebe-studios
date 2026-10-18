import { test, expect } from '@playwright/test';

test('Visitors can decline analytics, reopen preferences and withdraw without breaking tools', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => { if (/google-analytics|googletagmanager/.test(request.url())) requests.push(request.url()); });
  await page.goto('/word-counter/?q=private-draft');
  const choices = page.getByRole('region', { name: 'Analytics privacy choices' });
  await expect(choices).toBeVisible();
  await page.getByRole('button', { name: 'No thanks', exact: true }).click();
  await expect(choices).toHaveCount(0);
  await page.reload(); await expect(choices).toHaveCount(0);
  await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
  await expect(choices).toBeVisible();
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  // A local preview must never pollute production reports, even after opt-in.
  expect(requests).toEqual([]);
  await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
  await page.getByRole('button', { name: 'No thanks', exact: true }).click();
  await page.getByLabel('Your text', { exact: true }).fill('Still works.');
  await expect(page.getByLabel('Your text', { exact: true })).toHaveValue('Still works.');
});

test('A browser privacy signal overrides saved analytics consent', async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('dhebe-analytics-consent-v1', 'granted');
    Object.defineProperty(navigator, 'globalPrivacyControl', { value: true });
  });
  await page.goto('/');
  await expect(page.locator('#google-analytics')).toHaveCount(0);
  await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Analytics privacy choices' })).toContainText('requests no tracking');
  await expect(page.getByRole('button', { name: 'Allow analytics', exact: true })).toHaveCount(0);
});

test('Analytics choice survives blocked browser storage', async ({ page }) => {
  const errors: string[] = []; page.on('pageerror', error => errors.push(error.message));
  await page.addInitScript(() => Object.defineProperty(window, 'localStorage', { get() { throw new DOMException('Blocked', 'SecurityError'); } }));
  await page.goto('/');
  await page.getByRole('button', { name: 'No thanks', exact: true }).click();
  await expect(page.getByRole('region', { name: 'Analytics privacy choices' })).toHaveCount(0);
  expect(errors).toEqual([]);
});
