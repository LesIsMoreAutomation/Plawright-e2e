import { test, expect } from '../../helpers/helpers/fixtures';


test.describe('SecureBank - Dashboard', () => {


    test('TC04 - Dashboard summary cards are visible with expected values', async ({ loginPageSession }) => {
        const ui = loginPageSession;

        await ui.expectVisible('heading', 'Welcome back');
        const statCards = ui.getByTestId('dashboard-stat-cards');

        await expect(statCards).toBeVisible();
        await expect(statCards).toContainText('Total Net Worth');
        await expect(statCards).toContainText('Net Change');
        await expect(statCards).toContainText('Income');
        await expect(statCards).toContainText('Expenses');

    });

    test('TC05 - Quick Actions section shows all action cards', async ({ loginPageSession }) => {
        const ui = loginPageSession;
        const quickActionsSection = ui.getByTestId('quick-actions-section');

        await expect(quickActionsSection).toBeVisible();
        await expect(quickActionsSection.getByRole('heading', { name: 'Quick Actions' })).toBeVisible();

        await expect(quickActionsSection).toContainText('Transfer Money');
        await expect(quickActionsSection).toContainText('Send Money');
        await expect(quickActionsSection).toContainText('Pay a Bill');
        await expect(quickActionsSection).toContainText('Apply for Loan');
        await expect(quickActionsSection).toContainText('Transactions');
    });

});
