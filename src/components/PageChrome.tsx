import type { ReactNode } from 'react'
import { Typography } from 'antd'

const { Title, Text } = Typography

export function PageChrome({ eyebrow, title, description, actions, children }: { eyebrow: string; title: string; description?: string; actions?: ReactNode; children: ReactNode }) {
  return <div className="page-chrome">
    <header className="page-chrome-header">
      <div className="page-chrome-title">
        <span className="page-chrome-rule" aria-hidden="true" />
        <Text className="section-kicker">{eyebrow}</Text>
        <Title level={1}>{title}</Title>
        {description && <p className="page-description">{description}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </header>
    <div className="page-chrome-content">{children}</div>
  </div>
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <div className="empty-state"><span className="empty-state-mark" aria-hidden="true">+</span><div><Title level={3}>{title}</Title><p>{description}</p></div></div>
}
