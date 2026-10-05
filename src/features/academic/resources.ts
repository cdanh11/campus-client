import type { Rule } from 'antd/es/form'
import type { components } from '../../api/schema'
import { nameRule, trimOrganization } from '../../forms/validation'
import type { Field, RegistryRow, Resource, Values } from '../people/resources'
type Schemas = components['schemas']
type ProgramCreate = Schemas['com.campus.academic.api.AdminAcademicProgramController.Request']
type ProgramUpdate = Schemas['com.campus.academic.api.AdminAcademicProgramController.UpdateRequest']
type CourseCreate = Schemas['com.campus.academic.api.AdminAcademicCourseController.Request']
type CourseUpdate = Schemas['com.campus.academic.api.AdminAcademicCourseController.UpdateRequest']
type TermCreate = Schemas['com.campus.academic.api.delivery.AdminAcademicTermController.CreateRequest']
type TermUpdate = Schemas['com.campus.academic.api.delivery.AdminAcademicTermController.UpdateRequest']
type OfferingCreate = Schemas['com.campus.academic.api.delivery.AdminCourseOfferingController.CreateRequest']
type OfferingUpdate = Schemas['com.campus.academic.api.delivery.AdminCourseOfferingController.UpdateRequest']
type SectionCreate = Schemas['com.campus.academic.api.delivery.AdminClassSectionController.CreateRequest']
type SectionUpdate = Schemas['com.campus.academic.api.delivery.AdminClassSectionController.UpdateRequest']
type EnrollmentCreate = Schemas['com.campus.academic.api.enrollment.AdminEnrollmentController.CreateRequest']
type EnrollmentUpdate = Schemas['com.campus.academic.api.enrollment.AdminEnrollmentController.UpdateRequest']
const options = (values: string[]) => values.map((value) => ({ value, label: value }))
const catalog = options(['ACTIVE', 'INACTIVE'])
const terms = options(['PLANNED', 'ACTIVE', 'CLOSED', 'CANCELLED'])
const delivery = options(['DRAFT', 'OPEN', 'CLOSED', 'CANCELLED'])
const enrollment = options(['ENROLLED', 'WITHDRAWN'])
const str = (v: Values, key: string) => String(v[key] ?? '')
const code: Field = { name: 'code', label: 'Mã', type: 'text', rules: [nameRule(2, 32, trimOrganization), nameRule(2, 32, (value) => trimOrganization(value).toUpperCase())] }
const name = (key: string, label: string): Field => ({ name: key, label, type: 'text', rules: [nameRule(2, 160, trimOrganization)] })
const organization: Field = { name: 'organizationUnitId', label: 'Đơn vị', type: 'organization', required: true }
const reference = (key: string, label: string, type: Field['type'], required = true): Field => ({ name: key, label, type, required })
const status = (states: { value: string; label: string }[], updateOnly = false): Field => ({ name: 'status', label: 'Trạng thái', type: 'enum', required: true, options: states, updateOnly })
const sorts = (fields: string[]) => fields.flatMap((value) => [{ value: value + ',asc', label: value + ' ↑' }, { value: value + ',desc', label: value + ' ↓' }])
const path = '/api/v1/admin/academic/'
export function lifecycleOptions(kind: 'term' | 'delivery' | 'enrollment', current: string): string[] {
 if (kind === 'enrollment') return current === 'ENROLLED' ? ['WITHDRAWN'] : ['ENROLLED']
 if (kind === 'term') return current === 'PLANNED' ? ['PLANNED', 'ACTIVE', 'CANCELLED'] : current === 'ACTIVE' ? ['ACTIVE', 'CLOSED'] : [current]
 return current === 'DRAFT' ? ['DRAFT', 'OPEN', 'CANCELLED'] : current === 'OPEN' ? ['OPEN', 'CLOSED'] : [current]
}
const boundary: Rule = ({ getFieldValue }) => ({ validator: async (_, value: unknown) => {
 const start = getFieldValue('startDate') as string | undefined
 if (start && typeof value === 'string' && value < start) throw new Error('Ngày kết thúc phải từ ngày bắt đầu trở đi.')
} })
export const programs: Resource = {
 path: path + 'programs', title: 'Chương trình đào tạo', singular: 'chương trình', identifier: 'code',
 fields: [code, name('name', 'Tên chương trình'), organization, status(catalog)],
 columns: [{ key: 'code', title: 'Mã' }, { key: 'name', title: 'Tên chương trình' }],
 sorts: sorts(['code', 'name', 'status', 'createdAt', 'updatedAt']), states: catalog,
 body: (values, current) => {
  const base = { code: str(values, 'code'), name: str(values, 'name'), organizationUnitId: str(values, 'organizationUnitId'), status: values.status as ProgramUpdate['status'] } satisfies ProgramCreate
  return current ? { ...base, expectedVersion: current.rowVersion } satisfies ProgramUpdate : base
 },
}
export const courses: Resource = {
 path: path + 'courses', title: 'Môn học', singular: 'môn học', identifier: 'code',
 fields: [code, name('title', 'Tên môn học'), { name: 'credits', label: 'Số tín chỉ', type: 'integer', required: true, min: 1, max: 30, rules: [{ type: 'integer', min: 1, max: 30, message: 'Số tín chỉ là số nguyên từ 1 đến 30.' }] }, organization, status(catalog)],
 columns: [{ key: 'code', title: 'Mã' }, { key: 'title', title: 'Tên môn học' }, { key: 'credits', title: 'Tín chỉ' }],
 sorts: sorts(['code', 'title', 'credits', 'status', 'createdAt', 'updatedAt']), states: catalog,
 body: (values, current) => {
  const base = { code: str(values, 'code'), title: str(values, 'title'), credits: Number(values.credits), organizationUnitId: str(values, 'organizationUnitId'), status: values.status as CourseUpdate['status'] } satisfies CourseCreate
  return current ? { ...base, expectedVersion: current.rowVersion } satisfies CourseUpdate : base
 },
}
export const academicTerms: Resource = {
 path: path + 'terms', title: 'Học kỳ', singular: 'học kỳ', identifier: 'code',
 fields: [code, name('name', 'Tên học kỳ'), { name: 'startDate', label: 'Ngày bắt đầu', type: 'date', required: true }, { name: 'endDate', label: 'Ngày kết thúc', type: 'date', required: true, dependencies: ['startDate'], rules: [boundary] }, status(terms, true)],
 columns: [{ key: 'code', title: 'Mã' }, { key: 'name', title: 'Học kỳ' }, { key: 'startDate', title: 'Bắt đầu' }, { key: 'endDate', title: 'Kết thúc' }],
 sorts: sorts(['code', 'name', 'startDate', 'endDate', 'status', 'createdAt', 'updatedAt']), states: terms, defaults: { status: 'PLANNED' },
 note: 'Học kỳ mới ở PLANNED. Ngày bắt đầu/kết thúc cố định sau khi kích hoạt; đóng học kỳ cần không còn đợt mở môn OPEN.',
 disabled: (field, current) => ['startDate', 'endDate'].includes(field.name) && current.status !== 'PLANNED',
 choices: (field, current) => field.name === 'status' ? options(lifecycleOptions('term', String(current.status))) : field.options,
 body: (values, current) => {
  const base = { code: str(values, 'code'), name: str(values, 'name'), startDate: str(values, 'startDate'), endDate: str(values, 'endDate') } satisfies TermCreate
  return current ? { ...base, status: values.status as TermUpdate['status'], expectedVersion: current.rowVersion } satisfies TermUpdate : base
 },
}
export const offerings: Resource = {
 path: path + 'offerings', title: 'Đợt mở môn', singular: 'đợt mở môn', identifier: 'id', search: false,
 fields: [reference('termId', 'Học kỳ', 'term'), reference('courseId', 'Môn học', 'course'), status(delivery, true)],
 filters: [reference('termId', 'Lọc học kỳ', 'term', false), reference('courseId', 'Lọc môn học', 'course', false)],
 columns: [{ key: 'id', title: 'Đợt mở môn' }, { key: 'termId', title: 'Học kỳ', reference: 'term' }, { key: 'courseId', title: 'Môn học', reference: 'course' }],
 sorts: [{ value: 'createdAt,desc', label: 'Mới tạo' }, ...sorts(['createdAt', 'status', 'updatedAt']).filter((value) => value.value !== 'createdAt,desc')], states: delivery, defaults: { status: 'DRAFT' },
 note: 'Mỗi môn chỉ có một đợt mở trong học kỳ. Chỉ mở khi học kỳ ACTIVE, môn và đơn vị ACTIVE; đóng cần không còn lớp OPEN.',
 disabled: (field) => field.name !== 'status',
 choices: (field, current) => field.name === 'status' ? options(lifecycleOptions('delivery', String(current.status))) : field.options,
 body: (values, current) => current
  ? { status: values.status as OfferingUpdate['status'], expectedVersion: current.rowVersion } satisfies OfferingUpdate
  : { termId: str(values, 'termId'), courseId: str(values, 'courseId') } satisfies OfferingCreate,
}
export const sections: Resource = {
 path: path + 'sections', title: 'Lớp học phần', singular: 'lớp học phần', identifier: 'code',
 fields: [reference('offeringId', 'Đợt mở môn', 'offering'), code, { name: 'capacity', label: 'Sức chứa', type: 'integer', required: true, min: 1, max: 2147483647, rules: [{ type: 'integer', min: 1, max: 2147483647, message: 'Sức chứa là số nguyên dương, tối đa 2147483647.' }] }, reference('facultyId', 'Giảng viên', 'faculty', false), status(delivery, true)],
 filters: [reference('offeringId', 'Lọc đợt mở môn', 'offering', false)],
 columns: [{ key: 'code', title: 'Lớp' }, { key: 'offeringId', title: 'Đợt mở môn', reference: 'offering' }, { key: 'capacity', title: 'Sức chứa' }, { key: 'facultyId', title: 'Giảng viên', reference: 'faculty' }],
 sorts: sorts(['code', 'capacity', 'status', 'createdAt', 'updatedAt']), states: delivery, defaults: { status: 'DRAFT' },
 note: 'DRAFT được thiếu giảng viên; OPEN cần giảng viên ACTIVE thuộc FACULTY. Mã, sức chứa và giảng viên cố định sau DRAFT.',
 disabled: (field, current) => field.name === 'offeringId' || (current.status !== 'DRAFT' && field.name !== 'status'),
 choices: (field, current) => field.name === 'status' ? options(lifecycleOptions('delivery', String(current.status))) : field.options,
 body: (values, current) => {
  const base = { code: str(values, 'code'), capacity: Number(values.capacity), facultyId: values.facultyId ? str(values, 'facultyId') : undefined } satisfies Omit<SectionCreate, 'offeringId'>
  return current ? { ...base, status: values.status as SectionUpdate['status'], expectedVersion: current.rowVersion } satisfies SectionUpdate
   : { ...base, offeringId: str(values, 'offeringId') } satisfies SectionCreate
 },
}
export const enrollments: Resource = {
 path: path + 'enrollments', title: 'Ghi danh', singular: 'ghi danh', identifier: 'id', search: false,
 fields: [reference('studentId', 'Sinh viên', 'student'), reference('sectionId', 'Lớp học phần', 'section'), status(enrollment, true)],
 filters: [reference('studentId', 'Lọc sinh viên', 'student', false), reference('sectionId', 'Lọc lớp', 'section', false)],
 columns: [{ key: 'studentId', title: 'Sinh viên', reference: 'student' }, { key: 'sectionId', title: 'Lớp', reference: 'section' }, { key: 'updatedAt', title: 'Cập nhật' }],
 sorts: [{ value: 'createdAt,desc', label: 'Mới tạo' }, ...sorts(['createdAt', 'status', 'updatedAt']).filter((value) => value.value !== 'createdAt,desc')], states: enrollment, defaults: { status: 'ENROLLED' },
 note: 'Ghi danh cần sinh viên ACTIVE, lớp và đợt mở OPEN, học kỳ ACTIVE và còn chỗ. Hủy giữ lịch sử và giải phóng suất; ghi danh lại bằng cùng bản ghi.',
 editValues: (current) => ({ ...current, status: undefined }),
 disabled: (field) => field.name !== 'status',
 choices: (field, current) => field.name === 'status' ? options(lifecycleOptions('enrollment', String(current.status))) : field.options,
 body: (values, current) => current
  ? { status: values.status as EnrollmentUpdate['status'], expectedVersion: current.rowVersion } satisfies EnrollmentUpdate
  : { studentId: str(values, 'studentId'), sectionId: str(values, 'sectionId') } satisfies EnrollmentCreate,
}
export const academicResources = { programs, courses, terms: academicTerms, offerings, sections, enrollments }
export type AcademicResourceKey = keyof typeof academicResources
export const isImmutable = (resource: Resource, field: Field, current: RegistryRow) => resource.disabled?.(field, current) ?? false
