import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import Workspace from './Workspace'
import { api } from '../api/runtime'
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
 expect(screen.getByRole('link', { name: 'Cổng cá nhân' })).toBeInTheDocument()
})
it('rejects a direct ADMIN route without issuing owner API calls', () => {
 const request = vi.spyOn(api, 'request')
 renderAt('/admin/students')
 expect(screen.getByText('Bạn không có quyền truy cập')).toBeInTheDocument()
 expect(request).not.toHaveBeenCalled()
})

it('shows only the functional navigation of a finance administrator', () => {
 renderAt('/', { ...user, roles: ['FINANCE_ADMIN'] })
 expect(screen.getByRole('link', { name: 'Ký túc xá & tài chính' })).toBeInTheDocument()
 expect(screen.queryByRole('link', { name: 'Sinh viên' })).not.toBeInTheDocument()
 expect(screen.queryByRole('link', { name: 'Tài khoản' })).not.toBeInTheDocument()
 expect(screen.queryByRole('link', { name: 'Audit & báo cáo' })).not.toBeInTheDocument()
})
it.each([
 ['FINANCE_ADMIN', '/admin/students'],
 ['FINANCE_ADMIN', '/admin/operations/buildings'],
 ['DORMITORY_ADMIN', '/admin/operations/payments'],
 ['AUDIT_VIEWER', '/admin/insights/dashboard'],
 ['REPORTING_VIEWER', '/admin/insights/audits'],
 ['EVENT_ADMIN', '/admin/users'],
 ['ACADEMIC_ADMIN', '/admin/personnel'],
])('rejects %s direct access to %s before owner requests', async (role, path) => {
 const request = vi.spyOn(api, 'request')
 renderAt(path, { ...user, roles: [role] })
 expect(await screen.findByText('Bạn không có quyền truy cập')).toBeInTheDocument()
 expect(request).not.toHaveBeenCalled()
})
it('offers useful overview destinations for combined functional roles', async () => {
 renderAt('/admin', { ...user, roles: ['EVENT_ADMIN', 'LIBRARY_ADMIN'] })
 expect(await screen.findByRole('link', { name: 'Mở Sự kiện' })).toHaveAttribute('href', '/admin/events')
 expect(screen.getByRole('link', { name: 'Mở Thư viện' })).toHaveAttribute('href', '/admin/library')
 expect(screen.queryByRole('link', { name: 'Mở Tài khoản' })).not.toBeInTheDocument()
})
