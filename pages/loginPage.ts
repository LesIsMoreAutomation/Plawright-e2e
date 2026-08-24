import { Page, expect } from '@playwright/test';
import { CommonBasePage } from './commonBasePage';
import { urls } from '../helpers/env.urls';

export class LoginPage {
    private readonly ui: CommonBasePage;

    constructor(private readonly page: Page) {
        this.ui = new CommonBasePage(page);
    }

    async goto(): Promise<void> {
        await this.page.goto(urls.baseURL);
        await this.page.waitForLoadState('networkidle',{ timeout: 60000 });
    }

    async login(username: string, password: string): Promise<void> {
        await this.goto();
        await this.ui.fillByRole('textbox', 'Username', username);
        await this.ui.fillByRole('textbox', 'Password', password);
        await this.ui.clickByRole('button', 'Sign In');
    }

    async loginAsStandardUser(): Promise<void> {
        await this.login('standard_user', 'bank_sauce');
        await expect(this.page).toHaveURL(/.*dashboard/, { timeout: 60000 });
    }
}
