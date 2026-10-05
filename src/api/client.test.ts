import { describe, expect, it, vi } from 'vitest'
import { ApiClient, ApiError, SessionChanged } from './client'
const user = { id: 'user-1', email: 'test@example.test', status: 'ACTIVE', roles: ['ADMIN'] }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const loggedIn = async (fetcher: ReturnType<typeof vi.fn>, clear = vi.fn()) => {
 fetcher.mockResolvedValueOnce(json({ accessToken: 'initial', user }))
 const api = new ApiClient(fetcher as typeof fetch, clear)
 await api.login('test@example.test', 'test-only')
 return api
}
describe('session and API lifecycle', () => {
 it('includes credentials and bearer, clears cache on login and logout', async () => {
  const fetcher = vi.fn(); const clear = vi.fn()
  const api = await loggedIn(fetcher, clear)
  fetcher.mockResolvedValueOnce(json(user))
  await api.request('/api/v1/auth/me')
  const options = fetcher.mock.calls[1][1]
  expect(options.credentials).toBe('include')
  expect(options.headers.get('Authorization')).toBe('Bearer initial')
  fetcher.mockResolvedValueOnce(new Response(null, { status: 204 }))
  await api.logout()
  expect(api.getSession().status).toBe('anonymous')
  expect(clear).toHaveBeenCalledTimes(2)
 })
 it('shares a refresh for concurrent unauthorized requests', async () => {
  const fetcher = vi.fn()
  const api = await loggedIn(fetcher)
  let resolveRefresh!: (response: Response) => void
  fetcher.mockImplementation((path: string, options: RequestInit) => {
   if (path.endsWith('/refresh')) return new Promise<Response>((resolve) => { resolveRefresh = resolve })
   return Promise.resolve(new Headers(options.headers).get('Authorization') === 'Bearer fresh' ? json({ ok: true }) : json({ code: 'UNAUTHENTICATED' }, 401))
  })
  const first = api.request('/api/v1/a')
  const second = api.request('/api/v1/b')
  await vi.waitFor(() => expect(resolveRefresh).toBeDefined())
  resolveRefresh(json({ accessToken: 'fresh' }))
  expect(await Promise.all([first, second])).toEqual([{ ok: true }, { ok: true }])
  expect(fetcher.mock.calls.filter(([path]) => path.endsWith('/refresh'))).toHaveLength(1)
 })
 it('does not refresh on 403 or hide 409 domain conflicts', async () => {
  const fetcher = vi.fn(); const api = await loggedIn(fetcher)
  fetcher.mockResolvedValueOnce(json({ code: 'FORBIDDEN' }, 403))
  await expect(api.request('/api/v1/admin/users')).rejects.toMatchObject({ status: 403 })
  fetcher.mockResolvedValueOnce(json({ code: 'CONCURRENT_MODIFICATION' }, 409))
  await expect(api.mutation('/api/v1/admin/users/x/status', 'PATCH', { expectedVersion: 3 })).rejects.toMatchObject({ status: 409, detail: { code: 'CONCURRENT_MODIFICATION' } })
  expect(fetcher).toHaveBeenCalledTimes(3)
 })
 it('bounds retries and clears the session after repeated 401', async () => {
  const fetcher = vi.fn(); const api = await loggedIn(fetcher)
  fetcher.mockResolvedValueOnce(json({}, 401)).mockResolvedValueOnce(json({ accessToken: 'fresh' })).mockResolvedValueOnce(json({}, 401))
  await expect(api.request('/api/v1/a')).rejects.toBeInstanceOf(ApiError)
  expect(fetcher).toHaveBeenCalledTimes(4)
  expect(api.getSession().status).toBe('anonymous')
 })
 it('cannot restore a session after logout while refresh is pending', async () => {
  const fetcher = vi.fn(); const api = await loggedIn(fetcher)
  let resolve!: (response: Response) => void
  fetcher.mockResolvedValueOnce(json({}, 401))
  fetcher.mockImplementationOnce(() => new Promise<Response>((done) => { resolve = done }))
  const request = api.request('/api/v1/a')
  const rejection = expect(request).rejects.toBeInstanceOf(SessionChanged)
  await vi.waitFor(() => expect(resolve).toBeDefined())
  fetcher.mockResolvedValueOnce(new Response(null, { status: 204 }))
  const logout = api.logout()
  resolve(json({ accessToken: 'late' }))
  await logout; await rejection
  expect(api.getSession().status).toBe('anonymous')
 })
 it('rejects results arriving after account switch', async () => {
  const fetcher = vi.fn(); const api = await loggedIn(fetcher)
  let resolve!: (response: Response) => void
  fetcher.mockImplementationOnce(() => new Promise<Response>((done) => { resolve = done }))
  const request = api.request('/api/v1/a')
  const rejection = expect(request).rejects.toBeInstanceOf(SessionChanged)
  fetcher.mockResolvedValueOnce(json({ accessToken: 'new', user: { ...user, id: 'user-2' } }))
  await api.login('other@example.test', 'test-only')
  resolve(json({ private: 'old account' }))
  await rejection
  expect(api.getSession().user?.id).toBe('user-2')
 })
 it('restores user through me and does not persist tokens', async () => {
  const fetcher = vi.fn().mockResolvedValueOnce(json({ accessToken: 'restored' })).mockResolvedValueOnce(json(user))
  const api = new ApiClient(fetcher)
  await api.restore()
  expect(api.getSession()).toEqual({ status: 'authenticated', user })
  expect(localStorage.length).toBe(0); expect(sessionStorage.length).toBe(0)
 })
 it('handles absent or revoked refresh as an anonymous session', async () => {
  const api = new ApiClient(vi.fn().mockResolvedValue(json({ code: 'REFRESH_TOKEN_MISSING' }, 401)))
  await api.restore()
  expect(api.getSession().status).toBe('anonymous')
 })
 it('reports network failure instead of claiming successful restoration', async () => {
  const api = new ApiClient(vi.fn().mockRejectedValue(new TypeError('offline')))
  await expect(api.restore()).rejects.toThrow('offline')
  expect(api.getSession().status).toBe('loading')
 })
 it('rejects external paths without leaking a bearer token', async () => {
  const fetcher = vi.fn(); const api = await loggedIn(fetcher)
  await expect(api.request('https://other.test/api')).rejects.toThrow('same-origin')
  expect(fetcher).toHaveBeenCalledTimes(1)
 })

 it('logout waits for pending login before clearing its server cookie', async () => {
  let resolve!: (response: Response) => void
  const fetcher = vi.fn().mockImplementationOnce(() => new Promise<Response>((done) => { resolve = done }))
  const api = new ApiClient(fetcher)
  const login = api.login('test@example.test', 'test-only')
  const rejection = expect(login).rejects.toBeInstanceOf(SessionChanged)
  await vi.waitFor(() => expect(resolve).toBeDefined())
  fetcher.mockResolvedValueOnce(new Response(null, { status: 204 }))
  const logout = api.logout()
  expect(fetcher).toHaveBeenCalledTimes(1)
  resolve(json({ accessToken: 'late-login', user }))
  await logout; await rejection
  expect(fetcher.mock.calls[1][0]).toBe('/api/v1/auth/logout')
  expect(api.getSession().status).toBe('anonymous')
 })
 it('clears restoration if current-user lookup is forbidden', async () => {
  const fetcher = vi.fn().mockResolvedValueOnce(json({ accessToken: 'restored' })).mockResolvedValueOnce(json({}, 403))
  const api = new ApiClient(fetcher)
  await api.restore()
  expect(api.getSession().status).toBe('anonymous')
 })

 it('does not recover a cookie session through a protected request after failed logout', async () => {
  const fetcher = vi.fn(); const api = await loggedIn(fetcher)
  fetcher.mockRejectedValueOnce(new TypeError('offline'))
  await expect(api.logout()).rejects.toThrow('offline')
  await expect(api.request('/api/v1/auth/me')).rejects.toMatchObject({ status: 401, detail: { code: 'SESSION_REQUIRED' } })
  expect(fetcher).toHaveBeenCalledTimes(2)
 })
 it('clears in-memory credentials when another tab changes the account', async () => {
  const fetcher = vi.fn(); const clear = vi.fn()
  const api = await loggedIn(fetcher, clear)
  api.invalidateSession()
  expect(api.getSession()).toEqual({ status: 'anonymous', user: null })
  await expect(api.request('/api/v1/a')).rejects.toMatchObject({ status: 401 })
  expect(clear).toHaveBeenCalledTimes(2)
 })
 it('rejects malformed auth payloads instead of granting a partial session', async () => {
  const api = new ApiClient(vi.fn().mockResolvedValue(json({ accessToken: 'token', user: { roles: 'ADMIN' } })))
  await expect(api.login('test@example.test', 'test-only')).rejects.toMatchObject({ status: 502 })
  expect(api.getSession().status).toBe('anonymous')
 })
})
