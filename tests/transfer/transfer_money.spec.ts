import { test, expect } from '../../helpers/helpers/fixtures';

test('Testing transfer money section', async ({ loginPageSession }) => {
    const ui = loginPageSession;

    await ui.clickByTestId('sidebar-link-transfer'); // Click th
    await ui.getByRole('heading', 'Transfer Money').isVisible();

    // 2. Select originating account
    await ui.clickByTestId('transfer-from-select');
    await expect(ui.getByRole('option', 'Everyday Checking — $' )).toBeVisible();
    await ui.clickByRole('option', 'High-Yield Savings — $' );

    // 3. Select destination account
    await ui.clickByTestId('transfer-to-select'); // 'Select account' dropdown under From Account
    await ui.clickByRole('option', 'Everyday Checking — $' );

    // 4. Enter amount and optional memo details
    await ui.fillByTestId('transfer-amount-input', '500'); // Fills the Amount field ($ 0.00)

    await ui.fillByRole('textbox', 'e.g. Rent, vacation fund…','Moving savings to checking'); // Fills Memo (optional)

    // 5. Select Transfer Date (Defaults to Today radio button)
    await expect(ui.getByRole('radio', 'Today')).toBeChecked();

    await ui.clickByTestId('review-transfer-btn'); // Clicks 'Review Transfer' button

    await ui.expectVisibleByTestId('transfer-confirm-dialog');
    await ui.getByRole('heading', 'Confirm Transfer').isVisible();
    await ui.expectVisibleByTestIdtoContainText('transfer-confirm-summary', 'High-Yield Savings');
    await ui.expectVisibleByTestIdtoContainText('transfer-confirm-summary', 'Everyday Checking');
    await ui.expectVisibleByTestIdtoContainText('transfer-confirm-summary', '$500.00');
    await ui.expectVisibleByTestIdtoContainText('transfer-confirm-summary', 'Moving savings to checking');
    await ui.getByRole('button', 'Confirm Transfer').click();

    await ui.expectTextToVisible('Transfer Successful');
    await ui.expectTextToVisible('Your funds have been moved.');

    // Validate Reference ID and Date structure (TXN-20260824-8299)
    await expect(ui.getByTestId('transfer-ref-id')).toBeVisible();
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('transfer-ref-id'));

    // Validate the complete summary grid block
    await ui.expectVisibleByTestIdtoContainText('confirm-from-account', 'High-Yield Savings');
    await ui.expectVisibleByTestIdtoContainText('confirm-to-account', 'Everyday Checking');
    await ui.expectVisibleByTestIdtoContainText('confirm-amount', '$500.00');
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('confirm-date'));
    await ui.expectVisibleByTestIdtoContainText('confirm-memo', 'Moving savings to checking');

    // Verify Action Buttons match layout
    await expect(ui.getByRole('button', 'Make Another Transfer')).toBeVisible();
    await ui.clickByRole('button', 'Back to Dashboard');
});
