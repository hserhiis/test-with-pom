import {CommonActions} from "../base/common-actions.spec";
import {Page} from "@playwright/test";

export default class HomePage{
    private actions: CommonActions;

    constructor(page: Page) {
        this.actions = new CommonActions(page);
    }

    async navigate() {
        await this.actions.navigate('https://the-internet.herokuapp.com/secure');
    }

    async assertSecurePage() {
        await this.actions.assertToHaveText('h2', /Secure Area/i);
    }
}