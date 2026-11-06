import { Alert, Card, Empty, Space, Tag, Typography } from 'antd'
import { WarningOutlined, WalletOutlined } from '@ant-design/icons'
import { CampusTime } from '../../components/CampusTime'
import { ErrorNotice } from '../../components/ErrorNotice'
import { dateText, isMissingStudentProfile, moneyText, paymentState, useFinance, useStudentProfile } from './student'

export default function FinancePage() {
 const profile = useStudentProfile()
 const student = !!profile.data?.studentNumber
 const finance = useFinance(student)
 if (profile.isFetching) return <p role="status">Đang tải hồ sơ sinh viên…</p>
 if (isMissingStudentProfile(profile.error)) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên liên kết"
  description="Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên trước khi xem học phí." />
 if (profile.error) return <ErrorNotice error={profile.error} onRetry={() => { void profile.refetch() }} />
 if (!student) return <Alert type="info" showIcon title="Chưa có hồ sơ sinh viên" description="Tài khoản này chưa được liên kết với hồ sơ sinh viên." />

 const summary = finance.data
 const charges = summary?.charges ?? []
 const overdue = charges.filter((charge) => charge.status === 'OPEN' && charge.overdue)
 return <>
  <div className="page-heading"><div>
   <Typography.Title level={1}>Học phí của bạn</Typography.Title>
   <Typography.Paragraph type="secondary">Tổng hợp khoản thu, số đã thanh toán và công nợ còn lại theo dữ liệu phòng tài chính.</Typography.Paragraph>
  </div></div>
  {finance.isFetching && <p role="status">Đang tải học phí…</p>}
  {finance.error && <ErrorNotice error={finance.error} onRetry={() => { void finance.refetch() }} />}
  {overdue.length > 0 && <Alert type="error" showIcon icon={<WarningOutlined />} className="student-alert" title={`${overdue.length} khoản thu đã quá hạn`}
   description="Vui lòng liên hệ phòng tài chính để hoàn tất thanh toán. Số tiền hiển thị là công nợ còn lại tại thời điểm tải trang." />}
  <div className="portal-metrics">
   <Card className="metric-card"><span className="metric-icon"><WalletOutlined /></span><Typography.Text type="secondary">Tổng phải trả</Typography.Text><div className="metric-value">{summary?.currency === 'VND' ? moneyText(summary.totalCharged) : '—'}</div><Typography.Text type="secondary">Các khoản thu còn hiệu lực</Typography.Text></Card>
   <Card className="metric-card"><span className="metric-icon"><WalletOutlined /></span><Typography.Text type="secondary">Đã thanh toán</Typography.Text><div className="metric-value">{summary?.currency === 'VND' ? moneyText(summary.totalPaid) : '—'}</div><Typography.Text type="secondary">Biên nhận đã ghi nhận</Typography.Text></Card>
   <Card className="metric-card metric-card-accent"><span className="metric-icon"><WalletOutlined /></span><Typography.Text type="secondary">Còn nợ</Typography.Text><div className="metric-value">{summary?.currency === 'VND' ? moneyText(summary.outstanding) : '—'}</div><Typography.Text type="secondary">{summary?.asOf ? <>Cập nhật <CampusTime value={summary.asOf} /></> : 'Chưa có dữ liệu công nợ'}</Typography.Text></Card>
  </div>
  {!finance.isFetching && !finance.error && charges.length === 0 && <Card><Empty description="Chưa có khoản thu nào." /></Card>}
  <div className="finance-charges">{!finance.error && charges.map((charge) => <Card key={charge.id} className="finance-charge"
   title={<Space wrap><Typography.Text strong>{charge.feeName}</Typography.Text><Tag>{charge.chargeNumber}</Tag>
    {charge.status === 'CANCELLED' ? <Tag>Đã hủy</Tag> : charge.overdue ? <Tag color="red">Quá hạn</Tag> : <Tag color="orange">Còn nợ</Tag>}</Space>}>
   <div className="charge-figures">
    <div><Typography.Text type="secondary">Số tiền</Typography.Text><strong>{moneyText(charge.amount)}</strong></div>
    <div><Typography.Text type="secondary">Đã thanh toán</Typography.Text><strong>{moneyText(charge.paid)}</strong></div>
    <div><Typography.Text type="secondary">Còn lại</Typography.Text><strong>{moneyText(charge.outstanding)}</strong></div>
    <div><Typography.Text type="secondary">Hạn thanh toán</Typography.Text><strong className={charge.overdue ? 'overdue' : undefined}>{dateText(charge.dueDate)}</strong></div>
   </div>
   {charge.payments?.length ? <div className="payment-list"><Typography.Text className="section-kicker">LỊCH SỬ THANH TOÁN</Typography.Text>
    {charge.payments.map((payment) => <div className="payment-row" key={payment.id}>
     <div><Typography.Text strong>{payment.receiptNumber}</Typography.Text><span><CampusTime value={payment.recordedAt} /></span>{payment.reversedAt && <span>Đảo lúc <CampusTime value={payment.reversedAt} />{payment.reversalReason ? ` · ${payment.reversalReason}` : ''}</span>}</div>
     <div className="charge-amount"><Typography.Text strong>{moneyText(payment.amount)}</Typography.Text><Tag color={payment.status === 'RECORDED' ? 'green' : 'default'}>{paymentState[payment.status ?? ''] ?? payment.status}</Tag></div>
    </div>)}
   </div> : <Typography.Text type="secondary">Chưa có thanh toán cho khoản thu này.</Typography.Text>}
  </Card>)}</div>
 </>
}
