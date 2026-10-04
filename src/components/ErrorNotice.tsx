import { Alert, Button, Space } from 'antd'
import { ApiError } from '../api/client'

const domainMessages: Record<string, string> = {
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
