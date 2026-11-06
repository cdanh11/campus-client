import { NavLink as Link, Navigate, Route, Routes } from 'react-router-dom'
import { RegistryPage } from '../people/RegistryPage'
import { events, registrations } from './resources'
import { PageChrome, EmptyState } from '../../components/PageChrome'
export default function AdminEvents() {
 return <><nav className="admin-navigation" aria-label="Quản trị sự kiện"><Link to="/admin/events/catalog">Danh mục sự kiện</Link><Link to="/admin/events/registrations">Đăng ký sự kiện</Link></nav><Routes>
  <Route path="catalog" element={<RegistryPage key={events.path} resource={events} />} /><Route path="registrations" element={<RegistryPage key={registrations.path} resource={registrations} />} />
  <Route index element={<Navigate to="catalog" replace />} />
  <Route path="*" element={<PageChrome eyebrow="CAMPUS PROGRAMS" title="Không tìm thấy trang sự kiện" description="Kiểm tra lại đường dẫn hoặc quay lại danh mục sự kiện."><EmptyState title="Đường dẫn không hợp lệ" description="Trang bạn tìm không nằm trong không gian sự kiện." /></PageChrome>} />
 </Routes></>
}
