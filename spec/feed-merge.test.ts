// Unit tests for the activity feed's data layer: event flattening
// (src/lib/github.ts) and the note/commit merge (src/lib/feed.ts).
//
// Deliberately network-free, unlike external-links.test.ts. Everything here
// runs against fixture payloads or a stubbed global fetch, so `pnpm check`
// stays deterministic and these tests still pass on a plane.
//
// The most important test in this file is the degradation one: a build must
// survive GitHub being unreachable. If that contract breaks, a GitHub outage
// takes the whole site offline rather than just emptying half of one section.
import { afterEach, describe, expect, it, vi } from "vitest";
import { commitItemsFromSearch, fetchCommitItems, fetchCommitSearch } from "../src/lib/github.ts";
import { feedDateAttribute, formatFeedDate, mergeFeedItems } from "../src/lib/feed.ts";
import { commitFetchSize, excludedMessagePatterns, excludedRepoPatterns, maxCommitItems } from "../src/data/feed.ts";

/** A /search/commits result shaped like the real API's. */
function searchResult(options: {
  repo?: string;
  date?: string;
  message?: string;
  sha?: string;
  isPrivate?: boolean;
}): Record<string, unknown> {
  const {
    repo = "hadissuryaalamin/example",
    date = "2026-09-01T10:00:00Z",
    message = "Add a thing",
    sha = "a".repeat(40),
    isPrivate = false,
  } = options;
  return {
    sha,
    // The real API also returns html_url (a commit permalink). It is
    // deliberately absent here: the normaliser must not depend on it.
    commit: { message, author: { date } },
    repository: { full_name: repo, private: isPrivate, fork: false },
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("commitItemsFromSearch: normalising search results", () => {
  it("turns 3 search results into 3 feed items", () => {
    const items = commitItemsFromSearch([
      searchResult({ message: "First", sha: "1".repeat(40) }),
      searchResult({ message: "Second", sha: "2".repeat(40) }),
      searchResult({ message: "Third", sha: "3".repeat(40) }),
    ]);
    expect(items).toHaveLength(3);
    expect(items.map((i) => i.message)).toEqual(["First", "Second", "Third"]);
  });

  it("keeps only the first line of a multi-line commit message", () => {
    const items = commitItemsFromSearch([
      searchResult({
        message: ["Subject line here", "", "A long body paragraph that should never reach the feed."].join("\n"),
      }),
    ]);
    expect(items[0].message).toBe("Subject line here");
  });

  it("drops messages matching the exclusion patterns (merges, reverts, skip-ci)", () => {
    const items = commitItemsFromSearch(
      [
        "Merge pull request #12 from someone/branch",
        "Merge branch 'main' into feature",
        'Revert "Add a thing"',
        "Bump deps [skip ci]",
        "A real commit",
      ].map((message, i) => searchResult({ message, sha: `${i}`.repeat(40).slice(0, 40) })),
    );
    expect(items.map((i) => i.message)).toEqual(["A real commit"]);
  });

  it("has exclusion patterns that are all case-insensitive", () => {
    // A pattern that only matches one casing would silently let noise through.
    for (const pattern of excludedMessagePatterns) {
      expect(pattern.flags, `${pattern} should be case-insensitive`).toContain("i");
    }
  });

  it("links to the repository page, never to an individual commit", () => {
    // A commit permalink embeds the 40-char SHA, whose hex digits trip
    // spec/privacy.test.ts's 9+-consecutive-digits guard by coincidence.
    const items = commitItemsFromSearch([searchResult({ repo: "hadissuryaalamin/site", message: "Ship it" })]);
    expect(items[0].repo).toBe("hadissuryaalamin/site");
    expect(items[0].url).toBe("https://github.com/hadissuryaalamin/site");
    expect(items[0].url).not.toContain("/commit/");
    expect(items[0].url).not.toContain(items[0].sha);
  });

  it("skips malformed results rather than throwing", () => {
    // Cast through unknown: these are deliberately the shapes TypeScript says
    // can't happen, which is exactly what a live API is free to send.
    const malformed = [
      {},
      { sha: "a".repeat(40) },
      { sha: "a".repeat(40), commit: {} },
      { sha: "a".repeat(40), commit: { message: "x" } },
      // Has everything except a repository, so it fails the public check.
      { sha: "a".repeat(40), commit: { message: "x", author: { date: "2026-09-01T10:00:00Z" } } },
      { sha: null, commit: null, repository: null },
    ] as unknown as Parameters<typeof commitItemsFromSearch>[0];
    expect(() => commitItemsFromSearch(malformed)).not.toThrow();
    expect(commitItemsFromSearch(malformed)).toEqual([]);
  });

  it("caps the number of commits at maxCommitItems", () => {
    const results = Array.from({ length: maxCommitItems + 25 }, (_, i) =>
      searchResult({ message: `Commit ${i}`, sha: `${i}`.padStart(40, "0") }),
    );
    expect(commitItemsFromSearch(results)).toHaveLength(maxCommitItems);
  });
});

describe("privacy: private repositories never reach the feed", () => {
  // The search API runs as whoever the token belongs to. In CI, GITHUB_TOKEN
  // is present, so search can see private repos this account has access to.
  // A private commit message on a public site would be a real leak.
  it("drops a result whose repository is private", () => {
    const items = commitItemsFromSearch([
      searchResult({ repo: "someone/secret", message: "Internal work", isPrivate: true }),
      searchResult({ repo: "hadissuryaalamin/public", message: "Public work" }),
    ]);
    expect(items.map((i) => i.message)).toEqual(["Public work"]);
  });

  it("fails closed when the private flag is missing entirely", () => {
    const result = searchResult({ message: "Unknown visibility" });
    delete (result.repository as Record<string, unknown>).private;
    expect(commitItemsFromSearch([result])).toEqual([]);
  });

  it("fails closed when the private flag is not a boolean", () => {
    const result = searchResult({ message: "Weird payload" });
    (result.repository as Record<string, unknown>).private = "false";
    expect(commitItemsFromSearch([result])).toEqual([]);
  });
});

describe("repository filters: coursework never reaches the feed", () => {
  // The site keeps COMP4020/COMP8020 prototypes out of its content
  // (spec/content.test.ts criterion 24). The feed pulls from every public
  // repo, so without this filter it would put them straight back in.
  it("drops a COMP4020 repository", () => {
    const items = commitItemsFromSearch([
      searchResult({ repo: "comp4020-agentic-coding-studio/comp4020-crit5-hadissuryaalamin", message: "Crit work" }),
      searchResult({ repo: "hadissuryaalamin/MultiDrone", message: "Drone work" }),
    ]);
    expect(items.map((i) => i.message)).toEqual(["Drone work"]);
  });

  it("drops COMP8020 too", () => {
    expect(commitItemsFromSearch([searchResult({ repo: "x/comp8020-something" })])).toEqual([]);
  });

  it("matches the repository name case-insensitively", () => {
    expect(commitItemsFromSearch([searchResult({ repo: "x/COMP4020-Crit5" })])).toEqual([]);
  });

  it("keeps every exclusion pattern case-insensitive", () => {
    for (const pattern of excludedRepoPatterns) {
      expect(pattern.flags, `${pattern} should be case-insensitive`).toContain("i");
    }
  });

  it("over-fetches so the filters have material to work with", () => {
    // Filtering happens after the fetch. At a fetch size equal to the display
    // cap, a run of excluded commits can consume the whole page and leave the
    // feed empty — which is what happened before this was raised.
    expect(commitFetchSize).toBeGreaterThan(maxCommitItems);
  });
});

describe("fetch failure: the build must survive GitHub being unreachable", () => {
  it("returns [] instead of throwing when fetch rejects", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("ECONNREFUSED"))),
    );
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(fetchCommitItems()).resolves.toEqual([]);
  });

  it("returns [] on a rate-limit response rather than throwing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(new Response("rate limited", { status: 403 }))),
    );
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(fetchCommitItems()).resolves.toEqual([]);
  });

  it("returns [] when the API response has no items array", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.resolve(Response.json({ message: "Not Found" }))),
    );
    vi.spyOn(console, "warn").mockImplementation(() => {});
    await expect(fetchCommitSearch()).resolves.toEqual([]);
  });

  it("warns on the console so a silently-empty feed is diagnosable in CI logs", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject(new Error("offline"))),
    );
    await fetchCommitItems();
    expect(warn).toHaveBeenCalled();
    expect(String(warn.mock.calls[0][0])).toContain("[feed]");
  });

  it("sends a User-Agent, which GitHub rejects requests without", async () => {
    const fetchMock = vi.fn((_url: string | URL | Request, _init?: RequestInit) =>
      Promise.resolve(Response.json({ items: [] })),
    );
    vi.stubGlobal("fetch", fetchMock);
    await fetchCommitSearch();
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Record<string, string> | undefined;
    expect(headers?.["User-Agent"]).toBeTruthy();
  });
});

describe("mergeFeedItems: ordering and capping", () => {
  const commits = [
    { kind: "commit" as const, date: "2026-09-05T10:00:00Z", message: "Newer commit", repo: "a/b", sha: "a".repeat(40), url: "https://github.com/a/b/commit/x" },
    { kind: "commit" as const, date: "2026-09-01T10:00:00Z", message: "Older commit", repo: "a/b", sha: "b".repeat(40), url: "https://github.com/a/b/commit/y" },
  ];
  const notes = [
    { date: "2026-09-03", text: "A note between the two commits" },
    { date: "2026-08-01", text: "The oldest thing here" },
  ];

  it("interleaves notes and commits strictly newest-first", () => {
    const merged = mergeFeedItems(commits, notes);
    expect(merged.map((i) => ("message" in i ? i.message : i.text))).toEqual([
      "Newer commit",
      "A note between the two commits",
      "Older commit",
      "The oldest thing here",
    ]);
  });

  it("tags notes with kind 'note' so the renderer can distinguish them", () => {
    const merged = mergeFeedItems([], notes);
    expect(merged.every((i) => i.kind === "note")).toBe(true);
  });

  it("caps at the requested limit, keeping the newest", () => {
    const merged = mergeFeedItems(commits, notes, 2);
    expect(merged).toHaveLength(2);
    expect(merged[0].kind).toBe("commit");
  });

  it("returns everything when no limit is given", () => {
    expect(mergeFeedItems(commits, notes)).toHaveLength(4);
  });

  it("sorts an unparseable date oldest instead of throwing", () => {
    const merged = mergeFeedItems(commits, [{ date: "not a date", text: "Broken" }]);
    expect(() => merged).not.toThrow();
    expect(merged[merged.length - 1].kind).toBe("note");
  });

  it("degrades to notes only when the commit half is empty", () => {
    const merged = mergeFeedItems([], notes);
    expect(merged).toHaveLength(2);
  });
});

describe("date formatting", () => {
  it("renders the site's usual 'Mon YYYY' display shape", () => {
    expect(formatFeedDate("2026-09-07T00:00:00Z")).toBe("Sep 2026");
    expect(formatFeedDate("2026-01-15")).toBe("Jan 2026");
  });

  it("is timezone-stable, so the same commit doesn't shift date between runners", () => {
    // 23:30 UTC would roll into the next day under a positive-offset local
    // timezone if the formatter weren't pinned to UTC.
    expect(formatFeedDate("2026-12-31T23:30:00Z")).toBe("Dec 2026");
  });

  it("produces a bare ISO date for the <time datetime> attribute", () => {
    expect(feedDateAttribute("2026-09-07T14:23:00Z")).toBe("2026-09-07");
  });

  it("returns an empty string for an unparseable date rather than 'Invalid Date'", () => {
    expect(formatFeedDate("nonsense")).toBe("");
    expect(feedDateAttribute("nonsense")).toBe("");
  });
});
