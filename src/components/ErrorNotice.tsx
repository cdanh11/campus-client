import { Alert, Button, Space } from 'antd'
import { ApiError } from '../api/client'

export function ErrorNotice({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
 const status = error instanceof ApiError ? error.status : undefined
 const message = status === 409
  ? 'Dữ liệu hoặc trạng thái đã thay đổi. Tải lại để kiểm tra trước khi thao tác tiếp.'
  : status === 403 ? 'Tài khoản không có quyền thực hiện thao tác này.'
  : status === 401 ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.'
  : status === 404 ? 'Không tìm thấy dữ liệu yêu cầu.'
  : error instanceof ApiError ? error.message : 'Không thể kết nối máy chủ. Kiểm tra kết nối và thử lại.'
 return <Alert type="error" showIcon title={message} description={<Space wrap>
  {error instanceof ApiError && error.detail.code && <span>Mã lỗi: {error.detail.code}</span>}
  {error instanceof ApiError && error.detail.traceId && <span>Mã tra cứu: {error.detail.traceId}</span>}
  {onRetry && <Button onClick={onRetry}>Tải lại</Button>}
 </Space>} />
}
