import { type Page } from '@playwright/test';
import { Base_page } from './base_page';
import data from "../test_data/data.json"; // Adjust this import path as necessary

export class Bank_page extends Base_page {
    constructor(page: Page) {
        // Pass the Playwright page instance to the parent Base_page constructor
        super(page);
    }

    async verifyDashboardLanding() {
        await this.expectVisible('heading', 'Welcome back, Alex');
    }

    /**
     * Initiates the money transfer workflow.
     */
    async initiateTransfer(amount: string, note: string) {
        await this.clickByRole('link', 'Send Money');
        await this.expectVisible('heading', 'Send Money');

        await this.clickByTestId('send-from-account-select');
        await this.clickByRole('option', data.validData.cheque);

        await this.clickByTestId('payee-select');
        await this.clickByRole('option', 'Rahul Sharma — Chase Bank');

        await this.fillByTestId('send-amount-input', data.validData.smallAmount);
        await this.fillByTestId('send-note-input', note);
        await this.clickByTestId('review-send-btn');
    }

    /**
     * Confirms transactional accuracy on the summary screen and submits the form.
     */
    async verifySummaryAndSubmit(account: string, payee: string, amount: string, note: string) {
        await this.expectVisible('heading', 'Confirm Send Money');

        // Leverages your custom data-testid string containment assertion wrapper
        await this.expectVisibleByTestIdtoContainText('send-confirm-summary', account);
        await this.expectVisibleByTestIdtoContainText('send-confirm-summary', payee);
        await this.expectVisibleByTestIdtoContainText('send-confirm-summary', data.validData.smallAmount);
        await this.expectVisibleByTestIdtoContainText('send-confirm-summary', note);

        await this.clickByRole('button', 'Confirm & Send');
    }

    /**
     * Asserts that the transaction completed successfully and elements are visible.
     */
    async verifySuccessState() {
        await this.expectVisible('heading', 'Money Sent Successfully');
        await this.expectVisibleByTestId('send-ref-id');
        await this.expectVisibleByTestId('send-again-btn');
        await this.expectVisibleByTestId('back-to-dashboard-btn');
    }
}
