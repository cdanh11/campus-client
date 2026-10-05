import { expect, it } from 'vitest'
import { beds, assignments, fees, charges } from './resources'
import { encodeJson } from '../../api/json'
it('excludes immutable inventory parents from PUT and retains assignment references on release', () => {
 expect(beds.body({ code: 'BED1', name: 'Giường 1', parentId: 'changed', status: 'INACTIVE' }, { id: 'bed', rowVersion: 10 })).toEqual({ code: 'BED1', name: 'Giường 1', status: 'INACTIVE', expectedVersion: 10 })
 expect(assignments.body({ studentId: 'changed', bedId: 'changed', status: 'RELEASED' }, { id: 'stay', rowVersion: 11 })).toEqual({ status: 'RELEASED', expectedVersion: 11 })
 expect(assignments.readOnly!({ id: 'stay', rowVersion: 12, status: 'RELEASED' })).toBe(true)
 expect(assignments.editValues!({ id: 'stay', rowVersion: 10, status: 'ASSIGNED' }).status).toBeUndefined()
})
it('sends exact VND and long versions without a float conversion', () => {
 const body = fees.body({ code: 'FEE1', name: 'Phí', amount: '9999999999999999999', status: 'ACTIVE' }, { id: 'f', rowVersion: 9223372036854775807n })
 expect(encodeJson(body)).toBe('{"code":"FEE1","name":"Phí","amount":9999999999999999999,"status":"ACTIVE","expectedVersion":9223372036854775807}')
})
it('cannot override charge snapshot fields or references through cancellation', () => {
 expect(charges.body({ chargeNumber: 'C1', studentId: 's', feeId: 'f', dueDate: '2026-10-01', amount: '1', currency: 'USD', feeName: 'invented' })).toEqual({ chargeNumber: 'C1', studentId: 's', feeId: 'f', dueDate: '2026-10-01' })
 expect(charges.body({ amount: '1', status: 'CANCELLED', studentId: 'other' }, { id: 'c', rowVersion: 4 })).toEqual({ status: 'CANCELLED', expectedVersion: 4 })
 expect(charges.readOnly!({ id: 'c', rowVersion: 5, status: 'CANCELLED' })).toBe(true)
})
