---
status: pending
depends_on: []
parallel: true
conflicts_with: []
---
# Task 003 — Motion & interaction

Full source of truth: `.claude/epics/personal-site/epic.md` §8 (motion
specification) in full, plus the hard constraints in §8.4. Use the
`gsap-core`, `gsap-scrolltrigger`, and `gsap-performance` skills.

## What this task owns

- `src/scripts/motion.ts` only. Nothing else.

## Coordination note (not a file dependency)

This task does not `depends_on` 002, but its selectors target markup that 002
builds (hero elements, section headings, `.project-card`-style elements —
exact class/attribute names are 002's call). To stay genuinely parallel:
write `motion.ts` against a small, documented set of **data attributes**
rather than guessing 002's class names — e.g. `[data-animate="hero"]`,
`[data-animate="section"]`, `[data-animate="card"]` with
`[data-animate-stagger]` on the container. Record the exact attribute
contract you use in your update note so 002 (or whoever integrates) knows
to add those attributes to the markup. If integration reveals the contract
doesn't fit, that's a small follow-up patch to `motion.ts`, not a rewrite.

## Hard constraints — read epic.md §8 in full, this is not exhaustive

- **Explicitly NOT built**: counting-up number counters, scroll-linked
  progress spine, parallax, pinned sections, scrubbed timelines, text
  scrambles, any background animation. Do not add any of these even if they
  seem like reasonable defaults.
- Tool: **GSAP 3 + ScrollTrigger**, registered explicitly. Use
  `gsap.matchMedia()` for the reduced-motion split.
- Duration 0.4–0.6s (default 0.5s). Offset 12–24px (default 16px), `y` for
  rising content, `x` only where directional slide is genuinely meaningful.
  Easing `power2.out` — no elastic/back/bounce. Stagger 0.06–0.08s between
  siblings. `once: true` (fires once, does **not** reverse on scroll-up).
  ScrollTrigger `start: "top 85%"`.
- Animate **transform and opacity only** — never width/height/top/left/margin
  or anything that triggers layout.
- Inventory (§8.3): hero on-load staged fade+rise (h1 → lead → meta →
  CTA row, 0.06s stagger); section headings/body on enter (fade+16px rise,
  0.45s); project cards on enter (fade+20px rise, 0.5s, 0.08s stagger);
  CV page fade-only, no slide. Nothing else.
- **Motion must never gate content** (criterion 41): do not author
  `opacity: 0` or any hidden start state in CSS — set from-states in JS only,
  so with JavaScript disabled or broken every word is visible and every link
  works. This is the single most important constraint in this task — a
  CSS-based hidden start state is a defect even if the JS almost always runs.
- **Honour `prefers-reduced-motion`** (criterion 42): via `gsap.matchMedia()`,
  register animations only under `(prefers-reduced-motion: no-preference)`;
  under `reduce`, content sits in its final state with no transform
  animation.
- Performance: `will-change` used sparingly and removed after use; smooth on
  a mid-range phone.

## Definition of done

- `motion.ts` exports whatever init function the page shell calls (coordinate
  the exact call signature with 002 in your update note if not obvious).
- Satisfies epic.md §12 criteria 41–44.
- Flip `status` to `completed`, log to
  `.claude/epics/personal-site/updates/003.md`, including the data-attribute
  contract you chose.
