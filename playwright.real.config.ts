import { defineConfig, devices } from '@playwright/test'
if (!process.env.CAMPUS_TEST_BACKEND_URL || !process.env.CAMPUS_TEST_PASSWORD) {
 throw new Error('Run scripts/test-backend.ps1 for isolated backend fixtures; never use production accounts.')
}
export default defineConfig({
 testDir: './e2e-real',
 workers: 1,
 reporter: 'list',
 use: { baseURL: 'http://localhost:3000', trace: 'off', screenshot: 'only-on-failure' },
 projects: [{ name: 'real-chromium', use: { ...devices['Desktop Chrome'] } }],
 webServer: {
  command: 'npm run dev -- --host 127.0.0.1',
  url: 'http://localhost:3000',
  reuseExistingServer: false,
  env: { CAMPUS_API_PROXY_TARGET: process.env.CAMPUS_TEST_BACKEND_URL },
 },
})
