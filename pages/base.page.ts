import {Page} from "@playwright/test";
import {CommonActions} from "../base/common.actions";

export default class BasePage extends CommonActions {
    protected pageName: string;

    constructor(page: Page, pageName: string) {
        super(page);
        this.pageName = pageName;
    }
}