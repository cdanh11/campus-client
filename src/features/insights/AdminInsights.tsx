import { NavLink as Link, Navigate, Route, Routes } from 'react-router-dom'
import type { User } from '../../api/client'
import { administrationRoles, canAdminister } from '../../api/administration'
import { AccessBoundary } from '../../components/AccessBoundary'
import { DashboardPage } from './DashboardPage'
import { ReportsPage } from './ReportPage'
import { AuditsPage } from './AuditPage'
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
  <Route index element={reports || audit ? <Navigate to={reports ? 'dashboard' : 'audits'} replace /> : <AccessBoundary user={user} roles={administrationRoles.reporting}>{null}</AccessBoundary>} />
  <Route path="*" element={<p>Không tìm thấy trang.</p>} />
 </Routes></>
}
