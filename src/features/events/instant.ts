import type { Rule } from 'antd/es/form'
export function instantNanos(value: unknown): bigint {
 if (typeof value !== 'string') throw new Error('Nhập UTC, ví dụ 2026-12-01T09:00:00Z.')
 const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?Z$/.exec(value)
 if (!match) throw new Error('Nhập UTC, ví dụ 2026-12-01T09:00:00Z.')
 const [, year, month, day, hour, minute, second, fraction = ''] = match
 const date = new Date(0)
 date.setUTCFullYear(Number(year), Number(month) - 1, Number(day))
 date.setUTCHours(Number(hour), Number(minute), Number(second), 0)
 if (date.getUTCFullYear() !== Number(year) || date.getUTCMonth() !== Number(month) - 1 || date.getUTCDate() !== Number(day) || date.getUTCHours() !== Number(hour) || date.getUTCMinutes() !== Number(minute) || date.getUTCSeconds() !== Number(second)) throw new Error('Ngày hoặc giờ UTC không hợp lệ.')
 return BigInt(date.getTime()) * 1000000n + BigInt(fraction.padEnd(9, '0'))
}
export const instantRule: Rule = { validator: async (_, value: unknown) => { instantNanos(value) } }
export const eventEndRule: Rule = ({ getFieldValue }) => ({ validator: async (_, value: unknown) => {
 const start: unknown = getFieldValue('startsAt')
 if (start && value && instantNanos(start) >= instantNanos(value)) throw new Error('Kết thúc phải sau bắt đầu.')
} })
