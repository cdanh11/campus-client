export const roleLabels: Record<string, string> = {
 USER: 'Sinh viên / người dùng',
 ADMIN: 'Quản trị viên',
 ORGANIZATION_ADMIN: 'Quản trị đơn vị',
 STUDENT_ADMIN: 'Quản trị sinh viên',
 PERSONNEL_ADMIN: 'Quản trị nhân sự',
 ACADEMIC_ADMIN: 'Quản trị học vụ',
 DORMITORY_ADMIN: 'Quản trị ký túc xá',
 FINANCE_ADMIN: 'Quản trị tài chính',
 NOTIFICATION_ADMIN: 'Quản trị thông báo',
 EVENT_ADMIN: 'Quản trị sự kiện',
 LIBRARY_ADMIN: 'Quản trị thư viện',
 AUDIT_VIEWER: 'Kiểm toán',
 REPORTING_VIEWER: 'Báo cáo',
}
export const roleText = (value: string) => roleLabels[value] ?? value
export const roleOptions = (values: readonly string[]) => values.map((value) => ({ value, label: roleText(value) }))
