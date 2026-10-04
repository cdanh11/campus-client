import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { api } from '../../api/runtime'
import { ReferencePicker } from './ReferencePicker'

vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
afterEach(() => vi.restoreAllMocks())
function show(kind: 'organization' | 'identity', value?: string) {
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 return render(<QueryClientProvider client={client}><ReferencePicker kind={kind} value={value} label="Tham chiếu" /></QueryClientProvider>)
}
it('uses only ACTIVE organization pages while retaining an inactive selected owner reference', async () => {
 const request = vi.spyOn(api, 'request').mockImplementation(async (path) => path.includes('?')
  ? { content: [{ id: 'active', code: 'AC', name: 'Active', status: 'ACTIVE' }], totalPages: 2 }
  : { id: 'old', code: 'OLD', name: 'Inactive', status: 'INACTIVE' })
 show('organization', 'old')
 await screen.findByText('OLD · Inactive')
 await userEvent.click(screen.getByRole('combobox', { name: 'Tham chiếu' }))
 await screen.findByText('AC · Active')
 await userEvent.click(screen.getByRole('button', { name: 'Sau' }))
 await waitFor(() => expect(request).toHaveBeenCalledWith(expect.stringContaining('page=1&size=20&sort=code%2Casc&status=ACTIVE'), expect.objectContaining({ signal: expect.any(AbortSignal) })))
 expect(request).toHaveBeenCalledWith('/api/v1/admin/organization-units/old', expect.anything())
})
it('allows existing suspended Identity references instead of inventing ACTIVE-only linking', async () => {
 const request = vi.spyOn(api, 'request').mockResolvedValue({ content: [{ id: 'suspended', email: 'suspended@example.test', status: 'SUSPENDED' }], totalPages: 1 })
 show('identity')
 await userEvent.click(screen.getByRole('combobox', { name: 'Tham chiếu' }))
 await screen.findByText('suspended@example.test · SUSPENDED')
 expect(request).toHaveBeenCalledWith('/api/v1/admin/users?page=0&size=20&sort=email%2Casc', expect.anything())
 expect(screen.getByRole('button', { name: 'Sau' })).toBeDisabled()
})
