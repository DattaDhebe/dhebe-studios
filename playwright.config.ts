import { defineConfig } from '@playwright/test';
import { existsSync } from 'node:fs';

const chrome = process.env.CHROME_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe';
export default defineConfig({
  testDir: './tests/browser',
  timeout: 45_000,
  workers: 2,
  use: { baseURL: process.env.TEST_BASE_URL ?? 'http://127.0.0.1:3100', headless: true, launchOptions: existsSync(chrome) ? { executablePath: chrome } : {}, trace: 'retain-on-failure' },
  webServer: process.env.TEST_BASE_URL ? undefined : { command: 'node tests/serve-export.mjs', port: 3100, reuseExistingServer: false },
});
