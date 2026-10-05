import { test, expect, type Page } from '@playwright/test'

async function login(page: Page, email: string) {
 await page.goto('/')
 await page.getByLabel('Email', { exact: true }).fill(email)
 await page.getByLabel('Mật khẩu', { exact: true }).fill(process.env.CAMPUS_TEST_PASSWORD!)
 await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
 await expect(page.getByRole('banner').getByText(email, { exact: true })).toBeVisible()
}
test('real cookie rotation, reload restoration, Origin rejection and logout', async ({ page, context }) => {
 await login(page, 'browser-admin@example.test')
 const initial = (await context.cookies()).find((cookie) => cookie.name === 'CAMPUS_REFRESH')!
 expect(initial).toMatchObject({ httpOnly: true, secure: false, path: '/api/v1/auth', sameSite: 'Lax' })
 expect(await page.evaluate(() => document.cookie.includes('CAMPUS_REFRESH'))).toBe(false)
 expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0)
 const refresh = page.waitForResponse((response) => response.url().endsWith('/auth/refresh') && response.status() === 200)
 await page.reload()
 await refresh
 await expect(page.getByRole('banner').getByText('browser-admin@example.test', { exact: true })).toBeVisible()
 const rotated = (await context.cookies()).find((cookie) => cookie.name === 'CAMPUS_REFRESH')!
 expect(rotated.value !== initial.value).toBe(true)
 // Backend receives the browser localhost:3000 Origin through the actual Vite proxy.
 const denied = await context.request.post('/api/v1/auth/refresh', { headers: { Origin: 'https://untrusted.example.test' } })
 expect(denied.status()).toBe(403)
 expect((await denied.json()).code).toBe('INVALID_REQUEST_ORIGIN')
 await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
 await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible()
 await expect.poll(async () => (await context.cookies()).some((cookie) => cookie.name === 'CAMPUS_REFRESH')).toBe(false)
 await page.reload()
 await expect(page.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible()
})
test('real USER is denied ADMIN API and can restore its own session', async ({ page }) => {
 await login(page, 'browser-user@example.test')
 // Request a fresh bearer through the real cookie path without exposing it in test output.
 const forbidden = await page.evaluate(async () => {
  const refreshed = await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })
  const tokens = await refreshed.json()
  const response = await fetch('/api/v1/admin/users', { headers: { Authorization: 'Bearer ' + tokens.accessToken } })
  return { status: response.status, code: (await response.json()).code }
 })
 expect(forbidden).toEqual({ status: 403, code: 'FORBIDDEN' })
 await page.reload()
 await expect(page.getByRole('banner').getByText('browser-user@example.test', { exact: true })).toBeVisible()
})

test('two tabs serialize refresh rotation and clear both views on logout', async ({ page, context }) => {
 await login(page, 'browser-admin@example.test')
 const second = await context.newPage()
 await second.goto('/')
 await expect(second.getByRole('banner').getByText('browser-admin@example.test', { exact: true })).toBeVisible()
 const firstRefresh = page.waitForResponse((response) => response.url().endsWith('/auth/refresh') && response.status() === 200)
 const secondRefresh = second.waitForResponse((response) => response.url().endsWith('/auth/refresh') && response.status() === 200)
 await Promise.all([page.reload(), second.reload(), firstRefresh, secondRefresh])
 await expect(page.getByRole('banner').getByText('browser-admin@example.test', { exact: true })).toBeVisible()
 await expect(second.getByRole('banner').getByText('browser-admin@example.test', { exact: true })).toBeVisible()
 await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
 await expect(second.getByRole('heading', { name: 'Đăng nhập', exact: true })).toBeVisible()
 await expect.poll(async () => (await context.cookies()).some((cookie) => cookie.name === 'CAMPUS_REFRESH')).toBe(false)
})
