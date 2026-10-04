import { useEffect, useState, type ReactNode } from 'react'
import { App as AntApp, Button, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api, queryClient } from '../../api/runtime'
import { ApiError } from '../../api/client'
import { queryParams, safePageTotal } from '../../api/query-params'
import { ErrorNotice } from '../../components/ErrorNotice'
import { ReferenceLabel, ReferencePicker } from './ReferencePicker'
import { labels, type RegistryRow, type Resource, type Values } from './resources'
import { referenceSources, type ReferenceKind } from './references'
import type { PageResult } from './contracts'

const referenceKind = (type: string): type is ReferenceKind => type in referenceSources

export function RegistryPage({ resource, rowActions }: { resource: Resource; rowActions?: (row: RegistryRow) => ReactNode }) {
 const [filters, setFilters] = useState({ page: 0, size: 20, q: '', status: '', personnelType: '', sort: resource.sorts[0].value })
 const [referenceFilters, setReferenceFilters] = useState<Record<string, string | undefined>>({})
 const [edit, setEdit] = useState<{ id?: string } | null>(null)
 const params = queryParams({ ...filters, ...referenceFilters })
 const result = useQuery({
  queryKey: ['registry', resource.path, params],
  select: (data: PageResult<RegistryRow>) => ({ ...data, totalElements: safePageTotal(data.totalElements) }),
  queryFn: ({ signal }) => api.request<PageResult<RegistryRow>>(resource.path + '?' + params, { signal }),
 })
 const total = result.data?.totalElements ?? 0
 const states = resource.states ?? [{ value: 'ACTIVE', label: 'Đang hoạt động' }, { value: 'INACTIVE', label: 'Ngừng hoạt động' }]
 return <>
  <div className="page-heading"><div><Typography.Title level={1}>{resource.title}</Typography.Title><Typography.Paragraph type="secondary">Tra cứu và quản lý theo dữ liệu hiện tại.</Typography.Paragraph></div><Button type="primary" onClick={() => setEdit({})}>Thêm {resource.singular}</Button></div>
  {resource.note && <Typography.Paragraph>{resource.note}</Typography.Paragraph>}
  <Space wrap className="list-filters">
   {resource.search !== false && <Input.Search aria-label="Tìm kiếm" placeholder="Tìm mã, tên…" maxLength={100} allowClear onSearch={(q) => setFilters({ ...filters, q, page: 0 })} style={{ width: 260 }} />}
   <Select aria-label="Lọc trạng thái" value={filters.status} onChange={(status) => setFilters({ ...filters, status, page: 0 })} options={[{ value: '', label: 'Tất cả trạng thái' }, ...states]} style={{ minWidth: 180 }} />
   {resource.fields.some((field) => field.name === 'personnelType') && <Select aria-label="Lọc loại nhân sự" value={filters.personnelType}
    onChange={(personnelType) => setFilters({ ...filters, personnelType, page: 0 })}
    options={[{ value: '', label: 'Tất cả nhân sự' }, { value: 'FACULTY', label: 'Giảng viên' }, { value: 'STAFF', label: 'Nhân viên' }]} style={{ minWidth: 180 }} />}
   {resource.filters?.map((field) => referenceKind(field.type) && <div key={field.name} style={{ minWidth: 220 }}>
    <ReferencePicker kind={field.type} label={field.label} value={referenceFilters[field.name]} eligible={false} allowClear
     onChange={(value) => { setReferenceFilters({ ...referenceFilters, [field.name]: value }); setFilters({ ...filters, page: 0 }) }} />
   </div>)}
   <Select aria-label="Sắp xếp" value={filters.sort} onChange={(sort) => setFilters({ ...filters, sort, page: 0 })} options={resource.sorts} style={{ minWidth: 160 }} />
  </Space>
  {result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  <Table<RegistryRow> rowKey="id" loading={result.isFetching} dataSource={result.data?.content ?? []} scroll={{ x: 850 }}
   columns={[
    ...resource.columns.map((column) => ({ title: column.title, key: column.key, dataIndex: column.key, render: (value: unknown) => column.format ? column.format(value) : column.reference
     ? <ReferenceLabel kind={column.reference} value={value} />
     : resource.fields.find((field) => field.name === column.key)?.options?.find((option) => option.value === value)?.label ?? String(value ?? '—') })),
    { title: 'Trạng thái', dataIndex: 'status', render: (value: unknown) => <Tag color={value === 'ACTIVE' || value === 'OPEN' || value === 'ENROLLED' ? 'green' : 'default'}>{labels[String(value)] ?? String(value)}</Tag> },
    { title: 'Thao tác', key: 'actions', render: (_, row) => <Space wrap><Button onClick={() => setEdit({ id: row.id })}>Xem / sửa</Button>{rowActions?.(row)}</Space> },
   ]}
   locale={{ emptyText: 'Chưa có bản ghi phù hợp.' }}
   pagination={{ current: filters.page + 1, pageSize: filters.size, total, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100], onChange: (page, size) => setFilters({ ...filters, page: page - 1, size }) }}
  />
  {edit && <RegistryEditor key={edit.id ?? 'create'} resource={resource} id={edit.id} onClose={() => setEdit(null)} />}
 </>
}
function RegistryEditor({ resource, id, onClose }: { resource: Resource; id?: string; onClose: () => void }) {
 const { modal } = AntApp.useApp()
 const [form] = Form.useForm<Values>()
 const detail = useQuery({
  queryKey: ['registry-detail', resource.path, id],
  queryFn: ({ signal }) => api.request<RegistryRow>(resource.path + '/' + id, { signal }),
  enabled: !!id, staleTime: 0, refetchOnMount: 'always', refetchOnWindowFocus: false, refetchOnReconnect: false,
 })
 useEffect(() => { if (detail.data && !detail.isFetching) form.setFieldsValue(resource.editValues?.(detail.data) ?? detail.data) }, [detail.data, detail.isFetching, form, resource])
 const mutation = useMutation({
  mutationFn: (values: Values) => api.mutation<RegistryRow>(resource.path + (id ? '/' + id : ''), id ? 'PUT' : 'POST', resource.body(values, id ? detail.data : undefined)),
  onSuccess: () => {
   void queryClient.invalidateQueries({ queryKey: ['registry', resource.path] })
   void queryClient.invalidateQueries({ queryKey: ['reference'] })
   void queryClient.invalidateQueries({ queryKey: ['reference-selected'] })
   onClose()
  },
 })
 const readOnly = !!detail.data && !!resource.readOnly?.(detail.data)
 const busy = mutation.isPending || (!!id && (detail.isFetching || !detail.data || !!detail.error))
 const conflict = mutation.error instanceof ApiError && mutation.error.status === 409 && mutation.error.detail.code === 'CONCURRENT_MODIFICATION'
 return <Modal open title={(id ? 'Xem / sửa ' : 'Thêm ') + resource.singular} onCancel={mutation.isPending ? undefined : onClose}
  footer={<Space><Button disabled={mutation.isPending} onClick={onClose}>Hủy</Button>{!readOnly && <Button aria-label="Lưu" type="primary" loading={mutation.isPending} disabled={busy || conflict} onClick={() => form.submit()}>Lưu</Button>}</Space>}>
  {resource.note && <Typography.Paragraph>{resource.note}</Typography.Paragraph>}
  {detail.data && <Typography.Paragraph type="secondary">Trạng thái hiện tại: {String(detail.data.status)} · Phiên bản: {String(detail.data.rowVersion)}</Typography.Paragraph>}
  {detail.data && resource.details?.(detail.data)}
  {detail.error && <ErrorNotice error={detail.error} onRetry={() => { void detail.refetch() }} />}
  {mutation.error && <ErrorNotice error={mutation.error} onRetry={id && conflict ? () => {
   modal.confirm({ okText: 'Tải lại', cancelText: 'Giữ form', title: 'Tải lại dữ liệu mới?', content: 'Các thay đổi chưa lưu trong form sẽ được thay bằng dữ liệu mới nhất.', onOk: async () => { const refreshed = await detail.refetch(); if (refreshed.error) throw refreshed.error; mutation.reset() } })
  } : undefined} />}
  <Form form={form} layout="vertical" initialValues={resource.defaults ?? { status: 'ACTIVE' }} disabled={busy}
   onFinish={(values) => mutation.mutate(values)} requiredMark={false}>
   {resource.fields.filter((field) => id || !field.updateOnly).map((field) => {
    const disabled = readOnly || (!!id && !!detail.data && !!resource.disabled?.(field, detail.data))
    const choices = detail.data ? resource.choices?.(field, detail.data) ?? field.options : field.options
    return <Form.Item key={field.name} name={field.name} label={field.label} dependencies={field.dependencies}
     rules={[...(field.required ? [{ required: true, message: 'Chọn ' + field.label.toLowerCase() + '.' }] : []), ...(field.rules ?? [])]}>
     {field.type === 'enum' ? <Select options={choices} disabled={disabled || busy} /> :
      referenceKind(field.type) ? <ReferencePicker kind={field.type} label={field.label} disabled={disabled || busy} allowClear={!field.required} /> :
      field.type === 'textarea' ? <Input.TextArea rows={5} disabled={disabled || busy} /> :
       field.type === 'integer' ? <InputNumber min={field.min} max={field.max} disabled={disabled || busy} style={{ width: '100%' }} /> :
      <Input inputMode={field.inputMode} maxLength={field.maxLength} type={field.type === 'date' ? 'date' : 'text'} autoComplete="off" disabled={disabled || busy} />}
    </Form.Item>
   })}
  </Form>
 </Modal>
}
