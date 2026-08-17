/**
 * Site-wide identity, navigation labels, and page copy that isn't project- or
 * CV-specific: hero, about, contact section, footer, 404, skip link.
 *
 * Source of truth: .claude/epics/personal-site/epic.md §3 (positioning),
 * §4 (facts), §5.1 (home page copy), §5.4 (404).
 *
 * Every string here is either verbatim-required (flagged below) or a
 * lightly-adjusted version of the epic's draft copy — facts and order are
 * unchanged from the epic.
 */

export interface LinkItem {
  label: string;
  href: string;
}

/** Core identity facts. Reused across hero, footer, CV, and <head> metadata. */
export const identity = {
  fullName: 'Hadis Surya Al Amin',
  firstName: 'Hadis',
  email: 'hadisssurya@gmail.com',
  emailHref: 'mailto:hadisssurya@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hadissurya',
  linkedinLabel: 'LinkedIn',
  github: 'https://github.com/hadissuryaalamin',
  githubLabel: 'GitHub',
  /** This site's own repository — footer link only. Not a featured project. */
  siteRepo: 'https://github.com/hadissuryaalamin/hadissuryaalamin.github.io',
  location: 'Canberra, Australia',
} as const;

/**
 * The hero meta line. Verbatim string from epic.md §5.1(a) — do not alter
 * capitalisation or punctuation ("Open" is capitalised here; contrast with
 * cv.ts's contact line, which uses lowercase "open" per epic §5.3).
 */
export const heroMetaLine =
  'Canberra, Australia · Open to relocation, including Singapore · Master of Machine Learning and Computer Vision, ANU — expected December 2026';

/** Primary nav, present on every page (epic §7.7). Theme toggle is 002/004's markup, not data. */
export const nav: LinkItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/#projects' },
  { label: 'CV', href: '/cv/' },
  { label: 'Contact', href: 'mailto:hadisssurya@gmail.com' },
];

export const skipLinkLabel = 'Skip to content';

/** Hero section (epic §5.1a). */
export const hero = {
  h1: identity.fullName,
  /**
   * The §3 headline sentence. VERBATIM — acceptance criterion 14 requires
   * this exact string to appear on the home page unedited. Do not paraphrase.
   */
  lead:
    'Machine learning and computer vision engineer with four years of industrial electronics engineering behind it. I build models — and the embedded and robotics systems they actually run on.',
  metaLine: heroMetaLine,
  ctaPrimary: { label: 'Email me', href: identity.emailHref } as LinkItem,
  ctaSecondary: { label: 'View CV', href: '/cv/' } as LinkItem,
  ctaTertiary: [
    { label: identity.linkedinLabel, href: identity.linkedin },
    { label: identity.githubLabel, href: identity.github },
  ] as LinkItem[],
  /**
   * Alt text for the portrait (epic §11). Mandatory, non-empty, honest
   * description — never alt="". The image asset itself is produced by 004's
   * image pipeline; this is the only piece of the portrait 001 owns.
   */
  portraitAlt: 'Hadis Surya Al Amin, photographed outdoors in an alpine landscape',
};

/** About section (epic §5.1b). Three short paragraphs, first person. */
export const about: string[] = [
  "I'm a Master of Machine Learning and Computer Vision student at the Australian National University, graduating in December 2026 on an LPDP scholarship from the Indonesian government.",
  'Before Canberra I spent four years as an engineer in Indonesian industry — designing radar control boards and low-noise amplifiers at PT Radar Telekomunikasi, modifying PLC logic and writing .NET automation on the production line at Schneider Electric, and leading the team that took a hospital nurse-call system from PCB design to installed product.',
  "Now I build the software side of the same problem: perception, generative and reinforcement-learning models in PyTorch, and the ROS2 systems that carry them. I'm based in Canberra and open to relocating, including to Singapore.",
];

/** Contact section (epic §5.1e). Email must render as visible copyable text, not just a link. */
export const contact = {
  heading: 'Contact',
  paragraphPrefix: 'The fastest way to reach me is email —',
  emailText: identity.email,
  paragraphSuffix: ". I'm also on",
  linkedinLabel: identity.linkedinLabel,
  ctaPrimary: { label: 'Email me', href: identity.emailHref } as LinkItem,
};

/** Footer (epic §5.1f). Year is computed at render time by the template (not static data). */
export const footer = {
  name: identity.fullName,
  repoLink: { label: 'Source on GitHub', href: identity.siteRepo } as LinkItem,
};

/** Other-work section heading (epic §5.1d, Phase 3). Items themselves live in projects.ts. */
export const otherWorkHeading = 'Other work';

/** 404 page (epic §5.4). */
export const notFound = {
  h1: 'Page not found',
  paragraph: "This page doesn't exist — the link may have been mistyped, or it may have moved.",
  homeLink: { label: 'Back to the home page', href: '/' } as LinkItem,
};
