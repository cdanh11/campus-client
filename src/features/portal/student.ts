import { useQuery } from '@tanstack/react-query'
import { ApiError } from '../../api/client'
import type { components } from '../../api/schema'
import { api } from '../../api/runtime'
import { formatVnd } from '../operations/money'

export type StudentProfile = components['schemas']['com.campus.student.application.StudentProfileService.StudentProfile']
export type SectionSchedule = components['schemas']['com.campus.academic.domain.SectionSchedule']
export type Enrollment = components['schemas']['com.campus.academic.application.StudentAcademicService.EnrollmentView']
export type Term = components['schemas']['com.campus.academic.application.StudentAcademicService.TermView']
export type Timetable = components['schemas']['com.campus.academic.application.StudentAcademicService.Timetable']
export type Enrollments = components['schemas']['com.campus.academic.application.StudentAcademicService.Enrollments']
export type Charge = components['schemas']['com.campus.finance.application.StudentFinanceService.ChargeView']
export type Payment = components['schemas']['com.campus.finance.application.StudentFinanceService.PaymentView']
export type FinanceSummary = components['schemas']['com.campus.finance.application.StudentFinanceService.FinanceSummary']

export const profilePath = '/api/v1/me/student'
export const timetablePath = '/api/v1/me/timetable'
export const enrollmentsPath = '/api/v1/me/enrollments'
export const financePath = '/api/v1/me/finance'

export const isMissingStudentProfile = (error: unknown) =>
 error instanceof ApiError && error.status === 404 && (error.detail.code === 'STUDENT_PROFILE_NOT_FOUND' || error.detail.code === 'ACADEMIC_RESOURCE_NOT_FOUND')

export function useStudentProfile(enabled = true) {
 return useQuery({
  queryKey: ['me', 'student'],
  enabled,
  queryFn: ({ signal }) => api.request<StudentProfile>(profilePath, { signal }),
 })
}

export function useTimetable(termId?: string, enabled = true) {
 const term = termId ? '?termId=' + encodeURIComponent(termId) : ''
 return useQuery({
  queryKey: ['me', 'timetable', termId ?? 'current'],
  enabled,
  queryFn: ({ signal }) => api.request<Timetable>(timetablePath + term, { signal }),
 })
}

export function useEnrollments(enabled = true) {
 return useQuery({
  queryKey: ['me', 'enrollments'],
  enabled,
  queryFn: ({ signal }) => api.request<Enrollments>(enrollmentsPath, { signal }),
 })
}

export function useFinance(enabled = true) {
 return useQuery({
  queryKey: ['me', 'finance'],
  enabled,
  queryFn: ({ signal }) => api.request<FinanceSummary>(financePath, { signal }),
 })
}

export { clockText, scheduleSlotText, scheduleText, weekdayText } from '../academic/schedule'
export const dateText = (value?: string) => {
 if (!value) return '—'
 const [year, month, day] = value.slice(0, 10).split('-')
 return year && month && day ? `${day}/${month}/${year}` : value
}
export function moneyText(value: unknown) {
 try { return formatVnd(value) } catch { return '—' }
}

export const enrollmentState: Record<string, string> = { ENROLLED: 'Đã ghi danh', WITHDRAWN: 'Đã rút' }
export const sectionState: Record<string, string> = { DRAFT: 'Bản nháp', OPEN: 'Đang mở', CLOSED: 'Đã đóng', CANCELLED: 'Đã hủy' }
export const termState: Record<string, string> = { PLANNED: 'Sắp diễn ra', ACTIVE: 'Đang diễn ra', CLOSED: 'Đã kết thúc', CANCELLED: 'Đã hủy' }
export const studentState: Record<string, string> = { ACTIVE: 'Đang học', INACTIVE: 'Tạm dừng' }
export const chargeState: Record<string, string> = { OPEN: 'Còn nợ', CANCELLED: 'Đã hủy' }
export const paymentState: Record<string, string> = { RECORDED: 'Đã ghi nhận', REVERSED: 'Đã đảo' }

const hcmToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date())
export function termPhase(term?: Term): { label: string; color: string } {
 if (!term) return { label: '—', color: 'default' }
 if (term.status === 'CANCELLED') return { label: 'Đã hủy', color: 'red' }
 const today = hcmToday()
 if (term.status === 'CLOSED' || (term.endDate && term.endDate < today)) return { label: 'Đã kết thúc', color: 'default' }
 if (term.status === 'PLANNED' || (term.startDate && term.startDate > today)) return { label: 'Sắp diễn ra', color: 'blue' }
 return { label: 'Đang diễn ra', color: 'green' }
}

export const byStartDate = (a: Term | undefined, b: Term | undefined) => (b?.startDate ?? '').localeCompare(a?.startDate ?? '')

export function enrolledTerms(items: Enrollment[]): Term[] {
 const terms = new Map<string, Term>()
 for (const item of items) if (item.term?.id && !terms.has(item.term.id)) terms.set(item.term.id, item.term)
 return [...terms.values()].sort(byStartDate)
}

export function activeEnrollments(items: Enrollment[]) {
 return items.filter((item) => item.status !== 'WITHDRAWN')
}

export function totalCredits(items: Enrollment[], termId?: string) {
 return activeEnrollments(items).filter((item) => !termId || item.term?.id === termId).reduce((sum, item) => sum + (item.course?.credits ?? 0), 0)
}

const clockPattern = /^(\d{2}):(\d{2})/
const minutes = (value?: string) => {
 const match = value?.match(clockPattern)
 return match ? Number(match[1]) * 60 + Number(match[2]) : null
}

const hcmWeekdayNames: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }
function hcmNow(now: Date) {
 const parts = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
 }).formatToParts(now)
 const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
 return { weekday: hcmWeekdayNames[get('weekday')] ?? 1, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

export function nextMeetings(items: Enrollment[], count = 3, now = new Date()) {
 const clock = hcmNow(now)
 return activeEnrollments(items)
  .filter((item) => item.schedule?.weekday)
  .map((item) => {
   const start = minutes(item.schedule?.startsAt)
   let daysAhead = ((item.schedule?.weekday ?? 1) - clock.weekday + 7) % 7
   if (daysAhead === 0 && (start === null || start <= clock.minutes)) daysAhead = 7
   return { item, daysAhead, start: start ?? 0 }
  })
  .sort((a, b) => a.daysAhead - b.daysAhead || a.start - b.start)
  .slice(0, count)
}

export const daysAheadText = (days: number) => (days === 0 ? 'Hôm nay' : days === 1 ? 'Ngày mai' : `Sau ${days} ngày`)

export function overdueCharges(summary?: FinanceSummary) {
 return (summary?.charges ?? []).filter((charge) => charge.status === 'OPEN' && charge.overdue)
}

export function openCharges(summary?: FinanceSummary) {
 return (summary?.charges ?? []).filter((charge) => charge.status === 'OPEN')
}
