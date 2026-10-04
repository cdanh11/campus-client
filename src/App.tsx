import { lazy, Suspense, useEffect, useState, useSyncExternalStore } from 'react'
import { Alert, Button, Result, Spin } from 'antd'
import { Navigate, Route, Routes } from 'react-router-dom'
import { api } from './api/runtime'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const Workspace = lazy(() => import('./pages/Workspace'))
function Loading() { return <div className="loading" role="status"><Spin size="large" /><p>Đang kiểm tra phiên làm việc…</p></div> }

export function App() {
 const session = useSyncExternalStore(api.subscribe, api.getSession)
 const [restoreError, setRestoreError] = useState(false)
 const [logoutError, setLogoutError] = useState(false)
 const restore = () => {
  setRestoreError(false)
  void api.restore().catch(() => setRestoreError(true))
 }
 useEffect(() => { void api.restore().catch(() => setRestoreError(true)) }, [])
 const logout = () => { setLogoutError(false); void api.logout().catch(() => setLogoutError(true)) }
 if (restoreError) return <Result status="warning" title="Chưa kết nối được máy chủ" subTitle="Kiểm tra backend rồi thử khôi phục phiên." extra={<Button onClick={restore}>Thử lại</Button>} />
 if (session.status === 'loading') return <Loading />
 return <Suspense fallback={<Loading />}>
  {session.status === 'anonymous' ? <>
   <Routes><Route path="/login" element={<LoginPage />} /><Route path="*" element={<Navigate to="/login" replace />} /></Routes>
   {logoutError && <Alert className="session-warning" type="warning" showIcon title="Đã xóa phiên trên trình duyệt nhưng chưa xác nhận thu hồi cookie ở máy chủ. Hãy kết nối lại để đăng xuất hoàn toàn." action={<Button onClick={logout}>Thử đăng xuất lại</Button>} />}
  </> : <Workspace user={session.user!} onLogout={logout} />}
 </Suspense>
}
