import { defineConfig, devices } from '@playwright/test'
if (!process.env.CAMPUS_TEST_BACKEND_URL || !process.env.CAMPUS_TEST_PASSWORD) {
 throw new Error('Run scripts/test-backend.ps1 for isolated backend fixtures; never use production accounts.')
}
const focusedFiles = process.env.CAMPUS_TEST_FILES?.split(',')
if (focusedFiles?.some((file) => !/^(academic|auth|events|insights|library|notifications|operations|people|portal|users)\.spec\.ts$/.test(file))) throw new Error('Unsupported focused real test file.')
export default defineConfig({
 testMatch: focusedFiles?.map((file) => '**/' + file),
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
