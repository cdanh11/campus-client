import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { api } from '../../api/runtime'
import { ApiError } from '../../api/client'
import { UserPage } from './UserPage'

vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
afterEach(() => vi.restoreAllMocks())
const user = { id: 'target', email: 'target@example.test', displayName: 'Target', roles: ['USER'], status: 'ACTIVE', rowVersion: 9223372036854775807n, securityVersion: 0, createdAt: '2026-10-04T00:00:00Z', updatedAt: '2026-10-04T00:00:00Z' }
function show() {
 vi.spyOn(api, 'request').mockImplementation(async (path) => path.includes('?') ? { content: [user], totalElements: 1, totalPages: 1, page: 0, size: 20 } : user)
 const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
 return render(<AntApp><QueryClientProvider client={client}><UserPage /></QueryClientProvider></AntApp>)
}
it('sends the exact current version for password reset and blocks repeated stale writes', async () => {
 const mutation = vi.spyOn(api, 'mutation').mockRejectedValue(new ApiError(409, { code: 'CONCURRENT_MODIFICATION' }))
 show()
 await userEvent.click(await screen.findByRole('button', { name: 'Đặt lại mật khẩu' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText('target@example.test')
 await userEvent.type(dialog.getByLabelText('Mật khẩu mới'), 'Test-only-password-123')
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await dialog.findByText('Mã lỗi: CONCURRENT_MODIFICATION')
 expect(mutation).toHaveBeenCalledWith('/api/v1/admin/users/target/password-reset', 'POST', { newPassword: 'Test-only-password-123', expectedVersion: 9223372036854775807n })
 expect(dialog.getByRole('button', { name: 'Lưu' })).toBeDisabled()
 expect(mutation).toHaveBeenCalledTimes(1)
 await userEvent.click(dialog.getByRole('button', { name: 'Đóng biểu mẫu' }))
 await userEvent.click(screen.getByRole('button', { name: 'Đặt lại mật khẩu' }))
 expect(within(screen.getByRole('dialog')).getByLabelText('Mật khẩu mới')).toHaveValue('')
}, 15000)
