import { Alert, Button, Card, Empty, Space, Tag, Typography } from 'antd'
import { ArrowRightOutlined, BookOutlined, CalendarOutlined, WalletOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { ErrorNotice } from '../../components/ErrorNotice'
import {
 activeEnrollments, chargeState, dateText, daysAheadText, isMissingStudentProfile,
 moneyText, nextMeetings, openCharges, overdueCharges, scheduleText, studentState, totalCredits,
 useEnrollments, useFinance, useStudentProfile, useTimetable,
} from './student'

export default function PortalHome() {
 const profile = useStudentProfile()
 const student = profile.data?.studentNumber ? profile.data : null
 const timetable = useTimetable(undefined, !!student)
 const enrollments = useEnrollments(!!student)
 const finance = useFinance(!!student)
 if (profile.isFetching) return <p role="status">Đang tải hồ sơ sinh viên…</p>
 if (isMissingStudentProfile(profile.error)) return <Alert type="info" showIcon title="Tài khoản chưa liên kết hồ sơ sinh viên"
  description="Bạn vẫn dùng được hộp thư và sự kiện. Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên và xem thời khóa biểu, học phí." />
 if (profile.error) return <ErrorNotice error={profile.error} onRetry={() => { void profile.refetch() }} />
 if (!student) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên" description="Tài khoản này chưa được liên kết với hồ sơ sinh viên." />

 const items = enrollments.data?.items ?? []
 const currentTerm = timetable.data?.term
 const currentItems = currentTerm?.id ? activeEnrollments(items).filter((item) => item.term?.id === currentTerm.id) : []
 const upcoming = nextMeetings(currentItems)
 const outstanding = finance.data?.outstanding
 const unpaid = openCharges(finance.data)
 const overdue = overdueCharges(finance.data)
 return <>
  <section className="student-welcome">
   <div>
    <Typography.Text className="section-kicker">CỔNG CÁ NHÂN</Typography.Text>
    <Typography.Title level={1}>Xin chào, {student.fullName}</Typography.Title>
    <Space wrap>
     <Tag color="cyan">{student.studentNumber}</Tag>
     <Tag>{studentState[student.status ?? ''] ?? student.status}</Tag>
     <Typography.Text type="secondary">{student.organizationUnitName}</Typography.Text>
    </Space>
   </div>
   <Space wrap>
    <Link to="/portal/timetable"><Button type="primary" icon={<CalendarOutlined />}>Xem thời khóa biểu</Button></Link>
    <Link to="/portal/finance"><Button icon={<WalletOutlined />}>Học phí</Button></Link>
   </Space>
  </section>
  {overdue.length > 0 && <Alert type="error" showIcon className="student-alert" title={`${overdue.length} khoản thu đã quá hạn`}
   description="Kiểm tra học phí và liên hệ phòng tài chính để hoàn tất thanh toán." action={<Link to="/portal/finance"><Button size="small" danger>Xem chi tiết</Button></Link>} />}
  <div className="portal-metrics">
   <Card className="metric-card"><span className="metric-icon"><CalendarOutlined /></span><Typography.Text type="secondary">Lớp sắp tới</Typography.Text>
    {upcoming[0] ? <><div className="metric-value">{upcoming[0].item.course?.title}</div><Typography.Text type="secondary">{daysAheadText(upcoming[0].daysAhead)} · {scheduleText(upcoming[0].item.schedule)}</Typography.Text></> : <Typography.Text type="secondary">Chưa có lịch học sắp tới.</Typography.Text>}</Card>
   <Card className="metric-card"><span className="metric-icon"><BookOutlined /></span><Typography.Text type="secondary">Tín chỉ đang học</Typography.Text>
    <div className="metric-value">{totalCredits(items, currentTerm?.id ?? undefined)}</div><Typography.Text type="secondary">{currentTerm ? `${currentItems.length} lớp trong ${currentTerm.name}` : 'Đang xác định học kỳ hiện tại'}</Typography.Text></Card>
   <Card className="metric-card"><span className="metric-icon"><WalletOutlined /></span><Typography.Text type="secondary">Học phí còn nợ</Typography.Text>
    <div className="metric-value">{outstanding === undefined ? '—' : moneyText(outstanding)}</div><Typography.Text type="secondary">{unpaid.length ? `${unpaid.length} khoản thu đang mở` : 'Không có khoản thu đang mở'}</Typography.Text></Card>
  </div>
  <div className="portal-home-grid">
   <Card title={<Space><CalendarOutlined /> Lịch học sắp tới</Space>} extra={<Link to="/portal/timetable">Toàn bộ lịch</Link>}>
    {timetable.isFetching && <p role="status">Đang tải thời khóa biểu…</p>}
    {timetable.error && <ErrorNotice error={timetable.error} onRetry={() => { void timetable.refetch() }} />}
    {!timetable.isFetching && !timetable.error && upcoming.length === 0 && <Empty description="Chưa có lịch học trong học kỳ này." />}
    {upcoming.map(({ item, daysAhead }) => <div className="meeting-row" key={item.enrollmentId ?? item.sectionId}>
     <div className="meeting-time">{daysAheadText(daysAhead)}<span>{scheduleText(item.schedule)}</span></div>
     <div className="meeting-copy"><Typography.Text strong>{item.course?.title}</Typography.Text><span>{item.course?.code} · Lớp {item.sectionCode} · {item.facultyName}</span></div>
    </div>)}
   </Card>
   <Card title={<Space><WalletOutlined /> Khoản thu cần chú ý</Space>} extra={<Link to="/portal/finance">Học phí</Link>}>
    {finance.isFetching && <p role="status">Đang tải học phí…</p>}
    {finance.error && <ErrorNotice error={finance.error} onRetry={() => { void finance.refetch() }} />}
    {!finance.isFetching && !finance.error && unpaid.length === 0 && <Empty description="Không có khoản thu đang mở." />}
    {!finance.error && unpaid.slice(0, 3).map((charge) => <div className="charge-row" key={charge.id}>
     <div><Typography.Text strong>{charge.feeName}</Typography.Text><span>{charge.chargeNumber} · Hạn {dateText(charge.dueDate)}</span></div>
     <div className="charge-amount"><Typography.Text strong>{moneyText(charge.outstanding)}</Typography.Text><Tag color={charge.overdue ? 'red' : 'orange'}>{charge.overdue ? 'Quá hạn' : chargeState[charge.status ?? '']}</Tag></div>
    </div>)}
   </Card>
  </div>
  <Card className="portal-actions" title="Đi tiếp" variant="borderless">
   <Space wrap>
    <Link to="/portal/courses"><Button icon={<BookOutlined />}>Môn học của tôi <ArrowRightOutlined /></Button></Link>
    <Link to="/portal/inbox"><Button>Hộp thư</Button></Link>
    <Link to="/portal/events"><Button>Sự kiện</Button></Link>
    <Link to="/portal/registrations"><Button>Đăng ký của bạn</Button></Link>
   </Space>
  </Card>
 </>
}
