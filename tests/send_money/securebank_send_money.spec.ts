import { test, expect } from '../../helpers/helpers/fixtures';


test('Testing send money section', async ({ loginPageSession }) => {
    const ui = loginPageSession;
    await ui.clickByTestId('quick-action-send-money');
    await ui.getByRole('heading', 'Send Money').isVisible();

    await ui.clickByTestId('send-from-account-select');
    await expect(ui.getByRole('option', 'Everyday Checking — $' )).toBeVisible();
    await ui.clickByRole('option', 'High-Yield Savings — $' );
    await ui.clickByTestId('payee-select');
    await expect(ui.getByRole('option', 'Rahul Sharma — Chase Bank')).toBeVisible();
    await ui.clickByRole('option', 'Priya Mehta — Bank of America');
    await ui.expectVisibleByTestIdtoContainText('payee-selected-summary', 'Bank of America');
    await ui.clickByTestId('send-amount-input');
    await ui.fillByTestId('send-amount-input', '200');
    await ui.clickByTestId('send-note-input');
    await ui.fillByTestId('send-note-input', 'Car payment');
    await ui.clickByTestId('review-send-btn');

    await ui.expectVisibleByTestId('send-money-confirm-dialog');
    await ui.getByRole('heading', 'Confirm Send Money').isVisible();
    await ui.expectVisibleByTestIdtoContainText('send-confirm-summary', 'High-Yield Savings');
    await ui.expectVisibleByTestIdtoContainText('send-confirm-summary', 'Priya Mehta');
    await ui.expectVisibleByTestIdtoContainText('send-confirm-summary', '$200.00');
    await ui.expectVisibleByTestIdtoContainText('send-confirm-summary', 'Car payment');
    await ui.getByRole('button','Confirm & Send').click();


    await ui.expectVisibleByTestId('send-money-confirm-dialog');
    await ui.expectTextToVisible('Money Sent Successfully');
    await ui.expectTextToVisible('Your payment has been processed.');
    await expect(ui.getByTestId('send-ref-id')).toBeVisible();
    await ui.assertRefNumberContainsTodayDate(ui.getByTestId('send-ref-id'));
    await expect(ui.getByTestId('send-again-btn')).toBeVisible();
    await expect(ui.getByTestId('back-to-dashboard-btn')).toBeVisible();
    await expect(ui.getByTestId('send-confirmation-summary')).toBeVisible();

});