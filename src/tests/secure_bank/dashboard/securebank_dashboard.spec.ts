import { test, expect } from '@fixtures/fixtures';

const DASHBOARD_STAT_LABELS = ['Total Net Worth', 'Net Change', 'Income', 'Expenses'];
const QUICK_ACTION_LABELS = ['Transfer Money', 'Send Money', 'Pay a Bill', 'Apply for Loan', 'Transactions'];

test.describe('SecureBank - Dashboard', () => {


    test('TC04 - Dashboard summary cards are visible with expected values', async ({ playgroundSession: ui }) => {

        await ui.expectVisible('heading', 'Welcome back');
        const statCards = ui.getByTestId('dashboard-stat-cards');

        await expect(statCards).toBeVisible();
        for (const label of DASHBOARD_STAT_LABELS) {
            await ui.expectVisibleByTestIdToContainText('dashboard-stat-cards', label);
        }

    });

    test('TC05 - Quick Actions section shows all action cards', async ({ playgroundSession: ui }) => {
        const quickActionsSection = ui.getByTestId('quick-actions-section');
        await expect(quickActionsSection).toBeVisible();
        await expect(quickActionsSection.getByRole('heading', { name: 'Quick Actions' })).toBeVisible();
        for (const actionLabel of QUICK_ACTION_LABELS) {
            await ui.expectVisibleByTestIdToContainText('quick-actions-section', actionLabel);
        }
    });

});
