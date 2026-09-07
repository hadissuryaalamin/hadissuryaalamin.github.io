// Content-correctness criteria from epic.md §12 (14, 15, 17-22b, 24-26).
// These are content-dependent: they will stay red until tasks 001 (content)
// and 002 (markup/layout) land real copy — see updates/005.md. They are
// written now, against epic.md directly, per epic.md §14: "005 can be
// written against this document before the pages exist."
//
// Criterion 16 (primary CTA is the highest-emphasis interactive element) and
// criterion 23 (every external link returns 200) need computed styles / real
// network requests and live in tests/layout.spec.ts and
// spec/external-links.test.ts respectively.
import { describe, expect, it } from "vitest";
import {
  DISHPATCH_PRS,
  EMAIL,
  EMAIL_MAILTO,
  EXCLUDED_COMP4020_PROTOTYPES,
  EXCLUDED_COMPANY_NAMES,
  GPT2_NEW_REPO,
  GPT2_OLD_REPO_NAME,
  HEADLINE_SENTENCE,
  PROJECT_ORDER,
} from "./fixtures/projects.ts";
import { loadPages, resolveRoute, textOf } from "./helpers/dist.ts";

const pages = loadPages();
const home = resolveRoute("/");
const cv = resolveRoute("/cv/");

function wholeWord(term: string): RegExp {
  return new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
}

describe("criterion 14: headline sentence appears verbatim on the home page", () => {
  it("home page built", () => {
    expect(home, "run `pnpm build` first, or wait on 001/002").toBeTruthy();
  });

  it("contains the §3 headline sentence exactly", () => {
    expect(home).toBeTruthy();
    if (!home) return;
    expect(textOf(home.doc)).toContain(HEADLINE_SENTENCE);
  });
});

describe("criterion 15: email as mailto link + visible copyable text", () => {
  it("home page has a mailto: link to the exact address", () => {
    expect(home).toBeTruthy();
    if (!home) return;
    const mailtoLinks = Array.from(home.doc.querySelectorAll("a[href]")).filter((a) =>
      (a.getAttribute("href") ?? "").toLowerCase().startsWith(EMAIL_MAILTO.toLowerCase()),
    );
    expect(mailtoLinks.length, "expected at least one mailto: link on the home page").toBeGreaterThan(0);
  });

  it("home page shows the email address as visible, copyable text (not icon-only)", () => {
    expect(home).toBeTruthy();
    if (!home) return;
    expect(textOf(home.doc)).toContain(EMAIL);
  });

  it("CV page also contains the email address", () => {
    expect(cv, "run `pnpm build` first, or wait on 001/002").toBeTruthy();
    if (!cv) return;
    expect(textOf(cv.doc)).toContain(EMAIL);
  });
});

describe("criterion 17: a View CV link resolves to /cv/", () => {
  it("home page links to /cv/", () => {
    expect(home).toBeTruthy();
    if (!home) return;
    const hrefs = Array.from(home.doc.querySelectorAll("a[href]")).map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.some((h) => h === "/cv/" || h === "/cv" || h.endsWith("/cv/") || h.endsWith("/cv"))).toBe(true);
  });
});

describe("criterion 18: all five featured projects on the home page, in §6.1 order", () => {
  it("home page links to all five project detail pages in the right order", () => {
    expect(home).toBeTruthy();
    if (!home) return;
    const hrefs = Array.from(home.doc.querySelectorAll("a[href]")).map((a) => a.getAttribute("href") ?? "");

    const firstIndexOf = (slug: string) => hrefs.findIndex((h) => h.includes(`/projects/${slug}`));
    const indices = PROJECT_ORDER.map((p) => ({ slug: p.slug, index: firstIndexOf(p.slug) }));

    for (const { slug, index } of indices) {
      expect(index, `home page has no link to /projects/${slug}/`).toBeGreaterThanOrEqual(0);
    }

    const sorted = [...indices].sort((a, b) => a.index - b.index).map((i) => i.slug);
    expect(sorted).toEqual(PROJECT_ORDER.map((p) => p.slug));
  });

  it("each project card carries at least one of its real metric numbers", () => {
    expect(home).toBeTruthy();
    if (!home) return;
    const text = textOf(home.doc);
    for (const project of PROJECT_ORDER) {
      if (project.metricKeywords.length === 0) continue;
      const hasAny = project.metricKeywords.some((kw) => text.includes(kw));
      expect(hasAny, `home page is missing any of [${project.metricKeywords.join(", ")}] for ${project.name}`).toBe(
        true,
      );
    }
  });
});

describe("criterion 19: five project detail pages exist at the §5.2 slugs", () => {
  for (const project of PROJECT_ORDER) {
    describe(project.slug, () => {
      const page = resolveRoute(`/projects/${project.slug}/`);

      it("page exists", () => {
        expect(page, `dist/projects/${project.slug}/ (or .html) not found — wait on 001/002`).toBeTruthy();
      });

      it("has exactly one h1", () => {
        expect(page).toBeTruthy();
        if (!page) return;
        expect(page.doc.querySelectorAll("h1").length).toBe(1);
      });

      it("links to its repository", () => {
        expect(page).toBeTruthy();
        if (!page) return;
        const hrefs = Array.from(page.doc.querySelectorAll("a[href]")).map((a) => a.getAttribute("href") ?? "");
        expect(hrefs.some((h) => h.toLowerCase().startsWith(project.repoUrl.toLowerCase()))).toBe(true);
      });

      it("is written in first person", () => {
        expect(page).toBeTruthy();
        if (!page) return;
        const text = textOf(page.doc);
        expect(/\bI\b|\bI've\b|\bI'm\b|\bmy\b/i.test(text), "expected first-person prose (I / I've / my)").toBe(
          true,
        );
      });
    });
  }
});

describe("criterion 20: DishPatch detail page links PRs #33 and #41, names the stack", () => {
  const page = resolveRoute("/projects/dishpatch/");

  it("page exists", () => {
    expect(page).toBeTruthy();
  });

  for (const pr of DISHPATCH_PRS) {
    it(`links pull request #${pr.number}`, () => {
      expect(page).toBeTruthy();
      if (!page) return;
      const hrefs = Array.from(page.doc.querySelectorAll("a[href]")).map((a) => a.getAttribute("href") ?? "");
      const linksPr = hrefs.some((h) => new RegExp(`/pull/${pr.number}(\\D|$)`).test(h));
      expect(linksPr, `expected a link to pull request #${pr.number}`).toBe(true);
    });
  }

  it("names ROS2, nav2, AWS EC2, Docker, and DDS", () => {
    expect(page).toBeTruthy();
    if (!page) return;
    const text = textOf(page.doc);
    for (const term of ["ROS2", "nav2", "AWS EC2", "Docker", "DDS"]) {
      const found = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text);
      expect(found, `expected "${term}" on the DishPatch detail page`).toBe(true);
    }
  });
});

describe("criterion 21: DLSA detail page states the GNN negative result", () => {
  const page = resolveRoute("/projects/deep-learning-statistical-arbitrage/");

  it("page exists", () => {
    expect(page).toBeTruthy();
  });

  it("mentions the GNN extension and a negative/no-edge finding", () => {
    expect(page).toBeTruthy();
    if (!page) return;
    const text = textOf(page.doc);
    expect(/GNN/i.test(text), "expected the page to mention the GNN extension").toBe(true);
    expect(
      /no (out-of-sample )?edge|no edge|nothing beyond|added nothing|negative result/i.test(text),
      "expected the page to state the GNN provided no edge / a negative result",
    ).toBe(true);
  });
});

describe("criterion 22: IDX-alpha has no Sharpe headline and is labelled work-in-progress", () => {
  const cardHref = "/projects/idx-alpha";
  const detail = resolveRoute("/projects/idx-alpha/");
  const wip = /work[\s-]?in[\s-]?progress|\bwip\b/i;

  it("home page card for IDX-alpha does not mention Sharpe", () => {
    expect(home).toBeTruthy();
    if (!home) return;
    const anchor = Array.from(home.doc.querySelectorAll("a[href]")).find((a) =>
      (a.getAttribute("href") ?? "").includes(cardHref),
    );
    expect(anchor, "home page has no link to /projects/idx-alpha/").toBeTruthy();
    if (!anchor) return;
    // The whole card is the link target (epic.md §5.1c), so the anchor's own
    // text is the card's content whatever container wraps it.
    const cardEl = anchor.closest("li, article, [data-testid='project-card']") ?? anchor;
    expect(cardEl.textContent ?? "").not.toMatch(/Sharpe/i);
  });

  it("IDX-alpha is labelled work-in-progress on the home card and detail page", () => {
    expect(home).toBeTruthy();
    expect(detail).toBeTruthy();
    if (!home || !detail) return;
    const anchor = Array.from(home.doc.querySelectorAll("a[href]")).find((a) =>
      (a.getAttribute("href") ?? "").includes(cardHref),
    );
    const cardEl = anchor?.closest("li, article, [data-testid='project-card']") ?? anchor;
    expect(cardEl?.textContent ?? "").toMatch(wip);
    expect(textOf(detail.doc)).toMatch(wip);
  });

  it("detail page h1 and lead paragraph do not mention Sharpe", () => {
    expect(detail).toBeTruthy();
    if (!detail) return;
    const h1 = detail.doc.querySelector("h1");
    expect(h1).toBeTruthy();
    const lead = h1?.nextElementSibling;
    const heroText = `${h1?.textContent ?? ""} ${lead?.textContent ?? ""}`;
    expect(heroText).not.toMatch(/Sharpe/i);
  });

  it("the pre-cost figure 3.62 never appears on the detail page", () => {
    expect(detail).toBeTruthy();
    if (!detail) return;
    expect(textOf(detail.doc)).not.toContain("3.62");
  });

  it("if Sharpe is mentioned in body prose, the after-costs figure and cost assumption are present too", () => {
    expect(detail).toBeTruthy();
    if (!detail) return;
    const text = textOf(detail.doc);
    if (/Sharpe/i.test(text)) {
      expect(text, "expected the after-costs 3.12 figure").toContain("3.12");
      expect(text, "expected the cost assumption (25 bps) stated alongside it").toMatch(/25\s*bps/);
    }
  });
});

describe("criterion 22b: gpt2-from-scratch credits karpathy/nanoGPT and links the new repo name", () => {
  const page = resolveRoute("/projects/gpt2-from-scratch/");

  it("page exists", () => {
    expect(page).toBeTruthy();
  });

  it("credits karpathy/nanoGPT as the base", () => {
    expect(page).toBeTruthy();
    if (!page) return;
    const text = textOf(page.doc);
    expect(text).toMatch(/karpathy/i);
    expect(text).toContain(GPT2_OLD_REPO_NAME); // attribution text must name nanoGPT
  });

  it(`links the repository under its new name (${GPT2_NEW_REPO}), not the old nanoGPT URL`, () => {
    expect(page).toBeTruthy();
    if (!page) return;
    const hrefs = Array.from(page.doc.querySelectorAll("a[href]")).map((a) => a.getAttribute("href") ?? "");
    expect(hrefs.some((h) => h.includes(GPT2_NEW_REPO))).toBe(true);
    // Only the client's OWN old repo URL is forbidden — a link to the
    // upstream karpathy/nanoGPT repo is the required attribution link and
    // must NOT be flagged here.
    expect(hrefs.some((h) => /hadissuryaalamin\/nanoGPT(\/|$)/i.test(h))).toBe(false);
  });
});

describe("criterion 24: no COMP4020 web-dev prototype mentioned or linked anywhere", () => {
  // Note for anyone adding a feature that pulls in outside content: the
  // activity feed (/feed/) draws commits from every public repo, so it
  // excludes coursework repositories by name — see excludedRepoPatterns in
  // src/data/feed.ts. Without that filter this criterion fails here.
  for (const term of EXCLUDED_COMP4020_PROTOTYPES) {
    it(`"${term}" does not appear on any page`, () => {
      for (const { name, doc } of pages) {
        expect(textOf(doc), `found "${term}" on ${name}`).not.toMatch(new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
      }
    });
  }
});

describe("criterion 25: no tailored-CV company name appears anywhere", () => {
  for (const company of EXCLUDED_COMPANY_NAMES) {
    it(`"${company}" does not appear on any page`, () => {
      for (const { name, doc } of pages) {
        expect(textOf(doc), `found "${company}" on ${name}`).not.toMatch(wholeWord(company));
      }
    });
  }
});

describe("criterion 26: personal agent is never described as Bahasa Indonesia", () => {
  it('no page contains the word "Bahasa" (site is English-only, epic.md §2)', () => {
    for (const { name, doc } of pages) {
      expect(textOf(doc), `found "Bahasa" on ${name}`).not.toMatch(/Bahasa/i);
    }
  });
});
