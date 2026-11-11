import { Alert, Button, Card, Empty, Input, Modal, Pagination, Select, Space, Tabs, Tag, Typography, App as AntApp } from 'antd'
import { ClockCircleOutlined, TeamOutlined } from '@ant-design/icons'
import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { api, queryClient } from '../../api/runtime'
import { ApiError } from '../../api/client'
import type { components } from '../../api/schema'
import { queryParams, safePageTotal } from '../../api/query-params'
import { CampusTime } from '../../components/CampusTime'
import { ErrorNotice } from '../../components/ErrorNotice'
import { useDialogSelection } from './useDialogSelection'
import { useListQuery } from '../list-query'
export type CampusEvent = Required<Omit<components['schemas']['com.campus.event.domain.CampusEvent'], 'hostUnitId'>> & { hostUnitId?: string | null }
export type Registration = Omit<Required<components['schemas']['com.campus.event.domain.EventRegistration']>, 'cancelledAt' | 'attendedAt'> & { cancelledAt: string | null; attendedAt: string | null }
type Page<T> = { content: T[]; totalElements: number | bigint }
type EventHost = { id: string; name: string }
type View = 'upcoming' | 'mine' | 'history'
const eventPath = '/api/v1/events'
const ownPath = '/api/v1/event-registrations'
const states = { DRAFT: 'Bản nháp', OPEN: 'Đang mở', CLOSED: 'Đã đóng', CANCELLED: 'Đã hủy', REGISTERED: 'Đã đăng ký', ATTENDED: 'Đã tham dự' }
const catalogSorts = [{ value: 'startsAt,asc', label: 'Bắt đầu tăng dần' }, { value: 'startsAt,desc', label: 'Bắt đầu giảm dần' }, { value: 'title,asc', label: 'Tên A–Z' }]
const historySorts = [{ value: 'registeredAt,desc', label: 'Đăng ký mới nhất' }, { value: 'registeredAt,asc', label: 'Đăng ký cũ nhất' }]
const heading = { upcoming: 'Khám phá sự kiện', mine: 'Đăng ký của bạn', history: 'Lịch sử sự kiện' }
const introduction = {
 upcoming: 'Tìm hoạt động trong khuôn viên. Chỉ sự kiện đang mở nhận đăng ký.',
 mine: 'Các sự kiện bạn đang giữ chỗ. Mở chi tiết để hủy đăng ký.',
 history: 'Toàn bộ đăng ký, hủy và tham dự được lưu lại để tra cứu.',
}
const emptyText = { upcoming: 'Hiện chưa có sự kiện đang mở đăng ký.', mine: 'Bạn chưa đăng ký sự kiện nào đang hoạt động.', history: 'Chưa có lịch sử đăng ký.' }
const dateFormat = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', weekday: 'short', day: '2-digit', month: '2-digit' })
const clockFormat = new Intl.DateTimeFormat('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
const unlinked = (error: unknown) => error instanceof ApiError && error.status === 404 && error.detail.code === 'EVENT_REGISTRATION_NOT_FOUND'
function groupByHost(events: CampusEvent[], hostNames: Map<string, string>) {
 const groups = new Map<string, { key: string; label: string; events: CampusEvent[] }>()
 for (const event of events) {
  const key = event.hostUnitId ?? ''
  const group = groups.get(key) ?? { key, label: event.hostUnitId ? hostNames.get(event.hostUnitId) ?? 'Đơn vị khác' : 'Sự kiện toàn trường', events: [] }
  group.events.push(event)
  groups.set(key, group)
 }
 return [...groups.values()]
}
function LinkNotice() { return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên liên kết" description="Bạn vẫn có thể xem sự kiện. Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên trước khi đăng ký." /> }
export function ownActions(registration: Registration | null, event: CampusEvent): ('REGISTER' | 'CANCEL' | 'RESTORE')[] {
 if (!registration) return event.status === 'OPEN' ? ['REGISTER'] : []
 if (registration.status === 'REGISTERED') return ['CANCEL']
 return registration.status === 'CANCELLED' && event.status === 'OPEN' ? ['RESTORE'] : []
}
function eventDate(value: string) {
 const date = new Date(value)
 if (Number.isNaN(date.getTime())) return null
 const parts = dateFormat.formatToParts(date)
 const read = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? ''
 return { weekday: read('weekday'), day: read('day'), month: read('month') }
}
function clock(value: string) {
 const date = new Date(value)
 return Number.isNaN(date.getTime()) ? '—' : clockFormat.format(date)
}
function EventDate({ value }: { value: string }) {
 const parts = eventDate(value)
 if (!parts) return <span className="event-date-chip event-date-chip-muted" aria-hidden="true">—</span>
 return <span className="event-date-chip" aria-hidden="true">
  <span className="event-date-weekday">{parts.weekday}</span>
  <span className="event-date-day">{parts.day}</span>
  <span className="event-date-month">Tháng {parts.month}</span>
 </span>
}
function useEvent(id: string | null) {
 return useQuery({
  queryKey: ['portal-event-title', id],
  enabled: !!id,
  queryFn: ({ signal }) => api.request<CampusEvent>(eventPath + '/' + encodeURIComponent(id as string), { signal }),
  staleTime: 5 * 60_000,
  refetchOnWindowFocus: false,
 })
}
function OwnBadge({ registration }: { registration: Registration | null }) {
 if (!registration) return null
 return <Tag color={registration.status === 'REGISTERED' ? 'green' : registration.status === 'ATTENDED' ? 'blue' : 'default'}>{states[registration.status]}</Tag>
}
export default function EventsPage({ history = false }: { history?: boolean }) {
 const [searchParams] = useSearchParams()
 const navigate = useNavigate()
 const requested = searchParams.get('view')
 const view: View = requested === 'mine' || requested === 'history' ? requested : history ? 'history' : 'upcoming'
 const ownView = view !== 'upcoming'
 const sorts = ownView ? historySorts : catalogSorts
 const defaults = view === 'upcoming'
  ? { page: 0, size: 20, q: '', status: 'OPEN', sort: 'startsAt,asc', host: '' }
  : { page: 0, size: 20, q: '', status: view === 'mine' ? 'REGISTERED' : '', sort: 'registeredAt,desc', host: '' }
 const [filters, setFilters] = useListQuery(defaults, {
  sorts: sorts.map((option) => option.value),
  choices: { status: ['REGISTERED', 'CANCELLED', 'ATTENDED'] },
 })
 const { selected, open, close } = useDialogSelection()
 const params = queryParams({ ...filters, status: ownView ? filters.status : 'OPEN', q: ownView ? undefined : filters.q, hostUnitId: ownView || !filters.host ? undefined : filters.host })
 const result = useQuery({
  queryKey: ['portal-events', view, params],
  placeholderData: keepPreviousData,
  queryFn: ({ signal }) => api.request<Page<CampusEvent | Registration>>((ownView ? ownPath : eventPath) + '?' + params, { signal }),
  select: (value) => ({ ...value, totalElements: safePageTotal(value.totalElements) }),
 })
 const hosts = useQuery({
  queryKey: ['portal-event-hosts'],
  enabled: view === 'upcoming',
  staleTime: 10 * 60_000,
  queryFn: ({ signal }) => api.request<EventHost[]>(eventPath + '/hosts', { signal }),
 })
 const hostNameById = new Map((hosts.data ?? []).map((host) => [host.id, host.name]))
 // One cached read of own registrations supplies the "already registered" badge on catalog cards.
 const memberships = useQuery({
  queryKey: ['portal-own-registrations'],
  enabled: view === 'upcoming',
  retry: false,
  queryFn: async ({ signal }) => (await api.request<Page<Registration>>(ownPath + '?' + queryParams({ page: 0, size: 100, sort: 'registeredAt,desc' }), { signal })).content,
 })
 const membershipByEvent = new Map((memberships.data ?? []).map((registration) => [registration.eventId, registration]))
 const changeView = (next: string) => navigate(next === 'upcoming' ? '/portal/events' : '/portal/events?view=' + next)
 const statuses = ['REGISTERED', 'CANCELLED', 'ATTENDED']
 const records = result.data?.content ?? []
 const eventGroups = groupByHost(records as CampusEvent[], hostNameById)
 return <>
  <div className="page-heading"><div><Typography.Title level={1}>{heading[view]}</Typography.Title>
   <Typography.Paragraph type="secondary">{introduction[view]}</Typography.Paragraph></div></div>
  <Tabs className="portal-event-tabs" activeKey={view} onChange={changeView} items={[
   { key: 'upcoming', label: 'Đang mở' },
   { key: 'mine', label: 'Đã đăng ký' },
   { key: 'history', label: 'Lịch sử' },
  ]} />
  <Space wrap className="list-filters">
   {!ownView && <Input.Search aria-label="Tìm sự kiện" maxLength={100} placeholder="Tìm mã hoặc tên sự kiện" allowClear defaultValue={filters.q} onSearch={(q) => setFilters({ ...filters, q, page: 0 })} style={{ width: 260 }} />}
   {!ownView && <Select aria-label="Lọc theo khoa" value={filters.host} onChange={(host) => setFilters({ ...filters, host, page: 0 })} style={{ minWidth: 240 }}
    options={[{ value: '', label: 'Tất cả khoa' }, ...(hosts.data ?? []).map((host) => ({ value: host.id, label: host.name }))]} />}
   {view === 'history' && <Select aria-label="Lọc trạng thái sự kiện" value={filters.status} onChange={(status) => setFilters({ ...filters, status, page: 0 })}
    options={[{ value: '', label: 'Tất cả trạng thái' }, ...statuses.map((value) => ({ value, label: states[value as keyof typeof states] }))]} style={{ minWidth: 180 }} />}
   <Select aria-label="Sắp xếp sự kiện" value={filters.sort} onChange={(sort) => setFilters({ ...filters, sort, page: 0 })}
    options={sorts} style={{ minWidth: 180 }} />
  </Space>
  {result.isFetching && <p role="status">Đang tải sự kiện…</p>}
  {unlinked(result.error) ? <LinkNotice /> : result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  {!result.isFetching && !result.error && records.length === 0 && <Card><Empty description={emptyText[view]} /></Card>}
  {!result.error && !ownView && eventGroups.map((group) => <section className="event-host-group" key={group.key}>
   <header className="event-host-head"><strong>{group.label}</strong><span>{group.events.length} sự kiện</span></header>
   <div className="portal-event-grid">
    {group.events.map((event) => <CatalogCard key={event.id} event={event} hostName={event.hostUnitId ? hostNameById.get(event.hostUnitId) : undefined}
     registration={membershipByEvent.get(event.id) ?? null} onOpen={open} />)}
   </div>
  </section>)}
  {!result.error && ownView && <div className="portal-event-grid">
   {(records as Registration[]).map((registration) => <RegistrationCard key={registration.id} registration={registration} onOpen={open} />)}
  </div>}
  <Pagination aria-label="Trang sự kiện" current={filters.page + 1} pageSize={filters.size} total={result.data?.totalElements ?? 0}
   showSizeChanger pageSizeOptions={[10, 20, 50, 100]} onChange={(page, size) => setFilters({ ...filters, page: page - 1, size })} />
  {selected && <EventDetail key={selected} id={selected} onClose={close} />}
 </>
}
function CatalogCard({ event, hostName, registration, onOpen }: { event: CampusEvent; hostName?: string; registration: Registration | null; onOpen: (id: string, element: HTMLElement) => void }) {
 return <Card className="portal-event-card">
  <div className="event-card-body">
   <EventDate value={event.startsAt} />
   <div className="event-card-main">
    <div className="event-card-top">
     <Tag color={event.status === 'OPEN' ? 'purple' : 'default'}>{states[event.status]}</Tag>
     {hostName && <Tag color="cyan">{hostName}</Tag>}
     <OwnBadge registration={registration} />
     <Typography.Text type="secondary">{event.code}</Typography.Text>
    </div>
    <Typography.Title level={2} className="event-card-title">{event.title}</Typography.Title>
    {event.description && <Typography.Paragraph type="secondary" className="event-card-description"
     ellipsis={{ rows: 2, tooltip: event.description }}>{event.description}</Typography.Paragraph>}
    <Space size={18} wrap className="event-card-meta">
     <span><ClockCircleOutlined aria-hidden="true" /> {clock(event.startsAt)} – {clock(event.endsAt)} (UTC+7)</span>
     <span><TeamOutlined aria-hidden="true" /> Sức chứa {event.capacity}</span>
    </Space>
   </div>
  </div>
  <div className="event-card-foot">
   <Typography.Text type="secondary">Bắt đầu: <CampusTime value={event.startsAt} /></Typography.Text>
   <Button onClick={(click) => onOpen(event.id, click.currentTarget)}>Xem sự kiện</Button>
  </div>
 </Card>
}
function RegistrationCard({ registration, onOpen }: { registration: Registration; onOpen: (id: string, element: HTMLElement) => void }) {
 const event = useEvent(registration.eventId)
 return <Card className="portal-event-card">
  <div className="event-card-body">
   <EventDate value={event.data?.startsAt ?? registration.registeredAt} />
   <div className="event-card-main">
    <div className="event-card-top">
     <Tag color={registration.status === 'REGISTERED' ? 'green' : registration.status === 'ATTENDED' ? 'blue' : 'default'}>{states[registration.status]}</Tag>
     {event.data && <Typography.Text type="secondary">{event.data.code}</Typography.Text>}
    </div>
    <Typography.Title level={2} className="event-card-title">{event.data?.title ?? (event.isFetching ? 'Đang tải tên sự kiện…' : 'Sự kiện ' + registration.eventId)}</Typography.Title>
    <div className="event-card-timeline">
     <Typography.Paragraph>Đăng ký lúc: <CampusTime value={registration.registeredAt} /></Typography.Paragraph>
     {registration.cancelledAt && <Typography.Paragraph>Hủy lúc: <CampusTime value={registration.cancelledAt} /></Typography.Paragraph>}
     {registration.attendedAt && <Typography.Paragraph>Tham dự lúc: <CampusTime value={registration.attendedAt} /></Typography.Paragraph>}
    </div>
   </div>
  </div>
  <div className="event-card-foot">
   {event.data && <Typography.Text type="secondary">Bắt đầu: <CampusTime value={event.data.startsAt} /></Typography.Text>}
   <Button onClick={(click) => onOpen(registration.eventId, click.currentTarget)}>Xem sự kiện</Button>
  </div>
 </Card>
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
   await Promise.all([queryClient.invalidateQueries({ queryKey: ['portal-events'] }), queryClient.invalidateQueries({ queryKey: ['portal-own-registrations'] }), queryClient.invalidateQueries({ queryKey: ['portal-own-registration', id] })])
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
  {!event.error && event.data && <>
   <div className="event-detail-hero">
    <EventDate value={event.data.startsAt} />
    <div><Typography.Title level={2}>{event.data.title}</Typography.Title>
     <Space wrap><Tag color={event.data.status === 'OPEN' ? 'purple' : 'default'}>{states[event.data.status]}</Tag>
      <Typography.Text type="secondary">{event.data.code}</Typography.Text></Space></div>
   </div>
   <div className="event-detail-facts">
    <div><span className="fact-label">Bắt đầu</span><CampusTime value={event.data.startsAt} /></div>
    <div><span className="fact-label">Kết thúc</span><CampusTime value={event.data.endsAt} /></div>
    <div><span className="fact-label">Sức chứa</span>{event.data.capacity} chỗ<span className="fact-note">Số chỗ còn lại được máy chủ kiểm tra khi đăng ký.</span></div>
   </div>
   <Typography.Paragraph className="event-detail-description">{event.data.description}</Typography.Paragraph>
  </>}
  {membership.data && <div className="event-membership">
   <Space wrap><Typography.Text strong>Đăng ký của bạn</Typography.Text><OwnBadge registration={membership.data} /></Space>
   <Typography.Paragraph>Đăng ký lúc: <CampusTime value={membership.data.registeredAt} /></Typography.Paragraph>
   {membership.data.cancelledAt && <Typography.Paragraph>Hủy lúc: <CampusTime value={membership.data.cancelledAt} /></Typography.Paragraph>}
   {membership.data.attendedAt && <Typography.Paragraph>Tham dự lúc: <CampusTime value={membership.data.attendedAt} /></Typography.Paragraph>}
  </div>}
 </Modal>
}
