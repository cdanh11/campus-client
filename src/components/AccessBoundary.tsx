import type { ReactNode } from 'react'
import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import type { User } from '../api/client'

export function AccessBoundary({ user, role, children }: { user: User | null; role: string; children: ReactNode }) {
 if (!user?.roles.includes(role)) return <Result status="403" title="Bạn không có quyền truy cập" subTitle="Trang này yêu cầu quyền phù hợp với tài khoản." extra={<Link to="/"><Button>Về trang chủ</Button></Link>} />
 return children
}
