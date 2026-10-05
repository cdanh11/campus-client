import { expect, test, type Page } from '@playwright/test'
import { parseJson } from '../src/api/json'
async function login(page: Page) {
 await page.goto('/')
 await page.getByLabel('Email', { exact: true }).fill('browser-admin@example.test')
 await page.getByLabel('Mật khẩu', { exact: true }).fill(process.env.CAMPUS_TEST_PASSWORD!)
 await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
 await expect(page.getByRole('banner').getByText('browser-admin@example.test')).toBeVisible()
}
async function seed(page: Page, prefix: string) {
 await page.evaluate(async (prefix) => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  const post = async (path: string, body: unknown) => {
   const response = await fetch('/api/v1/admin/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokens.accessToken }, body: JSON.stringify(body) })
   if (response.status !== 201) throw new Error('Fixture creation failed ' + response.status)
   return response.json()
  }
  const unit = await post('organization-units', { code: prefix + 'ORG', name: prefix + ' Organization', unitType: 'FACULTY', status: 'ACTIVE' })
  for (const number of [1, 2]) await post('students', { studentNumber: prefix + 'SV' + number, fullName: prefix + ' Student ' + number, organizationUnitId: unit.id, status: 'ACTIVE' })
 }, prefix)
}
async function select(page: Page, label: string, choice: string) {
 await page.getByRole('dialog').getByRole('combobox', { name: label, exact: true }).click()
 await page.getByTitle(choice, { exact: true }).click()
 await expect(page.getByRole('dialog').getByTitle(choice, { exact: true })).toBeVisible()
}
async function navigate(page: Page, title: string) {
 await page.getByRole('navigation', { name: 'Ký túc xá và tài chính' }).getByRole('link', { name: title, exact: true }).click()
 await expect(page.getByRole('heading', { name: title, exact: true })).toBeVisible()
}
async function save(page: Page, path: string, method: string) {
 const response = page.waitForResponse((response) => new URL(response.url()).pathname.startsWith(path) && response.request().method() === method)
 await page.getByRole('dialog').getByRole('button', { name: 'Lưu', exact: true }).click()
 return response
}
test('real Dormitory inventory prevents occupied-bed deactivation and preserves released stays', async ({ page }) => {
 test.setTimeout(120_000)
 await login(page); await seed(page, 'OPS')
 await page.goto('/admin/operations/buildings')
 for (const item of [
  { title: 'Tòa ký túc xá', add: 'Thêm tòa ký túc xá', code: 'OPSB', name: 'Tòa UI', resource: 'buildings' },
  { title: 'Phòng ký túc xá', add: 'Thêm phòng', code: 'OPSR', name: 'Phòng UI', resource: 'rooms', parent: 'Tòa nhà', choice: 'OPSB · Tòa UI' },
  { title: 'Giường', add: 'Thêm giường', code: 'OPSBED', name: 'Giường UI', resource: 'beds', parent: 'Phòng', choice: 'OPSR · Phòng UI' },
 ]) {
  await navigate(page, item.title)
  await page.getByRole('button', { name: item.add, exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Mã', { exact: true }).fill(item.code)
  await dialog.getByLabel('Tên', { exact: true }).fill(item.name)
  if (item.parent) await select(page, item.parent, item.choice!)
  expect((await save(page, '/api/v1/admin/dormitory/' + item.resource, 'POST')).status()).toBe(201)
  await expect(dialog).not.toBeVisible()
 }
 await navigate(page, 'Phân chỗ ở')
 await page.getByRole('button', { name: 'Thêm phân chỗ', exact: true }).click()
 await select(page, 'Sinh viên', 'OPSSV1 · OPS Student 1')
 await select(page, 'Giường', 'OPSBED · Giường UI')
 const original = await (await save(page, '/api/v1/admin/dormitory/assignments', 'POST')).json()
 await expect(page.getByRole('dialog')).not.toBeVisible()
 await page.getByRole('button', { name: 'Thêm phân chỗ', exact: true }).click()
 await select(page, 'Sinh viên', 'OPSSV2 · OPS Student 2')
 await select(page, 'Giường', 'OPSBED · Giường UI')
 expect((await save(page, '/api/v1/admin/dormitory/assignments', 'POST')).status()).toBe(409)
 await expect(page.getByRole('dialog').getByText('Mã lỗi: ACCOMMODATION_ALREADY_ASSIGNED')).toBeVisible()
 await page.getByRole('dialog').getByRole('button', { name: 'Hủy', exact: true }).click()
 await navigate(page, 'Giường')
 await page.getByRole('row').filter({ hasText: 'OPSBED' }).getByRole('button', { name: 'Xem / sửa' }).click()
 await expect(page.getByRole('dialog').getByRole('combobox', { name: 'Phòng', exact: true })).toBeDisabled()
 await select(page, 'Trạng thái', 'INACTIVE')
 expect((await save(page, '/api/v1/admin/dormitory/beds', 'PUT')).status()).toBe(409)
 await expect(page.getByRole('dialog').getByText('Mã lỗi: INVALID_DORMITORY_STATE')).toBeVisible()
 await page.getByRole('dialog').getByRole('button', { name: 'Hủy', exact: true }).click()
 await navigate(page, 'Phân chỗ ở')
 await page.getByRole('row').filter({ hasText: 'OPSSV1' }).getByRole('button', { name: 'Xem / sửa' }).click()
 await select(page, 'Thao tác', 'RELEASED')
 const released = await (await save(page, '/api/v1/admin/dormitory/assignments', 'PUT')).json()
 expect(released.id).toBe(original.id)
 expect(released.status).toBe('RELEASED')
 expect(released.releasedAt).not.toBeNull()
 await expect(page.getByRole('dialog')).not.toBeVisible()
 await page.getByRole('button', { name: 'Thêm phân chỗ', exact: true }).click()
 await select(page, 'Sinh viên', 'OPSSV1 · OPS Student 1')
 await select(page, 'Giường', 'OPSBED · Giường UI')
 const next = await (await save(page, '/api/v1/admin/dormitory/assignments', 'POST')).json()
 expect(next.id).not.toBe(original.id)
 await expect(page.getByRole('dialog')).not.toBeVisible()
 const history = page.getByRole('row').filter({ hasText: 'OPSSV1' }).filter({ hasText: 'RELEASED' })
 await history.getByRole('button', { name: 'Xem / sửa' }).click()
 await expect(page.getByRole('dialog').getByRole('button', { name: 'Lưu', exact: true })).toHaveCount(0)
})

test('real Finance keeps exact VND snapshots, partial payments, overpayment rejection and reversal history', async ({ page }) => {
 test.setTimeout(120_000)
 await login(page); await seed(page, 'FIN')
 await page.goto('/admin/operations/fees')
 await page.getByRole('button', { name: 'Thêm biểu phí', exact: true }).click()
 let dialog = page.getByRole('dialog')
 await dialog.getByLabel('Mã', { exact: true }).fill('FINFEE')
 await dialog.getByLabel('Tên phí', { exact: true }).fill('Phí UI ban đầu')
 await dialog.getByLabel('Số tiền VND', { exact: true }).fill('9999999999999999999')
 const feeResponse = await save(page, '/api/v1/admin/finance/fees', 'POST')
 expect(feeResponse.status()).toBe(201)
 expect((parseJson(await feeResponse.text()) as { amount: bigint }).amount).toBe(9999999999999999999n)
 await expect(dialog).not.toBeVisible()
 await navigate(page, 'Khoản thu')
 await page.getByRole('button', { name: 'Thêm khoản thu', exact: true }).click()
 await dialog.getByLabel('Mã khoản thu', { exact: true }).fill('FINCHARGE')
 await select(page, 'Sinh viên', 'FINSV1 · FIN Student 1')
 await select(page, 'Biểu phí', 'FINFEE · Phí UI ban đầu')
 await dialog.getByLabel('Hạn thanh toán', { exact: true }).fill('2026-12-31')
 const chargeResponse = await save(page, '/api/v1/admin/finance/charges', 'POST')
 expect(chargeResponse.status()).toBe(201)
 const charge = parseJson(await chargeResponse.text()) as { amount: bigint; feeName: string }
 expect(charge.amount).toBe(9999999999999999999n)
 expect(charge.feeName).toBe('Phí UI ban đầu')
 await expect(dialog).not.toBeVisible()
 await navigate(page, 'Biểu phí')
 await page.getByRole('row').filter({ hasText: 'FINFEE' }).getByRole('button', { name: 'Xem / sửa' }).click()
 await expect(dialog.getByLabel('Số tiền VND')).toHaveValue('9999999999999999999')
 await dialog.getByLabel('Số tiền VND').fill('100')
 await dialog.getByLabel('Tên phí').fill('Phí UI mới')
 expect((await save(page, '/api/v1/admin/finance/fees', 'PUT')).status()).toBe(200)
 await expect(dialog).not.toBeVisible()
 await navigate(page, 'Khoản thu')
 await expect(page.getByRole('row').filter({ hasText: 'FINCHARGE' })).toContainText('Phí UI ban đầu')
 await expect(page.getByRole('row').filter({ hasText: 'FINCHARGE' })).toContainText('9.999.999.999.999.999.999 VND')
 await navigate(page, 'Biên nhận thanh toán')
 for (const payment of [
  { number: 'FINRECEIPT', amount: '9007199254740993', success: true },
  { number: 'FINOVERPAY', amount: '9999999999999999999', success: false },
 ]) {
  await page.getByRole('button', { name: 'Ghi nhận thanh toán', exact: true }).click()
  dialog = page.getByRole('dialog')
  await dialog.getByLabel('Mã biên nhận', { exact: true }).fill(payment.number)
  await select(page, 'Khoản thu', 'FINCHARGE · Phí UI ban đầu')
  await dialog.getByLabel('Số tiền VND', { exact: true }).fill(payment.amount)
  await expect(dialog.getByRole('button', { name: 'Lưu', exact: true })).toBeEnabled()
  const response = await save(page, '/api/v1/admin/finance/payments', 'POST')
  expect(response.status()).toBe(payment.success ? 201 : 409)
  if (payment.success) {
   expect((parseJson(await response.text()) as { amount: bigint }).amount).toBe(9007199254740993n)
   expect(response.request().postData()).toContain('"amount":9007199254740993')
   await expect(dialog).not.toBeVisible()
  } else {
   await expect(dialog.getByText('Mã lỗi: PAYMENT_EXCEEDS_BALANCE')).toBeVisible()
   await dialog.getByRole('button', { name: 'Đóng biểu mẫu', exact: true }).click()
  }
 }
 await navigate(page, 'Khoản thu')
 await page.getByRole('row').filter({ hasText: 'FINCHARGE' }).getByRole('button', { name: 'Xem / sửa' }).click()
 dialog = page.getByRole('dialog')
 await expect(dialog.getByText('9.007.199.254.740.993 VND', { exact: true })).toBeVisible()
 await select(page, 'Thao tác', 'CANCELLED')
 expect((await save(page, '/api/v1/admin/finance/charges', 'PUT')).status()).toBe(409)
 await expect(dialog.getByText('Mã lỗi: INVALID_FINANCE_STATE')).toBeVisible()
 await dialog.getByRole('button', { name: 'Hủy', exact: true }).click()
 await navigate(page, 'Biên nhận thanh toán')
 await page.getByRole('row').filter({ hasText: 'FINRECEIPT' }).getByRole('button', { name: 'Đảo biên nhận', exact: true }).click()
 dialog = page.getByRole('dialog')
 await dialog.getByLabel('Lý do đảo', { exact: true }).fill('Ghi nhận nhầm, giữ lịch sử')
 await expect(dialog.getByRole('button', { name: 'Lưu', exact: true })).toBeEnabled()
 const reversalResponse = await save(page, '/api/v1/admin/finance/payments', 'PUT')
 expect(reversalResponse.status()).toBe(200)
 const reversed = parseJson(await reversalResponse.text()) as { amount: bigint; status: string; reversalReason: string }
 expect(reversed.amount).toBe(9007199254740993n)
 expect(reversed.status).toBe('REVERSED')
 expect(reversed.reversalReason).toBe('Ghi nhận nhầm, giữ lịch sử')
 await expect(dialog).not.toBeVisible()
 await expect(page.getByRole('row').filter({ hasText: 'FINRECEIPT' }).getByRole('button', { name: 'Đảo biên nhận', exact: true })).toBeDisabled()
 await navigate(page, 'Khoản thu')
 await page.getByRole('row').filter({ hasText: 'FINCHARGE' }).getByRole('button', { name: 'Xem / sửa' }).click()
 await expect(dialog.getByText('0 VND', { exact: true })).toBeVisible()
 await select(page, 'Thao tác', 'CANCELLED')
 expect((await save(page, '/api/v1/admin/finance/charges', 'PUT')).status()).toBe(200)
 await expect(dialog).not.toBeVisible()
 await page.getByRole('row').filter({ hasText: 'FINCHARGE' }).getByRole('button', { name: 'Xem / sửa' }).click()
 await expect(dialog.getByRole('button', { name: 'Lưu', exact: true })).toHaveCount(0)
 await expect(dialog.getByText('Còn phải thu', { exact: true })).toBeVisible()
})
