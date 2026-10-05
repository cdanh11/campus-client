import { test, expect } from '@playwright/test'
const user = { id: 'mock-user', email: 'administrator.with.long.name@campus.example.test', status: 'ACTIVE', roles: ['ADMIN'] }
test.beforeEach(async ({ page }) => {
 await page.route('**/api/v1/**', async (route) => {
  const path = new URL(route.request().url()).pathname
  if (path.endsWith('/refresh')) return route.fulfill({ json: { accessToken: 'mock', tokenType: 'Bearer', expiresIn: 900, user } })
  if (path.endsWith('/me')) return route.fulfill({ json: user })
  return route.fulfill({ json: { content: [], totalElements: 0, totalPages: 0 } })
 })
})
for (const width of [375, 768, 1024, 1440]) {
 test('workspace fits viewport ' + width, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 960 })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Một khuôn viên. Một kết nối.' })).toBeVisible()
  if (width < 1024) {
   const menu = page.getByRole('button', { name: 'Mở điều hướng' })
   await menu.focus()
   await page.keyboard.press('Enter')
   const drawer = page.getByRole('dialog')
   await expect(drawer.getByRole('navigation')).toBeVisible()
   await drawer.getByRole('link', { name: 'Sinh viên', exact: true }).click()
   await expect(page.getByRole('heading', { name: 'Sinh viên', exact: true })).toBeVisible()
   await expect(drawer).not.toBeVisible()
  } else {
   await page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link', { name: 'Sinh viên', exact: true }).click()
   await expect(page.getByRole('heading', { name: 'Sinh viên', exact: true })).toBeVisible()
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('students-' + width + '.png'), fullPage: true })
 })
}
test('keyboard skip link reaches main and active route is announced', async ({ page }) => {
 await page.goto('/')
 await page.getByRole('heading', { name: 'Một khuôn viên. Một kết nối.' }).waitFor()
 await page.keyboard.press('Tab')
 const skip = page.getByRole('link', { name: 'Đến nội dung chính' })
 await expect(skip).toBeFocused()
 await page.keyboard.press('Enter')
 await expect(page.locator('#main-content')).toBeFocused()
 await expect(page.getByRole('link', { name: 'Trang chủ', exact: true })).toHaveAttribute('aria-current', 'page')
})

for (const width of [375, 1440]) {
 test('dashboard retains exact aggregates within viewport ' + width, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 960 })
  await page.route('**/api/v1/admin/reports/dashboard', (route) => route.fulfill({
   contentType: 'application/json',
   body: '{"currency":"VND","asOf":"2026-10-05T00:00:00Z","groups":{"IDENTITY":{"count":123},"PEOPLE":{"count":123},"ACADEMIC":{"count":123},"DORMITORY":{"count":123},"FINANCE":{"outstanding_vnd":19999999999999999998},"NOTIFICATION":{"count":123},"EVENT":{"count":123},"LIBRARY":{"count":123}}}',
  }))
  await page.goto('/admin/insights/dashboard')
  await expect(page.getByText('19.999.999.999.999.999.998 VND', { exact: true })).toBeVisible()
  await expect(page.locator('.dashboard-grid .ant-card')).toHaveCount(8)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('dashboard-' + width + '.png'), fullPage: true })
 })
}

