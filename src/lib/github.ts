/**
 * Build-time GitHub API access for the activity feed.
 *
 * This runs on the machine doing the build — a GitHub Actions runner in CI, a
 * laptop in dev — and never in a visitor's browser. That is the whole point:
 * a client-side fetch would send every visitor's IP and User-Agent to GitHub,
 * which this site does not do (see spec/privacy.test.ts for how seriously the
 * rest of the site takes that line), and would cap the feed at the
 * unauthenticated 60-requests-per-hour-per-IP limit with no way to raise it,
 * since a token embedded in client JS is a published token.
 *
 * WHY THE SEARCH API AND NOT /users/:user/events/public
 * -----------------------------------------------------
 * The events endpoint is the obvious choice and is what most write-ups still
 * describe: a PushEvent used to carry `payload.commits[]` with each commit's
 * message. It no longer does. As checked against this account's live feed,
 * all 39 push events in the current window return a payload of exactly
 * { repository_id, push_id, ref, head, before } — SHAs, no messages. Building
 * on that endpoint would mean either a follow-up request per push (dozens of
 * calls per build) or a feed of bare SHAs.
 *
 * /search/commits returns the message, the repo, the date and the permalink
 * in one request, already sorted newest-first, across every public repo the
 * author has committed to. Its rate limit is per-minute rather than per-hour
 * (10/min unauthenticated, 30/min with a token) — irrelevant at one request
 * per build.
 *
 * FAILURE CONTRACT: nothing in here throws. GitHub being down, rate-limiting
 * the runner, or changing a payload shape must never fail a build and take
 * the whole site offline — the feed degrades to its hand-written notes and
 * the build carries on. Every exit path returns an array.
 *
 * src/scripts/ is browser-side code (motion.ts, theme.ts), so this
 * build-time-only module lives in src/lib/ instead.
 */
import { excludedMessagePatterns, excludedRepos, feedGitHubUser, maxCommitItems } from '../data/feed';

/** One commit, normalised out of a search result. */
export interface CommitItem {
  kind: 'commit';
  /** ISO 8601 timestamp of the commit's author date. */
  date: string;
  /** First line of the commit message. */
  message: string;
  /** Full `owner/name`. */
  repo: string;
  /**
   * Full 40-character SHA. Used as a stable identity for the item; it is
   * deliberately never rendered — see `url` below.
   */
  sha: string;
  /**
   * Link target: the repository's page on github.com, NOT a permalink to the
   * individual commit.
   *
   * Two reasons. A visitor who wants commit-level detail is better served by
   * the repo's own commit list than by landing on one isolated diff. And
   * spec/privacy.test.ts rejects any run of 9+ consecutive digits anywhere in
   * dist/ — a broad guard against a phone number reaching the site. A 40-char
   * hex SHA hits that guard by coincidence often enough to matter (two of this
   * account's real SHAs did, on the first build that rendered them), and the
   * honest fix is to keep SHAs out of the output rather than to carve a hole
   * in a privacy check.
   */
  url: string;
}

/**
 * Overridable so the degradation path can be exercised for real against a
 * dead host, rather than only against a mock. Not a user-facing setting.
 */
const API_BASE = process.env.GITHUB_API_BASE ?? 'https://api.github.com';

const REQUEST_TIMEOUT_MS = 10_000;

/**
 * The slice of a /search/commits result this module actually reads. The
 * result's own `html_url` (a commit permalink) is deliberately not among
 * them — see CommitItem.url.
 */
interface SearchCommitResult {
  sha?: unknown;
  commit?: { message?: unknown; author?: { date?: unknown } };
  repository?: { full_name?: unknown; private?: unknown; fork?: unknown };
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

/**
 * Fetch the user's most recent commits across all public repositories.
 * Returns [] on any failure at all.
 *
 * GITHUB_TOKEN raises the search rate limit from 10/min to 30/min. CI passes
 * it in; locally its absence is fine, since one build makes one request.
 */
export async function fetchCommitSearch(user: string = feedGitHubUser): Promise<SearchCommitResult[]> {
  const query = `author:${user}`;
  const url =
    `${API_BASE}/search/commits` +
    `?q=${encodeURIComponent(query)}&sort=author-date&order=desc&per_page=${maxCommitItems}`;
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    // GitHub rejects requests that don't identify themselves.
    'User-Agent': `${user}.github.io-build`,
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, { headers, signal: controller.signal });
    if (!res.ok) {
      console.warn(`[feed] GitHub API returned HTTP ${res.status} — feed falls back to notes only.`);
      return [];
    }
    const body: unknown = await res.json();
    const items = (body as { items?: unknown } | null)?.items;
    if (!Array.isArray(items)) {
      console.warn('[feed] GitHub API returned an unexpected shape — feed falls back to notes only.');
      return [];
    }
    return items as SearchCommitResult[];
  } catch (err) {
    console.warn('[feed] GitHub API unavailable — feed falls back to notes only:', err);
    return [];
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Normalise search results into feed items, dropping everything the filters
 * in src/data/feed.ts reject.
 *
 * PRIVACY: a result is kept only when its repository is explicitly
 * `private: false`. Search runs as whoever the token belongs to, so in CI —
 * where GITHUB_TOKEN is present — it can see private repositories this
 * account has access to. Anything that isn't provably public is dropped,
 * including results where the flag is missing entirely, so a change in the
 * payload shape fails closed rather than leaking a private commit message
 * onto a public site.
 *
 * Exported separately from the fetch so it can be unit-tested against
 * fixtures without touching the network.
 */
export function commitItemsFromSearch(results: SearchCommitResult[]): CommitItem[] {
  const items: CommitItem[] = [];

  for (const result of results) {
    const repo = result?.repository?.full_name;
    const sha = result?.sha;
    const date = result?.commit?.author?.date;
    const rawMessage = result?.commit?.message;

    if (!isNonEmptyString(repo)) continue;
    if (!isNonEmptyString(sha)) continue;
    if (!isNonEmptyString(date)) continue;
    if (!isNonEmptyString(rawMessage)) continue;

    // Fail closed: only an explicit `false` counts as public.
    if (result.repository?.private !== false) continue;
    if (excludedRepos.includes(repo)) continue;

    // Commit bodies are frequently several paragraphs; the feed shows the
    // subject line only.
    const message = rawMessage.split('\n')[0].trim();
    if (message === '') continue;
    if (excludedMessagePatterns.some((pattern) => pattern.test(message))) continue;

    // The repo page, not `result.html_url` (which points at the commit).
    items.push({ kind: 'commit', date, message, repo, sha, url: `https://github.com/${repo}` });
  }

  return items.slice(0, maxCommitItems);
}

/**
 * The whole automatic half of the feed: fetch, normalise, filter. Never throws.
 */
export async function fetchCommitItems(user: string = feedGitHubUser): Promise<CommitItem[]> {
  try {
    return commitItemsFromSearch(await fetchCommitSearch(user));
  } catch (err) {
    // fetchCommitSearch already swallows network failures; this catches a
    // malformed payload getting through the shape checks in the normaliser.
    console.warn('[feed] could not build commit items — feed falls back to notes only:', err);
    return [];
  }
}
