import { useState } from 'react'
import { Button, Descriptions, Form, Input, Modal, Select, Space, Table, Typography } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api, queryClient } from '../../api/runtime'
import { ApiError } from '../../api/client'
import { queryParams, safePageTotal } from '../../api/query-params'
import type { components } from '../../api/schema'
import type { PageResult } from '../people/contracts'
import { ReferenceLabel, ReferencePicker } from '../people/ReferencePicker'
import { ErrorNotice } from '../../components/ErrorNotice'
import { nameRule, trimOrganization } from '../../forms/validation'
import { amountRule, formatVnd, paymentAmount } from './money'
import { balancePath, BalanceSummary, type Balance } from './ChargeBalancePanel'
type Payment = Required<components['schemas']['com.campus.finance.domain.ManualPayment']>
type PaymentCreate = components['schemas']['FinancePaymentCreate']
type PaymentReverse = components['schemas']['FinancePaymentReverse']
interface Values { receiptNumber: string; chargeId: string; amount: string; reason: string }
type Mode = 'create' | 'detail' | 'reverse'
const path = '/api/v1/admin/finance/payments'
export function PaymentsPage() {
 const [filters, setFilters] = useState({ page: 0, size: 20, q: '', status: '', chargeId: '', sort: 'recordedAt,desc' })
 const [edit, setEdit] = useState<{ mode: Mode; id?: string } | null>(null)
 const params = queryParams(filters)
 const result = useQuery({
  queryKey: ['payments', params], queryFn: ({ signal }) => api.request<PageResult<Payment>>(path + '?' + params, { signal }),
  select: (data: PageResult<Payment>) => ({ ...data, totalElements: safePageTotal(data.totalElements) }),
 })
 return <>
  <div className="page-heading"><Typography.Title level={1}>Biên nhận thanh toán</Typography.Title><Button type="primary" onClick={() => setEdit({ mode: 'create' })}>Ghi nhận thanh toán</Button></div>
  <Typography.Paragraph>Ghi nhận thủ công, hỗ trợ thanh toán từng phần. Đảo toàn bộ biên nhận để sửa sai và giữ lịch sử; không chuyển tiền qua cổng thanh toán.</Typography.Paragraph>
  <Space wrap className="list-filters">
   <Input.Search aria-label="Tìm biên nhận" maxLength={100} allowClear onSearch={(q) => setFilters({ ...filters, q, page: 0 })} />
   <Select aria-label="Lọc trạng thái" value={filters.status} options={[{ value: '', label: 'Tất cả trạng thái' }, { value: 'RECORDED', label: 'Đã ghi nhận' }, { value: 'REVERSED', label: 'Đã đảo' }]} onChange={(status) => setFilters({ ...filters, status, page: 0 })} />
   <div style={{ minWidth: 240 }}><ReferencePicker kind="charge" label="Lọc khoản thu" eligible={false} allowClear value={filters.chargeId} onChange={(chargeId) => setFilters({ ...filters, chargeId: chargeId ?? '', page: 0 })} /></div>
   <Select aria-label="Sắp xếp" value={filters.sort} options={['recordedAt', 'receiptNumber', 'amount', 'status', 'createdAt', 'updatedAt'].flatMap((field) => ['asc', 'desc'].map((direction) => ({ value: field + ',' + direction, label: field + ' ' + direction })))} onChange={(sort) => setFilters({ ...filters, sort, page: 0 })} />
  </Space>
  {result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  <Table<Payment> rowKey="id" loading={result.isFetching} dataSource={result.data?.content ?? []} scroll={{ x: 1000 }}
   locale={{ emptyText: 'Chưa có biên nhận phù hợp.' }}
   columns={[
    { title: 'Mã biên nhận', dataIndex: 'receiptNumber' }, { title: 'Khoản thu', dataIndex: 'chargeId', render: (id: unknown) => <ReferenceLabel kind="charge" value={id} /> },
    { title: 'Số tiền', dataIndex: 'amount', render: formatVnd }, { title: 'Trạng thái', dataIndex: 'status' }, { title: 'Ghi nhận', dataIndex: 'recordedAt' },
    { title: 'Thao tác', render: (_, row) => <Space wrap><Button onClick={() => setEdit({ mode: 'detail', id: row.id })}>Chi tiết</Button><Button disabled={row.status !== 'RECORDED'} onClick={() => setEdit({ mode: 'reverse', id: row.id })}>Đảo biên nhận</Button></Space> },
   ]}
   pagination={{ current: filters.page + 1, pageSize: filters.size, total: result.data?.totalElements ?? 0, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100], onChange: (page, size) => setFilters({ ...filters, page: page - 1, size }) }} />
  {edit && <PaymentEditor key={(edit.id ?? '') + edit.mode} {...edit} onClose={() => setEdit(null)} />}
 </>
}
function PaymentEditor({ mode, id, onClose }: { mode: Mode; id?: string; onClose: () => void }) {
 const [form] = Form.useForm<Values>()
 const watchedCharge = Form.useWatch('chargeId', form) as string | undefined
 const detail = useQuery({ queryKey: ['payment-detail', id, mode], queryFn: ({ signal }) => api.request<Payment>(path + '/' + id, { signal }), enabled: !!id, staleTime: 0, refetchOnMount: 'always', refetchOnWindowFocus: false, refetchOnReconnect: false })
 const chargeId = mode === 'create' ? watchedCharge : detail.data?.chargeId
 const balance = useQuery({ queryKey: ['charge-balance-mutation', chargeId, id, mode], queryFn: ({ signal }) => api.request<Balance>(balancePath(chargeId!), { signal }), enabled: !!chargeId, staleTime: 0, refetchOnMount: 'always', refetchOnWindowFocus: false, refetchOnReconnect: false })
 const mutation = useMutation({
  mutationFn: async (values: Values) => {
   if (!balance.data || balance.error || balance.data.chargeId !== (mode === 'create' ? values.chargeId : detail.data?.chargeId)) throw new Error('Chưa tải được công nợ.')
   if (mode === 'create') return api.mutation(path, 'POST', { receiptNumber: values.receiptNumber, chargeId: values.chargeId, amount: paymentAmount(values.amount), expectedChargeVersion: balance.data.rowVersion } satisfies PaymentCreate)
   if (!detail.data || detail.error) throw new Error('Chưa tải được biên nhận.')
   return api.mutation(path + '/' + id, 'PUT', { status: 'REVERSED', expectedVersion: detail.data.rowVersion, expectedChargeVersion: balance.data.rowVersion, reason: values.reason } satisfies PaymentReverse)
  },
  onSuccess: () => {
   void queryClient.invalidateQueries({ queryKey: ['payments'] })
   void queryClient.invalidateQueries({ queryKey: ['payment-detail'] })
   void queryClient.invalidateQueries({ queryKey: ['registry', '/api/v1/admin/finance/charges'] })
   void queryClient.invalidateQueries({ queryKey: ['reference'] })
   void queryClient.invalidateQueries({ queryKey: ['reference-selected'] })
   void queryClient.invalidateQueries({ queryKey: ['charge-balance'] })
   void queryClient.invalidateQueries({ queryKey: ['charge-balance-mutation'] })
   onClose()
  },
 })
 const conflict = mutation.error instanceof ApiError && mutation.error.detail.code === 'CONCURRENT_MODIFICATION'
 const busy = mutation.isPending || (!!id && (detail.isFetching || !detail.data || !!detail.error)) || balance.isFetching
 const unavailable = !balance.data || balance.data.chargeId !== chargeId || !!balance.error || balance.data.status !== 'OPEN' || (mode === 'reverse' && detail.data?.status !== 'RECORDED')
 const title = mode === 'create' ? 'Ghi nhận thanh toán' : mode === 'reverse' ? 'Đảo toàn bộ biên nhận' : 'Chi tiết biên nhận'
 return <Modal open title={title} onCancel={mutation.isPending ? undefined : onClose} destroyOnHidden
  footer={<Space><Button aria-label="Đóng biểu mẫu" disabled={mutation.isPending} onClick={onClose}>Đóng</Button>{mode !== 'detail' && <Button aria-label="Lưu" type="primary" loading={mutation.isPending} disabled={busy || unavailable || conflict} onClick={() => form.submit()}>{mode === 'create' ? 'Ghi nhận thanh toán' : 'Đảo toàn bộ biên nhận'}</Button>}</Space>}>
  {detail.error && <ErrorNotice error={detail.error} onRetry={() => { void detail.refetch() }} />}
  {balance.error && <ErrorNotice error={balance.error} onRetry={() => { void balance.refetch() }} />}
  {balance.isFetching && <p role="status">Đang tải công nợ…</p>}
  {detail.data && <Descriptions column={1} items={[
   { key: 'number', label: 'Mã biên nhận', children: detail.data.receiptNumber }, { key: 'amount', label: 'Số tiền gốc', children: formatVnd(detail.data.amount) },
   { key: 'status', label: 'Trạng thái', children: detail.data.status }, { key: 'recorded', label: 'Ghi nhận', children: detail.data.recordedAt },
   { key: 'reversed', label: 'Đảo lúc', children: detail.data.reversedAt ?? '—' }, { key: 'reason', label: 'Lý do đã lưu', children: detail.data.reversalReason ?? '—' },
  ]} />}
  {balance.data && <BalanceSummary balance={balance.data} />}
  {mutation.error && <ErrorNotice error={mutation.error} />}
  {conflict && <Typography.Paragraph>Dữ liệu đã thay đổi. Đóng và mở lại để xem phiên bản biên nhận/công nợ mới trước khi thao tác.</Typography.Paragraph>}
  {mode !== 'detail' && <Form form={form} layout="vertical" disabled={busy || conflict} onFinish={(values) => mutation.mutate(values)}>
   {mode === 'create' ? <>
    <Form.Item name="receiptNumber" label="Mã biên nhận" rules={[nameRule(2, 32, trimOrganization), nameRule(2, 32, (value) => trimOrganization(value).toUpperCase())]}><Input autoComplete="off" /></Form.Item>
    <Form.Item name="chargeId" label="Khoản thu" rules={[{ required: true, message: 'Chọn khoản thu.' }]}><ReferencePicker kind="charge" label="Khoản thu" disabled={mutation.isPending || conflict} /></Form.Item>
    <Form.Item name="amount" label="Số tiền VND" rules={[amountRule]}><Input inputMode="numeric" maxLength={19} autoComplete="off" /></Form.Item>
   </> : <><Typography.Paragraph>Đảo toàn bộ số tiền biên nhận; thao tác giữ lịch sử và làm tăng số còn phải thu.</Typography.Paragraph><Form.Item name="reason" label="Lý do đảo" rules={[nameRule(2, 500, trimOrganization)]}><Input.TextArea rows={3} /></Form.Item></>}
  </Form>}
 </Modal>
}
