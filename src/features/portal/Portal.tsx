import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import InboxPage from './InboxPage'
import EventsPage from './EventsPage'
import PortalHome from './PortalHome'
import TimetablePage from './TimetablePage'
import CoursesPage from './CoursesPage'
import FinancePage from './FinancePage'
import { PageChrome, EmptyState } from '../../components/PageChrome'
export default function Portal() {
 return <><nav className="admin-navigation" aria-label="Cổng cá nhân">
  <NavLink to="/portal/overview">Tổng quan</NavLink>
  <NavLink to="/portal/timetable">Thời khóa biểu</NavLink>
  <NavLink to="/portal/courses">Môn học</NavLink>
  <NavLink to="/portal/finance">Học phí</NavLink>
  <NavLink to="/portal/inbox">Hộp thư</NavLink>
  <NavLink to="/portal/events">Sự kiện</NavLink>
  <NavLink to="/portal/registrations">Đăng ký của bạn</NavLink>
 </nav>
  <Routes><Route index element={<Navigate to="overview" replace />} /><Route path="overview" element={<PortalHome />} />
   <Route path="timetable" element={<TimetablePage />} /><Route path="courses" element={<CoursesPage />} /><Route path="finance" element={<FinancePage />} />
   <Route path="inbox" element={<InboxPage />} /><Route path="events" element={<EventsPage />} /><Route path="registrations" element={<EventsPage key="history" history />} />
   <Route path="*" element={<PageChrome eyebrow="KHÔNG GIAN CÁ NHÂN" title="Không tìm thấy trang" description="Kiểm tra lại đường dẫn hoặc quay về tổng quan của bạn."><EmptyState title="Đường dẫn không hợp lệ" description="Trang bạn tìm không nằm trong cổng cá nhân." /></PageChrome>} />
  </Routes>
 </>
}
