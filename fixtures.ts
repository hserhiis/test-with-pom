import { test as base } from '@playwright/test'
import Manager from "./pages/manager";
import HomePage from "./pages/home.page";
import LoginPage from "./pages/login.page";


type MyFixturesType = {
    manager: Manager
    loginPage: LoginPage
    authManager: Manager
    homePage: HomePage
}

export const test = base.extend<MyFixturesType>({
    manager: async ({ page }, use) => {
        const manager = new Manager(page);
        await use(manager);
    },

    loginPage: async ({manager}, use) => {
        await manager.loginPage.open()
        await use(manager.loginPage)
    },

    authManager: async ({manager}, use) => {
        await manager.loginPage.open()
        await manager.loginPage.login('tomsmith', 'SuperSecretPassword!')
        await use(manager)
    },

    homePage: async ({authManager}, use) => {
        await use(authManager.homePage)
    }
});

export {expect} from '@playwright/test'