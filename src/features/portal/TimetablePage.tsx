import { useState } from 'react'
import { Alert, Card, Empty, Segmented, Select, Space, Tag, Typography } from 'antd'
import { Link } from 'react-router-dom'
import { ErrorNotice } from '../../components/ErrorNotice'
import type { Term } from './student'
import WeekTimetable from './WeekTimetable'
import { campusToday } from './timetable-layout'
import {
 clockText, dateText, enrolledTerms, enrollmentState, isMissingStudentProfile, sectionState, termPhase, useEnrollments, useStudentProfile, useTimetable, weekdayText,
} from './student'

const dayOrder = [1, 2, 3, 4, 5, 6, 7, 0]

/** Show the term's first or last week when today falls outside it. */
function weekAnchor(term?: Term, now = new Date()) {
 const today = campusToday(now)
 if (term?.startDate && today < term.startDate) return new Date(term.startDate + 'T00:00:00+07:00')
 if (term?.endDate && today > term.endDate) return new Date(term.endDate + 'T00:00:00+07:00')
 return now
}

export default function TimetablePage() {
 const [termId, setTermId] = useState<string>()
 const [view, setView] = useState<'week' | 'list'>('week')
 const profile = useStudentProfile()
 const student = !!profile.data?.studentNumber
 const enrollments = useEnrollments(student)
 const timetable = useTimetable(termId, student)
 if (profile.isFetching) return <p role="status">Đang tải hồ sơ sinh viên…</p>
 if (isMissingStudentProfile(profile.error)) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên liên kết"
  description="Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên trước khi xem thời khóa biểu." />
 if (profile.error) return <ErrorNotice error={profile.error} onRetry={() => { void profile.refetch() }} />
 if (!student) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên" description="Tài khoản này chưa được liên kết với hồ sơ sinh viên." />

 const terms = enrolledTerms(enrollments.data?.items ?? [])
 const term = timetable.data?.term
 const choices = term && !terms.some((item) => item.id === term.id) ? [term, ...terms] : terms
 const meetings = timetable.data?.meetings ?? []
 const groups = dayOrder.map((day) => ({ day, items: meetings.filter((item) => (item.schedule?.weekday ?? 0) === day) })).filter((group) => group.items.length > 0)
 return <>
  <div className="page-heading"><div>
   <Typography.Title level={1}>Thời khóa biểu</Typography.Title>
   <Typography.Paragraph type="secondary">Các lớp bạn đã ghi danh, xếp theo ngày học trong tuần.</Typography.Paragraph>
  </div></div>
  <Space wrap className="list-filters">
   <Select aria-label="Chọn học kỳ" value={termId ?? term?.id} onChange={setTermId} placeholder="Học kỳ hiện tại" style={{ minWidth: 280 }}
    options={choices.map((item) => ({ value: item.id ?? '', label: `${item.name} (${item.code})` }))} />
   <Segmented aria-label="Chế độ xem thời khóa biểu" value={view} onChange={(value) => setView(value as 'week' | 'list')}
    options={[{ value: 'week', label: 'Tuần' }, { value: 'list', label: 'Danh sách' }]} />
   {term && <><Tag color={termPhase(term).color}>{termPhase(term).label}</Tag>
    <Typography.Text type="secondary">{dateText(term.startDate)} – {dateText(term.endDate)}</Typography.Text></>}
   {enrollments.isFetching && <Typography.Text type="secondary">Đang tải học kỳ…</Typography.Text>}
  </Space>
  {enrollments.error && <ErrorNotice error={enrollments.error} onRetry={() => { void enrollments.refetch() }} />}
  {timetable.isFetching && <p role="status">Đang tải thời khóa biểu…</p>}
  {timetable.error && <ErrorNotice error={timetable.error} onRetry={() => { void timetable.refetch() }} />}
  {!timetable.isFetching && !timetable.error && meetings.length === 0 && <Card><Empty description={term ? 'Học kỳ này chưa có lớp nào được xếp lịch.' : 'Chưa có dữ liệu thời khóa biểu.'}>
   <Link to="/portal/courses">Xem môn học của tôi</Link></Empty></Card>}
  {!timetable.error && meetings.length > 0 && (view === 'week'
   ? <WeekTimetable items={meetings} anchor={weekAnchor(term)} />
   : <div className="timetable-days">{groups.map((group) => <section className="timetable-day" key={group.day}>
    <header><Typography.Title level={2}>{group.day ? weekdayText(group.day) : 'Chưa xếp lịch'}</Typography.Title><span>{group.items.length} lớp</span></header>
    {group.items.map((item) => <div className="timetable-row" key={item.enrollmentId ?? item.sectionId}>
     <div className="timetable-time">
      <strong>{item.schedule?.startsAt ? `${clockText(item.schedule.startsAt)}–${clockText(item.schedule.endsAt)}` : 'Chưa xếp lịch'}</strong>
      <span>{item.schedule?.room ?? 'Chưa có phòng'}</span>
     </div>
     <div className="timetable-copy">
      <Typography.Text strong>{item.course?.title}</Typography.Text>
      <span>Lớp {item.sectionCode} · {item.course?.credits} tín chỉ</span>
      <span>Giảng viên: {item.facultyName ?? 'Chưa phân công'}</span>
     </div>
     <Space wrap><Tag>{sectionState[item.sectionStatus ?? ''] ?? item.sectionStatus}</Tag><Tag color={item.status === 'ENROLLED' ? 'cyan' : 'default'}>{enrollmentState[item.status ?? ''] ?? item.status}</Tag></Space>
    </div>)}
   </section>)}</div>)}
 </>
}
