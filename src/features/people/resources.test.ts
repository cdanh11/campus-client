import { expect, it } from 'vitest'
import { organization, student, personnel } from './resources'
import { encodeJson } from '../../api/json'
it('builds only the correct owner fields and preserves exact expectedVersion', () => {
 const values = { code: 'CS', name: 'Khoa CNTT', unitType: 'FACULTY', status: 'ACTIVE', studentNumber: 'must not leak', rowVersion: 100 }
 const body = organization.body(values, { id: '1', rowVersion: 9223372036854775807n })
 expect(encodeJson(body)).toBe('{"code":"CS","name":"Khoa CNTT","unitType":"FACULTY","status":"ACTIVE","expectedVersion":9223372036854775807}')
})
it('does not invent program fields or persist readonly/profile metadata', () => {
 const body = student.body({ studentNumber: 'SV01', fullName: 'Nguyễn A', organizationUnitId: 'unit-1', status: 'ACTIVE', programId: 'unapproved', email: '', identityUserId: '', id: 'must not leak' })
 expect(body).toEqual({ studentNumber: 'SV01', fullName: 'Nguyễn A', organizationUnitId: 'unit-1', status: 'ACTIVE', email: undefined, identityUserId: undefined })
})
it('keeps personnelType separate from Student and optional Identity links', () => {
 const body = personnel.body({ personnelNumber: 'GV01', fullName: 'Giảng viên A', personnelType: 'FACULTY', organizationUnitId: 'unit-1', identityUserId: 'inactive-account', status: 'ACTIVE' })
 expect(body).toMatchObject({ personnelType: 'FACULTY', identityUserId: 'inactive-account' })
})
