import { createElement } from 'react'
import type { components } from '../../api/schema'
import type { Field, Resource, Values } from '../people/resources'
import { nameRule, trimOrganization } from '../../forms/validation'
import { amountRule, formatVnd, integerVnd, paymentAmount } from './money'
import { ChargeBalancePanel } from './ChargeBalancePanel'
type Schemas = components['schemas']
const code = (key = 'code', label = 'Mã'): Field => ({ name: key, label, type: 'text', rules: [nameRule(2, 32, trimOrganization), nameRule(2, 32, (value) => trimOrganization(value).toUpperCase())] })
const text = (name: string, label: string): Field => ({ name, label, type: 'text', rules: [nameRule(2, 160, trimOrganization)] })
const options = (values: string[]) => values.map((value) => ({ value, label: value }))
const active = options(['ACTIVE', 'INACTIVE'])
const sorts = (fields: string[], first?: string) => {
 const all = fields.flatMap((key) => ['asc', 'desc'].map((direction) => ({ value: key + ',' + direction, label: key + ' ' + direction })))
 return first ? [...all.filter((item) => item.value === first), ...all.filter((item) => item.value !== first)] : all
}
const str = (values: Values, key: string) => String(values[key] ?? '')
const reference = (name: string, label: string, type: Field['type'], required = true): Field => ({ name, label, type, required })
const status: Field = { name: 'status', label: 'Trạng thái', type: 'enum', required: true, options: active, updateOnly: true }
function inventory(kind: 'buildings' | 'rooms' | 'beds', title: string, singular: string, parent?: 'building' | 'room'): Resource {
 return {
  path: '/api/v1/admin/dormitory/' + kind, title, singular, identifier: 'code', defaults: { status: 'ACTIVE' }, states: active,
  fields: [code(), text('name', 'Tên'), ...(parent ? [reference('parentId', parent === 'building' ? 'Tòa nhà' : 'Phòng', parent)] : []), status],
  filters: parent ? [reference('parentId', 'Lọc ' + (parent === 'building' ? 'tòa nhà' : 'phòng'), parent, false)] : undefined,
  columns: [{ key: 'code', title: 'Mã' }, { key: 'name', title: 'Tên' }, ...(parent ? [{ key: 'parentId', title: 'Trực thuộc', reference: parent }] : [])],
  sorts: sorts(['code', 'name', 'status', 'createdAt', 'updatedAt']),
  note: 'Trực thuộc cố định sau khi tạo. Cần ngừng hoạt động các mục con trước mục cha; giường đang có người ở không thể ngừng hoạt động.',
  disabled: (field) => field.name === 'parentId',
  body: (values, current) => current
   ? { code: str(values, 'code'), name: str(values, 'name'), status: values.status as Schemas['DormitoryInventoryUpdateRequest']['status'], expectedVersion: current.rowVersion } satisfies Schemas['DormitoryInventoryUpdateRequest']
   : { code: str(values, 'code'), name: str(values, 'name'), ...(parent ? { parentId: str(values, 'parentId') } : {}) } satisfies Schemas['DormitoryInventoryCreateRequest'],
 }
}
export const buildings = inventory('buildings', 'Tòa ký túc xá', 'tòa ký túc xá')
export const rooms = inventory('rooms', 'Phòng ký túc xá', 'phòng', 'building')
export const beds = inventory('beds', 'Giường', 'giường', 'room')
export const assignments: Resource = {
 path: '/api/v1/admin/dormitory/assignments', title: 'Phân chỗ ở', singular: 'phân chỗ', identifier: 'id', search: false,
 fields: [reference('studentId', 'Sinh viên', 'student'), reference('bedId', 'Giường', 'bed'), { name: 'status', label: 'Thao tác', type: 'enum', required: true, options: options(['RELEASED']), updateOnly: true }],
 filters: [reference('studentId', 'Lọc sinh viên', 'student', false), reference('bedId', 'Lọc giường', 'bed', false)],
 columns: [{ key: 'studentId', title: 'Sinh viên', reference: 'student' }, { key: 'bedId', title: 'Giường', reference: 'bed' }, { key: 'assignedAt', title: 'Nhận chỗ' }, { key: 'releasedAt', title: 'Trả chỗ' }],
 sorts: sorts(['assignedAt', 'createdAt', 'updatedAt', 'status'], 'assignedAt,desc'), states: options(['ASSIGNED', 'RELEASED']),
 note: 'Mỗi sinh viên và giường chỉ có một chỗ ASSIGNED. Trả chỗ giữ lịch sử; lần ở tiếp theo tạo bản ghi mới.',
 disabled: (field) => field.name !== 'status', readOnly: (current) => current.status === 'RELEASED',
 editValues: (current) => ({ ...current, status: undefined }),
 body: (values, current) => current
  ? { status: values.status as Schemas['AccommodationAssignmentReleaseRequest']['status'], expectedVersion: current.rowVersion } satisfies Schemas['AccommodationAssignmentReleaseRequest']
  : { studentId: str(values, 'studentId'), bedId: str(values, 'bedId') } satisfies Schemas['AccommodationAssignmentCreateRequest'],
}
const amount: Field = { name: 'amount', label: 'Số tiền VND', type: 'text', inputMode: 'numeric', maxLength: 19, rules: [amountRule] }
export const fees: Resource = {
 path: '/api/v1/admin/finance/fees', title: 'Biểu phí', singular: 'biểu phí', identifier: 'code', states: active, defaults: { status: 'ACTIVE' },
 fields: [code(), text('name', 'Tên phí'), amount, status],
 columns: [{ key: 'code', title: 'Mã' }, { key: 'name', title: 'Tên phí' }, { key: 'amount', title: 'Số tiền', format: formatVnd }],
 sorts: sorts(['code', 'name', 'amount', 'status', 'createdAt', 'updatedAt']),
 note: 'Số tiền nguyên VND. Sửa biểu phí không thay đổi các khoản thu đã tạo.',
 editValues: (current) => ({ ...current, amount: String(integerVnd(current.amount)) }),
 body: (values, current) => {
  const base = { code: str(values, 'code'), name: str(values, 'name'), amount: paymentAmount(values.amount) } satisfies Schemas['FinanceFeeCreate']
  return current ? { ...base, status: values.status as Schemas['FinanceFeeUpdate']['status'], expectedVersion: current.rowVersion } satisfies Schemas['FinanceFeeUpdate'] : base
 },
}
export const charges: Resource = {
 path: '/api/v1/admin/finance/charges', title: 'Khoản thu', singular: 'khoản thu', identifier: 'chargeNumber', states: options(['OPEN', 'CANCELLED']),
 fields: [code('chargeNumber', 'Mã khoản thu'), reference('studentId', 'Sinh viên', 'student'), reference('feeId', 'Biểu phí', 'fee'), { name: 'dueDate', label: 'Hạn thanh toán', type: 'date', required: true }, { name: 'status', label: 'Thao tác', type: 'enum', options: options(['CANCELLED']), required: true, updateOnly: true }],
 filters: [reference('studentId', 'Lọc sinh viên', 'student', false), reference('feeId', 'Lọc biểu phí', 'fee', false)],
 columns: [{ key: 'chargeNumber', title: 'Mã' }, { key: 'studentId', title: 'Sinh viên', reference: 'student' }, { key: 'feeName', title: 'Tên phí đã lưu' }, { key: 'amount', title: 'Số tiền đã lưu', format: formatVnd }, { key: 'dueDate', title: 'Hạn thanh toán' }],
 sorts: sorts(['chargeNumber', 'amount', 'dueDate', 'status', 'createdAt', 'updatedAt'], 'dueDate,asc'),
 note: 'Khoản thu giữ tên/số tiền phí tại thời điểm tạo. Hủy chỉ được khi tổng biên nhận còn hiệu lực bằng 0; đảo biên nhận trước khi hủy.',
 disabled: (field) => field.name !== 'status', readOnly: (current) => current.status === 'CANCELLED',
 editValues: (current) => ({ ...current, status: undefined }), details: (current) => createElement(ChargeBalancePanel, { id: current.id }),
 body: (values, current) => current
  ? { status: values.status as Schemas['FinanceChargeCancel']['status'], expectedVersion: current.rowVersion } satisfies Schemas['FinanceChargeCancel']
  : { chargeNumber: str(values, 'chargeNumber'), studentId: str(values, 'studentId'), feeId: str(values, 'feeId'), dueDate: str(values, 'dueDate') } satisfies Schemas['FinanceChargeCreate'],
}
export const operationResources = { buildings, rooms, beds, assignments, fees, charges }
