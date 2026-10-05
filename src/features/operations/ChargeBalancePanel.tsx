import { Button, Descriptions, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/runtime'
import type { components } from '../../api/schema'
import { ErrorNotice } from '../../components/ErrorNotice'
import { formatVnd } from './money'
export type Balance = Required<components['schemas']['com.campus.finance.domain.ChargeBalance']>
export const balancePath = (id: string) => '/api/v1/admin/finance/charges/' + id + '/balance'
export function ChargeBalancePanel({ id }: { id: string }) {
 const result = useQuery({ queryKey: ['charge-balance', id], queryFn: ({ signal }) => api.request<Balance>(balancePath(id), { signal }), staleTime: 0, refetchOnMount: 'always' })
 return <section aria-label="Công nợ khoản thu"><Typography.Title level={4}>Công nợ hiện tại</Typography.Title>
  {result.isFetching && <p role="status">Đang tải công nợ…</p>}
  {result.error && <ErrorNotice error={result.error} />}
  {result.data && <BalanceSummary balance={result.data} />}
  <Button disabled={result.isFetching} onClick={() => { void result.refetch() }}>Tải lại công nợ</Button>
 </section>
}
export function BalanceSummary({ balance }: { balance: Balance }) {
 return <Descriptions column={1} items={[
  { key: 'amount', label: 'Khoản thu gốc', children: formatVnd(balance.amount) },
  { key: 'paid', label: 'Đã thanh toán', children: formatVnd(balance.paidAmount) },
  { key: 'outstanding', label: 'Còn phải thu', children: formatVnd(balance.outstandingAmount) },
  { key: 'version', label: 'Phiên bản khoản thu', children: String(balance.rowVersion) },
 ]} />
}
