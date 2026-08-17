// Verified public facts about the five featured projects, taken from
// epic.md §5.2 (slugs) and §6.1 (repos/metrics). These are the client's own
// public repository names/URLs and published metrics — not sensitive, and
// not the same category of data as the phone number (see spec/privacy.test.ts,
// which is deliberately fixture-free).
//
// Used to check structural/content criteria (18-22b) without depending on
// any particular markup contract from tasks 001/002 — see spec/helpers/dist.ts.

export interface ProjectFixture {
  slug: string;
  name: string;
  repoUrl: string;
  /** Substrings that should appear somewhere in the project's metric strip / body as evidence its real numbers are used. */
  metricKeywords: string[];
}

// Order matters: this is display order per epic.md §6.1 (criterion 18).
export const PROJECT_ORDER: ProjectFixture[] = [
  {
    slug: "dishpatch",
    name: "DishPatch",
    repoUrl: "https://github.com/DDQXZcp/DishPatch",
    metricKeywords: ["ROS2", "nav2", "AWS EC2"],
  },
  {
    slug: "gpt2-from-scratch",
    name: "GPT-2 from scratch",
    repoUrl: "https://github.com/hadissuryaalamin/gpt2-rocstories-finetuning",
    metricKeywords: ["29.92M", "25.62", "25.18"],
  },
  {
    slug: "deep-learning-statistical-arbitrage",
    name: "Deep Learning Statistical Arbitrage",
    repoUrl: "https://github.com/hadissuryaalamin/dlsa-public",
    metricKeywords: ["3,781", "31"],
  },
  {
    slug: "idx-alpha",
    name: "IDX-alpha",
    repoUrl: "https://github.com/hadissuryaalamin/IDX-alpha",
    metricKeywords: ["976", "1.23M"],
  },
  {
    slug: "maintain-ai",
    name: "maintain-ai",
    repoUrl: "https://github.com/hadissuryaalamin/maintain-ai",
    metricKeywords: [],
  },
];

export const DISHPATCH_PRS = [
  { number: 33, title: "Robot Packages" },
  { number: 41, title: "Ros nav2 container" },
];

export const GPT2_OLD_REPO_NAME = "nanoGPT";
export const GPT2_NEW_REPO = "gpt2-rocstories-finetuning";
export const NANOGPT_UPSTREAM = "karpathy/nanoGPT";

// epic.md §2 non-goals: the three COMP4020 web-dev prototypes must never be
// mentioned, in any form.
export const EXCLUDED_COMP4020_PROTOTYPES = ["COMP4020", "Dijkstra, Traced", "Kaskus", "ANUISA"];

// epic.md §5.3: no company name from the tailored-CV set may appear anywhere.
export const EXCLUDED_COMPANY_NAMES = [
  "Aumovio",
  "Infineon",
  "Tetra Pak",
  "Acronis",
  "ThunderSoft",
  "Chubb",
  "WeComms",
];

export const HEADLINE_SENTENCE =
  "Machine learning and computer vision engineer with four years of industrial " +
  "electronics engineering behind it. I build models — and the embedded and " +
  "robotics systems they actually run on.";

export const EMAIL = "hadisssurya@gmail.com";
export const EMAIL_MAILTO = `mailto:${EMAIL}`;

// epic.md §6.2 "other work" — verified public as of 2026-08-17 (§6.3).
// Safe Reinforcement Learning is deliberately excluded here: epic.md says
// "link only if a public repository exists ... otherwise list it with no
// link" — its public status isn't confirmed, so it's not part of the
// external-link 200 check.
export const OTHER_WORK_REPOS = [
  "https://github.com/hadissuryaalamin/personal-agent",
  "https://github.com/hadissuryaalamin/COMP4680-8650-Flowmatching",
  "https://github.com/hadissuryaalamin/selfieguard-image",
  "https://github.com/hadissuryaalamin/Battery-Tapo-Controller",
];
