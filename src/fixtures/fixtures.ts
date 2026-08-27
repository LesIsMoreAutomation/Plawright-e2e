import { test as base } from '@playwright/test';
import { Login_page } from '@pages/login_page';
import { Base_page } from '@pages/base_page';

type MyFixtures = {
    loginPageSession: Base_page;
};

export const test = base.extend<MyFixtures>({
    loginPageSession: async ({ page }, use) => {
        const loginPage = new Login_page(page);
        const ui = new Base_page(page);
        await loginPage.loginAsStandardUser();
        await use(ui);
    },
});

export { expect } from '@playwright/test';
