import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import CoursesPage from './CoursesPage'
import { api } from '../../api/runtime'
import type { Curriculum, Enrollment, StudentProfile } from './student'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })

const profile: StudentProfile = { id: 'student', studentNumber: 'CD20260001', fullName: 'Nguyễn Văn An', email: 'an@example.test', organizationUnitId: 'unit', organizationUnitName: 'Khoa Công nghệ thông tin', status: 'ACTIVE' }
const term = { id: 't3', code: 'CD-TERM-003', name: 'Học kỳ demo 3', startDate: '2026-09-01', endDate: '2027-01-15', status: 'ACTIVE' as const }
const enrollment: Enrollment = {
 enrollmentId: 'e1', status: 'ENROLLED', term, course: { id: 'cs2', code: 'CS102', title: 'Kỹ thuật lập trình', credits: 3 },
 sectionId: 's1', sectionCode: 'CS102-A', facultyName: 'Bùi Khánh Hà',
 schedule: { weekday: 2, startsAt: '07:30:00', endsAt: '09:30:00', room: 'P.101' }, sectionStatus: 'OPEN',
}
const withdrawn: Enrollment = {
 ...enrollment, enrollmentId: 'e0', status: 'WITHDRAWN', course: { id: 'math', code: 'MATH101', title: 'Giải tích', credits: 3 }, sectionCode: 'MATH101-A',
}
const finished: Enrollment = {
 ...enrollment, enrollmentId: 'e2', term: { id: 't1', code: 'CD-TERM-001', name: 'Học kỳ demo 1', startDate: '2025-09-01', endDate: '2026-01-15', status: 'CLOSED' as const },
 course: { id: 'phy', code: 'PHY101', title: 'Vật lý đại cương', credits: 3 }, sectionCode: 'PHY101-A',
}
const curriculum: Curriculum = {
 studentId: 'student', programId: 'program', programName: 'Cử nhân Công nghệ thông tin', cohort: 'K23',
 semesters: [
  { index: 1, courses: [{ courseId: 'cs1', code: 'CS101', title: 'Cơ sở lập trình', credits: 3, courseGroup: 'MAJOR', status: 'FAILED', bestTotal: 3.2, bestLetter: 'F', prerequisiteSatisfied: true }] },
  { index: 2, courses: [
   { courseId: 'cs2', code: 'CS102', title: 'Kỹ thuật lập trình', credits: 3, courseGroup: 'MAJOR', status: 'IN_PROGRESS', prerequisiteCourseId: 'cs1', prerequisiteCode: 'CS101', prerequisiteTitle: 'Cơ sở lập trình', prerequisiteSatisfied: true },
   { courseId: 'cs3', code: 'CS103', title: 'Lập trình hướng đối tượng', credits: 3, courseGroup: 'MAJOR', status: 'NOT_STARTED', prerequisiteCourseId: 'cs2', prerequisiteCode: 'CS102', prerequisiteTitle: 'Kỹ thuật lập trình', prerequisiteSatisfied: false },
  ] },
  { index: 3, courses: [{ courseId: 'cs4', code: 'CS201', title: 'Trí tuệ nhân tạo', credits: 3, courseGroup: 'SPECIALIZED', status: 'NOT_STARTED' }] },
 ],
}
function show() {
 vi.spyOn(api, 'request').mockImplementation(async (path: string) => {
  if (path.endsWith('/me/student')) return profile
  if (path.endsWith('/me/enrollments')) return { studentId: 'student', items: [enrollment, withdrawn, finished] }
  if (path.endsWith('/me/curriculum')) return curriculum
  throw new Error('Unexpected path ' + path)
 })
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 render(<MemoryRouter><QueryClientProvider client={client}><CoursesPage /></QueryClientProvider></MemoryRouter>)
}
afterEach(() => vi.restoreAllMocks())

it('lays the curriculum out vertically with statuses, groups and prerequisite links', async () => {
 show()
 expect(await screen.findByRole('heading', { name: 'Môn học của tôi' })).toBeInTheDocument()
 expect(await screen.findByRole('button', { name: 'CS101 · Cơ sở lập trình' })).toBeInTheDocument()
 expect(screen.getByRole('button', { name: 'CS102 · Kỹ thuật lập trình' })).toBeInTheDocument()
 expect(document.querySelector('.curriculum-roadmap')).toBeInTheDocument()
 expect(document.querySelectorAll('.curriculum-semester')).toHaveLength(3)
 expect(document.querySelector('.curriculum-edges')).not.toBeInTheDocument()
 expect(within(screen.getByRole('button', { name: 'CS101 · Cơ sở lập trình' })).getByText('Chưa đạt')).toBeInTheDocument()
 expect(within(screen.getByRole('button', { name: 'CS101 · Cơ sở lập trình' })).getByText('Bắt buộc')).toBeInTheDocument()
 expect(within(screen.getByRole('button', { name: 'CS201 · Trí tuệ nhân tạo' })).getByText('Chuyên ngành')).toBeInTheDocument()
 const current = within(screen.getByRole('button', { name: 'CS102 · Kỹ thuật lập trình' }))
 expect(current.getByText('Đang học')).toBeInTheDocument()
 expect(current.getByText('Đã học CS101')).toBeInTheDocument()
 expect(within(screen.getByRole('button', { name: 'CS103 · Lập trình hướng đối tượng' })).getByText('Chưa học CS102')).toBeInTheDocument()
})

it('filters the roadmap by course category', async () => {
 show()
 await screen.findByRole('button', { name: 'CS201 · Trí tuệ nhân tạo' })
 await userEvent.click(screen.getByText('Chuyên ngành (1)'))
 expect(screen.getByRole('button', { name: 'CS201 · Trí tuệ nhân tạo' })).toBeInTheDocument()
 expect(screen.queryByRole('button', { name: 'CS101 · Cơ sở lập trình' })).not.toBeInTheDocument()
 expect(screen.queryByRole('button', { name: 'CS102 · Kỹ thuật lập trình' })).not.toBeInTheDocument()
 expect(document.querySelectorAll('.curriculum-semester')).toHaveLength(1)
 await userEvent.click(screen.getByText('Đại cương (0)'))
 expect(screen.getByText('Không có môn nào trong nhóm này.')).toBeInTheDocument()
})

it('opens a course node with the prerequisite rule', async () => {
 show()
 await userEvent.click(await screen.findByRole('button', { name: 'CS102 · Kỹ thuật lập trình' }))
 const drawer = within(await screen.findByRole('dialog'))
 expect(drawer.getByText('Đã đủ điều kiện đăng ký')).toBeInTheDocument()
 expect(drawer.getByText(/dù kết quả môn tiên quyết đạt hay không đạt/)).toBeInTheDocument()
 expect(drawer.getByText('Học kỳ 2')).toBeInTheDocument()
})

it('lists only classes in the current or upcoming terms', async () => {
 show()
 expect(await screen.findByText('Lớp đang học')).toBeInTheDocument()
 expect(await screen.findByText(/CS102-A/)).toBeInTheDocument()
 expect(screen.queryByText('Giải tích')).not.toBeInTheDocument()
 expect(screen.queryByText('Vật lý đại cương')).not.toBeInTheDocument()
})
