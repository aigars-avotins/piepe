import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests', testIgnore: '**/worker.test.ts', timeout: 20000, fullyParallel: true, workers: 2,
  reporter: [['list'], ['json', { outputFile: 'test-results/results.json' }]],
  use: { baseURL: process.env.TEST_URL || 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'chrome-desktop', use: { ...devices['Desktop Chrome'], channel: process.env.PLAYWRIGHT_HEADLESS_SHELL ? undefined : 'chrome', viewport: { width: 1440, height: 1000 } } },
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'], browserName: 'webkit' } },
  ],
  webServer: process.env.TEST_URL ? undefined : { command: 'npm run preview -- --port 4173', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
})
