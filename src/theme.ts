import type { ThemeConfig } from 'antd'

export const campusTheme: ThemeConfig = {
 token: {
  colorPrimary: '#176b87', colorInfo: '#176b87', colorLink: '#176b87', colorSuccess: '#188b83',
  colorWarning: '#b45309', colorError: '#b91c1c',
  colorText: '#19324a', colorTextSecondary: '#6b8094', colorTextDescription: '#6b8094',
  colorBgLayout: '#f5f8fa', colorBgContainer: '#ffffff', colorBorder: '#dce7ee',
  borderRadius: 10, borderRadiusLG: 14,
  fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  fontSize: 14, controlHeight: 40, controlHeightLG: 48,
 },
 components: {
  Button: { primaryShadow: 'none', fontWeight: 600 },
  Card: { headerFontSize: 16, paddingLG: 22 },
  Table: { headerBg: '#f1f7f8', headerColor: '#496274', cellPaddingBlock: 16, cellPaddingInline: 16 },
  Modal: { borderRadiusLG: 18 },
  Menu: { itemBorderRadius: 10, itemSelectedBg: '#dff2f3', itemSelectedColor: '#126477' },
 },
}
