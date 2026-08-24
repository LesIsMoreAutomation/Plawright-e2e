import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { CommonLocators } from '../../pages/commonLocators';

// Define page object variables in the file scope so both tests can read them
let loginPage: LoginPage;
let ui: CommonLocators;

test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    ui = new CommonLocators(page);
    await loginPage.loginAsStandardUser();
    await ui.clickByTestId('sidebar-link-accounts'); // Clicks the active 'Accounts' menu option
    await expect(ui.getByRole('heading', 'My Accounts' )).toBeVisible();
});

test('Verify that account balances are non-negative numbers', async () => {

    await ui.getByTestId('view-account-btn').first().click();
    const checkingBalanceText = await ui.getByTestId('account-detail-balance').innerText();
    const checkingBalance = parseFloat(checkingBalanceText.replace(/[^0-9.-]+/g, ''));
    expect(checkingBalance).toBeGreaterThanOrEqual(0);

    await ui.clickByRole('link','All Accounts'); // Navigate back to Accounts page

    await ui.getByTestId('view-account-btn').last().click();
    const savingsBalanceText = await ui.getByTestId('account-detail-balance').innerText();
    const savingsBalance = parseFloat(savingsBalanceText.replace(/[^0-9.-]+/g, ''));
    expect(savingsBalance).toBeGreaterThanOrEqual(0);
});

test('Add Account new account and delete it after creation', async () => {
    await ui.getByRole('button', 'Add Account' ).click();
    await ui.fillByRole('textbox', 'Account Name', 'New Savings Account');
    await ui.getByRole('combobox', 'Account Type').click();
    await ui.getByRole('option', 'Savings').click();
    await ui.fillByRole('spinbutton', '0.00', '5000');
    await ui.getByTestId('account-form-accept-terms-checkbox').check();
    await ui.clickByRole('button', 'Add Account');
    await ui.clickByRole('button', 'Delete New Savings Account');
    await ui.clickByRole('button', 'Delete Account');
});
