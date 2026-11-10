import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
const proxy = { '/api': { target: process.env.CAMPUS_API_PROXY_TARGET ?? 'http://localhost:8080', changeOrigin: true } }
const vendorChunk = (id: string) => {
 if (!id.includes('node_modules')) return
 if (/node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom)[\\/]/.test(id)) return 'react'
 if (/node_modules[\\/](antd|@ant-design|@rc-component|rc-[^\\/]+|dayjs)[\\/]/.test(id)) return 'antd'
 if (id.includes('node_modules/@tanstack/')) return 'query'
 if (id.includes('node_modules/lossless-json/')) return 'json'
}
export default defineConfig({
 plugins: [react()],
 server: { port: 3000, strictPort: true, proxy },
 preview: { port: 3000, strictPort: true, proxy },
 build: { chunkSizeWarningLimit: 700, rollupOptions: { output: { manualChunks: vendorChunk } } },
 test: { maxWorkers: 2, environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], include: ['src/**/*.test.{ts,tsx}'], restoreMocks: true },
})
