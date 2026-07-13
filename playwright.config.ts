import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env.PORT ?? 3000);
const appUrl = `http://localhost:${port}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never', outputFolder: 'playwright-report' }]]
    : 'list',
  use: {
    baseURL: appUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: {
    command: process.env.CI ? 'pnpm start' : 'pnpm dev',
    url: appUrl,
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    env: {
      PORT: String(port),
      NEXT_PUBLIC_APP_URL: appUrl,
      NEXT_PUBLIC_API_BASE_URL:
        process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3001',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
});
