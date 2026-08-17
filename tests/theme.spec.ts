// Criteria 36-39 (epic.md §12, §7.6): system-preference defaults, the
// toggle overriding both directions and surviving reload, and a runtime
// check that the theme is already correct essentially immediately (no
// flash). The static precondition for 39 (an inline before-paint script)
// lives in spec/no-flash.test.ts.
//
// Deliberately does NOT assume the exact CSS hex values from epic.md §7.5 —
// those may be nudged for contrast (§7.5: "if a value fails, darken/lighten
// it and record the change"). Instead this checks relative luminance
// direction: a "dark" render has a low-luminance background and
// high-luminance text, a "light" render is the reverse.
import { expect, test, type Page } from "@playwright/test";

function relativeLuminance(rgb: string): number {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return -1;
  const [r, g, b] = [match[1], match[2], match[3]].map((n) => Number(n) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

async function bodyLuminance(page: Page): Promise<number> {
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  return relativeLuminance(bg);
}

test("criterion 36: no stored preference + OS dark => site renders dark", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "dark" });
  const page = await context.newPage();
  await page.goto("/");
  const luminance = await bodyLuminance(page);
  expect(luminance, `body background luminance was ${luminance}, expected a dark (< 0.2) background`).toBeLessThan(
    0.2,
  );
  await context.close();
});

test("criterion 37: no stored preference + OS light => site renders light", async ({ browser }) => {
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  await page.goto("/");
  const luminance = await bodyLuminance(page);
  expect(
    luminance,
    `body background luminance was ${luminance}, expected a light (> 0.8) background`,
  ).toBeGreaterThan(0.8);
  await context.close();
});

function themeToggle(page: Page) {
  return page.getByRole("button", { name: /theme|dark|light|appearance/i });
}

test("criterion 38: the toggle overrides the system preference in both directions and survives a reload", async ({
  browser,
}) => {
  // System says light; toggle should be able to force dark.
  const lightSystemCtx = await browser.newContext({ colorScheme: "light" });
  const page1 = await lightSystemCtx.newPage();
  await page1.goto("/");
  const beforeToggle = await bodyLuminance(page1);
  expect(beforeToggle).toBeGreaterThan(0.8);

  await themeToggle(page1).click();
  const afterToggle = await bodyLuminance(page1);
  expect(afterToggle, "toggle did not force a dark render against a light system preference").toBeLessThan(0.2);

  await page1.reload();
  const afterReload = await bodyLuminance(page1);
  expect(afterReload, "dark choice did not survive a reload").toBeLessThan(0.2);
  await lightSystemCtx.close();

  // System says dark; toggle should be able to force light.
  const darkSystemCtx = await browser.newContext({ colorScheme: "dark" });
  const page2 = await darkSystemCtx.newPage();
  await page2.goto("/");
  const beforeToggle2 = await bodyLuminance(page2);
  expect(beforeToggle2).toBeLessThan(0.2);

  await themeToggle(page2).click();
  const afterToggle2 = await bodyLuminance(page2);
  expect(afterToggle2, "toggle did not force a light render against a dark system preference").toBeGreaterThan(0.8);

  await page2.reload();
  const afterReload2 = await bodyLuminance(page2);
  expect(afterReload2, "light choice did not survive a reload").toBeGreaterThan(0.8);
  await darkSystemCtx.close();
});

test("criterion 38: the toggle exposes its state via aria-pressed (or equivalent) and an accessible name", async ({
  page,
}) => {
  await page.goto("/");
  const toggle = themeToggle(page);
  await expect(toggle).toBeVisible();
  const ariaPressed = await toggle.getAttribute("aria-pressed");
  const ariaChecked = await toggle.getAttribute("aria-checked");
  expect(
    ariaPressed !== null || ariaChecked !== null,
    "expected the theme toggle to expose aria-pressed or an equivalent state attribute",
  ).toBe(true);
});

test("criterion 39: the persisted theme is already applied at DOMContentLoaded, not applied later", async ({
  browser,
}) => {
  // Persist an explicit dark choice via the real toggle (not by guessing
  // task 004's localStorage key/value directly), then reload under a light
  // system preference. If the inline script runs before paint (as
  // spec/no-flash.test.ts checks statically), <html data-theme="dark">
  // should already be set by the time DOMContentLoaded fires — no separate
  // "apply theme" step after hydration/paint.
  const context = await browser.newContext({ colorScheme: "light" });
  const page = await context.newPage();
  await page.goto("/");
  await themeToggle(page).click();
  const forcedTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  expect(forcedTheme, "toggle click did not set a data-theme attribute").toBeTruthy();

  await page.reload({ waitUntil: "domcontentloaded" });
  const dataTheme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
  expect(dataTheme, "persisted theme was not already applied at DOMContentLoaded").toBe(forcedTheme);
  await context.close();
});
