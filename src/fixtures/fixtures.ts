import { test as base } from '@playwright/test';
import { Login_page } from '@pages/login_page';
import { Base_page } from '@pages/base_page';

// 1. Declare explicit fixtures for both ecosystems
type MyFixtures = {
    basePage: Base_page;
    playgroundSession: Base_page; // Automatically logs into the Playground app
    paraSession: Base_page; // Automatically logs into the ParaBank app
    atsSession: Base_page; // Automatically logs into the BMW ATS app
};

export const test = base.extend<MyFixtures>({
    // Standard unauthenticated base page wrapper
    basePage: async ({ page }, use) => {
        await use(new Base_page(page));
    },

    playgroundSession: async ({ page }, use) => {
        const loginPage = new Login_page(page);
        const ui = new Base_page(page);

        // Triggers the playground credentials rou/tine before passing the session to the test
        await loginPage.playGroundLogin('standard_user', 'bank_sauce');
        await use(ui);
    },

    atsSession: async ({ page }, use) => {
        const loginPage = new Login_page(page);
        const ui = new Base_page(page);

        // Triggers the ATS platform credentials routine before passing the session to the test
        await loginPage.atsLogin('ats_standard_user', 'ats_secure_password');
        await use(ui);
    },

    paraSession: async ({ page }, use) => {
        const loginPage = new Login_page(page);
        const ui = new Base_page(page);

        // Triggers the ParaBank platform credentials routine before passing the session to the test
        await loginPage.paraLogin('lesIsMoreTest', 'Para@Test');
        await use(ui);
    },
});

export { expect } from '@playwright/test';
