import { defineConfig, devices } from '@playwright/test';
import { runtime, urls } from './helpers/env.urls';

const projects = (() => {
  if (runtime.browserTarget === 'chromium') {
    return [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }];
  }
  if (runtime.browserTarget === 'chrome') {
    return [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }];
  }
  if (runtime.browserTarget === 'msedge') {
    return [{ name: 'msedge', use: { ...devices['Desktop Edge'], channel: 'msedge' } }];
  }
  if (runtime.browserTarget === 'firefox') {
    return [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }];
  }
  return [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }];
})();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  globalTimeout: 60 * 60 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: false,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : runtime.retries,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['list', { printSteps: true, outputFile: 'test-results/output.txt' }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    // Added Monocart Reporter configuration below
    ['monocart-reporter', {
      name: 'Automation Execution Report',
      outputFile: './monocart-report/report.html'
    }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: urls.baseURL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Capture screenshot only on test failure. */
    screenshot: 'only-on-failure',

    /* Record video only on test failure. */
    video: 'retain-on-failure',
    headless: runtime.headless,
  },

  /* Configure projects for major browsers */
  projects,

  /* Test against mobile viewports. */
  // {
  //   name: 'Mobile Chrome',
  //   use: { ...devices['Pixel 5'] },
  // },
  // {
  //   name: 'Mobile Safari',
  //   use: { ...devices['iPhone 12'] },
  // },

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: !process.env.CI,
  // },
});
