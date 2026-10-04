import { Link, Route, Routes } from 'react-router-dom'
import { RegistryPage } from '../people/RegistryPage'
import { events, registrations } from './resources'
export default function AdminEvents() {
 return <><nav className="admin-navigation" aria-label="Quản trị sự kiện"><Link to="/admin/events/catalog">Danh mục sự kiện</Link><Link to="/admin/events/registrations">Đăng ký sự kiện</Link></nav><Routes>
  <Route path="catalog" element={<RegistryPage key={events.path} resource={events} />} /><Route path="registrations" element={<RegistryPage key={registrations.path} resource={registrations} />} />
  <Route index element={<p>Chọn danh mục hoặc đăng ký sự kiện.</p>} /><Route path="*" element={<p>Không tìm thấy trang.</p>} />
 </Routes></>
}
