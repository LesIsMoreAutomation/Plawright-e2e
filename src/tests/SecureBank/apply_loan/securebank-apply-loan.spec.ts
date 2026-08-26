import { test, expect } from '@fixtures/fixtures';
// Import the test data directly from the new data layer
import data from '@test-data/loanData.json'

test.describe('SecureBank - Apply Loan', () => {

    test('TC07 - Loan dialog shows required fields and actions', async ({ loginPageSession: ui }) => {
        // Reference our static JSON dataset directly

        // 1. Open the Loan Dialog
        await ui.clickByTestId('quick-action-apply-loan');
        await ui.expectVisible('heading', 'Apply for a Loan');

        // 2. Fill out Loan Details Form using data file
        await ui.clickByRole('button', 'Apply for Loan');
        await ui.clickByRole('combobox', 'Loan Type');
        await ui.clickByRole('option', 'Personal');

        await ui.fillByRole('spinbutton', 'Loan Amount', data.validData.amount);
        await ui.clickByRole('combobox', 'Term Length');
        await ui.clickByRole('option', data.validData.term);

        await ui.clearByRole('spinbutton', 'Interest Rate (%)');
        await ui.fillByRole('spinbutton', 'Interest Rate (%)', data.validData.rate);

        await ui.clickByRole('combobox', 'Disbursement Account');
        await ui.clickByRole('option', data.validData.cheque);

        await ui.fillByRole('textbox', 'What will this loan be used for?', data.validData.purpose);
        await ui.expectVisible('button', 'Cancel');

        // 3. Move to Review State
        await ui.clickByRole('button', 'Review Application');
        await ui.expectVisible('heading', 'Confirm Loan Application');

        // 4. Verify Confirmation Dialog Data Structure
        const loanConfirmation = ui.getByTestId('loan-confirm-dialog');
        await expect(loanConfirmation).toContainText(
            new RegExp(`Personal.*${data.validData.formattedAmount.replace('$', '\\$')}.*${data.validData.term}.*${data.validData.rate}%.*${data.validData.cheque}.*${data.validData.purpose}`)
        );

        await ui.expectVisible('button', 'Back');
    });
});
