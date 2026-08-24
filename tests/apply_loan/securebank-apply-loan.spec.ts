import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/loginPage';
import { CommonLocators } from '../../pages/commonLocators';

test.describe('SecureBank - Apply Loan', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        const ui = new CommonLocators(page);

        await loginPage.loginAsStandardUser();
        await ui.clickByTestId('quick-action-apply-loan');
        await ui.getByRole('heading', 'Apply for a Loan').isVisible();
    });

    test('TC07 - Loan dialog shows required fields and actions', async ({ page }) => {
        const ui = new CommonLocators(page);
        await ui.clickByRole('button', 'Apply for Loan');
        await ui.clickByRole('combobox','Loan Type');
        await ui.getByRole('option', 'Personal').click();
        await ui.fillByRole('spinbutton', 'Loan Amount', '10000');
        await ui.clickByRole("combobox", "Term Length");
        await ui.getByRole('option', '12 months').click();
        await ui.clearByRole('spinbutton','Interest Rate (%)')
        await ui.fillByRole('spinbutton', 'Interest Rate (%)', '5.5');
        await ui.clickByRole('combobox','Disbursement Account');
        await ui.getByRole('option', 'Everyday Checking').click();
        await ui.fillByRole('textbox','What will this loan be used for?', 'Test loan application');
        await ui.getByRole('button', 'Cancel').isVisible();
        await ui.clickByRole('button', 'Review Application');
        expect(ui.expectVisible('heading', 'Confirm Loan Application'));
        // Verify confirmation dialog appears
        const loanConfirmation = ui.getByTestId('loan-confirm-dialog');
        await expect(loanConfirmation).toContainText('Personal');
        await expect(loanConfirmation).toContainText('$10,000.00');
        await expect(loanConfirmation).toContainText('12 months');
        await expect(loanConfirmation).toContainText('5.5%');
        await expect(loanConfirmation).toContainText('Everyday Checking');
        await expect(loanConfirmation).toContainText('Test loan application');
        await ui.getByRole('button', 'Back').isVisible();
        //await ui.clickByRole('button', 'Submit Application');

    });

});
