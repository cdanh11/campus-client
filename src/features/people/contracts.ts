import type { components } from '../../api/schema'
export type Version = number | bigint
export interface PageResult<T> { content: T[]; page: number; size: number; totalElements: number | bigint; totalPages: number }
export type OrganizationCreate = components['schemas']['com.campus.organization.api.AdminOrganizationUnitController.Request']
export type OrganizationUpdate = components['schemas']['com.campus.organization.api.AdminOrganizationUnitController.UpdateRequest']
export type StudentCreate = components['schemas']['com.campus.student.api.AdminStudentController.Request']
export type StudentUpdate = components['schemas']['com.campus.student.api.AdminStudentController.UpdateRequest']
export type PersonnelCreate = components['schemas']['com.campus.personnel.api.AdminFacultyStaffController.Request']
export type PersonnelUpdate = components['schemas']['com.campus.personnel.api.AdminFacultyStaffController.UpdateRequest']
export type AdminUser = Required<components['schemas']['com.campus.identity.api.AdminUserController.AdminUserResponse']>
export type UserCreate = components['schemas']['com.campus.identity.api.AdminUserController.CreateAdminUserRequest']
export type UserStatus = components['schemas']['com.campus.identity.api.AdminUserController.StatusRequest']
export type UserRoles = components['schemas']['com.campus.identity.api.AdminUserController.RolesRequest']
export type UserPassword = components['schemas']['com.campus.identity.api.AdminUserController.PasswordResetRequest']
