import { describe, expect, it } from 'vitest'
import type { Enrollment } from './student'
import { dateText, nextMeetings, scheduleText, termPhase, totalCredits, weekdayText } from './student'

const enrollment = (overrides: Partial<Enrollment> & { id: string; weekday: number; startsAt: string }): Enrollment => ({
 enrollmentId: overrides.id, status: 'ENROLLED', term: { id: 'term', code: 'T', name: 'Học kỳ', startDate: '2026-01-01', endDate: '2099-12-31', status: 'ACTIVE' },
 course: { id: 'course', code: 'CS101', title: 'Nhập môn', credits: 3 }, sectionId: 'section-' + overrides.id, sectionCode: 'L1', sectionStatus: 'OPEN',
 schedule: { weekday: overrides.weekday, startsAt: overrides.startsAt, endsAt: '11:00:00', room: 'A101' }, ...overrides,
})

describe('student display helpers', () => {
 it('formats schedule, dates and weekdays for Vietnamese readers', () => {
  expect(weekdayText(1)).toBe('Thứ 2')
  expect(weekdayText(2)).toBe('Thứ 3')
  expect(weekdayText(7)).toBe('Chủ nhật')
  expect(weekdayText(8)).toBe('Chưa xếp lịch')
  expect(scheduleText({ weekday: 4, startsAt: '13:00:00', endsAt: '15:00:00', room: 'P.103' })).toBe('Thứ 5 · 13:00–15:00 · P.103')
  expect(scheduleText(undefined)).toBe('Chưa xếp lịch')
  expect(dateText('2026-09-01')).toBe('01/09/2026')
  expect(dateText(undefined)).toBe('—')
 })

 it('derives term phase from the calendar instead of trusting stale status', () => {
  expect(termPhase({ id: 'a', code: 'A', name: 'A', startDate: '2020-01-01', endDate: '2020-06-30', status: 'ACTIVE' }).label).toBe('Đã kết thúc')
  expect(termPhase({ id: 'b', code: 'B', name: 'B', startDate: '2099-01-01', endDate: '2099-06-30', status: 'ACTIVE' }).label).toBe('Sắp diễn ra')
  expect(termPhase({ id: 'c', code: 'C', name: 'C', startDate: '2020-01-01', endDate: '2099-06-30', status: 'ACTIVE' }).label).toBe('Đang diễn ra')
  expect(termPhase({ id: 'd', code: 'D', name: 'D', startDate: '2020-01-01', endDate: '2099-06-30', status: 'CANCELLED' }).label).toBe('Đã hủy')
 })

 it('orders the next meetings from the Vietnam clock and skips withdrawn enrollments', () => {
  const now = new Date('2026-11-07T03:00:00Z') // 10:00 Saturday in Ho Chi Minh City
  const rows = [
   enrollment({ id: 'friday', weekday: 5, startsAt: '08:00:00' }),
   enrollment({ id: 'later', weekday: 6, startsAt: '11:00:00' }),
   enrollment({ id: 'past', weekday: 6, startsAt: '09:00:00' }),
   enrollment({ id: 'sunday', weekday: 7, startsAt: '08:00:00' }),
   enrollment({ id: 'withdrawn', weekday: 6, startsAt: '12:00:00', status: 'WITHDRAWN' }),
  ]
  expect(nextMeetings(rows, 3, now).map(({ item, daysAhead }) => [item.enrollmentId, daysAhead])).toEqual([['later', 0], ['sunday', 1], ['friday', 6]])
 })

 it('totals credits for one term only', () => {
  const rows = [
   enrollment({ id: 'a', weekday: 2, startsAt: '07:30:00' }),
   enrollment({ id: 'b', weekday: 3, startsAt: '07:30:00', term: { id: 'other', code: 'O', name: 'Khác', startDate: '2020-01-01', endDate: '2020-06-30', status: 'CLOSED' } }),
   enrollment({ id: 'c', weekday: 4, startsAt: '07:30:00', status: 'WITHDRAWN' }),
  ]
  expect(totalCredits(rows, 'term')).toBe(3)
  expect(totalCredits(rows)).toBe(6)
 })
})
