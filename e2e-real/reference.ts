import { expect, type Locator, type Page } from '@playwright/test'

// Keyboard selection keeps the choice deterministic while the reference popup relies on a
// bounded server lookup that resolves and repositions after the list has already been shown.
export async function pickReference(page: Page, combobox: Locator, choice: string) {
 await combobox.click()
 const searchable = await combobox.evaluate((element) => element.closest('.ant-select-show-search') !== null)
 if (searchable) {
  await combobox.fill(choice.split(' · ')[0])
  const options = page.locator('.ant-select-dropdown:not(.ant-select-dropdown-hidden) .ant-select-item-option')
  await expect(options).toHaveCount(1)
  await expect(options.first()).toHaveAttribute('title', choice)
  await combobox.press('Enter')
 } else {
  await page.getByTitle(choice, { exact: true }).click()
 }
 const select = combobox.locator('xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " ant-select ")][1]')
 await expect(select.getByTitle(choice, { exact: true })).toHaveCount(1)
}
