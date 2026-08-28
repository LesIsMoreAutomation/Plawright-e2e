import { test } from '@fixtures/fixtures';
import data from "@test-data/data.json";


test('Pay utilities and services @desktop', async ({ playgroundSession: ui }) => {

    await ui.clickByTestId('quick-action-bill-pay')
    await ui.clickByTestId('bill-pay-from-select');
    await ui.clickByRole('option', data.validData.cheque);
    await ui.clickByTestId('biller-search-input');
    await ui.clickByRole('option', 'Metro Water Utility Ref: ACC-');
    await ui.expectVisibleByTestIdToContainText('biller-selected-summary', 'Metro Water Utility');
    await ui.clickByTestId('bill-amount-input');
    await ui.fillInputField('bill-amount-input', data.validData.smallAmount);
    await ui.clickByTestId('bill-memo-input');
    await ui.fillInputField('bill-memo-input', 'Pay bill');
    await ui.clickByTestId('review-bill-btn');

    await ui.expectVisibleByTestIdToContainText('bill-confirm-summary', 'Everyday Checking');
    await ui.expectVisibleByTestIdToContainText('bill-confirm-summary', 'Metro Water Utility');
    await ui.expectVisibleByTestIdToContainText('bill-confirm-summary', '$150.00');
    await ui.clickByRole('button', 'Confirm Payment');
    await ui.expectTextToBeVisible('Payment Scheduled');
    await ui.expectTextToBeVisible('Your bill payment has been submitted.');
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('bill-pay-ref-id'));
    await ui.expectVisible('button', 'Pay Another Bill');
    await ui.expectVisibleByTestIdToContainText('confirm-from-account', 'Everyday Checking');
    await ui.expectVisibleByTestIdToContainText('confirm-biller', 'Metro Water Utility');
    await ui.expectVisibleByTestIdToContainText('confirm-amount', '$150.00');
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('confirm-payment-date'));

    await ui.clickByRole('button', 'Back to Dashboard');
})