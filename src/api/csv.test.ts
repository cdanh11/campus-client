import { expect, it, vi } from 'vitest'
import { ApiClient, ApiError, SessionChanged } from './client'
const path = '/api/v1/admin/reports/STUDENT_DEBT/export?sort=id%2Casc'
const user = { id: 'u', email: 'csv@example.test', status: 'ACTIVE', roles: ['ADMIN'] }
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
const csv = (text = '"studentId","outstandingVnd"\r\n"u","19999999999999999998"\r\n') => new Response(text, { headers: { 'Content-Type': 'text/csv;charset=UTF-8' } })
async function setup() {
 const fetcher = vi.fn().mockResolvedValueOnce(json({ accessToken: 'initial', user }))
 const api = new ApiClient(fetcher)
 await api.login(user.email, 'test-only')
 return { api, fetcher }
}
it('downloads unchanged CSV text with bearer/cookie and bounded refresh retry', async () => {
 const { api, fetcher } = await setup()
 fetcher.mockResolvedValueOnce(json({ code: 'UNAUTHENTICATED' }, 401)).mockResolvedValueOnce(json({ accessToken: 'fresh' })).mockResolvedValueOnce(csv())
 expect(await api.downloadCsv(path)).toContain('"19999999999999999998"')
 expect(fetcher).toHaveBeenCalledTimes(4)
 const request = fetcher.mock.calls[3][1]
 expect(request.headers.get('Authorization')).toBe('Bearer fresh')
 expect(request.headers.get('Accept')).toBe('text/csv, application/json')
 expect(request.credentials).toBe('include')
 expect(request.method).toBe('GET')
})
it('surfaces export limit without treating JSON as a partial CSV', async () => {
 const { api, fetcher } = await setup()
 fetcher.mockResolvedValueOnce(json({ code: 'REPORT_EXPORT_LIMIT_EXCEEDED', traceId: 'trace' }, 422))
 await expect(api.downloadCsv(path)).rejects.toMatchObject({ status: 422, detail: { code: 'REPORT_EXPORT_LIMIT_EXCEEDED', traceId: 'trace' } })
 expect(fetcher).toHaveBeenCalledTimes(2)
})
it('rejects unexpected content type and external/non-report paths', async () => {
 const { api, fetcher } = await setup()
 fetcher.mockResolvedValueOnce(json({ wrong: true }))
 await expect(api.downloadCsv(path)).rejects.toBeInstanceOf(ApiError)
 await expect(api.downloadCsv('https://other.test/export')).rejects.toThrow('path')
 await expect(api.downloadCsv('/api/v1/admin/audits/FINANCE/export')).rejects.toThrow('path')
 expect(fetcher).toHaveBeenCalledTimes(2)
})
it('does not deliver a late export after session invalidation', async () => {
 const { api, fetcher } = await setup()
 let resolve!: (response: Response) => void
 fetcher.mockImplementationOnce(() => new Promise<Response>((done) => { resolve = done }))
 const task = api.downloadCsv(path)
 const rejected = expect(task).rejects.toBeInstanceOf(SessionChanged)
 await vi.waitFor(() => expect(resolve).toBeDefined())
 api.invalidateSession()
 resolve(csv())
 await rejected
})
it('bounds repeated unauthorized exports and clears the session', async () => {
 const { api, fetcher } = await setup()
 fetcher.mockResolvedValueOnce(json({}, 401)).mockResolvedValueOnce(json({ accessToken: 'fresh' })).mockResolvedValueOnce(json({}, 401))
 await expect(api.downloadCsv(path)).rejects.toMatchObject({ status: 401 })
 expect(fetcher).toHaveBeenCalledTimes(4)
 expect(api.getSession().status).toBe('anonymous')
})
