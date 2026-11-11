import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import ResultsPage from './ResultsPage'
import { api } from '../../api/runtime'
import type { Curriculum, StudentProfile, Transcript, TranscriptRecord } from './student'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })

const profile: StudentProfile = { id: 'student', studentNumber: 'CD20260001', fullName: 'Nguyễn Văn An', email: 'an@example.test', organizationUnitId: 'unit', organizationUnitName: 'Khoa Công nghệ thông tin', status: 'ACTIVE' }
const term1 = { id: 't1', code: 'CD-TERM-001', name: 'Học kỳ demo 1', startDate: '2025-09-01', endDate: '2026-01-15', status: 'CLOSED' as const }
const term2 = { id: 't2', code: 'CD-TERM-002', name: 'Học kỳ demo 2', startDate: '2026-02-01', endDate: '2026-06-15', status: 'ACTIVE' as const }
const record = (overrides: Partial<TranscriptRecord>): TranscriptRecord => ({
 enrollmentId: 'e', term: term1, course: { id: 'c1', code: 'CD-COURSE-001', title: 'Giải tích', credits: 3 },
 sectionCode: 'CD-CLASS-001', courseGroup: 'GENERAL', scheme: 'GENERAL',
 attendanceWeight: 0.1, midtermWeight: 0.4, finalWeight: 0.5, projectWeight: 0,
 attendanceScore: 8, midtermScore: 7, finalScore: 9, totalScore: 8.1, letterGrade: 'B', gradePoint: 3,
 passed: true, retake: false, improvement: false, gradedAt: '2026-01-10T00:00:00Z', ...overrides,
})
const transcript: Transcript = {
 studentId: 'student', programId: 'program', programName: 'Cử nhân Công nghệ thông tin', cohort: 'K23',
 terms: [
  { termId: 't2', code: 'CD-TERM-002', name: 'Học kỳ demo 2', startDate: '2026-02-01', endDate: '2026-06-15', gpa: 3, credits: 6, passedCredits: 6, gradedCourses: 2, classification: 'KHA' },
  { termId: 't1', code: 'CD-TERM-001', name: 'Học kỳ demo 1', startDate: '2025-09-01', endDate: '2026-01-15', gpa: 1.5, credits: 6, passedCredits: 3, gradedCourses: 2, classification: 'YEU' },
 ],
 summary: { cumulativeGpa: 2, cumulativeCredits: 9, gradedCourses: 3, classification: 'TRUNG_BINH', latestTermId: 't2', latestTermGpa: 3, latestTermPassedCredits: 6, latestTermClassification: 'KHA' },
 records: [
  record({ enrollmentId: 'math-1', term: term1, course: { id: 'math', code: 'CD-COURSE-001', title: 'Giải tích', credits: 3 } }),
  record({ enrollmentId: 'phy-1', term: term1, course: { id: 'phy', code: 'CD-COURSE-002', title: 'Vật lý', credits: 3 }, letterGrade: 'F', gradePoint: 0, totalScore: 3.2, passed: false, improvement: false }),
  record({ enrollmentId: 'math-2', term: term2, course: { id: 'math', code: 'CD-COURSE-001', title: 'Giải tích', credits: 3 }, letterGrade: 'A', gradePoint: 4, totalScore: 9, retake: true }),
  record({ enrollmentId: 'cs-1', term: term2, course: { id: 'cs', code: 'CD-COURSE-003', title: 'Lập trình', credits: 3 }, letterGrade: 'C', gradePoint: 2, totalScore: 5.6 }),
 ],
}
const curriculum: Curriculum = {
 studentId: 'student', programId: 'program', programName: 'Cử nhân Công nghệ thông tin', cohort: 'K23',
 semesters: [
  { index: 3, courses: [{ courseId: 'next', code: 'CS201', title: 'Cấu trúc dữ liệu', credits: 3, status: 'NOT_STARTED', prerequisiteSatisfied: true }] },
  { index: 4, courses: [{ courseId: 'later', code: 'CS202', title: 'Cơ sở dữ liệu', credits: 3, status: 'IN_PROGRESS', prerequisiteSatisfied: true }] },
 ],
}
function show() {
 vi.spyOn(api, 'request').mockImplementation(async (path: string) => {
  if (path.endsWith('/me/student')) return profile
  if (path.endsWith('/me/transcript')) return transcript
  if (path.endsWith('/me/curriculum')) return curriculum
  throw new Error('Unexpected path ' + path)
 })
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 render(<MemoryRouter><AntApp><QueryClientProvider client={client}><ResultsPage /></QueryClientProvider></AntApp></MemoryRouter>)
}
afterEach(() => vi.restoreAllMocks())

it('summarizes cumulative and per-semester GPA and filters the transcript rows', async () => {
 show()
 expect(await screen.findByRole('heading', { name: 'Bảng điểm và GPA' })).toBeInTheDocument()
 const cumulative = (await screen.findByText('GPA tích lũy')).closest('.ant-statistic')
 expect(cumulative).toHaveTextContent('2.00')
 expect(screen.getAllByText('Học kỳ demo 1').length).toBeGreaterThan(0)
 expect(await screen.findByText('Lập trình')).toBeInTheDocument()
 await userEvent.click(screen.getByRole('combobox', { name: 'Lọc theo học kỳ' }))
 await userEvent.click(await screen.findByText('Học kỳ demo 1 (2 môn)', { selector: '.ant-select-item-option-content' }))
 expect(screen.queryByText('Lập trình')).not.toBeInTheDocument()
 expect(screen.getByText('Vật lý')).toBeInTheDocument()
})

it('opens a course row with every weighted component', async () => {
 show()
 await screen.findByText('Lập trình')
 const rows = screen.getAllByRole('button', { name: /Giải tích/ })
 await userEvent.click(rows[0])
 const dialog = within(await screen.findByRole('dialog'))
 expect(await dialog.findByText('Điểm thành phần')).toBeInTheDocument()
 expect(dialog.getByText('Chuyên cần')).toBeInTheDocument()
 expect(dialog.getAllByText('40%').length).toBeGreaterThan(0)
 expect(dialog.getByText('50%')).toBeInTheDocument()
 expect(dialog.getByText('B · 3')).toBeInTheDocument()
 expect(dialog.getByText('4.50')).toBeInTheDocument()
})

it('projects the cumulative GPA from a selected future course', async () => {
 show()
 await screen.findByText('Lập trình')
 expect((await screen.findAllByText('2.00/4')).length).toBeGreaterThan(0)
 await userEvent.click(screen.getByRole('combobox', { name: 'Chọn môn sắp học' }))
 await userEvent.click(await screen.findByText('HK3 · CS201 · Cấu trúc dữ liệu (3 TC)', { selector: '.ant-select-item-option-content' }))
 expect(await screen.findByText('2.25/4')).toBeInTheDocument()
 expect(screen.getByText(/\+0\.25 so với hiện tại/)).toBeInTheDocument()
})
