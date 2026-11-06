import { useQuery } from '@tanstack/react-query'
import { Card, Typography } from 'antd'
import { Link } from 'react-router-dom'
import type { User } from '../../api/client'
import { api } from '../../api/runtime'
import { administrationDestinations, canAdminister, type AdministrationArea } from '../../api/administration'
import { PageChrome } from '../../components/PageChrome'
import { ErrorNotice } from '../../components/ErrorNotice'
import type { Dashboard } from '../insights/contracts'
import { exactCount, metricText } from '../insights/query'

const descriptions: Record<AdministrationArea, string> = {
 users: 'Tài khoản đăng nhập, vai trò và đặt lại mật khẩu.',
 organizations: 'Cơ cấu đơn vị, khoa và phòng ban.',
 students: 'Hồ sơ sinh viên và liên kết tài khoản.',
 personnel: 'Giảng viên, nhân viên và trạng thái công tác.',
 academic: 'Chương trình, học kỳ, lớp học phần và ghi danh.',
 dormitory: 'Tòa, phòng, giường và phân chỗ ở.',
 finance: 'Biểu phí, khoản thu và biên nhận thanh toán.',
 notifications: 'Mẫu thông báo và phát hành đến người nhận.',
 events: 'Danh mục sự kiện và đăng ký tham gia.',
 library: 'Đầu sách, bản sao và lượt mượn trả.',
 audit: 'Dấu vết thay đổi dữ liệu theo nguồn.',
 reporting: 'Dashboard vận hành và báo cáo chi tiết.',
}

const kpis: { group: string; key: string; label: string; area: AdministrationArea; path: string; money?: boolean }[] = [
 { group: 'PEOPLE', key: 'active_students', label: 'Sinh viên đang học', area: 'students', path: '/admin/students' },
 { group: 'ACADEMIC', key: 'open_sections', label: 'Lớp đang mở', area: 'academic', path: '/admin/academic/sections' },
 { group: 'ACADEMIC', key: 'enrolled_memberships', label: 'Ghi danh hiện tại', area: 'academic', path: '/admin/academic/enrollments' },
 { group: 'FINANCE', key: 'outstanding_vnd', label: 'Công nợ', area: 'finance', path: '/admin/operations/charges', money: true },
 { group: 'FINANCE', key: 'open_charges', label: 'Khoản thu đang mở', area: 'finance', path: '/admin/operations/charges' },
 { group: 'DORMITORY', key: 'available_beds', label: 'Giường còn trống', area: 'dormitory', path: '/admin/operations/beds' },
 { group: 'LIBRARY', key: 'overdue_loans', label: 'Lượt mượn quá hạn', area: 'library', path: '/admin/library/loans' },
 { group: 'EVENT', key: 'open_events', label: 'Sự kiện đang mở', area: 'events', path: '/admin/events/catalog' },
]

const tasks: { area: AdministrationArea; title: string; description: string; path: string }[] = [
 { area: 'students', title: 'Tiếp nhận sinh viên', description: 'Tạo hồ sơ và liên kết tài khoản đăng nhập.', path: '/admin/students' },
 { area: 'academic', title: 'Mở lớp học phần', description: 'Xếp giảng viên, lịch học và sức chứa.', path: '/admin/academic/sections' },
 { area: 'academic', title: 'Ghi danh sinh viên', description: 'Thêm hoặc rút ghi danh theo lớp.', path: '/admin/academic/enrollments' },
 { area: 'finance', title: 'Lập khoản thu', description: 'Tạo khoản phải thu và theo dõi công nợ.', path: '/admin/operations/charges' },
 { area: 'finance', title: 'Ghi nhận thanh toán', description: 'Lập biên nhận cho khoản thu đang mở.', path: '/admin/operations/payments' },
 { area: 'dormitory', title: 'Xếp chỗ ký túc xá', description: 'Quản lý giường và phân chỗ ở.', path: '/admin/operations/assignments' },
 { area: 'notifications', title: 'Phát hành thông báo', description: 'Soạn và gửi đến đúng nhóm người nhận.', path: '/admin/notifications/notices' },
 { area: 'events', title: 'Mở sự kiện', description: 'Tạo hoạt động và theo dõi đăng ký.', path: '/admin/events/catalog' },
 { area: 'library', title: 'Cho mượn sách', description: 'Ghi nhận mượn trả và xử lý quá hạn.', path: '/admin/library/loans' },
]

const valueOf = (dashboard: Dashboard | undefined, group: string, key: string) => dashboard?.groups[group]?.[key]
const positive = (value: unknown) => { try { return exactCount(value) > 0n } catch { return false } }

export default function AdminHome({ user }: { user: User }) {
 const reporting = canAdminister(user, 'reporting')
 const dashboard = useQuery({
  queryKey: ['dashboard'],
  enabled: reporting,
  queryFn: ({ signal }) => api.request<Dashboard>('/api/v1/admin/reports/dashboard', { signal }),
 })
 const destinations = administrationDestinations.filter(({ area }) => canAdminister(user, area))
 const actions = tasks.filter(({ area }) => canAdminister(user, area))
 const alerts = reporting && dashboard.data ? [
  { value: valueOf(dashboard.data, 'FINANCE', 'outstanding_vnd'), area: 'finance' as const, path: '/admin/operations/charges', text: 'công nợ cần thu' },
  { value: valueOf(dashboard.data, 'LIBRARY', 'overdue_loans'), area: 'library' as const, path: '/admin/library/loans', text: 'lượt mượn quá hạn' },
 ].filter((alert) => positive(alert.value) && canAdminister(user, alert.area)) : []
 return <PageChrome eyebrow="CAMPUS OPERATIONS" title="Trung tâm điều phối" description="Số liệu vận hành tại thời điểm đọc và các thao tác thường dùng, chỉ hiển thị theo quyền của tài khoản.">
  <div className="overview-intro"><div><Typography.Title level={2}>Chào {user.email}</Typography.Title><Typography.Paragraph>Bắt đầu từ chỉ số cần chú ý hoặc mở thẳng nghiệp vụ bạn phụ trách.</Typography.Paragraph></div><span className="overview-badge">{destinations.length} khu vực được cấp quyền</span></div>
  {reporting && <section className="admin-section" aria-label="Chỉ số vận hành">
   <div className="admin-section-heading"><Typography.Title level={3}>Điểm nóng vận hành</Typography.Title></div>
   {dashboard.error && <ErrorNotice error={dashboard.error} onRetry={() => { void dashboard.refetch() }} />}
   {dashboard.isFetching && <p role="status">Đang tải chỉ số…</p>}
   {dashboard.data && <div className="admin-kpis">{kpis.map((kpi) => {
    const value = valueOf(dashboard.data, kpi.group, kpi.key)
    const body = <><span className="admin-kpi-label">{kpi.label}</span><strong className="admin-kpi-value">{value === undefined ? '—' : metricText(value, kpi.money)}</strong></>
    return canAdminister(user, kpi.area)
     ? <Link key={kpi.key} className="admin-kpi" to={kpi.path}>{body}</Link>
     : <div key={kpi.key} className="admin-kpi">{body}</div>
   })}</div>}
   {alerts.length > 0 && <div className="admin-alerts">{alerts.map((alert) => <Link key={alert.text} to={alert.path}>{metricText(alert.value)} {alert.text} · Xử lý ngay</Link>)}</div>}
  </section>}
  {actions.length > 0 && <section className="admin-section" aria-label="Thao tác thường dùng">
   <div className="admin-section-heading"><Typography.Title level={3}>Việc thường làm</Typography.Title><Typography.Text type="secondary">Mở thẳng biểu mẫu hoặc danh sách cần thao tác</Typography.Text></div>
   <div className="admin-task-grid">{actions.map((task) => <Link key={task.title} className="admin-task" to={task.path}><span className="admin-task-title">{task.title}</span><span className="admin-task-copy">{task.description}</span><span className="admin-task-link" aria-hidden="true">Mở →</span></Link>)}</div>
  </section>}
  <section className="admin-section" aria-label="Không gian quản trị">
   <div className="admin-section-heading"><Typography.Title level={3}>Toàn bộ không gian</Typography.Title><Typography.Text type="secondary">Mỗi khu vực gồm danh sách và biểu mẫu tương ứng</Typography.Text></div>
   <div className="overview-grid">{destinations.map(({ area, path, title }) => <Card key={area} className="overview-card" title={title}><Typography.Paragraph type="secondary">{descriptions[area]}</Typography.Paragraph><Link to={path} aria-label={'Mở ' + title}>Mở không gian <span aria-hidden="true">→</span></Link></Card>)}</div>
  </section>
 </PageChrome>
}
