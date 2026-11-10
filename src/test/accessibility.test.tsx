import { render, waitFor } from '@testing-library/react'
import axe from 'axe-core'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import { api } from '../api/runtime'
import { RegistryPage } from '../features/people/RegistryPage'
import { academicResources } from '../features/academic/resources'
import LoginPage from '../pages/LoginPage'

vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
afterEach(() => vi.restoreAllMocks())

const runAxe = async (container: HTMLElement) => {
 const results = await axe.run(container, {
  rules: {
   'color-contrast': { enabled: false },
   'html-has-lang': { enabled: false },
   'document-title': { enabled: false },
   'landmark-one-main': { enabled: false },
   region: { enabled: false },
  },
 })
 return results.violations.map((violation) => violation.id + ': ' + violation.nodes.length)
}

it('login page has no structural accessibility violations', async () => {
 const { container } = render(<MemoryRouter><LoginPage /></MemoryRouter>)
 expect(await runAxe(container)).toEqual([])
})

it('registry page has no structural accessibility violations', async () => {
 vi.spyOn(api, 'request').mockResolvedValue({ content: [{ id: 'term-1', code: 'HK1', name: 'Học kỳ 1', status: 'ACTIVE' }], totalElements: 1, totalPages: 1 })
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 const { container } = render(<MemoryRouter><AntApp><QueryClientProvider client={client}><RegistryPage resource={academicResources.terms} /></QueryClientProvider></AntApp></MemoryRouter>)
 await waitFor(() => expect(container.querySelector('tbody tr')).not.toBeNull())
 expect(await runAxe(container)).toEqual([])
})
