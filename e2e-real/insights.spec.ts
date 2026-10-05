import { test, expect } from '@playwright/test'
import { readFile } from 'node:fs/promises'
test('real insights keep aggregate VND exact, export applied filters and expose selected-source recorded audit', async ({ page }) => {
 test.setTimeout(120000)
 await page.goto('/')
 await page.getByLabel('Email', { exact: true }).fill('browser-admin@example.test')
 await page.getByLabel('Mật khẩu', { exact: true }).fill(process.env.CAMPUS_TEST_PASSWORD!)
 await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
 await expect(page.getByRole('banner').getByText('browser-admin@example.test')).toBeVisible()
 const seed = await page.evaluate(async () => {
  const tokens = await navigator.locks.request('campus-auth-cookie', async () => (await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })).json())
  const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + tokens.accessToken }
  const post = async (path: string, body: unknown) => {
   const response = await fetch('/api/v1/admin/' + path, { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) })
   if (!response.ok) throw new Error('Insights seed failed: ' + response.status)
   return response.json()
  }
  const unit = await post('organization-units', { code: 'INORG', name: 'Khoa báo cáo', unitType: 'FACULTY', status: 'ACTIVE' })
  const student = await post('students', { studentNumber: 'INSV1', fullName: 'Sinh viên báo cáo', organizationUnitId: unit.id, status: 'ACTIVE' })
  const fee = await post('finance/fees', '{"code":"INMAX","name":"Phí tổng hợp","amount":9999999999999999999}')
  const charges = []
  for (const chargeNumber of ['INCH1', 'INCH2']) charges.push(await post('finance/charges', { chargeNumber, studentId: student.id, feeId: fee.id, dueDate: '2026-12-01' }))
  const event = await post('events', { code: 'INEVENT', title: '=2+2', description: 'Báo cáo giữ nguyên văn bản', startsAt: '2026-12-01T09:00:00Z', endsAt: '2026-12-01T10:00:00Z', capacity: 2 })
  const opened = await fetch('/api/v1/admin/events/' + event.id, { method: 'PUT', headers, body: JSON.stringify({ ...event, status: 'OPEN', expectedVersion: event.rowVersion }) })
  if (opened.status !== 200) throw new Error('Event open failed')
  await post('events/' + event.id + '/registrations', { studentId: student.id })
  return { studentId: student.id, chargeId: charges[0].id }
 })
 await page.goto('/admin/insights/dashboard')
 await expect(page.locator('.ant-card-head-title')).toHaveCount(8)
 await expect(page.getByText(/Thời điểm UTC:/)).toBeVisible()
 await page.getByRole('navigation', { name: 'Audit và báo cáo' }).getByRole('link', { name: 'Báo cáo', exact: true }).click()
 await page.getByRole('combobox', { name: 'Lọc sinh viên', exact: true }).click()
 await page.getByTitle('INSV1 · Sinh viên báo cáo', { exact: true }).click()
 const debtQuery = page.waitForResponse((response) => response.url().includes('/reports/STUDENT_DEBT?') && new URL(response.url()).searchParams.get('studentId') === seed.studentId)
 await page.getByRole('button', { name: 'Áp dụng bộ lọc', exact: true }).click()
 expect((await debtQuery).status()).toBe(200)
 const row = page.getByRole('row').filter({ hasText: seed.studentId })
 await expect(row.getByText('19.999.999.999.999.999.998 VND', { exact: true })).toHaveCount(2)
 const debtDownload = page.waitForEvent('download')
 await page.getByRole('button', { name: 'Tải CSV', exact: true }).click()
 const debtFile = await debtDownload
 expect(debtFile.suggestedFilename()).toBe('student_debt.csv')
 const debtText = await readFile((await debtFile.path())!, 'utf8')
 expect(debtText).toContain('"' + seed.studentId + '","2","19999999999999999998","0","19999999999999999998"')
 expect(debtText.split('\r\n').filter(Boolean)).toHaveLength(2)
 for (const [kind, label] of [['CURRENT_ACCOMMODATION', 'Chỗ ở hiện tại'], ['SECTION_ENROLLMENT', 'Ghi danh lớp học phần'], ['LIBRARY_LOANS', 'Sách đang mượn'], ['EVENT_MEMBERSHIP', 'Tham gia sự kiện']]) {
  await page.getByRole('combobox', { name: 'Loại báo cáo', exact: true }).click()
  const response = page.waitForResponse((value) => value.url().includes('/reports/' + kind + '?') && value.request().method() === 'GET')
  await page.getByTitle(label, { exact: true }).click()
  expect((await response).status()).toBe(200)
  await expect(page.getByRole('heading', { name: label, exact: true })).toBeVisible()
  await expect(page.getByText(/Thời điểm UTC:/)).toBeVisible()
 }
 await page.getByRole('combobox', { name: 'Lọc sinh viên', exact: true }).click()
 await page.getByTitle('INSV1 · Sinh viên báo cáo', { exact: true }).click()
 const eventQuery = page.waitForResponse((response) => response.url().includes('/reports/EVENT_MEMBERSHIP?') && new URL(response.url()).searchParams.get('studentId') === seed.studentId)
 await page.getByRole('button', { name: 'Áp dụng bộ lọc', exact: true }).click()
 expect((await eventQuery).status()).toBe(200)
 await expect(page.getByRole('row').filter({ hasText: seed.studentId }).getByText('=2+2', { exact: true })).toBeVisible()
 const eventDownload = page.waitForEvent('download')
 await page.getByRole('button', { name: 'Tải CSV', exact: true }).click()
 const eventFile = await eventDownload
 expect(eventFile.suggestedFilename()).toBe('event_membership.csv')
 expect(await readFile((await eventFile.path())!, 'utf8')).toContain('"\'=2+2"')

 const exportError = await page.evaluate(async () => {
  const modulePath = '/src/api/runtime.ts'
  const { api } = await import(modulePath)
  try {
   await api.downloadCsv('/api/v1/admin/reports/STUDENT_DEBT/export?resourceId=00000000-0000-0000-0000-000000000001')
   throw new Error('Unsupported export filter unexpectedly succeeded')
  } catch (error) {
   if (typeof error === 'object' && error !== null && 'status' in error && 'detail' in error) return { status: error.status, detail: error.detail }
   throw error
  }
 })
 expect(exportError).toMatchObject({ status: 400, detail: { code: 'INVALID_QUERY_PARAMETER' } })

 await page.getByRole('navigation', { name: 'Audit và báo cáo' }).getByRole('link', { name: 'Audit', exact: true }).click()
 await page.getByRole('combobox', { name: 'Nguồn audit', exact: true }).click()
 await page.getByTitle('FINANCE', { exact: true }).click()
 await page.getByRole('combobox', { name: 'Tài nguyên audit', exact: true }).click()
 await page.getByTitle('CHARGE', { exact: true }).click()
 await page.getByLabel('Đối tượng UUID', { exact: true }).fill(seed.chargeId)
 await page.getByLabel('Action', { exact: true }).fill('CREATED')
 const auditQuery = page.waitForResponse((response) => response.url().includes('/audits/FINANCE?') && new URL(response.url()).searchParams.get('targetId') === seed.chargeId)
 await page.getByRole('button', { name: 'Áp dụng bộ lọc', exact: true }).click()
 expect((await auditQuery).status()).toBe(200)
 await page.getByRole('row').filter({ hasText: seed.chargeId }).getByRole('button', { name: 'Xem audit', exact: true }).click()
 const dialog = page.getByRole('dialog')
 await expect(dialog.getByText('OPEN', { exact: true })).toBeVisible()
 await expect(dialog.getByText(seed.chargeId, { exact: true })).toBeVisible()
 await expect(dialog.getByRole('button', { name: 'Lưu', exact: true })).toHaveCount(0)
})
