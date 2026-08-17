// Static half of the performance/layout criteria (epic.md §12, 49-50) that
// don't need a browser: portrait asset file size, and explicit
// width/height/aspect-ratio on every shipped <img>. The dynamic half — home
// page total transferred weight, and no horizontal scroll at five viewports
// — needs a real page render and lives in tests/performance.spec.ts and
// tests/layout.spec.ts.
import { existsSync, readdirSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { loadPages } from "./helpers/dist.ts";

const PORTRAIT_MAX_BYTES = 60 * 1024 * 1.15; // ~60KB with a little slack for the "~"

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

// The final on-disk location of the optimised portrait is task 004's call
// (image pipeline, epic.md §11/§14). "potrait" (sic) matches the source
// file's actual name in epic.md §11 (E:\comp8020\misc_files\potrait.jpg) in
// case it's carried over as-is.
const IMAGE_EXTENSIONS = new Set([".webp", ".avif", ".jpg", ".jpeg", ".png"]);
const PORTRAIT_NAME_PATTERN = /portrait|potrait|headshot|profile/i;

const anyPortraitCandidate = ["public", "src/assets", "src/images", "src/content", "dist"]
  .flatMap((d) => walk(d))
  .some((f) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()) && PORTRAIT_NAME_PATTERN.test(f));

// Only public/ and dist/ are checked against the byte budget: those are
// what actually ships. A source image under src/assets/ is expected to be
// larger pre-optimisation — Astro's image pipeline (or a manual build step)
// is what's supposed to bring it under budget on the way to dist/.
const shippedPortraitFiles = ["public", "dist"]
  .flatMap((d) => walk(d))
  .filter((f) => IMAGE_EXTENSIONS.has(extname(f).toLowerCase()) && PORTRAIT_NAME_PATTERN.test(f));

describe("criterion 49: portrait asset is under ~60KB", () => {
  it("a portrait-like image exists somewhere in the project", () => {
    expect(anyPortraitCandidate, "no file matching /portrait|headshot|profile/i found — wait on task 004").toBe(
      true,
    );
  });

  it("a shipped portrait (under public/ or dist/) exists", () => {
    expect(
      shippedPortraitFiles.length,
      "found a portrait-like source file but nothing shipped under public/ or dist/ yet — wait on task 004's image pipeline/build",
    ).toBeGreaterThan(0);
  });

  for (const file of shippedPortraitFiles) {
    it(`${file} is under ~60KB`, () => {
      const size = statSync(file).size;
      expect(size, `${file} is ${(size / 1024).toFixed(1)}KB, budget is ~60KB`).toBeLessThanOrEqual(
        PORTRAIT_MAX_BYTES,
      );
    });
  }
});

describe("epic.md §11: the superseded cartoon avatar is never shipped", () => {
  it("dist/ contains no reference to avatar.png", () => {
    const pages = loadPages();
    for (const { name, html } of pages) {
      expect(html, `dist/${name} references avatar.png, which epic.md §11 says must not be used`).not.toMatch(
        /avatar\.png/i,
      );
    }
  });
});

describe("criterion 50: every image has explicit dimensions (no unexpected layout shift)", () => {
  it("every <img> in dist/ has width+height attributes, or an explicit aspect-ratio", () => {
    const pages = loadPages();
    for (const { name, doc } of pages) {
      for (const img of Array.from(doc.querySelectorAll("img"))) {
        const hasWidthHeight = img.hasAttribute("width") && img.hasAttribute("height");
        const style = img.getAttribute("style") ?? "";
        const hasAspectRatio = /aspect-ratio/i.test(style) || /aspect-/.test(img.className ?? "");
        expect(
          hasWidthHeight || hasAspectRatio,
          `<img src="${img.getAttribute("src")}"> on ${name} has no width/height and no aspect-ratio`,
        ).toBe(true);
      }
    }
  });
});
