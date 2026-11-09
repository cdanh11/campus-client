import { expect, it } from 'vitest'
import type { Enrollment } from './student'
import { campusNow, campusToday, clockMinutes, courseTone, HOUR_HEIGHT, layoutWeek, weekDays } from './timetable-layout'

const meeting = (weekday: number, startsAt: string, endsAt: string, id = 'a'): Enrollment => ({
 enrollmentId: id, status: 'ENROLLED', sectionId: 'section-' + id, sectionCode: 'L-' + id,
 course: { title: 'Môn ' + id, code: 'C-' + id, credits: 3 },
 schedule: { weekday, startsAt, endsAt, room: 'P.101' },
})

it('parses campus clock values and rejects malformed times', () => {
 expect(clockMinutes('07:30:00')).toBe(450)
 expect(clockMinutes('7:05')).toBe(425)
 expect(clockMinutes(undefined)).toBeNull()
 expect(clockMinutes('24:00')).toBeNull()
 expect(clockMinutes('12:60')).toBeNull()
})

it('places a meeting on the 06:30–18:30 axis with percentage geometry', () => {
 const layout = layoutWeek([meeting(2, '07:30:00', '09:30:00')])
 expect(layout.axisStart).toBe(390)
 expect(layout.axisEnd).toBe(1110)
 expect(layout.hours[0]).toBe(7)
 expect(layout.hours[layout.hours.length - 1]).toBe(18)
 expect(layout.blocks).toHaveLength(1)
 expect(layout.blocks[0].top).toBeCloseTo((450 - 390) / 720 * 100)
 expect(layout.blocks[0].height).toBeCloseTo(120 / 720 * 100)
 expect(layout.blocks[0].lanes).toBe(1)
 expect(layout.unscheduled).toHaveLength(0)
})

it('splits overlapping meetings into lanes and keeps separate clusters full width', () => {
 const layout = layoutWeek([
  meeting(3, '07:30:00', '09:30:00', 'a'),
  meeting(3, '08:00:00', '10:00:00', 'b'),
  meeting(3, '13:00:00', '14:30:00', 'c'),
 ])
 const blocks = layout.blocks.filter((block) => block.day === 3)
 expect(blocks.find((block) => block.item.enrollmentId === 'a')).toMatchObject({ lane: 0, lanes: 2 })
 expect(blocks.find((block) => block.item.enrollmentId === 'b')).toMatchObject({ lane: 1, lanes: 2 })
 expect(blocks.find((block) => block.item.enrollmentId === 'c')).toMatchObject({ lane: 0, lanes: 1 })
})

it('expands the axis for early or late meetings and clamps edge blocks', () => {
 const layout = layoutWeek([meeting(4, '06:00:00', '07:00:00', 'early'), meeting(4, '19:00:00', '21:00:00', 'late')])
 expect(layout.axisStart).toBe(360)
 expect(layout.axisEnd).toBe(1260)
 const early = layout.blocks.find((block) => block.item.enrollmentId === 'early')
 const late = layout.blocks.find((block) => block.item.enrollmentId === 'late')
 expect(early?.top).toBe(0)
 expect(late?.height).toBeCloseTo((1260 - 1140) / (1260 - 360) * 100)
})

it('reports meetings without a usable schedule instead of plotting them', () => {
 const unscheduled: Enrollment = { enrollmentId: 'none', status: 'ENROLLED', course: { title: 'Chưa xếp lịch' } }
 const invalid: Enrollment = { enrollmentId: 'bad', status: 'ENROLLED', schedule: { weekday: 2, startsAt: '10:00', endsAt: '09:00' } }
 const layout = layoutWeek([unscheduled, invalid])
 expect(layout.blocks).toHaveLength(0)
 expect(layout.unscheduled.map((item) => item.enrollmentId)).toEqual(['none', 'bad'])
})

it('derives the campus weekday, clock and week labels for UTC+7', () => {
 const monday = new Date('2026-11-09T01:30:00Z')
 expect(campusNow(monday)).toEqual({ weekday: 1, minutes: 510 })
 const days = weekDays(monday, monday)
 expect(days).toHaveLength(7)
 expect(days[0]).toMatchObject({ weekday: 1, dateLabel: '09/11', today: true })
 expect(days[6]).toMatchObject({ weekday: 7, dateLabel: '15/11', today: false })
 const sundayInstant = new Date('2026-11-08T10:00:00Z')
 const sunday = weekDays(sundayInstant, sundayInstant)
 expect(sunday[6]).toMatchObject({ weekday: 7, dateLabel: '08/11', today: true })
 const futureTerm = weekDays(new Date('2027-01-01T00:00:00+07:00'), monday)
 expect(futureTerm.some((day) => day.today)).toBe(false)
 expect(futureTerm[0].dateLabel).toBe('28/12')
 expect(campusToday(monday)).toBe('2026-11-09')
})

it('assigns a stable color tone per course', () => {
 const tone = courseTone('CD-COURSE-001')
 expect(tone).toBeGreaterThanOrEqual(1)
 expect(tone).toBeLessThanOrEqual(6)
 expect(courseTone('CD-COURSE-001')).toBe(tone)
 expect(HOUR_HEIGHT).toBeGreaterThan(0)
})
