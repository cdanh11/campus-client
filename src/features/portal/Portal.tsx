import { Navigate, Route, Routes } from 'react-router-dom'
import InboxPage from './InboxPage'
import EventsPage from './EventsPage'
import PortalHome from './PortalHome'
import TimetablePage from './TimetablePage'
import CoursesPage from './CoursesPage'
import ResultsPage from './ResultsPage'
import FinancePage from './FinancePage'
import ProfilePage from './ProfilePage'
import { PageChrome, EmptyState } from '../../components/PageChrome'
export default function Portal() {
 return <Routes><Route index element={<Navigate to="overview" replace />} /><Route path="overview" element={<PortalHome />} />
  <Route path="timetable" element={<TimetablePage />} /><Route path="courses" element={<CoursesPage />} /><Route path="results" element={<ResultsPage />} /><Route path="finance" element={<FinancePage />} />
  <Route path="inbox" element={<InboxPage />} /><Route path="events" element={<EventsPage />} /><Route path="registrations" element={<Navigate to="/portal/events?view=mine" replace />} />
  <Route path="profile" element={<ProfilePage />} />
  <Route path="*" element={<PageChrome eyebrow="KHÔNG GIAN CÁ NHÂN" title="Không tìm thấy trang" description="Kiểm tra lại đường dẫn hoặc quay về tổng quan của bạn."><EmptyState title="Đường dẫn không hợp lệ" description="Trang bạn tìm không nằm trong cổng cá nhân." /></PageChrome>} />
 </Routes>
}
