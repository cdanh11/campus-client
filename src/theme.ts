import type { ThemeConfig } from 'antd'
export const campusTheme: ThemeConfig = {
 token: {
  colorPrimary: '#2563eb', colorInfo: '#2563eb', colorSuccess: '#0f766e',
  colorText: '#172033', colorTextSecondary: '#64748b', colorTextDescription: '#64748b', colorBgLayout: '#f4f7fb',
  colorBorder: '#e5eaf2', borderRadius: 10, fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
  fontSize: 14, controlHeight: 40, controlHeightLG: 48,
 },
 components: {
  Button: { primaryShadow: 'none', fontWeight: 600 },
  Card: { headerFontSize: 16, paddingLG: 24 },
  Table: { headerBg: '#f8f9fd', cellPaddingBlock: 16, cellPaddingInline: 16 },
  Modal: { borderRadiusLG: 16 },
 },
}
