import { Link, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './DashboardPage'
import { ReportsPage } from './ReportPage'
import { AuditsPage } from './AuditPage'
export default function AdminInsights() {
 return <><nav className="admin-navigation" aria-label="Audit và báo cáo"><Link to="/admin/insights/dashboard">Dashboard</Link><Link to="/admin/insights/reports">Báo cáo</Link><Link to="/admin/insights/audits">Audit</Link></nav><Routes>
  <Route path="dashboard" element={<DashboardPage />} /><Route path="reports" element={<ReportsPage />} /><Route path="audits" element={<AuditsPage />} />
  <Route index element={<DashboardPage />} /><Route path="*" element={<p>Không tìm thấy trang.</p>} />
 </Routes></>
}
