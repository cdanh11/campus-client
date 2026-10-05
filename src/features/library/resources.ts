import type { components } from '../../api/schema'
import type { Field, Resource, Values } from '../people/resources'
import { nameRule, trimOrganization } from '../../forms/validation'
type Schemas = components['schemas']
const options = (values: string[]) => values.map((value) => ({ value, label: value }))
const active = options(['ACTIVE', 'INACTIVE'])
const sorts = (fields: string[], first: string) => {
 const all = fields.flatMap((field) => ['asc', 'desc'].map((direction) => ({ value: field + ',' + direction, label: field + ' ' + direction })))
 return [...all.filter((item) => item.value === first), ...all.filter((item) => item.value !== first)]
}
const str = (values: Values, key: string) => String(values[key] ?? '')
const code: Field = { name: 'code', label: 'Mã', type: 'text', rules: [nameRule(2, 32, trimOrganization), nameRule(2, 32, (value) => trimOrganization(value).toUpperCase())] }
const status: Field = { name: 'status', label: 'Trạng thái', type: 'enum', updateOnly: true, required: true, options: active }
export const titles: Resource = {
 path: '/api/v1/admin/library/titles', title: 'Đầu sách', singular: 'đầu sách', identifier: 'code', states: active,
 fields: [code, { name: 'title', label: 'Tên sách', type: 'text', rules: [nameRule(2, 160, trimOrganization)] }, { name: 'author', label: 'Tác giả', type: 'text', rules: [nameRule(2, 160, trimOrganization)] }, status],
 columns: [{ key: 'code', title: 'Mã' }, { key: 'title', title: 'Tên sách' }, { key: 'author', title: 'Tác giả' }],
 sorts: sorts(['code', 'title', 'author', 'status', 'createdAt', 'updatedAt'], 'code,asc'),
 body: (values, current) => {
  const base = { code: str(values, 'code'), title: str(values, 'title'), author: str(values, 'author') } satisfies Schemas['LibraryTitleCreate']
  return current ? { ...base, status: values.status as Schemas['LibraryTitleUpdate']['status'], expectedVersion: current.rowVersion } satisfies Schemas['LibraryTitleUpdate'] : base
 },
}
export const copies: Resource = {
 path: '/api/v1/admin/library/copies', title: 'Bản sao sách', singular: 'bản sao', identifier: 'code', states: active,
 fields: [{ name: 'titleId', label: 'Đầu sách', type: 'bookTitle', required: true }, code, status],
 filters: [{ name: 'titleId', label: 'Lọc đầu sách', type: 'bookTitle' }],
 columns: [{ key: 'code', title: 'Mã bản sao' }, { key: 'titleId', title: 'Đầu sách', reference: 'bookTitle' }],
 sorts: sorts(['code', 'status', 'createdAt', 'updatedAt'], 'code,asc'),
 note: 'Đầu sách cố định sau khi tạo. ACTIVE không có nghĩa bản sao đang rảnh; máy chủ kiểm tra lượt mượn đang mở.',
 disabled: (field) => field.name === 'titleId',
 body: (values, current) => current
  ? { code: str(values, 'code'), status: values.status as Schemas['LibraryCopyUpdate']['status'], expectedVersion: current.rowVersion } satisfies Schemas['LibraryCopyUpdate']
  : { titleId: str(values, 'titleId'), code: str(values, 'code') } satisfies Schemas['LibraryCopyCreate'],
}
export const loans: Resource = {
 path: '/api/v1/admin/library/loans', title: 'Mượn và trả sách', singular: 'lượt mượn', identifier: 'id', search: false,
 fields: [{ name: 'copyId', label: 'Bản sao', type: 'bookCopy', required: true }, { name: 'studentId', label: 'Sinh viên', type: 'student', required: true }, { name: 'action', label: 'Thao tác', type: 'enum', updateOnly: true, required: true, options: options(['RETURN']) }],
 filters: [{ name: 'copyId', label: 'Lọc bản sao', type: 'bookCopy' }, { name: 'studentId', label: 'Lọc sinh viên', type: 'student' }],
 columns: [{ key: 'copyId', title: 'Bản sao', reference: 'bookCopy' }, { key: 'studentId', title: 'Sinh viên', reference: 'student' }, { key: 'borrowedAt', title: 'Mượn lúc' }, { key: 'dueAt', title: 'Hạn trả' }, { key: 'returnedAt', title: 'Trả lúc' }],
 states: options(['OPEN', 'RETURNED']), sorts: sorts(['borrowedAt', 'dueAt', 'returnedAt', 'status', 'createdAt', 'updatedAt'], 'borrowedAt,desc'),
 note: 'Hạn trả do máy chủ đặt sau 14 ngày. Chọn RETURN rồi Lưu để xác nhận trả; vẫn được trả khi hồ sơ đã INACTIVE. Lần mượn tiếp theo tạo bản ghi mới, giữ lịch sử cũ.',
 disabled: (field) => field.name !== 'action', readOnly: (current) => current.status === 'RETURNED',
 editValues: (current) => ({ ...current, action: undefined }),
 updatePath: (current) => '/api/v1/admin/library/loans/' + encodeURIComponent(current.id) + '/return',
 body: (values, current) => current
  ? { expectedVersion: current.rowVersion } satisfies Schemas['LibraryLoanReturn']
  : { copyId: str(values, 'copyId'), studentId: str(values, 'studentId') } satisfies Schemas['LibraryLoanCreate'],
}
