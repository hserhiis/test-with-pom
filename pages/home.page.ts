
import {Page} from "@playwright/test";
import BasePage from "./base.page";
import LoginPage from "./login.page";

export default class HomePage extends BasePage{
    private readonly successText = 'You logged into a secure area!'
    private readonly titleText = 'Secure Area'
    private readonly successSelector = '#flash'
    private readonly titleSelector = 'h2'

    constructor(page: Page) {
        super(page, 'HomePage')
    }

    async expectPageToLoad() {
        await this.assertToHaveUrl('/secure')
    }

    async assertContainSuccessMessage() {
        await this.assertToContainText(this.successSelector, this.successText);
    }

    async assertContainTitle() {
        await this.assertToContainText(this.titleSelector, this.titleText);
    }

    async logout(): Promise<LoginPage> {
        await this.click('a[href="/logout"]');
        return new LoginPage(this.page);
    }
}