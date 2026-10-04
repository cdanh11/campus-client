import { Link, Route, Routes } from 'react-router-dom'
import { RegistryPage } from '../people/RegistryPage'
import { titles, copies, loans } from './resources'
export default function AdminLibrary() {
 return <><nav className="admin-navigation" aria-label="Quản trị thư viện"><Link to="/admin/library/titles">Đầu sách</Link><Link to="/admin/library/copies">Bản sao sách</Link><Link to="/admin/library/loans">Mượn và trả sách</Link></nav><Routes>
  <Route path="titles" element={<RegistryPage key={titles.path} resource={titles} />} /><Route path="copies" element={<RegistryPage key={copies.path} resource={copies} />} /><Route path="loans" element={<RegistryPage key={loans.path} resource={loans} />} />
  <Route index element={<p>Chọn danh mục hoặc lịch sử mượn sách.</p>} /><Route path="*" element={<p>Không tìm thấy trang.</p>} />
 </Routes></>
}
