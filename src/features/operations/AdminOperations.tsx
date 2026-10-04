import { Link, Route, Routes } from 'react-router-dom'
import { RegistryPage } from '../people/RegistryPage'
import { operationResources } from './resources'
import { PaymentsPage } from './PaymentsPage'
export default function AdminOperations() {
 return <><nav className="admin-navigation" aria-label="Ký túc xá và tài chính">
  {Object.entries(operationResources).map(([key, value]) => <Link key={key} to={'/admin/operations/' + key}>{value.title}</Link>)}
  <Link to="/admin/operations/payments">Biên nhận thanh toán</Link>
 </nav><Routes>
  {Object.entries(operationResources).map(([key, value]) => <Route key={key} path={key} element={<RegistryPage key={value.path} resource={value} />} />)}
  <Route path="payments" element={<PaymentsPage />} /><Route index element={<p>Chọn quản lý ký túc xá hoặc tài chính.</p>} />
  <Route path="*" element={<p>Không tìm thấy trang.</p>} />
 </Routes></>
}
