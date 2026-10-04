import { test, expect, type Page } from '@playwright/test'
async function save(page: Page, path: string, method: string) {
 const response = page.waitForResponse((value) => new URL(value.url()).pathname === path && value.request().method() === method)
 await page.getByRole('dialog').getByRole('button', { name: 'Lưu', exact: true }).click()
 return await response
}
test('real Event enforces stale catalog and capacity, retains restored membership and terminal attendance', async ({ page }) => {
 test.setTimeout(120000)
 await page.goto('/')
 await page.getByLabel('Email', { exact: true }).fill('browser-admin@example.test')
 await page.getByLabel('Mật khẩu', { exact: true }).fill(process.env.CAMPUS_TEST_PASSWORD!)
 await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
 await expect(page.getByRole('banner').getByText('browser-admin@example.test')).toBeVisible()
 await page.evaluate(async () => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  const post = async (path: string, body: unknown) => {
   const response = await fetch('/api/v1/admin/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokens.accessToken }, body: JSON.stringify(body) })
   if (!response.ok) throw new Error('Event seed failed: ' + response.status)
   return response.json()
  }
  const unit = await post('organization-units', { code: 'EVORG', name: 'Khoa Event', unitType: 'FACULTY', status: 'ACTIVE' })
  for (const code of ['EVSV1', 'EVSV2']) await post('students', { studentNumber: code, fullName: code, organizationUnitId: unit.id, status: 'ACTIVE' })
 })
 await page.goto('/admin/events/catalog')
 await page.getByRole('button', { name: 'Thêm sự kiện', exact: true }).click()
 const dialog = page.getByRole('dialog')
 for (const [label, value] of [['Mã sự kiện', 'EVUI'], ['Tên sự kiện', 'Sự kiện UI'], ['Mô tả', 'Sự kiện thử nghiệm'], ['Bắt đầu (UTC)', '2026-09-01T09:00:00.123456Z'], ['Kết thúc (UTC)', '2026-09-01T10:00:00.123456Z']]) await dialog.getByLabel(label, { exact: true }).fill(value)
 await dialog.getByRole('spinbutton', { name: 'Sức chứa', exact: true }).fill('1')
 const createdResponse = await save(page, '/api/v1/admin/events', 'POST')
 expect(createdResponse.status()).toBe(201)
 const event = await createdResponse.json()
 await expect(dialog).not.toBeVisible()
 await page.getByRole('row').filter({ hasText: 'EVUI' }).getByRole('button', { name: 'Xem / sửa' }).click()
 await expect(dialog.getByLabel('Bắt đầu (UTC)', { exact: true })).toHaveValue(event.startsAt)
 const status = await page.evaluate(async (record) => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  return (await fetch('/api/v1/admin/events/' + record.id, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokens.accessToken }, body: JSON.stringify({ ...record, title: 'Sự kiện phiên khác', expectedVersion: record.rowVersion }) })).status
 }, event)
 expect(status).toBe(200)
 await dialog.getByLabel('Tên sự kiện', { exact: true }).fill('Sự kiện bản cũ')
 expect((await save(page, '/api/v1/admin/events/' + event.id, 'PUT')).status()).toBe(409)
 await expect(dialog.getByRole('button', { name: 'Lưu', exact: true })).toBeDisabled()
 await dialog.getByRole('button', { name: 'Tải lại', exact: true }).click()
 const confirm = page.getByRole('dialog').filter({ hasText: 'Tải lại dữ liệu mới?' })
 await confirm.getByRole('button', { name: 'Tải lại', exact: true }).click()
 await expect(confirm).not.toBeVisible()
 await expect(dialog.getByLabel('Tên sự kiện', { exact: true })).toHaveValue('Sự kiện phiên khác')
 await dialog.getByLabel('Trạng thái', { exact: true }).click()
 await page.getByTitle('OPEN', { exact: true }).click()
 expect((await save(page, '/api/v1/admin/events/' + event.id, 'PUT')).status()).toBe(200)
 await expect(dialog).not.toBeVisible()
 await page.getByRole('navigation', { name: 'Quản trị sự kiện' }).getByRole('link', { name: 'Đăng ký sự kiện', exact: true }).click()
 let membership: { id: string; rowVersion: number; status: string; createdAt: string } | undefined
 for (const code of ['EVSV1', 'EVSV2']) {
  await page.getByRole('button', { name: 'Thêm đăng ký sự kiện', exact: true }).click()
  await dialog.getByRole('combobox', { name: 'Sự kiện', exact: true }).click()
  await page.getByTitle('EVUI · Sự kiện phiên khác', { exact: true }).click()
  await dialog.getByRole('combobox', { name: 'Sinh viên', exact: true }).click()
  await page.getByTitle(code + ' · ' + code, { exact: true }).click()
  const response = await save(page, '/api/v1/admin/events/' + event.id + '/registrations', 'POST')
  if (code === 'EVSV1') {
   expect(response.status()).toBe(201)
   membership = await response.json()
   await expect(dialog).not.toBeVisible()
  } else {
   expect(response.status()).toBe(409)
   await expect(dialog.getByText('Mã lỗi: EVENT_CAPACITY_EXCEEDED')).toBeVisible()
   await dialog.getByRole('button', { name: 'Hủy', exact: true }).click()
  }
 }
 for (const [action, expected] of [['CANCEL', 'CANCELLED'], ['RESTORE', 'REGISTERED'], ['ATTEND', 'ATTENDED']]) {
  if (action === 'ATTEND') {
   await page.getByRole('navigation', { name: 'Quản trị sự kiện' }).getByRole('link', { name: 'Danh mục sự kiện', exact: true }).click()
   await expect(page.getByRole('heading', { name: 'Danh mục sự kiện', exact: true })).toBeVisible()
   await page.getByRole('row').filter({ hasText: 'EVUI' }).getByRole('button', { name: 'Xem / sửa' }).click()
   await expect(dialog.getByText(/Trạng thái hiện tại: OPEN/)).toBeVisible()
   await dialog.getByLabel('Trạng thái', { exact: true }).click()
   await page.getByTitle('CLOSED', { exact: true }).click()
   expect((await save(page, '/api/v1/admin/events/' + event.id, 'PUT')).status()).toBe(200)
   await expect(dialog).not.toBeVisible()
   await page.getByRole('row').filter({ hasText: 'EVUI' }).getByRole('button', { name: 'Xem / sửa' }).click()
   await expect(dialog.getByText(/Trạng thái hiện tại: CLOSED/)).toBeVisible()
   await expect(dialog.getByRole('button', { name: 'Lưu', exact: true })).toHaveCount(0)
   await dialog.getByRole('button', { name: 'Hủy', exact: true }).click()
   await page.getByRole('navigation', { name: 'Quản trị sự kiện' }).getByRole('link', { name: 'Đăng ký sự kiện', exact: true }).click()
  }
  await page.getByRole('row').filter({ hasText: 'EVSV1' }).getByRole('button', { name: 'Xem / sửa' }).click()
  await expect(dialog.getByRole('combobox', { name: 'Sinh viên', exact: true })).toBeDisabled()
  await dialog.getByLabel('Thao tác', { exact: true }).click()
  await page.getByTitle(action, { exact: true }).click()
  const result = await (await save(page, '/api/v1/admin/event-registrations/' + membership!.id, 'PUT')).json()
  expect(result.id).toBe(membership!.id)
  expect(result.createdAt).toBe(membership!.createdAt)
  expect(result.status).toBe(expected)
  expect(result.rowVersion).toBeGreaterThan(membership!.rowVersion)
  membership = result
  await expect(dialog).not.toBeVisible()
 }
 await page.getByRole('row').filter({ hasText: 'EVSV1' }).getByRole('button', { name: 'Xem / sửa' }).click()
 await expect(dialog.getByText(/Trạng thái hiện tại: ATTENDED/)).toBeVisible()
 await expect(dialog.getByRole('button', { name: 'Lưu', exact: true })).toHaveCount(0)
})
