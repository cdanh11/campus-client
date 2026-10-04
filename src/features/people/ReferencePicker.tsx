import { Button, Select, Space } from 'antd'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/runtime'
import { queryParams } from '../../api/query-params'
import { ErrorNotice } from '../../components/ErrorNotice'
import type { PageResult } from './contracts'
import type { RegistryRow } from './resources'

export function ReferencePicker({ kind, value, onChange, id, label }: {
 kind: 'organization' | 'identity'; value?: string; onChange?: (value?: string) => void; id?: string; label: string
}) {
 const [q, setQ] = useState('')
 const [page, setPage] = useState(0)
 const path = kind === 'organization' ? '/api/v1/admin/organization-units' : '/api/v1/admin/users'
 const params = queryParams({ q, page, size: 20, sort: kind === 'organization' ? 'code,asc' : 'email,asc', status: kind === 'organization' ? 'ACTIVE' : undefined })
 const list = useQuery({
  queryKey: ['reference', path, params],
  queryFn: ({ signal }) => api.request<PageResult<RegistryRow>>(path + '?' + params, { signal }),
 })
 const selected = useQuery({
  queryKey: ['reference-selected', path, value],
  queryFn: ({ signal }) => api.request<RegistryRow>(path + '/' + value, { signal }),
  enabled: !!value,
 })
 const labelFor = (row: RegistryRow) => kind === 'organization' ? String(row.code) + ' · ' + String(row.name) : String(row.email) + ' · ' + String(row.status)
 const rows = [...(list.data?.content ?? [])]
 if (selected.data && !rows.some((row) => row.id === selected.data?.id)) rows.unshift(selected.data)
 return <><Select
  id={id} aria-label={label} value={value || undefined} onChange={onChange}
  allowClear={kind === 'identity'} showSearch={{ filterOption: false, onSearch: (text) => { setQ(Array.from(text).slice(0, 100).join('')); setPage(0) } }}
  loading={list.isFetching} options={rows.map((row) => ({ value: row.id, label: labelFor(row) }))}
  placeholder="Tìm và chọn từ danh sách"
  popupRender={(menu) => <>{menu}{list.error && <ErrorNotice error={list.error} onRetry={() => { void list.refetch() }} />}
   <Space className="reference-pages"><Button size="small" disabled={page === 0 || list.isFetching} onClick={() => setPage(page - 1)}>Trước</Button><span>Trang {page + 1}</span><Button size="small" disabled={!list.data || page + 1 >= list.data.totalPages || list.isFetching} onClick={() => setPage(page + 1)}>Sau</Button></Space>
  </>}
 />{selected.error && <ErrorNotice error={selected.error} onRetry={() => { void selected.refetch() }} />}</>
}
