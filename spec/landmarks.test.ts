// Criterion 48 (epic.md §12, §9.1): landmarks header/nav/main/footer present,
// heading levels never skip. Pure structural HTML — no browser needed. The
// rest of accessibility (45-47: axe scan, contrast, keyboard/focus) needs a
// real render and lives in tests/accessibility.spec.ts.
import { describe, expect, it } from "vitest";
import { loadPages } from "./helpers/dist.ts";

const pages = loadPages();

describe("criterion 48: landmarks are present on every page", () => {
  for (const { name, doc } of pages) {
    describe(name, () => {
      it("has a header landmark", () => {
        expect(doc.querySelector("header")).toBeTruthy();
      });
      it("has a main landmark", () => {
        expect(doc.querySelector("main")).toBeTruthy();
      });
      it("has a footer landmark", () => {
        expect(doc.querySelector("footer")).toBeTruthy();
      });
      // nav is already covered by spec/invariants.test.ts (criterion 9), not
      // repeated here.
    });
  }
});

describe("criterion 48: heading levels never skip", () => {
  for (const { name, doc } of pages) {
    it(`${name}: no heading level is skipped`, () => {
      // Standard heading-order heuristic (matches axe-core's headingOrder
      // rule): a heading may drop back to any shallower level freely (that's
      // just closing out a subsection), but it may only get one level
      // *deeper* than the immediately preceding heading at a time.
      const headings = Array.from(doc.querySelectorAll("h1, h2, h3, h4, h5, h6"));
      let previousLevel = 0;
      for (const heading of headings) {
        const level = Number(heading.tagName.slice(1));
        expect(
          level,
          `"${heading.textContent?.trim()}" jumps from h${previousLevel} to h${level} on ${name} — skips a level`,
        ).toBeLessThanOrEqual(previousLevel + 1);
        previousLevel = level;
      }
    });
  }
});
