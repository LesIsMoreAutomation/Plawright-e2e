import { test } from '@fixtures/fixtures';
import data from "../../../test_data/data.json";
import {devices} from "@playwright/test";


test.use({
    ...devices[`Pixel 7`],
    browserName: 'chromium',
});


test('Send money transactional execution workflow', async ({ playgroundSession: ui }) => {

        await ui.expectVisible('heading', 'Welcome back, Alex');

    /**
     * Initiates the money transfer workflow.
     */
        await ui.clickByRole('link', 'Send Money');
        await ui.expectVisible('heading', 'Send Money');

        await ui.clickByTestId('send-from-account-select');
        await ui.clickByRole('option', data.validData.cheque);

        await ui.clickByTestId('payee-select');
        await ui.clickByRole('option', 'Rahul Sharma — Chase Bank');

        await ui.fillInputField('send-amount-input', data.validData.smallAmount);
        await ui.fillInputField('send-note', data.validData.note);
        await ui.clickByTestId('review-send-btn');


    /**
     * Confirms transactional accuracy on the summary screen and submits the form.
     */
        await ui.expectVisible('heading', 'Confirm Send Money');

        // Leverages your custom data-testid string containment assertion wrapper
        await ui.expectVisibleByTestIdToContainText('send-confirm-summary', data.validData.accountName);
        await ui.expectVisibleByTestIdToContainText('send-confirm-summary', data.validData.payeeName);
        await ui.expectVisibleByTestIdToContainText('send-confirm-summary', data.validData.smallAmount);
        await ui.expectVisibleByTestIdToContainText('send-confirm-summary', data.validData.note);

        await ui.clickByRole('button', 'Confirm & Send');

    /**
     * Asserts that the transaction completed successfully and elements are visible.
     */
        await ui.expectVisible('heading', 'Money Sent Successfully');
        await ui.expectVisibleByTestId('send-ref-id');
        await ui.expectVisibleByTestId('send-again-btn');
        await ui.expectVisibleByTestId('back-to-dashboard-btn');

});

