#!/usr/bin/env node
/**
 * Minimal, dependency-free static file server for dist/ — used by
 * playwright.config.ts's webServer instead of `astro preview`.
 *
 * Why this exists: this project's Astro version (7.2.2) changed `astro
 * preview` into a daemon launcher — the CLI command forks a detached
 * background server and the invoking process exits (code 0) almost
 * immediately, printing "Preview server running at ... (pid N)". Playwright's
 * `webServer.command` expects a command that blocks in the foreground for
 * the life of the test run; against a command that returns right away it
 * intermittently (racily) reports "Process from config.webServer exited
 * early" and refuses to run the suite — sometimes it wins the race against
 * Playwright's own readiness probe and sometimes it doesn't. Left as `astro
 * preview`, `pnpm check`/`playwright test` would be flaky in exactly this
 * way in CI too (CI always spawns fresh, with no already-running server to
 * fall back on the way local runs can via `reuseExistingServer`).
 *
 * This script has no such problem: `http.Server#listen` keeps the Node
 * process alive on its own, so the process Playwright spawns and tracks
 * really does stay running for the duration of the suite.
 *
 * Routing matches this project's build output — `trailingSlash: 'always'`
 * + `build.format: 'directory'` in astro.config.mjs, so every route is a
 * real `<route>/index.html` — and falls back to dist/404.html (status 404)
 * for anything unmatched, mirroring GitHub Pages' own custom-404 behaviour.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, sep } from 'node:path';

const PORT = Number(process.argv[2] ?? process.env.PORT ?? 4321);
const ROOT = join(process.cwd(), 'dist');

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

/** Resolve a request path to a file under dist/, refusing to escape ROOT. */
async function resolveFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split('?')[0].split('#')[0]);
  const safe = normalize(clean).replace(/^(\.\.[/\\])+/, '');
  const base = join(ROOT, safe);
  if (!base.startsWith(ROOT + sep) && base !== ROOT) return null;

  const candidates = clean.endsWith('/')
    ? [join(base, 'index.html')]
    : [base, `${base}.html`, join(base, 'index.html')];

  for (const candidate of candidates) {
    try {
      const s = await stat(candidate);
      if (s.isFile()) return candidate;
    } catch {
      // try the next candidate
    }
  }
  return null;
}

const server = createServer(async (req, res) => {
  try {
    const file = await resolveFile(req.url ?? '/');
    if (file) {
      const body = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(body);
      return;
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Internal error: ${err instanceof Error ? err.message : String(err)}`);
    return;
  }

  try {
    const notFoundBody = await readFile(join(ROOT, '404.html'));
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(notFoundBody);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
});

server.listen(PORT, () => {
  console.log(`Static server for dist/ listening at http://localhost:${PORT}`);
});
