import type { components } from '../../api/schema'

export type SectionSchedule = components['schemas']['com.campus.academic.domain.SectionSchedule']

const weekdayNames = ['', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
export const weekdayText = (weekday?: number) => (weekday && weekday >= 1 && weekday <= 7 ? weekdayNames[weekday] : 'Chưa xếp lịch')
export const clockText = (value?: string) => (value ? value.slice(0, 5) : '—')
export const scheduleText = (schedule?: SectionSchedule) => {
 if (!schedule?.weekday) return 'Chưa xếp lịch'
 const time = schedule.startsAt && schedule.endsAt ? `${clockText(schedule.startsAt)}–${clockText(schedule.endsAt)}` : ''
 return [weekdayText(schedule.weekday), time, schedule.room].filter(Boolean).join(' · ')
}
export const weekdayOptions = weekdayNames.slice(1).map((label, index) => ({ value: String(index + 1), label }))

export function scheduleFormValues(values: Record<string, unknown>) {
 const schedule = values.schedule as SectionSchedule | undefined
 return {
  weekday: schedule?.weekday ? String(schedule.weekday) : undefined,
  startsAt: schedule?.startsAt ? clockText(schedule.startsAt) : undefined,
  endsAt: schedule?.endsAt ? clockText(schedule.endsAt) : undefined,
  room: schedule?.room ?? undefined,
 }
}

export function scheduleBody(values: Record<string, unknown>) {
 return {
  weekday: values.weekday ? Number(values.weekday) : undefined,
  startsAt: values.startsAt ? String(values.startsAt) : undefined,
  endsAt: values.endsAt ? String(values.endsAt) : undefined,
  room: values.room ? String(values.room) : undefined,
 }
}
