import { Alert, Button, Card, Empty, Space, Tag, Typography } from 'antd'
import {
 ArrowRightOutlined, BookOutlined, CalendarOutlined, FileTextOutlined, HomeOutlined, IdcardOutlined, MailOutlined,
 NotificationOutlined, ReadOutlined, SolutionOutlined, SwapOutlined, TeamOutlined, WalletOutlined,
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { ErrorNotice } from '../../components/ErrorNotice'
import avatar from '../../assets/student-avatar.jpg'
import NewsBoard from './NewsBoard'
import {
 activeEnrollments, chargeState, dateText, daysAheadText, isMissingStudentProfile,
 moneyText, nextMeetings, openCharges, overdueCharges, scheduleText, studentState, totalCredits,
 useEnrollments, useFinance, useStudentProfile, useTimetable, type StudentProfile,
} from './student'

const policies = [
 { icon: <ReadOutlined />, tag: 'Học vụ', title: 'Quy chế học vụ', description: 'Đăng ký môn đúng thời gian, điều kiện dự thi và quy trình học lại, cải thiện điểm.', to: '/portal/courses', action: 'Xem môn học' },
 { icon: <WalletOutlined />, tag: 'Học phí', title: 'Học phí & miễn giảm', description: 'Theo dõi công nợ, hạn thanh toán và liên hệ Phòng Tài chính khi cần miễn giảm.', to: '/portal/finance', action: 'Xem học phí' },
 { icon: <NotificationOutlined />, tag: 'Sinh hoạt', title: 'Hoạt động & hỗ trợ', description: 'Sự kiện trong khuôn viên, thông báo chung và kênh hỗ trợ sinh viên.', to: '/portal/events', action: 'Xem sự kiện' },
]

const units = [
 { icon: <SolutionOutlined />, name: 'Phòng Công tác sinh viên', email: 'ctsv@sgu.edu.vn', phone: '(028) 3838 1234', location: 'Nhà A · Tầng 1', hours: 'Thứ 2–6, 8:00–16:30', description: 'Giấy xác nhận sinh viên, quy đổi tín chỉ, học bổng và hỗ trợ đời sống.' },
 { icon: <ReadOutlined />, name: 'Phòng Đào tạo', email: 'daotao@sgu.edu.vn', phone: '(028) 3838 2345', location: 'Nhà B · Tầng 2', hours: 'Thứ 2–6, 8:00–16:30', description: 'Đăng ký môn, chương trình học, bảng điểm và xác nhận kết quả học tập.' },
 { icon: <WalletOutlined />, name: 'Phòng Tài chính', email: 'taichinh@sgu.edu.vn', phone: '(028) 3838 3456', location: 'Nhà C · Tầng 1', hours: 'Thứ 2–6, 8:00–16:30', description: 'Học phí, biên lai, hoàn trả và các khoản thu của sinh viên.' },
 { icon: <BookOutlined />, name: 'Thư viện', email: 'thuvien@sgu.edu.vn', phone: '(028) 3838 4567', location: 'Nhà D · Tầng 1', hours: 'Thứ 2–6, 7:30–20:00', description: 'Mượn tài liệu, phòng đọc và hướng dẫn tra cứu học thuật.' },
 { icon: <TeamOutlined />, name: 'Trung tâm Hỗ trợ sinh viên', email: 'hotro@sgu.edu.vn', phone: '(028) 3838 5678', location: 'Nhà E · Tầng 1', hours: 'Thứ 2–6, 8:00–17:00', description: 'Tư vấn tâm lý, ký túc xá, việc làm và kỹ năng mềm.' },
]

const documents = [
 { icon: <IdcardOutlined />, title: 'Giấy xác nhận sinh viên', unit: 'Phòng Công tác sinh viên', email: 'ctsv@sgu.edu.vn', duration: '1–2 ngày làm việc', description: 'Xác nhận đang theo học, dùng cho tạm hoãn nghĩa vụ, vay vốn hoặc mở tài khoản.' },
 { icon: <FileTextOutlined />, title: 'Bảng điểm & xác nhận kết quả học tập', unit: 'Phòng Đào tạo', email: 'daotao@sgu.edu.vn', duration: '2–3 ngày làm việc', description: 'Bản điểm có đóng dấu hoặc xác nhận tín chỉ đã hoàn thành.' },
 { icon: <SwapOutlined />, title: 'Quy đổi tín chỉ', unit: 'Phòng Đào tạo', email: 'daotao@sgu.edu.vn', duration: '5–7 ngày làm việc', description: 'Công nhận môn đã học ở chương trình khác hoặc học phần tương đương.' },
 { icon: <HomeOutlined />, title: 'Xác nhận nội trú', unit: 'Trung tâm Hỗ trợ sinh viên', email: 'hotro@sgu.edu.vn', duration: '1–2 ngày làm việc', description: 'Xác nhận đang lưu trú tại ký túc xá của trường.' },
]

function requestMail(student: StudentProfile, unit: string, email: string, subject: string) {
 const body = [
  'Kính gửi ' + unit + ',',
  'Em là ' + student.fullName + ' (' + student.studentNumber + ')' + (student.programName ? ', ngành ' + student.programName : '') + '.',
  'Em xin gửi yêu cầu: ' + subject + '.',
  'Mong đơn vị hướng dẫn thủ tục và thời gian xử lý.',
  'Trân trọng.',
 ].join('\n')
 return 'mailto:' + email + '?subject=' + encodeURIComponent(subject + ' – ' + student.studentNumber) + '&body=' + encodeURIComponent(body)
}
function SectionHeading({ id, kicker, title, note }: { id: string; kicker: string; title: string; note?: string }) {
 return <div className="portal-section"><div>
  <Typography.Text className="section-kicker">{kicker}</Typography.Text>
  <Typography.Title level={2} id={id}>{title}</Typography.Title>
 </div>{note && <Typography.Text type="secondary">{note}</Typography.Text>}</div>
}
export default function PortalHome() {
 const profile = useStudentProfile()
 const student = profile.data?.studentNumber ? profile.data : null
 const timetable = useTimetable(undefined, !!student)
 const enrollments = useEnrollments(!!student)
 const finance = useFinance(!!student)
 if (profile.isFetching) return <p role="status">Đang tải hồ sơ sinh viên…</p>
 const missingProfile = isMissingStudentProfile(profile.error)
 if (profile.error && !missingProfile) return <ErrorNotice error={profile.error} onRetry={() => { void profile.refetch() }} />
 if (!student) return <>
  <Alert type="info" showIcon title={missingProfile ? 'Tài khoản chưa liên kết hồ sơ sinh viên' : 'Chưa có hồ sơ sinh viên'}
   description={missingProfile ? 'Bạn vẫn dùng được hộp thư và sự kiện. Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên và xem thời khóa biểu, học phí.' : 'Tài khoản này chưa được liên kết với hồ sơ sinh viên.'} />
  <NewsBoard />
 </>
 const items = enrollments.data?.items ?? []
 const currentTerm = timetable.data?.term
 const currentItems = currentTerm?.id ? activeEnrollments(items).filter((item) => item.term?.id === currentTerm.id) : []
 const upcoming = nextMeetings(currentItems)
 const outstanding = finance.data?.outstanding
 const unpaid = openCharges(finance.data)
 const overdue = overdueCharges(finance.data)
 return <>
  <section className="portal-id-card" aria-label="Thẻ sinh viên">
   <div className="portal-id-identity">
    <div className="portal-id-avatar">
     <img src={avatar} alt={'Ảnh đại diện của ' + student.fullName} />
     {student.cohort && <span className="portal-id-cohort">{student.cohort}</span>}
    </div>
    <div className="portal-id-copy">
     <Typography.Text className="portal-id-kicker">THẺ SINH VIÊN</Typography.Text>
     <Typography.Title level={1}>Xin chào, {student.fullName}</Typography.Title>
     <Space wrap className="portal-id-tags">
      <Tag>{student.studentNumber}</Tag>
      {student.status && <Tag>{studentState[student.status] ?? student.status}</Tag>}
      {student.programName && <Tag>{student.programName}</Tag>}
     </Space>
     <div className="portal-id-contact">
      {student.organizationUnitName && <span>{student.organizationUnitName}</span>}
      {student.email && <span>{student.email}</span>}
      {student.phone && <span>{student.phone}</span>}
     </div>
    </div>
   </div>
   <div className="portal-id-actions">
    <Link to="/portal/timetable"><Button type="primary" icon={<CalendarOutlined aria-hidden="true" />}>Xem thời khóa biểu</Button></Link>
    <Link to="/portal/finance"><Button icon={<WalletOutlined aria-hidden="true" />}>Học phí &amp; công nợ</Button></Link>
    <Link to="/portal/profile"><Button icon={<IdcardOutlined aria-hidden="true" />}>Cập nhật hồ sơ</Button></Link>
   </div>
  </section>
  {overdue.length > 0 && <Alert type="error" showIcon className="student-alert" title={`${overdue.length} khoản thu đã quá hạn`}
   description="Kiểm tra học phí và liên hệ phòng tài chính để hoàn tất thanh toán." action={<Link to="/portal/finance"><Button size="small" danger>Xem chi tiết</Button></Link>} />}
  <div className="portal-metrics">
   <Card className="metric-card metric-card-schedule"><span className="metric-icon"><CalendarOutlined /></span><Typography.Text type="secondary">Lớp sắp tới</Typography.Text>
    {upcoming[0] ? <><div className="metric-value">{upcoming[0].item.course?.title}</div><Typography.Text type="secondary">{daysAheadText(upcoming[0].daysAhead)} · {scheduleText(upcoming[0].item.schedule)}</Typography.Text></> : <Typography.Paragraph type="secondary" className="metric-empty">Chưa có lịch học sắp tới.</Typography.Paragraph>}</Card>
   <Card className="metric-card metric-card-credits"><span className="metric-icon"><BookOutlined /></span><Typography.Text type="secondary">Tín chỉ đang học</Typography.Text>
    <div className="metric-value">{totalCredits(items, currentTerm?.id ?? undefined)}</div><Typography.Text type="secondary">{currentTerm ? `${currentItems.length} lớp trong ${currentTerm.name}` : 'Đang xác định học kỳ hiện tại'}</Typography.Text></Card>
   <Card className="metric-card metric-card-fee"><span className="metric-icon"><WalletOutlined /></span><Typography.Text type="secondary">Học phí còn nợ</Typography.Text>
    <div className="metric-value">{outstanding === undefined ? '—' : moneyText(outstanding)}</div><Typography.Text type="secondary">{unpaid.length ? `${unpaid.length} khoản thu đang mở` : 'Không có khoản thu đang mở'}</Typography.Text></Card>
  </div>
  <div className="portal-home-grid">
   <Card title={<Space><CalendarOutlined /> Lịch học sắp tới</Space>} extra={<Link to="/portal/timetable">Toàn bộ lịch</Link>}>
    {timetable.isFetching && <p role="status">Đang tải thời khóa biểu…</p>}
    {timetable.error && <ErrorNotice error={timetable.error} onRetry={() => { void timetable.refetch() }} />}
    {!timetable.isFetching && !timetable.error && upcoming.length === 0 && <Empty description="Chưa có lịch học trong học kỳ này." />}
    {upcoming.map(({ item, daysAhead }) => <div className="meeting-row" key={item.enrollmentId ?? item.sectionId}>
     <div className="meeting-time">{daysAheadText(daysAhead)}<span>{scheduleText(item.schedule)}</span></div>
     <div className="meeting-copy"><Typography.Text strong>{item.course?.title}</Typography.Text><span>Lớp {item.sectionCode} · {item.facultyName}</span></div>
    </div>)}
   </Card>
   <Card title={<Space><WalletOutlined /> Khoản thu cần chú ý</Space>} extra={<Link to="/portal/finance">Học phí</Link>}>
    {finance.isFetching && <p role="status">Đang tải học phí…</p>}
    {finance.error && <ErrorNotice error={finance.error} onRetry={() => { void finance.refetch() }} />}
    {!finance.isFetching && !finance.error && unpaid.length === 0 && <Empty description="Không có khoản thu đang mở." />}
    {!finance.error && unpaid.slice(0, 3).map((charge) => <div className="charge-row" key={charge.id}>
     <div><Typography.Text strong>{charge.feeName}</Typography.Text><span>Hạn {dateText(charge.dueDate)}</span></div>
     <div className="charge-amount"><Typography.Text strong>{moneyText(charge.outstanding)}</Typography.Text><Tag color={charge.overdue ? 'red' : 'orange'}>{charge.overdue ? 'Quá hạn' : chargeState[charge.status ?? '']}</Tag></div>
    </div>)}
   </Card>
  </div>
  <NewsBoard />
  <section aria-labelledby="portal-policies-title">
   <SectionHeading id="portal-policies-title" kicker="CHÍNH SÁCH" title="Quy định bạn cần nắm" note="Cập nhật theo năm học" />
   <div className="policy-grid">{policies.map((policy) => <Card className="policy-card" key={policy.title}>
    <span className="policy-icon" aria-hidden="true">{policy.icon}</span>
    <Tag color="cyan">{policy.tag}</Tag>
    <Typography.Title level={3}>{policy.title}</Typography.Title>
    <Typography.Paragraph>{policy.description}</Typography.Paragraph>
    <Link className="text-action" to={policy.to}>{policy.action} <ArrowRightOutlined aria-hidden="true" /></Link>
   </Card>)}</div>
  </section>
  <section aria-labelledby="portal-units-title">
   <SectionHeading id="portal-units-title" kicker="LIÊN HỆ" title="Đơn vị & dịch vụ hỗ trợ" note="Thông tin liên hệ minh hoạ cho bản demo" />
   <div className="service-grid">{units.map((unit) => <Card className="service-card" key={unit.name}>
    <span className="service-icon" aria-hidden="true">{unit.icon}</span>
    <Typography.Title level={3}>{unit.name}</Typography.Title>
    <Typography.Paragraph>{unit.description}</Typography.Paragraph>
    <div className="service-meta">
     <a href={'mailto:' + unit.email}>{unit.email}</a>
     <a href={'tel:' + unit.phone.replace(/[^0-9+]/g, '')}>{unit.phone}</a>
     <span>{unit.location}</span>
     <span>{unit.hours}</span>
    </div>
   </Card>)}</div>
  </section>
  <section aria-labelledby="portal-documents-title">
   <SectionHeading id="portal-documents-title" kicker="MỘT CỬA" title="Yêu cầu giấy tờ" note="Gửi qua hòm thư đơn vị" />
   <div className="document-grid">
    {documents.map((document) => <Card className="document-card" key={document.title}>
     <span className="document-icon" aria-hidden="true">{document.icon}</span>
     <Space wrap className="document-heading"><Typography.Title level={3}>{document.title}</Typography.Title><Tag>{document.unit}</Tag></Space>
     <Typography.Paragraph className="document-description">{document.description}</Typography.Paragraph>
     <div className="document-footer">
      <Typography.Text type="secondary" className="document-duration">Thời gian xử lý dự kiến<strong>{document.duration}</strong></Typography.Text>
      <Button href={requestMail(student, document.unit, document.email, document.title)} icon={<MailOutlined aria-hidden="true" />}>Gửi yêu cầu</Button>
     </div>
    </Card>)}
   </div>
   <Typography.Paragraph type="secondary" className="portal-footnote">Bản demo chưa có quy trình duyệt trực tuyến. Nút gửi yêu cầu mở sẵn nội dung trong ứng dụng thư của bạn để gửi tới hòm thư đơn vị.</Typography.Paragraph>
  </section>
  <Card className="portal-actions" title="Đi tiếp" variant="borderless">
   <Space wrap>
    <Link to="/portal/courses"><Button icon={<BookOutlined />}>Môn học của tôi <ArrowRightOutlined /></Button></Link>
    <Link to="/portal/inbox"><Button>Hộp thư</Button></Link>
    <Link to="/portal/events"><Button>Sự kiện</Button></Link>
    <Link to="/portal/events?view=mine"><Button>Đăng ký của bạn</Button></Link>
   </Space>
  </Card>
 </>
}
