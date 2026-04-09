import {Page} from "@playwright/test";
import LoginPage from "./login.page";
import HomePage from "./home.page";
import CheckboxesPage from "./checkboxes.page";

export default class Manager {
    private readonly page: Page;
    private _loginPage: LoginPage | undefined;
    private _homePage: HomePage | undefined;
    private _checkboxesPage: CheckboxesPage | undefined;

    constructor(page: Page) {
        this.page = page
    }

    public get loginPage(): LoginPage {
        if (!this._loginPage) {
            this._loginPage = new LoginPage(this.page);
        }
        return this._loginPage;
    }

    public get homePage(): HomePage {
        if (!this._homePage) {
            this._homePage = new HomePage(this.page);
        }
        return this._homePage;
    }

    public get checkboxesPage() {
        if (!this._checkboxesPage) {
            this._checkboxesPage = new CheckboxesPage(this.page);
        }
        return this._checkboxesPage;
    }
}