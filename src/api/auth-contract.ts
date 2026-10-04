import type { components } from './schema'
import type { User } from './client'
import { ApiError } from './errors'
type Tokens = Required<Pick<components['schemas']['RefreshResponse'], 'accessToken'>>
function record(value: unknown): value is Record<string, unknown> { return !!value && typeof value === 'object' }
export function requireTokens(value: unknown): Tokens {
 if (!record(value) || typeof value.accessToken !== 'string' || value.accessToken.length === 0) throw new ApiError(502, { code: 'INVALID_SERVER_RESPONSE', message: 'Phản hồi đăng nhập không hợp lệ.' })
 return { accessToken: value.accessToken }
}
export function requireUser(value: unknown): User {
 if (!record(value) || typeof value.id !== 'string' || !value.id || typeof value.email !== 'string' ||
  typeof value.status !== 'string' || !Array.isArray(value.roles) || !value.roles.every((role) => typeof role === 'string')) {
  throw new ApiError(502, { code: 'INVALID_SERVER_RESPONSE', message: 'Phản hồi tài khoản không hợp lệ.' })
 }
 return value as User
}
