import { test as base } from '@playwright/test';
import { Login_page } from '@pages/login_page';
import { Base_page } from '@pages/base_page';

// Declare explicit fixtures for your cross-domain application ecosystems
type MyFixtures = {
    basePage: Base_page;
    playgroundSession: Base_page; // Pre-authenticated Playground app session
    paraSession: Base_page;       // Pre-authenticated ParaBank app session
    atsSession: Base_page;        // Pre-authenticated BMW ATS app session
};

export const test = base.extend<MyFixtures>({
    // Standard unauthenticated base page wrapper
    basePage: async ({ page }, use) => {
        await use(new Base_page(page));
    },

    // 🏦 PLAYGROUND AUTOMATED AUTHENTICATION INJECTION
    playgroundSession: async ({ page }, use) => {
        const loginPage = new Login_page(page);
        const ui = new Base_page(page);

        const username = process.env.PLAYGROUND_USERNAME;
        const password = process.env.PLAYGROUND_PASSWORD;

        if (!username || !password) {
            throw new Error("🚨 Environment Mapping Failure: 'PLAYGROUND_USERNAME' or 'PLAYGROUND_PASSWORD' is not initialized inside your env/cred.env or CI runner profile.");
        }

        await loginPage.playGroundLogin(username, password);
        await use(ui);
    },

    // 🚗 BMW ATS AUTOMATED AUTHENTICATION INJECTION
    atsSession: async ({ page }, use) => {
        const loginPage = new Login_page(page);
        const ui = new Base_page(page);

        const username = process.env.ATS_USERNAME;
        const password = process.env.ATS_PASSWORD;

        if (!username || !password) {
            throw new Error("🚨 Environment Mapping Failure: 'ATS_USERNAME' or 'ATS_PASSWORD' is not initialized inside your env/cred.env or CI runner profile.");
        }

        await loginPage.atsLogin(username, password);
        await use(ui);
    },

    // 🏦 PARABANK AUTOMATED AUTHENTICATION INJECTION
    paraSession: async ({ page }, use) => {
        const loginPage = new Login_page(page);
        const ui = new Base_page(page);

        const username = process.env.PARABANK_USERNAME;
        const password = process.env.PARABANK_PASSWORD;

        if (!username || !password) {
            throw new Error("🚨 Environment Mapping Failure: 'PARABANK_USERNAME' or 'PARABANK_PASSWORD' is not initialized inside your env/cred.env or CI runner profile.");
        }

        await loginPage.paraLogin(username, password);
        await use(ui);
    },
});

export { expect } from '@playwright/test';
