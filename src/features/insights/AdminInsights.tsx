import { NavLink as Link, Navigate, Route, Routes } from 'react-router-dom'
import type { User } from '../../api/client'
import { administrationRoles, canAdminister } from '../../api/administration'
import { AccessBoundary } from '../../components/AccessBoundary'
import { DashboardPage } from './DashboardPage'
import { ReportsPage } from './ReportPage'
import { AuditsPage } from './AuditPage'
import { PageChrome, EmptyState } from '../../components/PageChrome'
export default function AdminInsights({ user }: { user: User }) {
 const reports = canAdminister(user, 'reporting')
 const audit = canAdminister(user, 'audit')
 return <><nav className="admin-navigation" aria-label="Audit và báo cáo">
  {reports && <><Link to="/admin/insights/dashboard">Dashboard</Link><Link to="/admin/insights/reports">Báo cáo</Link></>}
  {audit && <Link to="/admin/insights/audits">Audit</Link>}
 </nav><Routes>
  <Route path="dashboard" element={<AccessBoundary user={user} roles={administrationRoles.reporting}><DashboardPage /></AccessBoundary>} />
  <Route path="reports" element={<AccessBoundary user={user} roles={administrationRoles.reporting}><ReportsPage /></AccessBoundary>} />
  <Route path="audits" element={<AccessBoundary user={user} roles={administrationRoles.audit}><AuditsPage /></AccessBoundary>} />
  <Route index element={reports || audit ? <Navigate to={reports ? 'dashboard' : 'audits'} replace /> : <PageChrome eyebrow="CAMPUS INTELLIGENCE" title="Insights & báo cáo" description="Đọc tín hiệu vận hành, báo cáo và audit trail từ cùng một trung tâm dữ liệu."><AccessBoundary user={user} roles={administrationRoles.reporting}>{null}</AccessBoundary></PageChrome>} />
  <Route path="*" element={<PageChrome eyebrow="CAMPUS INTELLIGENCE" title="Không tìm thấy trang insights" description="Kiểm tra lại đường dẫn hoặc quay lại khu vực báo cáo."><EmptyState title="Đường dẫn không hợp lệ" description="Trang bạn tìm không nằm trong không gian insights." /></PageChrome>} />
 </Routes></>
}
