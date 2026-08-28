import * as dotenv from 'dotenv';
import * as path from 'path';

// 1. Load framework behavioral controls
dotenv.config({ path: path.resolve(process.cwd(), 'env', 'e2e.env') });

// 2. NEW: Force load your isolated credentials mapping file into process.env
dotenv.config({ path: path.resolve(process.cwd(), 'env', 'cred.env') });

const runtimeEnv = (process.env.ENV ?? 'qa').toLowerCase();

if (runtimeEnv !== 'qa' && runtimeEnv !== 'int') {
  throw new Error(`Invalid ENV "${runtimeEnv}". Use ENV=qa or ENV=int.`);
}

// Dynamic Domain Applications Endpoints
const playgroundURL = `https://www.${runtimeEnv}playground.com/bank`;
const atsURL = `https://${runtimeEnv}.ats.dev.azure.bmw.cloud`;

// FIXED: Consolidated ParaBank target endpoint environment matrix mapping
const parabankURL = `https://${runtimeEnv}.parasoft.com/parabank`;

const retriesRaw = process.env.PLAYWRIGHT_RETRIES ?? '0';
const retries = Number(retriesRaw);
if (!Number.isInteger(retries) || retries < 0) {
  throw new Error(`Invalid PLAYWRIGHT_RETRIES "${retriesRaw}". Use a non-negative integer.`);
}

const headlessRaw = (process.env.PLAYWRIGHT_HEADLESS ?? 'true').toLowerCase();
if (headlessRaw !== 'true' && headlessRaw !== 'false') {
  throw new Error(`Invalid PLAYWRIGHT_HEADLESS "${headlessRaw}". Use true or false.`);
}
const headless = headlessRaw === 'true';

const parallelRaw = (process.env.PLAYWRIGHT_FULLY_PARALLEL ?? 'false').toLowerCase();
if (parallelRaw !== 'true' && parallelRaw !== 'false') {
  throw new Error(`Invalid PLAYWRIGHT_FULLY_PARALLEL "${parallelRaw}". Use true or false.`);
}
const fullyParallel = parallelRaw === 'true';

type BrowserTarget = 'chromium' | 'chrome' | 'msedge' | 'firefox' | 'webkit';
const browserTarget = (process.env.PLAYWRIGHT_BROWSER_CHANNEL ?? 'chromium').toLowerCase();
if (!['chromium', 'chrome', 'msedge', 'firefox', 'webkit'].includes(browserTarget)) {
  throw new Error(
      `Invalid PLAYWRIGHT_BROWSER_CHANNEL "${browserTarget}". Use chromium, chrome, msedge, firefox, or webkit.`
  );
}

export const urls = {
  playgroundURL,
  atsURL,
  parabankURL
} as const;

export const runtime = {
  retries,
  headless,
  fullyParallel,
  browserTarget: browserTarget as BrowserTarget,
} as const;
