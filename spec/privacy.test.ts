// Privacy criteria (epic.md §12, 27-29) and §10's hard acceptance criterion.
//
// CRITICAL: this file must never contain the client's real phone number, not
// even as a "known bad" fixture (epic.md preamble, task 005 instructions).
// The Australian-mobile pattern below is copied VERBATIM from epic.md §12
// criterion 27 — do not "simplify" it, and do not replace the pattern-based
// test with a literal string comparison.
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { extname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { loadPages, textOf } from "./helpers/dist.ts";

// epic.md §12 criterion 27, verbatim.
const AU_MOBILE_PATTERN = /(?:\+?61|0)[\s-]?4\d{2}[\s-]?\d{3}[\s-]?\d{3}/g;
const LONG_DIGIT_RUN = /\d{9,}/g;

const REPO_ROOT = resolve(".");

// Directories we never walk: VCS internals, dependencies, generated caches,
// and the dist/_astro bundle directory (content-hashed build assets — a
// "known-safe context" for long digit runs per criterion 27's own wording).
//
// test-results/ and playwright-report/ are the same kind of thing: generated,
// gitignored, and full of timestamps. This walker deliberately scans the
// working tree rather than git's index, so it sees them unless they are named
// here — and a run ID in test-results/.last-run.json is enough to fail this
// spec for reasons that have nothing to do with anyone's phone number.
const EXCLUDED_DIRS = new Set([
  "node_modules",
  ".git",
  ".astro",
  "_astro",
  ".vscode",
  "test-results",
  "playwright-report",
]);

// Known-safe files (lockfiles) and binary-ish extensions we don't text-scan.
const EXCLUDED_FILES = new Set(["pnpm-lock.yaml", "package-lock.json", "yarn.lock"]);
const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".astro",
  ".md",
  ".mdx",
  ".json",
  ".css",
  ".html",
  ".htm",
  ".yml",
  ".yaml",
  ".txt",
  ".svg",
]);

function walk(dir: string, out: string[] = []): string[] {
  if (!existsSync(dir)) return out;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (EXCLUDED_DIRS.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.isFile()) {
      if (EXCLUDED_FILES.has(entry.name)) continue;
      if (entry.name.endsWith(".map")) continue;
      if (!TEXT_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue;
      out.push(full);
    }
  }
  return out;
}

// Scan the working tree (source, minus generated/binary/lockfile noise) plus
// dist/ once it exists. This is deliberately broader than "git tracked
// files" so it also catches an accidental phone number in an untracked
// scratch file before it ever gets committed.
const filesToScan = walk(REPO_ROOT);

interface Finding {
  file: string;
  pattern: "au-mobile" | "long-digit-run";
  match: string;
}

function scan(): Finding[] {
  const findings: Finding[] = [];
  for (const file of filesToScan) {
    const text = readFileSync(file, "utf8");
    const relPath = relative(REPO_ROOT, file);

    const auMobileHits = text.match(AU_MOBILE_PATTERN) ?? [];
    for (let i = 0; i < auMobileHits.length; i++) {
      findings.push({ file: relPath, pattern: "au-mobile", match: "[redacted — matched AU mobile pattern]" });
    }
    const longDigitHits = text.match(LONG_DIGIT_RUN) ?? [];
    for (const hit of longDigitHits) {
      findings.push({ file: relPath, pattern: "long-digit-run", match: `${hit.length} digits` });
    }
  }
  return findings;
}

describe("criterion 27: the phone number appears nowhere", () => {
  it("scanned at least one file (sanity check the walker isn't broken)", () => {
    expect(filesToScan.length).toBeGreaterThan(0);
  });

  it("no file in the repository matches the Australian mobile pattern", () => {
    const findings = scan().filter((f) => f.pattern === "au-mobile");
    expect(findings, JSON.stringify(findings, null, 2)).toEqual([]);
  });

  it("no file in the repository has an unexplained run of 9+ consecutive digits", () => {
    const findings = scan().filter((f) => f.pattern === "long-digit-run");
    expect(findings, JSON.stringify(findings, null, 2)).toEqual([]);
  });

  it("dist/ (once built) matches the Australian mobile pattern nowhere", () => {
    const pages = loadPages();
    if (pages.length === 0) return; // not built yet — covered by the walker above regardless
    for (const { name, html } of pages) {
      expect(html.match(AU_MOBILE_PATTERN), `matched AU mobile pattern in dist/${name}`).toBeNull();
    }
  });

  it("dist/ (once built) has no unexplained run of 9+ consecutive digits outside hashed assets", () => {
    const pages = loadPages();
    if (pages.length === 0) return;
    for (const { name, html } of pages) {
      const matches = html.match(LONG_DIGIT_RUN);
      expect(matches, `found a 9+ digit run in dist/${name}: ${JSON.stringify(matches)}`).toBeNull();
    }
  });
});

describe("criterion 28: no street address or postcode; location reads 'Canberra, Australia'", () => {
  const pages = loadPages();
  // ACT postcodes fall in the 2600-2699 range.
  const ACT_POSTCODE = /\b26\d{2}\b/;

  it("wherever 'Canberra' appears, it reads as 'Canberra, Australia' with no postcode nearby", () => {
    for (const { name, doc } of pages) {
      const text = textOf(doc);
      if (!/Canberra/i.test(text)) continue;
      expect(text, `expected "Canberra, Australia" on ${name}`).toMatch(/Canberra,\s*Australia/);

      for (const idx of [...text.matchAll(/Canberra/gi)].map((m) => m.index ?? 0)) {
        const nearby = text.slice(Math.max(0, idx - 20), idx + 40);
        expect(ACT_POSTCODE.test(nearby), `found what looks like an ACT postcode near "Canberra" on ${name}`).toBe(
          false,
        );
      }
    }
  });

  it("no page contains a street-address pattern (number + street/road/ave/etc.)", () => {
    const streetPattern = /\b\d{1,5}\s+[A-Z][a-zA-Z]*\s+(Street|St|Road|Rd|Avenue|Ave|Drive|Dr|Lane|Ln|Court|Ct|Place|Pl)\b/;
    for (const { name, doc } of pages) {
      expect(textOf(doc), `found what looks like a street address on ${name}`).not.toMatch(streetPattern);
    }
  });
});

describe("criterion 29: no cover-letter content anywhere", () => {
  // The seven tailored CVs/cover letters address specific companies (already
  // covered by content.test.ts's company-name scan) and use standard
  // cover-letter boilerplate this personal, first-person site should never
  // need.
  const coverLetterPhrases = [
    /Dear Hiring Manager/i,
    /Dear Sir(\s*\/\s*|\s+or\s+)Madam/i,
    /I am writing to apply/i,
    /I am writing to express my interest/i,
    /Yours sincerely/i,
    /Kind regards,/i,
  ];

  it("no page contains cover-letter salutation/closing boilerplate", () => {
    const pages = loadPages();
    for (const { name, doc } of pages) {
      const text = textOf(doc);
      for (const phrase of coverLetterPhrases) {
        expect(phrase.test(text), `found cover-letter-style boilerplate (${phrase}) on ${name}`).toBe(false);
      }
    }
  });
});
