import { defineConfig, devices } from "@playwright/test";

const previewCommand = "npm run preview -- --host 127.0.0.1 --port 4321";
const webServerCommand =
  process.env.PLAYWRIGHT_REUSE_BUILD === "1"
    ? previewCommand
    : `SITE_URL=https://nikhiladiga.in npm run build:site && ${previewCommand}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "retain-on-failure",
  },
  webServer: {
    command: webServerCommand,
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
