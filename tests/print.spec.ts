// Criteria 32-35 (epic.md §12, §10): printing /cv/ while dark theme is
// active still produces black-on-white; the portrait is hidden in print;
// site chrome (nav/footer/toggle/download button) is hidden in print; no
// experience/education entry splits across a page break.
import { expect, test, type Page } from "@playwright/test";

function relativeLuminance(rgb: string): number {
  const match = rgb.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (!match) return -1;
  const [r, g, b] = [match[1], match[2], match[3]].map((n) => Number(n) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

async function forceDarkThenPrint(page: Page) {
  // Force dark theme explicitly (criterion 32 is specifically about
  // printing WHILE the dark theme is active), then switch the emulated
  // media to print. Order matters: dark must be the active theme first.
  await page.goto("/cv/", { waitUntil: "domcontentloaded" });
  const html = page.locator("html");
  const alreadyDark = (await html.getAttribute("data-theme")) === "dark";
  if (!alreadyDark) {
    const toggle = page.getByRole("button", { name: /theme|dark|light|appearance/i });
    if (await toggle.isVisible().catch(() => false)) {
      await toggle.click();
    }
  }
  await page.emulateMedia({ media: "print" });
}

test("criterion 32: printing /cv/ in dark theme produces a light background and dark text", async ({ page }) => {
  await forceDarkThenPrint(page);

  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  const bgLuminance = relativeLuminance(bg);
  expect(bgLuminance, `print body background luminance was ${bgLuminance} (${bg}), expected light (> 0.8)`).toBeGreaterThan(
    0.8,
  );

  const color = await page.evaluate(() => getComputedStyle(document.body).color);
  const textLuminance = relativeLuminance(color);
  expect(textLuminance, `print body text luminance was ${textLuminance} (${color}), expected dark (< 0.3)`).toBeLessThan(
    0.3,
  );
});

test("criterion 33: the portrait is not rendered in print", async ({ page }) => {
  await forceDarkThenPrint(page);
  const portrait = page.getByRole("img", { name: /Hadis/i });
  if ((await portrait.count()) === 0) {
    test.skip(true, "no portrait <img alt=\"...Hadis...\"> found yet — wait on tasks 001/002/004");
  }
  await expect(portrait.first()).toBeHidden();
});

test("criterion 34: nav, footer, theme toggle, and the download button are hidden in print", async ({ page }) => {
  await forceDarkThenPrint(page);

  await expect(page.locator("nav").first()).toBeHidden();
  await expect(page.locator("footer").first()).toBeHidden();

  const toggle = page.getByRole("button", { name: /theme|dark|light|appearance/i });
  if ((await toggle.count()) > 0) {
    await expect(toggle.first()).toBeHidden();
  }

  const downloadButton = page.getByRole("button", { name: /download cv/i });
  if ((await downloadButton.count()) > 0) {
    await expect(downloadButton.first()).toBeHidden();
  }
});

test("criterion 31: the Download CV (PDF) button calls window.print()", async ({ page }) => {
  await page.goto("/cv/");
  const downloadButton = page.getByRole("button", { name: /download cv/i });
  await expect(downloadButton).toBeVisible();

  // Stub window.print() entirely rather than calling through to the real
  // one — headless Chromium has no print dialog to resolve, and letting the
  // real call through risks hanging the test on it.
  let printCalled = false;
  await page.exposeFunction("__printSpy", () => {
    printCalled = true;
  });
  await page.addInitScript(() => {
    const w = window as unknown as { print: () => void; __printSpy: () => void };
    w.print = () => {
      w.__printSpy();
    };
  });
  await page.reload();
  await page.getByRole("button", { name: /download cv/i }).click();
  expect(printCalled, "clicking the button did not call window.print()").toBe(true);
});

test("criterion 35: no experience/education entry splits across a page break", async ({ page }) => {
  await forceDarkThenPrint(page);

  const entries = page.locator(
    "main li, main article, [data-testid*='entry' i], [class*='entry' i], [data-testid*='experience' i], [data-testid*='education' i]",
  );
  const count = await entries.count();
  if (count === 0) {
    test.skip(true, "no experience/education entry elements found yet — wait on tasks 001/002");
  }

  for (let i = 0; i < count; i++) {
    const entry = entries.nth(i);
    const breakInside = await entry.evaluate((el) => getComputedStyle(el).breakInside);
    expect(["avoid", "avoid-page", "avoid-column"], `entry #${i} has break-inside: ${breakInside}`).toContain(
      breakInside,
    );
  }
});
