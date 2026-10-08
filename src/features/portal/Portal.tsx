import { Card, Typography } from 'antd'
import { BellOutlined, CalendarOutlined, FileTextOutlined } from '@ant-design/icons'
import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import InboxPage from './InboxPage'
import EventsPage from './EventsPage'
export default function Portal() {
 return <><section className="page-heading portal-heading"><div><Typography.Text className="section-kicker">KHÔNG GIAN CÁ NHÂN</Typography.Text><Typography.Title level={1}>Cổng cá nhân</Typography.Title><Typography.Paragraph type="secondary">Một nơi để theo dõi những điều đang diễn ra quanh bạn.</Typography.Paragraph></div><div className="portal-heading-art" aria-hidden="true"><BellOutlined /><CalendarOutlined /><FileTextOutlined /></div></section><div className="portal-summary-grid"><Card bordered={false}><BellOutlined /><div><Typography.Text type="secondary">Thông báo mới</Typography.Text><Typography.Title level={3}>Hộp thư</Typography.Title></div></Card><Card bordered={false}><CalendarOutlined /><div><Typography.Text type="secondary">Khám phá hôm nay</Typography.Text><Typography.Title level={3}>Sự kiện</Typography.Title></div></Card><Card bordered={false}><FileTextOutlined /><div><Typography.Text type="secondary">Theo dõi của bạn</Typography.Text><Typography.Title level={3}>Đăng ký</Typography.Title></div></Card></div><nav className="admin-navigation" aria-label="Cổng cá nhân"><NavLink to="/portal/inbox">Hộp thư</NavLink><NavLink to="/portal/events">Sự kiện</NavLink><NavLink to="/portal/registrations">Đăng ký của bạn</NavLink></nav>
  <Routes><Route index element={<Navigate to="inbox" replace />} /><Route path="inbox" element={<InboxPage />} /><Route path="events" element={<EventsPage />} /><Route path="registrations" element={<EventsPage key="history" history />} /><Route path="*" element={<p>Không tìm thấy trang.</p>} /></Routes>
 </>
}
