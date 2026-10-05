import { expect, it } from 'vitest'
import { events, registrations, eventTransitions, registrationActions } from './resources'
import { encodeJson } from '../../api/json'
it('routes registration POST to Event owner and excludes event/actor/status from body', () => {
 expect(registrations.createPath!({ eventId: 'event', studentId: 's' })).toBe('/api/v1/admin/events/event/registrations')
 expect(registrations.body({ eventId: 'event', studentId: 's', actorId: 'other', status: 'ATTENDED' })).toEqual({ studentId: 's' })
 expect(encodeJson(registrations.body({ studentId: 'changed', eventId: 'changed', action: 'RESTORE' }, { id: 'r', rowVersion: 9223372036854775807n }))).toBe('{"action":"RESTORE","expectedVersion":9223372036854775807}')
 expect(registrations.editValues!({ id: 'r', rowVersion: 0, status: 'REGISTERED' }).action).toBeUndefined()
})
it('allows only actual event/membership lifecycle actions and terminal reads', () => {
 expect(eventTransitions('DRAFT')).toEqual(['DRAFT', 'OPEN', 'CANCELLED'])
 expect(eventTransitions('OPEN')).toEqual(['OPEN', 'CLOSED', 'CANCELLED'])
 expect(eventTransitions('CLOSED')).toEqual([])
 expect(registrationActions('REGISTERED')).toEqual(['CANCEL', 'ATTEND'])
 expect(registrationActions('CANCELLED')).toEqual(['RESTORE'])
 expect(registrationActions('ATTENDED')).toEqual([])
 expect(events.readOnly!({ id: 'e', rowVersion: 0, status: 'CANCELLED' })).toBe(true)
 expect(registrations.readOnly!({ id: 'r', rowVersion: 0, status: 'ATTENDED' })).toBe(true)
})
it('keeps unmodified timestamp precision and exact catalog version in PUT', () => {
 const values = { code: 'EV1', title: 'Sự kiện', description: 'Mô tả', startsAt: '2026-12-01T09:00:00.123456Z', endsAt: '2026-12-01T10:00:00.000001Z', capacity: 1, status: 'OPEN' }
 expect(events.body(values, { id: 'e', rowVersion: 9223372036854775806n })).toEqual({ ...values, expectedVersion: 9223372036854775806n })
})
