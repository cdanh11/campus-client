import { Alert, Card, Empty, Space, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { ErrorNotice } from '../../components/ErrorNotice'
import {
 dateText, enrollmentState, enrolledTerms, isMissingStudentProfile, scheduleText, sectionState, termPhase, totalCredits, useEnrollments, useStudentProfile,
} from './student'

export default function CoursesPage() {
 const profile = useStudentProfile()
 const student = !!profile.data?.studentNumber
 const enrollments = useEnrollments(student)
 if (profile.isFetching) return <p role="status">Đang tải hồ sơ sinh viên…</p>
 if (isMissingStudentProfile(profile.error)) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên liên kết"
  description="Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên trước khi xem môn học." />
 if (profile.error) return <ErrorNotice error={profile.error} onRetry={() => { void profile.refetch() }} />
 if (!student) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên" description="Tài khoản này chưa được liên kết với hồ sơ sinh viên." />

 const items = enrollments.data?.items ?? []
 const terms = enrolledTerms(items)
 return <>
  <div className="page-heading"><div>
   <Typography.Title level={1}>Môn học của tôi</Typography.Title>
   <Typography.Paragraph type="secondary">Toàn bộ ghi danh theo học kỳ, kèm lớp học phần và lịch học.</Typography.Paragraph>
  </div></div>
  {enrollments.isFetching && <p role="status">Đang tải môn học…</p>}
  {enrollments.error && <ErrorNotice error={enrollments.error} onRetry={() => { void enrollments.refetch() }} />}
  {!enrollments.isFetching && !enrollments.error && terms.length === 0 && <Card><Empty description="Bạn chưa có ghi danh nào.">
   <Link to="/portal/events">Khám phá hoạt động trong khuôn viên</Link></Empty></Card>}
  <div className="course-terms">{!enrollments.error && terms.map((term) => {
   const rows = items.filter((item) => item.term?.id === term.id).sort((a, b) => (a.course?.code ?? '').localeCompare(b.course?.code ?? ''))
   return <Card key={term.id} className="course-term"
    title={<Space wrap><Typography.Text strong>{term.name}</Typography.Text><Tag>{term.code}</Tag><Tag color={termPhase(term).color}>{termPhase(term).label}</Tag></Space>}
    extra={<Typography.Text type="secondary">{totalCredits(items, term.id)} tín chỉ · {dateText(term.startDate)} – {dateText(term.endDate)}</Typography.Text>}>
    {rows.map((item) => <div className="course-row" key={item.enrollmentId ?? item.sectionId}>
     <div className="course-copy">
      <Typography.Text strong>{item.course?.title}</Typography.Text>
      <span>{item.course?.code} · Lớp {item.sectionCode} · {item.course?.credits} tín chỉ</span>
      <span>Giảng viên: {item.facultyName ?? 'Chưa phân công'}</span>
     </div>
     <div className="course-schedule"><strong>{scheduleText(item.schedule)}</strong><span>{item.schedule?.room ?? 'Chưa có phòng'}</span></div>
     <Space wrap><Tag color={item.status === 'ENROLLED' ? 'cyan' : 'default'}>{enrollmentState[item.status ?? ''] ?? item.status}</Tag><Tag>{sectionState[item.sectionStatus ?? ''] ?? item.sectionStatus}</Tag></Space>
    </div>)}
   </Card>
  })}</div>
 </>
}
