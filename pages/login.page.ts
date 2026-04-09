import {Page} from "@playwright/test";
import HomePage from "./home.page";
import BasePage from "./base.page";

export default class LoginPage extends BasePage {
    private readonly usernameSelector = '#username';
    private readonly passwordSelector = '#password';
    private readonly buttonSelector = 'button[type="submit"]';
    private readonly errorSelector = '#flash';
    private readonly errorUsernameMessage = /Your username is invalid!/i;
    private readonly errorPasswordMessage = /Your password is invalid!/i;

    constructor(page: Page) {
        super(page, 'LoginPage');
    }

    async open() {
        await this.navigate('/login');
        await this.expectPageToLoad()
    }

    async expectPageToLoad() {
        await this.assertToHaveUrl('/login');
    }

    async assertToHaveUsernameError() {
        await this.assertToContainText(this.errorSelector, this.errorUsernameMessage);
    }

    async assertToHavePasswordError() {
        await this.assertToContainText(this.errorSelector, this.errorPasswordMessage);
    }

    async login(username: string, password: string): Promise<HomePage> {
        await this.fillIn(this.usernameSelector, username);
        await this.fillIn(this.passwordSelector, password);
        await this.click(this.buttonSelector);
        return new HomePage(this.page);
    }

    async invalidLogin(username: string, password: string) {
        await this.fillIn(this.usernameSelector, username);
        await this.fillIn(this.passwordSelector, password);
        await this.click(this.buttonSelector);
    }
}