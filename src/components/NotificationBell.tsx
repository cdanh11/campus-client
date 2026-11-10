import { Badge, Button, Dropdown, Empty } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/runtime'
import { queryParams, safePageTotal } from '../api/query-params'
import { campusDateText } from './CampusTime'
import type { MenuProps } from 'antd'

type BellItem = { title: string; delivery: { id: string; status: string; deliveredAt: string } }
type BellPage = { content: BellItem[]; totalElements: number | bigint }
const path = '/api/v1/notifications'

export default function NotificationBell() {
 const navigate = useNavigate()
 const result = useQuery({
  queryKey: ['inbox', 'bell'],
  queryFn: ({ signal }) => api.request<BellPage>(path + '?' + queryParams({ page: 0, size: 5, status: 'UNREAD', sort: 'deliveredAt,desc' }), { signal }),
 })
 const items = result.data?.content ?? []
 const unread = result.data ? safePageTotal(result.data.totalElements) : 0
 const menu: MenuProps = {
  items: result.error
   ? [{ key: 'error', label: 'Chưa tải được thông báo', disabled: true }]
   : items.length
    ? [
     ...items.map((item) => ({
      key: item.delivery.id,
      label: <div className="bell-item"><span className="bell-item-title">{item.title}</span><span className="bell-item-time">{campusDateText(item.delivery.deliveredAt)}</span></div>,
     })),
     { type: 'divider' as const, key: 'divider' },
     { key: 'all', label: 'Mở hộp thư' },
    ]
    : [{ key: 'empty', label: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có thông báo mới" />, disabled: true }],
  onClick: () => navigate('/portal/inbox'),
 }
 return <Dropdown menu={menu} trigger={['click']} placement="bottomRight" arrow>
  <Badge count={unread} size="small" offset={[-4, 4]}>
   <Button className="notification-bell" type="text" aria-label={unread ? `Thông báo, ${unread} chưa đọc` : 'Thông báo'} icon={<BellOutlined aria-hidden="true" />} />
  </Badge>
 </Dropdown>
}
