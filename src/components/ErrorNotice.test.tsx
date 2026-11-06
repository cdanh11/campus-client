import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, it, vi } from 'vitest'
import { ApiError } from '../api/client'
import { ErrorNotice } from './ErrorNotice'

it('presents optimistic conflicts without automatically repeating a write', async () => {
 const retry = vi.fn()
 render(<ErrorNotice error={new ApiError(409, { code: 'CONCURRENT_MODIFICATION', traceId: 'request-123' })} onRetry={retry} />)
 expect(screen.getByText(/Dữ liệu hoặc trạng thái đã thay đổi/)).toBeInTheDocument()
 expect(screen.getByText('Mã lỗi: CONCURRENT_MODIFICATION')).toBeInTheDocument()
 expect(screen.getByText('Mã tra cứu: request-123')).toBeInTheDocument()
 expect(retry).not.toHaveBeenCalled()
 await userEvent.click(screen.getByRole('button', { name: 'Tải lại' }))
 expect(retry).toHaveBeenCalledOnce()
})
it('presents permission denial clearly', () => {
 render(<ErrorNotice error={new ApiError(403, { code: 'FORBIDDEN' })} />)
 expect(screen.getByText('Tài khoản không có quyền thực hiện thao tác này.')).toBeInTheDocument()
})
it('keeps server diagnostics in Vietnamese while exposing the error code', () => {
 render(<ErrorNotice error={new ApiError(500, { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred', traceId: 'request-500' })} />)
 expect(screen.getByText('Máy chủ gặp lỗi ngoài dự kiến. Vui lòng thử lại sau.')).toBeInTheDocument()
 expect(screen.queryByText(/unexpected/)).not.toBeInTheDocument()
 expect(screen.getByText('Mã lỗi: INTERNAL_ERROR')).toBeInTheDocument()
})
