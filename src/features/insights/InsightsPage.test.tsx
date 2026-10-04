import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { afterEach, expect, it, vi } from 'vitest'
import { api } from '../../api/runtime'
import { ApiError } from '../../api/client'
import { DashboardPage } from './DashboardPage'
import { ReportsPage } from './ReportPage'
import { AuditsPage } from './AuditPage'
import { reportConfig } from './config'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
afterEach(() => vi.restoreAllMocks())
function show(node: ReactNode) {
 const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
 render(<AntApp><QueryClientProvider client={client}>{node}</QueryClientProvider></AntApp>)
}
it('renders all dashboard groups and aggregate VND exactly', async () => {
 const groups = Object.fromEntries(['IDENTITY', 'PEOPLE', 'ACADEMIC', 'DORMITORY', 'FINANCE', 'NOTIFICATION', 'EVENT', 'LIBRARY'].map((group) => [group, group === 'FINANCE' ? { outstanding_vnd: 19999999999999999998n } : { count: 0 }]))
 vi.spyOn(api, 'request').mockResolvedValue({ asOf: '2026-01-01T00:00:00Z', currency: 'VND', groups })
 show(<DashboardPage />)
 await screen.findByText('19.999.999.999.999.999.998 VND')
 for (const label of ['Tài khoản', 'Hồ sơ', 'Học vụ', 'Ký túc xá', 'Tài chính', 'Thông báo', 'Sự kiện', 'Thư viện']) expect(screen.getByText(label)).toBeInTheDocument()
})
it('resets unsupported report filters on kind change and surfaces failed export without download', async () => {
 const request = vi.spyOn(api, 'request').mockImplementation(async (path) => {
  if (path.startsWith('/api/v1/admin/reports/')) {
   const kind = path.includes('EVENT_MEMBERSHIP') ? 'EVENT_MEMBERSHIP' : 'STUDENT_DEBT'
   return { report: kind, columns: reportConfig[kind].columns, content: [], totalElements: 0, totalPages: 0, asOf: '2026-01-01T00:00:00Z' }
  }
  return { content: [], totalElements: 0, totalPages: 0 }
 })
 const download = vi.spyOn(api, 'downloadCsv').mockRejectedValue(new ApiError(422, { code: 'REPORT_EXPORT_LIMIT_EXCEEDED' }))
 show(<ReportsPage />)
 await userEvent.click(screen.getByRole('combobox', { name: 'Loại báo cáo' }))
 await userEvent.click(await screen.findByText('Tham gia sự kiện', { selector: '.ant-select-item-option-content' }))
 await userEvent.click(screen.getByRole('combobox', { name: 'Trạng thái báo cáo' }))
 await userEvent.click(await screen.findByText('CANCELLED', { selector: '.ant-select-item-option-content' }))
 await userEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
 await waitFor(() => expect(request).toHaveBeenCalledWith(expect.stringContaining('status=CANCELLED'), expect.anything()))
 await userEvent.click(screen.getByRole('button', { name: 'Tải CSV' }))
 await screen.findByText(/Báo cáo vượt 5.000 dòng/)
 expect(download).toHaveBeenCalledWith('/api/v1/admin/reports/EVENT_MEMBERSHIP/export?sort=id%2Casc&status=CANCELLED')
 await userEvent.click(screen.getByRole('combobox', { name: 'Loại báo cáo' }))
 await userEvent.click(await screen.findByText('Công nợ sinh viên', { selector: '.ant-select-item-option-content' }))
 expect(screen.queryByRole('combobox', { name: 'Trạng thái báo cáo' })).not.toBeInTheDocument()
 expect(request.mock.calls.filter(([path]) => path.includes('/STUDENT_DEBT?')).every(([path]) => !path.includes('status='))).toBe(true)
}, 15000)
it('validates audit filters and shows recorded exact version/status as read-only text', async () => {
 const current = { id: 'a', source: 'IDENTITY', resource: 'USER', action: 'CREATED', resourceVersion: 9223372036854775806n, metadata: { status: '<script>alert(1)</script>' } }
 const request = vi.spyOn(api, 'request').mockImplementation(async (path) => path.endsWith('/a') ? current : { content: [current], totalElements: 1, totalPages: 1 })
 const mutation = vi.spyOn(api, 'mutation')
 show(<AuditsPage />)
 fireEvent.change(screen.getByLabelText('Đối tượng UUID'), { target: { value: 'invalid' } })
 await userEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
 await screen.findByText('Nhập UUID đầy đủ.')
 expect(request.mock.calls.some(([path]) => path.includes('targetId='))).toBe(false)
 await userEvent.click(await screen.findByRole('button', { name: 'Xem audit' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText('<script>alert(1)</script>')
 expect(dialog.getByText('9223372036854775806')).toBeInTheDocument()
 expect(document.querySelector('script')).toBeNull()
 expect(dialog.queryByRole('button', { name: 'Lưu' })).not.toBeInTheDocument()
 expect(mutation).not.toHaveBeenCalled()
}, 15000)

it('resets source-specific audit resource and action filters on source change', async () => {
 const request = vi.spyOn(api, 'request').mockResolvedValue({ content: [], totalElements: 0, totalPages: 0 })
 show(<AuditsPage />)
 await userEvent.click(screen.getByRole('combobox', { name: 'Tài nguyên audit' }))
 await userEvent.click(await screen.findByText('USER', { selector: '.ant-select-item-option-content' }))
 fireEvent.change(screen.getByLabelText('Action'), { target: { value: 'A'.repeat(64) } })
 await userEvent.click(screen.getByRole('button', { name: 'Áp dụng bộ lọc' }))
 await waitFor(() => expect(request).toHaveBeenCalledWith(expect.stringContaining('resource=USER'), expect.anything()))
 await userEvent.click(screen.getByRole('combobox', { name: 'Nguồn audit' }))
 await userEvent.click(await screen.findByText('LIBRARY', { selector: '.ant-select-item-option-content' }))
 await waitFor(() => expect(request).toHaveBeenCalledWith('/api/v1/admin/audits/LIBRARY?page=0&size=20&sort=occurredAt%2Cdesc', expect.anything()))
 expect(screen.getByLabelText('Action')).toHaveValue('')
 expect(request.mock.calls.filter(([path]) => path.includes('/audits/LIBRARY?')).every(([path]) => !path.includes('resource=') && !path.includes('action='))).toBe(true)
}, 15000)
