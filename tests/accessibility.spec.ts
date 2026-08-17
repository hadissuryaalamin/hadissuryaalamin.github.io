// Criteria 45-47 (epic.md §12, §9.1): axe zero serious/critical violations
// on every page in both themes; WCAG AA contrast in both themes (axe's
// wcag2aa/wcag21aa rule sets include color-contrast, so one scan covers
// both 45 and 46); keyboard reachability with a visible focus indicator;
// skip link works. Criterion 48 (landmarks, heading order) is static and
// lives in spec/landmarks.test.ts — this file only re-confirms it's covered
// by axe's own landmark rules as a second, independent signal.
//
// Both themes are exercised via `colorScheme` media emulation rather than
// the toggle/localStorage mechanism, so this suite doesn't depend on task
// 004's exact implementation of theme persistence (see tests/theme.spec.ts
// for the toggle-specific criteria 36-39).
import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { NOT_FOUND_ROUTE, ROUTES } from "./helpers/routes.ts";

const ALL_ROUTES = [...ROUTES, NOT_FOUND_ROUTE];
const THEMES = ["light", "dark"] as const;

for (const route of ALL_ROUTES) {
  for (const theme of THEMES) {
    test(`criteria 45-46: ${route} has zero serious/critical axe violations in ${theme} mode`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto(route);

      const results = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21aa"]).analyze();

      const seriousOrCritical = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
      expect(
        seriousOrCritical,
        seriousOrCritical.map((v) => `${v.id}: ${v.help} (${v.nodes.length} node(s))`).join("\n"),
      ).toEqual([]);
    });
  }
}

test("criterion 47: skip link is the first focusable element and it works", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const active = page.locator(":focus");
  await expect(active).toHaveAttribute("href", /#/);
  const text = (await active.textContent())?.toLowerCase() ?? "";
  expect(text, "expected the first tab stop to be a 'Skip to content' link").toMatch(/skip/);

  // Activating it should jump to the main content — check the URL fragment
  // actually changed to point at it, which is the one thing every
  // reasonable implementation (native anchor jump or a JS focus() handler)
  // has in common.
  const href = await active.getAttribute("href");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(new RegExp(`${href}$`));
  await expect(page.locator("main")).toBeVisible();
});

test("criterion 47: interactive elements show a visible focus indicator", async ({ page }) => {
  await page.goto("/");

  // Sample the first several tab stops after the skip link rather than every
  // interactive element on the page — a global :focus-visible rule (epic.md
  // §7.7) should make this representative.
  await page.keyboard.press("Tab"); // skip link
  for (let i = 0; i < 5; i++) {
    await page.keyboard.press("Tab");
    const focused = page.locator(":focus");
    if ((await focused.count()) === 0) continue;

    const outline = await focused.evaluate((el) => {
      const style = getComputedStyle(el);
      return {
        outlineStyle: style.outlineStyle,
        outlineWidth: style.outlineWidth,
        boxShadow: style.boxShadow,
      };
    });

    const hasOutline = outline.outlineStyle !== "none" && outline.outlineWidth !== "0px";
    const hasBoxShadowRing = outline.boxShadow !== "none" && outline.boxShadow !== "";
    expect(
      hasOutline || hasBoxShadowRing,
      `tab stop #${i + 2} has no visible focus indicator (outline: ${JSON.stringify(outline)})`,
    ).toBe(true);
  }
});
