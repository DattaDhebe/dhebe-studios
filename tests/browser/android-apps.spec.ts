import { test, expect } from '@playwright/test';

const apps = [{ id: 'rivetprep', name: 'RivetPrep', icon: '/rivetprep-app-icon-v3.webp', packageName: 'com.rivetprep.app' }, { id: 'rostercairn', name: 'RosterCairn', icon: '/rostercairn-app-icon-v3.svg', packageName: 'com.dhebe.rostercairn' }];
const challenge = { request_received: true, verification_required: true, request_id: 'a'.repeat(64), expires_in: 600, resend_after: 60 };
const empty = { testers: [], total: 0, page: 0, page_size: 24 };

test.beforeEach(async ({ page }) => {
  await page.route(/\/api\/(dhebevoice|rivetprep|rostercairn)-testers\.php\?/, route => route.fulfill({ json: empty }));
  await page.route(/\/api\/(dhebevoice|rivetprep|rostercairn)-signup\.php$/, route => route.fulfill({ json: route.request().postDataJSON().action === 'verify' ? { request_received: true, verified: true } : challenge }));
});

for (const app of apps) {
  test(`${app.name}: homepage and navigation use the current public brand`, async ({ page }) => {
    await page.goto('/');
    const section = page.locator('#android-apps');
    await expect(section.getByRole('heading', { name: app.name, exact: true })).toBeVisible();
    const card = section.locator('.android-app-card').filter({ hasText: app.name });
    await expect(card.locator('.android-app-card-summary')).toHaveAttribute('href', '/apps/' + app.id + '/#early-access');
    await expect(card.getByRole('link', { name: 'Join test on Google Play for ' + app.name, exact: true })).toHaveAttribute('href', 'https://play.google.com/apps/testing/' + app.packageName);
    await expect(card.getByRole('link', { name: 'Install from Play Store for ' + app.name, exact: true })).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=' + app.packageName);
    await expect(card.locator('a a')).toHaveCount(0);
    await expect(card.getByRole('link', { name: 'Not invited? Request access', exact: true })).toHaveAttribute('href', '/apps/' + app.id + '/#tester-signup');
    await expect(card.getByRole('img')).toHaveAttribute('src', app.icon);
    await expect(card.getByRole('img')).toHaveJSProperty('naturalWidth', app.id === 'rivetprep' ? 256 : 512);
    await card.locator('.android-app-card-summary').click();
    await expect(page).toHaveURL(/#early-access$/);
    await expect(page.locator('#early-access .app-play-actions')).toHaveCount(1);
    await expect(page.locator('#early-access')).toHaveCount(1);
    await expect(page.locator('#tester-signup')).toHaveCount(1);
    await page.getByRole('link', { name: 'Request an invitation', exact: true }).click();
    await expect(page).toHaveURL(/#tester-signup$/);
    await expect(page.getByRole('link', { name: 'Join test on Google Play for ' + app.name, exact: true })).toHaveAttribute('href', 'https://play.google.com/apps/testing/' + app.packageName);
    await expect(page.getByRole('link', { name: 'Install from Play Store for ' + app.name, exact: true })).toHaveAttribute('href', 'https://play.google.com/store/apps/details?id=' + app.packageName);
    await expect(page.locator('.app-play-note')).toContainText('same account');
    await expect(page.getByRole('form', { name: app.name + ' early-access signup', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(app.name);
    await expect(page.locator('.voice-identity img')).toHaveAttribute('src', app.icon);
    await expect(page.locator('.voice-identity img')).toHaveJSProperty('complete', true);
    const schema = await page.locator('script[id="' + app.id + '-structured-data"]').evaluate(element => JSON.parse(element.textContent || '{}'));
    expect(schema.image).toBe('https://www.dhebe.com' + app.icon);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://www.dhebe.com/apps/${app.id}/`);
    await expect(page.locator('body')).not.toContainText('Shift Ledger');
    await expect(page.getByRole('link', { name: 'Android apps', exact: true })).toHaveAttribute('href', '/#android-apps');
  });

  test(`${app.name}: validated signup and verification stay on the correct endpoint`, async ({ page }) => {
    const submitted: object[] = [];
    await page.route(`**/api/${app.id}-signup.php`, route => { const data = route.request().postDataJSON(); submitted.push(data); return route.fulfill({ json: data.action === 'verify' ? { request_received: true, verified: true } : challenge }); });
    await page.goto(`/apps/${app.id}/`);
    const form = page.getByRole('form', { name: app.name + ' early-access signup' });
    const email = form.getByRole('textbox', { name: 'Your email address' });
    await email.fill('bad-email'); await form.getByRole('button', { name: 'Join the tester list' }).click();
    expect(submitted).toHaveLength(0);
    await email.fill('reader@example.com'); await form.getByRole('button', { name: 'Join the tester list' }).click();
    expect(submitted).toHaveLength(0);
    await expect(form.getByRole('checkbox', { name: 'Optional: include me' })).not.toBeChecked();
    await form.getByRole('checkbox', { name: `I volunteer to test ${app.name}` }).check();
    await form.getByRole('button', { name: 'Join the tester list' }).click();
    await expect(page.getByRole('form', { name: 'Verify your tester email', exact: true })).toBeVisible();
    expect(submitted[0]).toEqual({ email: 'reader@example.com', consent: true, website: '', public_opt_in: false, display_name: '', public_email: false });
    await expect(page.getByRole('note')).toContainText(`Verify your ${app.name} tester email`);
    await expect(page.locator('.tester-success')).toHaveCount(0);
    await page.getByRole('textbox', { name: 'Verification code', exact: true }).fill('12345678');
    await page.getByRole('button', { name: 'Verify email and join' }).click();
    await expect(page.locator('.tester-success')).toContainText("Email verified. You're on the tester list.");
    expect(submitted[1]).toEqual({ action: 'verify', request_id: 'a'.repeat(64), code: '12345678' });
    expect(await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }))).not.toMatch(/reader@example|12345678|aaaaaaa/);
  });

  test(`${app.name}: public names and full email remain separate explicit choices`, async ({ page }) => {
    let verified = false;
    let signup: Record<string, unknown> | undefined;
    await page.route(`**/api/${app.id}-testers.php?*`, route => route.fulfill({ json: verified ? { ...empty, total: 1, testers: [{ id: 'b'.repeat(32), email_label: 'reader@example.com', email_visibility: 'full', display_name: 'Example Volunteer', joined_on: '2026-10-22' }] } : empty }));
    await page.route(`**/api/${app.id}-signup.php`, route => { const data = route.request().postDataJSON(); if (data.action === 'verify') verified = true; else signup = data; return route.fulfill({ json: verified ? { request_received: true, verified: true } : challenge }); });
    await page.goto(`/apps/${app.id}/`);
    await page.getByRole('textbox', { name: 'Your email address' }).fill('reader@example.com');
    await page.getByRole('checkbox', { name: `I volunteer to test ${app.name}` }).check();
    await page.getByRole('checkbox', { name: 'Optional: include me' }).check();
    const full = page.getByRole('checkbox', { name: 'I also choose to display my full email' });
    await expect(full).not.toBeChecked();
    await expect(page.getByText('Anyone, including search engines and spammers', { exact: false })).toBeVisible();
    await page.getByRole('textbox', { name: 'Public display name' }).fill('Example Volunteer');
    await full.check(); await page.getByRole('button', { name: 'Join the tester list' }).click();
    await expect(page.getByRole('form', { name: 'Verify your tester email', exact: true })).toBeVisible();
    expect(signup).toMatchObject({ public_opt_in: true, display_name: 'Example Volunteer', public_email: true });
    await expect(page.locator('#tester-list')).not.toContainText('reader@example.com');
    await page.getByRole('textbox', { name: 'Verification code', exact: true }).fill('12345678');
    await page.getByRole('button', { name: 'Verify email and join' }).click();
    await expect(page.locator('#tester-list')).toContainText('Example Volunteer');
    await expect(page.locator('#tester-list')).toContainText('reader@example.com');
  });

  test(`${app.name}: switching apps clears pending verification and consent`, async ({ page }) => {
    const other = apps.find(item => item.id !== app.id)!;
    await page.goto(`/apps/${app.id}/`);
    await page.getByRole('textbox', { name: 'Your email address' }).fill('reader@example.com');
    await page.getByRole('checkbox', { name: `I volunteer to test ${app.name}` }).check();
    await page.getByRole('button', { name: 'Join the tester list' }).click();
    await expect(page.getByRole('textbox', { name: 'Verification code', exact: true })).toBeVisible();
    await page.locator('footer').getByRole('link', { name: other.name, exact: true }).click();
    await expect(page.getByRole('textbox', { name: 'Your email address' })).toHaveValue('');
    await expect(page.getByRole('checkbox', { name: `I volunteer to test ${other.name}` })).not.toBeChecked();
    await expect(page.getByRole('textbox', { name: 'Verification code', exact: true })).toHaveCount(0);
    await expect(page.getByRole('note')).toContainText(`Verify your ${other.name} tester email`);
  });

  test(`${app.name}: verification refreshes even while an older list request is pending`, async ({ page }) => {
    let listRequests = 0;
    let releaseOldRequest: (() => Promise<void>) | undefined;
    await page.route(`**/api/${app.id}-testers.php?*`, route => {
      if (++listRequests === 1) { releaseOldRequest = async () => { await route.fulfill({ json: empty }).catch(() => {}); }; return; }
      return route.fulfill({ json: { ...empty, total: 1, testers: [{ id: 'c'.repeat(32), email_label: 'r***@e***.com', email_visibility: 'masked', display_name: '', joined_on: '2026-10-22' }] } });
    });
    await page.goto(`/apps/${app.id}/`);
    await expect(page.locator('#tester-list')).toContainText('Loading volunteers');
    await page.getByRole('textbox', { name: 'Your email address' }).fill('reader@example.com');
    await page.getByRole('checkbox', { name: `I volunteer to test ${app.name}` }).check();
    await page.getByRole('checkbox', { name: 'Optional: include me' }).check();
    await page.getByRole('button', { name: 'Join the tester list' }).click();
    await page.getByRole('textbox', { name: 'Verification code', exact: true }).fill('12345678');
    await page.getByRole('button', { name: 'Verify email and join' }).click();
    await expect(page.locator('#tester-list')).toContainText('1 public volunteer');
    await releaseOldRequest?.();
    await expect(page.locator('#tester-list')).toContainText('r***@e***.com');
  });

  test(`${app.name}: tester privacy is app-specific and separate from the app policy`, async ({ page }) => {
    await page.goto(`/apps/${app.id}/`);
    await page.getByRole('link', { name: 'Tester signup privacy details', exact: true }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(app.name);
    await expect(page.locator('#website-testers')).toContainText('separate private database');
    await expect(page.locator('article')).toContainText('180 days');
    await expect(page.locator('article')).toContainText('unchecked by default');
    await expect(page.locator('article')).toContainText('Hostinger Premium');
  });

  for (const width of [360, 1280]) test(`${app.name}: layout fits ${width}px`, async ({ page }, testInfo) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`/apps/${app.id}/`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('checkbox', { name: `I volunteer to test ${app.name}` })).not.toBeChecked();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    await page.getByRole('checkbox', { name: 'Optional: include me' }).check();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width + 1);
    if (width === 360) await page.screenshot({ path: testInfo.outputPath(app.id + '-mobile.png'), fullPage: true });
  });
}
