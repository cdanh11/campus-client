import type { RegistryRow } from './resources'
export type ReferenceKind = 'organization' | 'identity' | 'term' | 'course' | 'offering' | 'faculty' | 'student' | 'section' | 'building' | 'room' | 'bed' | 'fee' | 'charge' | 'notificationTemplate' | 'recipient' | 'event' | 'bookTitle' | 'bookCopy'
export interface ReferenceSource { path: string; sort: string; search?: boolean; eligible?: Record<string, string>; available?: (row: RegistryRow) => boolean; label: (row: RegistryRow) => string }
const base = '/api/v1/admin/'
const named = (code: string, name: string) => (row: RegistryRow) => String(row[code]) + ' · ' + String(row[name])
export const referenceSources: Record<ReferenceKind, ReferenceSource> = {
 bookTitle: { path: base + 'library/titles', sort: 'code,asc', eligible: { status: 'ACTIVE' }, label: named('code', 'title') },
 bookCopy: { path: base + 'library/copies', sort: 'code,asc', eligible: { status: 'ACTIVE' }, label: (row) => String(row.code) },
 event: { path: base + 'events', sort: 'startsAt,asc', eligible: { status: 'OPEN' }, label: named('code', 'title') },
 notificationTemplate: { path: base + 'notifications/templates', sort: 'code,asc', eligible: { status: 'ACTIVE' }, label: named('code', 'name') },
 recipient: { path: base + 'users', sort: 'email,asc', eligible: { status: 'ACTIVE' }, label: named('email', 'displayName') },
 building: { path: base + 'dormitory/buildings', sort: 'code,asc', eligible: { status: 'ACTIVE' }, label: named('code', 'name') },
 room: { path: base + 'dormitory/rooms', sort: 'code,asc', eligible: { status: 'ACTIVE' }, label: named('code', 'name') },
 bed: { path: base + 'dormitory/beds', sort: 'code,asc', eligible: { status: 'ACTIVE' }, label: named('code', 'name') },
 fee: { path: base + 'finance/fees', sort: 'code,asc', eligible: { status: 'ACTIVE' }, label: named('code', 'name') },
 charge: { path: base + 'finance/charges', sort: 'dueDate,asc', eligible: { status: 'OPEN' }, label: named('chargeNumber', 'feeName') },
 organization: { path: base + 'organization-units', sort: 'code,asc', eligible: { status: 'ACTIVE' }, label: named('code', 'name') },
 identity: { path: base + 'users', sort: 'email,asc', label: named('email', 'status') },
 term: { path: base + 'academic/terms', sort: 'code,asc', available: (row) => row.status === 'PLANNED' || row.status === 'ACTIVE', label: named('code', 'name') },
 course: { path: base + 'academic/courses', sort: 'code,asc', eligible: { status: 'ACTIVE' }, label: named('code', 'title') },
 offering: { path: base + 'academic/offerings', sort: 'createdAt,desc', search: false, available: (row) => row.status === 'DRAFT' || row.status === 'OPEN', label: (row) => String(row.id) + ' · ' + String(row.status) },
 faculty: { path: base + 'faculty-staff', sort: 'personnelNumber,asc', eligible: { status: 'ACTIVE', personnelType: 'FACULTY' }, label: named('personnelNumber', 'fullName') },
 student: { path: base + 'students', sort: 'studentNumber,asc', eligible: { status: 'ACTIVE' }, label: named('studentNumber', 'fullName') },
 section: { path: base + 'academic/sections', sort: 'code,asc', eligible: { status: 'OPEN' }, label: named('code', 'status') },
}
