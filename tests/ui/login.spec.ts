import {test} from '../../fixtures';
import {UserDto} from "../../api/models/UserDto";
import {UserFactory} from "../../api/data/UserFactory";
import HomePage from "../../pages/home.page";


test.describe('Login Page', () => {

  test('should login with valid credentials', async ({loginPage}) => {

    const user: UserDto = UserFactory.getValidUser()

    const homePage: HomePage = await loginPage.login(user.username, user.password)

    await homePage.expectPageToLoad()

    await homePage.assertContainTitle()

    await homePage.assertContainSuccessMessage()

  })

  test('should show error message with invalid username', async ({loginPage}) => {

    const user: UserDto = UserFactory.getInvalidUsernameUser()

    await loginPage.invalidLogin(user.username, user.password)

    await loginPage.assertToHaveUsernameError()

  })

  test('should show error message with invalid password', async ({loginPage}) => {

    const user: UserDto = UserFactory.getInvalidPasswordUser()

    await loginPage.invalidLogin(user.username, user.password)

    await loginPage.assertToHavePasswordError()

  })

})
