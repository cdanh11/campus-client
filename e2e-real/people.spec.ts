import { test, expect, type Page } from '@playwright/test'
async function login(page: Page) {
 await page.goto('/')
 await page.getByLabel('Email', { exact: true }).fill('browser-admin@example.test')
 await page.getByLabel('Mật khẩu', { exact: true }).fill(process.env.CAMPUS_TEST_PASSWORD!)
 await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
 await expect(page.getByRole('banner').getByText('browser-admin@example.test')).toBeVisible()
}
test('real owner forms create profiles and require reload after stale organization update', async ({ page }) => {
 test.setTimeout(60_000)
 await login(page)
 await page.goto('/admin/organizations')
 await page.getByRole('button', { name: 'Thêm đơn vị', exact: true }).click()
 let dialog = page.getByRole('dialog')
 await dialog.getByLabel('Mã đơn vị', { exact: true }).fill('UIORG')
 await dialog.getByLabel('Tên đơn vị', { exact: true }).fill('Khoa thử nghiệm UI')
 await dialog.getByLabel('Loại đơn vị', { exact: true }).click()
 await page.getByTitle('Khoa', { exact: true }).click()
 const create = page.waitForResponse((response) => new URL(response.url()).pathname === '/api/v1/admin/organization-units' && response.request().method() === 'POST')
 await dialog.getByRole('button', { name: 'Lưu', exact: true }).click()
 const created = await (await create).json()
 await expect(dialog).not.toBeVisible()
 await page.getByRole('row').filter({ hasText: 'UIORG' }).getByRole('button', { name: 'Xem / sửa' }).click()
 dialog = page.getByRole('dialog')
 await expect(dialog.getByLabel('Tên đơn vị')).toHaveValue('Khoa thử nghiệm UI')
 const updateStatus = await page.evaluate(async (record) => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => {
   const response = await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })
   return response.json()
  })
  const response = await fetch('/api/v1/admin/organization-units/' + record.id, {
   method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokens.accessToken },
   body: JSON.stringify({ code: record.code, name: 'Khoa phiên khác', unitType: record.unitType, status: record.status, expectedVersion: record.rowVersion }),
  })
  return response.status
 }, created)
 expect(updateStatus).toBe(200)
 await dialog.getByLabel('Tên đơn vị').fill('Khoa bản cũ')
 await dialog.getByRole('button', { name: 'Lưu', exact: true }).click()
 await expect(dialog.getByText('Mã lỗi: CONCURRENT_MODIFICATION')).toBeVisible()
 await expect(dialog.getByRole('button', { name: 'Lưu', exact: true })).toBeDisabled()
 await dialog.getByRole('button', { name: 'Tải lại', exact: true }).click()
 const confirm = page.getByRole('dialog').filter({ hasText: 'Tải lại dữ liệu mới?' })
 await confirm.getByRole('button', { name: 'Tải lại', exact: true }).click()
 await expect(confirm).not.toBeVisible()
 dialog = page.getByRole('dialog')
 await expect(dialog.getByLabel('Tên đơn vị')).toHaveValue('Khoa phiên khác')
 await dialog.getByLabel('Tên đơn vị').fill('Khoa dữ liệu mới')
 await dialog.getByRole('button', { name: 'Lưu', exact: true }).click()
 await expect(dialog).not.toBeVisible()
 for (const profile of [
  { path: 'students', add: 'Thêm sinh viên', number: 'Mã sinh viên', code: 'SVUI01', name: 'Sinh viên UI', personnel: false },
  { path: 'personnel', add: 'Thêm hồ sơ nhân sự', number: 'Mã nhân sự', code: 'GVUI01', name: 'Giảng viên UI', personnel: true },
 ]) {
  await page.getByRole('link', { name: profile.personnel ? 'Giảng viên & nhân sự' : 'Sinh viên', exact: true }).click()
  await page.getByRole('button', { name: profile.add, exact: true }).click()
  dialog = page.getByRole('dialog')
  await dialog.getByLabel(profile.number, { exact: true }).fill(profile.code)
  await dialog.getByLabel('Họ tên', { exact: true }).fill(profile.name)
  if (profile.personnel) {
   await dialog.getByLabel('Loại hồ sơ', { exact: true }).click()
   await page.getByTitle('Giảng viên', { exact: true }).click()
  }
  await dialog.getByRole('combobox', { name: 'Đơn vị', exact: true }).click()
  await page.getByText('UIORG · Khoa dữ liệu mới', { exact: true }).click()
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.getByRole('row').filter({ hasText: profile.code })).toContainText(profile.name)
  await page.getByRole('row').filter({ hasText: profile.code }).getByRole('button', { name: 'Xem / sửa' }).click()
  dialog = page.getByRole('dialog')
  await expect(dialog.getByLabel('Họ tên', { exact: true })).toHaveValue(profile.name)
  await dialog.getByLabel('Họ tên', { exact: true }).fill(profile.name + ' cập nhật')
  await dialog.getByLabel('Trạng thái', { exact: true }).click()
  await page.getByText('Ngừng hoạt động', { exact: true }).click()
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  await expect(page.getByRole('row').filter({ hasText: profile.code })).toContainText('Ngừng hoạt động')

 }
})
