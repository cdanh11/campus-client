import { useState, useSyncExternalStore } from 'react'
import { Button, Descriptions, Form, Input, Modal, Select, Space, Table, Tag, Typography } from 'antd'
import { useMutation, useQuery, keepPreviousData } from '@tanstack/react-query'
import { api, queryClient } from '../../api/runtime'
import { ApiError } from '../../api/client'
import { queryParams, safePageTotal } from '../../api/query-params'
import { ErrorNotice } from '../../components/ErrorNotice'
import { campusTimeText } from '../../components/CampusTime'
import { roleCodes } from '../../api/administration'
import { nameRule, passwordRule } from '../../forms/validation'
import { sortOptions } from '../sort-options'
import { statusColor, statusOptions, statusText } from '../status-options'
import { roleOptions, roleText } from '../roles'
import type { AdminUser, PageResult, UserCreate, UserPassword, UserRoles, UserStatus } from './contracts'
import { useListQuery } from '../list-query'

const path = '/api/v1/admin/users'
const statuses = statusOptions(['ACTIVE', 'SUSPENDED', 'DISABLED'])
const roles = roleOptions(roleCodes)
const userSorts = sortOptions(['createdAt', 'email', 'displayName', 'status', 'updatedAt'], 'createdAt,desc')
type Action = 'create' | 'detail' | 'status' | 'roles' | 'password'
interface Values { email: string; displayName: string; initialPassword: string; newPassword: string; roles: string[]; status: 'ACTIVE' | 'SUSPENDED' | 'DISABLED' }

export function UserPage() {
 const [filters, setFilters] = useListQuery({ page: 0, size: 20, q: '', status: '', role: '', sort: 'createdAt,desc' }, {
  sorts: userSorts.map((option) => option.value),
  choices: { status: statuses.map((option) => option.value), role: roleCodes },
 })
 const [edit, setEdit] = useState<{ action: Action; id?: string } | null>(null)
 const params = queryParams(filters)
 const session = useSyncExternalStore(api.subscribe, api.getSession)
 const result = useQuery({
  queryKey: ['users', params],
  placeholderData: keepPreviousData,
  queryFn: ({ signal }) => api.request<PageResult<AdminUser>>(path + '?' + params, { signal }),
  select: (data: PageResult<AdminUser>) => ({ ...data, totalElements: safePageTotal(data.totalElements) }),
 })
 return <>
  <div className="page-heading"><Typography.Title level={1}>Tài khoản</Typography.Title><Button type="primary" onClick={() => setEdit({ action: 'create' })}>Thêm tài khoản</Button></div>
  <Typography.Paragraph type="secondary">ADMIN quản trị toàn hệ thống; các quyền khác giới hạn theo chức năng. Nhiều quyền kết hợp phạm vi truy cập; quyền tham chiếu không cho phép sửa hồ sơ.</Typography.Paragraph>
  <Space wrap className="list-filters">
   <Input.Search aria-label="Tìm tài khoản" placeholder="Tìm theo email hoặc tên…" maxLength={100} defaultValue={filters.q} onSearch={(q) => setFilters({ ...filters, q, page: 0 })} allowClear />
   <Select aria-label="Lọc trạng thái" value={filters.status} options={[{ value: '', label: 'Tất cả trạng thái' }, ...statuses]} onChange={(status) => setFilters({ ...filters, status, page: 0 })} />
   <Select aria-label="Lọc quyền" value={filters.role} options={[{ value: '', label: 'Tất cả quyền' }, ...roles]} onChange={(role) => setFilters({ ...filters, role, page: 0 })} />
   <Select aria-label="Sắp xếp" value={filters.sort} options={userSorts} onChange={(sort) => setFilters({ ...filters, sort, page: 0 })} />
  </Space>
  {result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  <Table<AdminUser> rowKey="id" tableLayout="fixed" loading={result.isFetching} dataSource={result.data?.content ?? []} scroll={{ x: 1050 }} locale={{ emptyText: 'Chưa có tài khoản phù hợp.' }}
   columns={[
    { title: 'Email', dataIndex: 'email', width: 200, ellipsis: { showTitle: true } }, { title: 'Tên hiển thị', dataIndex: 'displayName', width: 160, ellipsis: { showTitle: true } },
    { title: 'Trạng thái', dataIndex: 'status', width: 130, render: (value: unknown) => <Tag color={statusColor(value)}>{statusText(value)}</Tag> }, { title: 'Quyền', width: 175, render: (_, row) => <span className="cell-ellipsis" title={row.roles.map(roleText).join(', ')}>{row.roles.map(roleText).join(', ')}</span> },
    { title: 'Thao tác', width: 370, render: (_, row) => <Space size={0} separator={<span className="row-divider" aria-hidden="true" />}>
     <Button type="link" size="small" onClick={() => setEdit({ action: 'detail', id: row.id })}>Chi tiết</Button>
     <Button type="link" size="small" disabled={row.id === session.user?.id} onClick={() => setEdit({ action: 'status', id: row.id })}>Đổi trạng thái</Button>
     <Button type="link" size="small" disabled={row.id === session.user?.id} onClick={() => setEdit({ action: 'roles', id: row.id })}>Đổi quyền</Button>
     <Button type="link" size="small" aria-label="Đặt lại mật khẩu" disabled={row.id === session.user?.id} onClick={() => setEdit({ action: 'password', id: row.id })}>Mật khẩu</Button>
    </Space> },
   ]}
   pagination={{ current: filters.page + 1, pageSize: filters.size, total: result.data?.totalElements ?? 0, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100], onChange: (page, size) => setFilters({ ...filters, page: page - 1, size }) }} />
  <Typography.Paragraph type="secondary">Không thể đổi trạng thái, quyền hoặc đặt lại mật khẩu của chính tài khoản đang đăng nhập. Máy chủ bảo vệ quản trị viên hoạt động cuối cùng.</Typography.Paragraph>
  {edit && <UserEditor key={(edit.id ?? '') + edit.action} {...edit} onClose={() => setEdit(null)} />}
 </>
}

function UserEditor({ action, id, onClose }: { action: Action; id?: string; onClose: () => void }) {
 const [form] = Form.useForm<Values>()
 const [blocked, setBlocked] = useState(false)
 const detail = useQuery({
  queryKey: ['user-detail', id, action],
  queryFn: ({ signal }) => api.request<AdminUser>(path + '/' + id, { signal }),
  enabled: !!id, staleTime: 0, refetchOnMount: 'always', refetchOnWindowFocus: false, refetchOnReconnect: false,
 })
 const mutation = useMutation({
  mutationFn: async (values: Values) => {
   if (action === 'create') return api.mutation(path, 'POST', {
    email: values.email, displayName: values.displayName, initialPassword: values.initialPassword, roles: values.roles, status: values.status,
   } satisfies UserCreate)
   if (!detail.data) throw new Error('Chưa tải được tài khoản.')
   const expectedVersion = detail.data.rowVersion
   if (action === 'status') return api.mutation(path + '/' + id + '/status', 'PATCH', { status: values.status, expectedVersion } satisfies UserStatus)
   if (action === 'roles') return api.mutation(path + '/' + id + '/roles', 'PUT', { roles: values.roles, expectedVersion } satisfies UserRoles)
   if (action === 'password') return api.mutation(path + '/' + id + '/password-reset', 'POST', { newPassword: values.newPassword, expectedVersion } satisfies UserPassword)
   throw new Error('Thao tác không hợp lệ.')
  },
  onSuccess: () => {
   form.resetFields()
   void queryClient.invalidateQueries({ queryKey: ['users'] })
   void queryClient.invalidateQueries({ queryKey: ['user-detail'] })
   void queryClient.invalidateQueries({ queryKey: ['reference'] })
   void queryClient.invalidateQueries({ queryKey: ['reference-selected'] })
   void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
   onClose()
  },
  onError: (error) => { if (error instanceof ApiError && error.detail.code === 'CONCURRENT_MODIFICATION') setBlocked(true) },
 })
 const busy = mutation.isPending || (!!id && (detail.isFetching || !detail.data || !!detail.error))
 const title = { create: 'Thêm tài khoản', detail: 'Chi tiết tài khoản', status: 'Đổi trạng thái', roles: 'Đổi quyền', password: 'Đặt lại mật khẩu' }[action]
 return <Modal open title={title} onCancel={mutation.isPending ? undefined : onClose} destroyOnHidden
  footer={<Space><Button aria-label="Đóng biểu mẫu" disabled={mutation.isPending} onClick={onClose}>Đóng</Button>{action !== 'detail' && <Button aria-label="Lưu" type="primary" loading={mutation.isPending} disabled={busy || blocked} onClick={() => form.submit()}>Lưu</Button>}</Space>}>
  {detail.error && <ErrorNotice error={detail.error} onRetry={() => { void detail.refetch() }} />}
  {mutation.error && <ErrorNotice error={mutation.error} />}
  {blocked && <Typography.Paragraph>Dữ liệu đã thay đổi. Đóng hộp thoại và mở lại để xem phiên bản mới trước khi thao tác.</Typography.Paragraph>}
  {detail.data && <Descriptions column={1} items={[
   { key: 'id', label: 'UUID', children: detail.data.id }, { key: 'email', label: 'Email', children: detail.data.email },
   { key: 'name', label: 'Tên hiển thị', children: detail.data.displayName }, { key: 'status', label: 'Trạng thái', children: statusText(detail.data.status) },
   { key: 'roles', label: 'Quyền', children: detail.data.roles.map(roleText).join(', ') },
   { key: 'version', label: 'Phiên bản', children: String(detail.data.rowVersion) },
   { key: 'created', label: 'Ngày tạo', children: campusTimeText(detail.data.createdAt) }, { key: 'updated', label: 'Cập nhật', children: campusTimeText(detail.data.updatedAt) },
  ]} />}
  {action !== 'detail' && (!id || detail.data) && <Form form={form} layout="vertical" disabled={busy || blocked} initialValues={{ status: detail.data?.status ?? 'ACTIVE', roles: detail.data?.roles ?? ['USER'] }} onFinish={(values) => mutation.mutate(values)}>
   {action === 'create' && <>
    <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', max: 320, message: 'Nhập email hợp lệ, tối đa 320 ký tự.' }]}><Input autoComplete="off" /></Form.Item>
    <Form.Item name="displayName" label="Tên hiển thị" rules={[nameRule(2, 100)]}><Input autoComplete="off" /></Form.Item>
    <Form.Item name="initialPassword" label="Mật khẩu ban đầu" rules={[passwordRule]}><Input.Password autoComplete="new-password" /></Form.Item>
   </>}
   {(action === 'create' || action === 'status') && <Form.Item name="status" label="Trạng thái mới" rules={[{ required: true }]}><Select options={statuses} /></Form.Item>}
   {(action === 'create' || action === 'roles') && <Form.Item name="roles" label="Quyền mới" rules={[{ required: true, type: 'array', min: 1, message: 'Chọn ít nhất một quyền.' }]}><Select mode="multiple" options={roles} /></Form.Item>}
   {action === 'password' && <><Typography.Paragraph>Đặt lại mật khẩu sẽ thu hồi các phiên đăng nhập của tài khoản đích.</Typography.Paragraph><Form.Item name="newPassword" label="Mật khẩu mới" rules={[passwordRule]}><Input.Password autoComplete="new-password" /></Form.Item></>}
  </Form>}
 </Modal>
}
