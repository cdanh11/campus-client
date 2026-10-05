import { useQuery } from '@tanstack/react-query'
import { Button, Card, Typography } from 'antd'
import { api } from '../../api/runtime'
import { ErrorNotice } from '../../components/ErrorNotice'
import type { Dashboard } from './contracts'
import { metricText } from './query'
const groupLabels: Record<string, string> = { IDENTITY: 'Tài khoản', PEOPLE: 'Hồ sơ', ACADEMIC: 'Học vụ', DORMITORY: 'Ký túc xá', FINANCE: 'Tài chính', NOTIFICATION: 'Thông báo', EVENT: 'Sự kiện', LIBRARY: 'Thư viện' }
const metricLabels: Record<string, string> = { users: 'Tài khoản', active_users: 'Đang hoạt động', organization_units: 'Đơn vị', active_organization_units: 'Đơn vị hoạt động', students: 'Sinh viên', active_students: 'Sinh viên hoạt động', personnel: 'Nhân sự', active_faculty: 'Giảng viên hoạt động', active_staff: 'Nhân viên hoạt động', programs: 'Chương trình', courses: 'Môn học', active_terms: 'Học kỳ hoạt động', open_sections: 'Lớp mở', enrolled_memberships: 'Ghi danh hiện tại', beds: 'Giường', occupied_beds: 'Đang ở', available_beds: 'Giường khả dụng', charges: 'Khoản thu', open_charges: 'Khoản thu mở', open_principal_vnd: 'Gốc khoản thu mở', effective_paid_vnd: 'Thanh toán hiệu lực', outstanding_vnd: 'Công nợ', published_notices: 'Thông báo đã phát hành', deliveries: 'Lượt gửi', unread_deliveries: 'Chưa đọc', open_events: 'Sự kiện mở', registered_memberships: 'Đăng ký', attended_memberships: 'Tham dự', titles: 'Đầu sách', copies: 'Bản sao', open_loans: 'Đang mượn', overdue_loans: 'Quá hạn' }
export function DashboardPage() {
 const result = useQuery({
  queryKey: ['dashboard'], queryFn: ({ signal }) => api.request<Dashboard>('/api/v1/admin/reports/dashboard', { signal }),
  select: (data) => ({ asOf: data.asOf, groups: Object.entries(groupLabels).map(([group, label]) => {
   if (!data.groups[group] || data.currency !== 'VND') throw new Error('Dashboard contract không hợp lệ.')
   return { group, label, metrics: Object.entries(data.groups[group]).map(([key, value]) => ({ key, label: metricLabels[key] ?? key, value: metricText(value, key.endsWith('_vnd')) })) }
  }) }),
 })
 return <><Typography.Title level={1}>Dashboard</Typography.Title><Typography.Paragraph>Số liệu tại thời điểm đọc; không tái dựng lịch sử. Thanh toán đã đảo không đóng góp vào số thanh toán hiệu lực.</Typography.Paragraph><Button disabled={result.isFetching} onClick={() => { void result.refetch() }}>Làm mới dashboard</Button>
  {result.isFetching && <p role="status">Đang tải dashboard…</p>}{result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  {result.data && <><p>Thời điểm UTC: {result.data.asOf}</p><div className="dashboard-grid">{result.data.groups.map((group) => <Card key={group.group} title={group.label} ><dl className="metric-list">{group.metrics.map((metric) => <div key={metric.key}><dt>{metric.label}</dt><dd>{metric.value}</dd></div>)}</dl></Card>)}</div></>}
 </>
}
