import { Card, Space, Tag, Typography } from 'antd'
import { CalendarOutlined, WalletOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { ErrorNotice } from '../../components/ErrorNotice'
import { daysAheadText, moneyText, nextMeetings, openCharges, overdueCharges, scheduleText, totalCredits, useEnrollments, useFinance, useStudentProfile, useTimetable } from './student'

export default function StudentSnapshot() {
 const profile = useStudentProfile()
 const student = profile.data?.studentNumber ? profile.data : null
 const timetable = useTimetable(undefined, !!student)
 const enrollments = useEnrollments(!!student)
 const finance = useFinance(!!student)
 if (!student) return null
 const items = enrollments.data?.items ?? []
 const termId = timetable.data?.term?.id
 const currentItems = termId ? items.filter((item) => item.term?.id === termId) : []
 const upcoming = nextMeetings(currentItems, 2)
 const unpaid = openCharges(finance.data)
 const overdue = overdueCharges(finance.data)
 return <section className="student-snapshot" aria-label="Tóm tắt sinh viên">
  <div className="workspace-section-heading"><div><Typography.Text className="section-kicker">DÀNH CHO BẠN</Typography.Text><Typography.Title level={2}>Học kỳ của {student.fullName}</Typography.Title></div><Link to="/portal">Mở cổng cá nhân</Link></div>
  <div className="student-snapshot-grid">
   <Card className="snapshot-card" title={<Space><CalendarOutlined /> Lịch học sắp tới</Space>} extra={<Link to="/portal/timetable">Chi tiết</Link>}>
    {timetable.error ? <ErrorNotice error={timetable.error} onRetry={() => { void timetable.refetch() }} />
     : upcoming.length === 0 ? <Typography.Text type="secondary">Chưa có lớp nào được xếp lịch.</Typography.Text>
     : upcoming.map(({ item, daysAhead }) => <div className="meeting-row" key={item.enrollmentId ?? item.sectionId}>
      <div className="meeting-time">{daysAheadText(daysAhead)}<span>{scheduleText(item.schedule)}</span></div>
      <div className="meeting-copy"><Typography.Text strong>{item.course?.title}</Typography.Text><span>{item.course?.code} · Lớp {item.sectionCode}</span></div>
     </div>)}
   </Card>
   <Card className="snapshot-card" title={<Space><WalletOutlined /> Học phí</Space>} extra={<Link to="/portal/finance">Chi tiết</Link>}>
    {finance.error ? <ErrorNotice error={finance.error} onRetry={() => { void finance.refetch() }} />
     : <><div className="snapshot-figure">{finance.data?.currency === 'VND' ? moneyText(finance.data.outstanding) : '—'}<span>còn nợ</span></div>
      <Space wrap><Tag>{totalCredits(items, termId)} tín chỉ</Tag><Tag color={overdue.length ? 'red' : 'green'}>{overdue.length ? `${overdue.length} khoản quá hạn` : 'Không quá hạn'}</Tag></Space>
      <Typography.Paragraph type="secondary" className="snapshot-note">{unpaid.length ? `${unpaid.length} khoản thu đang mở.` : 'Không có khoản thu đang mở.'}</Typography.Paragraph></>}
   </Card>
  </div>
 </section>
}
