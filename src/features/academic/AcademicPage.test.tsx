import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { api } from '../../api/runtime'
import { RegistryPage } from '../people/RegistryPage'
import type { Resource } from '../people/resources'
import { academicResources } from './resources'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
afterEach(() => vi.restoreAllMocks())
function show(resource: Resource) {
 const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
 return render(<AntApp><QueryClientProvider client={client}><RegistryPage resource={resource} /></QueryClientProvider></AntApp>)
}
it('rejects end-before-start in the form without sending a mutation', async () => {
 vi.spyOn(api, 'request').mockResolvedValue({ content: [], totalElements: 0, totalPages: 0 })
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({})
 show(academicResources.terms)
 await userEvent.click(screen.getByRole('button', { name: 'Thêm học kỳ' }))
 const dialog = within(screen.getByRole('dialog'))
 fireEvent.change(dialog.getByLabelText('Mã'), { target: { value: 'TERM1' } })
 fireEvent.change(dialog.getByLabelText('Tên học kỳ'), { target: { value: 'Học kỳ 1' } })
 fireEvent.change(dialog.getByLabelText('Ngày bắt đầu'), { target: { value: '2026-12-01' } })
 fireEvent.change(dialog.getByLabelText('Ngày kết thúc'), { target: { value: '2026-11-01' } })
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await dialog.findByText('Ngày kết thúc phải từ ngày bắt đầu trở đi.')
 expect(mutation).not.toHaveBeenCalled()
}, 15000)
it('restores a withdrawn enrollment through PUT with fresh exact version and immutable references', async () => {
 const current = { id: 'e', studentId: 's', sectionId: 'h', status: 'WITHDRAWN', rowVersion: 9223372036854775806n }
 const request = vi.spyOn(api, 'request').mockImplementation(async (path) => {
  if (path.includes('/enrollments?')) return { content: [current], totalElements: 1, totalPages: 1 }
  if (path.endsWith('/enrollments/e')) return current
  if (path.endsWith('/students/s')) return { id: 's', studentNumber: 'SV1', fullName: 'Sinh viên', status: 'INACTIVE' }
  if (path.endsWith('/sections/h')) return { id: 'h', code: 'SEC1', status: 'CLOSED' }
  return { content: [], totalElements: 0, totalPages: 0 }
 })
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({ ...current, status: 'ENROLLED' })
 show(academicResources.enrollments)
 await userEvent.click(await screen.findByRole('button', { name: 'Xem / sửa' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText(/Trạng thái hiện tại: WITHDRAWN/)
 await waitFor(() => expect(dialog.getByRole('combobox', { name: 'Sinh viên' })).toBeDisabled())
 expect(dialog.getByRole('combobox', { name: 'Lớp học phần' })).toBeDisabled()
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await dialog.findByText('Chọn trạng thái.')
 expect(mutation).not.toHaveBeenCalled()
 await userEvent.click(dialog.getByRole('combobox', { name: 'Trạng thái' }))
 await userEvent.click(await screen.findByText('ENROLLED', { selector: '.ant-select-item-option-content' }))
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/admin/academic/enrollments/e', 'PUT', { status: 'ENROLLED', expectedVersion: 9223372036854775806n }))
 expect(request).toHaveBeenCalledWith('/api/v1/admin/academic/enrollments/e', expect.objectContaining({ signal: expect.any(AbortSignal) }))
 expect(mutation).toHaveBeenCalledOnce()
}, 15000)

it('rejects fractional course credits rather than silently rounding them into a valid mutation', async () => {
 vi.spyOn(api, 'request').mockImplementation(async (path) => path.includes('/courses?') ? { content: [], totalElements: 0, totalPages: 0 } : path.includes('?') ? { content: [{ id: 'org', code: 'ORG', name: 'Organization', status: 'ACTIVE' }], totalPages: 1 } : { id: 'org', code: 'ORG', name: 'Organization', status: 'ACTIVE' })
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({})
 show(academicResources.courses)
 await userEvent.click(screen.getByRole('button', { name: 'Thêm môn học' }))
 const dialog = within(screen.getByRole('dialog'))
 fireEvent.change(dialog.getByLabelText('Mã'), { target: { value: 'CS1' } })
 fireEvent.change(dialog.getByLabelText('Tên môn học'), { target: { value: 'Course 1' } })
 await userEvent.type(dialog.getByRole('spinbutton', { name: 'Số tín chỉ' }), '3.5')
 await userEvent.click(dialog.getByRole('combobox', { name: 'Đơn vị' }))
 await userEvent.click(await screen.findByText('ORG · Organization'))
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await dialog.findByText('Số tín chỉ là số nguyên từ 1 đến 30.')
 expect(mutation).not.toHaveBeenCalled()
}, 15000)
