// Criterion 16 (primary "Email me" CTA is the highest-emphasis interactive
// element in the hero) and criterion 51 (no horizontal scroll at five
// viewports). Both need a real render / computed layout.
import { expect, test } from "@playwright/test";
import { EMAIL_MAILTO } from "../spec/fixtures/projects.ts";
import { NOT_FOUND_ROUTE, ROUTES } from "./helpers/routes.ts";

test("criterion 16: the primary Email me CTA is the highest-emphasis interactive element in the hero", async ({
  page,
}) => {
  await page.goto("/");

  const emailCta = page.locator(`a[href^="${EMAIL_MAILTO}"]`).first();
  await expect(emailCta, "no mailto: link found on the home page").toBeVisible();

  const ctaStyle = await emailCta.evaluate((el) => {
    const s = getComputedStyle(el);
    return { backgroundColor: s.backgroundColor, fontSize: parseFloat(s.fontSize) };
  });
  const hasFill = !["rgba(0, 0, 0, 0)", "transparent"].includes(ctaStyle.backgroundColor);
  expect(hasFill, `expected the primary CTA to have an accent fill background, got ${ctaStyle.backgroundColor}`).toBe(
    true,
  );

  // Compare against the secondary ("View CV") and tertiary (LinkedIn/GitHub)
  // hero links, which epic.md §5.1(a) specifies as plain text links — i.e.
  // no background fill, and no larger than the primary CTA's text.
  const otherHeroLinks = page.locator("a").filter({ hasText: /view cv|linkedin|github/i });
  const otherCount = await otherHeroLinks.count();
  for (let i = 0; i < otherCount; i++) {
    const other = otherHeroLinks.nth(i);
    const style = await other.evaluate((el) => {
      const s = getComputedStyle(el);
      return { backgroundColor: s.backgroundColor, fontSize: parseFloat(s.fontSize) };
    });
    const otherHasFill = !["rgba(0, 0, 0, 0)", "transparent"].includes(style.backgroundColor);
    expect(
      otherHasFill,
      `secondary/tertiary hero link unexpectedly has a fill background too (${style.backgroundColor}) — the primary CTA should stand alone as the highest-emphasis element`,
    ).toBe(false);
    expect(style.fontSize, "a secondary/tertiary hero link is larger than the primary CTA").toBeLessThanOrEqual(
      ctaStyle.fontSize,
    );
  }
});

const VIEWPORTS = [
  { name: "320px", width: 320, height: 640 },
  { name: "390x844", width: 390, height: 844 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1280px", width: 1280, height: 800 },
  { name: "1920x1080", width: 1920, height: 1080 },
];

for (const viewport of VIEWPORTS) {
  for (const route of [...ROUTES, NOT_FOUND_ROUTE]) {
    test(`criterion 51: ${route} has no horizontal scroll at ${viewport.name}`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(route);
      const { scrollWidth, clientWidth } = await page.evaluate(() => ({
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      }));
      expect(
        scrollWidth,
        `${route} at ${viewport.name}: scrollWidth ${scrollWidth} > clientWidth ${clientWidth} — horizontal overflow`,
      ).toBeLessThanOrEqual(clientWidth);
    });
  }
}
