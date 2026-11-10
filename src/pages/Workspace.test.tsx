import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import Workspace from './Workspace'
import { api } from '../api/runtime'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
const user = { id: '1', email: 'user@example.test', status: 'ACTIVE', roles: ['USER'] }
function renderAt(entry: string, account = user) {
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 return render(<QueryClientProvider client={client}><MemoryRouter initialEntries={[entry]}><Workspace user={account} onLogout={() => {}} /></MemoryRouter></QueryClientProvider>)
}
it('keeps ADMIN navigation and data out of a regular account shell', () => {
 vi.spyOn(api, 'request').mockResolvedValue({ content: [], totalElements: 0 })
 renderAt('/')
 expect(screen.queryByRole('link', { name: 'Sinh viên' })).not.toBeInTheDocument()
 expect(screen.queryByRole('link', { name: 'Quản trị' })).not.toBeInTheDocument()
 expect(screen.getByRole('link', { name: 'Tổng quan' })).toHaveAttribute('href', '/portal/overview')
 expect(screen.getByRole('link', { name: 'Hồ sơ cá nhân' })).toHaveAttribute('href', '/portal/profile')
})
it('rejects a direct ADMIN route without issuing owner API calls', () => {
 const request = vi.spyOn(api, 'request')
 renderAt('/admin/students')
 expect(screen.getByText('Bạn không có quyền truy cập')).toBeInTheDocument()
 expect(request.mock.calls.some(([path]) => String(path).startsWith('/api/v1/admin'))).toBe(false)
 expect(request.mock.calls.some(([path]) => String(path).includes('/me/'))).toBe(false)
})

it('shows only the department navigation of a finance account', () => {
 renderAt('/', { ...user, roles: ['FINANCE'] })
 expect(screen.getByRole('link', { name: 'Tài chính' })).toHaveAttribute('href', '/admin/operations/fees')
 expect(screen.queryByRole('link', { name: 'Ký túc xá' })).not.toBeInTheDocument()
 expect(screen.queryByRole('link', { name: 'Sinh viên' })).not.toBeInTheDocument()
 expect(screen.queryByRole('link', { name: 'Tài khoản' })).not.toBeInTheDocument()
 expect(screen.queryByRole('link', { name: 'Audit & báo cáo' })).not.toBeInTheDocument()
})
it('groups the campus services department under one navigation set', () => {
 renderAt('/', { ...user, roles: ['CAMPUS_SERVICES'] })
 for (const [name, href] of [['Ký túc xá', '/admin/operations/buildings'], ['Sự kiện', '/admin/events'], ['Thư viện', '/admin/library']] as const) {
  expect(screen.getByRole('link', { name })).toHaveAttribute('href', href)
 }
 expect(screen.queryByRole('link', { name: 'Tài chính' })).not.toBeInTheDocument()
 expect(screen.queryByRole('link', { name: 'Học vụ' })).not.toBeInTheDocument()
})
it('keeps the auditor read-only navigation free of operator areas', () => {
 renderAt('/', { ...user, roles: ['AUDITOR'] })
 expect(screen.getByRole('link', { name: 'Audit & báo cáo' })).toBeInTheDocument()
 for (const name of ['Sinh viên', 'Tài chính', 'Ký túc xá', 'Tài khoản']) {
  expect(screen.queryByRole('link', { name })).not.toBeInTheDocument()
 }
})
it.each([
 ['FINANCE', '/admin/students'],
 ['FINANCE', '/admin/operations/buildings'],
 ['CAMPUS_SERVICES', '/admin/operations/fees'],
 ['CAMPUS_SERVICES', '/admin/academic'],
 ['ACADEMIC_AFFAIRS', '/admin/notifications'],
 ['ACADEMIC_AFFAIRS', '/admin/operations/fees'],
 ['AUDITOR', '/admin/users'],
 ['AUDITOR', '/admin/operations/fees'],
 ['USER', '/admin/insights/dashboard'],
])('rejects %s direct access to %s before owner requests', async (role, path) => {
 const request = vi.spyOn(api, 'request')
 renderAt(path, { ...user, roles: [role] })
 expect(await screen.findByText('Bạn không có quyền truy cập')).toBeInTheDocument()
 expect(request.mock.calls.some(([called]) => String(called).startsWith('/api/v1/admin'))).toBe(false)
})
it('offers useful overview destinations for combined department roles', async () => {
 renderAt('/admin', { ...user, roles: ['CAMPUS_SERVICES', 'FINANCE'] })
 expect(await screen.findByRole('link', { name: 'Mở Sự kiện' })).toHaveAttribute('href', '/admin/events')
 expect(screen.getByRole('link', { name: 'Mở Thư viện' })).toHaveAttribute('href', '/admin/library')
 expect(screen.getByRole('link', { name: 'Mở Tài chính' })).toHaveAttribute('href', '/admin/operations/fees')
 expect(screen.queryByRole('link', { name: 'Mở Tài khoản' })).not.toBeInTheDocument()
})
