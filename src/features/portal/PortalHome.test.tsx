import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import PortalHome from './PortalHome'
import { api } from '../../api/runtime'
import { ApiError } from '../../api/client'
import type { Enrollment, FinanceSummary, StudentProfile, Timetable } from './student'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })

const profile: StudentProfile = { id: 'student', studentNumber: 'CD20260001', fullName: 'Nguyễn Văn An', email: 'an@example.test', organizationUnitId: 'unit', organizationUnitName: 'Khoa Công nghệ thông tin', status: 'ACTIVE' }
const term = { id: 'term', code: 'CD-TERM-003', name: 'Học kỳ demo 3', startDate: '2026-01-01', endDate: '2099-12-31', status: 'ACTIVE' as const }
const enrollment: Enrollment = { enrollmentId: 'enrollment', status: 'ENROLLED', term, course: { id: 'course', code: 'CD-COURSE-001', title: 'Nhập môn ngành', credits: 3 }, sectionId: 'section', sectionCode: 'CD-CLASS-061', facultyName: 'Bùi Khánh Hà GV1', schedule: { weekday: 2, startsAt: '07:30:00', endsAt: '09:30:00', room: 'P.101' }, sectionStatus: 'OPEN' }
const timetable: Timetable = { studentId: 'student', term, meetings: [enrollment] }
const finance: FinanceSummary = {
 studentId: 'student', currency: 'VND', asOf: '2026-11-07T00:00:00Z', totalCharged: 3000000, totalPaid: 0, outstanding: 3000000,
 charges: [{ id: 'charge', chargeNumber: 'CD-CHARGE-001', feeCode: 'TUITION', feeName: 'Học phí học kỳ', amount: 3000000, currency: 'VND', dueDate: '2026-12-31', status: 'OPEN', paid: 0, outstanding: 3000000, overdue: true, payments: [] }],
}
const news = { content: [{ title: 'Thông báo nghỉ lễ', body: 'Trường nghỉ vào thứ Sáu.', delivery: { id: 'delivery', status: 'UNREAD', deliveredAt: '2026-11-07T02:00:00Z', rowVersion: 1 } }], totalElements: 1 }
const respond = (path: string) => {
 if (path.endsWith('/me/student')) return profile
 if (path.includes('/me/timetable')) return timetable
 if (path.endsWith('/me/enrollments')) return { studentId: 'student', items: [enrollment] }
 if (path.endsWith('/me/finance')) return finance
 if (path.includes('/notifications')) return news
 throw new Error('Unexpected path ' + path)
}
function renderHome() {
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 return render(<QueryClientProvider client={client}><MemoryRouter><PortalHome /></MemoryRouter></QueryClientProvider>)
}
afterEach(() => vi.restoreAllMocks())
it('shows the linked student timetable and outstanding tuition', async () => {
 vi.spyOn(api, 'request').mockImplementation((async (path: string) => respond(path)) as typeof api.request)
 renderHome()
 expect(await screen.findByRole('heading', { name: 'Xin chào, Nguyễn Văn An' })).toBeInTheDocument()
 expect((await screen.findAllByText('Nhập môn ngành')).length).toBeGreaterThan(0)
 expect((await screen.findAllByText('3.000.000 VND')).length).toBeGreaterThan(0)
 expect(screen.getByText('1 khoản thu đã quá hạn')).toBeInTheDocument()
 expect(await screen.findByText('Thông báo nghỉ lễ')).toBeInTheDocument()
 expect(screen.getByRole('link', { name: /Xem thời khóa biểu/ })).toHaveAttribute('href', '/portal/timetable')
})
it('explains the unlinked state without calling the student-only pages', async () => {
 const request = vi.spyOn(api, 'request').mockRejectedValue(new ApiError(404, { code: 'STUDENT_PROFILE_NOT_FOUND', message: 'missing' }))
 renderHome()
 expect(await screen.findByText('Tài khoản chưa liên kết hồ sơ sinh viên')).toBeInTheDocument()
 expect(request.mock.calls.some(([path]) => String(path).includes('/me/timetable'))).toBe(false)
 expect(request.mock.calls.some(([path]) => String(path).includes('/notifications'))).toBe(true)
})
