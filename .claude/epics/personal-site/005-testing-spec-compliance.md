---
status: pending
depends_on: []
parallel: true
conflicts_with: []
---
# Task 005 — Testing & spec compliance

Full source of truth: `.claude/epics/personal-site/epic.md` §9.1 (quality
bar), §12 (the full acceptance-criteria list — 51 items, this task's real
spec), §10 (print), §8.4 (motion/JS-off/reduced-motion). Use the
`webapp-testing` skill (Playwright).

You can and should start immediately, before the pages exist — write these
tests against `epic.md` directly, red-first (course TDD habit: "spec/*.test.ts
is the executable contract to turn from red to green").

## What this task owns

- `spec/**` and `tests/**`.
- `.github/workflows/**` — CI: build + Pages deploy from `main`, plus running
  `pnpm check` as a gate.
- The `check` **script entry** in `package.json` (the `scripts.check` line
  only — one command chaining typecheck → build → lint → tests, mirroring
  the client's existing course habit). Other tasks will add
  dependencies/devDependencies to `package.json` as they need them; that's
  additive and not your concern to prevent, just don't let your own edits to
  `scripts.check` collide — if you find `scripts.check` already modified by
  someone else when you go to add it, that's a signal to sync with the
  coordinating session rather than overwrite.

## Port the base invariants first

`E:\comp8020\comp4020-ass1-hadissuryaalamin\spec\invariants.test.ts` is the
reference implementation for the course-invariant baseline (epic.md §9.1).
Port it to run against this project's `dist/`:

- at least one page builds; every page declares `lang`; every page has a
  non-empty, per-page-distinct `<title>`; `meta[name="viewport"]` present;
  a `<nav>` present; exactly one `<h1>`; every `<img>` has `alt`;
  `index.html` exists at `dist/` root; all internal links resolve (link
  check over `dist/`).

## Then add everything epic.md §12 requires beyond the base invariants

Read §12 in full and write one assertion per line — it is written to be
turned directly into a test suite. Non-exhaustive highlights, because these
are the easiest to under-test:

- **Content correctness that's easy to get subtly wrong**: IDX-alpha has NO
  Sharpe ratio in card summary/detail-hero/metric-strip and IS labelled
  work-in-progress (criterion 22); DishPatch links PRs #33 and #41 by name
  (criterion 20); GPT-2 project credits `karpathy/nanoGPT` and links the
  **new** repo name, not `nanoGPT` (criterion 22b); no COMP4020 prototype
  mentioned anywhere (criterion 24); no tailored-CV company name anywhere
  (criterion 25).
- **Privacy — test without ever writing the phone number down** (criterion
  27): scan all tracked files plus `dist/` for the Australian mobile pattern
  `/(?:\+?61|0)[\s-]?4\d{2}[\s-]?\d{3}[\s-]?\d{3}/` and any run of 9+
  consecutive digits outside known-safe contexts (hashes, lockfiles) —
  expect zero matches. Do not hardcode the actual phone number anywhere in
  the test file itself, including as a "known bad" fixture.
- **Print** (criteria 32–35): printing `/cv/` while dark theme is active
  produces black-on-white (assert print-media computed styles); portrait
  not rendered in print; nav/footer/toggle/download-button hidden in print;
  no experience/education entry splits across a page break
  (`break-inside: avoid`).
- **Theme** (criteria 36–40): dark/light system-preference defaults with no
  stored preference; toggle overrides both directions and survives reload;
  no flash of wrong theme on load; every colour token defined on bare
  `:root` (grep the stylesheet — a token defined *only* inside a media/
  `[data-theme]` block is a fail).
- **Motion** (criteria 41–44): with JS disabled, all text/links visible and
  usable on every page (nothing starts hidden in CSS — this is the one to
  test hardest, since a CSS-based hidden start state is invisible to a
  casual read); `prefers-reduced-motion: reduce` → no transform/opacity
  entrance animations, content in final state; no animation without a
  scroll/load trigger; animations don't reverse on scroll-up.
- **Accessibility** (criteria 45–48): axe (`@axe-core/playwright`) zero
  serious/critical violations on every page in both themes; WCAG AA
  contrast (≥4.5:1 normal, ≥3:1 large) in both themes; every interactive
  element keyboard-reachable with visible focus; skip link works; landmarks
  present; heading levels never skip.
- **Performance/layout** (criteria 49–51): portrait asset under ~60KB, home
  page total transfer under ~500KB; every image has explicit
  dimensions/aspect-ratio (no unexpected layout shift); no horizontal
  scroll at 320px/390×844/768px/1280px/1920×1080.
- **Build/deploy** (criteria 1–5): `pnpm build` zero errors; `pnpm check`
  passes clean; live URL check and CI-deploys-from-main are part of the
  pre-launch/CI wiring, not a local test — wire them into the GitHub Actions
  workflow, not `spec/`.

## Definition of done

- `pnpm check` exists as one command and runs typecheck → build → lint →
  tests.
- Every content-independent criterion in §12 has a corresponding automated
  test (content-dependent ones, e.g. exact copy wording, may need to wait
  on 001/002 landing before they go green — write them now, red is fine
  until integration).
- CI workflow builds and deploys to Pages from `main`.
- Flip `status` to `completed`, log to
  `.claude/epics/personal-site/updates/005.md`, noting which criteria are
  still red pending other tasks' integration.
