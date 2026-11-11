import { useState } from 'react'
import { Alert, Button, Card, Empty, Space, Statistic, Tag, Typography } from 'antd'
import { useMutation } from '@tanstack/react-query'
import { api, queryClient } from '../../api/runtime'
import { ErrorNotice } from '../../components/ErrorNotice'
import { PageChrome } from '../../components/PageChrome'
import {
 dateText, isMissingStudentProfile, registrationPath, scheduleSlotText, scheduleText, useRegistration, useStudentProfile,
} from './student'
import { blockedReasonText, instantText, registrationOpen, seatsText, slotRange, windowStateAlert, windowStateText } from './registration'

export default function RegistrationPage() {
 const profile = useStudentProfile()
 const student = !!profile.data?.studentNumber
 const registration = useRegistration(student)
 const [pending, setPending] = useState<string | null>(null)
 const invalidate = () => {
  void queryClient.invalidateQueries({ queryKey: ['me', 'registration'] })
  void queryClient.invalidateQueries({ queryKey: ['me', 'enrollments'] })
  void queryClient.invalidateQueries({ queryKey: ['me', 'timetable'] })
  void queryClient.invalidateQueries({ queryKey: ['me', 'transcript'] })
  void queryClient.invalidateQueries({ queryKey: ['me', 'curriculum'] })
 }
 const register = useMutation({
  mutationFn: (sectionId: string) => api.mutation(registrationPath, 'POST', { sectionId }),
  onMutate: (sectionId) => setPending(sectionId),
  onSettled: () => setPending(null),
  onSuccess: invalidate,
 })
 const withdraw = useMutation({
  mutationFn: (enrollmentId: string) => api.mutation<void>(registrationPath + '/' + enrollmentId, 'DELETE'),
  onMutate: (enrollmentId) => setPending(enrollmentId),
  onSettled: () => setPending(null),
  onSuccess: invalidate,
 })

 if (profile.isFetching && !profile.data) return <p role="status">Đang tải hồ sơ sinh viên…</p>
 if (isMissingStudentProfile(profile.error)) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên liên kết"
  description="Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên trước khi đăng ký môn." />
 if (profile.error) return <ErrorNotice error={profile.error} onRetry={() => { void profile.refetch() }} />
 if (!student) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên" description="Tài khoản này chưa được liên kết với hồ sơ sinh viên." />

 const data = registration.data
 const registrationWindow = data?.window
 const open = registrationOpen(registrationWindow)
 const sections = data?.sections ?? []
 const enrolled = data?.enrolled ?? []
 const available = sections.filter((section) => section.eligible).length
 const closedReason = registrationWindow?.state ?? ''
 const sectionStateText = (section: (typeof sections)[number]) => {
  const reason = section.blockedReason || (open ? '' : closedReason)
  return (blockedReasonText[reason] ?? windowStateText[reason] ?? reason) || 'Không thể chọn'
 }

 return <PageChrome eyebrow="ĐĂNG KÝ HỌC PHẦN" title="Đăng ký môn"
  description="Chọn lớp học phần trong học kỳ đang mở. Mỗi khóa vào theo lượt riêng, cách nhau hai ngày, khóa cũ trước.">
  {registration.isFetching && !data && <p role="status">Đang tải đợt đăng ký…</p>}
  {registration.error && <ErrorNotice error={registration.error} onRetry={() => { void registration.refetch() }} />}
  {register.error && <ErrorNotice error={register.error} />}
  {withdraw.error && <ErrorNotice error={withdraw.error} />}
  {data && !registrationWindow && <Alert type="info" showIcon title="Chưa có học kỳ đang hoạt động"
   description="Phòng học vụ chưa công bố học kỳ hoặc lịch đăng ký. Theo dõi thông báo để biết thời điểm mở." />}
  {data && registrationWindow && <>
   <Alert className="registration-banner" type={windowStateAlert[registrationWindow.state ?? ''] ?? 'info'} showIcon
    title={windowStateText[registrationWindow.state ?? ''] ?? registrationWindow.state}
    description={`${registrationWindow.termName} (${registrationWindow.termCode}) · ${dateText(registrationWindow.termStartDate)} – ${dateText(registrationWindow.termEndDate)}`} />

   <div className="registration-meta">
    <Card><Statistic title="Khóa của bạn" value={data.cohort ?? '—'} /><Typography.Text type="secondary">{data.programName ?? 'Chưa gán chương trình'}</Typography.Text></Card>
    <Card><Statistic title="Lượt đăng ký của bạn" value={slotRange(registrationWindow.slotOpensAt, registrationWindow.slotClosesAt)} /></Card>
    <Card><Statistic title="Cửa sổ chung" value={slotRange(registrationWindow.opensAt, registrationWindow.closesAt)} /></Card>
   </div>

   <Card className="registration-card" title="Lịch mở theo khóa" extra={<Tag>{registrationWindow.slots?.length ?? 0} khóa</Tag>}>
    <div className="cohort-list">
     {(registrationWindow.slots ?? []).map((slot) => <div className={'cohort-slot' + (slot.current ? ' current' : '')} key={slot.cohort}>
      <Tag color={slot.current ? 'cyan' : 'default'}>{slot.label ?? slot.cohort}</Tag>
      <span>{slotRange(slot.opensAt, slot.closesAt)}</span>
     </div>)}
    </div>
    <Typography.Paragraph type="secondary" className="registration-hint">
     K21 và các khóa trước vào chung đợt đầu; mỗi khóa kế tiếp mở sau hai ngày và giữ chỗ đến hết cửa sổ chung.
    </Typography.Paragraph>
   </Card>

   <Card className="registration-card" title="Lớp đang mở" extra={<Tag color={open ? 'cyan' : 'default'}>{available} lớp có thể chọn</Tag>}>
    {sections.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Học kỳ này chưa có lớp đang mở." /> : <div className="registration-list">
     {sections.map((section) => <div className={'registration-row' + (section.enrolled ? ' enrolled' : '')} key={section.sectionId}>
      <div className="registration-copy">
       <strong>{section.courseTitle}</strong>
       <span>{section.courseCode} · {section.credits} tín chỉ · Lớp {section.sectionCode}</span>
       <span>{scheduleText(section.schedule)} · {section.facultyName ?? 'Chưa phân công giảng viên'}</span>
       {section.prerequisiteCourseCode && <span className="registration-note">Tiên quyết: {section.prerequisiteCourseCode} · {section.prerequisiteCourseTitle}</span>}
      </div>
      <div className="registration-seats"><strong>{seatsText(section)}</strong><span>Sức chứa {section.capacity ?? 0}</span></div>
      {section.eligible && section.sectionId && open
       ? <Button type="primary" loading={register.isPending && pending === section.sectionId}
          disabled={register.isPending || withdraw.isPending} onClick={() => section.sectionId && register.mutate(section.sectionId)}>Đăng ký</Button>
       : <Tag color={section.enrolled ? 'green' : 'default'}>{sectionStateText(section)}</Tag>}
     </div>)}
    </div>}
   </Card>

   <Card className="registration-card" title="Đã đăng ký trong học kỳ" extra={<Tag>{enrolled.length} lớp</Tag>}>
    {enrolled.length === 0 ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Bạn chưa đăng ký lớp nào trong học kỳ này." /> : <div className="registration-list">
     {enrolled.map((item) => <div className="registration-row" key={item.enrollmentId}>
      <div className="registration-copy">
       <strong>{item.course?.title}</strong>
       <span>{item.course?.code} · {item.course?.credits} tín chỉ · Lớp {item.sectionCode}</span>
       <span>{scheduleSlotText(item.schedule)} · {item.facultyName ?? 'Chưa phân công giảng viên'}</span>
      </div>
      <Space wrap>
       <Tag color="green">Đã ghi danh</Tag>
       <Button danger disabled={!open || register.isPending} loading={withdraw.isPending && pending === item.enrollmentId}
        onClick={() => item.enrollmentId && withdraw.mutate(item.enrollmentId)}>Rút</Button>
      </Space>
     </div>)}
    </div>}
    <Typography.Paragraph type="secondary" className="registration-hint">
     Chỉ rút được trong lượt đăng ký đang mở; sau khi hết hạn, liên hệ phòng học vụ để xử lý ngoại lệ.
    </Typography.Paragraph>
   </Card>
   <Typography.Text type="secondary" className="registration-footnote">Lượt của bạn mở lúc {instantText(registrationWindow.slotOpensAt)}.</Typography.Text>
  </>}
 </PageChrome>
}
