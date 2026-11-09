import { test, expect } from '@playwright/test'

const permissions = [
 { role: 'ACADEMIC_AFFAIRS', owner: 'organization-units', link: 'Đơn vị' },
 { role: 'ACADEMIC_AFFAIRS', owner: 'students', link: 'Sinh viên' },
 { role: 'ACADEMIC_AFFAIRS', owner: 'faculty-staff', link: 'Giảng viên & nhân sự' },
 { role: 'ACADEMIC_AFFAIRS', owner: 'academic/programs', link: 'Học vụ' },
 { role: 'CAMPUS_SERVICES', owner: 'dormitory/buildings', link: 'Ký túc xá' },
 { role: 'CAMPUS_SERVICES', owner: 'notifications/templates', link: 'Thông báo' },
 { role: 'CAMPUS_SERVICES', owner: 'events', link: 'Sự kiện' },
 { role: 'CAMPUS_SERVICES', owner: 'library/titles', link: 'Thư viện' },
 { role: 'FINANCE', owner: 'finance/fees', link: 'Tài chính' },
 { role: 'AUDITOR', owner: 'audits/IDENTITY', link: 'Audit & báo cáo', unrelated: 'notifications/notices' },
 { role: 'AUDITOR', owner: 'reports/dashboard', link: 'Audit & báo cáo', unrelated: 'finance/fees' },
]
const absentLinks: Record<string, string> = {
 ACADEMIC_AFFAIRS: 'Tài chính',
 CAMPUS_SERVICES: 'Tài chính',
 FINANCE: 'Ký túc xá',
 AUDITOR: 'Sinh viên',
}
for (const permission of permissions) {
 test('real department access and denied escalation: ' + permission.role + ' / ' + permission.owner, async ({ page }) => {
  const viewer = permission.role === 'AUDITOR'
  const email = 'browser-' + permission.role.toLowerCase() + '@example.test'
  await page.goto('/')
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Mật khẩu', { exact: true }).fill(process.env.CAMPUS_TEST_PASSWORD!)
  await page.getByRole('button', { name: 'Đăng nhập', exact: true }).click()
  await expect(page.getByRole('banner').getByText(email, { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: permission.link, exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: absentLinks[permission.role], exact: true })).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Tài khoản', exact: true })).toHaveCount(0)
  const result = await page.evaluate(async ({ owner, unrelatedOwner }) => {
   return navigator.locks.request('campus-auth-cookie', async () => {
    const refresh = await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' })
    if (refresh.status !== 200) return { refresh: refresh.status }
    const credentials = await refresh.json()
    const headers = { Authorization: 'Bearer ' + credentials.accessToken, 'Content-Type': 'application/json' }
    const read = await fetch('/api/v1/admin/' + owner, { headers })
    const write = await fetch('/api/v1/admin/' + owner, { method: 'POST', headers, body: '{' })
    const escalation = await fetch('/api/v1/admin/users', { method: 'POST', headers, body: '{' })
    const unrelated = await fetch('/api/v1/admin/' + unrelatedOwner, { headers })
    return { read: read.status, write: write.status, escalation: escalation.status, unrelated: unrelated.status }
   })
  }, { owner: permission.owner, unrelatedOwner: permission.unrelated ?? 'reports/dashboard' })
  expect(result).toEqual({ read: 200, write: viewer ? 403 : 400, escalation: 403, unrelated: 403 })
  const ownerRequests: string[] = []
  page.on('request', (request) => { if (new URL(request.url()).pathname.startsWith('/api/v1/admin/users')) ownerRequests.push(request.url()) })
  await page.goto('/admin/users')
  await expect(page.getByText('Bạn không có quyền truy cập', { exact: true })).toBeVisible()
  expect(ownerRequests).toEqual([])
 })
}
