import {Page, Locator, expect} from '@playwright/test';

type AriaRole = Parameters<Page['getByRole']>[0];

export class Base_page {
    constructor(private readonly page: Page) {}

    // ── Locator factory ──────────────────────────────────────────────────────

    /** Returns a locator for any ARIA role + accessible name. */
    getByRole(role: AriaRole, name: string | RegExp): Locator {
        return this.page.getByRole(role, { name });
    }

    /** Returns a locator by data-testid. */
    getByTestId(testId: string): Locator {
        return this.page.getByTestId(testId);
    }
    getByPlaceholder(testId: string): Locator {
        return this.page.getByPlaceholder(testId);
    }
    getByLabel(testId: string): Locator {
        return this.page.getByLabel(testId);

    }

    // ── Actions ──────────────────────────────────────────────────────────────

    /** Fills a text input / textarea found by role and accessible name. */
    async fillByRole(role: AriaRole, name: string | RegExp, value: string): Promise<void> {
        await this.getByRole(role, name).fill(value);
    }

    async fillByTestId(sendAmountInput: string, s: string) {
        await this.getByTestId(sendAmountInput).fill(s);
    }
    async inputFieldLocator(locator: string, text: string) {
        let element: Locator;

        if (locator === 'textbox') {
            element = this.page.getByRole('textbox').last();
        } else {
            // Try locating by id, name, or placeholder in order of priority
            const strategies = [
                this.page.locator(`[id="${locator}"]`).last(),
                this.page.locator(`[name="${locator}"]`).last(),
                this.page.locator(`[placeholder="${locator}"]`).last(),
            ];

            for (const strategy of strategies) {
                if (await strategy.isVisible({ timeout: 5000 })) {
                    element = strategy;
                    break;
                }
            }
        }

        if (!element) {
            throw new Error(
                `inputFieldLocator: No visible element found for locator "${locator}"`
            );
        }

        await element.waitFor({ state: 'visible', timeout: 15000 });
        await element.fill(text,{ timeout: 15000 });
    }

    /** Clicks any element found by role and accessible name. */
    async clickByRole(role: AriaRole, name: string | RegExp): Promise<void> {
        await this.getByRole(role, name).last().click();
    }

    /** Clicks an element by data-testid. */
    async clickByTestId(testId: string): Promise<void> {
        await this.getByTestId(testId).click();
    }

    public async elementSelectorAndClick(selector: string) {
        await this.page.locator(selector).last().click({
            force: true,});
    }

    public async clickIcon(value: string): Promise<void> {
        const selectors = [
            `dsmp-widget-store [data-id="${value}"]`,
            `[class="panel-layout"] [role="button"] [data-id="${value}"]`,
            `[disclosureicon="${value}"]`,
            `.ds-list-item [data-id="${value}"]`,
            `[role="button"] [data-id="${value}"]`,
            `[role="gridcell"] [data-id="${value}"]`,
            `[icon="${value}"]`,
            `[data-id="${value}"]` // fallback
        ];

        const timeout = 2000;

        // Try each selector in order until one is found
        for (const selector of selectors) {
            try {
                const locator = this.page.locator(selector).last();

                // Check visibility with timeout only for non-fallback selectors
                const isVisible = await locator.isVisible({
                    timeout: selector === selectors[selectors.length - 1] ? 0 : timeout
                });

                if (isVisible) {
                    await this.elementSelectorAndClick(selector);
                    return;
                }
            } catch (error) {
            }
        }
        await this.elementSelectorAndClick(selectors[selectors.length - 1]);
    }

    /** Asserts that an element found by data-testid is visible. */
    async expectVisibleByTestId(testId: string): Promise<void> {
        await this.getByTestId(testId).waitFor({ state: 'visible' });
    }

    /** Asserts that an element found by data-testid is hidden / not present. */
    async expectHiddenByTestId(testId: string): Promise<void> {
        await this.getByTestId(testId).waitFor({ state: 'hidden' });
    }

    /** Returns the inner text of an element found by data-testid. */
    async getTextByTestId(testId: string): Promise<string> {
        return this.getByTestId(testId).innerText();
    }

    /** Types into an element character by character (useful for autocomplete). */
    async typeByRole(role: AriaRole, name: string | RegExp, value: string): Promise<void> {
        await this.getByRole(role, name).pressSequentially(value);
    }

    /** Selects an option inside a <select> element found by role and name. */
    async selectByRole(role: AriaRole, name: string | RegExp, option: string): Promise<void> {
        await this.getByRole(role, name).selectOption(option);
    }

    /** Checks or unchecks a checkbox / radio found by role and accessible name. */
    async setCheckedByRole(
        role: AriaRole,
        name: string | RegExp,
        checked: boolean
    ): Promise<void> {
        const locator = this.getByRole(role, name);
        checked ? await locator.check() : await locator.uncheck();
    }

    /** Clears the value of an input found by role and accessible name. */
    async clearByRole(role: AriaRole, name: string | RegExp): Promise<void> {
        await this.getByRole(role, name).clear();
    }

    // ── Assertions ───────────────────────────────────────────────────────────

    /** Asserts that an element found by role and name is visible. */
    async expectVisible(role: AriaRole, name: string | RegExp): Promise<void> {
        await this.getByRole(role, name).waitFor({ state: 'visible' });
    }

    /** Asserts that an element found by role and name is hidden / not present. */
    async expectHidden(role: AriaRole, name: string | RegExp): Promise<void> {
        await this.getByRole(role, name).waitFor({ state: 'hidden' });
    }

    /** Returns the inner text of an element found by role and accessible name. */
    async getTextByRole(role: AriaRole, name: string | RegExp): Promise<string> {
        return this.getByRole(role, name).innerText();
    }


    async expectVisibleByTestIdtoContainText(assertion : string, text: string) {
        await expect(this.getByTestId(assertion)).toContainText(text);

   }

   async expectTextToVisible(assertion: string) {
        await expect(this.page.getByText(assertion,{exact: true})).toBeVisible();
    }

    private getTodayAsCompactDate(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}${month}${day}`;
    }

    private getTodayAsDashedDate(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    private getTodayAsUsShortDate(): string {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        }).format(new Date());
    }

    private escapeRegExp(value: string): string {
        return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    async assertRefNumberContainsTodayDate(refIdLocator: Locator): Promise<void> {
        const todayDate = this.getTodayAsCompactDate();
        const todayDashedDate = this.getTodayAsDashedDate();
        const todayUsShortDate = this.getTodayAsUsShortDate();

        // Accept YYYYMMDD, YYYY-MM-DD, and UI month-name format (e.g., "Aug 24, 2026").
        const acceptedDatePattern = [todayDate, todayDashedDate, todayUsShortDate]
            .map((dateText) => this.escapeRegExp(dateText))
            .join('|');

        await expect(refIdLocator).toContainText(new RegExp(`(?:${acceptedDatePattern})`));
    }
     async keyboardPress(key: string) {
        await this.page.keyboard.press(key);
    }

     async keyboardType(key: string) {
        await this.page.keyboard.type(key);
    }
}
