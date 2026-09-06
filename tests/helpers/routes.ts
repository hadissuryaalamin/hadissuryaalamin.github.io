// Routes exercised by the Playwright suite. Kept in sync by hand with
// epic.md §5 (page inventory) rather than discovered from dist/, since
// these specs run against a live `astro preview` server, not the
// filesystem — see spec/helpers/dist.ts for the filesystem-based approach
// used by the vitest specs.
export const ROUTES = [
  "/",
  "/cv/",
  "/feed/",
  "/projects/dishpatch/",
  "/projects/gpt2-from-scratch/",
  "/projects/deep-learning-statistical-arbitrage/",
  "/projects/idx-alpha/",
  "/projects/maintain-ai/",
] as const;

// A path guaranteed not to exist, to exercise the custom 404 page
// (epic.md §5.4) through the real server rather than guessing its route.
export const NOT_FOUND_ROUTE = "/this-page-does-not-exist-005-check/";
