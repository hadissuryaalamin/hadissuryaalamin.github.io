---
status: pending
depends_on: []
parallel: true
conflicts_with: []
---
# Task 001 — Content & IA

Full source of truth: `.claude/epics/personal-site/epic.md` (the whole document —
read it before starting, especially §1–§6, §15, §16.1). This task file is a
scope pointer, not a substitute for it.

## What this task owns

- `src/content/**` and/or `src/data/projects.ts` (whichever content-collection
  shape you choose — pick one and be consistent; see §16 item 8 for the CV-page
  duplication rule this interacts with).
- All page **copy**: every sentence of prose that appears on the site (hero,
  about, project card summaries, project detail-page prose, CV summary/entries,
  contact copy, footer, 404 copy).
- `<head>` metadata per page (`<title>`, meta description, Open Graph tags —
  OG image itself is §16 item 6, delegated, coordinate with 002/004 on the
  actual image asset but the meta tags are yours).
- `alt` text for every image.
- `sitemap`/`robots.txt` content (Phase 3, §13).

## What this task does NOT own

- **`.astro` files under `src/pages/**` are NOT yours to create or structure.**
  Task 002 owns all page/layout/component markup. You provide the data those
  templates consume (content-collection entries / `projects.ts` / a copy
  object) — never edit a `.astro` file's markup directly. If a page needs a
  string that doesn't fit the data shape you've built, extend the data shape,
  don't reach into the template.
- Visual/layout decisions (002), motion (003), theme/build mechanics (004),
  tests (005).

## Source material — do not invent facts

All facts come from `epic.md` §4 (factual content block) and §6 (projects).
**Every sentence must be traceable to §4/§6 or a project's own README** — no
placeholder copy, no invented numbers. Where §4/§6 gives draft copy (e.g. the
About section, the CV summary), you may adjust wording but must keep the facts
and order given.

Hard content rules (see epic.md for full detail, this is not exhaustive):
- The §3 headline sentence appears on the home page **verbatim**, unedited.
- `hadisssurya@gmail.com` (three consecutive `s`) as both a `mailto:` link and
  visible copyable text.
- Five featured projects in the exact §6.1 order: DishPatch, GPT-2 from
  scratch, Deep Learning Statistical Arbitrage, IDX-alpha, maintain-ai.
- IDX-alpha: **no Sharpe ratio in the card summary, hero, or metric strip**;
  visibly labelled work-in-progress. See epic.md §6.1 item 4 in full — this is
  the easiest acceptance criterion to get wrong.
- DLSA: the negative GNN result must appear, framed as rigour, not failure.
- GPT-2 project: must credit `karpathy/nanoGPT` as the base, link the repo
  under its **new** name `gpt2-rocstories-finetuning`.
- **No COMP4020 web-dev prototypes** mentioned anywhere (epic.md §2 non-goals).
- **No phone number, no street address/postcode** anywhere in any copy you
  write. Location strings read "Canberra, Australia" only.
- **No company name** from the tailored-CV set (Aumovio, Infineon, Tetra Pak,
  Acronis, ThunderSoft, Chubb, WeComms) anywhere.
- Personal agent (§6.2), if listed: **English**, never Bahasa Indonesia.
- CV page content strictly from §4/§6; company-neutral (see §5.3).

## Definition of done

- Content/data files exist with every page's copy, metadata, and alt text
  populated per the rules above.
- Every acceptance criterion in epic.md §12 that concerns content/facts
  (14, 15, 18–22b, 24–29, 33 n/a, 36 n/a — read §12 in full and check the
  content-shaped ones) is satisfiable from the data you've written.
- Flip this file's `status` to `completed` and log a short note in
  `.claude/epics/personal-site/updates/001.md` — include which content-shape
  you picked (content collections vs. `projects.ts`) so 002 knows the import
  contract, and flag anything in §16 you resolved by judgment call.
