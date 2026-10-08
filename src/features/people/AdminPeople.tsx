import { lazy, Suspense, type ReactNode } from 'react'
import { Card, Typography } from 'antd'
import { Link, Route, Routes } from 'react-router-dom'
import { UserPage } from './UserPage'
import { RegistryPage } from './RegistryPage'
import { resources } from './resources'
import type { User } from '../../api/client'
import { administrationDestinations, administrationRoles, canAdminister, type AdministrationArea } from '../../api/administration'
import { AccessBoundary } from '../../components/AccessBoundary'
import { PageChrome, EmptyState } from '../../components/PageChrome'

const AdminAcademic = lazy(() => import('../academic/AdminAcademic'))
const AdminInsights = lazy(() => import('../insights/AdminInsights'))
const AdminLibrary = lazy(() => import('../library/AdminLibrary'))
const AdminEvents = lazy(() => import('../events/AdminEvents'))
const AdminNotifications = lazy(() => import('../notifications/AdminNotifications'))
const AdminOperations = lazy(() => import('../operations/AdminOperations'))
export default function AdminPeople({ user }: { user: User }) {
 const gate = (area: AdministrationArea, element: ReactNode) => <AccessBoundary user={user} roles={administrationRoles[area]}>{element}</AccessBoundary>
 return <PageChrome eyebrow="CAMPUS OPERATIONS" title="Không gian quản trị" description="Một bảng điều khiển thống nhất cho mọi nghiệp vụ vận hành trong trường.">
  <Routes>
   <Route index element={<><div className="overview-intro"><div><Typography.Title level={2}>Trung tâm điều phối</Typography.Title><Typography.Paragraph>Chọn một không gian để bắt đầu. Các module hiển thị theo quyền của tài khoản.</Typography.Paragraph></div><span className="overview-badge">{administrationDestinations.filter(({ area }) => canAdminister(user, area)).length} khu vực</span></div><div className="overview-grid">
    {administrationDestinations.filter(({ area }) => canAdminister(user, area)).map(({ area, path, title }) => <Card key={area} className="overview-card" title={<span>{title}</span>}><Link to={path}>Mở không gian <span aria-hidden="true">→</span></Link></Card>)}
   </div></>} />
   <Route path="insights/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><AdminInsights user={user} /></Suspense>} />
   <Route path="library/*" element={gate('library', <Suspense fallback={<p role="status">Đang tải…</p>}><AdminLibrary /></Suspense>)} />
   <Route path="events/*" element={gate('events', <Suspense fallback={<p role="status">Đang tải…</p>}><AdminEvents /></Suspense>)} />
   <Route path="notifications/*" element={gate('notifications', <Suspense fallback={<p role="status">Đang tải…</p>}><AdminNotifications /></Suspense>)} />
   <Route path="operations/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><AdminOperations user={user} /></Suspense>} />
   <Route path="academic/*" element={gate('academic', <Suspense fallback={<p role="status">Đang tải…</p>}><AdminAcademic /></Suspense>)} />
   <Route path="users" element={gate('users', <UserPage />)} />
   <Route path="organizations" element={gate('organizations', <RegistryPage key={resources.organizations.path} resource={resources.organizations} />)} />
   <Route path="students" element={gate('students', <RegistryPage key={resources.students.path} resource={resources.students} />)} />
   <Route path="personnel" element={gate('personnel', <RegistryPage key={resources.personnel.path} resource={resources.personnel} />)} />
   <Route path="*" element={<Typography.Title level={2}>Không tìm thấy trang quản trị</Typography.Title>} />
  </Routes>
 </PageChrome>
}
