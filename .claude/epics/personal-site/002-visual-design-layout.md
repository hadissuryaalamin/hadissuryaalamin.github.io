---
status: completed
depends_on: [004]
parallel: true
conflicts_with: []
---
# Task 002 — Visual design & layout

Full source of truth: `.claude/epics/personal-site/epic.md` (read the whole
document; this task lives mostly in §5, §7, §9.1, §9.2, §10, §11, §16).
Use the `frontend-design` skill.

## Why this depends on 004

You import a `ThemeInit` component (no-flash inline theme script + the toggle
button, §7.6) that task 004 owns and creates at
`src/components/ThemeInit.astro`. Rather than building against a stub and
reconciling later, wait for 004 to land that file (and `astro.config.*`,
which your Tailwind/Astro setup builds on top of) before starting. Everything
else in this task is independent of 004's other files (image pipeline,
GoatCounter, `theme.ts` internals) — you only need the `ThemeInit` component's
existence and its public interface (a real `<button>`, accessible name,
`aria-pressed`, reachable by keyboard).

## What this task owns

- `src/styles/**` — design tokens (§7.5, §7.6), typography (§7.2, §7.3),
  Tailwind theme config, spacing scale (§7.4), print stylesheet (§10).
- `src/layouts/**` — the shared page shell (nav, skip link, footer, `<main>`).
- `src/components/**` — **every component except `ThemeInit.astro`**, which
  is 004's. This includes project cards, the metric strip, the hero, nav,
  footer, etc.
- `src/pages/**/*.astro` — **all page files** (home, the shared
  `/projects/<slug>/` template, `/cv/`, `/404`). You assemble these from your
  layout/components and from the data/content that task 001 provides — you do
  not write prose here, you consume 001's data.
- Responsive layout at all breakpoints (§9.2, criterion 51): 320px, 390×844,
  768px, 1280px, 1920×1080.

## Hard constraints (non-exhaustive — read epic.md sections in full)

- **§7.6 theme mechanics, exactly as specified**: complete token set on bare
  `:root` (light values), dark override under
  `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) {} }`,
  toggle override under `:root[data-theme="dark"] {}`. No colour may be
  defined *only* inside a media query or `[data-theme]` block (criterion 40).
  `<body>` gets an explicit `background: var(--bg)`, never transparent.
- Self-hosted Inter + JetBrains Mono, `font-display: swap`, tabular figures on
  every number (§7.2).
- **Print stylesheet** (§10): forces light rendering (black on white)
  regardless of active theme — override dark tokens *inside* `@media print`;
  hides nav/toggle/download-button/footer; hides the portrait; margins
  ~15–18mm; body 10.5–11pt; `break-inside: avoid` on each experience/education
  entry.
- **Portrait image** (§11): use `E:\comp8020\misc_files\potrait.jpg`, never
  `avatar.png`. Tighter head-and-shoulders crop as a committed build asset,
  face bias toward upper portion, circular/rounded-square mask, subtle 1px
  border ring, resize to ~640px long edge, WebP/AVIF + JPEG fallback, explicit
  width/height, `loading="eager"` + `fetchpriority="high"` (it's above the
  fold), target under ~60KB. Alt text from 001's data, never `alt=""`.
- Five project cards on home: single column below 900px, two columns ≥900px
  with **DishPatch spanning both columns** as the lead card (§16 item 4 — you
  may adjust this exact breakpoint/spanning detail, but all five must remain
  visible with no interaction — no carousel/load-more/filter).
- Exactly one `<h1>` per page (criterion 10).
- Semantic landmarks: `header`, `nav`, `main`, `footer`; heading levels never
  skip (criterion 48). Skip-to-content link is the first focusable element.
- Focus styles `2px solid var(--focus)`, `2px` offset, visible in both themes
  — never `outline: none` without a replacement.
- **§16 open decisions this task resolves**: typeface substitute (if any),
  final accent hue (if adjusted from signal amber), card layout details,
  `build.format`/trailing-slash policy, favicon/OG image, metric-strip
  behaviour at 320px. Record whichever you choose in your update log — these
  are legitimate judgment calls, not gaps to ask the client about.

## Definition of done

- All pages build and satisfy the layout/visual criteria in epic.md §12
  (invariants 6–13; theme 36–40; performance/layout 49–51; and the structural
  parts of content criteria 16, 17, 18, 19 — the markup/linking, not the
  prose itself).
- `pnpm check` type-checks and builds clean (tests are 005's to write, but
  your markup must not break the build).
- Flip `status` to `completed`, log to
  `.claude/epics/personal-site/updates/002.md`, including which §16 decisions
  you made and why.
