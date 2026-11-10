import { useEffect } from 'react'
import { Alert, Button, Card, Descriptions, Form, Input, Space, Tag, Typography, App as AntApp } from 'antd'
import { useMutation } from '@tanstack/react-query'
import type { components } from '../../api/schema'
import { ApiError } from '../../api/client'
import { api, queryClient } from '../../api/runtime'
import { ErrorNotice } from '../../components/ErrorNotice'
import { PageChrome, EmptyState } from '../../components/PageChrome'
import { dateText, isMissingStudentProfile, profilePath, studentState, useStudentProfile, type StudentProfile } from './student'

type Contact = { email?: string; phone?: string; address?: string }
const dash = (value?: string | null) => value?.trim() || '—'

export default function ProfilePage() {
 const profile = useStudentProfile()
 const [form] = Form.useForm<Contact>()
 const { message } = AntApp.useApp()
 const student = profile.data?.studentNumber ? profile.data : null
 const save = useMutation({
  mutationFn: (values: Contact) => {
   if (!student) throw new Error('Chưa có hồ sơ sinh viên để cập nhật.')
   return api.mutation<StudentProfile>(profilePath, 'PUT', {
    email: values.email?.trim(), phone: values.phone?.trim(), address: values.address?.trim(),
    expectedVersion: student.profileVersion ?? 0,
   } satisfies components['schemas']['StudentContactUpdateRequest'])
  },
  onSuccess: (updated) => {
   queryClient.setQueryData(['me', 'student'], updated)
   form.setFieldsValue({ email: updated.email, phone: updated.phone, address: updated.address })
   void message.success('Đã cập nhật thông tin liên hệ.')
  },
  onError: (error) => {
   if (error instanceof ApiError && error.status === 409) void profile.refetch()
  },
 })
 const conflict = save.error instanceof ApiError && save.error.status === 409
 useEffect(() => {
  if (profile.data) form.setFieldsValue({ email: profile.data.email, phone: profile.data.phone, address: profile.data.address })
 }, [form, profile.data])
 return <PageChrome eyebrow="HỒ SƠ SINH VIÊN" title="Thông tin cá nhân"
  description="Chỉ email, số điện thoại và địa chỉ có thể tự cập nhật. Các thông tin học vụ do nhà trường quản lý.">
  {profile.isFetching && !profile.data && <p role="status">Đang tải hồ sơ sinh viên…</p>}
  {profile.error && !isMissingStudentProfile(profile.error) && <ErrorNotice error={profile.error} onRetry={() => { void profile.refetch() }} />}
  {!profile.isFetching && isMissingStudentProfile(profile.error) && <EmptyState title="Chưa liên kết hồ sơ sinh viên"
   description="Liên hệ quản trị viên để liên kết tài khoản với hồ sơ sinh viên trước khi cập nhật thông tin cá nhân." />}
  {student && <>
   <Card className="profile-readonly" title="Thông tin định danh" extra={<Tag color="cyan">{studentState[student.status ?? ''] ?? student.status}</Tag>}>
    <Descriptions column={{ xs: 1, sm: 2 }} items={[
     { key: 'name', label: 'Họ và tên', children: <Typography.Text strong>{dash(student.fullName)}</Typography.Text> },
     { key: 'number', label: 'Mã sinh viên', children: dash(student.studentNumber) },
     { key: 'birth', label: 'Ngày sinh', children: dateText(student.dateOfBirth) },
     { key: 'cohort', label: 'Khóa', children: dash(student.cohort) },
     { key: 'program', label: 'Ngành học', children: dash(student.programName) },
     { key: 'unit', label: 'Đơn vị quản lý', children: dash(student.organizationUnitName) },
    ]} />
   </Card>
   <Card title="Thông tin liên hệ">
    <Typography.Paragraph type="secondary">Email dùng để đăng nhập và nhận thông báo của trường. Thay đổi email sẽ áp dụng cho lần đăng nhập kế tiếp.</Typography.Paragraph>
    {conflict && <Alert type="warning" showIcon className="profile-alert" title="Hồ sơ vừa được cập nhật ở nơi khác"
     description="Dữ liệu mới nhất đã được tải lại. Kiểm tra rồi gửi lại nếu cần." action={<Button size="small" onClick={() => { save.reset(); void profile.refetch() }}>Tải lại</Button>} />}
    {save.error && !conflict && <ErrorNotice error={save.error} />}
    <Form form={form} layout="vertical" requiredMark={false} initialValues={{ email: student.email, phone: student.phone, address: student.address }}
     onFinish={(values) => save.mutate(values)} disabled={save.isPending}>
     <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Nhập email liên hệ.' }, { type: 'email', message: 'Email chưa đúng định dạng.' }, { max: 320, message: 'Email tối đa 320 ký tự.' }]}>
      <Input autoComplete="email" inputMode="email" maxLength={320} placeholder="ten@truong.edu.vn" />
     </Form.Item>
     <Form.Item name="phone" label="Số điện thoại" rules={[{ max: 32, message: 'Số điện thoại tối đa 32 ký tự.' }, { pattern: /^$|^[0-9+\-(). ]{8,32}$/, message: 'Số điện thoại chưa hợp lệ.' }]}>
      <Input autoComplete="tel" inputMode="tel" maxLength={32} placeholder="0901 234 567" />
     </Form.Item>
     <Form.Item name="address" label="Địa chỉ" rules={[{ max: 500, message: 'Địa chỉ tối đa 500 ký tự.' }]}>
      <Input.TextArea autoComplete="street-address" maxLength={500} showCount rows={2} placeholder="Số nhà, đường, phường, quận, thành phố" />
     </Form.Item>
     <Space wrap>
      <Button type="primary" htmlType="submit" loading={save.isPending} disabled={profile.isFetching || conflict}>Lưu thay đổi</Button>
      <Button onClick={() => form.setFieldsValue({ email: student.email, phone: student.phone, address: student.address })} disabled={save.isPending}>Khôi phục</Button>
     </Space>
    </Form>
   </Card>
  </>}
 </PageChrome>
}
