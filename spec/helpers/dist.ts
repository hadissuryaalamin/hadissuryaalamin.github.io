// Shared helpers for reading the built site out of `dist/`.
//
// These tests run against the BUILT output, not the source, because that is
// what actually ships (see spec/invariants.test.ts). They intentionally
// avoid depending on any particular markup/data-testid contract from
// tasks 001/002/003/004, since this task (005) is written before those land
// — see epic.md §14: "005 can be written against this document before the
// pages exist." Where a convention would help other tasks land green faster,
// it's noted in updates/005.md instead of hard-coded here.
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, posix, relative, resolve, sep } from "node:path";
import { JSDOM } from "jsdom";

function toPosix(p: string): string {
  return p.split(sep).join("/");
}

export const DIST = resolve("dist");

export function distExists(): boolean {
  return existsSync(DIST);
}

export function htmlFiles(dir: string = DIST): string[] {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return htmlFiles(path);
    return entry.name.endsWith(".html") ? [path] : [];
  });
}

export interface DistPage {
  /** path relative to dist/, forward-slash normalised */
  name: string;
  path: string;
  doc: Document;
  html: string;
}

export function loadPages(): DistPage[] {
  return htmlFiles().map((path) => {
    const html = readFileSync(path, "utf8");
    return {
      name: toPosix(relative(DIST, path)),
      path,
      doc: new JSDOM(html).window.document,
      html,
    };
  });
}

/**
 * Resolve a site-relative route (e.g. "/", "/cv/", "/projects/idx-alpha/")
 * to a built file under dist/, trying both Astro `build.format` outputs
 * ("directory" -> index.html, "file" -> <route>.html) since that choice is
 * delegated to task 004 (epic.md §16 item 5) and not fixed yet.
 */
export function resolveRoute(route: string): DistPage | null {
  let clean = route.split("?")[0].split("#")[0];
  if (!clean.startsWith("/")) clean = `/${clean}`;
  const trimmed = clean.replace(/\/+$/, ""); // strip trailing slash(es)
  const segment = trimmed === "" ? "" : trimmed.slice(1); // drop leading slash

  const candidates = [
    join(DIST, segment, "index.html"),
    join(DIST, `${segment}.html`),
    join(DIST, segment === "" ? "index.html" : segment),
  ];

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      const html = readFileSync(candidate, "utf8");
      return {
        name: toPosix(relative(DIST, candidate)),
        path: candidate,
        doc: new JSDOM(html).window.document,
        html,
      };
    }
  }
  return null;
}

export function resolve404(): DistPage | null {
  // Astro's special 404 page is conventionally emitted at the dist root
  // regardless of build.format.
  return resolveRoute("/404") ?? resolveRoute("/404.html");
}

/** Normalised visible-ish text of a document (script/style stripped). */
export function textOf(doc: Document): string {
  const clone = doc.documentElement.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("script, style").forEach((el) => el.remove());
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
}

/**
 * All same-site internal hrefs found in a page: absolute-path (`/foo`),
 * relative (`foo/bar`), and hash-only (`#foo`) links. Excludes external
 * (http/https/mailto/tel) and data/javascript URLs.
 */
export function internalLinks(doc: Document): string[] {
  const hrefs = Array.from(doc.querySelectorAll("a[href]")).map((a) => a.getAttribute("href") ?? "");
  return hrefs.filter((href) => {
    if (!href) return false;
    if (/^(https?:)?\/\//i.test(href)) return false;
    if (/^(mailto|tel|javascript|data):/i.test(href)) return false;
    return true;
  });
}

/**
 * Resolve an internal href found in `fromFile` (an absolute path under
 * dist/) to a candidate file on disk, honouring both possible
 * `build.format` outputs. Returns null if nothing on disk matches.
 */
export function resolveInternalHref(href: string, fromFile: string): { file: string | null; hash: string | null } {
  const hashIndex = href.indexOf("#");
  const hash = hashIndex >= 0 ? href.slice(hashIndex + 1) : null;
  const withoutHash = hashIndex >= 0 ? href.slice(0, hashIndex) : href;
  const withoutQuery = withoutHash.split("?")[0];

  if (withoutQuery === "") {
    // pure "#fragment" link on the same page
    return { file: fromFile, hash };
  }

  let routePath: string;
  if (withoutQuery.startsWith("/")) {
    routePath = withoutQuery;
  } else {
    // relative to the directory the current file lives in, expressed as a
    // dist-root-relative posix path so resolveRoute's logic still applies
    const fromDir = toPosix(dirname(relative(DIST, fromFile)));
    const base = fromDir === "." ? "/" : `/${fromDir}/`;
    routePath = posix.normalize(posix.join(base, withoutQuery));
  }

  const page = resolveRoute(routePath);
  return { file: page ? page.path : null, hash };
}
