import {Page, expect, Locator, FrameLocator} from '@playwright/test';
import {Logger} from "./logger";


/**
 * CommonActions — is a class that makes qa automation tests easier to write and maintain.
 * Here are the common methods that make tests stable and readable.
 */
export class CommonActions {
    protected pageName: string = "Page Name"
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        this.pageName = this.constructor.name.replace(/([A-Z])/g, ' $1').trim();
    }

    private async getScreenshotMessage(selector: string, status: 'SUCCESS' | 'FAIL'): Promise<string> {
        let screenshotMsg = "";
        if (status === 'FAIL') {
            try {
                const locator = this.page.locator(selector);
                if (await locator.count() > 0) {
                    await locator.evaluate(el => {
                        el.style.outline = '5px solid red';
                        el.style.outlineOffset = '2px';
                        el.style.backgroundColor = 'rgba(255, 0, 0, 0.1)';
                    });
                }
            } catch (e) {

            }
            const screenshotName = `FAIL_${this.pageName}_${selector.replace(/[^a-z0-9]/gi, '_')}`;
            await this.takeScreenshot(screenshotName);
            screenshotMsg = `\n   Screenshot: ./screenshots/${screenshotName}-...png`;
            return screenshotMsg;
        }
    }

    private async logActionResult(status: 'SUCCESS' | 'FAIL', selector: string, expected: any, actual: any, type: 'ACTION' | 'ASSERTION' = 'ASSERTION') {
        const screenshotMsg = await this.getScreenshotMessage(selector, status);

        const green = "\x1b[32m";
        const red = "\x1b[31m";
        const yellow = "\x1b[33m";
        const reset = "\x1b[0m";

        const color = status === 'SUCCESS' ? green : red;
        const icon = status === 'SUCCESS' ? '✅' : '❌';

        console.log(`\n${color}--------------------------------------------------`);
        console.log(`${icon} [${status}] ${type}`);
        console.log(`   Page:     ${this.pageName}`);
        console.log(`   Selector: ${selector}`);

        if (expected !== undefined) console.log(`   Expected: ${expected}`);
        if (actual !== undefined)   console.log(`   Actual:   ${actual}`);
        if (screenshotMsg)          console.log(screenshotMsg);
        console.log(`--------------------------------------------------${reset}\n`);
    }

    // --- 1. Navigations and Reloads ---

    async navigate(url: string) {
        try {
            const response = await this.page.goto(url, { waitUntil: 'networkidle' });

            if (!response || !response.ok()) {
                const status = response ? response.status() : 'No Response';
                throw new Error(`Failed to navigate to ${url}. Status: ${status}`)
            }

            await this.logActionResult('SUCCESS', 'Navigation', undefined, `Mapsd to: ${url} and Response is: ${response.status()}`, 'ACTION');

        } catch (error) {
            await this.logActionResult('FAIL', 'Navigation', url, error.message, 'ACTION');
            throw error;
        }
    }

    async reload() {
        try {
            await this.page.reload({ waitUntil: 'networkidle' });
            console.log(`${this.pageName} reloaded successfully`);
        } catch (error) {
            console.error(`${this.pageName} reload failed: ${error.message}`);
            throw error;
        }
    }

    // --- 2. Smart Actions like Click, Type, Checkboxes ---

    async click(selector: string) {
        const locator = this.page.locator(selector);

        try {
            await expect(locator).toBeVisible();
            await locator.click();
            await this.logActionResult('SUCCESS', selector, undefined, "Clicked successfully", 'ACTION');
        } catch (error) {
            await this.logActionResult('FAIL', selector, "Visible & Clickable", "Timeout/Not found", 'ACTION');
            throw error;
        }
    }

    async rightClick(selector: string) {
        const locator = this.page.locator(selector);
        try {
            await expect(locator).toBeVisible();
            await locator.click({ button: 'right' }); // Вот магическая кнопка
            await this.logActionResult('SUCCESS', selector, undefined, "Right clicked successfully", 'ACTION');
        } catch (error) {
            await this.logActionResult('FAIL', selector, "Visible & Right-Clickable", "Timeout/Not found", 'ACTION');
            throw error;
        }
    }

    async clickByText(text: string) {
        const element = this.page.getByText(text).first();

        try {
            await expect(element).toBeVisible();
            await element.click();
            await this.logActionResult('SUCCESS', text, undefined, "Clicked successfully", 'ACTION');
        } catch (error) {
            await this.logActionResult('FAIL', text, "Visible & Clickable", "Timeout/Not found", 'ACTION');
            throw error;
        }
    }

    async fillIn(selector: string, text: string) {
        const element = this.page.locator(selector);

        try {
            await expect(element).toBeVisible();
            await element.fill('');
            await element.fill(text);
            await this.logActionResult('SUCCESS', selector, undefined, `Filled with: "${text}"`, 'ACTION');
        } catch (error) {
            await this.logActionResult('FAIL', selector, `Value: ${text}`, "Field not interactable", 'ACTION');
            throw error;
        }
    }

    async getElementCount(selector: string): Promise<number> {
        return await this.page.locator(selector).count();
    }

    async checkCheckbox(locator: string, index: number = 0) {
        const checkbox = this.page.locator(locator).nth(index);

        try {
            await expect(checkbox).toBeVisible();

            if (await checkbox.isChecked()) {
                await checkbox.uncheck();
                await checkbox.setChecked(false);
                await this.logActionResult('SUCCESS', checkbox.toString(), false, "Checkbox unchecked", 'ACTION');
            } else {
                await checkbox.check();
                await checkbox.setChecked(true);
                await this.logActionResult('SUCCESS', checkbox.toString(), true, "Checkbox checked", 'ACTION');
            }

        } catch (error) {
            await this.logActionResult('FAIL', checkbox.toString(), null, "Checkbox not found", 'ACTION');
            throw error;
        }
    }

    async selectOptionByValue(selector: string, value: string) {
        const dropdown = this.page.locator(selector);

        try {
            await expect(dropdown).toBeVisible();
            await dropdown.selectOption(value);
            await this.logActionResult('SUCCESS', selector, value, "Selected successfully", 'ACTION');
        } catch (error) {
            await this.logActionResult('FAIL', selector, value, "Not found", 'ACTION');
            throw error;
        }
    }

    async selectOptionByText(selector: string, text: string) {
        const dropdown = this.page.locator(selector);

        try {
            await expect(dropdown).toBeVisible();
            await dropdown.selectOption({ label: text });
            await this.logActionResult('SUCCESS', selector, text, "Selected successfully", 'ACTION');
        } catch (error) {
            await this.logActionResult('FAIL', selector, text, "Not found", 'ACTION');
            throw error;
        }
    }

    async selectOptionByIndex(selector: string, index: number) {
        const dropdown = this.page.locator(selector);

        try {
            await expect(dropdown).toBeVisible();
            await dropdown.selectOption({ index });
            await this.logActionResult('SUCCESS', selector, index, "Selected successfully", 'ACTION');
        } catch (error) {
            await this.logActionResult('FAIL', selector, index, "Not found", 'ACTION');
            throw error;
        }
    }

    async getText(selector: string): Promise<string> {
        const element = this.page.locator(selector)

        try {
            await expect(element).toBeVisible();
            await this.logActionResult('SUCCESS', selector, undefined, "Text found", 'ACTION');
            return await element.innerText();
        } catch (error) {
            await this.logActionResult('FAIL', selector, undefined, "Text not found", 'ACTION');
            throw error;
        }
    }

    // --- 3. Checking Page State ---

    async assertToContainText(selector: string, expectedText: RegExp | string) {
        const locator = this.page.locator(selector);

        try {
            await expect(locator).toBeVisible();
            await expect(locator).toContainText(expectedText, { timeout: 5000 });
            const actual = await locator.innerText();
            await this.logActionResult('SUCCESS', selector, expectedText, actual);

        } catch (error) {
            const actual = await locator.innerText().catch(() => "ELEMENT_NOT_FOUND");
            await this.logActionResult('FAIL', selector, expectedText, actual, 'ASSERTION');
            throw error;

        }
    }

    async assertToHaveCount(selector: string, expectedCount: number) {
        const locator = this.page.locator(selector);

        try {
            await expect(locator).toHaveCount(expectedCount);
            await this.logActionResult('SUCCESS', selector, expectedCount, await locator.count(), 'ASSERTION');
        } catch (error) {
            await this.logActionResult('FAIL', selector, expectedCount, await locator.count(), 'ASSERTION');
            throw error;
        }
    }

    async assertToHaveUrl(expectedPart: string) {
        try {
            await expect(this.page).toHaveURL(new RegExp(expectedPart));
            await this.logActionResult('SUCCESS', 'URL', expectedPart, this.page.url(), 'ASSERTION');
        } catch (error) {
            await this.logActionResult('FAIL', 'URL', expectedPart, this.page.url(), 'ASSERTION');
            throw error;
        }

    }

    async assertToHaveTitle(title: RegExp | string) {
        try {
            await expect(this.page).toHaveTitle(title);
            await this.logActionResult('SUCCESS', 'Title', title, this.page.title(), 'ASSERTION');
        } catch (error) {
            await this.logActionResult('FAIL', 'Title', title, this.page.title(), 'ASSERTION');
            throw error;
        }
    }



    // --- 4. Handling Alerts and Frames ---

    async handleAlert() {
        try {
            return new Promise((resolve) => {
                this.page.once('dialog', async (dialog) => {
                    const message = dialog.message();
                    await dialog.accept();
                    await this.logActionResult('SUCCESS', 'JS Alert', undefined, `Accepted alert with message: ${message}`, 'ACTION');
                    resolve(message);
                });
            });
        } catch (error) {
            await this.logActionResult('FAIL', 'Alert', undefined, "Alert not found", 'ACTION');
            throw error;
        }
    }

    async getFrame(selector: string): Promise<FrameLocator | undefined> {
        const frame = this.page.frameLocator(selector);

        try {
            await expect(this.page.locator(selector)).toBeVisible({timeout: 5000})
            await this.logActionResult('SUCCESS', selector, undefined, "Frame found and visible", 'ACTION');
            return frame
        } catch (error) {
            await this.logActionResult('FAIL', selector, "Frame to be visible", "Frame not found", 'ACTION');
            throw error;
        }
    }

    // --- 5. Top Level Actions ---

    // wait for an element to be detached from DOM
    async waitForDetached(selector: string, timeout: number = 10000) {
        const locator = this.page.locator(selector)

        try {
            await locator.waitFor({ state: 'detached', timeout: timeout });
            await this.logActionResult('SUCCESS', selector, "DETACHED", "Element successfully detached", 'ACTION');
        } catch(error) {
            await this.logActionResult('FAIL', selector, "DETACHED", `Element still present after ${timeout}ms`, 'ACTION');
            throw error;
        }
    }

    async scrollToElement(selector: string) {
        const locator = this.page.locator(selector)

        try {
            await locator.scrollIntoViewIfNeeded();
            await this.logActionResult('SUCCESS', selector, undefined, "Scrolled to element", 'ACTION');
        } catch(error) {
            await this.logActionResult('FAIL', selector, 'Element to be scrollable', "Could not scroll to element", 'ACTION');
            throw error;
        }
    }

    async takeScreenshot(name: string) {
        const path = `./screenshots/${name}-${Date.now()}.png`

        try {
            await this.page.screenshot({ path: path, fullPage: true });
        } catch (error) {
            throw error;
        }
    }

    // --- 6. Local Storage ---

    async setToLocalStorage(key: string, value: string) {
        try {
            await this.page.evaluate(({ key, value }) => {
                localStorage.setItem(key, value);
            }, { key, value });
            await this.logActionResult('SUCCESS', 'LocalStorage', undefined, `Set [${key}] = ${value}`, 'ACTION');
        } catch (error) {
            await this.logActionResult('FAIL', 'LocalStorage', `Key: ${key}`, 'Failed to set storage item', 'ACTION');
            throw error;
        }
    }

    // --- 7. Other ---

    async wait(ms: number) {
        const yellow = "\x1b[33m";
        const reset = "\x1b[0m";

        try {
            console.warn(`${yellow}⚠️  [WARNING] Manual wait for ${ms}ms started on ${this.pageName}...${reset}`);
            await this.page.waitForTimeout(ms);
            await this.logActionResult('SUCCESS', 'Manual Wait', undefined, `${ms}ms finished`, 'ACTION');
        } catch (error) {
            await this.logActionResult('FAIL', 'Manual Wait', `${ms}ms`, 'Wait interrupted', 'ACTION');
            throw error;
        }
    }
}