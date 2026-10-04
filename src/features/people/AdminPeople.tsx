import { lazy, Suspense } from 'react'
import { Card, Space, Typography } from 'antd'
import { Link, Route, Routes } from 'react-router-dom'
import { UserPage } from './UserPage'
import { RegistryPage } from './RegistryPage'
import { resources } from './resources'

const AdminAcademic = lazy(() => import('../academic/AdminAcademic'))
const AdminInsights = lazy(() => import('../insights/AdminInsights'))
const AdminLibrary = lazy(() => import('../library/AdminLibrary'))
const AdminEvents = lazy(() => import('../events/AdminEvents'))
const AdminNotifications = lazy(() => import('../notifications/AdminNotifications'))
const AdminOperations = lazy(() => import('../operations/AdminOperations'))
export default function AdminPeople() {
 return <>
  <nav className="admin-navigation" aria-label="Quản trị hồ sơ">
   <Link to="/admin">Tổng quan</Link><Link to="/admin/users">Tài khoản</Link><Link to="/admin/organizations">Đơn vị</Link>
   <Link to="/admin/students">Sinh viên</Link><Link to="/admin/personnel">Giảng viên & nhân sự</Link><Link to="/admin/academic">Học vụ</Link><Link to="/admin/operations">Ký túc xá & tài chính</Link><Link to="/admin/notifications">Thông báo</Link><Link to="/admin/events">Sự kiện</Link><Link to="/admin/library">Thư viện</Link><Link to="/admin/insights">Audit & báo cáo</Link>
  </nav>
  <Routes>
   <Route index element={<><Typography.Title level={1}>Không gian quản trị</Typography.Title><Typography.Paragraph>Chọn nhóm hồ sơ cần quản lý.</Typography.Paragraph><Space wrap>
    {Object.entries(resources).map(([key, resource]) => <Card key={key} title={resource.title}><Link to={'/admin/' + key}>Mở danh sách</Link></Card>)}
   </Space></>} />
   <Route path="insights/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><AdminInsights /></Suspense>} />
   <Route path="library/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><AdminLibrary /></Suspense>} />
   <Route path="events/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><AdminEvents /></Suspense>} />
   <Route path="notifications/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><AdminNotifications /></Suspense>} />
   <Route path="operations/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><AdminOperations /></Suspense>} />
   <Route path="academic/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><AdminAcademic /></Suspense>} />
   <Route path="users" element={<UserPage />} />
   <Route path="organizations" element={<RegistryPage key={resources.organizations.path} resource={resources.organizations} />} />
   <Route path="students" element={<RegistryPage key={resources.students.path} resource={resources.students} />} />
   <Route path="personnel" element={<RegistryPage key={resources.personnel.path} resource={resources.personnel} />} />
   <Route path="*" element={<Typography.Title level={2}>Không tìm thấy trang quản trị</Typography.Title>} />
  </Routes>
 </>
}
