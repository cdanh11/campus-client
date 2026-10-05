import { LosslessNumber } from 'lossless-json'
import type { Rule } from 'antd/es/form'
import { queryParams } from '../../api/query-params'
import { instantNanos } from '../events/instant'
import { actionLimit, auditResources, reportConfig } from './config'
import type { AuditSource, ReportKind } from './contracts'
export type Filters = Record<string, unknown>
const optional = (filters: Filters, key: string) => {
 const value = filters[key]
 if (value === undefined || value === null || value === '') return undefined
 if (typeof value !== 'string') throw new Error('Bộ lọc không hợp lệ.')
 return value
}
export function uuid(value: unknown) {
 if (value === undefined || value === null || value === '') return
 if (typeof value !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value)) throw new Error('Nhập UUID đầy đủ.')
}
export const uuidRule: Rule = { validator: async (_, value: unknown) => { uuid(value) } }
export const optionalInstantRule: Rule = { validator: async (_, value: unknown) => { if (value) instantNanos(value) } }
export const untilRule: Rule = ({ getFieldValue }) => ({ validator: async (_, value: unknown) => {
 const from: unknown = getFieldValue('from')
 if (from && value && instantNanos(from) >= instantNanos(value)) throw new Error('Đến phải sau Từ.')
} })
function base(filters: Filters, page: number, size: number, sort: string, exportAll = false) {
 const params = new URLSearchParams(queryParams({ page, size, sort }))
 if (exportAll) { params.delete('page'); params.delete('size') }
 const from = optional(filters, 'from'), until = optional(filters, 'until')
 if (from) { instantNanos(from); params.set('from', from) }
 if (until) { instantNanos(until); params.set('until', until) }
 if (from && until && instantNanos(from) >= instantNanos(until)) throw new Error('Đến phải sau Từ.')
 return params
}
export function reportParams(kind: ReportKind, filters: Filters, page = 0, size = 20, sort = 'id,asc', exportAll = false) {
 if (!['id,asc', 'id,desc'].includes(sort)) throw new Error('Sắp xếp không hợp lệ.')
 const params = base(filters, page, size, sort, exportAll)
 for (const key of ['studentId', 'resourceId']) {
  const value = optional(filters, key)
  if (value) { uuid(value); if (key === 'resourceId' && !reportConfig[kind].reference) throw new Error('Báo cáo không hỗ trợ bộ lọc này.'); params.set(key, value) }
 }
 const status = optional(filters, 'status')
 if (status) { if (!reportConfig[kind].statuses?.includes(status)) throw new Error('Trạng thái không được hỗ trợ.'); params.set('status', status) }
 if (filters.overdueOnly === true) { if (kind !== 'LIBRARY_LOANS') throw new Error('Báo cáo không hỗ trợ quá hạn.'); params.set('overdueOnly', 'true') }
 return params.toString()
}
export function auditParams(source: AuditSource, filters: Filters, page = 0, size = 20, sort = 'occurredAt,desc') {
 if (!['occurredAt,asc', 'occurredAt,desc'].includes(sort)) throw new Error('Sắp xếp không hợp lệ.')
 const params = base(filters, page, size, sort)
 for (const key of ['targetId', 'actorId']) { const value = optional(filters, key); if (value) { uuid(value); params.set(key, value) } }
 const resource = optional(filters, 'resource'), action = optional(filters, 'action')
 if (resource) { if (!auditResources[source].includes(resource)) throw new Error('Tài nguyên không thuộc nguồn này.'); params.set('resource', resource) }
 if (action) { if (!/^[A-Z_]+$/.test(action) || action.length > actionLimit(source)) throw new Error('Action không hợp lệ cho nguồn này.'); params.set('action', action) }
 return params.toString()
}
// Aggregates can exceed the per-charge 19-digit limit. Never use Number or a fee limit here.
export function exactCount(value: unknown): bigint {
 if (typeof value === 'bigint') { if (value >= 0n) return value }
 else if (typeof value === 'number' && Number.isSafeInteger(value) && value >= 0) return BigInt(value)
 else if (value instanceof LosslessNumber && /^\d+(?:\.0+)?$/.test(value.toString())) return BigInt(value.toString().split('.')[0])
 throw new Error('Số liệu báo cáo không hợp lệ.')
}
export function metricText(value: unknown, money = false) {
 return new Intl.NumberFormat('vi-VN').format(exactCount(value)) + (money ? ' VND' : '')
}
