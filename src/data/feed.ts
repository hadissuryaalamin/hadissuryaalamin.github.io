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
 * How many commits the merge will consider before capping. The API returns at
 * most 100 events per page and each push event can carry several commits, so
 * this is a guard against one busy afternoon flooding the whole feed.
 */
export const maxCommitItems = 40;

/**
 * Repositories whose commits never reach the feed at all, on any page,
 * matched against the full `owner/name` the API reports.
 *
 * Worth remembering that this feed pulls from *all* public activity: anything
 * pushed publicly shows up unless it is excluded, commit message and all.
 */
export const excludedRepos: string[] = [];

/**
 * Repositories kept off the *home page* teaser, but still shown on /feed/.
 *
 * Coursework is the case this exists for. The home page is the portfolio —
 * the thing a recruiter reads — and spec/content.test.ts's criterion 24 keeps
 * COMP4020 prototypes off it entirely. /feed/ is a different kind of page: an
 * activity log, where "this is what I've actually been pushing" is the whole
 * point, coursework included. A visitor who wants the detail goes to GitHub.
 *
 * Matched case-insensitively against the full `owner/name`.
 */
export const portfolioHiddenRepoPatterns: RegExp[] = [/comp4020/i, /comp8020/i];

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
