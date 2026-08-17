// Criterion 39 (epic.md §12, §7.6 mechanics item 6): "no flash of the wrong
// theme on load." The mechanism epic.md specifies is a tiny INLINE script in
// <head>, before any paint, that reads localStorage and sets data-theme on
// <html>. That's a structural precondition checkable statically, without a
// browser: the script must exist, be inline (no src), be synchronous (no
// defer/async/type=module, all of which delay execution past parsing), and
// live in <head>. The runtime half (does it actually work, no visible flash)
// is checked in tests/theme.spec.ts.
import { describe, expect, it } from "vitest";
import { loadPages } from "./helpers/dist.ts";

const pages = loadPages();

describe("criterion 39: an inline, synchronous, before-paint theme script exists in <head>", () => {
  for (const { name, doc } of pages) {
    it(`${name} has one`, () => {
      const headScripts = Array.from(doc.querySelectorAll("head script"));
      const candidates = headScripts.filter((s) => {
        const inline = !s.hasAttribute("src");
        const sync = !s.hasAttribute("defer") && !s.hasAttribute("async") && s.getAttribute("type") !== "module";
        const mentionsTheme = /data-theme|dataset\.theme/i.test(s.textContent ?? "");
        const mentionsStorage = /localStorage/i.test(s.textContent ?? "");
        return inline && sync && mentionsTheme && mentionsStorage;
      });

      expect(
        candidates.length,
        `${name}: expected an inline, synchronous <script> in <head> reading localStorage and setting ` +
          `data-theme — wait on task 004 (src/components/ThemeInit.astro)`,
      ).toBeGreaterThan(0);
    });
  }
});
