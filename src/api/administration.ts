import type { User } from './client'
export const roleCodes = ['USER', 'ADMIN', 'ORGANIZATION_ADMIN', 'STUDENT_ADMIN', 'PERSONNEL_ADMIN', 'ACADEMIC_ADMIN', 'DORMITORY_ADMIN', 'FINANCE_ADMIN', 'NOTIFICATION_ADMIN', 'EVENT_ADMIN', 'LIBRARY_ADMIN', 'AUDIT_VIEWER', 'REPORTING_VIEWER'] as const
export const administrationRoles = {
 users: ['ADMIN'], organizations: ['ADMIN', 'ORGANIZATION_ADMIN'], students: ['ADMIN', 'STUDENT_ADMIN'],
 personnel: ['ADMIN', 'PERSONNEL_ADMIN'], academic: ['ADMIN', 'ACADEMIC_ADMIN'], dormitory: ['ADMIN', 'DORMITORY_ADMIN'],
 finance: ['ADMIN', 'FINANCE_ADMIN'], notifications: ['ADMIN', 'NOTIFICATION_ADMIN'], events: ['ADMIN', 'EVENT_ADMIN'],
 library: ['ADMIN', 'LIBRARY_ADMIN'], audit: ['ADMIN', 'AUDIT_VIEWER'], reporting: ['ADMIN', 'REPORTING_VIEWER'],
} as const
export type AdministrationArea = keyof typeof administrationRoles
export function canAdminister(user: User, area: AdministrationArea) {
 return user.roles.some((role) => (administrationRoles[area] as readonly string[]).includes(role))
}
export function canEnterAdministration(user: User) {
 return Object.keys(administrationRoles).some((area) => canAdminister(user, area as AdministrationArea))
}

export const administrationDestinations: { area: AdministrationArea; path: string; title: string }[] = [
 { area: 'users', path: '/admin/users', title: 'Tài khoản' },
 { area: 'organizations', path: '/admin/organizations', title: 'Đơn vị' },
 { area: 'students', path: '/admin/students', title: 'Sinh viên' },
 { area: 'personnel', path: '/admin/personnel', title: 'Giảng viên & nhân sự' },
 { area: 'academic', path: '/admin/academic', title: 'Học vụ' },
 { area: 'dormitory', path: '/admin/operations/buildings', title: 'Ký túc xá' },
 { area: 'finance', path: '/admin/operations/fees', title: 'Tài chính' },
 { area: 'notifications', path: '/admin/notifications', title: 'Thông báo' },
 { area: 'events', path: '/admin/events', title: 'Sự kiện' },
 { area: 'library', path: '/admin/library', title: 'Thư viện' },
 { area: 'audit', path: '/admin/insights/audits', title: 'Audit' },
 { area: 'reporting', path: '/admin/insights/dashboard', title: 'Báo cáo' },
]
