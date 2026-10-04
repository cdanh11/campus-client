import { Button, Card, Layout, Result, Space, Tag, Typography } from 'antd'
import { LogoutOutlined } from '@ant-design/icons'
import { Link, Navigate, Route, Routes } from 'react-router-dom'
import type { User } from '../api/client'
import { AccessBoundary } from '../components/AccessBoundary'

const { Title, Paragraph, Text } = Typography
export default function Workspace({ user, onLogout }: { user: User; onLogout: () => void }) {
 const admin = user.roles.includes('ADMIN')
 return <Layout className="workspace">
  <Layout.Header className="header">
   <Link className="brand" to="/">C<span>Campus Platform</span></Link>
   <Space wrap><Text>{user.email}</Text><Button icon={<LogoutOutlined aria-hidden="true" />} onClick={onLogout}>Đăng xuất</Button></Space>
  </Layout.Header>
  <nav className="navigation" aria-label="Điều hướng chính">
   <Link to="/">Tài khoản</Link>
   {admin && <Link to="/admin">Quản trị</Link>}
   <Link to="/portal">Cổng cá nhân</Link>
  </nav>
  <Layout.Content className="content">
   <Routes>
    <Route path="/" element={<>
     <Tag color="cyan">KHÔNG GIAN LÀM VIỆC</Tag>
     <Title level={1}>Một khuôn viên. Một kết nối.</Title>
     <Paragraph>Chào mừng bạn đến Campus Platform.</Paragraph>
     <Card title="Thông tin tài khoản"><Space wrap>{user.roles.map((role) => <Tag key={role}>{role}</Tag>)}</Space><Paragraph className="account-note">{user.email}</Paragraph></Card>
    </>} />
    <Route path="/admin" element={<AccessBoundary user={user} role="ADMIN"><Title level={1}>Không gian quản trị</Title><Paragraph>Quản lý hoạt động và dịch vụ trong khuôn viên.</Paragraph></AccessBoundary>} />
    <Route path="/portal" element={<><Title level={1}>Cổng cá nhân</Title><Paragraph>Thông tin và hoạt động dành cho tài khoản của bạn.</Paragraph></>} />
    <Route path="/login" element={<Navigate to="/" replace />} />
    <Route path="*" element={<Result status="404" title="Không tìm thấy trang" extra={<Link to="/"><Button>Về trang chủ</Button></Link>} />} />
   </Routes>
  </Layout.Content>
 </Layout>
}
