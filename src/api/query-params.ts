export interface PageFilters {
 page: number
 size: number
 q?: string
 status?: string
 sort: string
 role?: string
 personnelType?: string
}
export function queryParams(filters: PageFilters): string {
 if (!Number.isSafeInteger(filters.page) || filters.page < 0 ||
  !Number.isSafeInteger(filters.size) || filters.size < 1 || filters.size > 100 ||
  filters.page * filters.size > 2147483647) throw new Error('Phân trang không hợp lệ.')
 const params = new URLSearchParams({
  page: String(filters.page), size: String(filters.size), sort: filters.sort,
 })
 for (const key of ['q', 'status', 'role', 'personnelType'] as const) {
  const value = filters[key]
  if (value !== undefined && value !== '') params.set(key, value)
 }
 return params.toString()
}
// Ant Design pagination needs a safe Number; never silently round a long count.
export function safePageTotal(value: number | bigint): number {
 if (typeof value === 'bigint') {
  if (value < 0n || value > BigInt(Number.MAX_SAFE_INTEGER)) throw new Error('Danh sách vượt giới hạn hiển thị. Hãy thu hẹp bộ lọc.')
  return Number(value)
 }
 if (!Number.isSafeInteger(value) || value < 0) throw new Error('Số lượng kết quả không hợp lệ.')
 return value
}
