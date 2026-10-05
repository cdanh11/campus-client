import { test, expect, type Page } from '@playwright/test'
async function save(page: Page, path: string, method: string) {
 const response = page.waitForResponse((value) => new URL(value.url()).pathname === path && value.request().method() === method)
 await page.getByRole('dialog').getByRole('button', { name: 'Lưu', exact: true }).click()
 return response
}
test('real Library enforces occupied copies, server due date and retained return history after inactive references', async ({ page }) => {
 test.setTimeout(120000)
 await page.goto('/')
 await page.getByLabel('Email', { exact: true }).fill('browser-admin@example.test')
 await page.getByLabel('Mật khẩu', { exact: true }).fill(process.env.CAMPUS_TEST_PASSWORD!)
 await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
 await expect(page.getByRole('banner').getByText('browser-admin@example.test')).toBeVisible()
 const student = await page.evaluate(async () => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  const post = async (path: string, body: unknown) => {
   const response = await fetch('/api/v1/admin/' + path, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokens.accessToken }, body: JSON.stringify(body) })
   if (!response.ok) throw new Error('Library seed failed: ' + response.status)
   return response.json()
  }
  const unit = await post('organization-units', { code: 'LBORG', name: 'Khoa Library', unitType: 'FACULTY', status: 'ACTIVE' })
  return post('students', { studentNumber: 'LBSV1', fullName: 'Sinh viên Library', organizationUnitId: unit.id, status: 'ACTIVE' })
 })
 await page.goto('/admin/library/titles')
 const dialog = page.getByRole('dialog')
 await page.getByRole('button', { name: 'Thêm đầu sách', exact: true }).click()
 for (const [label, value] of [['Mã', 'LBUI'], ['Tên sách', 'Sách UI'], ['Tác giả', 'Tác giả UI']]) await dialog.getByLabel(label, { exact: true }).fill(value)
 const titleResponse = await save(page, '/api/v1/admin/library/titles', 'POST')
 expect(titleResponse.status()).toBe(201)
 const title = await titleResponse.json()
 await expect(dialog).not.toBeVisible()
 await page.getByRole('navigation', { name: 'Quản trị thư viện' }).getByRole('link', { name: 'Bản sao sách', exact: true }).click()
 await page.getByRole('button', { name: 'Thêm bản sao', exact: true }).click()
 await dialog.getByRole('combobox', { name: 'Đầu sách', exact: true }).click()
 await page.getByTitle('LBUI · Sách UI', { exact: true }).click()
 await dialog.getByLabel('Mã', { exact: true }).fill('LBCP')
 const copyResponse = await save(page, '/api/v1/admin/library/copies', 'POST')
 expect(copyResponse.status()).toBe(201)
 const copy = await copyResponse.json()
 await expect(dialog).not.toBeVisible()
 await page.getByRole('navigation', { name: 'Quản trị thư viện' }).getByRole('link', { name: 'Mượn và trả sách', exact: true }).click()
 let firstLoan: { id: string; borrowedAt: string; dueAt: string; createdAt: string; rowVersion: number } | undefined
 for (let attempt = 0; attempt < 2; attempt++) {
  await page.getByRole('button', { name: 'Thêm lượt mượn', exact: true }).click()
  await dialog.getByRole('combobox', { name: 'Bản sao', exact: true }).click()
  await page.getByTitle('LBCP', { exact: true }).click()
  await dialog.getByRole('combobox', { name: 'Sinh viên', exact: true }).click()
  await page.getByTitle('LBSV1 · Sinh viên Library', { exact: true }).click()
  const response = await save(page, '/api/v1/admin/library/loans', 'POST')
  if (attempt === 0) {
   expect(response.status()).toBe(201)
   firstLoan = await response.json()
   expect(Date.parse(firstLoan!.dueAt) - Date.parse(firstLoan!.borrowedAt)).toBe(14 * 86400000)
   await expect(dialog).not.toBeVisible()
  } else {
   expect(response.status()).toBe(409)
   await expect(dialog.getByText('Mã lỗi: LIBRARY_COPY_ALREADY_LOANED')).toBeVisible()
   await dialog.getByRole('button', { name: 'Hủy', exact: true }).click()
  }
 }
 await page.evaluate(async (data) => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  for (const [path, record] of [['library/titles', data.title], ['library/copies', data.copy], ['students', data.student]] as const) {
   const response = await fetch('/api/v1/admin/' + path + '/' + record.id, { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokens.accessToken }, body: JSON.stringify({ ...record, status: 'INACTIVE', expectedVersion: record.rowVersion }) })
   if (response.status !== 200) throw new Error('Deactivation failed: ' + response.status)
  }
 }, { title, copy, student })
 await page.getByRole('row').filter({ hasText: 'LBSV1' }).getByRole('button', { name: 'Xem / sửa' }).click()
 await expect(dialog.getByRole('combobox', { name: 'Bản sao', exact: true })).toBeDisabled()
 await dialog.getByLabel('Thao tác', { exact: true }).click()
 await page.getByTitle('RETURN', { exact: true }).click()
 const returnResponse = await save(page, '/api/v1/admin/library/loans/' + firstLoan!.id + '/return', 'PUT')
 expect(returnResponse.status()).toBe(200)
 const returned = await returnResponse.json()
 expect(returned.id).toBe(firstLoan!.id)
 expect(returned.borrowedAt).toBe(firstLoan!.borrowedAt)
 expect(returned.dueAt).toBe(firstLoan!.dueAt)
 expect(returned.createdAt).toBe(firstLoan!.createdAt)
 expect(returned.returnedAt).not.toBeNull()
 expect(returned.status).toBe('RETURNED')
 await expect(dialog).not.toBeVisible()
 await page.getByRole('row').filter({ hasText: 'LBSV1' }).getByRole('button', { name: 'Xem / sửa' }).click()
 await expect(dialog.getByText(/Trạng thái hiện tại: RETURNED/)).toBeVisible()
 await expect(dialog.getByRole('button', { name: 'Lưu', exact: true })).toHaveCount(0)
 await dialog.getByRole('button', { name: 'Hủy', exact: true }).click()
 const nextLoan = await page.evaluate(async (ids) => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokens.accessToken }
  for (const [path, id] of [['library/titles', ids.title], ['library/copies', ids.copy], ['students', ids.student]]) {
   const current = await (await fetch('/api/v1/admin/' + path + '/' + id, { headers })).json()
   const response = await fetch('/api/v1/admin/' + path + '/' + id, { method: 'PUT', headers, body: JSON.stringify({ ...current, status: 'ACTIVE', expectedVersion: current.rowVersion }) })
   if (response.status !== 200) throw new Error('Reactivation failed: ' + response.status)
  }
  const response = await fetch('/api/v1/admin/library/loans', { method: 'POST', headers, body: JSON.stringify({ copyId: ids.copy, studentId: ids.student }) })
  if (response.status !== 201) throw new Error('Subsequent borrow failed: ' + response.status)
  return response.json()
 }, { title: title.id, copy: copy.id, student: student.id })
 expect(nextLoan.id).not.toBe(firstLoan!.id)
 await page.reload()
 await expect(page.getByRole('row').filter({ hasText: 'LBSV1' })).toHaveCount(2)
})
