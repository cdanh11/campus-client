import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
export default defineConfig({
 plugins: [react()],
 server: { port: 3000, strictPort: true, proxy: { '/api': { target: process.env.CAMPUS_API_PROXY_TARGET ?? 'http://localhost:8080', changeOrigin: true } } },
 test: { environment: 'jsdom', setupFiles: ['./src/test/setup.ts'], include: ['src/**/*.test.{ts,tsx}'], restoreMocks: true },
})
