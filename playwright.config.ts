import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  forbidOnly: Boolean(process.env.CI),
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  reporter: [['list']],
  retries: process.env.CI ? 2 : 0,
  testDir: 'e2e',
  use: {
    baseURL: 'http://127.0.0.1:4200',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'pnpm exec ng serve --host 127.0.0.1 --port 4200',
    timeout: 120_000,
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env.CI,
  },
  workers: process.env.CI ? 1 : undefined,
});
