/**
 * The five featured projects (epic.md §6.1, display order is meaningful) and
 * the Phase-3 "other work" list (§6.2).
 *
 * Every fact below is traceable to epic.md §6, or — for maintain-ai — to the
 * repository README at https://github.com/hadissuryaalamin/maintain-ai
 * (fetched 2026-08-17; no numbers were invented beyond what the README states).
 *
 * Consumed by src/pages/index.astro (home cards) and
 * src/pages/projects/[slug].astro (detail pages) — both owned by task 002.
 * This file owns data only; no markup.
 */

export interface LinkItem {
  label: string;
  href: string;
}

export interface Metric {
  /** Displayed large, monospace, tabular figures — e.g. "29.92M", "25.62 → 25.18", "≈5.0". */
  value: string;
  /** Plain-language label shown under the value. */
  label: string;
}

export interface FeaturedProject {
  slug: string;
  /** 1-based display order per epic §6.1 — home page card order, prev/next nav order. */
  order: number;
  /** Short project name — the detail page's <h1> and the card title. */
  name: string;
  /** Optional subtitle from the epic's §6.1 heading, e.g. "Autonomous restaurant service-robot platform". */
  tagline?: string;
  /** Set only for IDX-alpha. When present, the template must render a visible "work in progress" label on both the card and the detail page. */
  status?: 'wip';
  statusLabel?: string;
  /** One-line summary used on the home card. May be reused or expanded on the detail page. */
  cardSummary: string;
  /** Even shorter one-line summary for the CV page's brief project list (epic §5.3, §16 item 8) — links out rather than duplicating paragraphs. */
  cvOneLiner: string;
  /** Role/context line for the meta strip. */
  context: string;
  /** Dates for the meta strip. */
  dates: string;
  /** Stack line for the meta strip. */
  stack: string[];
  /** 2–3 numbers for the home card's metric strip. */
  cardMetrics: Metric[];
  /** 2–4 numbers for the detail page's metrics block. May differ from cardMetrics (e.g. IDX-alpha adds the CV protocol). */
  detailMetrics: Metric[];
  /** "What it is" — 1–2 paragraphs. */
  whatItIs: string[];
  /** "What I did" — 1–2 paragraphs, first person, specific. */
  whatIDid: string[];
  /** "What I found / what I learned" — 1 paragraph. For DLSA, the negative GNN result belongs here, framed as rigour. */
  whatIFound: string;
  /** Repository link, shown on the detail page (not the card — cards link only to the detail page). */
  repo: LinkItem;
  /** Extra links: DishPatch's two merged PRs, GPT-2's attribution link to karpathy/nanoGPT. */
  extraLinks?: LinkItem[];
  /** <head> metadata for the detail page. */
  metaTitle: string;
  metaDescription: string;
}

export const featuredProjects: FeaturedProject[] = [
  {
    slug: 'dishpatch',
    order: 1,
    name: 'DishPatch',
    tagline: 'Autonomous restaurant service-robot platform',
    cardSummary:
      "ROS2 simulation for an autonomous restaurant service-robot fleet, running on AWS EC2 across separate Docker containers over a DDS connection. Two pull requests merged into the platform's public repository.",
    cvOneLiner:
      "ROS2 simulation for an autonomous restaurant service-robot fleet on AWS — two pull requests merged into the platform's public repository.",
    context: 'ANU TechLauncher (COMP8715) — client-driven team project',
    dates: 'Feb 2026 – present',
    stack: ['ROS2', 'nav2', 'DDS', 'Docker', 'AWS EC2', 'Git/GitHub'],
    cardMetrics: [
      { value: '2', label: 'pull requests merged into an external platform' },
      { value: 'ROS2 + nav2', label: 'navigation stack' },
      { value: 'AWS EC2', label: 'deployment target' },
    ],
    detailMetrics: [
      { value: '2', label: 'pull requests merged into an external platform' },
      { value: 'ROS2 + nav2', label: 'navigation stack' },
      { value: 'AWS EC2', label: 'deployment target' },
    ],
    whatItIs: [
      "DishPatch is an open-source, AWS-cloud-based platform for running an autonomous restaurant service-robot fleet — it integrates ordering, dispatch and control, and the robotics execution that gets food to a table. I joined as part of an ANU TechLauncher (COMP8715) team working against an external client's roadmap, contributing to the platform's own public repository rather than a project of my own.",
    ],
    whatIDid: [
      'I built the virtual-robot subsystem in ROS2: wrote the movement scripts, launched a simulated multi-robot fleet, and implemented autonomous navigation with nav2. I refactored the inter-component messaging onto standard ROS message types so the interfaces would be reusable rather than bespoke, and set up the ROS2 simulation to run in AWS EC2 across separate Docker containers connected over a DDS connection.',
      "Two of my pull requests were reviewed and merged into the platform's public repository: #33, \"Robot Packages\", and #41, \"Ros nav2 container\".",
    ],
    whatIFound:
      "This is the project I'd point to first: it's the only one where someone outside my own team decided the code was good enough to merge into a platform they maintain. Working inside someone else's ROS2 codebase, under branch ownership and pull-request review, meant writing interfaces for other contributors to build on — not just code that worked for me.",
    repo: { label: 'DDQXZcp/DishPatch', href: 'https://github.com/DDQXZcp/DishPatch' },
    extraLinks: [
      { label: 'PR #33 — Robot Packages', href: 'https://github.com/DDQXZcp/DishPatch/pull/33' },
      { label: 'PR #41 — Ros nav2 container', href: 'https://github.com/DDQXZcp/DishPatch/pull/41' },
    ],
    metaTitle: 'DishPatch — Hadis Surya Al Amin',
    metaDescription:
      "ROS2 simulation for an autonomous restaurant service-robot fleet, running on AWS EC2 across separate Docker containers over DDS. Two pull requests merged into the platform's public repository.",
  },
  {
    slug: 'gpt2-from-scratch',
    order: 2,
    name: 'GPT-2 from scratch',
    tagline: 'Multi-stage fine-tuning of a compact language model',
    cardSummary:
      'A 29.92M-parameter GPT-2-style language model pretrained from scratch, then improved from 25.62 to 25.18 test perplexity by a three-stage fine-tuning curriculum inside a hard 15-hour single-GPU budget.',
    cvOneLiner:
      'A 29.92M-parameter GPT-2-style model pretrained from scratch and improved via a three-stage fine-tuning curriculum under a 15-hour single-GPU budget.',
    context: 'ANU (COMP8650)',
    dates: '2026',
    stack: ['PyTorch', 'nanoGPT', 'tiktoken'],
    cardMetrics: [
      { value: '29.92M', label: 'parameters' },
      { value: '25.62 → 25.18', label: 'test perplexity' },
      { value: '15 h', label: 'single 8 GB GPU budget' },
    ],
    detailMetrics: [
      { value: '29.92M', label: 'parameters' },
      { value: '25.62 → 25.18', label: 'test perplexity' },
      { value: '15 h', label: 'single 8 GB GPU budget' },
    ],
    whatItIs: [
      "This is a GPT-2-style language model — 29.92M parameters, well under GPT-2 small's 124M — pretrained from scratch on ROCStories using nanoGPT and a tiktoken BPE tokenizer. It's built directly on karpathy/nanoGPT (MIT-licensed, retained): the upstream training loop and model definition are Andrej Karpathy's. My contribution is the data pipelines, the staged fine-tuning curriculum, the discourse-tag SFT format, and the evaluation and comparison tooling.",
    ],
    whatIDid: [
      'I pretrained the base model to a baseline test perplexity of 25.62, then designed a three-stage fine-tuning curriculum to push it further under a hard 15-hour, single 8 GB GPU budget: fluency transfer from TinyStories, then a discourse-tagged supervised fine-tune teaching explicit setup / conflict / reaction / attempt / resolution structure via tags, then a low-learning-rate clean pass that unlearns the tag format while keeping the structure it taught — so inference needs no special tokens at all. That third stage was the point of the whole design.',
      'I ran error analysis across decoding temperatures to characterise coherence and length-control failure modes, which forced explicit trade-offs between model size, run length, and how many experiments were worth the compute.',
    ],
    whatIFound:
      "The curriculum took test perplexity from 25.62 to 25.18 — a small number that stands in for a real constraint: at under a 32M-parameter ceiling, scale wasn't available to me, so the curriculum had to substitute for it. Deciding how many experiments were worth the compute inside a fixed 15-hour ceiling was as much the exercise as the modelling itself.",
    repo: {
      label: 'hadissuryaalamin/gpt2-rocstories-finetuning',
      href: 'https://github.com/hadissuryaalamin/gpt2-rocstories-finetuning',
    },
    extraLinks: [{ label: 'Base: karpathy/nanoGPT', href: 'https://github.com/karpathy/nanoGPT' }],
    metaTitle: 'GPT-2 from scratch — Hadis Surya Al Amin',
    metaDescription:
      'A 29.92M-parameter GPT-2-style language model pretrained from scratch, then improved from 25.62 to 25.18 test perplexity by a three-stage fine-tuning curriculum inside a 15-hour single-GPU budget. Built on karpathy/nanoGPT.',
  },
  {
    slug: 'deep-learning-statistical-arbitrage',
    order: 3,
    name: 'Deep Learning Statistical Arbitrage',
    cardSummary:
      'Neural trading policies learned directly from equity-return residuals, evaluated over 3,781 trading days and 31 retrained subperiods — annualised Sharpe up to ≈5.0, plus a clean negative result on the GNN extension.',
    cvOneLiner:
      'Neural trading policies learned from equity-return residuals, evaluated across 3,781 trading days with a clean negative result on a GNN extension.',
    context: 'ANU — "Neural Trading Policies on Equity Residuals"',
    dates: 'June 2026',
    stack: ['PyTorch', 'CNN-Transformer', 'GNN'],
    cardMetrics: [
      { value: '≈5.0', label: 'annualised Sharpe (PCA residuals)' },
      { value: '3,781', label: 'trading days evaluated' },
      { value: '31', label: 'retrained subperiods' },
    ],
    detailMetrics: [
      { value: '≈5.0', label: 'annualised Sharpe (PCA residuals)' },
      { value: '3,781', label: 'trading days evaluated' },
      { value: '31', label: 'retrained subperiods' },
    ],
    whatItIs: [
      'This project builds end-to-end neural trading policies — a convolution-transformer architecture with a graph neural network component — that learn directly from equity-return residuals in PyTorch, trained to maximise out-of-sample Sharpe ratio. Residuals are extracted with three different factor models: IPCA, PCA, and Fama–French five-factor.',
    ],
    whatIDid: [
      'I evaluated the policies under a leak-free rolling out-of-sample protocol spanning 3,781 trading days across 31 retrained subperiods, which is what makes the Sharpe numbers trustworthy rather than the product of a single lucky backtest window. Annualised Sharpe ratios reached up to ≈5.0 using PCA residuals.',
    ],
    whatIFound:
      "The honest result is the GNN extension: it added nothing. I built the graph component expecting the cross-sectional structure it modelled to add edge on top of the factor models, but once I ran the experiments properly I found the factor model had already captured what the GNN was meant to add — I hadn't fully understood what the factor model was doing until I saw that. Establishing that negative result cleanly, rather than quietly dropping the GNN, is the part of this project I trust most.",
    repo: {
      label: 'hadissuryaalamin/dlsa-public',
      href: 'https://github.com/hadissuryaalamin/dlsa-public',
    },
    metaTitle: 'Deep Learning Statistical Arbitrage — Hadis Surya Al Amin',
    metaDescription:
      'Neural trading policies learned directly from equity-return residuals, evaluated over 3,781 trading days and 31 retrained subperiods — annualised Sharpe up to ≈5.0, plus a clean negative result on a GNN extension.',
  },
  {
    slug: 'idx-alpha',
    order: 4,
    name: 'IDX-alpha',
    tagline: 'Daily equity ranking pipeline for the Indonesia Stock Exchange',
    status: 'wip',
    statusLabel: 'Work in progress',
    // NOTE: no Sharpe ratio anywhere in cardSummary, cardMetrics, or detailMetrics —
    // epic.md §6.1 item 4 and acceptance criterion 22 are explicit about this.
    cardSummary:
      'A work-in-progress ML pipeline for the Indonesia Stock Exchange that ranks equities daily — built to prove out end-to-end pipeline automation: leakage-safe validation, data contracts, tests, CI and an HTTP serving layer.',
    cvOneLiner:
      'A work-in-progress daily equity-ranking pipeline for the Indonesia Stock Exchange, built to prove out leakage-safe, end-to-end ML automation.',
    context: 'Self-directed portfolio project',
    dates: 'Ongoing',
    stack: [
      'Python 3.13',
      'LightGBM',
      'pandas',
      'numpy',
      'pyarrow',
      'scikit-learn',
      'pandera',
      'MLflow',
      'FastAPI',
      'DVC',
      'pytest',
      'GitHub Actions',
    ],
    cardMetrics: [
      { value: '976', label: 'tickers covered' },
      { value: '1.23M', label: 'rows of data' },
      { value: '6', label: 'anti-leakage invariants tested' },
    ],
    detailMetrics: [
      { value: '976', label: 'tickers covered' },
      { value: '1.23M', label: 'rows of data' },
      { value: '6', label: 'anti-leakage invariants tested' },
      { value: 'Purged + embargoed', label: 'cross-validation protocol' },
    ],
    whatItIs: [
      "IDX-alpha scores and ranks Indonesia Stock Exchange equities each trading day by predicted 5-day forward return, backtests the rankings as decile long-short and long-only portfolios with liquidity screens and transaction costs, and serves the current ranking over a small HTTP API. It isn't finished — I built it to prove out end-to-end pipeline automation and agent-assisted engineering, not to ship a finished trading strategy, and it's labelled work-in-progress for exactly that reason.",
    ],
    whatIDid: [
      'I built the pipeline against 976 tickers and 1.23 million rows of data from roughly July 2020 to July 2026, with a liquidity filter that leaves a median of around 257 tradeable names per day. The engineering is the actual point: leakage-safe validation, versioned data contracts, tests and CI, reproducibility and experiment tracking, and a serving layer — including six documented anti-leakage invariants, among them a signature test that snapshots a date\'s features, randomises everything later, rebuilds, and checks the earlier rows didn\'t move, plus purged-and-embargoed cross-validation instead of random K-fold, and per-date cross-sectional standardisation.',
    ],
    whatIFound:
      "I compared a base model (momentum and flow features) against a wider model adding liquidity and microstructure features: out-of-sample rank-IC improved from 0.021 to 0.045, which is the measure of predictive skill I'd stand behind here. The wide model's backtested net Sharpe after realistic costs (25 bps) is 3.12 — but per the project's own README, a net Sharpe of 3 on Indonesian mid-caps \"is not a deployable edge at face value,\" and its Limitations section is worth reading before trusting that number. The pipeline automation is the result I'm confident in; the trading performance is not yet a claim I'm making.",
    repo: { label: 'hadissuryaalamin/IDX-alpha', href: 'https://github.com/hadissuryaalamin/IDX-alpha' },
    metaTitle: 'IDX-alpha (work in progress) — Hadis Surya Al Amin',
    metaDescription:
      'A work-in-progress ML pipeline for the Indonesia Stock Exchange that ranks equities daily — leakage-safe validation, data contracts, tests, CI and an HTTP serving layer.',
  },
  {
    slug: 'maintain-ai',
    order: 5,
    name: 'maintain-ai',
    tagline: 'LLM agent for industrial maintenance diagnosis',
    cardSummary:
      'A secure, cost-aware LLM agent for industrial maintenance diagnosis — tool calling and work-order automation, built on four years of maintenance engineering at Schneider Electric.',
    cvOneLiner:
      'A secure, cost-aware LLM agent for industrial maintenance diagnosis, built on four years of maintenance engineering at Schneider Electric.',
    context: 'Personal project',
    dates: 'Ongoing',
    stack: [
      'Python 3.12+',
      'FastAPI',
      'Streamlit',
      'SQLite',
      'OpenAI Responses API',
      'MCP',
      'Docker Compose',
      'GitHub Actions',
    ],
    // Numbers verified from the repo README (github.com/hadissuryaalamin/maintain-ai, fetched 2026-08-17).
    cardMetrics: [
      { value: '6', label: 'typed tools with guardrails' },
      { value: '53.3% → 60.0%', label: 'task completion, 30-case eval' },
      { value: '−43.0%', label: 'token usage after optimisation' },
    ],
    detailMetrics: [
      { value: '6', label: 'typed tools with guardrails' },
      { value: '53.3% → 60.0%', label: 'task completion, 30-case eval' },
      { value: '86.7% → 93.3%', label: 'correct tool selection' },
      { value: '−43.0%', label: 'token usage after optimisation' },
    ],
    whatItIs: [
      'maintain-ai is an LLM agent for industrial maintenance diagnosis: it calls tools over plant data and drafts work orders, with safety and cost controls built in rather than bolted on. It explicitly cannot start, stop, reset, energise, isolate, or otherwise control equipment, and every work order needs human approval before it goes anywhere. It runs on FastAPI with a bounded agent loop, a Streamlit dashboard, and SQLite for storage, with a Model Context Protocol server for read-only access; the LLM backend is either a deterministic offline demo mode or the OpenAI Responses API.',
    ],
    whatIDid: [
      'I built six typed tools around the maintenance workflow — manual search, machine-status inspection, sensor-history retrieval, incident search, downtime-cost calculation, and work-order drafting — wrapped in guardrails: character and token budgets, step/call/time limits, observable retries, cancellation, duplicate-call suppression, and strict structured output. On the governance side I added allowlisted tools, tenant-scoped data filtering, audit events, delimiters around untrusted content, approval gating, and idempotent work orders, plus usage telemetry tracking tokens, cache tokens, latency, model, agent step, and tool name.',
      'Four years of maintenance work at Schneider Electric — tracking MTTR and MTBF, running Statistical Process Control, logging everything to an MES — is what the tool set and the workflow are actually modelled on.',
    ],
    whatIFound:
      'On a 30-case synthetic evaluation set, the cost-optimised configuration — model routing, bounded retrieval, conversation-history trimming — raised task completion from 53.3% to 60.0% and correct tool selection from 86.7% to 93.3%, while cutting token usage by 43.0%. The records are explicitly synthetic, so this is a demonstration of the agent architecture and its guardrails rather than a claim about a deployed system — but the optimisation levers are the same ones that matter for running an LLM agent against a real maintenance operation cheaply.',
    repo: { label: 'hadissuryaalamin/maintain-ai', href: 'https://github.com/hadissuryaalamin/maintain-ai' },
    metaTitle: 'maintain-ai — Hadis Surya Al Amin',
    metaDescription:
      'A secure, cost-aware LLM agent for industrial maintenance diagnosis — tool calling and work-order automation, built on four years of maintenance engineering at Schneider Electric.',
  },
];

export interface OtherWorkItem {
  name: string;
  /** One-line summary, rendered after the name. */
  summary: string;
  /** Omitted when no public repository exists — render as plain text, not a link, in that case. */
  href?: string;
}

/** Phase 3, epic §5.1(d) / §6.2. One line each, link to code, no images/metrics/detail pages. */
export const otherWork: OtherWorkItem[] = [
  {
    name: 'Personal agent',
    summary:
      'a locally-run, push-to-talk voice agent for scheduling, in English — local speech-to-text, Ollama, and text-to-speech running in the background.',
    href: 'https://github.com/hadissuryaalamin/personal-agent',
  },
  {
    name: 'Flow Matching Generative Models',
    summary:
      'flow-matching generative models built from scratch in PyTorch across all four prediction/loss parameterisations, plus one-step MeanFlow generation via JVP consistency training.',
    href: 'https://github.com/hadissuryaalamin/COMP4680-8650-Flowmatching',
  },
  {
    name: 'Safe Reinforcement Learning (PPO-Lagrangian)',
    summary:
      'a dual-critic PPO-Lagrangian agent that meets a safety-cost budget on a constrained MountainCar task at no measurable return loss, from a 72-run hyperparameter study.',
    // No public repository URL given in epic.md §6.2 — render without a link per its explicit instruction.
  },
  {
    name: 'selfieguard-image',
    summary: 'PyTorch face anti-spoofing research.',
    href: 'https://github.com/hadissuryaalamin/selfieguard-image',
  },
  {
    name: 'Battery-Tapo-Controller',
    summary:
      'a small Python utility that controls a TP-Link Tapo smart plug from laptop battery level, to keep the battery inside a healthy charge range.',
    href: 'https://github.com/hadissuryaalamin/Battery-Tapo-Controller',
  },
];
