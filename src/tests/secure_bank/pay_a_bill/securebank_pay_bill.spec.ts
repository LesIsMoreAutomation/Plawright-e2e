import { test } from '@fixtures/fixtures';
import data from '../../../test_data/data.json'


test('Pay utilities and services @desktop', async ({ loginPageSession: ui }) => {
    await ui.clickByTestId('quick-action-bill-pay')
    await ui.clickByTestId('bill-pay-from-select');
    await ui.clickByRole('option', data.validData.cheque);
    await ui.clickByTestId('biller-search-input');
    await ui.clickByRole('option', 'Metro Water Utility Ref: ACC-');
    await ui.expectVisibleByTestIdtoContainText('biller-selected-summary', 'Metro Water Utility');
    await ui.clickByTestId('bill-amount-input');
    await ui.fillByTestId('bill-amount-input', data.validData.smallAmount);
    await ui.clickByTestId('bill-memo-input');
    await ui.fillByTestId('bill-memo-input', 'Pay bill');
    await ui.clickByTestId('review-bill-btn');

    await ui.expectVisibleByTestIdtoContainText('bill-confirm-summary', 'Everyday Checking');
    await ui.expectVisibleByTestIdtoContainText('bill-confirm-summary', 'Metro Water Utility');
    await ui.expectVisibleByTestIdtoContainText('bill-confirm-summary', '$150.00');
    await ui.getByRole('button', 'Confirm Payment').click();

    await ui.expectTextToVisible('Payment Scheduled');
    await ui.expectTextToVisible('Your bill payment has been submitted.');
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('bill-pay-ref-id'));
    await ui.getByRole('button', 'Pay Another Bill').isVisible();
    await ui.expectVisibleByTestIdtoContainText('confirm-from-account', 'Everyday Checking');
    await ui.expectVisibleByTestIdtoContainText('confirm-biller', 'Metro Water Utility');
    await ui.expectVisibleByTestIdtoContainText('confirm-amount', '$150.00');
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('confirm-payment-date'));

    await ui.clickByRole('button', 'Back to Dashboard');
})