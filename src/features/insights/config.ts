import type { AuditSource, ReportKind } from './contracts'
import type { ReferenceKind } from '../people/references'
export const auditResources: Record<AuditSource, string[]> = {
 IDENTITY: ['USER'], PEOPLE: ['ORGANIZATION_UNIT', 'STUDENT', 'FACULTY_STAFF'],
 ACADEMIC: ['PROGRAM', 'COURSE', 'TERM', 'COURSE_OFFERING', 'CLASS_SECTION', 'ENROLLMENT'],
 DORMITORY: ['BUILDING', 'ROOM', 'BED', 'ASSIGNMENT'], FINANCE: ['FEE', 'CHARGE', 'PAYMENT'],
 NOTIFICATION: ['TEMPLATE', 'NOTICE', 'DELIVERY'], EVENT: ['EVENT', 'REGISTRATION'], LIBRARY: ['TITLE', 'COPY', 'LOAN'],
}
export const actionLimit = (source: AuditSource) => source === 'IDENTITY' ? 64 : source === 'PEOPLE' || source === 'ACADEMIC' ? 32 : 16
export const reportConfig: Record<ReportKind, { label: string; columns: string[]; reference?: ReferenceKind; resourceLabel?: string; statuses?: string[] }> = {
 STUDENT_DEBT: { label: 'Công nợ sinh viên', columns: ['studentId', 'chargeCount', 'principalVnd', 'paidVnd', 'outstandingVnd'] },
 CURRENT_ACCOMMODATION: { label: 'Chỗ ở hiện tại', columns: ['id', 'studentId', 'bedId', 'roomId', 'buildingId', 'assignedAt'], reference: 'bed', resourceLabel: 'Giường' },
 SECTION_ENROLLMENT: { label: 'Ghi danh lớp học phần', columns: ['id', 'studentId', 'sectionId', 'offeringId', 'termId', 'courseId', 'status', 'updatedAt'], reference: 'section', resourceLabel: 'Lớp học phần', statuses: ['ENROLLED', 'WITHDRAWN'] },
 EVENT_MEMBERSHIP: { label: 'Tham gia sự kiện', columns: ['id', 'eventId', 'studentId', 'eventCode', 'eventTitle', 'status', 'registeredAt', 'cancelledAt', 'attendedAt'], reference: 'event', resourceLabel: 'Sự kiện', statuses: ['REGISTERED', 'CANCELLED', 'ATTENDED'] },
 LIBRARY_LOANS: { label: 'Sách đang mượn', columns: ['id', 'studentId', 'copyId', 'titleId', 'copyCode', 'title', 'borrowedAt', 'dueAt', 'overdue'], reference: 'bookCopy', resourceLabel: 'Bản sao' },
}
export const reportReferences: Record<ReportKind, Partial<Record<string, ReferenceKind>>> = {
 STUDENT_DEBT: { studentId: 'student' },
 CURRENT_ACCOMMODATION: { studentId: 'student', bedId: 'bed', roomId: 'room', buildingId: 'building' },
 SECTION_ENROLLMENT: { studentId: 'student', sectionId: 'section', offeringId: 'offering', termId: 'term', courseId: 'course' },
 EVENT_MEMBERSHIP: { eventId: 'event', studentId: 'student' },
 LIBRARY_LOANS: { studentId: 'student', copyId: 'bookCopy', titleId: 'bookTitle' },
}
export const columnLabels: Record<string, string> = {
 id: 'Mã bản ghi', studentId: 'Sinh viên', chargeCount: 'Số khoản thu', principalVnd: 'Gốc VND', paidVnd: 'Đã trả VND', outstandingVnd: 'Còn nợ VND',
 bedId: 'Giường', roomId: 'Phòng', buildingId: 'Tòa nhà', assignedAt: 'Nhận chỗ',
 sectionId: 'Lớp học phần', offeringId: 'Đợt mở môn', termId: 'Học kỳ', courseId: 'Môn học', status: 'Trạng thái', updatedAt: 'Cập nhật',
 eventId: 'Sự kiện', eventCode: 'Mã sự kiện', eventTitle: 'Tên sự kiện', registeredAt: 'Đăng ký', cancelledAt: 'Hủy', attendedAt: 'Tham dự',
 copyId: 'Bản sao', titleId: 'Đầu sách', copyCode: 'Mã bản sao', title: 'Tên sách', borrowedAt: 'Mượn', dueAt: 'Hạn trả', overdue: 'Quá hạn',
}
