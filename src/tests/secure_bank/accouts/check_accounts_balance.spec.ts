import { test, expect } from '@fixtures/fixtures';
import testData from '../../../test_data/data.json'



// Helper utility to clean currency strings and parse them to numbers
const parseBalance = (text: string): number => parseFloat(text.replace(/[^0-9.-]+/g, ''));

test.describe('Account Management Tests', () => {

    test.beforeEach(async ({ loginPageSession }) => {
        await loginPageSession.clickByTestId('sidebar-link-accounts');
        await expect(loginPageSession.getByRole('heading', 'My Accounts')).toBeVisible();
    });

    test('Verify that account balances are non-negative numbers', async ({ loginPageSession: ui }) => {
        // Verify Checking Account Balance
        await ui.getByTestId('view-account-btn').first().click();
        const checkingBalance = parseBalance(await ui.getByTestId('account-detail-balance').innerText());
        expect(checkingBalance).toBeGreaterThanOrEqual(0);

        // Navigate back to Accounts list
        await ui.clickByRole('link', 'All Accounts');

        // Verify Savings Account Balance
        await ui.getByTestId('view-account-btn').last().click();
        const savingsBalance = parseBalance(await ui.getByTestId('account-detail-balance').innerText());
        expect(savingsBalance).toBeGreaterThanOrEqual(0);
    });

    test('Add new account and delete it after creation', async ({ loginPageSession: ui }) => {
        // Form filling actions
        await ui.clickByRole('button', 'Add Account');
        await ui.fillByRole('textbox', 'Account Name', 'New Savings Account');
        await ui.clickByRole('combobox', 'Account Type');
        await ui.clickByRole('option', 'Savings');
        await ui.fillByRole('spinbutton', '0.00', testData.validData.amount);
        await ui.getByTestId('account-form-accept-terms-checkbox').check();
        await ui.clickByRole('button', 'Add Account');

        // Teardown / Deletion workflow
        await ui.clickByRole('button', 'Delete New Savings Account');
        await ui.clickByRole('button', 'Delete Account');
    });
});

test('Verify Total Balance Display matching individual account sums', async ({ loginPageSession: ui }) => {

    await ui.clickByRole('button', 'Switch to dark mode');
    await ui.expectVisible('button', 'Switch to light mode');
    const netWorthText = await ui.getByTestId('stat-card-net-worth-value').innerText();
    await ui.clickByTestId('sidebar-link-accounts'); // Ensure we are on the accounts overview page
    const balanceCells = ui.getByTestId('account-row-balance');

    await balanceCells.first().waitFor({ state: 'visible', timeout: 15000 });


    const count = await balanceCells.count();
    let calculatedSum = 0;

    // Extract values and calculate sum
    for (let i = 0; i < count; i++) {
        const rowBalanceText = await balanceCells.nth(i).innerText();
        calculatedSum += parseBalance(rowBalanceText);
    }

    expect(calculatedSum).toEqual(parseBalance(netWorthText));
});
