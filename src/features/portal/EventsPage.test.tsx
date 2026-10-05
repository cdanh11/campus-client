import { render, screen, within, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { expect, it, vi } from 'vitest'
import EventsPage, { ownActions, type CampusEvent, type Registration } from './EventsPage'
import { api } from '../../api/runtime'
import { ApiError } from '../../api/client'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
const event: CampusEvent = { id: 'e', code: 'PORTAL', title: 'Ngày hội sinh viên', description: '<script>văn bản thuần</script>',
 startsAt: '2026-09-01T09:00:00.123456Z', endsAt: '2026-09-01T10:00:00Z', capacity: 1, status: 'OPEN', rowVersion: 0, createdAt: '', updatedAt: '' }
const membership: Registration = { id: 'r', eventId: 'e', studentId: 's', status: 'REGISTERED', rowVersion: 0, registeredAt: '2026-09-01T08:00:00Z', cancelledAt: null, attendedAt: null, createdAt: '', updatedAt: '' }
function show({ current = event, record = null, missing = false, history = false, total = 1 }: { current?: CampusEvent; record?: Registration | null; missing?: boolean; history?: boolean; total?: number } = {}) {
 vi.spyOn(api, 'request').mockImplementation(async (path) => {
  if (path.startsWith('/api/v1/event-registrations')) {
   if (missing) throw new ApiError(404, { code: 'EVENT_REGISTRATION_NOT_FOUND' })
   return path.includes('?') ? { content: record ? [record] : [], totalElements: record ? 1 : 0 } : record
  }
  return path.includes('?') ? { content: [event], totalElements: total } : current
 })
 const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
 render(<AntApp><QueryClientProvider client={client}><EventsPage history={history} /></QueryClientProvider></AntApp>)
}
async function open() {
 await userEvent.click(await screen.findByRole('button', { name: 'Xem sự kiện' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByRole('heading', { name: event.title })
 await waitFor(() => expect(dialog.queryByRole('status')).not.toBeInTheDocument())
 return dialog
}
it('registers the current account without sending student, actor or version fields', async () => {
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue(membership)
 show()
 const dialog = await open()
 expect(document.querySelector('script')).toBeNull()
 expect(mutation).not.toHaveBeenCalled()
 await userEvent.click(dialog.getByRole('button', { name: 'Đăng ký sự kiện' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/events/e/registrations', 'POST'))
 expect(vi.mocked(api.request).mock.calls.every(([path]) => !path.includes('/admin/'))).toBe(true)
})
it('cancels on CLOSED using freshly fetched exact membership version and never exposes ATTEND', async () => {
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({ ...membership, status: 'CANCELLED' })
 show({ current: { ...event, status: 'CLOSED' }, record: { ...membership, rowVersion: 9223372036854775806n } })
 const dialog = await open()
 expect(dialog.queryByRole('button', { name: /tham dự/i })).not.toBeInTheDocument()
 expect(api.request).toHaveBeenCalledWith('/api/v1/event-registrations/r', expect.anything())
 await userEvent.click(dialog.getByRole('button', { name: 'Hủy đăng ký' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/event-registrations/r', 'PUT', { action: 'CANCEL', expectedVersion: 9223372036854775806n }))
})
it('restores the retained registration instead of creating a new one', async () => {
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue(membership)
 show({ record: { ...membership, status: 'CANCELLED', cancelledAt: '2026-09-01T08:30:00Z', rowVersion: 2 } })
 const dialog = await open()
 await userEvent.click(dialog.getByRole('button', { name: 'Khôi phục đăng ký' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/event-registrations/r', 'PUT', { action: 'RESTORE', expectedVersion: 2 }))
})
it('keeps catalog readable but prevents registration for an unlinked account', async () => {
 const mutation = vi.spyOn(api, 'mutation')
 show({ missing: true })
 const dialog = await open()
 await dialog.findByText('Chưa có hồ sơ sinh viên liên kết')
 expect(dialog.queryByRole('button', { name: 'Đăng ký sự kiện' })).not.toBeInTheDocument()
 expect(mutation).not.toHaveBeenCalled()
})
it('blocks pending duplicate and rejected admission replay and explains capacity error', async () => {
 let reject!: (error: Error) => void
 const pending = new Promise((_, fail) => { reject = fail })
 const mutation = vi.spyOn(api, 'mutation').mockReturnValue(pending)
 show()
 const dialog = await open()
 await userEvent.click(dialog.getByRole('button', { name: 'Đăng ký sự kiện' }))
 expect(dialog.getByRole('button', { name: 'Đăng ký sự kiện' })).toBeDisabled()
 await act(async () => { reject(new ApiError(409, { code: 'EVENT_CAPACITY_EXCEEDED' })); await pending.catch(() => {}) })
 await dialog.findByText(/Sự kiện đã đủ số chỗ/)
 expect(dialog.getByRole('button', { name: 'Đăng ký sự kiện' })).toBeDisabled()
 expect(mutation).toHaveBeenCalledTimes(1)
})
it('offers only own lifecycle actions allowed by current membership and event state', () => {
 expect(ownActions(null, { ...event, status: 'DRAFT' })).toEqual([])
 expect(ownActions(null, { ...event, status: 'CLOSED' })).toEqual([])
 expect(ownActions(membership, { ...event, status: 'CANCELLED' })).toEqual(['CANCEL'])
 expect(ownActions({ ...membership, status: 'CANCELLED' }, { ...event, status: 'CLOSED' })).toEqual([])
 expect(ownActions({ ...membership, status: 'ATTENDED' }, event)).toEqual([])
})

it('resets paging on submitted search/status changes and keeps bounded owner queries', async () => {
 show({ total: 41 })
 await screen.findByRole('button', { name: 'Xem sự kiện' })
 await userEvent.click(screen.getByTitle('2', { exact: true }))
 await waitFor(() => expect(vi.mocked(api.request).mock.calls.some(([path]) => path.includes('page=1'))).toBe(true))
 await userEvent.type(screen.getByRole('searchbox', { name: 'Tìm sự kiện' }), 'Ngày hội{Enter}')
 await waitFor(() => expect(vi.mocked(api.request).mock.calls.some(([path]) => {
  const params = new URLSearchParams(path.split('?')[1])
  return params.get('page') === '0' && params.get('size') === '20' && params.get('q') === 'Ngày hội'
 })).toBe(true))
 await userEvent.click(screen.getByRole('combobox', { name: 'Lọc trạng thái sự kiện' }))
 await userEvent.click(screen.getByTitle('Đang mở', { exact: true }))
 await waitFor(() => expect(vi.mocked(api.request).mock.calls.some(([path]) => new URLSearchParams(path.split('?')[1]).get('status') === 'OPEN')).toBe(true))
})
it('loads own history without ADMIN or unsupported search fields and resolves the event title', async () => {
 show({ history: true, record: membership })
 await screen.findByRole('heading', { name: event.title })
 expect(screen.queryByRole('searchbox')).not.toBeInTheDocument()
 expect(vi.mocked(api.request).mock.calls.some(([path]) => path.startsWith('/api/v1/event-registrations?') && !new URLSearchParams(path.split('?')[1]).has('q'))).toBe(true)
 expect(vi.mocked(api.request).mock.calls.every(([path]) => !path.includes('/admin/'))).toBe(true)
})
