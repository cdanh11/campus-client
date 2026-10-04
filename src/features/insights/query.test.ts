import { expect, it } from 'vitest'
import { LosslessNumber } from 'lossless-json'
import { auditParams, reportParams, exactCount, metricText, uuid } from './query'
const id = '00000000-0000-0000-0000-000000000001'
it('exports applied report filters without page/size and preserves UTC nanosecond boundaries', () => {
 const filters = { studentId: id, resourceId: id, status: 'CANCELLED', from: '2026-01-01T00:00:00.000000001Z', until: '2026-01-01T00:00:00.000000002Z' }
 const page = new URLSearchParams(reportParams('EVENT_MEMBERSHIP', filters, 2, 50, 'id,desc'))
 const csv = new URLSearchParams(reportParams('EVENT_MEMBERSHIP', filters, 0, 50, 'id,desc', true))
 expect(page.get('page')).toBe('2')
 page.delete('page'); page.delete('size')
 expect(csv.toString()).toBe(page.toString())
})
it('rejects unsupported report filters, invalid identifiers, bounds, sort and unsafe offsets', () => {
 expect(() => reportParams('STUDENT_DEBT', { resourceId: id })).toThrow()
 expect(() => reportParams('LIBRARY_LOANS', { status: 'OPEN' })).toThrow()
 expect(() => reportParams('EVENT_MEMBERSHIP', { overdueOnly: true })).toThrow()
 expect(() => reportParams('STUDENT_DEBT', {}, 2147483647, 100)).toThrow()
 expect(() => reportParams('STUDENT_DEBT', {}, 0, 20, 'title,asc')).toThrow()
 expect(() => uuid('broken')).toThrow()
 expect(() => reportParams('STUDENT_DEBT', { from: '2026-01-01T00:00:00Z', until: '2026-01-01T00:00:00Z' })).toThrow()
 expect(new URLSearchParams(reportParams('LIBRARY_LOANS', { overdueOnly: true })).get('overdueOnly')).toBe('true')
})
it('bounds audit action by source and rejects cross-source resource filters', () => {
 expect(new URLSearchParams(auditParams('FINANCE', { targetId: id, actorId: id, resource: 'CHARGE', action: 'CREATED' })).get('targetId')).toBe(id)
 expect(() => auditParams('IDENTITY', { resource: 'CHARGE' })).toThrow()
 expect(() => auditParams('LIBRARY', { action: 'A'.repeat(17) })).toThrow()
 expect(() => auditParams('PEOPLE', { action: 'A'.repeat(33) })).toThrow()
 expect(() => auditParams('IDENTITY', { action: 'lowercase' })).toThrow()
 expect(() => auditParams('IDENTITY', { action: 'A'.repeat(64) })).not.toThrow()
})
it('keeps aggregate VND beyond per-charge limit exact and rejects fractions/unsafe numbers', () => {
 expect(exactCount(new LosslessNumber('19999999999999999998.00'))).toBe(19999999999999999998n)
 expect(metricText(19999999999999999998n, true)).toBe('19.999.999.999.999.999.998 VND')
 expect(() => exactCount(Number.MAX_SAFE_INTEGER + 1)).toThrow()
 expect(() => exactCount(new LosslessNumber('1.25'))).toThrow()
 expect(() => exactCount(-1n)).toThrow()
})
