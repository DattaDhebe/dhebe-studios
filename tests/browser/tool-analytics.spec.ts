import { test, expect } from '@playwright/test';

test('Opt-in tool funnels exclude draft data and stop immediately on withdrawal', async ({ page, context, baseURL }) => {
  // Serve the test build at the canonical origin while intercepting every Google request.
  // No synthetic analytics events leave this isolated browser context.
  await context.route('https://www.dhebe.com/**', async route => {
    const target = new URL(route.request().url());
    const response = await context.request.get(new URL(target.pathname + target.search, baseURL!).href);
    await route.fulfill({ response });
  });
  await context.route('**/*googletagmanager.com/**', route => route.fulfill({ contentType: 'text/javascript', body: '' }));
  await context.route('**/*google-analytics.com/**', route => route.abort());
  await page.goto('https://www.dhebe.com/json-formatter/?secret=private-draft#private-fragment');
  await expect(page.locator('#google-analytics')).toHaveCount(0);
  await page.getByRole('button', { name: 'Allow analytics', exact: true }).click();
  await expect(page.locator('#google-analytics')).toHaveCount(1);
  await page.getByLabel('JSON input').fill('{"private@example.com":}');
  await page.getByRole('button', { name: 'Validate and format JSON' }).click();
  await expect(page.locator('.utility-error[role=alert]')).toBeVisible();
  await page.getByLabel('JSON input').fill('{"email":"private@example.com","file":"private.pdf"}');
  await page.getByRole('button', { name: 'Validate and format JSON' }).click();
  await expect(page.getByRole('button', { name: 'Download JSON' })).toBeVisible();
  const pending = page.waitForEvent('download'); await page.getByRole('button', { name: 'Download JSON' }).click(); await pending;
  const events = await page.evaluate(() => (window as Window & { dataLayer?: unknown[][] }).dataLayer!.filter(event => event[0] === 'event'));
  expect(events.filter(event => event[1] === 'tool_start')).toHaveLength(2);
  expect(events.filter(event => event[1] === 'tool_success')).toHaveLength(1);
  expect(events.filter(event => event[1] === 'tool_error')).toHaveLength(1);
  expect(events.find(event => event[1] === 'tool_download')?.[2]).toEqual({ file_type: 'json', tool_id: 'json-formatter' });
  expect(JSON.stringify(events)).not.toMatch(/private|secret|filename|email/);
  await page.getByRole('button', { name: 'Cookie preferences', exact: true }).click(); await page.getByRole('button', { name: 'No thanks', exact: true }).click();
  const count = await page.evaluate(() => (window as Window & { dataLayer?: unknown[] }).dataLayer!.length);
  await page.getByRole('button', { name: 'Validate and format JSON' }).click();
  expect(await page.evaluate(() => (window as Window & { dataLayer?: unknown[] }).dataLayer!.length)).toBe(count);
});
