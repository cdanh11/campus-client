import { useState } from 'react'
import { Alert, Button, Modal, Space, Tag, Typography } from 'antd'
import { useMutation, useQuery } from '@tanstack/react-query'
import { api, queryClient } from '../../api/runtime'
import type { components } from '../../api/schema'
import { ApiError } from '../../api/client'
import { ErrorNotice } from '../../components/ErrorNotice'
import { ReferenceLabel, ReferencePicker } from '../people/ReferencePicker'
type Notice = Required<components['schemas']['com.campus.notification.domain.Notice']>
export function PublishNotice({ id, onClose }: { id: string; onClose: () => void }) {
 const [recipients, setRecipients] = useState<string[]>([])
 const [candidate, setCandidate] = useState<string>()
 const detail = useQuery({ queryKey: ['notice-publication', id], queryFn: ({ signal }) => api.request<Notice>('/api/v1/admin/notifications/notices/' + id, { signal }), staleTime: 0, refetchOnMount: 'always', refetchOnWindowFocus: false, refetchOnReconnect: false })
 const mutation = useMutation({
  mutationFn: () => {
   if (!detail.data || detail.error || detail.isFetching || detail.data.status !== 'DRAFT' || recipients.length < 1 || recipients.length > 100 || new Set(recipients).size !== recipients.length) throw new Error('Chưa đủ điều kiện phát hành.')
   return api.mutation('/api/v1/admin/notifications/notices/' + id + '/publish', 'POST', { recipientIds: recipients, expectedVersion: detail.data.rowVersion } satisfies components['schemas']['NotificationNoticePublish'])
  },
  onSuccess: () => {
   void queryClient.invalidateQueries({ queryKey: ['registry', '/api/v1/admin/notifications/notices'] })
   void queryClient.invalidateQueries({ queryKey: ['registry-detail', '/api/v1/admin/notifications/notices'] })
   void queryClient.invalidateQueries({ queryKey: ['inbox'] })
   onClose()
  },
 })
 const conflict = mutation.error instanceof ApiError && mutation.error.detail.code === 'CONCURRENT_MODIFICATION'
 const locked = mutation.isPending || conflict
 const blocked = locked || detail.isFetching || !!detail.error || detail.data?.status !== 'DRAFT' || !recipients.length
 return <Modal open title="Phát hành thông báo" onCancel={mutation.isPending ? undefined : onClose} destroyOnHidden footer={<Space><Button aria-label="Đóng biểu mẫu" disabled={mutation.isPending} onClick={onClose}>Đóng</Button><Button type="primary" disabled={blocked} loading={mutation.isPending} onClick={() => mutation.mutate()}>Xác nhận phát hành</Button></Space>}>
  <Alert type="info" showIcon title="Phát hành ngay cho các tài khoản đã chọn; nội dung sau phát hành không thể sửa." />
  {detail.isFetching && <p role="status">Đang tải bản nháp mới nhất…</p>}
  {detail.error && <ErrorNotice error={detail.error} onRetry={() => { void detail.refetch() }} />}
  {detail.data && <><Typography.Title level={4}>{detail.data.title}</Typography.Title><Typography.Paragraph style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{detail.data.body}</Typography.Paragraph><Typography.Paragraph>Trạng thái: {detail.data.status} · Phiên bản: {String(detail.data.rowVersion)}</Typography.Paragraph></>}
  <Typography.Paragraph>Chọn 1–100 tài khoản ACTIVE. Nếu một người nhận không còn hợp lệ, toàn bộ lượt phát hành bị từ chối.</Typography.Paragraph>
  <ReferencePicker kind="recipient" label="Tài khoản nhận" value={candidate} onChange={setCandidate} disabled={locked || recipients.length >= 100} />
  <Button disabled={locked || !candidate || recipients.includes(candidate) || recipients.length >= 100} onClick={() => { if (candidate) { setRecipients([...recipients, candidate]); setCandidate(undefined) } }}>Thêm người nhận</Button>
  <p>Đã chọn: {recipients.length}/100</p>
  <Space wrap>{recipients.map((recipient) => <Tag key={recipient} closable={!locked} onClose={() => setRecipients(recipients.filter((value) => value !== recipient))}><ReferenceLabel kind="recipient" value={recipient} /></Tag>)}</Space>
  {mutation.error && <ErrorNotice error={mutation.error} />}
  {conflict && <Typography.Paragraph>Đóng và mở lại để kiểm tra bản nháp mới trước khi phát hành. Không tự động gửi lại.</Typography.Paragraph>}
 </Modal>
}
