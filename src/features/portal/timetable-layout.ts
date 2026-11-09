import type { Enrollment } from './student'

/** Campus-time axis defaults: 06:30–18:30, expanded to fit any earlier/later meeting. */
export const AXIS_START = 6 * 60 + 30
export const AXIS_END = 18 * 60 + 30
export const HOUR_HEIGHT = 56

const clockPattern = /^(\d{1,2}):(\d{2})/

export function clockMinutes(value?: string): number | null {
 const match = value?.match(clockPattern)
 if (!match) return null
 const hour = Number(match[1])
 const minute = Number(match[2])
 if (!Number.isInteger(hour) || !Number.isInteger(minute) || hour > 23 || minute > 59) return null
 return hour * 60 + minute
}

export type WeekEntry = { item: Enrollment; day: number; start: number; end: number }
export type WeekBlock = WeekEntry & { lane: number; lanes: number; top: number; height: number }

export function placeMeetings(items: Enrollment[]) {
 const entries: WeekEntry[] = []
 const unscheduled: Enrollment[] = []
 for (const item of items) {
  const day = item.schedule?.weekday ?? 0
  const start = clockMinutes(item.schedule?.startsAt)
  const end = clockMinutes(item.schedule?.endsAt)
  if (day < 1 || day > 7 || start === null || end === null || end <= start) { unscheduled.push(item); continue }
  entries.push({ item, day, start, end })
 }
 entries.sort((a, b) => a.day - b.day || a.start - b.start || a.end - b.end)
 return { entries, unscheduled }
}

function assignLanes(entries: WeekEntry[]) {
 const placed: (WeekEntry & { lane: number; lanes: number })[] = []
 let cluster: (WeekEntry & { lane: number })[] = []
 let laneEnds: number[] = []
 let clusterEnd = Number.NEGATIVE_INFINITY
 const flush = () => {
  for (const entry of cluster) placed.push({ ...entry, lanes: laneEnds.length })
  cluster = []
  laneEnds = []
  clusterEnd = Number.NEGATIVE_INFINITY
 }
 for (const entry of entries) {
  if (cluster.length && entry.start >= clusterEnd) flush()
  const free = laneEnds.findIndex((end) => end <= entry.start)
  const lane = free === -1 ? laneEnds.length : free
  laneEnds[lane] = entry.end
  cluster.push({ ...entry, lane })
  clusterEnd = Math.max(clusterEnd, entry.end)
 }
 flush()
 return placed
}

export function layoutWeek(items: Enrollment[], options?: { axisStart?: number; axisEnd?: number }) {
 const { entries, unscheduled } = placeMeetings(items)
 let axisStart = options?.axisStart ?? AXIS_START
 let axisEnd = options?.axisEnd ?? AXIS_END
 for (const entry of entries) {
  axisStart = Math.min(axisStart, Math.floor(entry.start / 60) * 60)
  axisEnd = Math.max(axisEnd, Math.ceil(entry.end / 60) * 60)
 }
 axisStart = Math.max(0, axisStart)
 axisEnd = Math.min(24 * 60, axisEnd)
 if (axisEnd <= axisStart) axisEnd = axisStart + 60
 const span = axisEnd - axisStart
 const hours: number[] = []
 for (let minute = Math.ceil(axisStart / 60) * 60; minute < axisEnd; minute += 60) hours.push(minute / 60)
 const blocks: WeekBlock[] = []
 for (let day = 1; day <= 7; day += 1) {
  const dayEntries = entries.filter((entry) => entry.day === day)
  for (const entry of assignLanes(dayEntries)) {
   const start = Math.max(entry.start, axisStart)
   const end = Math.min(entry.end, axisEnd)
   if (end <= start) continue
   blocks.push({ ...entry, top: ((start - axisStart) / span) * 100, height: ((end - start) / span) * 100 })
  }
 }
 return { axisStart, axisEnd, hours, blocks, unscheduled }
}

export function courseTone(seed?: string) {
 let hash = 0
 for (const char of seed ?? '') hash = (hash * 31 + char.charCodeAt(0)) % 997
 return (hash % 6) + 1
}

const hcmWeekdayNames: Record<string, number> = { Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6, Sun: 7 }

/** Current weekday and minute-of-day in campus time (Asia/Ho_Chi_Minh). */
export function campusNow(now = new Date()) {
 const parts = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
 }).formatToParts(now)
 const get = (type: string) => parts.find((part) => part.type === type)?.value ?? ''
 return { weekday: hcmWeekdayNames[get('weekday')] ?? 1, minutes: Number(get('hour')) * 60 + Number(get('minute')) }
}

const hcmDate = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit' })

/** Monday–Sunday of the week containing `reference`, with dd/MM labels and today's flag. */
export function weekDays(reference = new Date(), today = new Date()) {
 const [year, month, day] = hcmDate.format(reference).split('-').map(Number)
 const referenceDay = Date.UTC(year, month - 1, day)
 const weekday = ((new Date(referenceDay).getUTCDay() + 6) % 7) + 1
 const monday = referenceDay - (weekday - 1) * 86_400_000
 const todayIso = hcmDate.format(today)
 return Array.from({ length: 7 }, (_, index) => {
  const date = new Date(monday + index * 86_400_000)
  const dateLabel = `${String(date.getUTCDate()).padStart(2, '0')}/${String(date.getUTCMonth() + 1).padStart(2, '0')}`
  const iso = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`
  return { weekday: index + 1, dateLabel, today: iso === todayIso }
 })
}

/** ISO calendar date in campus time (yyyy-mm-dd), comparable with term boundaries. */
export function campusToday(now = new Date()) {
 return hcmDate.format(now)
}
