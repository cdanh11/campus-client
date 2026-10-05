import { expect, it } from 'vitest'
import { queryParams, safePageTotal } from './query-params'
it('encodes server paging, filters and allowed owner sort without losing query text', () => {
 const params = new URLSearchParams(queryParams({ page: 2, size: 20, q: 'Nguyễn & A', status: 'ACTIVE', sort: 'fullName,asc', personnelType: 'FACULTY' }))
 expect(params.get('q')).toBe('Nguyễn & A')
 expect(params.get('page')).toBe('2')
 expect(params.get('personnelType')).toBe('FACULTY')
 expect(params.has('role')).toBe(false)
})
it('rejects unsafe pages and counts rather than rounding API integers', () => {
 expect(() => queryParams({ page: 2147483647, size: 100, sort: 'code,asc' })).toThrow()
 expect(safePageTotal(100n)).toBe(100)
 expect(() => safePageTotal(9007199254740993n)).toThrow()
 expect(() => safePageTotal(-1)).toThrow()
})

it('encodes Academic reference filters without emitting unsupported empty text search', () => {
 const params = new URLSearchParams(queryParams({ page: 0, size: 20, sort: 'createdAt,desc', termId: 'term', courseId: 'course', offeringId: 'offer', studentId: 'student', sectionId: 'section', q: '' }))
 for (const [key, value] of Object.entries({ termId: 'term', courseId: 'course', offeringId: 'offer', studentId: 'student', sectionId: 'section' })) expect(params.get(key)).toBe(value)
 expect(params.has('q')).toBe(false)
})
