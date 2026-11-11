import { Alert, Card, Empty, Space, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { ArrowRightOutlined } from '@ant-design/icons'
import { ErrorNotice } from '../../components/ErrorNotice'
import { PageChrome } from '../../components/PageChrome'
import CurriculumGraph from './CurriculumGraph'
import {
 dateText, enrolledTerms, isMissingStudentProfile, scheduleSlotText, sectionState, termPhase, totalCredits, type Enrollment,
 useCurriculum, useEnrollments, useStudentProfile,
} from './student'

const isCurrentTerm = (term?: Enrollment['term']) => {
 const phase = termPhase(term).label
 return phase === 'Đang diễn ra' || phase === 'Sắp diễn ra'
}

export default function CoursesPage() {
 const profile = useStudentProfile()
 const student = !!profile.data?.studentNumber
 const enrollments = useEnrollments(student)
 const curriculum = useCurriculum(student)
 if (profile.isFetching) return <p role="status">Đang tải hồ sơ sinh viên…</p>
 if (isMissingStudentProfile(profile.error)) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên liên kết"
  description="Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên trước khi xem môn học." />
 if (profile.error) return <ErrorNotice error={profile.error} onRetry={() => { void profile.refetch() }} />
 if (!student) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên" description="Tài khoản này chưa được liên kết với hồ sơ sinh viên." />

 const items = (enrollments.data?.items ?? []).filter((item) => item.status === 'ENROLLED' && isCurrentTerm(item.term))
 const terms = enrolledTerms(items)
 const semesters = curriculum.data?.semesters ?? []
 return <PageChrome eyebrow="MÔN HỌC" title="Môn học của tôi"
  description="Lộ trình đào tạo theo từng học kỳ, điều kiện môn tiên quyết và các lớp bạn đang theo học.">
  <Card className="curriculum-card" title="Lộ trình môn học"
   extra={<Space wrap><Tag color="purple">{curriculum.data?.programName ?? 'Chưa rõ ngành'}</Tag><Tag>{semesters.length} học kỳ</Tag></Space>}>
   <Typography.Paragraph type="secondary" className="curriculum-intro">
    Mỗi ô là một môn trong chương trình, xếp từng học kỳ từ trên xuống. Lọc theo nhóm Đại cương, Bắt buộc hoặc Chuyên ngành; nhãn trên mỗi ô cho biết trạng thái học và môn tiên quyết. Chỉ cần đã học xong môn tiên quyết là đủ điều kiện đăng ký môn sau, dù kết quả đạt hay không đạt.
   </Typography.Paragraph>
   {curriculum.isFetching && !curriculum.data && <p role="status">Đang tải lộ trình môn học…</p>}
   {curriculum.error && <ErrorNotice error={curriculum.error} onRetry={() => { void curriculum.refetch() }} />}
   {!curriculum.isFetching && !curriculum.error && semesters.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Ngành học chưa có lộ trình môn học." />}
   {semesters.length > 0 && <CurriculumGraph programName={curriculum.data?.programName} semesters={semesters} />}
  </Card>

  <Card title="Lớp đang học" extra={<Link to="/portal/registration">Đăng ký môn <ArrowRightOutlined aria-hidden="true" /></Link>}>
   {enrollments.isFetching && !enrollments.data && <p role="status">Đang tải lớp học…</p>}
   {enrollments.error && <ErrorNotice error={enrollments.error} onRetry={() => { void enrollments.refetch() }} />}
   {!enrollments.isFetching && !enrollments.error && terms.length === 0 && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bạn chưa có lớp nào đang học.">
    <Link to="/portal/registration">Xem lớp học phần đang mở</Link>
   </Empty>}
   <div className="course-terms">{!enrollments.error && terms.map((term) => {
    const rows = items.filter((item) => item.term?.id === term.id).sort((a, b) => (a.course?.code ?? '').localeCompare(b.course?.code ?? ''))
    return <section className="course-term" key={term.id}>
     <header className="course-term-head">
      <Space wrap><Typography.Text strong>{term.name}</Typography.Text><Tag>{term.code}</Tag><Tag color={termPhase(term).color}>{termPhase(term).label}</Tag></Space>
      <Typography.Text type="secondary">{totalCredits(items, term.id)} tín chỉ · {dateText(term.startDate)} – {dateText(term.endDate)}</Typography.Text>
     </header>
     {rows.map((item) => <div className="course-row" key={item.enrollmentId ?? item.sectionId}>
      <div className="course-copy">
       <Typography.Text strong>{item.course?.title}</Typography.Text>
       <span>{item.course?.code} · Lớp {item.sectionCode} · {item.course?.credits} tín chỉ</span>
       <span>Giảng viên: {item.facultyName ?? 'Chưa phân công'}</span>
      </div>
      <div className="course-schedule"><strong>{scheduleSlotText(item.schedule)}</strong><span>{item.schedule?.room ?? 'Chưa có phòng'}</span></div>
      <Tag>{sectionState[item.sectionStatus ?? ''] ?? item.sectionStatus}</Tag>
     </div>)}
    </section>
   })}</div>
  </Card>
 </PageChrome>
}
