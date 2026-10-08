import { test, expect } from '@playwright/test'

const permissions = [
 { role: 'ORGANIZATION_ADMIN', owner: 'organization-units', link: 'Đơn vị' },
 { role: 'STUDENT_ADMIN', owner: 'students', link: 'Sinh viên' },
 { role: 'PERSONNEL_ADMIN', owner: 'faculty-staff', link: 'Giảng viên & nhân sự' },
 { role: 'ACADEMIC_ADMIN', owner: 'academic/programs', link: 'Học vụ' },
 { role: 'DORMITORY_ADMIN', owner: 'dormitory/buildings', link: 'Ký túc xá & tài chính' },
 { role: 'FINANCE_ADMIN', owner: 'finance/fees', link: 'Ký túc xá & tài chính' },
 { role: 'NOTIFICATION_ADMIN', owner: 'notifications/templates', link: 'Thông báo' },
 { role: 'EVENT_ADMIN', owner: 'events', link: 'Sự kiện' },
 { role: 'LIBRARY_ADMIN', owner: 'library/titles', link: 'Thư viện' },
 { role: 'AUDIT_VIEWER', owner: 'audits/IDENTITY', link: 'Audit & báo cáo' },
 { role: 'REPORTING_VIEWER', owner: 'reports/dashboard', link: 'Audit & báo cáo' },
]
for (const permission of permissions) {
 test('real functional access and denied escalation: ' + permission.role, async ({ page }) => {
  const email = 'browser-' + permission.role.toLowerCase() + '@example.test'
  await page.goto('/')
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Mật khẩu', { exact: true }).fill(process.env.CAMPUS_TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page.getByRole('banner').getByText(email, { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: permission.link, exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Tài khoản', exact: true })).toHaveCount(0)
  const result = await page.evaluate(async ({ owner, viewer }) => {
   return navigator.locks.request('campus-auth-cookie', async () => {
    const refresh = await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })
    if (refresh.status !== 200) return { refresh: refresh.status }
    const credentials = await refresh.json()
    const headers = { Authorization: 'Bearer ' + credentials.accessToken, 'Content-Type': 'application/json' }
    const read = await fetch('/api/v1/admin/' + owner, { headers })
    const write = await fetch('/api/v1/admin/' + owner, { method: 'POST', headers, body: '{' })
    const escalation = await fetch('/api/v1/admin/users', { method: 'POST', headers, body: '{' })
    const unrelated = await fetch('/api/v1/admin/' + (viewer ? 'notifications/notices' : 'reports/dashboard'), { headers })
    return { read: read.status, write: write.status, escalation: escalation.status, unrelated: unrelated.status }
   })
  }, { owner: permission.owner, viewer: permission.role.endsWith('_VIEWER') })
  expect(result).toEqual({ read: 200, write: permission.role.endsWith('_VIEWER') ? 403 : 400, escalation: 403, unrelated: 403 })
  const ownerRequests: string[] = []
  page.on('request', (request) => { if (new URL(request.url()).pathname.startsWith('/api/v1/admin/users')) ownerRequests.push(request.url()) })
  await page.goto('/admin/users')
  await expect(page.getByText('Bạn không có quyền truy cập', { exact: true })).toBeVisible()
  expect(ownerRequests).toEqual([])
 })
}
