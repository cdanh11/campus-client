import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import InboxPage from './InboxPage'
import EventsPage from './EventsPage'
export default function Portal() {
 return <><nav className="admin-navigation" aria-label="Cổng cá nhân"><NavLink to="/portal/inbox">Hộp thư</NavLink><NavLink to="/portal/events">Sự kiện</NavLink><NavLink to="/portal/registrations">Đăng ký của bạn</NavLink></nav>
  <Routes><Route index element={<Navigate to="inbox" replace />} /><Route path="inbox" element={<InboxPage />} /><Route path="events" element={<EventsPage />} /><Route path="registrations" element={<EventsPage key="history" history />} /><Route path="*" element={<p>Không tìm thấy trang.</p>} /></Routes>
 </>
}
