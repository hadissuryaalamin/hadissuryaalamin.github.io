/**
 * The activity feed's hand-authored half, plus the filters that decide which
 * automatically-fetched commits are allowed to appear alongside it.
 *
 * The feed has two sources. Commits arrive automatically from the GitHub API
 * at build time (src/lib/github.ts); notes are written here by hand. Both are
 * merged, sorted and capped by src/lib/feed.ts.
 *
 * DATES ARE ISO 8601 HERE, which is a deliberate departure from the rest of
 * src/data/. Everywhere else — cv.ts, projects.ts — dates are pre-formatted
 * display strings ('Feb 2026 – present') that are never parsed, because
 * nothing ever needed to sort them. The feed does: a note has to interleave
 * correctly with commit timestamps coming off the API, and that is only
 * possible against a real date. formatFeedDate() in src/lib/feed.ts turns
 * these back into the site's usual display form at render time.
 */

export interface FeedNote {
  /**
   * ISO 8601 date, e.g. '2026-09-07'. Sorted against commit timestamps, so it
   * must parse — a display string like 'Sep 2026' will not work here.
   * A bare date is treated as midnight UTC.
   */
  date: string;
  /**
   * The note itself: one or two sentences. Plain text — no markdown, no HTML.
   * Anything longer belongs on a project page, not in the feed.
   */
  text: string;
  /** Optional single outbound link, rendered after the text. */
  link?: { label: string; href: string };
}

/**
 * Manual feed entries, newest-first by convention (the merge sorts anyway, so
 * order here is for the author's benefit rather than the renderer's).
 */
export const feedNotes: FeedNote[] = [
  {
    date: '2026-09-07',
    text: 'Added an activity feed to this site — recent public commits, pulled at build time, plus notes like this one.',
  },
];

/**
 * The GitHub account whose public activity feeds the automatic half.
 */
export const feedGitHubUser = 'hadissuryaalamin';

/**
 * How many commits to ask the API for per request. 100 is its per-page
 * maximum.
 */
export const commitFetchSize = 100;

/**
 * How many pages of `commitFetchSize` to fetch. The account's full public
 * history is about 380 commits, and the filters below reject roughly a third
 * of them, so four pages covers everything with room to grow.
 *
 * Each page is one API request at build time. The search endpoint allows
 * 10/min unauthenticated and 30/min with a token, so four sequential requests
 * are comfortable either way; a page that fails simply ends the walk and the
 * feed shows what it already has.
 */
export const commitFetchPages = 4;

/**
 * Upper bound on how many commits reach the site, applied after filtering.
 * Generous rather than tight: the feed is paginated, so a long history costs
 * extra pages rather than one unreadable wall of entries.
 */
export const maxCommitItems = 400;

/**
 * How many entries appear on one page of /feed/.
 */
export const feedPageSize = 15;

/**
 * Commit messages shorter than this are dropped.
 *
 * A real history contains a lot of 'init', 'module', 'scrape' and the
 * occasional typo ('fic CI'). They are honest, but they tell a reader
 * nothing, and a feed is a thing people skim. The threshold is a blunt
 * instrument — a genuinely terse-but-meaningful message can be caught by it —
 * which is the trade accepted here for not having to curate by hand.
 */
export const minMessageLength = 15;

/**
 * Repositories whose commits never reach the feed, matched against the full
 * `owner/name` the API reports. Exact matches; see the patterns below for
 * anything broader.
 */
export const excludedRepos: string[] = [];

/**
 * Repository name patterns excluded from the feed, matched case-insensitively
 * against the full `owner/name`.
 *
 * COMP4020/COMP8020 coursework is the reason this exists. The site already
 * keeps those prototypes out of its content (spec/content.test.ts criterion
 * 24) — a feed that pulled them back in through the side door would undo
 * that, and would also mean a portfolio whose most prominent recent activity
 * is weekly coursework rather than the work the site is actually about.
 *
 * Worth remembering that this feed pulls from *all* public activity: anything
 * pushed publicly shows up unless it is excluded, commit message and all.
 */
export const excludedRepoPatterns: RegExp[] = [/comp4020/i, /comp8020/i];

/**
 * Commit messages matching any of these are dropped. Merge commits and bot
 * noise say nothing a reader wants, and they would otherwise dominate the
 * feed on any repo that takes pull requests.
 */
export const excludedMessagePatterns: RegExp[] = [
  /^Merge (pull request|branch|remote-tracking)/i,
  /^Revert "/i,
  /\[skip ci\]/i,
];
