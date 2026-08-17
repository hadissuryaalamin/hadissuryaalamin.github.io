// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://hadissuryaalamin.github.io',
  base: '/',
  output: 'static',

  // epic.md §16 item 5: every internal link in src/data (nav, project hrefs,
  // etc.) is authored WITH a trailing slash (e.g. "/cv/", "/projects/x/"), so
  // trailingSlash is pinned to 'always' and build.format to 'directory' —
  // that pair is Astro's own default combination, made explicit here so it
  // can't silently drift, and so every route maps onto a real
  // `<route>/index.html` in dist/ with no directory/file ambiguity.
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },

  vite: {
    plugins: [tailwindcss()],
  },
});