import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
 testDir: './e2e', fullyParallel: true, forbidOnly: !!process.env.CI,
 retries: process.env.CI ? 1 : 0, reporter: 'list',
 use: { baseURL: 'http://localhost:3000', trace: 'retain-on-failure' },
 projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
 webServer: { command: 'npm run dev -- --host 127.0.0.1', url: 'http://localhost:3000', reuseExistingServer: !process.env.CI },
})
