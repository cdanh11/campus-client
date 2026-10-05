import { useState } from 'react'
import { Button, Checkbox, Form, Select, Space, Table, Typography } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api } from '../../api/runtime'
import { safePageTotal } from '../../api/query-params'
import { ErrorNotice } from '../../components/ErrorNotice'
import { ReferencePicker } from '../people/ReferencePicker'
import type { ReportKind, ReportPage as Page, ReportRow } from './contracts'
import { columnLabels, reportConfig } from './config'
import { metricText, reportParams, type Filters } from './query'
import { TimeFilters } from './TimeFilters'
export function saveCsv(csv: string, kind: ReportKind) {
 const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=UTF-8' }))
 const link = document.createElement('a'); link.href = url; link.download = kind.toLowerCase() + '.csv'
 document.body.append(link)
 try { link.click() } finally { link.remove(); URL.revokeObjectURL(url) }
}
export function ReportsPage() {
 const [kind, setKind] = useState<ReportKind>('STUDENT_DEBT')
 return <><Typography.Title level={1}>Báo cáo</Typography.Title><Select aria-label="Loại báo cáo" value={kind} onChange={setKind} options={Object.entries(reportConfig).map(([value, config]) => ({ value, label: config.label }))} style={{ width: 280 }} /><ReportList key={kind} kind={kind} /></>
}
function ReportList({ kind }: { kind: ReportKind }) {
 const [filters, setFilters] = useState<Filters>({})
 const [paging, setPaging] = useState({ page: 0, size: 20, sort: 'id,asc' })
 const config = reportConfig[kind]
 const params = reportParams(kind, filters, paging.page, paging.size, paging.sort)
 const path = '/api/v1/admin/reports/' + kind
 const result = useQuery({
  queryKey: ['report', kind, params], queryFn: ({ signal }) => api.request<Page>(path + '?' + params, { signal }),
  select: (data) => {
   if (data.report !== kind || data.columns.join(',') !== config.columns.join(',')) throw new Error('Report contract không hợp lệ.')
   for (const row of data.content) for (const key of config.columns) {
    if (key.endsWith('Vnd') || key === 'chargeCount') metricText((row as Record<string, unknown>)[key])
   }
   return { ...data, totalElements: safePageTotal(data.totalElements) }
  },
 })
 const download = useMutation({ mutationFn: () => api.downloadCsv(path + '/export?' + reportParams(kind, filters, 0, paging.size, paging.sort, true)), onSuccess: (csv) => saveCsv(csv, kind) })
 return <><Typography.Title level={2}>{config.label}</Typography.Title><Typography.Paragraph>Báo cáo hiện tại; khoảng thời gian lọc dữ liệu nguồn, không phải số dư lịch sử. CSV gồm toàn bộ dữ liệu phù hợp, tối đa 5.000 dòng; có thể khác trang hiện tại nếu dữ liệu vừa thay đổi.</Typography.Paragraph>
  <Form<Filters> layout="vertical" onFinish={(values) => { setFilters(values); setPaging({ ...paging, page: 0 }); download.reset() }}>
   <Space wrap align="start"><Form.Item name="studentId" label="Lọc sinh viên"><ReferencePicker kind="student" label="Lọc sinh viên" eligible={false} allowClear /></Form.Item>
    {config.reference && <Form.Item name="resourceId" label={'Lọc ' + config.resourceLabel?.toLowerCase()}><ReferencePicker kind={config.reference} label={'Lọc ' + config.resourceLabel?.toLowerCase()} eligible={false} allowClear /></Form.Item>}
    {config.statuses && <Form.Item name="status" label="Trạng thái"><Select aria-label="Trạng thái báo cáo" allowClear options={config.statuses.map((value) => ({ value, label: value }))} style={{ width: 170 }} /></Form.Item>}
    <TimeFilters />{kind === 'LIBRARY_LOANS' && <Form.Item name="overdueOnly" valuePropName="checked"><Checkbox>Chỉ quá hạn</Checkbox></Form.Item>}
    <Button htmlType="submit" type="primary">Áp dụng bộ lọc</Button>
   </Space>
  </Form>
  <Space wrap><Select aria-label="Sắp xếp báo cáo" value={paging.sort} onChange={(sort) => setPaging({ ...paging, sort, page: 0 })} options={['id,asc', 'id,desc'].map((value) => ({ value, label: value }))} /><Button aria-label="Tải CSV" loading={download.isPending} disabled={download.isPending || result.isFetching || !!result.error || !result.data} onClick={() => download.mutate()}>Tải CSV</Button><Button disabled={result.isFetching} onClick={() => { void result.refetch() }}>Làm mới báo cáo</Button></Space>
  {download.error && <ErrorNotice error={download.error} />}{result.error && <ErrorNotice error={result.error} onRetry={() => { void result.refetch() }} />}
  {result.data && <p>Thời điểm UTC: {result.data.asOf}</p>}
  <Table<ReportRow> rowKey={(row) => String('id' in row ? row.id : 'studentId' in row ? row.studentId : '')} loading={result.isFetching} dataSource={result.data?.content ?? []} scroll={{ x: 1000 }}
   columns={config.columns.map((key) => ({ title: columnLabels[key] ?? key, key, render: (_, row) => {
    const value: unknown = (row as Record<string, unknown>)[key]
    return key.endsWith('Vnd') ? metricText(value, true) : key === 'chargeCount' ? metricText(value) : typeof value === 'boolean' ? value ? 'Có' : 'Không' : String(value ?? '—')
   } }))} locale={{ emptyText: 'Chưa có dữ liệu phù hợp.' }} pagination={{ current: paging.page + 1, pageSize: paging.size, total: result.data?.totalElements ?? 0, showSizeChanger: true, pageSizeOptions: [10, 20, 50, 100], onChange: (page, size) => setPaging({ ...paging, page: page - 1, size }) }} />
 </>
}
