import { Button, Select, Space } from 'antd'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/runtime'
import { queryParams } from '../../api/query-params'
import { ErrorNotice } from '../../components/ErrorNotice'
import type { PageResult } from './contracts'
import type { RegistryRow } from './resources'
import { referenceSources, type ReferenceKind } from './references'

export function ReferencePicker({ kind, value, onChange, id, label, disabled, eligible = true, allowClear }: {
 kind: ReferenceKind; value?: string; onChange?: (value?: string) => void; id?: string; label: string; disabled?: boolean; eligible?: boolean; allowClear?: boolean
}) {
 const [q, setQ] = useState('')
 const [page, setPage] = useState(0)
 const source = referenceSources[kind]
 const path = source.path
 const params = queryParams({ ...(eligible ? source.eligible : {}), q: source.search === false ? undefined : q, page, size: 20, sort: source.sort })
 const list = useQuery({
  queryKey: ['reference', path, params],
  queryFn: ({ signal }) => api.request<PageResult<RegistryRow>>(path + '?' + params, { signal }),
  enabled: !disabled,
 })
 const selected = useQuery({
  queryKey: ['reference-selected', path, value],
  queryFn: ({ signal }) => api.request<RegistryRow>(path + '/' + value, { signal }),
  enabled: !!value,
 })
 const rows = [...(list.data?.content ?? [])]
 if (selected.data && !rows.some((row) => row.id === selected.data?.id)) rows.unshift(selected.data)
 return <><Select
  id={id} aria-label={label} value={value || undefined} onChange={onChange} disabled={disabled}
  allowClear={allowClear ?? kind === 'identity'} showSearch={source.search === false ? false : { filterOption: false, onSearch: (text) => { setQ(Array.from(text).slice(0, 100).join('')); setPage(0) } }}
  loading={list.isFetching || selected.isFetching} options={rows.map((row) => ({ value: row.id, title: source.label(row), disabled: eligible && source.available ? !source.available(row) : false, label: kind === 'offering' ? <OfferingSummary row={row} /> : source.label(row) }))}
  placeholder="Tìm và chọn từ danh sách"
  popupRender={(menu) => <>{menu}{list.error && <ErrorNotice error={list.error} onRetry={() => { void list.refetch() }} />}
   <Space className="reference-pages"><Button size="small" disabled={page === 0 || list.isFetching} onClick={() => setPage(page - 1)}>Trước</Button><span>Trang {page + 1}</span><Button size="small" disabled={!list.data || page + 1 >= list.data.totalPages || list.isFetching} onClick={() => setPage(page + 1)}>Sau</Button></Space>
  </>}
 />{selected.error && <ErrorNotice error={selected.error} onRetry={() => { void selected.refetch() }} />}</>
}
export function ReferenceLabel({ kind, value }: { kind: ReferenceKind; value: unknown }) {
 const source = referenceSources[kind]
 const selected = useQuery({
  queryKey: ['reference-selected', source.path, value],
  queryFn: ({ signal }) => api.request<RegistryRow>(source.path + '/' + String(value), { signal }),
  enabled: typeof value === 'string' && !!value,
 })
 if (!value) return <>—</>
 return <span title={String(value)}>{selected.data ? kind === 'offering' ? <OfferingSummary row={selected.data} /> : source.label(selected.data) : selected.error ? 'Không tải được tham chiếu' : 'Đang tải…'}</span>
}

function OfferingSummary({ row }: { row: RegistryRow }) {
 return <span><ReferenceLabel kind="course" value={row.courseId} /> · <ReferenceLabel kind="term" value={row.termId} /> · {String(row.status)}</span>
}
