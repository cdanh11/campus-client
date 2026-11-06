import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { api } from '../../api/runtime'
import { ReferenceLabel } from './ReferencePicker'
import { ReferenceLabelsProvider } from './reference-labels'

afterEach(() => vi.restoreAllMocks())
function show(requests: Parameters<typeof ReferenceLabelsProvider>[0]['requests']) {
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 return render(<QueryClientProvider client={client}><ReferenceLabelsProvider requests={requests}>
  <ReferenceLabel kind="student" value="a" />|<ReferenceLabel kind="student" value="b" />|<ReferenceLabel kind="student" value="a" />
 </ReferenceLabelsProvider></QueryClientProvider>)
}
it('loads one batch per kind instead of one request per table cell', async () => {
 const request = vi.spyOn(api, 'request').mockImplementation(async (path) => path.includes('/students/lookup?ids=')
  ? [{ id: 'a', studentNumber: 'SV1', fullName: 'An', status: 'ACTIVE' }, { id: 'b', studentNumber: 'SV2', fullName: 'Bình', status: 'ACTIVE' }]
  : Promise.reject(new Error('unexpected single lookup: ' + path)))
 show({ student: ['b', 'a', 'b', undefined] })
 expect((await screen.findAllByText('SV1 · An')).length).toBe(2)
 expect(screen.getByText('SV2 · Bình')).toBeTruthy()
 expect(request).toHaveBeenCalledOnce()
 expect(request).toHaveBeenCalledWith('/api/v1/admin/students/lookup?ids=a,b', expect.objectContaining({ signal: expect.any(AbortSignal) }))
})
it('uses the dormitory lookup route and reports missing references once the batch settles', async () => {
 const request = vi.spyOn(api, 'request').mockResolvedValue([{ id: 'bed', code: 'BD1', name: 'Giường 1', status: 'ACTIVE' }])
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 render(<QueryClientProvider client={client}><ReferenceLabelsProvider requests={{ bed: ['bed', 'gone'] }}>
  <ReferenceLabel kind="bed" value="bed" />|<ReferenceLabel kind="bed" value="gone" />
 </ReferenceLabelsProvider></QueryClientProvider>)
 expect(await screen.findByText('BD1 · Giường 1')).toBeTruthy()
 expect(await screen.findByText('Không tải được tham chiếu')).toBeTruthy()
 expect(request).toHaveBeenCalledWith('/api/v1/admin/dormitory/lookup/beds?ids=bed,gone', expect.objectContaining({ signal: expect.any(AbortSignal) }))
})
