import { useState } from 'react'
import { Alert, Button, Card, Empty, Modal, Pagination, Select, Space, Tag, Typography, App as AntApp } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api, queryClient } from '../../api/runtime'
import { ApiError } from '../../api/client'
import type { components } from '../../api/schema'
import { queryParams, safePageTotal } from '../../api/query-params'
import { CampusTime } from '../../components/CampusTime'
import { ErrorNotice } from '../../components/ErrorNotice'
import { useDialogSelection } from './useDialogSelection'

type Delivery = Omit<Required<components['schemas']['com.campus.notification.domain.NotificationDelivery']>, 'readAt'> & { readAt: string | null }
export type InboxItem = Omit<Required<components['schemas']['com.campus.notification.domain.InboxItem']>, 'delivery'> & { delivery: Delivery }
type InboxPageResult = { content: InboxItem[]; totalElements: number | bigint }
const path = '/api/v1/notifications'
export default function InboxPage() {
 const [filters, setFilters] = useState({ page: 0, size: 20, status: '', sort: 'deliveredAt,desc' })
 const { selected, open, close } = useDialogSelection()
 const params = queryParams(filters)
 const result = useQuery({
  queryKey: ['inbox', params],
  queryFn: ({ signal }) => api.request<InboxPageResult>(path + '?' + params, { signal }),
  select: (value) => ({ ...value, totalElements: safePageTotal(value.totalElements) }),
 })
 return <>
  <div className="page-heading"><div><Typography.Title level={1}>Hộp thư của bạn</Typography.Title><Typography.Paragraph type="secondary">Thông báo trong ứng dụng dành riêng cho tài khoản này.</Typography.Paragraph></div></div>
  <Space wrap className="list-filters">
   <Select aria-label="Lọc thông báo" value={filters.status} onChange={(status) => setFilters({ ...filters, status, page: 0 })}
    options={[{ value: '', label: 'Tất cả thông báo' }, { value: 'UNREAD', label: 'Chưa đọc' }, { value: 'READ', label: 'Đã đọc' }]} style={{ minWidth: 180 }} />
   <Select aria-label="Sắp xếp thông báo" value={filters.sort} onChange={(sort) => setFilters({ ...filters, sort, page: 0 })}
    options={[{ value: 'deliveredAt,desc', label: 'Mới nhất trước' }, { value: 'deliveredAt,asc', label: 'Cũ nhất trước' }]} style={{ minWidth: 180 }} />
  </Space>
  {result.isFetching && <p role="status">Đang tải hộp thư…</p>}
  {result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  {!result.isFetching && !result.error && result.data?.content.length === 0 && <Card><Empty description="Chưa có thông báo phù hợp." /></Card>}
  <div className="portal-inbox">{!result.error && result.data?.content.map((item) => <Card key={item.delivery.id}>
   <Space wrap><Tag color={item.delivery.status === 'UNREAD' ? 'purple' : 'default'}>{item.delivery.status === 'UNREAD' ? 'Chưa đọc' : 'Đã đọc'}</Tag><Typography.Text type="secondary"><CampusTime value={item.delivery.deliveredAt} /></Typography.Text></Space>
   <Typography.Title level={2} style={{ fontSize: 20 }}>{item.title}</Typography.Title>
   <Typography.Paragraph ellipsis={{ rows: 2 }} style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{item.body}</Typography.Paragraph>
   <Button onClick={(event) => open(item.delivery.id, event.currentTarget)}>Xem thông báo</Button>
  </Card>)}</div>
  <Pagination aria-label="Trang hộp thư" current={filters.page + 1} pageSize={filters.size} total={result.data?.totalElements ?? 0}
   showSizeChanger pageSizeOptions={[10, 20, 50, 100]} onChange={(page, size) => setFilters({ ...filters, page: page - 1, size })} />
  {selected && <InboxDetail key={selected} id={selected} onClose={close} />}
 </>
}
function InboxDetail({ id, onClose }: { id: string; onClose: () => void }) {
 const { message } = AntApp.useApp()
 const detail = useQuery({ queryKey: ['inbox-detail', id], queryFn: ({ signal }) => api.request<InboxItem>(path + '/' + encodeURIComponent(id), { signal }),
  staleTime: 0, refetchOnMount: 'always', refetchOnWindowFocus: false, refetchOnReconnect: false })
 const mutation = useMutation({
  mutationFn: () => {
   if (!detail.data || detail.error || detail.isFetching || detail.data.delivery.status !== 'UNREAD') throw new Error('Chưa có thông báo mới nhất.')
   return api.mutation<Delivery>(path + '/' + encodeURIComponent(id) + '/read', 'PUT',
    { expectedVersion: detail.data.delivery.rowVersion } satisfies components['schemas']['NotificationReadRequest'])
  },
  onSuccess: async () => { await Promise.all([queryClient.invalidateQueries({ queryKey: ['inbox'] }), queryClient.invalidateQueries({ queryKey: ['inbox-detail', id] })]); void message.success('Đã đánh dấu thông báo đã đọc.'); onClose() },
 })
 const conflict = mutation.error instanceof ApiError && mutation.error.detail.code === 'CONCURRENT_MODIFICATION'
 return <Modal open closable={!mutation.isPending} title="Chi tiết thông báo" onCancel={mutation.isPending ? undefined : onClose} footer={<Space>
  <Button disabled={mutation.isPending} onClick={onClose}>Đóng</Button>
  {detail.data?.delivery.status === 'UNREAD' && <Button aria-label="Đánh dấu đã đọc" type="primary" loading={mutation.isPending} disabled={detail.isFetching || !!detail.error || conflict || mutation.isPending} onClick={() => mutation.mutate()}>Đánh dấu đã đọc</Button>}
 </Space>}>
  {detail.isFetching && <p role="status">Đang tải thông báo mới nhất…</p>}
  {detail.error && <ErrorNotice error={detail.error} onRetry={() => { void detail.refetch() }} />}
  {mutation.error && <ErrorNotice error={mutation.error} />}
  {conflict && <Alert type="info" title="Đóng và mở lại thông báo để kiểm tra trạng thái mới nhất trước khi thao tác." />}
  {!detail.error && detail.data && <><Typography.Title level={2}>{detail.data.title}</Typography.Title>
   <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{detail.data.body}</Typography.Paragraph>
   <Typography.Paragraph type="secondary">Nhận lúc: <CampusTime value={detail.data.delivery.deliveredAt} /></Typography.Paragraph>
   {detail.data.delivery.readAt && <Typography.Paragraph>Đã đọc lúc: <CampusTime value={detail.data.delivery.readAt} /></Typography.Paragraph>}</>}
 </Modal>
}
