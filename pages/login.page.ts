import {CommonActions} from "../base/common-actions.spec";
import {Page} from "@playwright/test";
import HomePage from "./home-page.spec";

export default class LoginPage {
    private actions: CommonActions;
    private readonly usernameSelector: string;
    private readonly passwordSelector: string;

    constructor(page: Page) {
        this.actions = new CommonActions(page);
        this.usernameSelector = '#username';
        this.passwordSelector = '#password';
    }

    async navigate() {
        await this.actions.navigate('https://the-internet.herokuapp.com/login');
    }

    async login(username: string, password: string): Promise<HomePage> {
        await this.actions.fillIn(this.usernameSelector, username);
        await this.actions.fillIn(this.passwordSelector, password);
        await this.actions.click('button[type="submit"]');
        return new HomePage(this.actions.page);
    }
}