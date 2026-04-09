import { test } from '../../fixtures';
import {expect} from "@playwright/test";

test.describe('Checkboxes page', () => {
    test('should check checkboxes if it unchecked and vice versa', async ({manager}) => {
        await manager.checkboxesPage.open()
        const count = await manager.checkboxesPage.getCheckboxesCount()
        await manager.checkboxesPage.assertCheckboxCount(count)
        await manager.checkboxesPage.checkCheckboxes(count)
    })
})