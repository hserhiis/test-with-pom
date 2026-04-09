import {Page} from "@playwright/test";

export class Logger {
    private page: Page;
    private pageName: string;
    private status: 'SUCCESS' | 'FAIL';
    private selector: string;
    private expected: any;
    private actual: any;
    private type: 'ACTION' | 'ASSERTION';
    private screenshotMsg: string;

    constructor(page: Page, pageName: string, status: 'SUCCESS' | 'FAIL', selector: string, expected: any, actual: any, type: 'ACTION' | 'ASSERTION' = 'ASSERTION', screenshotMsg: string = '') {
        this.page = page;
        this.pageName = pageName;
        this.status = status;
        this.selector = selector;
        this.expected = expected;
        this.actual = actual;
        this.type = type;
        this.screenshotMsg = screenshotMsg;
    }

    log() {
        const green = "\x1b[32m";
        const red = "\x1b[31m";
        const yellow = "\x1b[33m";
        const reset = "\x1b[0m";

        const color = this.status === 'SUCCESS' ? green : red;
        const icon = status === 'SUCCESS' ? '✅' : '❌';

        console.log(`\n${color}--------------------------------------------------`);
        console.log(`${icon} [${status}] ${this.type}`);
        console.log(`   Page:     ${this.pageName}`);
        console.log(`   Selector: ${this.selector}`);

        if (this.expected !== undefined) console.log(`   Expected: ${this.expected}`);
        if (this.actual !== undefined)   console.log(`   Actual:   ${this.actual}`);
        if (this.screenshotMsg)          console.log(this.screenshotMsg);
        console.log(`--------------------------------------------------${reset}\n`);
    }
}