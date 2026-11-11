import { lazy, Suspense, useEffect, useState, type ReactNode } from 'react'
import { Button, Card, Drawer, Layout, Result, Space, Tag, Typography } from 'antd'
import { ApartmentOutlined, ArrowRightOutlined, BarChartOutlined, BellOutlined, BookOutlined, CalendarOutlined, DashboardOutlined, FormOutlined, HomeOutlined, IdcardOutlined, LogoutOutlined, MenuFoldOutlined, MenuOutlined, MenuUnfoldOutlined, NotificationOutlined, PieChartOutlined, ReadOutlined, TeamOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons'
import { Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import type { User } from '../api/client'
import { administrationRoles, canAdminister, canEnterAdministration, type AdministrationArea } from '../api/administration'
import { AccessBoundary } from '../components/AccessBoundary'
import { ErrorBoundary } from '../components/ErrorBoundary'
import { roleText } from '../features/roles'
import NewsBoard from '../features/portal/NewsBoard'
import StudentSnapshot from '../features/portal/StudentSnapshot'
import { useStudentProfile } from '../features/portal/student'
import NotificationBell from '../components/NotificationBell'

const Portal = lazy(() => import('../features/portal/Portal'))
const AdminPeople = lazy(() => import('../features/people/AdminPeople'))
const { Title, Paragraph, Text } = Typography
const adminLinks: { path: string; label: string; icon: ReactNode; areas?: AdministrationArea[] }[] = [
 { path: '/admin', label: 'Quản trị', icon: <HomeOutlined /> },
 { path: '/admin/students', label: 'Sinh viên', icon: <TeamOutlined />, areas: ['students'] },
 { path: '/admin/personnel', label: 'Giảng viên & nhân sự', icon: <TeamOutlined />, areas: ['personnel'] },
 { path: '/admin/academic', label: 'Học vụ', icon: <ReadOutlined />, areas: ['academic'] },
 { path: '/admin/operations/buildings', label: 'Ký túc xá', icon: <ApartmentOutlined />, areas: ['dormitory'] },
 { path: '/admin/notifications', label: 'Thông báo', icon: <NotificationOutlined />, areas: ['notifications'] },
 { path: '/admin/events', label: 'Sự kiện', icon: <CalendarOutlined />, areas: ['events'] },
 { path: '/admin/library', label: 'Thư viện', icon: <BookOutlined />, areas: ['library'] },
 { path: '/admin/operations/fees', label: 'Tài chính', icon: <WalletOutlined />, areas: ['finance'] },
 { path: '/admin/users', label: 'Tài khoản', icon: <UserOutlined />, areas: ['users'] },
 { path: '/admin/organizations', label: 'Đơn vị', icon: <ApartmentOutlined />, areas: ['organizations'] },
 { path: '/admin/insights', label: 'Audit & báo cáo', icon: <PieChartOutlined />, areas: ['audit', 'reporting'] },
]
export default function Workspace({ user, onLogout }: { user: User; onLogout: () => void }) {
 const admin = canEnterAdministration(user)
 const visibleAdminLinks = adminLinks.filter((link) => link.areas ? link.areas.some((area) => canAdminister(user, area)) : admin)
 const [open, setOpen] = useState(false)
 const [collapsed, setCollapsed] = useState(() => localStorage.getItem('campus.sidebar.collapsed') === '1')
 const toggleSidebar = () => setCollapsed((current) => {
  const next = !current
  localStorage.setItem('campus.sidebar.collapsed', next ? '1' : '0')
  return next
 })
 const location = useLocation()
 const studentProfile = useStudentProfile(user.roles.includes('USER') && (location.pathname === '/' || location.pathname.startsWith('/portal')))
 const identity = studentProfile.data?.fullName || user.email
 const portalLinks = user.roles.includes('USER')
  ? [{ path: '/portal/overview', label: 'Tổng quan', icon: <DashboardOutlined /> },
   { path: '/portal/timetable', label: 'Thời khóa biểu', icon: <CalendarOutlined /> },
   { path: '/portal/courses', label: 'Môn học', icon: <BookOutlined /> },
   { path: '/portal/registration', label: 'Đăng ký môn', icon: <FormOutlined /> },
   { path: '/portal/results', label: 'Kết quả học tập', icon: <BarChartOutlined /> },
   { path: '/portal/finance', label: 'Học phí', icon: <WalletOutlined /> },
   { path: '/portal/events', label: 'Sự kiện', icon: <NotificationOutlined /> },
   { path: '/portal/profile', label: 'Hồ sơ cá nhân', icon: <IdcardOutlined /> }]
  : [{ path: '/portal', label: 'Cổng cá nhân', icon: <UserOutlined /> }]
 const links = [{ path: '/', label: 'Trang chủ', icon: <HomeOutlined /> }, ...visibleAdminLinks, ...portalLinks]
 const active = [...links].reverse().find((link) => link.path === location.pathname || (link.path !== '/' && location.pathname.startsWith(link.path + '/')))
 useEffect(() => { document.title = (active?.label ?? 'Không gian làm việc') + ' · Campus Platform' }, [active?.label])
 const renderNavigation = (compact: boolean) => <nav className="sidebar-navigation" aria-label="Điều hướng chính">
  <p className="nav-caption">KHÔNG GIAN LÀM VIỆC</p>
  {links.map((link) => <NavLink key={link.path} to={link.path} end={link.path === '/' || link.path === '/admin' || link.path === '/portal'} onClick={() => setOpen(false)}
   aria-label={compact ? link.label : undefined} title={compact ? link.label : undefined}
   className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}>
   <span aria-hidden="true">{link.icon}</span><span>{link.label}</span>
  </NavLink>)}
 </nav>
 return <Layout className="workspace">
  <a className="skip-link" href="#main-content">Đến nội dung chính</a>
  <aside className={'workspace-sidebar' + (collapsed ? ' collapsed' : '')}>
   <div className="sidebar-top">
    <Link className="brand" to="/" aria-label="Campus Platform"><span className="brand-mark">C</span><span className="brand-text">Campus<span className="brand-subtitle">PLATFORM</span></span></Link>
    <Button className="sidebar-toggle" type="text" aria-label={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'} aria-pressed={collapsed}
     title={collapsed ? 'Mở rộng thanh điều hướng' : 'Thu gọn thanh điều hướng'} icon={collapsed ? <MenuUnfoldOutlined aria-hidden="true" /> : <MenuFoldOutlined aria-hidden="true" />} onClick={toggleSidebar} />
   </div>
   {renderNavigation(collapsed)}<div className="sidebar-footer">Kết nối hoạt động trong khuôn viên</div>
  </aside>
  <Layout className="workspace-body">
   <Layout.Header className="header">
    <Space><Button className="mobile-menu" aria-label="Mở điều hướng" aria-expanded={open} icon={<MenuOutlined aria-hidden="true" />} onClick={() => setOpen(true)} /><div><Text className="header-eyebrow">CAMPUS PLATFORM</Text><div className="header-title">{active?.label ?? 'Không gian làm việc'}</div></div></Space>
    <Space wrap className="header-account">
     <NotificationBell />
     <span className="header-identity"><Text className="account-name" title={user.email}>{identity}</Text>{identity !== user.email && <Text className="account-email">{user.email}</Text>}</span>
     <Button icon={<LogoutOutlined aria-hidden="true" />} onClick={onLogout}>Đăng xuất</Button>
    </Space>
   </Layout.Header>
   <Drawer title="Campus Platform" placement="left" open={open} onClose={() => setOpen(false)} size={288}>{open && renderNavigation(false)}</Drawer>
   <Layout.Content id="main-content" tabIndex={-1} className="content">
    <ErrorBoundary key={location.pathname}>
    <Routes>
     <Route path="/" element={<>
      <section className="welcome-panel workspace-hero">
       <div className="workspace-hero-copy"><Tag color="cyan">KHÔNG GIAN LÀM VIỆC</Tag><Title level={1}>Một khuôn viên. Một kết nối.</Title><Paragraph>Chào mừng trở lại, <strong>{user.email}</strong>. Mọi điểm chạm quan trọng của Campus được sắp xếp gọn trong một nơi.</Paragraph><Space wrap><Link to="/portal"><Button type="primary" icon={<ArrowRightOutlined />}>Mở cổng cá nhân</Button></Link>{admin && <Link to="/admin"><Button icon={<PieChartOutlined />}>Đi tới quản trị</Button></Link>}</Space></div>
       <div className="hero-orbit" aria-hidden="true"><div className="hero-orbit-core">C</div><span><BellOutlined /></span><span><CalendarOutlined /></span><span><TeamOutlined /></span></div>
      </section>
      <NewsBoard />
      <StudentSnapshot user={user} />
      <section className="workspace-section-heading"><div><Text className="section-kicker">TỔNG QUAN</Text><Title level={2}>Bắt đầu từ nơi bạn cần</Title></div><Text type="secondary">Cập nhật theo quyền truy cập của bạn</Text></section>
      <div className="workspace-launch-grid">
       <Link className="launch-card launch-card-primary" to="/portal"><div className="launch-icon"><UserOutlined /></div><div><Text className="launch-kicker">DÀNH CHO BẠN</Text><Title level={3}>Cổng cá nhân</Title><Paragraph>Thông báo, sự kiện và các đăng ký đang theo dõi.</Paragraph></div><ArrowRightOutlined className="launch-arrow" /></Link>
       {admin && <Link className="launch-card" to="/admin"><div className="launch-icon"><PieChartOutlined /></div><div><Text className="launch-kicker">VẬN HÀNH</Text><Title level={3}>Không gian quản trị</Title><Paragraph>Điều phối hồ sơ, học vụ, dịch vụ và báo cáo.</Paragraph></div><ArrowRightOutlined className="launch-arrow" /></Link>}
       <Card className="status-card" variant="borderless"><div className="status-card-heading"><span className="status-dot" /> <Text strong>Phiên làm việc đang hoạt động</Text></div><Text type="secondary">Tài khoản</Text><div className="status-email">{user.email}</div><Space wrap>{user.roles.map((role) => <Tag color="cyan" key={role}>{roleText(role)}</Tag>)}</Space></Card>
      </div>
      <Card className="tip-card workspace-tip" variant="borderless"><Text className="section-kicker">GỢI Ý NHANH</Text><Title level={3}>Tìm đúng không gian</Title><Paragraph>Nhóm điều hướng bên trái sẽ thay đổi theo quyền của tài khoản. Bạn chỉ thấy những nghiệp vụ mình được phép sử dụng.</Paragraph><Link className="text-action" to="/portal">Khám phá cổng cá nhân <ArrowRightOutlined /></Link></Card>
     </>} />
     <Route path="/admin/*" element={<AccessBoundary user={user} roles={Object.values(administrationRoles).flat()}><Suspense fallback={<p role="status">Đang tải…</p>}><AdminPeople user={user} /></Suspense></AccessBoundary>} />
     <Route path="/portal/*" element={<Suspense fallback={<p role="status">Đang tải…</p>}><Portal /></Suspense>} />
     <Route path="/login" element={<Navigate to="/" replace />} />
     <Route path="*" element={<Result status="404" title="Không tìm thấy trang" extra={<Link to="/"><Button>Về trang chủ</Button></Link>} />} />
    </Routes>
    </ErrorBoundary>
   </Layout.Content>
  </Layout>
 </Layout>
}
