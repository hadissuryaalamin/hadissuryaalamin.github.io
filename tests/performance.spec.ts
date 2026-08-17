// Criterion 49 (epic.md §12, §9.2): home page total transferred weight
// under ~500KB, including fonts and the portrait. The static half (portrait
// file size, explicit image dimensions) lives in spec/performance-assets.test.ts.
import { expect, test } from "@playwright/test";

const BUDGET_BYTES = 500 * 1024 * 1.15; // ~500KB with a little slack for the "~"

test("criterion 49: home page total transfer is under ~500KB", async ({ page }) => {
  let total = 0;
  const breakdown: { url: string; bytes: number }[] = [];

  page.on("response", async (response) => {
    try {
      const body = await response.body();
      total += body.length;
      breakdown.push({ url: response.url(), bytes: body.length });
    } catch {
      // navigation/redirect responses with no body — ignore.
    }
  });

  await page.goto("/", { waitUntil: "networkidle" });

  breakdown.sort((a, b) => b.bytes - a.bytes);
  const summary = breakdown
    .slice(0, 10)
    .map((b) => `${(b.bytes / 1024).toFixed(1)}KB  ${b.url}`)
    .join("\n");

  expect(total, `home page transferred ${(total / 1024).toFixed(1)}KB, budget is ~500KB.\nLargest:\n${summary}`).toBeLessThanOrEqual(
    BUDGET_BYTES,
  );
});
