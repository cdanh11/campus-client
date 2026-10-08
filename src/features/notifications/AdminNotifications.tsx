import { useState } from 'react'
import { Button } from 'antd'
import { NavLink as Link, Route, Routes } from 'react-router-dom'
import { RegistryPage } from '../people/RegistryPage'
import { notices, templates } from './resources'
import { PublishNotice } from './PublishNotice'
import { PageChrome } from '../../components/PageChrome'
function NoticesPage() {
 const [publishId, setPublishId] = useState<string>()
 return <><RegistryPage resource={notices} rowActions={(row) => <Button disabled={row.status !== 'DRAFT'} onClick={() => setPublishId(row.id)}>Phát hành</Button>} />
  {publishId && <PublishNotice key={publishId} id={publishId} onClose={() => setPublishId(undefined)} />}
 </>
}
export default function AdminNotifications() {
 return <PageChrome eyebrow="CAMPUS COMMUNICATIONS" title="Thông báo" description="Soạn, kiểm duyệt và phát hành thông tin đến đúng nhóm người dùng."><nav className="admin-navigation" aria-label="Quản trị thông báo"><Link to="/admin/notifications/templates">Mẫu thông báo</Link><Link to="/admin/notifications/notices">Thông báo</Link></nav><Routes>
  <Route path="templates" element={<RegistryPage resource={templates} />} /><Route path="notices" element={<NoticesPage />} />
  <Route index element={<p>Chọn mẫu thông báo hoặc bản nháp cần quản lý.</p>} /><Route path="*" element={<p>Không tìm thấy trang.</p>} />
 </Routes></PageChrome>
}
