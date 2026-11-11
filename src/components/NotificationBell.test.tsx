import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { afterEach, expect, it, vi } from 'vitest'
import NotificationBell from './NotificationBell'
import { api } from '../api/runtime'

vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })

const page = {
 content: [{ title: 'Thông báo nghỉ lễ', delivery: { id: 'd1', status: 'UNREAD', deliveredAt: '2026-11-07T02:00:00Z' } }],
 totalElements: 3,
}
function Location() {
 const location = useLocation()
 return <p>{location.pathname}</p>
}
function show() {
 vi.spyOn(api, 'request').mockResolvedValue(page)
 const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
 render(<MemoryRouter initialEntries={['/portal']}>
  <QueryClientProvider client={client}>
   <NotificationBell />
   <Routes><Route path="*" element={<Location />} /></Routes>
  </QueryClientProvider>
 </MemoryRouter>)
}
afterEach(() => vi.restoreAllMocks())

it('opens a popover with unread notifications and navigates to the inbox', async () => {
 show()
 const trigger = await screen.findByRole('button', { name: 'Thông báo, 3 chưa đọc' })
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
 await userEvent.click(trigger)
 const dialog = screen.getByRole('dialog', { name: 'Thông báo mới' })
 expect(within(dialog).getByText('Thông báo nghỉ lễ')).toBeInTheDocument()
 expect(trigger).toHaveAttribute('aria-expanded', 'true')
 await userEvent.click(within(dialog).getByRole('button', { name: /Thông báo nghỉ lễ/ }))
 expect(await screen.findByText('/portal/inbox')).toBeInTheDocument()
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})

it('closes the popover with Escape and with an outside click', async () => {
 show()
 const trigger = await screen.findByRole('button', { name: 'Thông báo, 3 chưa đọc' })
 await userEvent.click(trigger)
 expect(screen.getByRole('dialog')).toBeInTheDocument()
 await userEvent.keyboard('{Escape}')
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
 expect(trigger).toHaveFocus()
 await userEvent.click(trigger)
 expect(screen.getByRole('dialog')).toBeInTheDocument()
 await userEvent.click(document.body)
 expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
})
