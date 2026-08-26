import { test } from '@fixtures/fixtures';
import { BankPage } from '@pages/BankPage.';
import data from "@test-data/loanData.json";
import {devices} from "@playwright/test";

// Playwright will execute this exact test 3 times automatically
// (once for iPhone, once for Android, once for MatePad)
test.use({
    ...devices[`Pixel 7`],
    browserName: 'chromium',
});


test('Send money transactional execution workflow', async ({ loginPageSession, page }) => {
    const bankPage = new BankPage(page);

    // 1. Verify dashboard landing state
    await bankPage.verifyDashboardLanding();

    // 2. Perform the transactional workflow
    await bankPage.initiateTransfer(data.validData.amount, data.validData.note);
    await bankPage.verifySummaryAndSubmit(
        data.validData.accountName,
        data.validData.payeeName,
        data.validData.formattedAmount,
        data.validData.note
    );

    // 3. Confirm completion
    await bankPage.verifySuccessState();
});

