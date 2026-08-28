import { Page, Locator, expect } from '@playwright/test';

type AriaRole = Parameters<Page['getByRole']>[0];

export class Base_page {
    // Making it protected allows inheriting page objects to access 'this.page' directly for edge-case scripts
    constructor(protected readonly page: Page) {}

    // ── Actions & Shared Inputs ──────────────────────────────────────────────

    /**
     * Highly reusable input-filler that matches across multiple strategic attributes instantly.
     */
    async fillInputField(selector: string, text: string): Promise<void> {
        const combinedSelector = `[id="${selector}"], [data-testid="${selector}"], [name="${selector}"], [placeholder="${selector}"]`;
        await this.page.locator(combinedSelector).last().fill(text);
    }

    async clickByTestId(testId: string): Promise<void> {
        await this.getByTestId(testId).last().click();
    }

    getByTestId(testId: string): Locator { return this.page.getByTestId(testId); }


    /**
     * Optimised Icon Clicker. Uses standard CSS grouping to prevent slow sequential 'isVisible' loops.
     */
    async clickIcon(value: string): Promise<void> {
        const structuralSelectors = [
            `dsmp-widget-store [data-id="${value}"]`,
            `[class="panel-layout"] [role="button"] [data-id="${value}"]`,
            `[disclosureicon="${value}"]`,
            `.ds-list-item [data-id="${value}"]`,
            `[role="button"] [data-id="${value}"]`,
            `[role="gridcell"] [data-id="${value}"]`,
            `[icon="${value}"]`,
            `[data-id="${value}"]`
        ];

        // Combines selectors with commas so the browser parses them all instantly in parallel
        const groupedSelector = structuralSelectors.join(', ');
        await this.page.locator(groupedSelector).last().click({ force: true });
    }

    /** Fills a text input / textarea found by role and accessible name. */
    async fillByRole(role: AriaRole, name: string | RegExp, value: string): Promise<void> {
        const locator = this.page.getByRole(role, { name });
        await locator.clear();
        await locator.fill(value);
    }

    async pressKeyboardAction(key: string): Promise<void> {
        await this.page.keyboard.press(key);
    }
    async keyboardTypeText(text: string): Promise<void> {
        await this.page.keyboard.type(text);
    }
    public async elementSelectorAndClick(selector: string) {
        await this.page.locator(selector).last().click({
            force: true,});
    }

    /** Clicks any element found by role and accessible name. */
    async clickByRole(role: AriaRole, name: string | RegExp): Promise<void> {
        await this.page.getByRole(role, { name }).last().click();
    }

    /** Types into an element character by character (useful for autocomplete fields). */
    async typeByRole(role: AriaRole, name: string | RegExp, value: string): Promise<void> {
        await this.page.getByRole(role, { name }).pressSequentially(value);
    }


    /** Selects an option inside a <select> element found by role and name. */
    async selectByRole(role: AriaRole, name: string | RegExp, option: string): Promise<void> {
        await this.page.getByRole(role, { name }).selectOption(option);
    }
    async selectOption(locator: string, option: string): Promise<void> {
        await this.page.locator(locator).selectOption(option);
    }

    /** Checks or unchecks a checkbox / radio found by role and accessible name. */
    async setCheckedByRole(role: AriaRole, name: string | RegExp, checked: boolean): Promise<void> {
        const locator = this.page.getByRole(role, { name });
        checked ? await locator.check() : await locator.uncheck();
    }

    /**
     * Asserts whether a radio button or checkbox found by role and name is checked.
     * @param role - The ARIA role (e.g., 'radio', 'checkbox')
     * @param name - The accessible text or layout name of the element
     * @param checked - The expected state (defaults to true)
     */
    async expectRoleToBeChecked(
        role: AriaRole,
        name: string | RegExp,
        checked: boolean = true
    ): Promise<void> {
        const locator = this.page.getByRole(role, { name });
        if (checked) {
            await expect(locator).toBeChecked();
        } else {
            await expect(locator).not.toBeChecked();
        }
    }


    // ── Assertions (Web-First Web Drivers) ──────────────────────────────────

    /** Asserts that an element found by role and name is visible with clean failure logging. */
    async expectVisible(role: AriaRole, name: string | RegExp): Promise<void> {
        await expect(this.page.getByRole(role, { name })).toBeVisible();
    }

    /** Asserts that an element found by role and name is hidden / not present. */
    async expectHidden(role: AriaRole, name: string | RegExp): Promise<void> {
        await expect(this.page.getByRole(role, { name })).toBeHidden();
    }

    /** Asserts that an element found by data-testid is visible. */
    async expectVisibleByTestId(testId: string): Promise<void> {
        await expect(this.page.getByTestId(testId)).toBeVisible();
    }

    /** Asserts that an element found by data-testid is hidden / not present. */
    async expectHiddenByTestId(testId: string): Promise<void> {
        await expect(this.page.getByTestId(testId)).toBeHidden();
    }

    /** Asserts that an element found by test ID contains a specific substring. */
    async expectVisibleByTestIdToContainText(testId: string, text: string): Promise<void> {
        await expect(this.page.getByTestId(testId)).toContainText(text);
    }

    /** Asserts that an exact text string is visible anywhere on screen. */
    async expectTextToBeVisible(text: string): Promise<void> {
        await expect(this.page.getByText(text, { exact: true })).toBeVisible();
    }

    /** Dynamically validates that a reference label contains today's current date format layout. */
    async assertRefNumberContainsTodayDate(refIdLocator: Locator): Promise<void> {
        const today = new Date();

        const compactDate = today.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
        const dashedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
        const usShortDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(today); // e.g. "Aug 27, 2026"

        const acceptedDatePattern = [compactDate, dashedDate, usShortDate]
            .map((dateText) => dateText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
            .join('|');

        await expect(refIdLocator).toContainText(new RegExp(`(?:${acceptedDatePattern})`));
    }
}
