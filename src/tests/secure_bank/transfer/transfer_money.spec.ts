import { test, expect } from '@fixtures/fixtures';
import data from "@test-data/data.json";


test('Testing transfer money section', async ({ playgroundSession: ui }) => {

    await ui.clickByTestId('sidebar-link-transfer'); // Click th
    await ui.expectVisible('heading', 'Transfer Money');

    // Select originating account
    await ui.clickByTestId('transfer-from-select');
    await ui.expectVisible('option', 'Everyday Checking — $' );
    await ui.clickByRole('option', data.validData.savings );

    // Select destination account
    await ui.clickByTestId('transfer-to-select'); // 'Select account' dropdown under From Account
    await ui.clickByRole('option', 'Everyday Checking — $' );

    // Enter amount and optional memo details
    await ui.fillInputField('transfer-amount-input', '500'); // Fills the Amount field ($ 0.00)

    await ui.fillByRole('textbox', 'e.g. Rent, vacation fund…','Moving savings to checking'); // Fills Memo (optional)

    // Select Transfer Date (Defaults to Today radio button)
    await ui.expectRoleToBeChecked('radio', 'Today', true);

    await ui.clickByTestId('review-transfer-btn'); // Clicks 'Review Transfer' button

    await ui.expectVisibleByTestId('transfer-confirm-dialog');
    await ui.expectVisible('heading', 'Confirm Transfer');
    await ui.expectVisibleByTestIdToContainText('transfer-confirm-summary', data.validData.savings);
    await ui.expectVisibleByTestIdToContainText('transfer-confirm-summary', 'Everyday Checking');
    await ui.expectVisibleByTestIdToContainText('transfer-confirm-summary', '$500.00');
    await ui.expectVisibleByTestIdToContainText('transfer-confirm-summary', 'Moving savings to checking');
    await ui.clickByRole('button', 'Confirm Transfer');

    await ui.expectTextToBeVisible('Transfer Successful');
    await ui.expectTextToBeVisible('Your funds have been moved.');

    // Validate Reference ID and Date structure (TXN-20260824-8299)
    await expect(ui.getByTestId('transfer-ref-id')).toBeVisible();
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('transfer-ref-id'));

    // Validate the complete summary grid block
    await ui.expectVisibleByTestIdToContainText('confirm-from-account', data.validData.savings);
    await ui.expectVisibleByTestIdToContainText('confirm-to-account', 'Everyday Checking');
    await ui.expectVisibleByTestIdToContainText('confirm-amount', '$500.00');
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('confirm-date'));
    await ui.expectVisibleByTestIdToContainText('confirm-memo', 'Moving savings to checking');

    // Verify Action Buttons match layout
    await ui.expectVisible('button', 'Make Another Transfer');
    await ui.clickByRole('button', 'Back to Dashboard');
});
