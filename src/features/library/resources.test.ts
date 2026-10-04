import { expect, it } from 'vitest'
import { titles, copies, loans } from './resources'
it('whitelists catalog payloads and preserves immutable copy parents and exact versions', () => {
 const current = { id: 'c', rowVersion: 9223372036854775806n, status: 'ACTIVE' }
 expect(titles.body({ code: 'BK1', title: 'Tên sách', author: 'Tác giả', actor: 'bad' })).toEqual({ code: 'BK1', title: 'Tên sách', author: 'Tác giả' })
 expect(copies.body({ code: 'CP1', titleId: 'changed', status: 'INACTIVE' }, current)).toEqual({ code: 'CP1', status: 'INACTIVE', expectedVersion: current.rowVersion })
})
it('returns via owner endpoint with only fresh version and retains terminal history', () => {
 const current = { id: 'loan', copyId: 'c', studentId: 's', status: 'OPEN', rowVersion: 9223372036854775806n }
 expect(loans.updatePath!(current)).toBe('/api/v1/admin/library/loans/loan/return')
 expect(loans.body({ action: 'RETURN', studentId: 'changed', dueAt: 'bad' }, current)).toEqual({ expectedVersion: current.rowVersion })
 expect(loans.body({ copyId: 'c', studentId: 's', dueAt: 'bad' })).toEqual({ copyId: 'c', studentId: 's' })
 expect(loans.editValues!(current).action).toBeUndefined()
 expect(loans.readOnly!({ ...current, status: 'RETURNED' })).toBe(true)
 expect(loans.disabled!({ name: 'copyId', label: '', type: 'bookCopy' }, current)).toBe(true)
})
