import { test, expect } from '@playwright/test'

// Mock browser journeys verify frontend behavior, not backend cookie/authorization integration.
test.beforeEach(async ({ page }) => {
 await page.route('**/api/v1/**', async (route) => {
  const path = new URL(route.request().url()).pathname
  if (path.endsWith('/login')) return route.fulfill({ json: { accessToken: 'mock-token', tokenType: 'Bearer', expiresIn: 900, user: { id: 'mock-user', email: 'demo@example.test', status: 'ACTIVE', roles: ['ADMIN'] } } })
  if (path.endsWith('/logout')) return route.fulfill({ status: 204 })
  return route.fulfill({ status: 401, json: { code: 'REFRESH_TOKEN_MISSING' } })
 })
})
test('login and logout without persistent bearer storage', async ({ page }, testInfo) => {
 await page.goto('/')
 await page.getByRole('heading', { name: 'Đăng nhập', exact: true }).waitFor()
 await page.screenshot({ path: testInfo.outputPath('login-desktop.png'), fullPage: true })
 await page.getByLabel('Email', { exact: true }).fill('demo@example.test')
 await page.getByLabel('Mật khẩu', { exact: true }).fill('test-only-password')
 await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
 await expect(page.getByRole('banner').getByText('demo@example.test', { exact: true })).toBeVisible()
 expect(await page.evaluate(() => ({ local: localStorage.length, session: sessionStorage.length }))).toEqual({ local: 0, session: 0 })
 await page.getByRole('button', { name: 'Đăng xuất' }).click()
 await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible()
})
test('mobile login has no horizontal overflow and validates input', async ({ page }) => {
 await page.setViewportSize({ width: 390, height: 844 })
 await page.goto('/login')
 await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
 await expect(page.getByText('Nhập email.', { exact: true })).toBeVisible()
 expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
