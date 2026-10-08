import { render, screen } from '@testing-library/react'
import { expect, it } from 'vitest'
import { CampusTime } from './CampusTime'

it('shows campus time with day rollover and retains the exact API instant', () => {
 const value = '2026-12-31T18:05:09.123456Z'
 render(<CampusTime value={value} />)
 expect(screen.getByText('01:05:09 01/01/2027 (UTC+7)')).toHaveAttribute('datetime', value)
})
it('normalizes offset instants for display without changing their source', () => {
 const value = '2026-10-05T02:00:00-05:00'
 render(<CampusTime value={value} />)
 expect(screen.getByText('14:00:00 05/10/2026 (UTC+7)')).toHaveAttribute('datetime', value)
})
it.each([null, undefined, '', 'invalid'])('shows a placeholder for missing or invalid time: %s', (value) => {
 const { container } = render(<CampusTime value={value} />)
 expect(screen.getByText('—')).toBeInTheDocument()
 expect(container.querySelector('time')).toBeNull()
})
