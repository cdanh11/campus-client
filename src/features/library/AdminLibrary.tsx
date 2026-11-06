import { NavLink as Link, Route, Routes } from 'react-router-dom'
import { RegistryPage } from '../people/RegistryPage'
import { titles, copies, loans } from './resources'
import { PageChrome, EmptyState } from '../../components/PageChrome'
export default function AdminLibrary() {
 return <><nav className="admin-navigation" aria-label="Quản trị thư viện"><Link to="/admin/library/titles">Đầu sách</Link><Link to="/admin/library/copies">Bản sao sách</Link><Link to="/admin/library/loans">Mượn và trả sách</Link></nav><Routes>
  <Route path="titles" element={<RegistryPage key={titles.path} resource={titles} />} /><Route path="copies" element={<RegistryPage key={copies.path} resource={copies} />} /><Route path="loans" element={<RegistryPage key={loans.path} resource={loans} />} />
  <Route index element={<PageChrome eyebrow="LEARNING SERVICES" title="Thư viện" description="Quản lý đầu sách, bản sao và vòng đời mượn trả với dữ liệu rõ ràng."><EmptyState title="Chọn một danh mục thư viện" description="Mở đầu sách, bản sao hoặc lịch sử mượn trả từ thanh điều hướng phía trên." /></PageChrome>} />
  <Route path="*" element={<PageChrome eyebrow="LEARNING SERVICES" title="Không tìm thấy trang thư viện" description="Kiểm tra lại đường dẫn hoặc quay lại danh mục thư viện."><EmptyState title="Đường dẫn không hợp lệ" description="Trang bạn tìm không nằm trong không gian thư viện." /></PageChrome>} />
 </Routes></>
}
