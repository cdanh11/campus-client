import type { CurriculumCourse, TranscriptRecord } from './student'

export type Letter = 'A' | 'B' | 'C' | 'D' | 'F'
export const letters: Letter[] = ['A', 'B', 'C', 'D', 'F']
export const letterPoints: Record<Letter, number> = { A: 4, B: 3, C: 2, D: 1, F: 0 }

export const numberValue = (value?: number | bigint | unknown) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : 0
}

export const roundGpa = (value: number) => Math.round(value * 100) / 100
export const gpaText = (value?: number | bigint | unknown) => roundGpa(numberValue(value)).toFixed(2)
export const pointOf = (letter?: string) => letterPoints[(letter ?? 'F') as Letter] ?? 0

export const classificationLabels: Record<string, string> = {
 XUAT_SAC: 'Xuất sắc', GIOI: 'Giỏi', KHA: 'Khá', TRUNG_BINH: 'Trung bình', YEU: 'Yếu', KEM: 'Kém',
}
export const classificationLabel = (value?: string) => (value ? classificationLabels[value] ?? value : '—')
export const classificationOf = (gpa: number) => {
 const value = roundGpa(gpa)
 if (value >= 3.6) return 'XUAT_SAC'
 if (value >= 3.2) return 'GIOI'
 if (value >= 2.5) return 'KHA'
 if (value >= 2.0) return 'TRUNG_BINH'
 if (value >= 1.0) return 'YEU'
 return 'KEM'
}

export const schemeLabels: Record<string, string> = {
 GENERAL: 'Đại cương · chuyên cần 10% + giữa kỳ 40% + cuối kỳ 50%',
 MAJOR_FINAL: 'Chuyên ngành · chuyên cần 10% + giữa kỳ 30% + cuối kỳ 60%',
 MAJOR_PROJECT: 'Chuyên ngành có đồ án · chuyên cần 10% + giữa kỳ 40% + đồ án 50%',
}
export const schemeLabel = (value?: string) => (value ? schemeLabels[value] ?? value : '—')

export function bestAttempts(records: TranscriptRecord[]) {
 const best = new Map<string, TranscriptRecord>()
 for (const record of records) {
  const courseId = record.course?.id
  if (!courseId) continue
  const current = best.get(courseId)
  if (!current || pointOf(record.letterGrade) > pointOf(current.letterGrade)
   || (pointOf(record.letterGrade) === pointOf(current.letterGrade) && numberValue(record.totalScore) > numberValue(current.totalScore))) {
   best.set(courseId, record)
  }
 }
 return best
}

export interface Projection {
 credits: number
 points: number
 gpa: number
 classification: string
 delta: number
}

export interface ProjectionInput {
 records: TranscriptRecord[]
 future: CurriculumCourse[]
 futureLetters: Record<string, Letter | undefined>
 improvements: Record<string, Letter | undefined>
}

export function projectGpa({ records, future, futureLetters, improvements }: ProjectionInput): Projection {
 const best = bestAttempts(records)
 let credits = 0, points = 0
 for (const record of best.values()) {
  const courseCredits = numberValue(record.course?.credits)
  credits += courseCredits
  points += pointOf(record.letterGrade) * courseCredits
 }
 const current = credits === 0 ? 0 : points / credits
 for (const [courseId, target] of Object.entries(improvements)) {
  const record = best.get(courseId)
  if (!record || !target) continue
  const courseCredits = numberValue(record.course?.credits)
  const gain = pointOf(target) - pointOf(record.letterGrade)
  if (gain > 0) points += gain * courseCredits
 }
 for (const course of future) {
  const target = futureLetters[course.courseId ?? '']
  if (!target) continue
  const courseCredits = numberValue(course.credits)
  credits += courseCredits
  points += pointOf(target) * courseCredits
 }
 const gpa = credits === 0 ? 0 : roundGpa(points / credits)
 return { credits, points, gpa, classification: classificationOf(gpa), delta: roundGpa(gpa - current) }
}

export function contribution(score: number | bigint | unknown, weight: number | bigint | unknown) {
 return Math.round(numberValue(score) * numberValue(weight) * 100) / 100
}
