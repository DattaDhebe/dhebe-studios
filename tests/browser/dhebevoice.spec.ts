import { test, expect, type Page } from '@playwright/test';

const endpoint = '**/api/dhebevoice-signup.php';
const publicEndpoint = '**/api/dhebevoice-testers.php?*';
const challenge = { request_received: true, verification_required: true, request_id: 'a'.repeat(64), expires_in: 600, resend_after: 60 };
const verified = { request_received: true, verified: true };
const emptyList = { testers: [], total: 0, page: 0, page_size: 24 };
const fixture = { id: 'b'.repeat(32), email_label: 'r***@e***.com', email_visibility: 'masked', display_name: 'Example Reader', joined_on: '2026-10-22' };
const consent = (page: Page) => page.getByRole('checkbox', { name: 'I volunteer to test' });
const publicChoice = (page: Page) => page.getByRole('checkbox', { name: 'Optional: include me' });

async function join(page: Page, email = 'reader@example.com') {
  await page.getByRole('textbox', { name: 'Your email address' }).fill(email);
  await consent(page).check();
  await page.getByRole('button', { name: 'Join the tester list' }).click();
}
async function confirm(page: Page) {
  await page.getByRole('textbox', { name: 'Verification code', exact: true }).fill('12345678');
  await page.getByRole('button', { name: 'Verify email and join' }).click();
}

test.beforeEach(async ({ page }) => {
  await page.route(publicEndpoint, route => route.fulfill({ json: emptyList }));
  await page.route(endpoint, route => route.fulfill({ json: route.request().postDataJSON().action === 'verify' ? verified : challenge }));
});

test('DhebeVoice homepage card invites volunteer testers', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('.studio-card').filter({ hasText: 'DhebeVoice' });
  await expect(card).toContainText('Become a tester');
  await expect(card).toHaveAttribute('href', '/dhebevoice/#early-access');
  await card.click();
  await expect(page.getByRole('form', { name: 'DhebeVoice early-access signup' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Explore the GitHub project' })).toHaveAttribute('href', 'https://github.com/DattaDhebe/dhebevoice-app#dhebevoice');
});

test('Signup requires a valid email and required consent, but publication is optional', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, route => { requests++; return route.fulfill({ json: challenge }); });
  await page.goto('/dhebevoice/');
  const email = page.getByRole('textbox', { name: 'Your email address' });
  const submit = page.getByRole('button', { name: 'Join the tester list' });
  await expect(email).toBeEnabled();
  for (const value of ['invalid-email', 'a@example']) {
    await email.fill(value); await submit.click();
    expect(await email.evaluate((input: HTMLInputElement) => input.validity.valid)).toBe(false);
  }
  await email.fill('reader@example.com'); await submit.click();
  expect(requests).toBe(0);
  await expect(publicChoice(page)).not.toBeChecked();
  await expect(publicChoice(page)).not.toHaveAttribute('required');
  await consent(page).check(); await submit.click();
  await expect(page.getByRole('form', { name: 'Verify your tester email' })).toBeVisible();
  await expect(page.getByText("You're on the tester list.", { exact: false })).toHaveCount(0);
  expect(requests).toBe(1);
});

test('Private signup posts only necessary data and only succeeds after verification', async ({ page }) => {
  const submitted: unknown[] = [];
  await page.route(endpoint, route => { const data = route.request().postDataJSON(); submitted.push(data); return route.fulfill({ json: data.action === 'verify' ? verified : challenge }); });
  await page.goto('/dhebevoice/'); await join(page, 'volunteer+test@example.com');
  expect(submitted[0]).toEqual({ email: 'volunteer+test@example.com', consent: true, website: '', public_opt_in: false, display_name: '', public_email: false });
  await expect(page.getByText('stay private; nothing will appear', { exact: false })).toBeVisible();
  await confirm(page);
  await expect(page.locator('.tester-success')).toContainText("Email verified. You're on the tester list.");
  await expect(page.locator('.tester-success')).toContainText('No app invitation has been sent yet.');
  expect(submitted[1]).toEqual({ action: 'verify', request_id: 'a'.repeat(64), code: '12345678' });
  const storage = await page.evaluate(() => JSON.stringify({ local: { ...localStorage }, session: { ...sessionStorage } }));
  expect(storage).not.toMatch(/volunteer|12345678|aaaaaaa/);
});

test('Public name and full email need separate unchecked-by-default choices', async ({ page }) => {
  let submitted: unknown;
  await page.route(endpoint, route => { submitted = route.request().postDataJSON(); return route.fulfill({ json: challenge }); });
  await page.goto('/dhebevoice/');
  await expect(page.getByRole('textbox', { name: 'Public display name' })).toHaveCount(0);
  await publicChoice(page).check();
  const fullEmail = page.getByRole('checkbox', { name: 'I also choose to display my full email' });
  await expect(fullEmail).not.toBeChecked();
  await expect(page.getByText('Anyone, including search engines and spammers', { exact: false })).toBeVisible();
  await page.getByRole('textbox', { name: 'Public display name' }).fill('Example Reader');
  await fullEmail.check();
  await join(page);
  expect(submitted).toEqual({ email: 'reader@example.com', consent: true, website: '', public_opt_in: true, display_name: 'Example Reader', public_email: true });
  await expect(page.getByText('Example Reader and your full email will appear publicly', { exact: false })).toBeVisible();
});

test('Unchecking public listing discards the public name and full-email preference', async ({ page }) => {
  let submitted: unknown;
  await page.route(endpoint, route => { submitted = route.request().postDataJSON(); return route.fulfill({ json: challenge }); });
  await page.goto('/dhebevoice/'); await publicChoice(page).check();
  await page.getByRole('textbox', { name: 'Public display name' }).fill('Example Reader');
  await page.getByRole('checkbox', { name: 'I also choose to display my full email' }).check();
  await publicChoice(page).uncheck(); await join(page);
  expect(submitted).toMatchObject({ public_opt_in: false, display_name: '', public_email: false });
});

test('Signup failure keeps email and consent choices for retry', async ({ page }) => {
  let requests = 0;
  await page.route(endpoint, route => ++requests === 1 ? route.fulfill({ status: 503, json: { detail: 'Please try again later.' } }) : route.fulfill({ json: challenge }));
  await page.goto('/dhebevoice/'); await join(page);
  await expect(page.locator('#early-access').getByRole('alert')).toContainText('Please try again later.');
  await expect(page.getByRole('textbox', { name: 'Your email address' })).toHaveValue('reader@example.com');
  await page.getByRole('button', { name: 'Join the tester list' }).click();
  await expect(page.getByRole('form', { name: 'Verify your tester email' })).toBeVisible();
});

test('Wrong or expired code stays retryable and cannot report signup success', async ({ page }) => {
  let attempts = 0;
  await page.route(endpoint, route => route.request().postDataJSON().action !== 'verify' ? route.fulfill({ json: challenge }) : ++attempts === 1 ? route.fulfill({ status: 400, json: { detail: 'The code is incorrect.' } }) : route.fulfill({ json: verified }));
  await page.goto('/dhebevoice/'); await join(page); await confirm(page);
  await expect(page.locator('#early-access').getByRole('alert')).toContainText('The code is incorrect.');
  await expect(page.locator('.tester-success')).toHaveCount(0);
  await confirm(page); await expect(page.locator('.tester-success')).toBeVisible();
});

test('Verification requires all 8 digits before making a request', async ({ page }) => {
  let attempts = 0;
  await page.route(endpoint, route => { if (route.request().postDataJSON().action === 'verify') attempts++; return route.fulfill({ json: challenge }); });
  await page.goto('/dhebevoice/'); await join(page);
  await page.getByRole('textbox', { name: 'Verification code', exact: true }).fill('123');
  await page.getByRole('button', { name: 'Verify email and join' }).click();
  expect(attempts).toBe(0);
  await expect(page.getByRole('button', { name: 'Resend code in' })).toBeDisabled();
});

for (const bad of [{ unexpected: true }, { request_received: true }]) test('Old or malformed signup response cannot bypass verification: ' + JSON.stringify(bad), async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ json: bad }));
  await page.goto('/dhebevoice/'); await join(page);
  await expect(page.locator('#early-access').getByRole('alert')).toContainText('could not be confirmed');
  await expect(page.locator('.tester-success')).toHaveCount(0);
});

test('Malformed verification response cannot report success', async ({ page }) => {
  await page.route(endpoint, route => route.fulfill({ json: route.request().postDataJSON().action === 'verify' ? { request_received: true } : challenge }));
  await page.goto('/dhebevoice/'); await join(page); await confirm(page);
  await expect(page.locator('#early-access').getByRole('alert')).toContainText('could not be confirmed');
  await expect(page.locator('.tester-success')).toHaveCount(0);
});

test('Changing email clears the challenge and publication choices', async ({ page }) => {
  await page.goto('/dhebevoice/'); await publicChoice(page).check(); await join(page);
  await page.getByRole('button', { name: 'Use a different email' }).click();
  await expect(page.getByRole('textbox', { name: 'Your email address' })).toHaveValue('');
  await expect(publicChoice(page)).not.toBeChecked();
  await expect(page.getByRole('textbox', { name: 'Verification code', exact: true })).toHaveCount(0);
});

test('Successful verification refreshes the public list with chosen name and full email', async ({ page }) => {
  let hasVerified = false;
  await page.route(publicEndpoint, route => route.fulfill({ json: hasVerified ? { ...emptyList, total: 1, testers: [{ ...fixture, email_label: 'reader@example.com', email_visibility: 'full' }] } : emptyList }));
  await page.route(endpoint, route => { const isVerification = route.request().postDataJSON().action === 'verify'; hasVerified ||= isVerification; return route.fulfill({ json: isVerification ? verified : challenge }); });
  await page.goto('/dhebevoice/');
  await expect(page.locator('#tester-list')).toContainText('0 public volunteers');
  await publicChoice(page).check();
  await page.getByRole('textbox', { name: 'Public display name' }).fill('Example Reader');
  await page.getByRole('checkbox', { name: 'I also choose to display my full email' }).check();
  await join(page); await confirm(page);
  await expect(page.locator('#tester-list')).toContainText('1 public volunteer');
  await expect(page.getByRole('list', { name: 'Opted-in verified testers' })).toContainText('Example Reader');
  await expect(page.getByRole('list', { name: 'Opted-in verified testers' })).toContainText('reader@example.com');
});

test('List failures are honest and retryable without fake volunteer entries', async ({ page }) => {
  await page.route(publicEndpoint, route => route.fulfill({ status: 503, json: { detail: 'Unavailable' } }));
  await page.goto('/dhebevoice/');
  await expect(page.locator('#tester-list').getByRole('alert')).toContainText('temporarily unavailable');
  await expect(page.getByRole('list', { name: 'Opted-in verified testers' })).toHaveCount(0);
  await page.route(publicEndpoint, route => route.fulfill({ json: { ...emptyList, total: 1, testers: [fixture] } }));
  await page.getByRole('button', { name: 'Refresh tester list' }).click();
  await expect(page.locator('#tester-list')).toContainText('r***@e***.com');
  await expect(page.locator('#tester-list')).not.toContainText('reader@example.com');
});

test('Malformed public responses cannot accidentally display unmasked private addresses', async ({ page }) => {
  await page.route(publicEndpoint, route => route.fulfill({ json: { ...emptyList, total: 1, testers: [{ ...fixture, email_label: 'private@example.com' }] } }));
  await page.goto('/dhebevoice/');
  await expect(page.locator('#tester-list').getByRole('alert')).toContainText('could not be confirmed');
  await expect(page.locator('#tester-list')).not.toContainText('private@example.com');
});

test('Public list paginates without downloading every tester', async ({ page }) => {
  await page.route(publicEndpoint, route => route.fulfill({ json: { ...emptyList, total: 25, page: Number(new URL(route.request().url()).searchParams.get('page')), testers: [fixture] } }));
  await page.goto('/dhebevoice/');
  await expect(page.getByRole('button', { name: 'Previous page', exact: true })).toBeDisabled();
  await page.getByRole('button', { name: 'Next page', exact: true }).click();
  await expect(page.locator('#tester-list')).toContainText('Page 2 of 2');
  await expect(page.getByRole('button', { name: 'Next page', exact: true })).toBeDisabled();
});

test('Tester consent links to verification, public-choice and retention details', async ({ page }) => {
  await page.goto('/dhebevoice/');
  await expect(consent(page)).toHaveAttribute('aria-describedby', 'tester-privacy');
  await page.getByRole('link', { name: 'Tester signup privacy details' }).click();
  const details = page.locator('#website-testers');
  await expect(page.getByRole('heading', { name: 'Optional Website Tester Signup' })).toBeVisible();
  await expect(details).toContainText('Hostinger Premium');
  await expect(details).toContainText('180 days');
  await expect(details).toContainText('full email');
  await expect(details).toContainText('verification');
  await expect(details.getByRole('link', { name: 'support@dhebe.com' })).toHaveAttribute('href', 'mailto:support@dhebe.com?subject=DhebeVoice%20tester%20list%20removal');
});

for (const width of [360, 390, 768, 1280]) test('Consent, optional public fields, and tester cards fit at ' + width + 'px', async ({ page }, testInfo) => {
  await page.route(publicEndpoint, route => route.fulfill({ json: { ...emptyList, total: 1, testers: [{ ...fixture, display_name: 'Example Volunteer', email_label: 'a'.repeat(64) + '@' + 'b'.repeat(60) + '.example.com', email_visibility: 'full' }] } }));
  await page.setViewportSize({ width, height: 900 }); await page.goto('/dhebevoice/');
  await expect(consent(page)).toBeEnabled();
  await expect(consent(page)).not.toBeChecked();
  await expect(consent(page)).toHaveAttribute('required', '');
  await page.getByRole('textbox', { name: 'Your email address' }).focus();
  await page.keyboard.press('Tab'); await expect(consent(page)).toBeFocused();
  await page.keyboard.press('Tab'); await expect(publicChoice(page)).toBeFocused();
  await publicChoice(page).check();
  await expect(page.getByRole('checkbox', { name: 'I also choose to display my full email' })).not.toBeChecked();
  const layout = await page.locator('.tester-signup form').evaluate(form => ({
    agreementBottom: form.querySelector('.tester-consent')!.getBoundingClientRect().bottom,
    submitTop: form.querySelector('button[type="submit"]')!.getBoundingClientRect().top,
  }));
  expect(layout.agreementBottom).toBeLessThanOrEqual(layout.submitTop);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
  await expect(page.getByRole('list', { name: 'Opted-in verified testers' })).toBeVisible();
  if (width === 390) {
    const decline = page.getByRole('button', { name: 'No thanks', exact: true });
    if (await decline.isVisible()) await decline.click();
    await page.getByRole('heading', { level: 1 }).click();
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath('tester-list-mobile.png'), fullPage: true });
    await page.locator('#tester-list').screenshot({ path: testInfo.outputPath('tester-list-section.png') });
  }
});
