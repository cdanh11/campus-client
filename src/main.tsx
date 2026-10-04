import { createRoot } from 'react-dom/client'
import { App as AntApp, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { queryClient } from './api/runtime'
import { App } from './App'
import 'antd/dist/reset.css'
import './styles.css'

createRoot(document.getElementById('root')!).render(
 <ConfigProvider locale={viVN} theme={{ token: { colorPrimary: '#15726b', colorText: '#18323d', borderRadius: 10, fontFamily: 'Inter, system-ui, sans-serif' } }}>
  <AntApp><QueryClientProvider client={queryClient}><BrowserRouter><App /></BrowserRouter></QueryClientProvider></AntApp>
 </ConfigProvider>,
)
