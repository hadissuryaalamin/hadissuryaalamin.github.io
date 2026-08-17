// Course-invariant baseline, ported from
// E:\comp8020\comp4020-ass1-hadissuryaalamin\spec\invariants.test.ts and run
// against THIS project's dist/ output (epic.md §9.1, criteria 1, 6-13).
//
// These hold for any good website. The site-specific contract lives in
// spec/content.test.ts and friends alongside this file.
import { describe, expect, it } from "vitest";
import {
  distExists,
  internalLinks,
  loadPages,
  resolveInternalHref,
} from "./helpers/dist.ts";

const pages = loadPages();

describe("invariants: build", () => {
  it("built at least one page (criterion 1: `pnpm build` emits dist/)", () => {
    expect(distExists(), "run `pnpm build` first").toBe(true);
    expect(pages.length).toBeGreaterThan(0);
  });
});

describe("invariants: every page", () => {
  for (const { name, doc } of pages) {
    describe(name, () => {
      it("declares its language (criterion 6)", () => {
        expect(doc.documentElement.getAttribute("lang")).toBeTruthy();
      });

      it("has a real, non-empty title (criterion 7)", () => {
        expect(doc.title.trim()).not.toBe("");
      });

      it("has a mobile viewport meta tag (criterion 8)", () => {
        expect(doc.querySelector('meta[name="viewport"]')).toBeTruthy();
      });

      it("has a navigation landmark (criterion 9)", () => {
        expect(doc.querySelector("nav")).toBeTruthy();
      });

      it("has exactly one top-level heading (criterion 10)", () => {
        expect(doc.querySelectorAll("h1").length).toBe(1);
      });

      it("gives every image alt text (criterion 11)", () => {
        for (const img of doc.querySelectorAll("img")) {
          expect(
            img.hasAttribute("alt"),
            `<img src="${img.getAttribute("src")}"> needs an alt attribute`,
          ).toBe(true);
        }
      });
    });
  }
});

describe("invariants: titles are distinct per page (criterion 7)", () => {
  it("no two pages share the exact same <title>", () => {
    const titles = pages.map(({ name, doc }) => ({ name, title: doc.title.trim() }));
    const seen = new Map<string, string>();
    for (const { name, title } of titles) {
      const clash = seen.get(title);
      expect(clash, `"${title}" is used by both ${clash} and ${name}`).toBeUndefined();
      seen.set(title, name);
    }
  });
});

describe("invariants: home page (criterion 12)", () => {
  it("index.html exists at the root of dist/", () => {
    expect(pages.find(({ name }) => name === "index.html")).toBeTruthy();
  });
});

describe("invariants: internal links resolve (criterion 13)", () => {
  for (const { name, doc, path } of pages) {
    const hrefs = internalLinks(doc);
    if (hrefs.length === 0) continue;

    describe(name, () => {
      for (const href of hrefs) {
        it(`"${href}" resolves to a built file`, () => {
          const { file, hash } = resolveInternalHref(href, path);
          expect(file, `"${href}" on ${name} does not resolve under dist/`).toBeTruthy();

          if (file && hash) {
            // Fragment links should point at a real anchor/id on the target page.
            const targetDoc = pages.find((p) => p.path === file)?.doc;
            if (targetDoc) {
              const namedAnchor = Array.from(targetDoc.querySelectorAll("a[name]")).find(
                (a) => a.getAttribute("name") === hash,
              );
              const target = targetDoc.getElementById(hash) ?? namedAnchor;
              expect(target, `"${href}" on ${name} points at missing id/name="${hash}"`).toBeTruthy();
            }
          }
        });
      }
    });
  }
});
