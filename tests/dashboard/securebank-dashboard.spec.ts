import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { CommonLocators } from '../../pages/commonLocators';

test.describe('SecureBank - Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.loginAsStandardUser();
        await expect(page).toHaveURL(/.*dashboard/, { timeout: 30000 });
    });

    test('TC04 - Dashboard summary cards are visible with expected values', async ({ page }) => {
        const ui = new CommonLocators(page);

        await ui.expectVisible('heading', /Welcome back/i);
        const statCards = ui.getByTestId('dashboard-stat-cards');

        await expect(statCards).toBeVisible();
        await expect(statCards).toContainText('Total Net Worth');
        await expect(statCards).toContainText('Net Change');
        await expect(statCards).toContainText('Income');
        await expect(statCards).toContainText('Expenses');

    });

    test('TC05 - Quick Actions section shows all action cards', async ({ page }) => {
        const ui = new CommonLocators(page);
        const quickActionsSection = ui.getByTestId('quick-actions-section');

        await expect(quickActionsSection).toBeVisible();
        await expect(quickActionsSection.getByRole('heading', { name: 'Quick Actions' })).toBeVisible();

        await expect(quickActionsSection).toContainText('Transfer Money');
        await expect(quickActionsSection).toContainText('Send Money');
        await expect(quickActionsSection).toContainText('Pay a Bill');
        await expect(quickActionsSection).toContainText('Apply for Loan');
        await expect(quickActionsSection).toContainText('Transactions');
    });

    test('TC06 - Recent Transactions table displays rows and View all link', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Recent Transactions' })).toBeVisible();
        await expect(page.getByRole('link', { name: /View all/i })).toBeVisible();

        const transactionRows = page.getByRole('row').filter({ hasText: /\d{4}/ });
        await expect(transactionRows).toHaveCount(5);

        await expect(page.getByRole('cell', { name: /Direct Deposit — ACME Corp/i })).toBeVisible();
        await expect(page.getByRole('cell', { name: /Whole Foods Market/i })).toBeVisible();
    });

});
