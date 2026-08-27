import { Page, expect } from '@playwright/test';
import { Base_page } from './base_page';
import { urls } from '@helpers/env.urls';

export class Login_page {
    private readonly ui: Base_page;

    constructor(private readonly page: Page) {
        this.ui = new Base_page(page);
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
