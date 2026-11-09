import { useState } from 'react'
import { Alert, Button, Form, Input, Typography } from 'antd'
import { ArrowRightOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { ApiError } from '../api/errors'
import { api } from '../api/runtime'
const { Title, Paragraph, Text } = Typography

const loginError = (error: unknown) => {
 if (!(error instanceof ApiError)) return 'Không kết nối được máy chủ. Kiểm tra kết nối mạng và thử lại.'
 if (error.status === 401) return 'Email hoặc mật khẩu không đúng.'
 if (error.status === 400) return 'Email hoặc mật khẩu chưa hợp lệ. Kiểm tra lại và thử lại.'
 if (error.status >= 500) return 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.'
 return 'Không thể đăng nhập. Vui lòng thử lại.'
}

export default function LoginPage() {
 const navigate = useNavigate()
 const [error, setError] = useState<string>()
 const [busy, setBusy] = useState(false)
 async function submit(values: { email: string; password: string }) {
  setBusy(true)
  setError(undefined)
  try {
   await api.login(values.email, values.password)
   navigate('/', { replace: true })
  } catch (error) {
   setError(loginError(error))
  } finally { setBusy(false) }
 }
 return <main className="login-page">
  <section className="login-card">
   <div className="login-brand">
    <span className="brand-mark" aria-hidden="true">C</span>
    <span><span className="login-brand-name">Campus</span><span className="login-brand-subtitle">PLATFORM</span></span>
   </div>
   <div className="login-heading">
    <Title level={2}>Đăng nhập</Title>
    <Paragraph type="secondary">Sử dụng tài khoản được quản trị viên cấp.</Paragraph>
   </div>
   {error && <Alert type="error" showIcon title={error} className="login-error" />}
   <Form layout="vertical" onFinish={submit} requiredMark={false}>
    <Form.Item label="Email" name="email" rules={[{ required: true, message: 'Nhập email.' }, { type: 'email', message: 'Email không hợp lệ.' }]}>
     <Input size="large" autoComplete="username" placeholder="ten@truong.edu.vn" disabled={busy} />
    </Form.Item>
    <Form.Item label="Mật khẩu" name="password" rules={[{ required: true, message: 'Nhập mật khẩu.' }]}>
     <Input.Password size="large" autoComplete="current-password" disabled={busy} />
    </Form.Item>
    <Button type="primary" htmlType="submit" size="large" block loading={busy} icon={<ArrowRightOutlined aria-hidden="true" />}>Đăng nhập</Button>
   </Form>
   <Text className="login-support" type="secondary">Cần tài khoản hoặc quên mật khẩu? Liên hệ quản trị viên của bạn.</Text>
  </section>
  <Text className="login-footnote" type="secondary">Campus Platform · Không gian quản lý khuôn viên</Text>
 </main>
}
