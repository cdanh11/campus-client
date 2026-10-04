import { useState } from 'react'
import { Button, Descriptions, Form, Input, Modal, Select, Space, Table, Typography } from 'antd'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../api/runtime'
import { safePageTotal } from '../../api/query-params'
import { ErrorNotice } from '../../components/ErrorNotice'
import type { Audit, AuditPage as Page, AuditSource } from './contracts'
import { actionLimit, auditResources } from './config'
import { auditParams, uuidRule, type Filters } from './query'
import { TimeFilters } from './TimeFilters'
export function AuditsPage() {
 const [source, setSource] = useState<AuditSource>('IDENTITY')
 return <><Typography.Title level={1}>Nhật ký audit</Typography.Title><Typography.Paragraph>Chỉ xem lịch sử đã ghi nhận, từng nguồn riêng; phiên bản trống nghĩa nguồn đó không ghi phiên bản. Metadata chỉ hiển thị trạng thái đã được API cho phép.</Typography.Paragraph>
  <Select aria-label="Nguồn audit" value={source} onChange={setSource} options={Object.keys(auditResources).map((value) => ({ value, label: value }))} style={{ width: 240 }} /><AuditList key={source} source={source} />
 </>
}
function AuditList({ source }: { source: AuditSource }) {
 const [filters, setFilters] = useState<Filters>({})
 const [paging, setPaging] = useState({ page: 0, size: 20, sort: 'occurredAt,desc' })
 const [id, setId] = useState<string>()
 const params = auditParams(source, filters, paging.page, paging.size, paging.sort)
 const path = '/api/v1/admin/audits/' + source
 const result = useQuery({ queryKey: ['audit', source, params], queryFn: ({ signal }) => api.request<Page>(path + '?' + params, { signal }), select: (data) => ({ ...data, totalElements: safePageTotal(data.totalElements) }) })
 return <><Form<Filters> layout="vertical" onFinish={(values) => { setFilters(values); setPaging({ ...paging, page: 0 }) }}><Space wrap align="start">
  <Form.Item name="resource" label="Tài nguyên"><Select aria-label="Tài nguyên audit" allowClear options={auditResources[source].map((value) => ({ value, label: value }))} style={{ width: 200 }} /></Form.Item>
  <Form.Item name="targetId" label="Đối tượng UUID" rules={[uuidRule]}><Input /></Form.Item><Form.Item name="actorId" label="Người thao tác UUID" rules={[uuidRule]}><Input /></Form.Item>
  <Form.Item name="action" label="Action" rules={[{ pattern: /^[A-Z_]+$/, max: actionLimit(source), message: 'Action gồm A–Z/_; tối đa ' + actionLimit(source) + ' ký tự.' }]}><Input maxLength={actionLimit(source)} /></Form.Item>
  <TimeFilters /><Button type="primary" htmlType="submit">Áp dụng bộ lọc</Button>
 </Space></Form>
 <Space wrap><Select aria-label="Sắp xếp audit" value={paging.sort} onChange={(sort) => setPaging({ ...paging, sort, page: 0 })} options={['occurredAt,desc', 'occurredAt,asc'].map((value) => ({ value, label: value }))} /><Button disabled={result.isFetching} onClick={() => { void result.refetch() }}>Làm mới audit</Button></Space>
 {result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
 <Table<Audit> rowKey="id" loading={result.isFetching} dataSource={result.data?.content ?? []} scroll={{ x: 1000 }} columns={[
  ...['resource', 'targetId', 'actorId', 'action', 'resourceVersion', 'occurredAt'].map((key) => ({ title: key, key, render: (_: unknown, row: Audit) => String(row[key as keyof Audit] ?? '—') })),
  { title: 'Chi tiết', key: 'detail', render: (_, row) => <Button onClick={() => setId(row.id)}>Xem audit</Button> },
 ]} locale={{ emptyText: 'Chưa có audit phù hợp.' }} pagination={{ current: paging.page + 1, pageSize: paging.size, total: result.data?.totalElements ?? 0, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100], onChange: (page, size) => setPaging({ ...paging, page: page - 1, size }) }} />
 {id && <AuditDetail source={source} id={id} onClose={() => setId(undefined)} />}
 </>
}
function AuditDetail({ source, id, onClose }: { source: AuditSource; id: string; onClose: () => void }) {
 const result = useQuery({ queryKey: ['audit-detail', source, id], queryFn: ({ signal }) => api.request<Audit>('/api/v1/admin/audits/' + source + '/' + id, { signal }) })
 return <Modal open title="Chi tiết audit" onCancel={onClose} footer={<Button onClick={onClose}>Đóng</Button>}>
  {result.isFetching && <p role="status">Đang tải audit…</p>}{result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  {result.data && <Descriptions column={1} items={[...['id', 'source', 'resource', 'targetId', 'actorId', 'action', 'resourceVersion', 'occurredAt'].map((key) => ({ key, label: key, children: String(result.data![key as keyof Audit] ?? '—') })), { key: 'status', label: 'Metadata status', children: result.data.metadata?.status ?? '—' }]} />}
 </Modal>
}
