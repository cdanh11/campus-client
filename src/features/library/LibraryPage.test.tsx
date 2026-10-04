import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { api } from '../../api/runtime'
import { ApiError } from '../../api/client'
import { RegistryPage } from '../people/RegistryPage'
import { loans } from './resources'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
afterEach(() => vi.restoreAllMocks())
function show(status = 'OPEN') {
 const current = { id: 'l', copyId: 'c', studentId: 's', status, rowVersion: 9223372036854775806n }
 vi.spyOn(api, 'request').mockImplementation(async (path) => {
  if (path.includes('/loans?')) return { content: [current], totalElements: 1, totalPages: 1 }
  if (path.endsWith('/loans/l')) return current
  if (path.endsWith('/copies/c')) return { id: 'c', code: 'CP1', status: 'INACTIVE' }
  if (path.endsWith('/students/s')) return { id: 's', studentNumber: 'SV1', fullName: 'Sinh viên', status: 'INACTIVE' }
  return { content: [], totalElements: 0, totalPages: 0 }
 })
 const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
 render(<AntApp><QueryClientProvider client={client}><RegistryPage resource={loans} /></QueryClientProvider></AntApp>)
 return current
}
it('requires explicit return and blocks stale retry while retaining inactive references', async () => {
 const current = show()
 const mutation = vi.spyOn(api, 'mutation').mockRejectedValue(new ApiError(409, { code: 'CONCURRENT_MODIFICATION' }))
 await userEvent.click(await screen.findByRole('button', { name: 'Xem / sửa' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText(/Trạng thái hiện tại: OPEN/)
 expect(dialog.getByRole('combobox', { name: 'Bản sao' })).toBeDisabled()
 expect(dialog.getByRole('combobox', { name: 'Sinh viên' })).toBeDisabled()
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await dialog.findByText('Chọn thao tác.')
 expect(mutation).not.toHaveBeenCalled()
 await userEvent.click(dialog.getByRole('combobox', { name: 'Thao tác' }))
 await userEvent.click(await screen.findByText('RETURN', { selector: '.ant-select-item-option-content' }))
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/admin/library/loans/l/return', 'PUT', { expectedVersion: current.rowVersion }))
 await waitFor(() => expect(dialog.getByRole('button', { name: 'Lưu' })).toBeDisabled())
 expect(mutation).toHaveBeenCalledOnce()
}, 15000)
it('shows returned history without a writable action', async () => {
 show('RETURNED')
 const mutation = vi.spyOn(api, 'mutation')
 await userEvent.click(await screen.findByRole('button', { name: 'Xem / sửa' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText(/Trạng thái hiện tại: RETURNED/)
 expect(dialog.queryByRole('button', { name: 'Lưu' })).not.toBeInTheDocument()
 expect(dialog.getByRole('combobox', { name: 'Thao tác' })).toBeDisabled()
 expect(mutation).not.toHaveBeenCalled()
}, 15000)
