import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter, useLocation } from 'react-router-dom'
import { expect, it } from 'vitest'
import { useListQuery } from './list-query'

const spec = {
 sorts: ['createdAt,desc', 'email,asc'],
 choices: { status: ['ACTIVE', 'SUSPENDED'] },
}
const defaults = { page: 0, size: 20, q: '', status: '', sort: 'createdAt,desc' }

function Probe() {
 const [state, update] = useListQuery(defaults, spec)
 const location = useLocation()
 return <>
  <output data-testid="state">{JSON.stringify(state)}</output>
  <output data-testid="search">{location.search}</output>
  <button onClick={() => update({ ...state, page: state.page + 1 })}>Trang sau</button>
  <button onClick={() => update({ ...state, status: 'SUSPENDED', page: 0 })}>Lọc</button>
  <button onClick={() => update({ ...state, status: '' })}>Bỏ lọc</button>
 </>
}

const renderAt = (entry: string) => {
 render(<MemoryRouter initialEntries={[entry]}><Probe /></MemoryRouter>)
 return { state: () => JSON.parse(screen.getByTestId('state').textContent ?? '{}') as typeof defaults, search: () => screen.getByTestId('search').textContent ?? '' }
}

it('uses page defaults when the URL has no filter state', () => {
 expect(renderAt('/admin/users').state()).toEqual(defaults)
})

it('reads valid page, size, filter and sort values from the URL', () => {
 const view = renderAt('/admin/users?page=2&size=50&q=an&status=ACTIVE&sort=email,asc')
 expect(view.state()).toEqual({ ...defaults, page: 2, size: 50, q: 'an', status: 'ACTIVE', sort: 'email,asc' })
})

it('falls back to defaults for invalid values instead of sending them', () => {
 const view = renderAt('/admin/users?page=-1&size=999&status=DELETED&sort=password,asc')
 expect(view.state()).toEqual(defaults)
})

it('writes only non-default values and keeps unrelated query parameters', () => {
 const view = renderAt('/admin/users?tab=invites')
 fireEvent.click(screen.getByText('Lọc'))
 expect(view.search()).toBe('?tab=invites&status=SUSPENDED')
 fireEvent.click(screen.getByText('Trang sau'))
 expect(view.search()).toBe('?tab=invites&page=1&status=SUSPENDED')
 fireEvent.click(screen.getByText('Bỏ lọc'))
 expect(view.search()).toBe('?tab=invites&page=1')
})
