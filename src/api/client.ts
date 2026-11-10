import { encodeJson, parseJson } from './json'
import type { components } from './schema'
import { requireTokens, requireUser } from './auth-contract'
import { ApiError, SessionChanged, type ErrorBody } from './errors'
export { ApiError, SessionChanged } from './errors'

const parseBody = (text: string): unknown => {
 if (!text) return undefined
 // Reverse proxies can answer with HTML; keep the status/traceId instead of throwing a parse error.
 try { return parseJson(text) } catch { return undefined }
}

export type User = Required<components['schemas']['com.campus.identity.api.AuthController.UserResponse']>
type Tokens = Required<Pick<components['schemas']['com.campus.identity.api.AuthController.RefreshResponse'], 'accessToken'>>
type LoginResponse = Tokens & { user: User }
export type Session = { status: 'loading' | 'anonymous' | 'authenticated'; user: User | null }

const LOGOUT_PENDING_KEY = 'campus.logout-pending'
const logoutPending = () => {
 try { return localStorage.getItem(LOGOUT_PENDING_KEY) === '1' } catch { return false }
}
const rememberLogoutPending = (pending: boolean) => {
 try { if (pending) localStorage.setItem(LOGOUT_PENDING_KEY, '1'); else localStorage.removeItem(LOGOUT_PENDING_KEY) } catch { /* storage unavailable */ }
}

export class ApiClient {
 private token: string | null = null
 private epoch = 0
 private authTask: Promise<void> = Promise.resolve()
 private refreshTask: Promise<void> | null = null
 private snapshot: Session = { status: 'loading', user: null }
 private listeners = new Set<() => void>()
 constructor(private fetcher: typeof fetch = (...args) => fetch(...args), private onSessionChange: () => void = () => {}, private onExplicitChange: () => void = () => {}) {}
 getSession = () => this.snapshot
 subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
 private publish(status: Session['status'], user: User | null) {
  this.snapshot = { status, user }
  this.listeners.forEach((listener) => listener())
 }
 invalidateSession() { this.clear() }
 private clear() {
  this.epoch++
  this.token = null
  this.onSessionChange()
  this.publish('anonymous', null)
 }
 private async send<T>(path: string, options: RequestInit, token: string | null, format: 'json' | 'csv' = 'json'): Promise<T> {
  if (!path.startsWith('/api/v1/')) throw new Error('API path must be same-origin /api/v1/.')
  const headers = new Headers(options.headers)
  headers.set('Accept', format === 'csv' ? 'text/csv, application/json' : 'application/json')
  if (token) headers.set('Authorization', 'Bearer ' + token)
  // CSV export scans the whole report and can legitimately outlast the JSON request budget.
  const timeout = AbortSignal.timeout(format === 'csv' ? 120_000 : 20_000)
  const signal = options.signal ? AbortSignal.any([options.signal, timeout]) : timeout
  const perform = () => this.fetcher(path, { ...options, signal, headers, credentials: 'include', cache: 'no-store' })
  // Cookie rotation must be serialized across tabs on secure browser contexts.
  const cookieEndpoint = ['/api/v1/auth/login', '/api/v1/auth/refresh', '/api/v1/auth/logout'].includes(path)
  const response = cookieEndpoint && typeof navigator !== 'undefined' && navigator.locks
   ? await navigator.locks.request('campus-auth-cookie', { signal }, perform)
   : await perform()
  const text = await response.text()
  if (response.ok && format === 'csv') {
   if (response.headers.get('Content-Type')?.split(';')[0].trim().toLowerCase() !== 'text/csv') throw new ApiError(502, { code: 'INVALID_CSV_RESPONSE', message: 'Máy chủ không trả về CSV hợp lệ.' })
   return text as T
  }
  const value = parseBody(text)
  if (!response.ok) {
   const detail = value && typeof value === 'object' ? value as ErrorBody : {}
   throw new ApiError(response.status, { ...detail, traceId: detail.traceId ?? response.headers.get('X-Request-ID') })
  }
  if (text && value === undefined) throw new ApiError(502, { code: 'INVALID_JSON_RESPONSE', message: 'Máy chủ trả về dữ liệu không hợp lệ.', traceId: response.headers.get('X-Request-ID') })
  return value as T
 }
 private refresh(): Promise<void> {
  if (this.refreshTask) return this.refreshTask
  const epoch = this.epoch
  const task = (async () => {
   try {
    const result = await this.send<Tokens>('/api/v1/auth/refresh', { method: 'POST' }, null)
    if (epoch !== this.epoch) throw new SessionChanged()
    this.token = requireTokens(result).accessToken
   } catch (error) {
    if (epoch === this.epoch && error instanceof ApiError && (error.status === 401 || error.status === 403)) this.clear()
    throw error
   }
  })()
  this.refreshTask = task
  void task.finally(() => { if (this.refreshTask === task) this.refreshTask = null }).catch(() => {})
  return task
 }
 async restore(): Promise<void> {
  const epoch = this.epoch
  if (logoutPending()) {
   // A previous logout reached the browser but not the server: finish it instead of silently signing in again.
   try { await this.send<void>('/api/v1/auth/logout', { method: 'POST' }, null); rememberLogoutPending(false) } catch { /* keep the marker for the next attempt */ }
   if (epoch === this.epoch) this.publish('anonymous', null)
   return
  }
  const previous = this.snapshot.user
  try {
   await this.refresh()
   const user = requireUser(await this.request<User>('/api/v1/auth/me'))
   if (epoch !== this.epoch) throw new SessionChanged()
   if (previous && previous.id !== user.id) {
    // Another tab switched accounts: drop cached owner data and reject in-flight reads of the old account.
    this.epoch++
    this.onSessionChange()
   }
   this.publish('authenticated', user)
  } catch (error) {
   if (error instanceof ApiError && (error.status === 401 || error.status === 403)) { if (epoch === this.epoch) this.clear(); return }
   throw error
  }
 }
 private schedule(operation: () => Promise<void>): Promise<void> {
  const task = this.authTask.catch(() => {}).then(operation)
  this.authTask = task
  return task
 }
 login(email: string, password: string): Promise<void> {
  this.clear()
  const epoch = this.epoch
  return this.schedule(async () => {
   if (this.refreshTask) await this.refreshTask.catch(() => {})
   if (epoch !== this.epoch) throw new SessionChanged()
   const result = await this.send<LoginResponse>('/api/v1/auth/login', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: encodeJson({ email, password }),
   }, null)
   if (epoch !== this.epoch) throw new SessionChanged()
   const user = requireUser(result.user)
   this.token = requireTokens(result).accessToken
   rememberLogoutPending(false)
   this.publish('authenticated', user)
   this.onExplicitChange()
  })
 }
 logout(): Promise<void> {
  // Survives a reload: never let a failed logout restore the still-valid refresh cookie.
  rememberLogoutPending(true)
  this.clear()
  return this.schedule(async () => {
   try {
    if (this.refreshTask) await this.refreshTask.catch(() => {})
    await this.send<void>('/api/v1/auth/logout', { method: 'POST' }, null)
    rememberLogoutPending(false)
   } finally {
    this.onExplicitChange()
   }
  })
 }
 request<T>(path: string, options: RequestInit = {}): Promise<T> { return this.authorized<T>(path, options, 'json') }
 downloadCsv(path: string): Promise<string> {
  if (!/^\/api\/v1\/admin\/reports\/(STUDENT_DEBT|CURRENT_ACCOMMODATION|SECTION_ENROLLMENT|EVENT_MEMBERSHIP|LIBRARY_LOANS)\/export(?:\?|$)/.test(path)) return Promise.reject(new Error('CSV path không hợp lệ.'))
  return this.authorized<string>(path, { method: 'GET' }, 'csv')
 }
 private async authorized<T>(path: string, options: RequestInit, format: 'json' | 'csv'): Promise<T> {
  if (!this.token) throw new ApiError(401, { code: 'SESSION_REQUIRED', message: 'Vui lòng đăng nhập lại.' })
  const epoch = this.epoch
  const token = this.token
  try {
   const result = await this.send<T>(path, options, token, format)
   if (epoch !== this.epoch) throw new SessionChanged()
   return result
  } catch (error) {
   if (epoch !== this.epoch) throw new SessionChanged()
   if (!(error instanceof ApiError) || error.status !== 401) throw error
   if (this.token === token) await this.refresh()
   if (epoch !== this.epoch) throw new SessionChanged()
   try {
    const result = await this.send<T>(path, options, this.token, format)
    if (epoch !== this.epoch) throw new SessionChanged()
    return result
   } catch (retryError) {
    if (epoch === this.epoch && retryError instanceof ApiError && retryError.status === 401) this.clear()
    throw retryError
   }
  }
 }
 mutation<T>(path: string, method: 'POST' | 'PUT' | 'PATCH' | 'DELETE', body?: unknown, headers: Record<string, string> = {}): Promise<T> {
  return this.request<T>(path, { method, headers: { 'Content-Type': 'application/json', ...headers }, body: body === undefined ? undefined : encodeJson(body) })
 }
}
