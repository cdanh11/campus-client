const fieldLabels: Record<string, string> = {
 code: 'Mã', title: 'Tên', name: 'Tên', status: 'Trạng thái',
 createdAt: 'Ngày tạo', updatedAt: 'Cập nhật', startsAt: 'Bắt đầu', endsAt: 'Kết thúc', capacity: 'Sức chứa',
 registeredAt: 'Thời điểm đăng ký', borrowedAt: 'Ngày mượn', dueAt: 'Hạn trả', returnedAt: 'Ngày trả',
 assignedAt: 'Ngày nhận phòng', amount: 'Số tiền', chargeNumber: 'Mã khoản thu', dueDate: 'Hạn thanh toán',
 startDate: 'Ngày bắt đầu', endDate: 'Ngày kết thúc', studentNumber: 'Mã sinh viên', fullName: 'Họ tên',
 personnelNumber: 'Mã nhân sự', credits: 'Số tín chỉ', author: 'Tác giả', occurredAt: 'Thời điểm',
 recordedAt: 'Thời điểm ghi nhận', receiptNumber: 'Số biên nhận', email: 'Email', displayName: 'Tên hiển thị',
}
const directionLabels = { asc: 'tăng dần', desc: 'giảm dần' } as const

export function sortOptions(fields: string[], first?: string) {
 const all = fields.flatMap((field) => (['asc', 'desc'] as const).map((direction) => ({
  value: field + ',' + direction,
  label: (fieldLabels[field] ?? field) + ' ' + directionLabels[direction],
 })))
 return first ? [...all.filter((option) => option.value === first), ...all.filter((option) => option.value !== first)] : all
}
