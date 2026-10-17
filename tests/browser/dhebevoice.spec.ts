import { test, expect } from '@playwright/test';

const endpoint = '**/api/dhebevoice-signup.php';

test('DhebeVoice homepage card invites volunteer testers', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.studio-card').filter({ hasText: 'DhebeVoice' });
  await expect(card).toContainText('Become a tester');
  await expect(card).toHaveAttribute('href', '/dhebevoice/#early-access');
  await card.click();
  await expect(page.getByRole('form', { name: 'DhebeVoice early-access signup' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore the GitHub project' })).toHaveAttribute('href', 'https://github.com/DattaDhebe/dhebevoice-app#dhebevoice');
});

test('Tester signup requires a valid email and consent before submitting', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, route => { requests++; return route.fulfill({ json: { request_received: true } }); });
  await page.goto('/dhebevoice/');
  const email = page.getByRole('textbox', { name: 'Your email address' });
  const submit = page.getByRole('button', { name: 'Join the tester list' });
  await expect(email).toBeEnabled();
  await email.fill('invalid-email');
  await submit.click();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.valid)).toBe(false);
  await email.fill('reader@example.com');
  await submit.click();
  expect(requests).toBe(0);
  await page.getByRole('checkbox').check();
  await submit.click();
  await expect(page.getByRole('status')).toContainText("You're on the tester list.");
  expect(requests).toBe(1);
});

test('Tester signup posts only the requested email and consent', async ({ page }) => {
  let submitted: unknown;
  await page.route(endpoint, route => { submitted = route.request().postDataJSON(); return route.fulfill({ json: { request_received: true } }); });
  await page.goto('/dhebevoice/');
  await page.getByRole('textbox', { name: 'Your email address' }).fill('volunteer+test@example.com');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Join the tester list' }).click();
  await expect(page.getByRole('status')).toContainText('No invitation has been sent yet.');
  expect(submitted).toEqual({ email: 'volunteer+test@example.com', consent: true, website: '' });
});

test('Signup failure keeps the email and lets the visitor retry', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, route => {
    requests++;
    return requests === 1 ? route.fulfill({ status: 503, json: { detail: 'Please try again later.' } }) : route.fulfill({ json: { request_received: true } });
  });
  await page.goto('/dhebevoice/');
  await page.getByRole('textbox', { name: 'Your email address' }).fill('reader@example.com');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Join the tester list' }).click();
  await expect(page.getByRole('form', { name: 'DhebeVoice early-access signup' }).getByRole('alert')).toContainText('Please try again later.');
  await expect(page.getByRole('textbox', { name: 'Your email address' })).toHaveValue('reader@example.com');
  await page.getByRole('button', { name: 'Join the tester list' }).click();
  await expect(page.getByRole('status')).toContainText("You're on the tester list.");
});

test('An invalid service response cannot produce a false success message', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ json: { unexpected: true } }));
  await page.goto('/dhebevoice/');
  await page.getByRole('textbox', { name: 'Your email address' }).fill('reader@example.com');
  await page.getByRole('checkbox').check();
  await page.getByRole('button', { name: 'Join the tester list' }).click();
  await expect(page.getByRole('form', { name: 'DhebeVoice early-access signup' }).getByRole('alert')).toContainText('could not be confirmed');
  await expect(page.getByRole('status')).toHaveCount(0);
});

for (const width of [360, 390, 768, 1280]) test(`DhebeVoice signup shows consent before submit and fits at ${width}px`, async ({ page }) => {
  await page.setViewportSize({ width, height: 900 });
  await page.goto('/dhebevoice/');
  await expect(page.getByRole('heading', { name: 'Be one of the first to try DhebeVoice.' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  const email = page.getByRole('textbox', { name: 'Your email address' });
  const consent = page.getByRole('checkbox');
  const submit = page.getByRole('button', { name: 'Join the tester list' });
  await expect(consent).toBeEnabled();
  await expect(consent).not.toBeChecked();
  await expect(consent).toHaveAttribute('required', '');
  await email.focus();
  await page.keyboard.press('Tab');
  await expect(consent).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(submit).toBeFocused();
  const agreementBounds = await page.locator('.tester-consent').boundingBox();
  const submitBounds = await submit.boundingBox();
  expect(agreementBounds).not.toBeNull();
  expect(submitBounds).not.toBeNull();
  expect(agreementBounds!.y + agreementBounds!.height).toBeLessThanOrEqual(submitBounds!.y);
});
