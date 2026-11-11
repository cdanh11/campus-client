import { useEffect, useRef, useState } from 'react'
import { Badge, Button } from 'antd'
import { BellOutlined } from '@ant-design/icons'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/runtime'
import { queryParams, safePageTotal } from '../api/query-params'
import { campusDateText } from './CampusTime'

type BellItem = { title: string; delivery: { id: string; status: string; deliveredAt: string } }
type BellPage = { content: BellItem[]; totalElements: number | bigint }
const path = '/api/v1/notifications'

export default function NotificationBell() {
 const navigate = useNavigate()
 const [open, setOpen] = useState(false)
 const wrap = useRef<HTMLDivElement>(null)
 const result = useQuery({
  queryKey: ['inbox', 'bell'],
  queryFn: ({ signal }) => api.request<BellPage>(path + '?' + queryParams({ page: 0, size: 5, status: 'UNREAD', sort: 'deliveredAt,desc' }), { signal }),
 })
 const items = result.data?.content ?? []
 const unread = result.data ? safePageTotal(result.data.totalElements) : 0

 useEffect(() => {
  if (!open) return
  const onPointerDown = (event: MouseEvent) => {
   if (!wrap.current?.contains(event.target as Node)) setOpen(false)
  }
  const onKeyDown = (event: KeyboardEvent) => {
   if (event.key !== 'Escape') return
   setOpen(false)
   wrap.current?.querySelector('button')?.focus()
  }
  document.addEventListener('mousedown', onPointerDown)
  document.addEventListener('keydown', onKeyDown)
  return () => {
   document.removeEventListener('mousedown', onPointerDown)
   document.removeEventListener('keydown', onKeyDown)
  }
 }, [open])

 const openInbox = () => {
  setOpen(false)
  navigate('/portal/inbox')
 }

 return <div className="notification-bell-wrap" ref={wrap}>
  <Badge count={unread} size="small" offset={[-4, 4]}>
   <Button className={open ? 'notification-bell is-open' : 'notification-bell'} type="text"
    aria-label={unread ? `Thông báo, ${unread} chưa đọc` : 'Thông báo'} aria-haspopup="dialog" aria-expanded={open}
    icon={<BellOutlined aria-hidden="true" />} onClick={() => setOpen((value) => !value)} />
  </Badge>
  {open && <div className="notification-popover" role="dialog" aria-label="Thông báo mới">
   <header className="notification-popover-head">
    <div><strong>Thông báo mới</strong><span>{unread ? `${unread} chưa đọc` : 'Bạn đã đọc tất cả'}</span></div>
    <Button type="link" size="small" onClick={openInbox}>Hộp thư</Button>
   </header>
   <div className="notification-popover-body">
    {result.isFetching && !result.data && <p className="notification-state" role="status">Đang tải thông báo…</p>}
    {result.error && <p className="notification-state">Chưa tải được thông báo.</p>}
    {!result.isFetching && !result.error && items.length === 0 && <p className="notification-state">Không có thông báo mới.</p>}
    {items.map((item) => <button type="button" className="bell-item" key={item.delivery.id} onClick={openInbox}>
     <span className="bell-item-dot" aria-hidden="true" />
     <span className="bell-item-copy">
      <span className="bell-item-title">{item.title}</span>
      <span className="bell-item-time">{campusDateText(item.delivery.deliveredAt)}</span>
     </span>
    </button>)}
   </div>
   <footer className="notification-popover-foot">
    <Button size="small" block onClick={openInbox}>Xem tất cả thông báo</Button>
   </footer>
  </div>}
 </div>
}
