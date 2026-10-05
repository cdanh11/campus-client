import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it, vi } from 'vitest'
import Workspace from './Workspace'
import { api } from '../api/runtime'
const user = { id: '1', email: 'user@example.test', status: 'ACTIVE', roles: ['USER'] }
it('keeps ADMIN navigation and data out of a regular account shell', () => {
 render(<MemoryRouter><Workspace user={user} onLogout={() => {}} /></MemoryRouter>)
 expect(screen.queryByRole('link', { name: 'Sinh viên' })).not.toBeInTheDocument()
 expect(screen.queryByRole('link', { name: 'Quản trị' })).not.toBeInTheDocument()
 expect(screen.getByRole('link', { name: 'Cổng cá nhân' })).toBeInTheDocument()
})
it('rejects a direct ADMIN route without issuing owner API calls', () => {
 const request = vi.spyOn(api, 'request')
 render(<MemoryRouter initialEntries={['/admin/students']}><Workspace user={user} onLogout={() => {}} /></MemoryRouter>)
 expect(screen.getByText('Bạn không có quyền truy cập')).toBeInTheDocument()
 expect(request).not.toHaveBeenCalled()
})
