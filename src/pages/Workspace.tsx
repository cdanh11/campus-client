import { lazy, Suspense, useState } from 'react'
import { Button, Card, Drawer, Layout, Result, Space, Tag, Typography } from 'antd'
import { ApartmentOutlined, BookOutlined, CalendarOutlined, HomeOutlined, LogoutOutlined, MenuOutlined, NotificationOutlined, PieChartOutlined, ReadOutlined, TeamOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { User } from '../api/client'
import { administrationRoles, canAdminister, canEnterAdministration } from '../api/administration'
import { AccessBoundary } from '../components/AccessBoundary'

const Portal = lazy(() => import('../features/portal/Portal'))
const AdminPeople = lazy(() => import('../features/people/AdminPeople'))
const { Title, Paragraph, Text } = Typography
const adminLinks = [
 { path: '/admin', label: 'Quản trị', icon: <HomeOutlined /> },
 { path: '/admin/users', label: 'Tài khoản', icon: <UserOutlined /> },
 { path: '/admin/organizations', label: 'Đơn vị', icon: <ApartmentOutlined /> },
 { path: '/admin/students', label: 'Sinh viên', icon: <TeamOutlined /> },
 { path: '/admin/personnel', label: 'Giảng viên & nhân sự', icon: <TeamOutlined /> },
 { path: '/admin/academic', label: 'Học vụ', icon: <ReadOutlined /> },
 { path: '/admin/operations', label: 'Ký túc xá & tài chính', icon: <WalletOutlined /> },
 { path: '/admin/notifications', label: 'Thông báo', icon: <NotificationOutlined /> },
 { path: '/admin/events', label: 'Sự kiện', icon: <CalendarOutlined /> },
 { path: '/admin/library', label: 'Thư viện', icon: <BookOutlined /> },
 { path: '/admin/insights', label: 'Audit & báo cáo', icon: <PieChartOutlined /> },
]
export default function Workspace({ user, onLogout }: { user: User; onLogout: () => void }) {
 const admin = canEnterAdministration(user)
 const visibleAdminLinks = adminLinks.filter((link) => {
  const segment = link.path.split('/')[2]
  if (!segment) return admin
  if (segment === 'operations') return canAdminister(user, 'dormitory') || canAdminister(user, 'finance')
  if (segment === 'insights') return canAdminister(user, 'audit') || canAdminister(user, 'reporting')
  return canAdminister(user, segment as keyof typeof administrationRoles)
 })
 const [open, setOpen] = useState(false)
 const location = useLocation()
 const links = [{ path: '/', label: 'Trang chủ', icon: <HomeOutlined /> },
  ...visibleAdminLinks, { path: '/portal', label: 'Cổng cá nhân', icon: <UserOutlined /> }]
 const active = [...links].reverse().find((link) => link.path === location.pathname || (link.path !== '/' && location.pathname.startsWith(link.path + '/')))
 const navigation = <nav className="sidebar-navigation" aria-label="Điều hướng chính">
  <p className="nav-caption">KHÔNG GIAN LÀM VIỆC</p>
  {links.map((link) => <NavLink key={link.path} to={link.path} end={link.path === '/' || link.path === '/admin'} onClick={() => setOpen(false)}
   className={({ isActive }) => isActive ? 'sidebar-link active' : 'sidebar-link'}>
   <span aria-hidden="true">{link.icon}</span><span>{link.label}</span>
  </NavLink>)}
 </nav>
 return <Layout className="workspace">
  <a className="skip-link" href="#main-content">Đến nội dung chính</a>
  <aside className="workspace-sidebar">
   <Link className="brand" to="/"><span className="brand-mark">C</span><span>Campus<span className="brand-subtitle">PLATFORM</span></span></Link>
   {navigation}<div className="sidebar-footer">Kết nối hoạt động trong khuôn viên</div>
  </aside>
  <Layout className="workspace-body">
   <Layout.Header className="header">
    <Space><Button className="mobile-menu" aria-label="Mở điều hướng" aria-expanded={open} icon={<MenuOutlined aria-hidden="true" />} onClick={() => setOpen(true)} /><div><Text className="header-eyebrow">CAMPUS PLATFORM</Text><div className="header-title">{active?.label ?? 'Không gian làm việc'}</div></div></Space>
    <Space wrap className="header-account"><Text className="account-email">{user.email}</Text><Button icon={<LogoutOutlined aria-hidden="true" />} onClick={onLogout}>Đăng xuất</Button></Space>
   </Layout.Header>
   <Drawer title="Campus Platform" placement="left" open={open} onClose={() => setOpen(false)} size={288}>{open && navigation}</Drawer>
   <Layout.Content id="main-content" tabIndex={-1} className="content">
    <Routes>
     <Route path="/" element={<>
      <section className="welcome-panel"><Tag color="blue">KHÔNG GIAN LÀM VIỆC</Tag><Title level={1}>Một khuôn viên. Một kết nối.</Title><Paragraph>Chào mừng trở lại, <strong>{user.email}</strong>. Truy cập nhanh các hoạt động phù hợp với vai trò và nghiệp vụ của bạn.</Paragraph></section>
      <div className="overview-grid">
       <Card title="Tài khoản của bạn"><Space wrap>{user.roles.map((role) => <Tag color="blue" key={role}>{role}</Tag>)}</Space><Paragraph className="account-note">Phiên làm việc đang hoạt động<br />{user.email}</Paragraph></Card>
       <Card title="Cổng cá nhân" extra={<span aria-hidden="true">↗</span>}><Paragraph>Thông báo, sự kiện và các hoạt động dành riêng cho bạn.</Paragraph><Link className="text-action" to="/portal">Mở cổng cá nhân</Link></Card>
       {admin && <Card title="Quản trị khuôn viên" extra={<span aria-hidden="true">↗</span>}><Paragraph>Hồ sơ, học vụ, thư viện và các dịch vụ trong cùng một không gian.</Paragraph><Link className="text-action" to="/admin">Mở không gian quản trị</Link></Card>}
      </div>
     </>} />
     <Route path="/admin/*" element={<AccessBoundary user={user} roles={Object.values(administrationRoles).flat()}><Suspense fallback={<p role="status">Đang tải…</p>}><AdminPeople user={user} /></Suspense></AccessBoundary>} />
     <Route path="/portal/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><Portal /></Suspense>} />
     <Route path="/login" element={<Navigate to="/" replace />} />
     <Route path="*" element={<Result status="404" title="Không tìm thấy trang" extra={<Link to="/"><Button>Về trang chủ</Button></Link>} />} />
    </Routes>
   </Layout.Content>
  </Layout>
 </Layout>
}
