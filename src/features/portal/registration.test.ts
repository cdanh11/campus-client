import { expect, it } from 'vitest'
import { blockedReasonText, instantText, registrationOpen, seatsText, slotRange, windowStateAlert, windowStateText } from './registration'
import type { RegistrationWindow } from './student'

const window = (state: string): RegistrationWindow => ({ state })

it('only treats an OPEN window as accepting changes', () => {
 expect(windowStateText.OPEN).toBe('Đang trong thời gian đăng ký')
 expect(windowStateText.NOT_OPEN).toBe('Chưa đến lượt đăng ký của khóa bạn')
 expect(windowStateAlert.NOT_CONFIGURED).toBe('info')
 expect(registrationOpen(window('OPEN'))).toBe(true)
 expect(registrationOpen(window('NOT_OPEN'))).toBe(false)
 expect(registrationOpen(window('CLOSED'))).toBe(false)
 expect(registrationOpen(null)).toBe(false)
})

it('formats cohort slots in campus time', () => {
 expect(instantText('2026-11-07T02:00:00Z')).toBe('09:00 07/11/2026')
 expect(slotRange('2026-11-07T02:00:00Z', '2026-11-09T02:00:00Z')).toBe('09:00 07/11/2026 → 09:00 09/11/2026')
 expect(slotRange(undefined, undefined)).toBe('Chưa xác định')
 expect(instantText('not-a-date')).toBe('—')
})

it('explains blocked sections and shows remaining seats', () => {
 expect(blockedReasonText.PREREQUISITE_NOT_MET).toBe('Chưa học môn tiên quyết')
 expect(blockedReasonText.SCHEDULE_CONFLICT).toBe('Trùng lịch học')
 expect(blockedReasonText.SECTION_FULL).toBe('Đã hết chỗ')
 expect(seatsText({ remaining: 2, capacity: 40 })).toBe('2/40 chỗ trống')
 expect(seatsText(null)).toBe('—')
})
