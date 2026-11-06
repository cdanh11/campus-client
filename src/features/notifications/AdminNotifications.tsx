import { useState } from 'react'
import { Button } from 'antd'
import { NavLink as Link, Navigate, Route, Routes } from 'react-router-dom'
import { RegistryPage } from '../people/RegistryPage'
import { notices, templates } from './resources'
import { PublishNotice } from './PublishNotice'
import { PageChrome, EmptyState } from '../../components/PageChrome'
function NoticesPage() {
 const [publishId, setPublishId] = useState<string>()
 return <><RegistryPage resource={notices} rowActions={(row) => <Button disabled={row.status !== 'DRAFT'} onClick={() => setPublishId(row.id)}>Phát hành</Button>} />
  {publishId && <PublishNotice key={publishId} id={publishId} onClose={() => setPublishId(undefined)} />}
 </>
}
export default function AdminNotifications() {
 return <><nav className="admin-navigation" aria-label="Quản trị thông báo"><Link to="/admin/notifications/templates">Mẫu thông báo</Link><Link to="/admin/notifications/notices">Thông báo</Link></nav><Routes>
  <Route path="templates" element={<RegistryPage resource={templates} />} /><Route path="notices" element={<NoticesPage />} />
  <Route index element={<Navigate to="notices" replace />} />
  <Route path="*" element={<PageChrome eyebrow="CAMPUS COMMUNICATIONS" title="Không tìm thấy trang thông báo" description="Kiểm tra lại đường dẫn hoặc quay lại khu vực thông báo."><EmptyState title="Đường dẫn không hợp lệ" description="Trang bạn tìm không nằm trong không gian thông báo." /></PageChrome>} />
 </Routes></>
}
