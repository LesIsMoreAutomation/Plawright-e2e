import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/loginPage';
import { CommonBasePage } from '@pages/commonBasePage';

type MyFixtures = {
    loginPageSession: CommonBasePage;
};

export const test = base.extend<MyFixtures>({
    loginPageSession: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        const ui = new CommonBasePage(page);
        await loginPage.loginAsStandardUser();
        await use(ui);
    },
});

export { expect } from '@playwright/test';
