import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App as AntApp } from 'antd'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { afterEach, expect, it, vi } from 'vitest'
import { api } from '../../api/runtime'
import { ApiError } from '../../api/client'
import { PaymentsPage } from './PaymentsPage'
vi.stubGlobal('ResizeObserver', class { observe() {} unobserve() {} disconnect() {} })
afterEach(() => vi.restoreAllMocks())
const receipt = { id: 'p', receiptNumber: 'R01', chargeId: 'c', amount: 9007199254740993n, status: 'RECORDED', rowVersion: 1 }
const fresh = { ...receipt, rowVersion: 9223372036854775805n }
const balance = { chargeId: 'c', amount: 9999999999999999999n, currency: 'VND', status: 'OPEN', rowVersion: 9223372036854775806n, paidAmount: receipt.amount, outstandingAmount: 9990992800745259006n }
function requests(returnedBalance = balance) {
 return vi.spyOn(api, 'request').mockImplementation(async (path) => {
  if (path.includes('/payments?')) return { content: [receipt], totalElements: 1, totalPages: 1 }
  if (path.endsWith('/payments/p')) return fresh
  if (path.endsWith('/balance')) return returnedBalance
  if (path.endsWith('/charges/c')) return { id: 'c', chargeNumber: 'C01', feeName: 'Phí', status: 'OPEN', rowVersion: 1 }
  return { content: [], totalElements: 0, totalPages: 0 }
 })
}
function show() {
 const client = new QueryClient({ defaultOptions: { queries: { retry: false }, mutations: { retry: false } } })
 render(<AntApp><QueryClientProvider client={client}><PaymentsPage /></QueryClientProvider></AntApp>)
}
it('reversal uses freshly read receipt and charge versions, validates reason and blocks replay after conflict', async () => {
 const request = requests()
 const mutation = vi.spyOn(api, 'mutation').mockRejectedValue(new ApiError(409, { code: 'CONCURRENT_MODIFICATION' }))
 show()
 await userEvent.click(await screen.findByRole('button', { name: 'Đảo biên nhận' }))
 const dialog = within(screen.getByRole('dialog'))
 await waitFor(() => expect(dialog.getByRole('button', { name: 'Lưu' })).toBeEnabled())
 fireEvent.change(dialog.getByLabelText('Lý do đảo'), { target: { value: 'x' } })
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await waitFor(() => expect(dialog.getByLabelText('Lý do đảo')).toHaveAttribute('aria-invalid', 'true'))
 expect(mutation).not.toHaveBeenCalled()
 fireEvent.change(dialog.getByLabelText('Lý do đảo'), { target: { value: 'Ghi nhận nhầm' } })
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/admin/finance/payments/p', 'PUT', { status: 'REVERSED', expectedVersion: fresh.rowVersion, expectedChargeVersion: balance.rowVersion, reason: 'Ghi nhận nhầm' }))
 await dialog.findByText(/Đóng và mở lại/)
 expect(dialog.getByRole('button', { name: 'Lưu' })).toBeDisabled()
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 expect(mutation).toHaveBeenCalledOnce()
 expect(request).toHaveBeenCalledWith('/api/v1/admin/finance/charges/c/balance', expect.objectContaining({ signal: expect.any(AbortSignal) }))
}, 15000)
it('does not permit reversal when the balance response belongs to another charge', async () => {
 requests({ ...balance, chargeId: 'other' })
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({})
 show()
 await userEvent.click(await screen.findByRole('button', { name: 'Đảo biên nhận' }))
 const dialog = within(screen.getByRole('dialog'))
 await dialog.findByText('Phiên bản khoản thu')
 expect(dialog.getByRole('button', { name: 'Lưu' })).toBeDisabled()
 expect(mutation).not.toHaveBeenCalled()
}, 15000)

it('creation sends exact VND with the fresh balance version, while fractional input sends nothing', async () => {
 vi.spyOn(api, 'request').mockImplementation(async (path) => {
  if (path.endsWith('/balance')) return balance
  if (path.includes('/charges?')) return { content: [{ id: 'c', chargeNumber: 'C01', feeName: 'Phí', status: 'OPEN' }], totalElements: 1, totalPages: 1 }
  if (path.endsWith('/charges/c')) return { id: 'c', chargeNumber: 'C01', feeName: 'Phí', status: 'OPEN' }
  return { content: [], totalElements: 0, totalPages: 0 }
 })
 const mutation = vi.spyOn(api, 'mutation').mockResolvedValue({})
 show()
 await userEvent.click(screen.getByRole('button', { name: 'Ghi nhận thanh toán' }))
 const dialog = within(screen.getByRole('dialog'))
 fireEvent.change(dialog.getByLabelText('Mã biên nhận'), { target: { value: 'R02' } })
 await userEvent.click(dialog.getByRole('combobox', { name: 'Khoản thu' }))
 await userEvent.click(await screen.findByText('C01 · Phí', { selector: '.ant-select-item-option-content' }))
 await waitFor(() => expect(dialog.getByRole('button', { name: 'Lưu' })).toBeEnabled())
 fireEvent.change(dialog.getByLabelText('Số tiền VND'), { target: { value: '1.5' } })
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await waitFor(() => expect(dialog.getByLabelText('Số tiền VND')).toHaveAttribute('aria-invalid', 'true'))
 expect(mutation).not.toHaveBeenCalled()
 fireEvent.change(dialog.getByLabelText('Số tiền VND'), { target: { value: '9007199254740993' } })
 await userEvent.click(dialog.getByRole('button', { name: 'Lưu' }))
 await waitFor(() => expect(mutation).toHaveBeenCalledWith('/api/v1/admin/finance/payments', 'POST', { receiptNumber: 'R02', chargeId: 'c', amount: 9007199254740993n, expectedChargeVersion: balance.rowVersion }))
 expect(mutation).toHaveBeenCalledOnce()
}, 15000)
