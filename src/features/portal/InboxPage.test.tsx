import { render, screen, within, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, it, vi } from 'vitest'
import InboxPage, { type InboxItem } from './InboxPage'
import { api } from '../../api/runtime'
import { ApiError } from '../../api/client'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
const item: InboxItem = {
 title: 'Thông báo cá nhân', body: '<img src=x onerror=alert(1)>\nDòng thứ hai',
 delivery: { id: 'd', noticeId: 'n', recipientId: 'u', status: 'UNREAD', rowVersion: 0,
  deliveredAt: '2026-10-05T00:00:00Z', readAt: null, createdAt: '2026-10-05T00:00:00Z', updatedAt: '2026-10-05T00:00:00Z' },
}
function show(detail = item) {
 vi.spyOn(api, 'request').mockImplementation(async (path) => path.includes('?') ? { content: [item], totalElements: 1 } : detail)
 const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
 render(<AntApp><QueryClientProvider client={client}><InboxPage /></QueryClientProvider></AntApp>)
}
it('shows private plain text and never writes just by opening the inbox or a message', async () => {
 const mutation = vi.spyOn(api, 'mutation')
 show()
 await userEvent.click(await screen.findByRole('button', { name: 'Xem thông báo' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText(/Dòng thứ hai/)
 expect(document.querySelector('img')).toBeNull()
 expect(mutation).not.toHaveBeenCalled()
 expect(api.request).toHaveBeenCalledWith('/api/v1/notifications/d', expect.anything())
 expect(vi.mocked(api.request).mock.calls.every(([path]) => !path.includes('/admin/'))).toBe(true)
})
it('reads using the fresh exact version, never the list version', async () => {
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({ ...item.delivery, status: 'READ' })
 show({ ...item, delivery: { ...item.delivery, rowVersion: 9223372036854775806n } })
 await userEvent.click(await screen.findByRole('button', { name: 'Xem thông báo' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText(/Dòng thứ hai/)
 await userEvent.click(dialog.getByRole('button', { name: 'Đánh dấu đã đọc' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/notifications/d/read', 'PUT', { expectedVersion: 9223372036854775806n }))
 await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
})
it('blocks pending double submit and stale replay without retrying the write', async () => {
 let reject!: (error: Error) => void
 const pending = new Promise((_, fail) => { reject = fail })
 const mutation = vi.spyOn(api, 'mutation').mockReturnValue(pending)
 show()
 await userEvent.click(await screen.findByRole('button', { name: 'Xem thông báo' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText(/Dòng thứ hai/)
 await userEvent.click(dialog.getByRole('button', { name: 'Đánh dấu đã đọc' }))
 expect(dialog.getByRole('button', { name: 'Đánh dấu đã đọc' })).toBeDisabled()
 await act(async () => { reject(new ApiError(409, { code: 'CONCURRENT_MODIFICATION' })); await pending.catch(() => {}) })
 await dialog.findByText(/Đóng và mở lại thông báo/)
 expect(dialog.getByRole('button', { name: 'Đánh dấu đã đọc' })).toBeDisabled()
 expect(mutation).toHaveBeenCalledTimes(1)
})
it('does not offer a write for an already-read message and retains read time', async () => {
 show({ ...item, delivery: { ...item.delivery, status: 'READ', readAt: '2026-10-05T01:00:00Z' } })
 await userEvent.click(await screen.findByRole('button', { name: 'Xem thông báo' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText('Đã đọc lúc: 2026-10-05T01:00:00Z')
 expect(dialog.queryByRole('button', { name: 'Đánh dấu đã đọc' })).not.toBeInTheDocument()
})
