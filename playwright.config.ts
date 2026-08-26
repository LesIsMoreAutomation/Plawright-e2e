import { defineConfig, devices } from '@playwright/test';
import { runtime, urls } from '@helpers/env.urls';

const projects = (() => {
  const browserTarget = String(runtime.browserTarget).toLowerCase();

  // // If a specific mobile device targeting logic is needed, intercept it here
  // if (browserTarget === 'iphone14pro' || browserTarget === 'iphone14') {
  //   return [{ name: 'iphone14pro', use: { ...devices['iPhone 14 Pro'] } }];
  // }
  // if (browserTarget === 'android' || browserTarget === 'android') {
  //   return [{ name: 'android', use: { ...devices['Pixel 7'] } }];
  // }

  if (browserTarget === 'chromium') {
    return [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }];
  }
  if (browserTarget === 'chrome') {
    return [{ name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }];
  }
  if (browserTarget === 'msedge') {
    return [{ name: 'msedge', use: { ...devices['Desktop Edge'], channel: 'msedge' } }];
  }
  if (browserTarget === 'firefox') {
    return [{ name: 'firefox', use: { ...devices['Desktop Firefox'] } }];
  }
  return [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }];
})();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: 'src/tests',
  /* Directory where screenshots, traces, and videos will be saved under test-case names */
  outputDir: 'test-results',
  timeout: 60 * 1000,
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
    // FIX: Removed 'outputFile' as the native 'list' reporter prints strictly to stdout and does not support file output
    ['list', { printSteps: true }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    // Monocart Reporter configuration
    ['monocart-reporter', {
      name: 'Automation Execution Report',
      outputFile: './monocart-report/report.html',
    }]
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('')`. */
    baseURL: urls.baseURL,

    /* Limit each Playwright action to 2500ms. */
    actionTimeout: 2500,
    navigationTimeout: 30000,
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
});
