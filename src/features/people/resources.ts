import type { ReferenceKind } from './references'
import type { ReactNode } from 'react'
import type { Rule } from 'antd/es/form'
import { contactEmailRule, nameRule, trimOrganization } from '../../forms/validation'
import type { OrganizationCreate, OrganizationUpdate, StudentCreate, StudentUpdate, PersonnelCreate, PersonnelUpdate, Version } from './contracts'

export type RegistryRow = { id: string; rowVersion: Version; [key: string]: unknown }
export type Values = Record<string, unknown>
export interface Field {
 name: string; label: string; type: 'text' | 'textarea' | 'email' | 'enum' | 'integer' | 'date' | ReferenceKind
 placeholder?: string; inputMode?: 'numeric'; maxLength?: number; min?: number; max?: number; updateOnly?: boolean; dependencies?: string[]
 required?: boolean; rules?: Rule[]; options?: { value: string; label: string }[]
}
export interface Resource {
 path: string; title: string; singular: string; identifier: string
 fields: Field[]; columns: { key: string; title: string; reference?: ReferenceKind; format?: (value: unknown) => string }[]; sorts: { value: string; label: string }[]
 states?: { value: string; label: string }[]; defaults?: Values; search?: boolean; filters?: Field[]; note?: string
 readOnly?: (current: RegistryRow) => boolean; details?: (current: RegistryRow) => ReactNode
 disabled?: (field: Field, current: RegistryRow) => boolean
 choices?: (field: Field, current: RegistryRow) => Field['options']
 editValues?: (current: RegistryRow) => Values
 createPath?: (values: Values) => string
 body: (values: Values, current?: RegistryRow) => unknown
}
const states = [{ value: 'ACTIVE', label: 'Đang hoạt động' }, { value: 'INACTIVE', label: 'Ngừng hoạt động' }]
const status: Field = { name: 'status', label: 'Trạng thái', type: 'enum', required: true, options: states }
const unit: Field = { name: 'organizationUnitId', label: 'Đơn vị', type: 'organization', required: true }
const identity: Field = { name: 'identityUserId', label: 'Tài khoản liên kết', type: 'identity' }
const contact: Field = { name: 'email', label: 'Email liên hệ', type: 'email', rules: [contactEmailRule] }
const string = (values: Values, key: string) => String(values[key] ?? '')
const optional = (values: Values, key: string) => values[key] ? String(values[key]) : undefined
export const organization: Resource = {
 path: '/api/v1/admin/organization-units', title: 'Đơn vị tổ chức', singular: 'đơn vị', identifier: 'code',
 fields: [
  { name: 'code', label: 'Mã đơn vị', type: 'text', rules: [nameRule(2, 32, trimOrganization)] },
  { name: 'name', label: 'Tên đơn vị', type: 'text', rules: [nameRule(2, 160, trimOrganization)] },
  { name: 'unitType', label: 'Loại đơn vị', type: 'enum', required: true, options: [{ value: 'FACULTY', label: 'Khoa' }, { value: 'DEPARTMENT', label: 'Bộ môn' }, { value: 'ADMINISTRATIVE', label: 'Hành chính' }] },
  status,
 ],
 columns: [{ key: 'code', title: 'Mã đơn vị' }, { key: 'name', title: 'Tên đơn vị' }, { key: 'unitType', title: 'Loại' }],
 sorts: [{ value: 'code,asc', label: 'Mã tăng dần' }, { value: 'name,asc', label: 'Tên tăng dần' }, { value: 'updatedAt,desc', label: 'Mới cập nhật' }],
 body: (values, current) => {
  const base = { code: string(values, 'code'), name: string(values, 'name'), unitType: values.unitType as OrganizationCreate['unitType'], status: values.status as OrganizationUpdate['status'] } satisfies OrganizationCreate
  return current ? { ...base, expectedVersion: current.rowVersion } satisfies OrganizationUpdate : base
 },
}
export const student: Resource = {
 path: '/api/v1/admin/students', title: 'Sinh viên', singular: 'sinh viên', identifier: 'studentNumber',
 fields: [
  { name: 'studentNumber', label: 'Mã sinh viên', type: 'text', rules: [nameRule(2, 32)] },
  { name: 'fullName', label: 'Họ tên', type: 'text', rules: [nameRule(2, 160)] },
  contact, unit, identity, status,
 ],
 columns: [{ key: 'studentNumber', title: 'Mã sinh viên' }, { key: 'fullName', title: 'Họ tên' }, { key: 'email', title: 'Email' }],
 sorts: [{ value: 'studentNumber,asc', label: 'Mã tăng dần' }, { value: 'fullName,asc', label: 'Tên tăng dần' }, { value: 'updatedAt,desc', label: 'Mới cập nhật' }],
 body: (values, current) => {
  const base = { studentNumber: string(values, 'studentNumber'), fullName: string(values, 'fullName'), email: optional(values, 'email'), organizationUnitId: string(values, 'organizationUnitId'), identityUserId: optional(values, 'identityUserId'), status: values.status as StudentUpdate['status'] } satisfies StudentCreate
  return current ? { ...base, expectedVersion: current.rowVersion } satisfies StudentUpdate : base
 },
}
export const personnel: Resource = {
 path: '/api/v1/admin/faculty-staff', title: 'Giảng viên & nhân sự', singular: 'hồ sơ nhân sự', identifier: 'personnelNumber',
 fields: [
  { name: 'personnelNumber', label: 'Mã nhân sự', type: 'text', rules: [nameRule(2, 32)] },
  { name: 'fullName', label: 'Họ tên', type: 'text', rules: [nameRule(2, 160)] },
  contact,
  { name: 'personnelType', label: 'Loại hồ sơ', type: 'enum', required: true, options: [{ value: 'FACULTY', label: 'Giảng viên' }, { value: 'STAFF', label: 'Nhân viên' }] },
  unit, identity, status,
 ],
 columns: [{ key: 'personnelNumber', title: 'Mã nhân sự' }, { key: 'fullName', title: 'Họ tên' }, { key: 'personnelType', title: 'Loại hồ sơ' }],
 sorts: [{ value: 'personnelNumber,asc', label: 'Mã tăng dần' }, { value: 'fullName,asc', label: 'Tên tăng dần' }, { value: 'updatedAt,desc', label: 'Mới cập nhật' }],
 body: (values, current) => {
  const base = { personnelNumber: string(values, 'personnelNumber'), fullName: string(values, 'fullName'), email: optional(values, 'email'), personnelType: values.personnelType as PersonnelCreate['personnelType'], organizationUnitId: string(values, 'organizationUnitId'), identityUserId: optional(values, 'identityUserId'), status: values.status as PersonnelUpdate['status'] } satisfies PersonnelCreate
  return current ? { ...base, expectedVersion: current.rowVersion } satisfies PersonnelUpdate : base
 },
}
export const resources = { organizations: organization, students: student, personnel }
export const labels: Record<string, string> = { ACTIVE: 'Đang hoạt động', INACTIVE: 'Ngừng hoạt động', FACULTY: 'Khoa / Giảng viên', DEPARTMENT: 'Bộ môn', ADMINISTRATIVE: 'Hành chính', STAFF: 'Nhân viên' }
