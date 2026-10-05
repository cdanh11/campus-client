import { createRoot } from 'react-dom/client'
import { App as AntApp, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from './api/runtime'
import { App } from './App'
import 'antd/dist/reset.css'
import './styles.css'
import { campusTheme } from './theme'

createRoot(document.getElementById('root')!).render(
 <ConfigProvider locale={viVN} theme={campusTheme}>
  <AntApp><QueryClientProvider client={queryClient}><BrowserRouter><App /></BrowserRouter></QueryClientProvider></AntApp>
 </ConfigProvider>,
)
