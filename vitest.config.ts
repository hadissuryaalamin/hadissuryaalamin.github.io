// Scoped to spec/**: the Playwright browser specs in tests/**/*.spec.ts are
// a separate runner (see playwright.config.ts) and must not be picked up
// here, since they import from "@playwright/test", not "vitest".
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["spec/**/*.test.ts"],
    exclude: ["node_modules/**", "dist/**", "tests/**"],
    // criterion 23's live GitHub checks need real network round-trips.
    testTimeout: 15_000,
  },
});
