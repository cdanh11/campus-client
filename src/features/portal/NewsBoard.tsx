import { Card, Empty, Tag, Typography } from 'antd'
import { ArrowRightOutlined, NotificationOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../../api/runtime'
import { queryParams } from '../../api/query-params'
import { campusDateText } from '../../components/CampusTime'
import { ErrorNotice } from '../../components/ErrorNotice'
import type { InboxItem } from './InboxPage'

const path = '/api/v1/notifications'

export default function NewsBoard() {
 const result = useQuery({
  queryKey: ['inbox', 'news'],
  queryFn: ({ signal }) => api.request<{ content: InboxItem[] }>(path + '?' + queryParams({ page: 0, size: 5, sort: 'deliveredAt,desc' }), { signal }),
 })
 const [featured, ...rest] = result.data?.content ?? []
 return <section className="news-board" aria-labelledby="campus-news-title">
  <div className="news-board-header">
   <div>
    <Typography.Text className="section-kicker">BẢN TIN KHUÔN VIÊN</Typography.Text>
    <Typography.Title level={2} id="campus-news-title">Thông báo mới</Typography.Title>
   </div>
   <Link className="text-action" to="/portal/inbox">Tất cả thông báo <ArrowRightOutlined aria-hidden="true" /></Link>
  </div>
  {result.isFetching && <p role="status">Đang tải thông báo…</p>}
  {result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  {!result.isFetching && !result.error && !featured && <Card><Empty description="Chưa có thông báo nào cho tài khoản này." /></Card>}
  {!result.error && featured && <div className={'news-layout' + (rest.length ? '' : ' single')}>
   <Link className="news-feature" to="/portal/inbox">
    <span className="news-feature-flag"><NotificationOutlined aria-hidden="true" /> BẢN TIN</span>
    <Typography.Title level={3}>{featured.title}</Typography.Title>
    <Typography.Paragraph ellipsis={{ rows: 3 }}>{featured.body}</Typography.Paragraph>
    <span className="news-feature-meta">
     <Tag color={featured.delivery.status === 'UNREAD' ? 'cyan' : 'default'}>{featured.delivery.status === 'UNREAD' ? 'Chưa đọc' : 'Đã đọc'}</Tag>
     {campusDateText(featured.delivery.deliveredAt)}
    </span>
   </Link>
   {rest.length > 0 && <ul className="news-list">
    {rest.map((item) => <li key={item.delivery.id}>
     <Link to="/portal/inbox">
      <span className={'news-dot' + (item.delivery.status === 'UNREAD' ? ' unread' : '')} aria-hidden="true" />
      <span className="news-item-copy">
       <span className="news-item-title">{item.title}</span>
       <span className="news-item-date">{campusDateText(item.delivery.deliveredAt)}</span>
      </span>
      <ArrowRightOutlined className="news-arrow" aria-hidden="true" />
     </Link>
    </li>)}
   </ul>}
  </div>}
 </section>
}
