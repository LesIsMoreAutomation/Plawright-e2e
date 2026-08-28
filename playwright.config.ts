import { defineConfig, devices } from '@playwright/test';
import { runtime } from '@helpers/env.urls';

const projects = (() => {
  const browserTarget = String(runtime.browserTarget).toLowerCase();

  // Unified dynamic selection supporting both standard desktop engines and specific mobile profiles
  if (browserTarget === 'iphone14pro' || browserTarget === 'iphone14') {
    return [{ name: 'iphone14', use: { ...devices['iPhone 14'] } }];
  }
  if (browserTarget === 'pixel7' || browserTarget === 'android') {
    return [{ name: 'pixel7', use: { ...devices['Pixel 7'] } }];
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
  if (browserTarget === 'webkit') {
    return [{ name: 'webkit', use: { ...devices['Desktop Safari'] } }]; // FIXED: Removed trailing trailing syntax slash syntax error
  }

  // Default fallback engine
  return [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }];
})();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: 'src/tests',
  outputDir: 'test-results',
  timeout: 60 * 1000,
  globalTimeout: 60 * 60 * 1000,

  // Natively links parallel scaling behavior to your environment parameters
  fullyParallel: runtime.fullyParallel,

  // Controlling thread allocation. Enforces 1 serial worker if either running on CI or if fullyParallel is disabled locally.
  workers: process.env.CI || !runtime.fullyParallel ? 1 : undefined,

  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,

  /* Retry on CI default rules or fall back to your custom runtime environment adjustments */
  retries: process.env.CI ? 2 : runtime.retries,

  /* Reporter configuration. Optimized to prevent terminal flooding on CI runners. See https://playwright.dev/docs/test-reporters */
  reporter: [
    // FIXED: Dynamically switches to a clean GitHub Actions or concise 'dot' reporter on CI to prevent bloated log history logs
    process.env.CI ? ['github'] : ['list', { printSteps: true }],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['monocart-reporter', {
      name: 'Automation Execution Report',
      outputFile: './monocart-report/report.html',
    }]
  ],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 2500,
    navigationTimeout: 30000,

    // Configures automated asset traces to track script failures for the Trace Viewer utility
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    headless: runtime.headless,
  },

  /* Configure projects for major browsers or emulators */
  projects,
});
