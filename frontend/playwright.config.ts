import { defineConfig, devices } from '@playwright/test'

const apiBaseURL = process.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:4010'
const appBaseURL = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5173'
const apiPort = new URL(apiBaseURL).port || '4010'
const appPort = new URL(appBaseURL).port || '5173'
const reuseExistingServer = !process.env.CI

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    baseURL: appBaseURL,
    trace: 'on-first-retry',
  },
  webServer: [
    {
      command: `PORT=${apiPort} npm --prefix .. run start:dev`,
      url: `${apiBaseURL}/event-types`,
      reuseExistingServer,
      timeout: 120_000,
    },
    {
      command: `npm run dev -- --host 127.0.0.1 --port ${appPort}`,
      url: appBaseURL,
      reuseExistingServer,
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
