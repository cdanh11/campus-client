import { NavLink as Link, Route, Routes } from 'react-router-dom'
import { RegistryPage } from '../people/RegistryPage'
import { academicResources } from './resources'
import { PageChrome, EmptyState } from '../../components/PageChrome'
export default function AdminAcademic() {
 return <><nav className="admin-navigation" aria-label="Quản trị học vụ">
  {Object.entries(academicResources).map(([key, value]) => <Link key={key} to={'/admin/academic/' + key}>{value.title}</Link>)}
 </nav><Routes>
  {Object.entries(academicResources).map(([key, value]) => <Route key={key} path={key} element={<RegistryPage key={value.path} resource={value} />} />)}
  <Route index element={<PageChrome eyebrow="VẬN HÀNH HỌC VỤ" title="Học vụ" description="Quản lý cấu trúc đào tạo, học kỳ và các hoạt động ghi danh."><EmptyState title="Chọn một khu vực học vụ" description="Sử dụng thanh điều hướng phía trên để mở danh mục bạn cần quản lý." /></PageChrome>} />
  <Route path="*" element={<PageChrome eyebrow="VẬN HÀNH HỌC VỤ" title="Không tìm thấy trang học vụ" description="Kiểm tra lại đường dẫn hoặc quay lại danh mục học vụ."><EmptyState title="Đường dẫn không hợp lệ" description="Trang bạn tìm không nằm trong không gian học vụ." /></PageChrome>} />
 </Routes></>
}
