import { expect, test } from '@playwright/test'
for (const width of [375, 768, 1440]) {
 test('personal portal remains usable and private at ' + width, async ({ page }, testInfo) => {
  await page.setViewportSize({ width, height: 960 })
  const user = { id: 'u', email: 'student@example.test', status: 'ACTIVE', roles: ['USER'] }
  const event = { id: 'e', code: 'EVPORTAL', title: 'Ngày hội sinh viên', description: '<script>văn bản thuần</script>', startsAt: '2026-09-01T09:00:00Z', endsAt: '2026-09-01T10:00:00Z', status: 'OPEN', capacity: 1, rowVersion: 0 }
  const delivery = { id: 'd', status: 'UNREAD', rowVersion: 0, deliveredAt: '2026-10-05T00:00:00Z', readAt: null }
  const item = { delivery, title: 'Thông báo cá nhân', body: '<img src=x onerror=alert(1)>\nNội dung thông báo' }
  const writes: string[] = []
  const adminReads: string[] = []
  await page.route('**/api/v1/**', async (route) => {
   const request = route.request()
   const path = new URL(request.url()).pathname
   if (path.includes('/admin/')) adminReads.push(path)
   if (path.endsWith('/refresh')) return route.fulfill({ json: { accessToken: 'mock' } })
   if (path.endsWith('/me')) return route.fulfill({ json: user })
   if (request.method() === 'PUT') {
    writes.push(path)
    delivery.status = 'READ'
    return route.fulfill({ json: { ...delivery, readAt: '2026-10-05T01:00:00Z' } })
   }
   if (request.method() === 'POST') {
    writes.push(path)
    expect(request.postData()).toBeNull()
    return route.fulfill({ status: 201, json: { id: 'r', eventId: 'e', status: 'REGISTERED', rowVersion: 0 } })
   }
   if (path === '/api/v1/notifications/d') return route.fulfill({ json: item })
   if (path === '/api/v1/events/e') return route.fulfill({ json: event })
   const content = path === '/api/v1/notifications' ? [item] : path === '/api/v1/events' ? [event] : []
   return route.fulfill({ json: { content, totalElements: content.length } })
  })
  await page.goto('/portal/inbox')
  await expect(page.getByRole('heading', { name: 'Hộp thư của bạn' })).toBeVisible()
  expect(writes).toEqual([])
  await page.getByRole('button', { name: 'Xem thông báo' }).click()
  const dialog = page.getByRole('dialog')
  await expect(dialog.getByText(item.body, { exact: true })).toBeVisible()
  await expect(dialog.locator('img')).toHaveCount(0)
  expect(writes).toEqual([])
  await dialog.getByRole('button', { name: 'Đánh dấu đã đọc' }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.locator('.portal-inbox')).toContainText('Đã đọc')
  await expect(page.getByRole('button', { name: 'Xem thông báo' })).toBeFocused()
  await page.getByRole('navigation', { name: 'Cổng cá nhân', exact: true }).getByRole('link', { name: 'Sự kiện', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Khám phá sự kiện' })).toBeVisible()
    const contrast = await page.locator('.portal-event-grid .ant-typography-secondary').evaluate((element) => {
   const numbers = (color: string) => color.match(/[\d.]+/g)!.map(Number)
   const foreground = numbers(getComputedStyle(element).color)
   const background = numbers(getComputedStyle(element.closest('.ant-card')!).backgroundColor)
   const alpha = foreground[3] ?? 1
   const blended = foreground.slice(0, 3).map((value, index) => value * alpha + background[index] * (1 - alpha))
   const luminance = (rgb: number[]) => rgb.slice(0, 3).map((value) => {
    const channel = value / 255
    return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
   }).reduce((total, value, index) => total + value * [0.2126, 0.7152, 0.0722][index], 0)
   const values = [luminance(blended), luminance(background)]
   return (Math.max(...values) + 0.05) / (Math.min(...values) + 0.05)
  })
  expect(contrast).toBeGreaterThanOrEqual(4.5)
  await page.getByRole('button', { name: 'Xem sự kiện' }).click()
  await expect(dialog.getByRole('button', { name: 'Đăng ký sự kiện', exact: true })).toBeEnabled()
  await expect(dialog.locator('script')).toHaveCount(0)
  await dialog.getByRole('button', { name: 'Đăng ký sự kiện', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.getByRole('button', { name: 'Xem sự kiện' })).toBeFocused()
  expect(writes).toEqual(['/api/v1/notifications/d/read', '/api/v1/events/e/registrations'])
  expect(adminReads).toEqual([])
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  await page.screenshot({ path: testInfo.outputPath('portal-' + width + '.png'), fullPage: true })
 })
}
