import { Link, Route, Routes } from 'react-router-dom'
import { RegistryPage } from '../people/RegistryPage'
import { academicResources } from './resources'
export default function AdminAcademic() {
 return <><nav className="admin-navigation" aria-label="Quản trị học vụ">
  {Object.entries(academicResources).map(([key, value]) => <Link key={key} to={'/admin/academic/' + key}>{value.title}</Link>)}
 </nav><Routes>
  {Object.entries(academicResources).map(([key, value]) => <Route key={key} path={key} element={<RegistryPage key={value.path} resource={value} />} />)}
  <Route index element={<p>Chọn danh mục, học kỳ hoặc hoạt động ghi danh.</p>} />
  <Route path="*" element={<p>Không tìm thấy trang học vụ.</p>} />
 </Routes></>
}
