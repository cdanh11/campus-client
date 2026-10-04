import { expect, it } from 'vitest'
import { academicResources, lifecycleOptions } from './resources'
import { encodeJson } from '../../api/json'
it('keeps creation defaults on the server and immutable references out of lifecycle updates', () => {
 expect(academicResources.terms.body({ code: 'T1', name: 'Term 1', startDate: '2026-01-01', endDate: '2026-02-01', status: 'ACTIVE' })).toEqual({ code: 'T1', name: 'Term 1', startDate: '2026-01-01', endDate: '2026-02-01' })
 expect(academicResources.offerings.body({ termId: 'changed', courseId: 'changed', status: 'OPEN' }, { id: 'o', rowVersion: 9223372036854775807n })).toEqual({ status: 'OPEN', expectedVersion: 9223372036854775807n })
 expect(academicResources.enrollments.body({ studentId: 'changed', sectionId: 'changed', status: 'ENROLLED' }, { id: 'e', rowVersion: 4 })).toEqual({ status: 'ENROLLED', expectedVersion: 4 })
})
it('restores withdrawn membership on the same record and preserves the exact long version', () => {
 const current = { id: 'original-membership', rowVersion: 9223372036854775806n, status: 'WITHDRAWN', studentId: 's', sectionId: 'c' }
 const form = academicResources.enrollments.editValues!(current)
 expect(encodeJson(academicResources.enrollments.body({ ...form, status: 'ENROLLED' }, current))).toBe('{"status":"ENROLLED","expectedVersion":9223372036854775806}')
})
it('freezes term dates after activation and section admission fields after DRAFT', () => {
 const current = { id: 'section', rowVersion: 1, status: 'OPEN' }
 for (const name of ['offeringId', 'code', 'capacity', 'facultyId']) {
  const field = academicResources.sections.fields.find((field) => field.name === name)!
  expect(academicResources.sections.disabled!(field, current)).toBe(true)
 }
 expect(academicResources.sections.disabled!(academicResources.sections.fields.find((field) => field.name === 'status')!, current)).toBe(false)
 expect(academicResources.terms.disabled!(academicResources.terms.fields.find((field) => field.name === 'startDate')!, { ...current, status: 'ACTIVE' })).toBe(true)
})
it('offers approved transitions only, while allowing retained metadata updates', () => {
 expect(lifecycleOptions('term', 'PLANNED')).toEqual(['PLANNED', 'ACTIVE', 'CANCELLED'])
 expect(lifecycleOptions('term', 'CLOSED')).toEqual(['CLOSED'])
 expect(lifecycleOptions('delivery', 'OPEN')).toEqual(['OPEN', 'CLOSED'])
 expect(lifecycleOptions('delivery', 'CANCELLED')).toEqual(['CANCELLED'])
 expect(lifecycleOptions('enrollment', 'ENROLLED')).toEqual(['WITHDRAWN'])
 expect(lifecycleOptions('enrollment', 'WITHDRAWN')).toEqual(['ENROLLED'])
})
it('whitelists course fields and allows missing faculty only on the draft create payload', () => {
 expect(academicResources.courses.body({ code: 'CS01', title: 'Course', credits: 30, organizationUnitId: 'org', status: 'ACTIVE', programId: 'invented', securityVersion: 5 })).toEqual({ code: 'CS01', title: 'Course', credits: 30, organizationUnitId: 'org', status: 'ACTIVE' })
 expect(academicResources.sections.body({ code: 'S1', capacity: 1, offeringId: 'o', status: 'OPEN' })).toEqual({ code: 'S1', capacity: 1, offeringId: 'o', facultyId: undefined })
})
