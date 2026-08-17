/**
 * Per-page <head> metadata: <title>, meta description, and Open Graph tags
 * for the pages that aren't project detail pages (those carry their own
 * metaTitle/metaDescription on each FeaturedProject in projects.ts).
 *
 * The OG image *asset* is delegated (epic §16 item 6) to 002/004 — this file
 * only names the path it should live at and the alt text for it. Coordinate
 * before wiring `<meta property="og:image">` to a real file.
 */

export interface PageMeta {
  title: string;
  description: string;
}

export const siteMetaDefaults = {
  /** Base site URL, matches astro.config.mjs `site`. */
  siteUrl: 'https://hadissuryaalamin.github.io',
  ogType: 'website',
  /**
   * Expected path of the Open Graph / social preview image. Asset itself is
   * not this task's job (epic §16 item 6: "no emoji-as-brand; a simple
   * monogram or the cropped portrait is fine; must not embed the phone
   * number or a company name"). 002/004: place the file at this path in
   * `public/`, or tell 001 the actual path so this constant can be updated.
   */
  ogImagePath: '/og-image.png',
  ogImageAlt: 'Hadis Surya Al Amin — Machine Learning and Computer Vision Engineer',
};

export const pageMeta: Record<'home' | 'cv' | 'notFound', PageMeta> = {
  home: {
    title: 'Hadis Surya Al Amin — Machine Learning & Computer Vision Engineer',
    description:
      'Machine learning and computer vision engineer with four years of industrial electronics engineering behind it. Based in Canberra, Australia — open to relocation.',
  },
  cv: {
    title: 'CV — Hadis Surya Al Amin',
    description:
      'Full CV for Hadis Surya Al Amin: experience, education, skills and achievements. Master of Machine Learning and Computer Vision student at ANU.',
  },
  notFound: {
    title: 'Page not found — Hadis Surya Al Amin',
    description: "The page you were looking for doesn't exist. Head back to the home page.",
  },
};
