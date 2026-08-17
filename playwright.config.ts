// Browser-driven checks (epic.md task brief: "Playwright for browser-driven
// checks — print media, theme, keyboard/focus"). Scoped to tests/**, kept
// separate from spec/** (vitest) — see vitest.config.ts.
//
// Chromium only for CI speed/reliability. epic.md §9 asks for the latest two
// versions of Chrome/Edge/Firefox/Safari, which is a manual cross-browser
// smoke-test concern, not something worth the CI minutes of running the full
// suite three times over for a course-scale static site — see
// updates/005.md for this trade-off written out.
import { defineConfig, devices } from "@playwright/test";

const PORT = 4321;

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  timeout: 30_000,
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Rebuild before preview so `playwright test` is correct standalone too,
    // not just as the tail of `pnpm check` (which already built once).
    command: `pnpm run build && pnpm exec astro preview --port ${PORT}`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
