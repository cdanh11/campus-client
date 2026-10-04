import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { api } from '../../api/runtime'
import { ApiError } from '../../api/client'
import { PublishNotice } from './PublishNotice'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
afterEach(() => vi.restoreAllMocks())
const notice = { id: 'n', title: '<script>plain text</script>', body: '<img src=x onerror=alert(1)>', status: 'DRAFT', rowVersion: 9223372036854775806n }
function show(status = 'DRAFT') {
 vi.spyOn(api, 'request').mockImplementation(async (path) => {
  if (path.endsWith('/notices/n')) return { ...notice, status }
  const account = { id: 'u', email: 'reader@example.test', displayName: 'Người nhận', status: 'ACTIVE' }
  if (path.includes('?')) return { content: [account], totalElements: 1, totalPages: 1 }
  return account
 })
 const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
 render(<AntApp><QueryClientProvider client={client}><PublishNotice id="n" onClose={() => {}} /></QueryClientProvider></AntApp>)
}
it('deduplicates recipients, publishes the freshly read exact version and blocks stale replay', async () => {
 const mutation = vi.spyOn(api, 'mutation').mockRejectedValue(new ApiError(409, { code: 'CONCURRENT_MODIFICATION' }))
 show()
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText(notice.title)
 expect(document.querySelector('script')).toBeNull()
 expect(document.querySelector('img')).toBeNull()
 expect(dialog.getByRole('button', { name: 'Xác nhận phát hành' })).toBeDisabled()
 await userEvent.click(dialog.getByRole('combobox', { name: 'Tài khoản nhận' }))
 await userEvent.click(await screen.findByText('reader@example.test · Người nhận', { selector: '.ant-select-item-option-content' }))
 await userEvent.click(dialog.getByRole('button', { name: 'Thêm người nhận' }))
 await dialog.findByText('Đã chọn: 1/100')
 await userEvent.click(dialog.getByRole('combobox', { name: 'Tài khoản nhận' }))
 await userEvent.click(await screen.findByText('reader@example.test · Người nhận', { selector: '.ant-select-item-option-content' }))
 expect(dialog.getByRole('button', { name: 'Thêm người nhận' })).toBeDisabled()
 await userEvent.click(dialog.getByRole('button', { name: 'Xác nhận phát hành' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/admin/notifications/notices/n/publish', 'POST', { recipientIds: ['u'], expectedVersion: notice.rowVersion }))
 await dialog.findByText(/Đóng và mở lại/)
 expect(dialog.getByRole('button', { name: 'Xác nhận phát hành' })).toBeDisabled()
 expect(mutation).toHaveBeenCalledOnce()
}, 15000)
it('refuses publication when fresh read reports already published', async () => {
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({})
 show('PUBLISHED')
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText(/Trạng thái: PUBLISHED/)
 expect(dialog.getByRole('button', { name: 'Xác nhận phát hành' })).toBeDisabled()
 expect(mutation).not.toHaveBeenCalled()
}, 15000)
