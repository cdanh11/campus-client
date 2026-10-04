import { Alert, Button, Space } from 'antd'
import { ApiError } from '../api/client'

const domainMessages: Record<string, string> = {
 NOTIFICATION_CODE_ALREADY_EXISTS: 'Mã mẫu thông báo đã được sử dụng.',
 NOTIFICATION_REFERENCE_UNAVAILABLE: 'Mẫu hoặc một tài khoản nhận không còn ACTIVE; chưa có thông báo nào được gửi.',
 INVALID_NOTIFICATION_STATE: 'Thông báo đã phát hành và không thể sửa hoặc phát hành lại.',
 DORMITORY_CODE_ALREADY_EXISTS: 'Mã đã tồn tại trong phạm vi ký túc xá tương ứng.',
 DORMITORY_REFERENCE_UNAVAILABLE: 'Tòa/phòng/giường chưa đủ điều kiện hoạt động.',
 INVALID_DORMITORY_STATE: 'Cần xử lý mục con hoặc chỗ ở hiện tại trước khi đổi trạng thái.',
 ACCOMMODATION_ALREADY_ASSIGNED: 'Sinh viên hoặc giường đã có chỗ ở hiện tại.',
 STUDENT_UNAVAILABLE: 'Sinh viên chưa đủ điều kiện nhận chỗ.',
 INVALID_ASSIGNMENT_STATE: 'Chỗ ở đã trả hoặc không thể chuyển trạng thái này.',
 FINANCE_CODE_ALREADY_EXISTS: 'Mã biểu phí, khoản thu hoặc biên nhận đã được sử dụng.',
 FINANCE_REFERENCE_UNAVAILABLE: 'Sinh viên hoặc biểu phí chưa đủ điều kiện tạo khoản thu.',
 INVALID_FINANCE_STATE: 'Khoản thu hoặc biên nhận không cho phép thao tác này. Kiểm tra thanh toán còn hiệu lực trước khi hủy.',
 PAYMENT_EXCEEDS_BALANCE: 'Số tiền vượt quá công nợ còn lại. Không có thanh toán mới được ghi nhận.',
 PROGRAM_CODE_ALREADY_EXISTS: 'Mã chương trình đã được sử dụng.',
 COURSE_CODE_ALREADY_EXISTS: 'Mã môn học đã được sử dụng.',
 ACADEMIC_RESOURCE_ALREADY_EXISTS: 'Bản ghi học vụ đã tồn tại. Với ghi danh đã hủy, mở bản ghi cũ để ghi danh lại.',
 ACADEMIC_REFERENCE_UNAVAILABLE: 'Tham chiếu học vụ chưa đủ điều kiện. Kiểm tra đơn vị, môn học, sinh viên và giảng viên hiện tại.',
 INVALID_ACADEMIC_STATE: 'Chưa đủ điều kiện chuyển trạng thái. Kiểm tra học kỳ, đợt mở môn và các lớp trực thuộc.',
 SECTION_CAPACITY_EXCEEDED: 'Lớp học phần đã hết chỗ. Không có ghi danh mới được tạo.',
 CONCURRENT_MODIFICATION: 'Dữ liệu hoặc trạng thái đã thay đổi. Tải lại để kiểm tra trước khi thao tác tiếp.',
 ORGANIZATION_UNIT_CODE_ALREADY_EXISTS: 'Mã đơn vị đã được sử dụng.',
 STUDENT_NUMBER_ALREADY_EXISTS: 'Mã sinh viên đã được sử dụng.',
 PERSONNEL_NUMBER_ALREADY_EXISTS: 'Mã nhân sự đã được sử dụng.',
 EMAIL_ALREADY_EXISTS: 'Email đã được sử dụng.',
 ORGANIZATION_UNIT_UNAVAILABLE: 'Đơn vị không còn hoạt động hoặc không tồn tại. Chọn đơn vị phù hợp.',
 IDENTITY_USER_UNAVAILABLE: 'Tài khoản liên kết không còn tồn tại. Kiểm tra lại liên kết.',
 SELF_MODIFICATION_NOT_ALLOWED: 'Bạn không thể thay đổi quyền, trạng thái hoặc mật khẩu của chính tài khoản này qua chức năng quản trị.',
 LAST_ACTIVE_ADMIN_REQUIRED: 'Hệ thống cần giữ ít nhất một quản trị viên đang hoạt động.',
}
export function ErrorNotice({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
 const status = error instanceof ApiError ? error.status : undefined
 const known = error instanceof ApiError && error.detail.code ? domainMessages[error.detail.code] : undefined
 const message = known ?? (status === 403 ? 'Tài khoản không có quyền thực hiện thao tác này.'
  : status === 401 ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
  : status === 404 ? 'Không tìm thấy dữ liệu yêu cầu.'
  : error instanceof ApiError ? error.message : 'Không thể kết nối máy chủ. Kiểm tra kết nối và thử lại.')
 return <Alert type="error" showIcon title={message} description={<Space wrap>
  {error instanceof ApiError && error.detail.code && <span>Mã lỗi: {error.detail.code}</span>}
  {error instanceof ApiError && error.detail.traceId && <span>Mã tra cứu: {error.detail.traceId}</span>}
  {onRetry && <Button onClick={onRetry}>Tải lại</Button>}
 </Space>} />
}
