import {Page, expect, Locator} from '@playwright/test';

/**
 * CommonActions — is a class that makes qa automation tests easier to write and maintain.
 * Here are the common methods that make tests stable and readable.
 */
export class CommonActions {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    // --- 1. Navigations and Reloads ---

    async navigate(url: string) {
        console.log(`Navigating to: ${url}`);
        await this.page.goto(url, { waitUntil: 'networkidle' });
    }

    async reload() {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
    }

    // --- 2. Smart Actions like Click, Type, Checkboxes ---

    async click(locator: string) {
        const element = this.page.locator(locator);
        await expect(element).toBeVisible();
        await element.click();
    }

    async clickByText(text: string) {
        const element = this.page.getByText(text).first();
        await expect(element).toBeVisible();
        await element.click();
    }

    async fillIn(selector: string, text: string) {
        const element = this.page.locator(selector);
        await expect(element).toBeVisible();
        await element.fill('');
        await element.fill(text);
    }

    async setCheckbox(locator: string | Locator, state: boolean) {
        const checkbox = typeof locator === 'string' ? this.page.locator(locator) : locator;
        await expect(checkbox).toBeVisible();
        if ((await checkbox.isChecked()) !== state) {
            await checkbox.setChecked(state);
            console.log(`Checkbox state changed to: ${state}`);
        }
    }

    async selectOptionByValue(selector: string, value: string) {
        const dropdown = this.page.locator(selector);
        await expect(dropdown).toBeVisible();
        await dropdown.selectOption(value);
    }

    async selectOptionByText(selector: string, text: string) {
        const dropdown = this.page.locator(selector);
        await expect(dropdown).toBeVisible();
        await dropdown.selectOption({ label: text });
    }

    async selectOptionByIndex(selector: string, index: number) {
        const dropdown = this.page.locator(selector);
        await expect(dropdown).toBeVisible();
        await dropdown.selectOption({ index });
    }

    async getText(selector: string) {
        const text = this.page.getByText(selector)
        await expect(text).toBeVisible();
        return text;
    }

    async isChecked(selector: string) {
        const checkbox = this.page.locator(selector);
        await expect(checkbox).toBeVisible();
        return checkbox.isChecked();
    }

    // --- 3. Checking Page State ---

    async assertToHaveText(selector: string, expectedText: RegExp | string) {
        await expect(this.page.locator(selector)).toHaveText(expectedText);
    }

    async assertToHaveCount(selector: string, expectedCount: number) {
        await expect(this.page.locator(selector)).toHaveCount(expectedCount);
    }

    async assertToHaveUrl(expectedPart: string) {
        await expect(this.page).toHaveURL(new RegExp(expectedPart));
    }

    async assertToHaveTitle(title: RegExp | string) {
        await expect(this.page).toHaveTitle(title);
    }



    // --- 4. Handling Alerts and Frames ---

    async acceptAlert() {
        this.page.once('dialog', async (dialog) => {
            console.log(`Accepting alert: ${dialog.message()}`);
            await dialog.accept();
        });
    }

    getFrame(selector: string) {
        return this.page.frameLocator(selector);
    }

    // --- 5. Top Level Actions ---

    // wait for an element to be detached from DOM
    async waitForDetached(selector: string) {
        await this.page.locator(selector).waitFor({ state: 'detached', timeout: 10000 });
    }

    async scrollToElement(selector: string) {
        await this.page.locator(selector).scrollIntoViewIfNeeded();
    }

    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `./screenshots/${name}-${Date.now()}.png`, fullPage: true });
    }

    // --- 6. Local Storage ---

    async setToLocalStorage(key: string, value: string) {
        await this.page.evaluate(({ key, value }) => {
            localStorage.setItem(key, value);
        }, { key, value });
    }

    // --- 7. Other ---

    async wait(ms: number) {
        console.warn(`Warning: manual wait for ${ms}ms used.`);
        await this.page.waitForTimeout(ms);
    }
}