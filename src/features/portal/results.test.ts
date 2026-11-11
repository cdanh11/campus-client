import { expect, it } from 'vitest'
import type { CurriculumCourse, TranscriptRecord } from './student'
import { bestAttempts, classificationOf, gpaText, projectGpa, pointOf } from './results'

const record = (overrides: Partial<TranscriptRecord>): TranscriptRecord => ({
 enrollmentId: 'e', course: { id: 'c', code: 'CD-COURSE-001', title: 'Môn', credits: 3 },
 letterGrade: 'B', totalScore: 8, passed: true, retake: false, improvement: false,
 attendanceScore: 8, midtermScore: 8, finalScore: 8, attendanceWeight: 0.1, midtermWeight: 0.4, finalWeight: 0.5, projectWeight: 0,
 ...overrides,
})

it('maps the five letter bands to the four-point scale', () => {
 expect(pointOf('A')).toBe(4)
 expect(pointOf('B')).toBe(3)
 expect(pointOf('C')).toBe(2)
 expect(pointOf('D')).toBe(1)
 expect(pointOf('F')).toBe(0)
 expect(gpaText(2)).toBe('2.00')
})

it('classifies cumulative GPA with the university thresholds', () => {
 expect(classificationOf(3.6)).toBe('XUAT_SAC')
 expect(classificationOf(3.59)).toBe('GIOI')
 expect(classificationOf(3.2)).toBe('GIOI')
 expect(classificationOf(2.5)).toBe('KHA')
 expect(classificationOf(2.0)).toBe('TRUNG_BINH')
 expect(classificationOf(1.0)).toBe('YEU')
 expect(classificationOf(0.99)).toBe('KEM')
})

it('keeps the highest attempt of each course for cumulative GPA', () => {
 const failed = record({ enrollmentId: 'old', letterGrade: 'F', totalScore: 3.2, passed: false })
 const retake = record({ enrollmentId: 'new', letterGrade: 'A', totalScore: 9, retake: true })
 const best = bestAttempts([failed, retake])
 expect(best.size).toBe(1)
 expect(best.get('c')?.enrollmentId).toBe('new')
})

it('projects future courses and only applies an improvement that raises the best attempt', () => {
 const current = record({ enrollmentId: 'current', course: { id: 'c', code: 'CD-COURSE-001', title: 'Môn', credits: 3 }, letterGrade: 'C', totalScore: 5.5 })
 const future: CurriculumCourse = { courseId: 'next', code: 'CD-COURSE-002', title: 'Môn mới', credits: 3, status: 'NOT_STARTED' }
 const higher = projectGpa({ records: [current], future: [future], futureLetters: { next: 'B' }, improvements: { c: 'B' } })
 expect(higher.credits).toBe(6)
 expect(higher.gpa).toBe(3)
 expect(higher.delta).toBe(1)
 const lower = projectGpa({ records: [current], future: [], futureLetters: {}, improvements: { c: 'F' } })
 expect(lower.gpa).toBe(2)
 expect(lower.delta).toBe(0)
})

it('returns a zero GPA when no attempt or future course was selected', () => {
 expect(projectGpa({ records: [], future: [], futureLetters: {}, improvements: {} })).toEqual({ credits: 0, points: 0, gpa: 0, classification: 'KEM', delta: 0 })
})
