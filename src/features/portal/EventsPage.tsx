import { useState } from 'react'
import { Alert, Button, Card, Empty, Input, Modal, Pagination, Select, Space, Tag, Typography, App as AntApp } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api, queryClient } from '../../api/runtime'
import { ApiError } from '../../api/client'
import type { components } from '../../api/schema'
import { queryParams, safePageTotal } from '../../api/query-params'
import { ErrorNotice } from '../../components/ErrorNotice'
import { useDialogSelection } from './useDialogSelection'
export type CampusEvent = Required<components['schemas']['com.campus.event.domain.CampusEvent']>
export type Registration = Omit<Required<components['schemas']['com.campus.event.domain.EventRegistration']>, 'cancelledAt' | 'attendedAt'> & { cancelledAt: string | null; attendedAt: string | null }
type Page<T> = { content: T[]; totalElements: number | bigint }
const eventPath = '/api/v1/events'
const ownPath = '/api/v1/event-registrations'
const states = { DRAFT: 'Bản nháp', OPEN: 'Đang mở', CLOSED: 'Đã đóng', CANCELLED: 'Đã hủy', REGISTERED: 'Đã đăng ký', ATTENDED: 'Đã tham dự' }
const unlinked = (error: unknown) => error instanceof ApiError && error.status === 404 && error.detail.code === 'EVENT_REGISTRATION_NOT_FOUND'
function LinkNotice() { return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên liên kết" description="Bạn vẫn có thể xem sự kiện. Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên trước khi đăng ký." /> }
export function ownActions(registration: Registration | null, event: CampusEvent): ('REGISTER' | 'CANCEL' | 'RESTORE')[] {
 if (!registration) return event.status === 'OPEN' ? ['REGISTER'] : []
 if (registration.status === 'REGISTERED') return ['CANCEL']
 return registration.status === 'CANCELLED' && event.status === 'OPEN' ? ['RESTORE'] : []
}
export default function EventsPage({ history = false }: { history?: boolean }) {
 const [filters, setFilters] = useState({ page: 0, size: 20, q: '', status: '', sort: history ? 'registeredAt,desc' : 'startsAt,asc' })
 const { selected, open, close } = useDialogSelection()
 const params = queryParams({ ...filters, q: history ? undefined : filters.q })
 const result = useQuery({
  queryKey: ['portal-events', history ? 'history' : 'catalog', params],
  queryFn: ({ signal }) => api.request<Page<CampusEvent | Registration>>((history ? ownPath : eventPath) + '?' + params, { signal }),
  select: (value) => ({ ...value, totalElements: safePageTotal(value.totalElements) }),
 })
 const statuses = history ? ['REGISTERED', 'CANCELLED', 'ATTENDED'] : ['DRAFT', 'OPEN', 'CLOSED', 'CANCELLED']
 return <>
  <div className="page-heading"><div><Typography.Title level={1}>{history ? 'Đăng ký của bạn' : 'Khám phá sự kiện'}</Typography.Title>
   <Typography.Paragraph type="secondary">{history ? 'Lịch sử đăng ký, hủy và khôi phục được giữ lại.' : 'Tìm hoạt động trong khuôn viên. Chỉ sự kiện đang mở nhận đăng ký.'}</Typography.Paragraph></div></div>
  <Space wrap className="list-filters">
   {!history && <Input.Search aria-label="Tìm sự kiện" maxLength={100} placeholder="Tìm mã hoặc tên sự kiện" allowClear onSearch={(q) => setFilters({ ...filters, q, page: 0 })} style={{ width: 260 }} />}
   <Select aria-label="Lọc trạng thái sự kiện" value={filters.status} onChange={(status) => setFilters({ ...filters, status, page: 0 })}
    options={[{ value: '', label: 'Tất cả trạng thái' }, ...statuses.map((value) => ({ value, label: states[value as keyof typeof states] }))]} style={{ minWidth: 180 }} />
   <Select aria-label="Sắp xếp sự kiện" value={filters.sort} onChange={(sort) => setFilters({ ...filters, sort, page: 0 })}
    options={history ? [{ value: 'registeredAt,desc', label: 'Đăng ký mới nhất' }, { value: 'registeredAt,asc', label: 'Đăng ký cũ nhất' }]
     : [{ value: 'startsAt,asc', label: 'Bắt đầu tăng dần' }, { value: 'startsAt,desc', label: 'Bắt đầu giảm dần' }, { value: 'title,asc', label: 'Tên A–Z' }]} style={{ minWidth: 180 }} />
  </Space>
  {result.isFetching && <p role="status">Đang tải sự kiện…</p>}
  {unlinked(result.error) ? <LinkNotice /> : result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  {!result.isFetching && !result.error && !result.data?.content.length && <Card><Empty description="Chưa có sự kiện phù hợp." /></Card>}
  <div className="portal-event-grid">{!result.error && result.data?.content.map((row) => {
   const event = row as CampusEvent
   const registration = row as Registration
   return <Card key={row.id}>
    <Tag color={row.status === 'OPEN' || row.status === 'REGISTERED' ? 'purple' : 'default'}>{states[row.status]}</Tag>
    <Typography.Title level={2} style={{ fontSize: 20 }}>{history ? <EventTitle id={registration.eventId} /> : event.title}</Typography.Title>
    {history ? <><Typography.Paragraph>Mã sự kiện: {registration.eventId}</Typography.Paragraph><Typography.Paragraph>Đăng ký lúc: {registration.registeredAt}</Typography.Paragraph>
     {registration.cancelledAt && <Typography.Paragraph>Hủy lúc: {registration.cancelledAt}</Typography.Paragraph>}
     {registration.attendedAt && <Typography.Paragraph>Tham dự lúc: {registration.attendedAt}</Typography.Paragraph>}</>
     : <><Typography.Paragraph type="secondary">{event.code} · Sức chứa: {event.capacity}</Typography.Paragraph><Typography.Paragraph>Bắt đầu UTC: {event.startsAt}</Typography.Paragraph></>}
    <Button onClick={(click) => open(history ? registration.eventId : event.id, click.currentTarget)}>Xem sự kiện</Button>
   </Card>
  })}</div>
  <Pagination aria-label="Trang sự kiện" current={filters.page + 1} pageSize={filters.size} total={result.data?.totalElements ?? 0}
   showSizeChanger pageSizeOptions={[10, 20, 50, 100]} onChange={(page, size) => setFilters({ ...filters, page: page - 1, size })} />
  {selected && <EventDetail key={selected} id={selected} onClose={close} />}
 </>
}
function EventDetail({ id, onClose }: { id: string; onClose: () => void }) {
 const { message } = AntApp.useApp()
 const fresh = { staleTime: 0, refetchOnMount: 'always' as const, refetchOnWindowFocus: false, refetchOnReconnect: false }
 const event = useQuery({ queryKey: ['portal-event-detail', id], queryFn: ({ signal }) => api.request<CampusEvent>(eventPath + '/' + encodeURIComponent(id), { signal }), ...fresh })
 const membership = useQuery({
  queryKey: ['portal-own-registration', id],
  queryFn: async ({ signal }) => {
   const page = await api.request<Page<Registration>>(ownPath + '?' + queryParams({ page: 0, size: 1, eventId: id, sort: 'registeredAt,desc' }), { signal })
   return page.content[0] ? api.request<Registration>(ownPath + '/' + encodeURIComponent(page.content[0].id), { signal }) : null
  }, ...fresh,
 })
 const mutation = useMutation({
  mutationFn: (action: 'REGISTER' | 'CANCEL' | 'RESTORE') => {
   if (!event.data || event.error || event.isFetching || membership.error || membership.isFetching || membership.data === undefined || !ownActions(membership.data, event.data).includes(action)) throw new Error('Chưa có dữ liệu mới nhất để thao tác.')
   if (action === 'REGISTER') return api.mutation<Registration>(eventPath + '/' + encodeURIComponent(id) + '/registrations', 'POST')
   if (!membership.data) throw new Error('Chưa có đăng ký.')
   return api.mutation<Registration>(ownPath + '/' + encodeURIComponent(membership.data.id), 'PUT',
    { action, expectedVersion: membership.data.rowVersion } satisfies components['schemas']['EventRegistrationChange'])
  },
  onSuccess: async (_, action) => {
   await Promise.all([queryClient.invalidateQueries({ queryKey: ['portal-events'] }), queryClient.invalidateQueries({ queryKey: ['portal-own-registration', id] })])
   void message.success(action === 'REGISTER' ? 'Đã đăng ký sự kiện.' : action === 'CANCEL' ? 'Đã hủy đăng ký.' : 'Đã khôi phục đăng ký.')
   onClose()
  },
 })
 // After any rejected write, require close/reopen and fresh reads; never replay a mutation automatically.
 const blocked = mutation.isPending || !!mutation.error || event.isFetching || !!event.error || membership.isFetching || !!membership.error
 const actions = event.data && membership.data !== undefined ? ownActions(membership.data, event.data) : []
 const labels = { REGISTER: 'Đăng ký sự kiện', CANCEL: 'Hủy đăng ký', RESTORE: 'Khôi phục đăng ký' }
 return <Modal open closable={!mutation.isPending} title="Chi tiết sự kiện" onCancel={mutation.isPending ? undefined : onClose} footer={<Space wrap>
  <Button disabled={mutation.isPending} onClick={onClose}>Đóng</Button>
  {actions.map((action) => <Button key={action} aria-label={labels[action]} type="primary" danger={action === 'CANCEL'} disabled={blocked} loading={mutation.isPending}
   onClick={() => mutation.mutate(action)}>{labels[action]}</Button>)}
 </Space>}>
  {(event.isFetching || membership.isFetching) && <p role="status">Đang tải trạng thái mới nhất…</p>}
  {event.error && <ErrorNotice error={event.error} onRetry={() => { void event.refetch() }} />}
  {unlinked(membership.error) ? <LinkNotice /> : membership.error && <ErrorNotice error={membership.error} onRetry={() => { void membership.refetch() }} />}
  {mutation.error && <><ErrorNotice error={mutation.error} /><Alert type="info" title="Đóng và mở lại sự kiện để kiểm tra dữ liệu mới nhất; thao tác chưa được gửi lại." /></>}
  {!event.error && event.data && <><Typography.Title level={2}>{event.data.title}</Typography.Title><Tag>{states[event.data.status]}</Tag>
   <Typography.Paragraph style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{event.data.description}</Typography.Paragraph>
   <Typography.Paragraph>Bắt đầu UTC: {event.data.startsAt}</Typography.Paragraph><Typography.Paragraph>Kết thúc UTC: {event.data.endsAt}</Typography.Paragraph>
   <Typography.Paragraph>Sức chứa: {event.data.capacity}. Số chỗ còn lại được máy chủ kiểm tra khi đăng ký.</Typography.Paragraph></>}
  {membership.data && <><Typography.Paragraph>Đăng ký của bạn: {states[membership.data.status]}</Typography.Paragraph>
   <Typography.Paragraph>Đăng ký lúc: {membership.data.registeredAt}</Typography.Paragraph>
   {membership.data.cancelledAt && <Typography.Paragraph>Hủy lúc: {membership.data.cancelledAt}</Typography.Paragraph>}
   {membership.data.attendedAt && <Typography.Paragraph>Tham dự lúc: {membership.data.attendedAt}</Typography.Paragraph>}</>}
 </Modal>
}

function EventTitle({ id }: { id: string }) {
 const event = useQuery({ queryKey: ['portal-event-title', id], queryFn: ({ signal }) => api.request<CampusEvent>(eventPath + '/' + encodeURIComponent(id), { signal }) })
 return <>{event.data?.title ?? (event.isFetching ? 'Đang tải tên sự kiện…' : 'Sự kiện ' + id)}</>
}
