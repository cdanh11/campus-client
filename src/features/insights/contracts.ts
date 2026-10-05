import type { components } from '../../api/schema'
export type Audit = components['schemas']['com.campus.shared.application.audit.AuditView']
export type AuditPage = Required<components['schemas']['AuditViewingPage']>
export type AuditSource = NonNullable<Audit['source']>
export type Dashboard = Required<components['schemas']['com.campus.reporting.application.DashboardService.Dashboard']>
export type ReportPage = Required<components['schemas']['com.campus.reporting.application.DetailReportService.ReportPage']>
export type ReportKind = ReportPage['report']
export type ReportRow = ReportPage['content'][number]
