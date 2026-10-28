import { defineConfig, devices } from '@playwright/test'
export default defineConfig({
  testDir: './tests', testIgnore: ['**/worker.test.ts', ...(!process.env.PRODUCTION_SMOKE ? ['**/production.spec.ts'] : [])], outputDir: process.env.PRODUCTION_SMOKE ? 'production-results' : 'test-results', timeout: 20000, fullyParallel: true, workers: 1,
  reporter: [['list'], ['json', { outputFile: process.env.PRODUCTION_SMOKE ? 'production-results/results.json' : 'test-results/results.json' }]],
  // DOM tracing also captures full media response bodies through the browser protocol.
  // Copying multi-megabyte films disturbs the live camera/frame measurements in WebKit.
  // Keep call/source traces, failure screenshots and explicit frame/geometry attachments;
  // real cinematic recordings are captured separately without protocol body collection.
  use: { baseURL: process.env.TEST_URL || 'http://127.0.0.1:4173', trace: { mode: 'retain-on-failure', screenshots: false, snapshots: false }, screenshot: 'only-on-failure' },
  projects: [
    { name: 'chrome-desktop', use: { ...devices['Desktop Chrome'], channel: process.env.CI || process.env.PLAYWRIGHT_HEADLESS_SHELL ? undefined : 'chrome', viewport: { width: 1440, height: 900 }, ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ? { channel: undefined, launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH } } : {}) } },
    { name: 'webkit-iphone', use: { ...devices['iPhone 13'], browserName: 'webkit' } },
  ],
  webServer: process.env.TEST_URL ? undefined : { command: 'node scripts/preview-worker.mjs', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
})
