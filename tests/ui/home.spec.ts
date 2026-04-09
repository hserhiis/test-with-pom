import { test } from '../fixtures';

test.describe('Home page security area @smoke', () => {
    test('should verify secure content after login', async ({homePage}) => {
        await homePage.expectPageToLoad()
        await homePage.assertContainSuccessMessage()
        await homePage.assertContainTitle()
    })

    test('should logout successfully', async ({homePage}) => {
        const loginPage = await homePage.logout()
        await loginPage.expectPageToLoad()
    })
})