import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
const proxy = { '/api': { target: process.env.CAMPUS_API_PROXY_TARGET ?? 'http://localhost:8080', changeOrigin: true } }
export default defineConfig({
 plugins: [react()],
 server: { port: 3000, strictPort: true, proxy },
 preview: { port: 3000, strictPort: true, proxy },
 test: { maxWorkers: 2, environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], include: ['src/**/*.test.{ts,tsx}'], restoreMocks: true },
})
