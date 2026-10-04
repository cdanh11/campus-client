import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminEvents from './AdminEvents'
import { api } from '../../api/runtime'
import { RegistryPage } from '../people/RegistryPage'
import { events, registrations } from './resources'
import type { Resource } from '../people/resources'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
afterEach(() => vi.restoreAllMocks())
function show(resource: Resource) {
 const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
 render(<AntApp><QueryClientProvider client={client}><RegistryPage resource={resource} /></QueryClientProvider></AntApp>)
}
it('rejects reversed times and fractional capacity in the form without submitting a write', async () => {
 vi.spyOn(api, 'request').mockResolvedValue({ content: [], totalElements: 0, totalPages: 0 })
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({})
 show(events)
 await userEvent.click(screen.getByRole('button', { name: 'Thêm sự kiện' }))
 const dialog = within(screen.getByRole('dialog'))
 for (const [label, value] of [['Mã sự kiện', 'EV1'], ['Tên sự kiện', 'Sự kiện'], ['Mô tả', 'Mô tả'], ['Bắt đầu (UTC)', '2026-12-01T10:00:00Z'], ['Kết thúc (UTC)', '2026-12-01T09:00:00Z']]) fireEvent.change(dialog.getByLabelText(label), { target: { value } })
 fireEvent.change(dialog.getByRole('spinbutton', { name: 'Sức chứa' }), { target: { value: '1.5' } })
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await dialog.findByText('Kết thúc phải sau bắt đầu.')
 await dialog.findByText('Sức chứa là số nguyên từ 1 đến 2147483647.')
 expect(mutation).not.toHaveBeenCalled()
}, 15000)
it('requires deliberate restore action and uses a fresh exact membership version', async () => {
 const current = { id: 'r', eventId: 'e', studentId: 's', status: 'CANCELLED', rowVersion: 9223372036854775806n }
 vi.spyOn(api, 'request').mockImplementation(async (path) => {
  if (path.includes('/event-registrations?')) return { content: [current], totalElements: 1, totalPages: 1 }
  if (path.endsWith('/event-registrations/r')) return current
  if (path.endsWith('/events/e')) return { id: 'e', code: 'EV1', title: 'Sự kiện cũ', status: 'CLOSED' }
  if (path.endsWith('/students/s')) return { id: 's', studentNumber: 'SV1', fullName: 'Sinh viên cũ', status: 'INACTIVE' }
  return { content: [], totalElements: 0, totalPages: 0 }
 })
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({})
 show(registrations)
 await userEvent.click(await screen.findByRole('button', { name: 'Xem / sửa' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText(/Trạng thái hiện tại: CANCELLED/)
 await waitFor(() => expect(dialog.getByRole('combobox', { name: 'Sự kiện' })).toBeDisabled())
 expect(dialog.getByRole('combobox', { name: 'Sinh viên' })).toBeDisabled()
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await dialog.findByText('Chọn thao tác.')
 expect(mutation).not.toHaveBeenCalled()
 await userEvent.click(dialog.getByRole('combobox', { name: 'Thao tác' }))
 await userEvent.click(await screen.findByText('RESTORE', { selector: '.ant-select-item-option-content' }))
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/admin/event-registrations/r', 'PUT', { action: 'RESTORE', expectedVersion: current.rowVersion }))
}, 15000)

it('resets owner pagination/search/sort when navigating between Event catalog and memberships', async () => {
 const request = vi.spyOn(api, 'request').mockResolvedValue({ content: [], totalElements: 0, totalPages: 0 })
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 render(<AntApp><QueryClientProvider client={client}><MemoryRouter initialEntries={['/admin/events/catalog']}><Routes><Route path="/admin/events/*" element={<AdminEvents />} /></Routes></MemoryRouter></QueryClientProvider></AntApp>)
 await waitFor(() => expect(request).toHaveBeenCalledWith('/api/v1/admin/events?page=0&size=20&sort=startsAt%2Casc', expect.anything()))
 fireEvent.change(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), { target: { value: 'EV1' } })
 await userEvent.type(screen.getByRole('searchbox', { name: 'Tìm kiếm' }), '{Enter}')
 await waitFor(() => expect(request).toHaveBeenCalledWith('/api/v1/admin/events?page=0&size=20&sort=startsAt%2Casc&q=EV1', expect.anything()))
 await userEvent.click(screen.getByRole('link', { name: 'Đăng ký sự kiện' }))
 await waitFor(() => expect(request).toHaveBeenCalledWith('/api/v1/admin/event-registrations?page=0&size=20&sort=registeredAt%2Cdesc', expect.anything()))
 expect(request.mock.calls.filter(([path]) => path.startsWith('/api/v1/admin/event-registrations?')).every(([path]) => !path.includes('startsAt') && !path.includes('q='))).toBe(true)
}, 15000)
