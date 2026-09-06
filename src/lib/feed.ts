/**
 * Merges the activity feed's two halves — commits fetched from GitHub at
 * build time (src/lib/github.ts) and notes written by hand
 * (src/data/feed.ts) — into one date-ordered list for the renderer.
 *
 * Build-time only, like its GitHub counterpart: the pages call buildFeed()
 * in their frontmatter and ship the result as plain HTML.
 */
import { feedNotes, portfolioHiddenRepoPatterns, type FeedNote } from '../data/feed';
import { fetchCommitItems, type CommitItem } from './github';

/** A hand-written note, tagged so the renderer can tell the two apart. */
export interface NoteItem extends FeedNote {
  kind: 'note';
}

export type FeedItem = CommitItem | NoteItem;

/**
 * Millisecond timestamp for sorting. An unparseable date sorts oldest rather
 * than throwing, so one bad hand-typed note date can't take down a build.
 */
function timestamp(iso: string): number {
  const ms = Date.parse(iso);
  return Number.isNaN(ms) ? 0 : ms;
}

/**
 * Merge notes and commits into one list, newest first.
 *
 * Exported separately from buildFeed so the ordering can be unit-tested
 * against fixtures without a network call.
 */
export function mergeFeedItems(commits: CommitItem[], notes: FeedNote[], limit?: number): FeedItem[] {
  const items: FeedItem[] = [...commits, ...notes.map((note) => ({ ...note, kind: 'note' as const }))];
  items.sort((a, b) => timestamp(b.date) - timestamp(a.date));
  return typeof limit === 'number' ? items.slice(0, limit) : items;
}

/**
 * True for an item the home page must not show. Notes are always fine; a
 * commit is hidden when its repo matches portfolioHiddenRepoPatterns.
 *
 * Exported for the unit tests — the home page goes through buildPortfolioFeed.
 */
export function isHiddenFromPortfolio(item: FeedItem): boolean {
  if (item.kind !== 'commit') return false;
  return portfolioHiddenRepoPatterns.some((pattern) => pattern.test(item.repo));
}

/**
 * The full feed, newest first, optionally capped at `limit` items. This is
 * what /feed/ renders — everything, coursework included.
 *
 * Never throws: if GitHub is unreachable the commit half comes back empty and
 * the feed degrades to its notes.
 */
export async function buildFeed(limit?: number): Promise<FeedItem[]> {
  return mergeFeedItems(await fetchCommitItems(), feedNotes, limit);
}

/**
 * The feed as the *home page* shows it: the same list with coursework repos
 * filtered out (see portfolioHiddenRepoPatterns for why the two pages differ).
 *
 * The limit is applied after filtering, so a burst of hidden commits can't
 * silently empty the teaser.
 */
export async function buildPortfolioFeed(limit?: number): Promise<FeedItem[]> {
  const all = mergeFeedItems(await fetchCommitItems(), feedNotes);
  const visible = all.filter((item) => !isHiddenFromPortfolio(item));
  return typeof limit === 'number' ? visible.slice(0, limit) : visible;
}

/**
 * The three-letter month names used across the site's data files ('Sep 2019',
 * 'Feb 2026 – present' in cv.ts and projects.ts).
 *
 * Spelled out rather than delegated to Intl because no English locale gives
 * this set: en-AU and en-GB both render September as 'Sept', and en-US — the
 * one locale that gives 'Sep' — would be an odd thing to pin an Australian
 * site to for the sake of a single month.
 */
const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

/**
 * 'Sep 2026' — the same shape as the pre-formatted date strings used across
 * cv.ts and projects.ts, so the feed's dates read as part of the same site
 * rather than as raw machine output. The ISO value goes in the <time>
 * element's datetime attribute alongside it.
 *
 * Read in UTC: the build machine's timezone is not the visitor's, and a date
 * that shifted depending on which runner built the site would be a genuinely
 * confusing bug.
 */
export function formatFeedDate(iso: string): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  const date = new Date(ms);
  return `${SHORT_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

/**
 * The `datetime` attribute value for a feed item: a bare ISO date, which is
 * what the displayed 'Sep 2026' actually corresponds to. Full timestamps
 * would imply a precision the display doesn't show.
 */
export function feedDateAttribute(iso: string): string {
  const ms = Date.parse(iso);
  if (Number.isNaN(ms)) return '';
  return new Date(ms).toISOString().slice(0, 10);
}
