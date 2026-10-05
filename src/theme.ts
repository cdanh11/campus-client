import type { ThemeConfig } from 'antd'
export const campusTheme: ThemeConfig = {
 token: {
  colorPrimary: '#4338ca', colorInfo: '#4338ca', colorSuccess: '#047857',
  colorText: '#172033', colorTextSecondary: '#526078', colorBgLayout: '#f4f6fb',
  colorBorder: '#d8dfeb', borderRadius: 12, fontFamily: 'Inter, Segoe UI, system-ui, sans-serif',
  fontSize: 14, controlHeight: 40, controlHeightLG: 48,
 },
 components: {
  Button: { primaryShadow: 'none', fontWeight: 600 },
  Card: { headerFontSize: 16, paddingLG: 24 },
  Table: { headerBg: '#f8f9fd', cellPaddingBlock: 16, cellPaddingInline: 16 },
  Modal: { borderRadiusLG: 16 },
 },
}
