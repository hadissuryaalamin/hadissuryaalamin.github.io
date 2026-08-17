/**
 * Phase-3 SEO content (epic §13 Phase 3, task 001 scope: "sitemap/robots.txt
 * content"). This file owns the *content*; file placement in `public/` is
 * 004's territory (see the update log for the coordination note), and
 * sitemap.xml generation likely wants the `@astrojs/sitemap` integration
 * (not installed — flagged as a "Dependencies needed" item in updates/001.md).
 */

/** Plain-text robots.txt content. Points at the sitemap once one is generated. */
export const robotsTxt = `User-agent: *
Allow: /

Sitemap: https://hadissuryaalamin.github.io/sitemap-index.xml
`;
