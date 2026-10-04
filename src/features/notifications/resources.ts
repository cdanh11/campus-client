import type { components } from '../../api/schema'
import type { Field, Resource } from '../people/resources'
import { nameRule, trimOrganization } from '../../forms/validation'
type Schemas = components['schemas']
const text = (name: string, label: string, max = 160, updateOnly = false): Field => ({ name, label, type: name === 'body' ? 'textarea' : 'text', updateOnly, rules: [nameRule(2, max, trimOrganization)] })
const sorts = (fields: string[], first: string) => {
 const values = fields.flatMap((key) => ['asc', 'desc'].map((direction) => ({ value: key + ',' + direction, label: key + ' ' + direction })))
 return [...values.filter((item) => item.value === first), ...values.filter((item) => item.value !== first)]
}
const active = [{ value: 'ACTIVE', label: 'Đang hoạt động' }, { value: 'INACTIVE', label: 'Ngừng hoạt động' }]
export const templates: Resource = {
 path: '/api/v1/admin/notifications/templates', title: 'Mẫu thông báo', singular: 'mẫu thông báo', identifier: 'code', states: active,
 fields: [{ name: 'code', label: 'Mã mẫu', type: 'text', rules: [nameRule(2, 32, trimOrganization), nameRule(2, 32, (value) => trimOrganization(value).toUpperCase())] }, text('name', 'Tên mẫu'), text('title', 'Tiêu đề'), text('body', 'Nội dung', 4000), { name: 'status', label: 'Trạng thái', type: 'enum', options: active, required: true, updateOnly: true }],
 columns: [{ key: 'code', title: 'Mã mẫu' }, { key: 'name', title: 'Tên mẫu' }, { key: 'title', title: 'Tiêu đề' }],
 sorts: sorts(['code', 'name', 'status', 'createdAt', 'updatedAt'], 'code,asc'),
 note: 'Nội dung văn bản thuần. Sửa mẫu không thay đổi bản chụp thông báo đã tạo.',
 body: (values, current) => {
  const base = { code: String(values.code), name: String(values.name), title: String(values.title), body: String(values.body) } satisfies Schemas['NotificationTemplateCreate']
  return current ? { ...base, status: values.status as Schemas['NotificationTemplateUpdate']['status'], expectedVersion: current.rowVersion } satisfies Schemas['NotificationTemplateUpdate'] : base
 },
}
export const notices: Resource = {
 path: '/api/v1/admin/notifications/notices', title: 'Thông báo', singular: 'thông báo', identifier: 'title',
 fields: [{ name: 'templateId', label: 'Mẫu thông báo', type: 'notificationTemplate', required: true }, text('title', 'Tiêu đề', 160, true), text('body', 'Nội dung', 4000, true)],
 columns: [{ key: 'title', title: 'Tiêu đề' }, { key: 'templateId', title: 'Mẫu gốc', reference: 'notificationTemplate' }, { key: 'publishedAt', title: 'Phát hành lúc' }],
 sorts: sorts(['title', 'status', 'createdAt', 'updatedAt'], 'createdAt,desc'), states: [{ value: 'DRAFT', label: 'Bản nháp' }, { value: 'PUBLISHED', label: 'Đã phát hành' }],
 disabled: (field) => field.name === 'templateId', readOnly: (current) => current.status === 'PUBLISHED',
 note: 'Tạo bản nháp từ mẫu ACTIVE; sửa nội dung rồi chọn Phát hành cho từng tài khoản. Đã phát hành thì bất biến.',
 body: (values, current) => current ? { title: String(values.title), body: String(values.body), expectedVersion: current.rowVersion } satisfies Schemas['NotificationNoticeEdit'] : { templateId: String(values.templateId) } satisfies Schemas['NotificationNoticeCreate'],
}
