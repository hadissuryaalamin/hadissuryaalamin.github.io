---
status: pending
depends_on: []
parallel: true
conflicts_with: []
---
# Task 004 — Core functionality / logic

Full source of truth: `.claude/epics/personal-site/epic.md` §9 (technical
decisions), §7.6 (theme mechanics), §10 (CV download mechanism), §11
(portrait — the optimisation pipeline, not the crop/mask decisions which are
002's), §13 (phasing, for what's Phase 1 vs Phase 3).

This is a foundational task — 002 depends on the `ThemeInit` component you
build here. Prioritise landing `astro.config.*` and `ThemeInit.astro` early
so 002 is unblocked quickly; the image pipeline and GoatCounter wiring can
follow.

## What this task owns

- `astro.config.*` — `site: 'https://hadissuryaalamin.github.io'`,
  `base: '/'` (a user site is root-served — **do not** set a repo-name
  sub-path, that's the course-repo convention and is wrong here),
  `output: 'static'`, no adapter, no SSR.
- `src/scripts/theme.ts` — theme persistence logic (localStorage read/write,
  `data-theme` attribute management, system-preference listening).
- `src/components/ThemeInit.astro` — the **only** file in `src/components/`
  this task owns (002 owns the rest). Must contain:
  - A tiny **inline** script in `<head>`, before any paint, that reads
    `localStorage` and sets `data-theme` on `<html>` — no flash of the wrong
    theme on load (criterion 39).
  - The theme toggle: a real `<button>` with an accessible name and
    `aria-pressed` (or equivalent), reachable by keyboard. The toggle
    overrides system preference in **both** directions and the choice
    survives reload (criteria 38).
  - `<meta name="color-scheme" content="dark light">` so native form
    controls/scrollbars follow (can live here or in the shared layout — your
    call, note it in your update log so 002 doesn't duplicate it).
- `public/**` — static assets (favicon, `robots.txt` placeholder, etc. —
  favicon itself is a §16 open decision, coordinate with 002 if it also
  touches favicon markup).
- Image pipeline — the build-time processing of
  `E:\comp8020\misc_files\potrait.jpg` into the optimised, committed asset
  (resize ~640px long edge, WebP/AVIF + JPEG fallback, under ~60KB). **The
  crop framing, mask shape, and border treatment are 002's design call
  (§11)** — you own the pipeline/tooling that produces the optimised file(s)
  from the source, not the final visual treatment.
- GoatCounter include — one small `defer`-loaded script tag, site code
  **`hadissurya`**, endpoint `https://hadissurya.goatcounter.com/count`
  (account already exists, per epic.md §15 item 2). This is a **Phase 3**
  item (§13) — implement it but it does not block Phase 1 completion.
- `window.print()` wiring for the CV download button — the button itself is
  markup owned by 002; you may own the click handler if it's more than a
  bare inline `onclick="window.print()"` (coordinate — a bare inline handler
  needs no script from you at all, which is the simplest compliant option).

## Hard constraints

- **§7.6 theme mechanics steps 1–8 are binding** — re-read them in epic.md,
  this file only summarises. In particular: never give a colour its only
  definition inside a media/`[data-theme]` block (that's 002's token file,
  but your `ThemeInit` script is what sets the attribute those rules key
  off, so the two must agree on the attribute name and values: `data-theme`
  = `"light"` | `"dark"`, absent = system default).
- No server-side anything — this stays fully static (epic.md §2 non-goals).
- No custom domain, no cookie banner needed (GoatCounter is cookieless).
- Portrait pipeline target: **under ~60KB** for the final asset.

## Definition of done

- `pnpm build` succeeds with `base: '/'` and the site config above.
- Theme criteria 36–40 in epic.md §12 are satisfiable (verification itself
  is 005's job, but the mechanism must actually work when exercised
  manually/by a build agent).
- Optimised portrait asset(s) committed and under budget.
- Flip `status` to `completed`, log to
  `.claude/epics/personal-site/updates/004.md` — explicitly note when
  `ThemeInit.astro` and `astro.config.*` land, since 002 is blocked on this
  task and should be told as soon as those two pieces are usable even if the
  rest of this task (image pipeline, GoatCounter) is still in progress.
