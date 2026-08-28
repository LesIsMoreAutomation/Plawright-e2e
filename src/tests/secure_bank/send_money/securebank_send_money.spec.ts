import { test, expect } from '@fixtures/fixtures';
import data from "@test-data/data.json";


test('Testing send money section', async ({ playgroundSession: ui }) => {
    await ui.clickByTestId('quick-action-send-money');
    await ui.expectVisible('heading', 'Send Money');

    await ui.clickByTestId('send-from-account-select');
    await ui.expectVisible('option', 'Everyday Checking — $' );
    await ui.clickByRole('option', data.validData.savings );
    await ui.clickByTestId('payee-select');
    await ui.expectVisible('option', 'Rahul Sharma — Chase Bank');
    await ui.clickByRole('option', 'Priya Mehta — Bank of America');
    await ui.expectVisibleByTestIdToContainText('payee-selected-summary', 'Bank of America');
    await ui.clickByTestId('send-amount-input');
    await ui.fillInputField('send-amount-input', data.validData.smallAmount);
    await ui.clickByTestId('send-note-input');
    await ui.fillInputField('send-note-input', 'Car payment');
    await ui.clickByTestId('review-send-btn');

    await ui.expectVisibleByTestId('send-money-confirm-dialog');
    await ui.expectVisible('heading', 'Confirm Send Money');
    await ui.expectVisibleByTestIdToContainText('send-confirm-summary', data.validData.savings);
    await ui.expectVisibleByTestIdToContainText('send-confirm-summary', 'Priya Mehta');
    await ui.expectVisibleByTestIdToContainText('send-confirm-summary', data.validData.smallAmount);
    await ui.expectVisibleByTestIdToContainText('send-confirm-summary', 'Car payment');
    await ui.clickByRole('button','Confirm & Send');


    await ui.expectVisibleByTestId('send-money-confirm-dialog');
    await ui.expectTextToBeVisible('Money Sent Successfully');
    await ui.expectTextToBeVisible('Your payment has been processed.');
    await ui.expectVisibleByTestId('send-ref-id');
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('send-ref-id'));
    await expect(ui.getByTestId('send-again-btn')).toBeVisible();
    await expect(ui.getByTestId('back-to-dashboard-btn')).toBeVisible();
    await expect(ui.getByTestId('send-confirmation-summary')).toBeVisible();

});