import { expect, test, type Page } from '@playwright/test'
async function login(page: Page, email: string) {
 await page.goto('/')
 await page.getByLabel('Email', { exact: true }).fill(email)
 await page.getByLabel('Mật khẩu', { exact: true }).fill(process.env.CAMPUS_TEST_PASSWORD!)
 const signedIn = page.waitForResponse((response) => response.request().method() === 'POST' && response.url().endsWith('/api/v1/auth/login'))
 await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
 expect((await signedIn).status()).toBe(200)
 await expect(page.getByRole('banner').getByText(email, { exact: true })).toBeVisible()
}
test('real USER reads private inbox and registers, cancels and restores own Event with fresh ownership/version rules', async ({ page }) => {
 test.setTimeout(120000)
 await login(page, 'browser-admin@example.test')
 const seed = await page.evaluate(async () => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  async function call(path: string, method = 'GET', body?: unknown) {
   const response = await fetch('/api/v1/' + path, { method, headers: { Authorization: 'Bearer ' + tokens.accessToken, 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) })
   if (!response.ok) throw new Error('Portal seed status: ' + response.status)
   return response.json()
  }
  const accounts = await call('admin/users?q=browser-user%40example.test')
  const account = accounts.content.find((row: { email: string }) => row.email === 'browser-user@example.test')
  const admin = await call('auth/me')
  const unit = await call('admin/organization-units', 'POST', { code: 'PCORG', name: 'Đơn vị portal', unitType: 'FACULTY', status: 'ACTIVE' })
  await call('admin/students', 'POST', { studentNumber: 'PCSV', fullName: 'Sinh viên portal', identityUserId: account.id, organizationUnitId: unit.id, status: 'ACTIVE' })
  const other = await call('admin/students', 'POST', { studentNumber: 'PCOTHER', fullName: 'Sinh viên khác', organizationUnitId: unit.id, status: 'ACTIVE' })
  async function opened(code: string, title: string) {
   const draft = await call('admin/events', 'POST', { code, title, description: '<script>nội dung sự kiện</script>', startsAt: '2026-09-01T09:00:00Z', endsAt: '2026-09-01T10:00:00Z', capacity: 1 })
   return call('admin/events/' + draft.id, 'PUT', { ...draft, status: 'OPEN', expectedVersion: draft.rowVersion })
  }
  const event = await opened('PCMAIN', 'Ngày hội portal')
  const full = await opened('PCFULL', 'Sự kiện đã đủ chỗ')
  const foreign = await call('admin/events/' + full.id + '/registrations', 'POST', { studentId: other.id })
  const template = await call('admin/notifications/templates', 'POST', { code: 'PCNOTICE', name: 'Mẫu portal', title: 'Thông báo portal riêng', body: '<img src=x onerror=alert(1)>\nNội dung riêng' })
  const notice = await call('admin/notifications/notices', 'POST', { templateId: template.id })
  await call('admin/notifications/notices/' + notice.id + '/publish', 'POST', { expectedVersion: notice.rowVersion, recipientIds: [account.id, admin.id] })
  const adminInbox = await call('notifications?size=100')
  const foreignDelivery = adminInbox.content.find((row: { delivery: { noticeId: string } }) => row.delivery.noticeId === notice.id).delivery.id
  return { eventId: event.id, fullId: full.id, foreignId: foreign.id, foreignDelivery }
 })
 await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
 await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeVisible()
 await login(page, 'browser-user@example.test')
 const adminRequests: string[] = []
 page.on('request', (request) => { if (new URL(request.url()).pathname.startsWith('/api/v1/admin/')) adminRequests.push(request.url()) })
 await page.goto('/portal/inbox')
 await expect(page.getByRole('heading', { name: 'Hộp thư của bạn' })).toBeVisible()
 const notice = page.locator('.portal-inbox .ant-card').filter({ hasText: 'Thông báo portal riêng' })
 await expect(notice).toContainText('Chưa đọc')
 await notice.getByRole('button', { name: 'Xem thông báo' }).click()
 const dialog = page.getByRole('dialog')
 await expect(dialog.getByText('<img src=x onerror=alert(1)>\nNội dung riêng', { exact: true })).toBeVisible()
 await expect(dialog.locator('img')).toHaveCount(0)
 await expect(dialog.locator('time')).toHaveCount(1)
 await expect(dialog.locator('time')).toContainText('(UTC+7)')
 await expect(dialog.locator('time')).toHaveAttribute('datetime', /Z$/)
 const readResponse = page.waitForResponse((response) => response.request().method() === 'PUT' && response.url().endsWith('/read'))
 await dialog.getByRole('button', { name: 'Đánh dấu đã đọc' }).click()
 expect((await readResponse).status()).toBe(200)
 await expect(dialog).not.toBeVisible()
 await expect(notice).toContainText('Đã đọc')
 await page.getByRole('navigation', { name: 'Cổng cá nhân', exact: true }).getByRole('link', { name: 'Sự kiện', exact: true }).click()
 await expect(page.getByRole('heading', { name: 'Khám phá sự kiện' })).toBeVisible()
 const main = page.locator('.portal-event-grid .ant-card').filter({ hasText: 'Ngày hội portal' })
 await main.getByRole('button', { name: 'Xem sự kiện' }).click()
 await expect(dialog.getByRole('button', { name: 'Đăng ký sự kiện', exact: true })).toBeEnabled()
 await expect(dialog.locator('time').first()).toHaveText('16:00:00 01/09/2026 (UTC+7)')
 await expect(dialog.locator('time').first()).toHaveAttribute('datetime', /^2026-09-01T09:00:00(?:\.0+)?Z$/)
 const registered = page.waitForResponse((response) => response.request().method() === 'POST' && response.url().endsWith('/events/' + seed.eventId + '/registrations'))
 await dialog.getByRole('button', { name: 'Đăng ký sự kiện', exact: true }).click()
 const registeredResponse = await registered
 expect(registeredResponse.status()).toBe(201)
 expect(registeredResponse.request().postData()).toBeNull()
 const membership = await registeredResponse.json()
 await expect(dialog).not.toBeVisible()
 for (const [label, action, state] of [['Hủy đăng ký', 'CANCEL', 'CANCELLED'], ['Khôi phục đăng ký', 'RESTORE', 'REGISTERED']]) {
  await main.getByRole('button', { name: 'Xem sự kiện' }).click()
  await expect(dialog.getByRole('button', { name: label, exact: true })).toBeEnabled()
  const changed = page.waitForResponse((response) => response.request().method() === 'PUT' && response.url().endsWith('/event-registrations/' + membership.id))
  await dialog.getByRole('button', { name: label, exact: true }).click()
  const response = await changed
  expect(response.status()).toBe(200)
  expect(response.request().postDataJSON().action).toBe(action)
  const current = await response.json()
  expect(current.id).toBe(membership.id)
  expect(current.createdAt).toBe(membership.createdAt)
  expect(current.status).toBe(state)
  await expect(dialog).not.toBeVisible()
 }
 await page.locator('.portal-event-grid .ant-card').filter({ hasText: 'Sự kiện đã đủ chỗ' }).getByRole('button', { name: 'Xem sự kiện' }).click()
 await expect(dialog.getByRole('button', { name: 'Đăng ký sự kiện', exact: true })).toBeEnabled()
 const denied = page.waitForResponse((response) => response.request().method() === 'POST' && response.url().endsWith('/events/' + seed.fullId + '/registrations'))
 await dialog.getByRole('button', { name: 'Đăng ký sự kiện', exact: true }).click()
 expect((await denied).status()).toBe(409)
 await expect(dialog.getByText('Mã lỗi: EVENT_CAPACITY_EXCEEDED')).toBeVisible()
 await expect(dialog.getByRole('button', { name: 'Đăng ký sự kiện', exact: true })).toBeDisabled()
 await dialog.locator('.ant-modal-footer').getByRole('button', { name: 'Đóng', exact: true }).click()
 await expect(dialog).not.toBeVisible()
 const privacy = await page.evaluate(async (ids) => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  async function status(path: string, method = 'GET', body?: unknown) {
   return (await fetch('/api/v1/' + path, { method, headers: { Authorization: 'Bearer ' + tokens.accessToken, 'Content-Type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body) })).status
  }
  return {
   foreignRegistration: await status('event-registrations/' + ids.foreignId),
   foreignDelivery: await status('notifications/' + ids.foreignDelivery),
   attended: await status('event-registrations/' + ids.ownId, 'PUT', { action: 'ATTEND', expectedVersion: 2 }),
   stale: await status('event-registrations/' + ids.ownId, 'PUT', { action: 'CANCEL', expectedVersion: 0 }),
  }
 }, { ...seed, ownId: membership.id })
 expect(privacy).toEqual({ foreignRegistration: 404, foreignDelivery: 404, attended: 403, stale: 409 })
 expect(adminRequests).toEqual([])
 await page.getByRole('navigation', { name: 'Cổng cá nhân', exact: true }).getByRole('link', { name: 'Đăng ký của bạn', exact: true }).click()
 await expect(page.getByRole('heading', { name: 'Đăng ký của bạn', exact: true })).toBeVisible()
 await expect(page.locator('.portal-event-grid')).toContainText('Đã đăng ký')
 await page.reload()
 await expect(page.locator('.portal-event-grid')).toContainText('Đã đăng ký')
})
test('real unlinked USER can browse events without ADMIN reads or registration writes', async ({ page }) => {
 test.setTimeout(60000)
 await login(page, 'browser-admin@example.test')
 await page.evaluate(async (password) => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  async function post(path: string, body: unknown) {
   const response = await fetch('/api/v1/admin/' + path, { method: 'POST', headers: { Authorization: 'Bearer ' + tokens.accessToken, 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
   if (!response.ok) throw new Error('Unlinked seed status: ' + response.status)
  }
  await post('users', { email: 'portal-unlinked@example.test', displayName: 'Tài khoản chưa liên kết', initialPassword: password, roles: ['USER'], status: 'ACTIVE' })
  await post('events', { code: 'PCUNLINK', title: 'Danh mục dành cho mọi tài khoản', description: 'Sự kiện tham khảo', startsAt: '2026-09-01T09:00:00Z', endsAt: '2026-09-01T10:00:00Z', capacity: 1 })
 }, process.env.CAMPUS_TEST_PASSWORD!)
 await page.getByRole('button', { name: 'Đăng xuất', exact: true }).click()
 await expect(page.getByRole('button', { name: 'Đăng nhập', exact: true })).toBeVisible()
 await login(page, 'portal-unlinked@example.test')
 await page.goto('/portal/events')
 await page.locator('.portal-event-grid .ant-card').filter({ hasText: 'Danh mục dành cho mọi tài khoản' }).getByRole('button', { name: 'Xem sự kiện' }).click()
 const dialog = page.getByRole('dialog')
 await expect(dialog.getByText('Chưa có hồ sơ sinh viên liên kết', { exact: true })).toBeVisible()
 await expect(dialog.getByRole('button', { name: 'Đăng ký sự kiện', exact: true })).toHaveCount(0)
 await expect(page.getByRole('navigation', { name: 'Điều hướng chính' }).getByRole('link', { name: 'Sinh viên', exact: true })).toHaveCount(0)
})
