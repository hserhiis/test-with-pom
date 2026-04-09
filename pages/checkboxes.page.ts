
import {expect, Page} from "@playwright/test";
import BasePage from "./base.page";

export default class CheckboxesPage extends BasePage{
    private readonly checkboxSelector = 'input[type="checkbox"]'

    constructor(page: Page) {
        super(page, 'CheckboxesPage')
    }

    async open() {
        await this.navigate('/checkboxes')
        await this.expectPageToLoad()
    }

    async expectPageToLoad() {
        await this.assertToHaveUrl('/checkboxes')
    }

    async assertCheckboxCount(count: number) {
        await this.assertToHaveCount(this.checkboxSelector, count)
    }

    async getCheckboxesCount() {
        return await this.getElementCount(this.checkboxSelector)
    }

    async checkCheckboxes(count: number) {
        for (let i = 0; i < count; i++) {
            await this.checkCheckbox(this.checkboxSelector, i)
        }

    }
}