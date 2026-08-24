import { Page, expect } from '@playwright/test';
import { CommonLocators } from './commonLocators';
import { urls } from '../helpers/env.urls';

export class LoginPage {
    private readonly ui: CommonLocators;

    constructor(private readonly page: Page) {
        this.ui = new CommonLocators(page);
    }

    async goto(): Promise<void> {
        await this.page.goto(urls.baseURL);
    }

    async login(username: string, password: string): Promise<void> {
        await this.goto();
        await this.ui.fillByRole('textbox', 'Username', username);
        await this.ui.fillByRole('textbox', 'Password', password);
        await this.ui.clickByRole('button', 'Sign In');
    }

    async loginAsStandardUser(): Promise<void> {
        await this.login('standard_user', 'bank_sauce');
        await expect(this.page).toHaveURL(/.*dashboard/, { timeout: 30000 });
    }
}
