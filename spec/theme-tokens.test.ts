// Criterion 40 (epic.md §12, §7.6 mechanics): every colour token is defined
// on bare `:root`; none is defined *only* inside a media query or
// `[data-theme]` block. This is a static parse of the stylesheet(s) — no
// browser needed. The dynamic half of theme mechanics (36-39: actual
// rendered colours under system/toggle preference) lives in
// tests/theme.spec.ts.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join } from "node:path";
import { describe, expect, it } from "vitest";

// The token names epic.md §7.5 specifies. Content-dependent: task 002 owns
// src/styles/** and may not have landed these yet (red until it does).
const EXPECTED_TOKENS = [
  "--bg",
  "--bg-elevated",
  "--surface",
  "--border",
  "--border-strong",
  "--text",
  "--text-muted",
  "--text-faint",
  "--accent",
  "--accent-ink",
  "--accent-contrast",
  "--focus",
  "--code-bg",
];

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

function cssSources(): { file: string; css: string }[] {
  const files = walk("src").filter((f) => [".css", ".astro"].includes(extname(f)));
  return files.map((file) => {
    const raw = readFileSync(file, "utf8");
    if (extname(file) === ".astro") {
      // Pull out <style>...</style> block(s) only.
      const styleBlocks = [...raw.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]);
      return { file, css: styleBlocks.join("\n") };
    }
    return { file, css: raw };
  });
}

interface RuleBlock {
  selector: string;
  body: string;
  /** The chain of enclosing selectors/at-rules, outermost first. */
  ancestors: string[];
}

/**
 * Minimal brace-matching CSS parser: enough to know each block's selector,
 * body, and full ancestor chain (not just nesting depth — a `:root` wrapped
 * in a structural `@layer`/`@supports` block is still "bare" for our
 * purposes; only `@media`/`[data-theme]` ancestors make it conditional, see
 * isConditional() below).
 */
function parseBlocks(css: string): RuleBlock[] {
  const noComments = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const blocks: RuleBlock[] = [];
  const stack: { selector: string; start: number }[] = [];
  let buffer = "";

  for (let i = 0; i < noComments.length; i++) {
    const ch = noComments[i];
    if (ch === "{") {
      stack.push({ selector: buffer.trim(), start: i + 1 });
      buffer = "";
    } else if (ch === "}") {
      const top = stack.pop();
      if (top) {
        const ancestors = stack.map((s) => s.selector);
        blocks.push({ selector: top.selector, body: noComments.slice(top.start, i), ancestors });
      }
      buffer = "";
    } else {
      buffer += ch;
    }
  }
  return blocks;
}

function isBareRoot(selector: string): boolean {
  return selector
    .split(",")
    .map((s) => s.trim())
    .includes(":root");
}

function isRootish(selector: string): boolean {
  // Anything that targets :root at all, bare or qualified (e.g.
  // `:root[data-theme="dark"]`, `:root:not([data-theme="light"])`).
  return /:root\b/.test(selector);
}

/** A media query or a [data-theme]-qualified selector, per criterion 40's own wording. */
function isConditional(selectorOrAtRule: string): boolean {
  return /^@media\b/i.test(selectorOrAtRule) || /\[data-theme/i.test(selectorOrAtRule);
}

function tokenNamesIn(body: string): Set<string> {
  const names = new Set<string>();
  for (const match of body.matchAll(/(--[a-zA-Z0-9-]+)\s*:/g)) {
    names.add(match[1]);
  }
  return names;
}

const allSources = cssSources();
const allBlocks = allSources.flatMap(({ file, css }) => parseBlocks(css).map((b) => ({ ...b, file })));

const bareRootTokens = new Set<string>();
const overrideOnlyCandidates = new Set<string>();

for (const block of allBlocks) {
  if (!isRootish(block.selector)) continue;
  const names = tokenNamesIn(block.body);
  const underConditionalAncestor = block.ancestors.some(isConditional);
  const isBare = isBareRoot(block.selector) && !isConditional(block.selector) && !underConditionalAncestor;
  if (isBare) {
    names.forEach((n) => bareRootTokens.add(n));
  } else {
    // Inside @media (light/dark), or a qualified selector like
    // :root[data-theme="dark"] — either way, "not bare" per criterion 40.
    names.forEach((n) => overrideOnlyCandidates.add(n));
  }
}

describe("criterion 40: every colour token is defined on bare :root", () => {
  it("found at least one stylesheet to check (sanity)", () => {
    expect(allSources.length).toBeGreaterThan(0);
  });

  for (const token of EXPECTED_TOKENS) {
    it(`${token} is defined inside a bare :root block`, () => {
      expect(
        bareRootTokens.has(token),
        `${token} was not found in any top-level, unqualified ":root { }" block — ` +
          `wait on task 002, or it's defined only inside a media/[data-theme] block`,
      ).toBe(true);
    });
  }

  it("no colour token is defined ONLY inside a media query or [data-theme] block", () => {
    const overrideOnly = [...overrideOnlyCandidates].filter((name) => !bareRootTokens.has(name));
    expect(overrideOnly, `these tokens are only ever overridden, never given a bare :root base: ${overrideOnly}`).toEqual(
      [],
    );
  });
});
