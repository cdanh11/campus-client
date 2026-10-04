import type { components } from '../../api/schema'
import type { Resource, Values } from '../people/resources'
import { nameRule, trimOrganization } from '../../forms/validation'
import { eventEndRule, instantRule } from './instant'
type Schemas = components['schemas']
const options = (values: string[]) => values.map((value) => ({ value, label: value }))
const sorts = (fields: string[], first: string) => {
 const values = fields.flatMap((field) => ['asc', 'desc'].map((direction) => ({ value: field + ',' + direction, label: field + ' ' + direction })))
 return [...values.filter((item) => item.value === first), ...values.filter((item) => item.value !== first)]
}
export function eventTransitions(status: string): string[] {
 return status === 'DRAFT' ? ['DRAFT', 'OPEN', 'CANCELLED'] : status === 'OPEN' ? ['OPEN', 'CLOSED', 'CANCELLED'] : []
}
export function registrationActions(status: string): string[] {
 return status === 'REGISTERED' ? ['CANCEL', 'ATTEND'] : status === 'CANCELLED' ? ['RESTORE'] : []
}
const str = (values: Values, key: string) => String(values[key] ?? '')
export const events: Resource = {
 path: '/api/v1/admin/events', title: 'Danh mục sự kiện', singular: 'sự kiện', identifier: 'code',
 fields: [
  { name: 'code', label: 'Mã sự kiện', type: 'text', rules: [nameRule(2, 32, trimOrganization), nameRule(2, 32, (value) => trimOrganization(value).toUpperCase())] },
  { name: 'title', label: 'Tên sự kiện', type: 'text', rules: [nameRule(2, 160, trimOrganization)] },
  { name: 'description', label: 'Mô tả', type: 'textarea', rules: [nameRule(2, 4000, trimOrganization)] },
  { name: 'startsAt', label: 'Bắt đầu (UTC)', type: 'text', placeholder: '2026-12-01T09:00:00Z', rules: [instantRule] },
  { name: 'endsAt', label: 'Kết thúc (UTC)', type: 'text', placeholder: '2026-12-01T10:00:00Z', dependencies: ['startsAt'], rules: [instantRule, eventEndRule] },
  { name: 'capacity', label: 'Sức chứa', type: 'integer', min: 1, max: 2147483647, required: true, rules: [{ type: 'integer', min: 1, max: 2147483647, message: 'Sức chứa là số nguyên từ 1 đến 2147483647.' }] },
  { name: 'status', label: 'Trạng thái', type: 'enum', updateOnly: true, required: true, options: options(['DRAFT', 'OPEN', 'CLOSED', 'CANCELLED']) },
 ],
 columns: [{ key: 'code', title: 'Mã' }, { key: 'title', title: 'Tên sự kiện' }, { key: 'startsAt', title: 'Bắt đầu UTC' }, { key: 'endsAt', title: 'Kết thúc UTC' }, { key: 'capacity', title: 'Sức chứa' }],
 states: options(['DRAFT', 'OPEN', 'CLOSED', 'CANCELLED']), sorts: sorts(['code', 'title', 'startsAt', 'endsAt', 'capacity', 'status', 'createdAt', 'updatedAt'], 'startsAt,asc'),
 note: 'Nhập UTC có hậu tố Z; giữ nguyên phần giây lẻ. ADMIN chủ động mở/đóng. OPEN quyết định nhận đăng ký; ngày không tự đóng sự kiện.',
 readOnly: (current) => current.status === 'CLOSED' || current.status === 'CANCELLED',
 choices: (field, current) => field.name === 'status' ? options(eventTransitions(String(current.status))) : field.options,
 body: (values, current) => {
  const base = { code: str(values, 'code'), title: str(values, 'title'), description: str(values, 'description'), startsAt: str(values, 'startsAt'), endsAt: str(values, 'endsAt'), capacity: values.capacity as number } satisfies Schemas['CampusEventCreate']
  return current ? { ...base, status: values.status as Schemas['CampusEventUpdate']['status'], expectedVersion: current.rowVersion } satisfies Schemas['CampusEventUpdate'] : base
 },
}
export const registrations: Resource = {
 path: '/api/v1/admin/event-registrations', title: 'Đăng ký sự kiện', singular: 'đăng ký sự kiện', identifier: 'id', search: false,
 createPath: (values) => '/api/v1/admin/events/' + encodeURIComponent(str(values, 'eventId')) + '/registrations',
 fields: [{ name: 'eventId', label: 'Sự kiện', type: 'event', required: true }, { name: 'studentId', label: 'Sinh viên', type: 'student', required: true }, { name: 'action', label: 'Thao tác', type: 'enum', updateOnly: true, required: true, options: options(['CANCEL', 'RESTORE', 'ATTEND']) }],
 filters: [{ name: 'eventId', label: 'Lọc sự kiện', type: 'event' }, { name: 'studentId', label: 'Lọc sinh viên', type: 'student' }],
 columns: [{ key: 'eventId', title: 'Sự kiện', reference: 'event' }, { key: 'studentId', title: 'Sinh viên', reference: 'student' }, { key: 'registeredAt', title: 'Đăng ký lúc' }, { key: 'cancelledAt', title: 'Hủy lúc' }, { key: 'attendedAt', title: 'Tham dự lúc' }],
 states: options(['REGISTERED', 'CANCELLED', 'ATTENDED']), sorts: sorts(['registeredAt', 'status', 'createdAt', 'updatedAt'], 'registeredAt,desc'),
 note: 'REGISTERED/ATTENDED chiếm chỗ. Hủy giải phóng chỗ; khôi phục cùng bản ghi nếu OPEN và còn chỗ. ADMIN xác nhận tham dự khi OPEN/CLOSED.',
 disabled: (field) => field.name !== 'action', readOnly: (current) => current.status === 'ATTENDED',
 editValues: (current) => ({ ...current, action: undefined }),
 choices: (field, current) => field.name === 'action' ? options(registrationActions(String(current.status))) : field.options,
 body: (values, current) => current ? { action: values.action as Schemas['EventRegistrationChange']['action'], expectedVersion: current.rowVersion } satisfies Schemas['EventRegistrationChange'] : { studentId: str(values, 'studentId') } satisfies Schemas['EventRegistrationCreate'],
}
