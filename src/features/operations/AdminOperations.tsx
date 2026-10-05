import { NavLink as Link, Route, Routes } from 'react-router-dom'
import type { User } from '../../api/client'
import { administrationRoles, canAdminister, type AdministrationArea } from '../../api/administration'
import { AccessBoundary } from '../../components/AccessBoundary'
import { RegistryPage } from '../people/RegistryPage'
import { operationResources } from './resources'
import { PaymentsPage } from './PaymentsPage'
const area = (path: string): AdministrationArea => path.includes('/dormitory/') ? 'dormitory' : 'finance'
export default function AdminOperations({ user }: { user: User }) {
 return <><nav className="admin-navigation" aria-label="Ký túc xá và tài chính">
  {Object.entries(operationResources).filter(([, value]) => canAdminister(user, area(value.path))).map(([key, value]) => <Link key={key} to={'/admin/operations/' + key}>{value.title}</Link>)}
  {canAdminister(user, 'finance') && <Link to="/admin/operations/payments">Biên nhận thanh toán</Link>}
 </nav><Routes>
  {Object.entries(operationResources).map(([key, value]) => <Route key={key} path={key} element={<AccessBoundary user={user} roles={administrationRoles[area(value.path)]}><RegistryPage key={value.path} resource={value} /></AccessBoundary>} />)}
  <Route path="payments" element={<AccessBoundary user={user} roles={administrationRoles.finance}><PaymentsPage /></AccessBoundary>} /><Route index element={<p>Chọn quản lý ký túc xá hoặc tài chính.</p>} />
  <Route path="*" element={<p>Không tìm thấy trang.</p>} />
 </Routes></>
}
