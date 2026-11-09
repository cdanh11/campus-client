import type { User } from './client'
export const roleCodes = ['USER', 'ADMIN', 'ACADEMIC_AFFAIRS', 'CAMPUS_SERVICES', 'FINANCE', 'AUDITOR'] as const
export const administrationRoles = {
 users: ['ADMIN'], organizations: ['ADMIN', 'ACADEMIC_AFFAIRS'], students: ['ADMIN', 'ACADEMIC_AFFAIRS'],
 personnel: ['ADMIN', 'ACADEMIC_AFFAIRS'], academic: ['ADMIN', 'ACADEMIC_AFFAIRS'], dormitory: ['ADMIN', 'CAMPUS_SERVICES'],
 finance: ['ADMIN', 'FINANCE'], notifications: ['ADMIN', 'CAMPUS_SERVICES'], events: ['ADMIN', 'CAMPUS_SERVICES'],
 library: ['ADMIN', 'CAMPUS_SERVICES'], audit: ['ADMIN', 'AUDITOR'], reporting: ['ADMIN', 'AUDITOR'],
} as const
export type AdministrationArea = keyof typeof administrationRoles
export function canAdminister(user: User, area: AdministrationArea) {
 return user.roles.some((role) => (administrationRoles[area] as readonly string[]).includes(role))
}
export function canEnterAdministration(user: User) {
 return Object.keys(administrationRoles).some((area) => canAdminister(user, area as AdministrationArea))
}

export const administrationDestinations: { area: AdministrationArea; path: string; title: string }[] = [
 { area: 'students', path: '/admin/students', title: 'Sinh viên' },
 { area: 'personnel', path: '/admin/personnel', title: 'Giảng viên & nhân sự' },
 { area: 'academic', path: '/admin/academic', title: 'Học vụ' },
 { area: 'dormitory', path: '/admin/operations/buildings', title: 'Ký túc xá' },
 { area: 'notifications', path: '/admin/notifications', title: 'Thông báo' },
 { area: 'events', path: '/admin/events', title: 'Sự kiện' },
 { area: 'library', path: '/admin/library', title: 'Thư viện' },
 { area: 'finance', path: '/admin/operations/fees', title: 'Tài chính' },
 { area: 'audit', path: '/admin/insights/audits', title: 'Audit' },
 { area: 'reporting', path: '/admin/insights/dashboard', title: 'Báo cáo' },
 { area: 'users', path: '/admin/users', title: 'Tài khoản' },
 { area: 'organizations', path: '/admin/organizations', title: 'Đơn vị' },
]
