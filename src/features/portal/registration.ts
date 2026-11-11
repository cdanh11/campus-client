import type { RegistrationSection, RegistrationWindow } from './student'

export const windowStateText: Record<string, string> = {
 OPEN: 'Đang trong thời gian đăng ký',
 NOT_OPEN: 'Chưa đến lượt đăng ký của khóa bạn',
 CLOSED: 'Đã hết thời gian đăng ký',
 NOT_CONFIGURED: 'Học kỳ chưa công bố lịch đăng ký',
 COHORT_MISSING: 'Chưa xác định được khóa học của bạn',
}

export const windowStateAlert: Record<string, 'success' | 'info' | 'warning' | 'error'> = {
 OPEN: 'success', NOT_OPEN: 'info', CLOSED: 'warning', NOT_CONFIGURED: 'info', COHORT_MISSING: 'warning',
}

export const blockedReasonText: Record<string, string> = {
 NOT_OPEN: 'Chưa đến lượt khóa',
 CLOSED: 'Đã hết hạn đăng ký',
 NOT_CONFIGURED: 'Chưa mở đăng ký',
 COHORT_MISSING: 'Thiếu thông tin khóa học',
 ALREADY_ENROLLED: 'Đã đăng ký',
 PREREQUISITE_NOT_MET: 'Chưa học môn tiên quyết',
 SCHEDULE_CONFLICT: 'Trùng lịch học',
 SECTION_FULL: 'Đã hết chỗ',
}

export const registrationOpen = (window?: RegistrationWindow | null) => window?.state === 'OPEN'

const slotFormatter = new Intl.DateTimeFormat('vi-VN', {
 timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric',
 hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
})

export function instantText(value?: string | null) {
 if (!value) return '—'
 const instant = new Date(value)
 return Number.isNaN(instant.getTime()) ? '—' : slotFormatter.format(instant)
}

export function slotRange(opensAt?: string | null, closesAt?: string | null) {
 if (!opensAt || !closesAt) return 'Chưa xác định'
 return `${instantText(opensAt)} → ${instantText(closesAt)}`
}

export const seatsText = (section?: RegistrationSection | null) =>
 section ? `${section.remaining ?? 0}/${section.capacity ?? 0} chỗ trống` : '—'

export const canPick = (section: RegistrationSection) => !!section.eligible
