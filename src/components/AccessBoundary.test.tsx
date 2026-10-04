import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { expect, it } from 'vitest'
import { AccessBoundary } from './AccessBoundary'

it('does not render protected children for USER', () => {
 render(<MemoryRouter><AccessBoundary user={{ id: '1', email: 'user@example.test', status: 'ACTIVE', roles: ['USER'] }} role="ADMIN"><div>Private admin data</div></AccessBoundary></MemoryRouter>)
 expect(screen.queryByText('Private admin data')).not.toBeInTheDocument()
 expect(screen.getByText('Bạn không có quyền truy cập')).toBeInTheDocument()
})
it('renders ADMIN children when the current-user contract grants ADMIN', () => {
 render(<MemoryRouter><AccessBoundary user={{ id: '1', email: 'admin@example.test', status: 'ACTIVE', roles: ['ADMIN'] }} role="ADMIN"><div>Admin workspace</div></AccessBoundary></MemoryRouter>)
 expect(screen.getByText('Admin workspace')).toBeInTheDocument()
})
