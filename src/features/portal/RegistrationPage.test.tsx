import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import RegistrationPage from './RegistrationPage'
import { api } from '../../api/runtime'
import { ApiError } from '../../api/client'
import type { Registration, StudentProfile } from './student'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })

const profile: StudentProfile = { id: 'student', studentNumber: 'CD20260001', fullName: 'Nguyễn Văn An', email: 'an@example.test', organizationUnitId: 'unit', organizationUnitName: 'Khoa Công nghệ thông tin', status: 'ACTIVE' }
const term = { id: 'term', code: 'CD-TERM-003', name: 'Học kỳ demo 3', startDate: '2026-09-01', endDate: '2027-01-15', status: 'ACTIVE' as const }
const schedule = { weekday: 2, startsAt: '07:30:00', endsAt: '09:30:00', room: 'P.101' }
const registration = (state: string): Registration => ({
 studentId: 'student', studentNumber: 'CD20260001', cohort: 'K23', programId: 'program', programName: 'Cử nhân Công nghệ thông tin',
 window: {
  termId: 'term', termCode: 'CD-TERM-003', termName: 'Học kỳ demo 3', termStartDate: '2026-09-01', termEndDate: '2027-01-15',
  opensAt: '2026-11-07T02:00:00Z', closesAt: '2026-11-21T02:00:00Z',
  slotOpensAt: '2026-11-11T02:00:00Z', slotClosesAt: '2026-11-21T02:00:00Z', state,
  slots: [
   { cohort: 'K21', label: 'K21 và trước', opensAt: '2026-11-07T02:00:00Z', closesAt: '2026-11-09T02:00:00Z', current: false },
   { cohort: 'K23', label: 'K23', opensAt: '2026-11-11T02:00:00Z', closesAt: '2026-11-21T02:00:00Z', current: true },
  ],
 },
 sections: [
  { sectionId: 'open-section', sectionCode: 'CD-CLASS-001', courseId: 'calc', courseCode: 'CD-COURSE-001', courseTitle: 'Giải tích', credits: 3, facultyName: 'Bùi Khánh Hà', schedule, capacity: 40, remaining: 12, enrolled: false, eligible: true },
  { sectionId: 'blocked-section', sectionCode: 'CD-CLASS-002', courseId: 'cs', courseCode: 'CD-COURSE-003', courseTitle: 'Lập trình', credits: 3, facultyName: 'Ngô Tuấn Khang', schedule, capacity: 40, remaining: 0, enrolled: false, eligible: false, blockedReason: 'PREREQUISITE_NOT_MET', prerequisiteCourseCode: 'CD-COURSE-002', prerequisiteCourseTitle: 'Tin học cơ sở' },
 ],
 enrolled: [{
  enrollmentId: 'enrolled', status: 'ENROLLED', term, course: { id: 'phy', code: 'CD-COURSE-002', title: 'Vật lý', credits: 3 },
  sectionId: 'enrolled-section', sectionCode: 'CD-CLASS-003', facultyName: 'Lê Hoàng Bảo', schedule, sectionStatus: 'OPEN',
 }],
})

function show(state: string) {
 vi.spyOn(api, 'request').mockImplementation((async (path: string) => {
  if (path.endsWith('/me/student')) return profile
  if (path.endsWith('/me/registration')) return registration(state)
  throw new Error('Unexpected path ' + path)
 }) as typeof api.request)
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 render(<MemoryRouter><AntApp><QueryClientProvider client={client}><RegistrationPage /></QueryClientProvider></AntApp></MemoryRouter>)
}
afterEach(() => vi.restoreAllMocks())

it('shows the open window, highlights the current cohort slot and registers a section', async () => {
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({ id: 'new-enrollment' } as never)
 show('OPEN')
 expect(await screen.findByRole('heading', { name: 'Đăng ký môn' })).toBeInTheDocument()
 expect(await screen.findByText('Đang trong thời gian đăng ký')).toBeInTheDocument()
 const current = screen.getAllByText('K23').map((node) => node.closest('.cohort-slot')).find(Boolean)
 expect(current).toHaveClass('current')
 expect(screen.getByText('12/40 chỗ trống')).toBeInTheDocument()
 expect(screen.getByText('Chưa học môn tiên quyết')).toBeInTheDocument()
 await userEvent.click(screen.getByRole('button', { name: 'Đăng ký' }))
 expect(mutation).toHaveBeenCalledWith('/api/v1/me/registration', 'POST', { sectionId: 'open-section' })
})

it('keeps withdrawal disabled before the student cohort slot opens', async () => {
 show('NOT_OPEN')
 expect((await screen.findAllByText('Chưa đến lượt đăng ký của khóa bạn')).length).toBeGreaterThan(0)
 const card = screen.getByText('Đã đăng ký trong học kỳ').closest('.ant-card') as HTMLElement
 expect(within(card).getByText('Vật lý')).toBeInTheDocument()
 expect(within(card).getByRole('button', { name: 'Rút' })).toBeDisabled()
 expect(screen.queryByRole('button', { name: 'Đăng ký' })).not.toBeInTheDocument()
})

it('explains a rejected registration in Vietnamese', async () => {
 vi.spyOn(api, 'mutation').mockRejectedValue(new ApiError(409, { code: 'REGISTRATION_SCHEDULE_CONFLICT', message: 'conflict' }))
 show('OPEN')
 await userEvent.click(await screen.findByRole('button', { name: 'Đăng ký' }))
 expect(await screen.findByText('Lớp này trùng lịch với một lớp bạn đã đăng ký trong học kỳ.')).toBeInTheDocument()
})
