export const roleLabels: Record<string, string> = {
 USER: 'Sinh viên / người dùng',
 ADMIN: 'Quản trị hệ thống',
 ACADEMIC_AFFAIRS: 'Phòng Đào tạo',
 CAMPUS_SERVICES: 'Phòng Công tác sinh viên & dịch vụ',
 FINANCE: 'Phòng Tài chính',
 AUDITOR: 'Kiểm soát nội bộ',
}
export const roleText = (value: string) => roleLabels[value] ?? value
export const roleOptions = (values: readonly string[]) => values.map((value) => ({ value, label: roleText(value) }))
