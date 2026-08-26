import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), 'env', 'e2e.env') });

const runtimeEnv = (process.env.ENV ?? 'qa').toLowerCase();

if (runtimeEnv !== 'qa' && runtimeEnv !== 'int') {
  throw new Error(`Invalid ENV "${runtimeEnv}". Use ENV=qa or ENV=int.`);
}

const baseURL = `https://www.${runtimeEnv}playground.com/bank`;

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

type BrowserTarget = 'chromium' | 'chrome' | 'msedge' | 'firefox' | 'webkit';
const browserTarget = (process.env.PLAYWRIGHT_BROWSER_CHANNEL ?? 'chromium').toLowerCase();
if (!['chromium', 'chrome', 'msedge', 'firefox', 'webkit'].includes(browserTarget)) {
  throw new Error(
    `Invalid PLAYWRIGHT_BROWSER_CHANNEL "${browserTarget}". Use chromium, chrome, msedge, firefox, or webkit.`
  );
}

export const urls = { baseURL } as const;
export const runtime = {
  retries,
  headless,
  browserTarget: browserTarget as BrowserTarget,
} as const;