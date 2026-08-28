import { test, expect } from '@fixtures/fixtures';
import data from "@test-data/data.json";

// Helper utility to clean currency strings and parse them to numbers
const parseBalance = (text: string): number => parseFloat(text.replace(/[^0-9.-]+/g, ''));

test.describe('Account Management Tests', () => {

    // FIXED: Changed fixture to 'playgroundSession' (aliased as 'ui') because Storage State handles authentication automatically
    test.beforeEach(async ({ playgroundSession: ui }) => {
        await ui.clickByTestId('sidebar-link-accounts');
        // FIXED: Added 'await' and removed the redundant nested 'expect()' wrapper
        await ui.expectVisible('heading', 'My Accounts');
    });

    test('Verify that account balances are non-negative numbers', async ({ playgroundSession: ui }) => {
        // Verify Checking Account Balance
        // FIXED: Switched to your custom clickByTestId wrapper
        await ui.clickByTestId('view-account-btn');

        // Grab the locator through page context since innerText is an evaluation, not an action/assertion
        const checkingBalanceText = await ui['page'].getByTestId('account-detail-balance').innerText();
        const checkingBalance = parseBalance(checkingBalanceText);
        expect(checkingBalance).toBeGreaterThanOrEqual(0);

        // Navigate back to Accounts list
        await ui.clickByRole('link', 'All Accounts');

        // Verify Savings Account Balance
        await ui['page'].getByTestId('view-account-btn').last().click();
        const savingsBalanceText = await ui['page'].getByTestId('account-detail-balance').innerText();
        const savingsBalance = parseBalance(savingsBalanceText);
        expect(savingsBalance).toBeGreaterThanOrEqual(0);
    });

    test('Add new account and delete it after creation', async ({ playgroundSession: ui }) => {
        // Form filling actions
        await ui.clickByRole('button', 'Add Account');
        await ui.fillByRole('textbox', 'Account Name', 'New Savings Account');

        // FIXED: Standardised dropdown/selection clicks using your base class handlers
        await ui.clickByRole('combobox', 'Account Type');
        await ui.clickByRole('option', 'Savings');

        await ui.fillByRole('spinbutton', '0.00', data.validData.amount);

        // FIXED: Switched the raw .check() call to your custom framework wrapper 'setCheckedByRole'
        await ui.setCheckedByRole('checkbox', 'I accept the terms', true);
        await ui.clickByRole('button', 'Add Account');

        // Teardown / Deletion workflow
        await ui.clickByRole('button', 'Delete New Savings Account');
        await ui.clickByRole('button', 'Delete Account');
    });
});

test('Verify Total Balance Display matching individual account sums', async ({ playgroundSession: ui }) => {
    // FIXED: Changed fixture to playgroundSession here as well
    await ui.clickByRole('button', 'Switch to dark mode');
    await ui.expectVisible('button', 'Switch to light mode');

    const netWorthText = await ui['page'].getByTestId('stat-card-net-worth-value').innerText();
    await ui.clickByTestId('sidebar-link-accounts');

    const balanceCells = ui['page'].getByTestId('account-row-balance');
    await balanceCells.first().waitFor({ state: 'visible', timeout: 15000 });

    const count = await balanceCells.count();
    let calculatedSum = 0;

    // Extract values and calculate sum sequentially
    for (let i = 0; i < count; i++) {
        const rowBalanceText = await balanceCells.nth(i).innerText();
        calculatedSum += parseBalance(rowBalanceText);
    }

    expect(calculatedSum).toEqual(parseBalance(netWorthText));
});
