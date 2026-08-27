import { test } from '@fixtures/fixtures';
import { Bank_page } from '@pages/bank_page.';
import data from "../../../test_data/data.json";
import {devices} from "@playwright/test";

// Playwright will execute this exact test 3 times automatically
// (once for iPhone, once for Android, once for MatePad)
test.use({
    ...devices[`Pixel 7`],
    browserName: 'chromium',
});


test('Send money transactional execution workflow', async ({ page }) => {
    const bankPage = new Bank_page(page);

    // Verify dashboard landing state
    await bankPage.verifyDashboardLanding();

    // Perform the transactional workflow
    await bankPage.initiateTransfer(data.validData.amount, data.validData.note);
    await bankPage.verifySummaryAndSubmit(
        data.validData.accountName,
        data.validData.payeeName,
        data.validData.formattedAmount,
        data.validData.note
    );

    // Confirm completion
    await bankPage.verifySuccessState();
});

