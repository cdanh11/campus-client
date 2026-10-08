import { NavLink as Link, Route, Routes } from 'react-router-dom'
import type { User } from '../../api/client'
import { administrationRoles, canAdminister, type AdministrationArea } from '../../api/administration'
import { AccessBoundary } from '../../components/AccessBoundary'
import { RegistryPage } from '../people/RegistryPage'
import { operationResources } from './resources'
import { PaymentsPage } from './PaymentsPage'
import { PageChrome, EmptyState } from '../../components/PageChrome'
const area = (path: string): AdministrationArea => path.includes('/dormitory/') ? 'dormitory' : 'finance'
export default function AdminOperations({ user }: { user: User }) {
 return <PageChrome eyebrow="DỊCH VỤ KHUÔN VIÊN" title="Ký túc xá & tài chính" description="Theo dõi nguồn lực, nơi ở và các giao dịch trong một không gian vận hành rõ ràng."><nav className="admin-navigation" aria-label="Ký túc xá và tài chính">
  {Object.entries(operationResources).filter(([, value]) => canAdminister(user, area(value.path))).map(([key, value]) => <Link key={key} to={'/admin/operations/' + key}>{value.title}</Link>)}
  {canAdminister(user, 'finance') && <Link to="/admin/operations/payments">Biên nhận thanh toán</Link>}
 </nav><Routes>
  {Object.entries(operationResources).map(([key, value]) => <Route key={key} path={key} element={<AccessBoundary user={user} roles={administrationRoles[area(value.path)]}><RegistryPage key={value.path} resource={value} /></AccessBoundary>} />)}
  <Route path="payments" element={<AccessBoundary user={user} roles={administrationRoles.finance}><PaymentsPage /></AccessBoundary>} /><Route index element={<EmptyState title="Chọn một khu vực vận hành" description="Mở ký túc xá, tài chính hoặc biên nhận thanh toán từ thanh điều hướng." />} />
  <Route path="*" element={<EmptyState title="Không tìm thấy trang" description="Kiểm tra lại đường dẫn trong không gian vận hành." />} />
 </Routes></PageChrome>
}
