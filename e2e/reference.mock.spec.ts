import { expect, test } from '@playwright/test'
test('pointer-selected owner references survive asynchronous query updates and submission', async ({ page }) => {
 const unit = { id: '00000000-0000-4000-8000-000000000001', code: 'UXORG', name: 'Đơn vị UX', unitType: 'FACULTY', status: 'ACTIVE', rowVersion: 0 }
 const user = { id: 'mock-user', email: 'ux@example.test', status: 'ACTIVE', roles: ['ADMIN'] }
 const submitted: Record<string, unknown>[] = []
 await page.route('**/api/v1/**', async (route) => {
  const path = new URL(route.request().url()).pathname
  if (path.endsWith('/refresh')) return route.fulfill({ json: { accessToken: 'mock' } })
  if (path.endsWith('/me')) return route.fulfill({ json: user })
  if (path === '/api/v1/admin/organization-units/' + unit.id) return route.fulfill({ json: unit })
  if (path === '/api/v1/admin/organization-units') return route.fulfill({ json: { content: [unit], totalElements: 1, totalPages: 1 } })
  if (route.request().method() === 'POST') {
   const body = route.request().postDataJSON()
   submitted.push(body)
   return route.fulfill({ status: 201, json: { id: crypto.randomUUID(), ...body, rowVersion: 0 } })
  }
  return route.fulfill({ json: { content: [], totalElements: 0, totalPages: 0 } })
 })
 await page.goto('/admin/academic/programs')
 for (let i = 0; i < 5; i++) {
  await page.getByRole('button', { name: 'Thêm chương trình', exact: true }).click()
  const dialog = page.getByRole('dialog')
  await dialog.getByLabel('Mã', { exact: true }).fill('UXP' + i)
  await dialog.getByLabel('Tên chương trình', { exact: true }).fill('Chương trình UX')
  await dialog.getByRole('combobox', { name: 'Đơn vị', exact: true }).click()
  await page.getByTitle('UXORG · Đơn vị UX', { exact: true }).click()
  await expect(dialog.getByTitle('UXORG · Đơn vị UX', { exact: true })).toBeVisible()
  await dialog.getByRole('button', { name: 'Lưu', exact: true }).click()
  await expect(dialog).not.toBeVisible()
  expect(submitted[i].organizationUnitId).toBe(unit.id)
 }
})
