// Criteria 41-44 (epic.md §12, §8.4): motion must never gate content.
//
// Criterion 41 is the one to test hardest (per task 005's brief: "a
// CSS-based hidden start state won't show up in a casual read"). The test
// below runs with JavaScript fully disabled via a real browser context
// (not just "don't call the animation function") — if any element's *from*
// state was authored in CSS (e.g. a class baked into the markup, or a
// stylesheet rule) rather than set imperatively by GSAP at runtime, it will
// still be hidden with JS off, and this test will catch it directly.
import { expect, test, type Locator, type Page } from "@playwright/test";
import { NOT_FOUND_ROUTE, ROUTES } from "./helpers/routes.ts";

const CONTENT_SELECTOR = "main a, main button, main h1, main h2, main h3, main p, main li";

async function assertAllVisible(page: Page, context: string) {
  const elements = page.locator(CONTENT_SELECTOR);
  const count = await elements.count();
  expect(count, `${context}: found no content elements to check — page may not have built yet`).toBeGreaterThan(0);

  const hidden: string[] = [];
  for (let i = 0; i < count; i++) {
    const el = elements.nth(i);
    const style = await el.evaluate((node) => {
      const s = getComputedStyle(node);
      return { display: s.display, visibility: s.visibility, opacity: s.opacity };
    });
    if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) < 0.95) {
      const text = (await el.textContent())?.trim().slice(0, 40) ?? "";
      hidden.push(`"${text}" (display:${style.display} visibility:${style.visibility} opacity:${style.opacity})`);
    }
  }
  expect(hidden, `${context}: elements not fully visible:\n${hidden.join("\n")}`).toEqual([]);
}

for (const route of [...ROUTES, NOT_FOUND_ROUTE]) {
  test(`criterion 41: with JavaScript disabled, ${route} is fully visible and usable`, async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(route);
    await assertAllVisible(page, route);

    // "usable" — every link has a real href, not a javascript:void or empty
    // fragment that only worked via a JS handler.
    const links = page.locator("main a");
    const linkCount = await links.count();
    for (let i = 0; i < linkCount; i++) {
      const href = await links.nth(i).getAttribute("href");
      expect(href, `a link on ${route} has no usable href with JS disabled`).toBeTruthy();
      expect(href).not.toMatch(/^javascript:/i);
    }

    await context.close();
  });
}

test("criterion 42: prefers-reduced-motion: reduce => content starts in its final state, no entrance transforms", async ({
  browser,
}) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/");
  // Deliberately no scroll — under reduced motion, ScrollTrigger entrance
  // animations must not even be registered (epic.md §8.4 item 3), so
  // below-the-fold content should already be in its final state without
  // ever being scrolled into view.
  await page.waitForTimeout(300);

  const elements = page.locator(CONTENT_SELECTOR);
  const count = await elements.count();
  expect(count).toBeGreaterThan(0);

  const notSettled: string[] = [];
  for (let i = 0; i < count; i++) {
    const el = elements.nth(i);
    const style = await el.evaluate((node) => {
      const s = getComputedStyle(node);
      return { opacity: s.opacity, transform: s.transform };
    });
    const transformIsIdentity = style.transform === "none" || /^matrix\(1, 0, 0, 1, 0, 0\)$/.test(style.transform);
    if (Number(style.opacity) < 0.95 || !transformIsIdentity) {
      const text = (await el.textContent())?.trim().slice(0, 40) ?? "";
      notSettled.push(`"${text}" (opacity:${style.opacity} transform:${style.transform})`);
    }
  }
  expect(notSettled, `elements not in a settled final state under reduced motion:\n${notSettled.join("\n")}`).toEqual(
    [],
  );
  await context.close();
});

test("criterion 43: no animation runs without a scroll or load trigger (no ambient loop)", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(700); // let any load-triggered entrance animation finish settling

  // No element anywhere on the page should be mid-way through an
  // infinitely-repeating CSS animation — that is the signature of ambient
  // background motion, which epic.md §8.4 item 1 rules out entirely.
  const infiniteAnimation = await page.evaluate(() => {
    const offenders: string[] = [];
    for (const el of Array.from(document.querySelectorAll("body *"))) {
      const style = getComputedStyle(el);
      if (style.animationIterationCount === "infinite" && style.animationName !== "none") {
        offenders.push(`${el.tagName.toLowerCase()}.${Array.from(el.classList).join(".")}`);
      }
    }
    return offenders;
  });
  expect(infiniteAnimation, `found infinitely-looping CSS animation(s): ${infiniteAnimation.join(", ")}`).toEqual([]);

  // Snapshot a representative below-the-fold element's transform/opacity
  // twice, ~600ms apart, with no scroll in between. No change => nothing is
  // animating on a timer while at rest.
  const probe = page.locator("main").locator("h2, h3, li, p").last();
  if ((await probe.count()) === 0) return;
  const snapshot = () => probe.evaluate((el) => `${getComputedStyle(el).opacity}|${getComputedStyle(el).transform}`);
  const before = await snapshot();
  await page.waitForTimeout(600);
  const after = await snapshot();
  expect(after, "a below-the-fold element changed style with no scroll interaction — looks like ambient motion").toBe(
    before,
  );
});

test("criterion 44: animations do not reverse on scroll-up (once: true)", async ({ page }) => {
  await page.goto("/");

  const target: Locator = page.locator("main").locator("h2, h3").first();
  if ((await target.count()) === 0) test.skip(true, "no section heading found yet — wait on tasks 001/002");

  await target.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700); // let the entrance animation finish
  const settled = await target.evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(settled), "element did not settle to fully visible after scrolling into view").toBeGreaterThanOrEqual(
    0.95,
  );

  // Scroll back to the very top, past the trigger point, then re-check.
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  const afterScrollUp = await target.evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(afterScrollUp), "element reverted to hidden after scrolling back up — animation is not once:true").toBeGreaterThanOrEqual(
    0.95,
  );
});
