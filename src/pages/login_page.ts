import { Page } from '@playwright/test';
import { Base_page } from './base_page';
import { urls } from '@helpers/env.urls';

export class Login_page {
    // Keeps your preferred composition design pattern intact
    private readonly ui: Base_page;

    constructor(private readonly page: Page) {
        this.ui = new Base_page(page);
    }

    /**
     * Navigates to a specific URL path.
     */
    private async navigateToUrl(targetUrl: string): Promise<void> {
        // 'domcontentloaded' is faster and vastly more resilient than 'networkidle'
        await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
        await this.page.waitForLoadState('networkidle', { timeout: 60000 });

    }

    /**
     * Reusable core input filler shared by both portals
     */
    private async fillCredentialsAndSubmit(username: string, password: string): Promise<void> {
        // Explicit web-first wait happens automatically here inside fillByRole!
        await this.ui.fillByRole('textbox', 'Username', username);
        await this.ui.fillByRole('textbox', 'Password', password);
        await this.ui.clickByRole('button', 'Sign In');
    }
    private async paraCredentialsAndLogin(username: string, password: string): Promise<void> {
        // Explicit web-first wait happens automatically here inside fillByRole!
        await this.ui.fillInputField('username', username);
        await this.ui.fillInputField('password', password);
        await this.ui.clickByRole('button', 'Log In');
    }


    /** Log into the BMW ATS Platform */
    async atsLogin(username: string, password: string): Promise<void> {
        await this.navigateToUrl(urls.parabankURL);
        await this.fillCredentialsAndSubmit(username, password);
    }

    /** Log into the Playground Banking App */
    async playGroundLogin(username: string, password: string): Promise<void> {
        await this.navigateToUrl(urls.playgroundURL);
        await this.fillCredentialsAndSubmit(username, password);
    }
    async paraLogin(username: string, password: string): Promise<void> {
        await this.navigateToUrl(urls.parabankURL);
        await this.paraCredentialsAndLogin(username, password);
    }
}
