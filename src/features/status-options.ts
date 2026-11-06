export const statusLabels: Record<string, string> = {
 ACTIVE: 'Đang hoạt động', INACTIVE: 'Ngừng hoạt động', SUSPENDED: 'Tạm khóa', DISABLED: 'Đã khóa',
 UNREAD: 'Chưa đọc', READ: 'Đã đọc',
 PLANNED: 'Sắp mở', DRAFT: 'Bản nháp', OPEN: 'Đang mở', CLOSED: 'Đã đóng', CANCELLED: 'Đã hủy', PUBLISHED: 'Đã phát hành',
 ENROLLED: 'Đang học', WITHDRAWN: 'Đã rút',
 RETURNED: 'Đã trả', REGISTERED: 'Đã đăng ký', ATTENDED: 'Đã tham dự',
 ASSIGNED: 'Đang ở', RELEASED: 'Đã trả chỗ',
 RECORDED: 'Đã ghi nhận', REVERSED: 'Đã đảo',
 RETURN: 'Đánh dấu đã trả', CANCEL: 'Hủy đăng ký', RESTORE: 'Khôi phục', ATTEND: 'Đánh dấu tham dự',
}
const statusTones: Record<string, string> = {
 ACTIVE: 'green', OPEN: 'green', ENROLLED: 'green', RETURNED: 'green', ATTENDED: 'green', RECORDED: 'green',
 ASSIGNED: 'blue', PUBLISHED: 'blue', PLANNED: 'gold', DRAFT: 'gold', REGISTERED: 'gold', SUSPENDED: 'gold', UNREAD: 'gold',
 CANCELLED: 'red', WITHDRAWN: 'red', REVERSED: 'red', OVERDUE: 'red', DISABLED: 'red',
}
export const statusText = (value: unknown) => statusLabels[String(value)] ?? String(value ?? '—')
export const statusColor = (value: unknown) => statusTones[String(value)] ?? 'default'
export const statusOptions = (values: readonly string[]) => values.map((value) => ({ value, label: statusLabels[value] ?? value }))
