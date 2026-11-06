import { Component, type ReactNode } from 'react'
import { Button, Result } from 'antd'

export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
 state = { failed: false }

 static getDerivedStateFromError() {
  return { failed: true }
 }

 render() {
  if (!this.state.failed) return this.props.children
  return <Result status="error" title="Trang không hiển thị được" subTitle="Đã xảy ra lỗi giao diện. Tải lại trang để tiếp tục."
   extra={<Button type="primary" onClick={() => window.location.reload()}>Tải lại trang</Button>} />
 }
}
