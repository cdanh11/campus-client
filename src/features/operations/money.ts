import { LosslessNumber } from 'lossless-json'
import type { Rule } from 'antd/es/form'
export const maxVnd = 9999999999999999999n
export function integerVnd(value: unknown): bigint {
 let amount: bigint
 if (typeof value === 'bigint') amount = value
 else if (typeof value === 'number' && Number.isSafeInteger(value)) amount = BigInt(value)
 else {
  const raw = value instanceof LosslessNumber ? value.toString() : value
  if (typeof raw !== 'string' || !/^\d+(?:\.0+)?$/.test(raw) || raw.length > 100) throw new Error('Số tiền VND không hợp lệ.')
  amount = BigInt(raw.split('.')[0])
 }
 if (amount < 0n || amount > maxVnd) throw new Error('Số tiền VND ngoài giới hạn.')
 return amount
}
export function paymentAmount(value: unknown): bigint {
 if (typeof value !== 'string' || !/^\d{1,19}$/.test(value)) throw new Error('Nhập số tiền nguyên VND từ 1 đến 9999999999999999999.')
 const amount = integerVnd(value)
 if (amount === 0n) throw new Error('Số tiền phải lớn hơn 0.')
 return amount
}
export function formatVnd(value: unknown): string { return new Intl.NumberFormat('vi-VN').format(integerVnd(value)) + ' VND' }
export const amountRule: Rule = { validator: async (_, value: unknown) => { paymentAmount(value) } }
