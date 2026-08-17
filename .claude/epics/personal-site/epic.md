# Epic: `hadissuryaalamin.github.io` — personal site

> **Status:** discovery complete, awaiting client sign-off before build.
> **Author:** PM discovery agent, 2026-08-17.
> **Audience for this document:** build agents with **zero** memory of the discovery
> conversation. Everything needed to implement is here. Do not ask the client
> questions that are already answered below; where a decision was explicitly
> delegated, it is listed in **§16 Open decisions delegated to build agents**
> together with the constraints that still bound it.

> **PRIVACY — read first.** The client has a phone number on their CV. It is
> **deliberately excluded from this document and from the entire project** at their
> explicit instruction. Do not go looking for it, do not copy it out of the source
> PDFs, and do not add it to any page, asset, commit message, or test fixture.
> A street address is likewise excluded; location is **"Canberra, Australia"** only.
> This document may end up in a public repository.

---

## 1. What this is and who it's for

A personal website for **Hadis Surya Al Amin**, published at
`https://hadissuryaalamin.github.io/`, whose single job is to convert a
**recruiter or hiring manager** who has ~30 seconds into someone who emails him
about a machine-learning / computer-vision / robotics-perception role. It is a
job-application instrument first and a portfolio second: the portfolio exists
because concrete, measured projects are what make a recruiter reply. The
**primary call to action is contact by email**; the **secondary is the CV**.
Everything on the site is subordinate to those two actions. The reader is
assumed to be non-specialist-but-technical-adjacent — able to recognise that
"perplexity 25.62 → 25.18 under a 32M-parameter ceiling" or "two pull requests
merged into someone else's platform" is a real result, but not reading code.

---

## 2. Goals and non-goals

### Goals

1. A recruiter can, within 30 seconds of landing, know **who he is, what he does,
   what makes him unusual, and how to contact him** — without scrolling past
   anything that requires waiting, clicking, or animation.
2. Email contact is the loudest action on the page and is reachable from every page.
3. Five featured projects, each with real verified metrics, each with its own
   detail page and a link to public source code.
4. A CV that reads well on screen **and** that the visitor can turn into a clean
   PDF themselves, with no phone number in it.
5. Works and looks intentional at 1920×1080 desktop and 390×844 phone.
6. Passes the full course-invariant quality bar **plus** an automated
   accessibility scan and a contrast check (see §9).
7. Fast: it is the first impression of an engineer, so page weight and layout
   stability are part of the deliverable.

### Non-goals — do not build these

Each of these was explicitly ruled out by the client. Adding any of them is a
defect, not initiative.

- **No web-development / front-end coursework shown.** The three COMP4020
  prototypes ("Dijkstra, Traced", the Kaskus-styled portfolio, the ANUISA
  redesign) are **excluded entirely** — no cards, no detail pages, no one-line
  mentions, no links, not even in "other work". The client does not want to be
  read as a web developer. (The site itself is web work; that is the vehicle,
  not the pitch. Do not surface it as a project.)
- **No blog or writing section.**
- **No skills wall of technology logos.**
- **No testimonials or references section.**
- **No photo gallery.**
- **No Bahasa Indonesia version** — English only.
- **No hobbies / interests section.**
- **No Google Scholar or publications section.**
- **No custom domain** — bare `hadissuryaalamin.github.io`.
- **No contact form** — a `mailto:` link only. There is no server; a form would
  need a third-party service and was rejected.
- **No server-side anything** — no API routes, no database, no auth, no
  server-rendered pages. Static output only.
- **No ambient / always-on background animation.** Standing preference on
  record: a floating-paths background effect was previously rejected as "very
  bad". Motion happens **because the visitor scrolled**, never on its own.
- **No cartoon avatar.** `E:\comp8020\misc_files\avatar.png` is superseded and
  must not be used. Use the real photograph (§11).
- **No phone number, anywhere** (see §10, §12).
- **No cookie banner** — because no cookies are set (see §9, analytics).

---

## 3. Positioning

The headline sentence — the most-read line on the site — is **approved verbatim**
and must be used exactly as written:

> **Machine learning and computer vision engineer with four years of industrial
> electronics engineering behind it. I build models — and the embedded and
> robotics systems they actually run on.**

**Why this line, so you don't drift from it:** the client ranked target roles as
*(A) ML / computer-vision engineer* **or** *(B) robotics and perception engineer*
first — either is acceptable — with *(C) the embedded-and-hardware combination*
as the **supporting differentiator, not the lead**. So the page leads with
ML/CV/perception and states the hardware background immediately after, in the
same breath. Do not re-order this to lead with hardware, and do not soften it
into a generic "passionate about AI" line.

Tone of voice throughout: **plain, factual, first person, quietly confident.**
Numbers instead of adjectives. No exclamation marks, no "passionate", no
"cutting-edge", no emoji anywhere on the site.

---

## 4. Factual content block — the single source of truth

All facts below are verified from the client's own CVs
(`E:\comp8020\misc_files\CV\cv-hadis-surya-al-amin-aumovio-2026-08-16.pdf` and
`E:\comp8020\misc_files\CV\Hadis_Surya_Al_Amin_CV.pdf`) and confirmed by the
client in discovery. **Use these values; do not re-derive them from other
sources, and do not open the cover-letter PDFs in that folder for content — they
are addressed to specific companies and must never be published or quoted.**

| Field | Value |
|---|---|
| Full name (site title + `<h1>`) | **Hadis Surya Al Amin** |
| Name in prose | **Hadis** |
| Email (primary CTA) | `hadisssurya@gmail.com` — note **three consecutive `s`** ("hadis" + "ssurya") |
| LinkedIn | `https://www.linkedin.com/in/hadissurya` |
| GitHub | `https://github.com/hadissuryaalamin` |
| Location | **Canberra, Australia** (city + country only — no street address, no postcode) |
| Availability | Open to relocation, including **Singapore** |
| Current study | **Master of Machine Learning and Computer Vision**, Australian National University, Feb 2025 – **expected December 2026** |
| Scholarship | **LPDP (Indonesia Government) scholarship awardee**, Nov 2024 |
| Phone | **DELIBERATELY EXCLUDED** — never appears on the site, in the repo, or in printed output |

### Education (full, for the CV page)

- **Australian National University** — Master of Machine Learning and Computer
  Vision — Canberra, Australia — Feb 2025 – expected Dec 2026. LPDP (Indonesia
  Government) scholarship awardee. Coursework across computer vision, deep
  learning, and advanced ML topics.
- **Islam Nusantara University** — Bachelor of Electrical and Electronics
  Engineering — Bandung, Indonesia — Jul 2016 – Oct 2020. GPA 3.26, focus in
  electromedical engineering. Best Undergraduate Thesis, Batch 2016: "Design of
  IoT Data Logger for Symptoms COVID-19 Observation".
- **SMK Negeri 1 Cimahi** — Diploma, Instrumentation Process Control — Cimahi,
  Indonesia — Jul 2012 – Apr 2016. Four-year industrial-instrument program: PID
  control, PLC fundamentals, control valves, transmitters.

### Work experience — full history, client confirmed "yes, full history"

Present newest-first on the CV page.

1. **AkLab Nurse Call System** — Research and Development — Garut, Indonesia —
   Apr 2024 – Jan 2025.
   Led a team building a new nurse-call system product end to end; designed
   customised PCBs; developed comprehensive test programs to validate
   functionality and performance; established detailed testing process standards
   that improved QA consistency and accuracy; implemented Modbus RTU and Modbus
   TCP/IP communication plus PoE between components; coordinated SMT PCB
   manufacturing setup.
2. **Schneider Electric** — Maintenance Technician — Batam, Indonesia —
   Aug 2021 – Feb 2024.
   Modified PLC logic to raise Overall Equipment Effectiveness (OEE); built an
   internal automation application in .NET including database setup and Modbus
   communication; kept production free of electrical, mechanical and pneumatic
   defects; proposed Kaizen / continuous-improvement changes for stability,
   quality, capability and cycle time; recorded maintenance on the MES; tracked
   personal KPIs (MTTR, MTBF); implemented Total Productive Maintenance;
   analysed processes with Statistical Process Control.
3. **PT Radar Telekomunikasi Indonesia** — Hardware Engineer — Bandung,
   Indonesia — May 2021 – Jul 2021.
   Designed and built control boards and low-noise amplifiers for military radar
   systems using circuit design, microprocessors and communication protocols,
   with hands-on troubleshooting and repair of the sensor electronics feeding
   real-time perception.
4. **Edu+ Project** — Hardware Engineer — Cimahi, Indonesia — Nov 2020 – Feb 2021.
   IoT product developer for XL Future Leaders X-Camp: designed electronic PCBs
   and schematics, selected materials with cost-balance justification, assembled
   and soldered SMD components, evaluated and troubleshot IoT devices.
5. **PT Telekomunikasi Indonesia** — Test Engineer Internship — Bandung,
   Indonesia — Sep 2019 – Feb 2020.
   Verified optical devices — fibre termination management, optical distribution
   points, optical distribution cabinets, fibre optic — against product and
   service quality standards for the Indonesian market.
6. **CV Afal Medika Sejahtera** — Maintenance Technician — Bandung, Indonesia —
   Apr 2016 – Oct 2017.
   Maintained, examined, troubleshot and reported on electronic medical devices
   (infusion and syringe pumps, ECG machines, patient monitors) at Immanuel
   Hospital and the Hospital Region of Cicalengka as a sub-contractor.

### Skills (CV page)

- **AI & Machine Learning** — Python, PyTorch, deep learning, LLMs and
  generative models, LLM fine-tuning, computer vision, reinforcement learning,
  model evaluation and benchmarking, hyperparameter tuning, Git/GitHub, Docker.
- **Robotics & Systems** — ROS2, nav2, robotics simulation, microcontrollers,
  IoT / embedded devices, AWS.
- **Sensor & Electronics** — radar control boards, low-noise amplifiers, circuit
  and PCB design, Altium Designer, Autodesk Eagle, KiCAD, PLC programming,
  Codesys, Modbus RTU/TCP, instrument calibration.
- **Data & Tools** — SQL, Statistical Process Control, Tableau, Power BI,
  .NET (Visual Basic), Microsoft Office.
- **Manufacturing** — SMT / PCB manufacturing, Total Productive Maintenance,
  Kaizen / continuous improvement, laser systems.

### Achievements (CV page)

- **Nov 2024** — LPDP (Indonesia Government) scholarship awardee for the Master
  of Machine Learning and Computer Vision at the Australian National University.
- **Jan 2023** — 4th Runner-up, Good Sharing Schneider East Asia & Pacific 2022
  Continuous Improvement Contest; led Team Cahaya Tower to the QCC International
  final.
- **May 2023** — recognised for driving the tester-traceability modification on
  the RMC line.
- **Apr 2023** — implemented improvements to the sequence-packing scanning
  program for the XB5 family.
- **Mar 2023** — recognised for assistance implementing Laser Marking EV0.
- **Feb 2023** — implemented the change-series cycle-time reduction on the
  RMC2 second line.
- **2020** — Best Undergraduate Thesis, Batch 2016, Islam Nusantara University.

---

## 5. Page and section inventory

Five featured project detail pages + home + CV + 404. Copy is **drafted by the
build agent** from the sources named here, in Hadis's voice, first person
(client answered "you draft everything, I read it through and correct anything
wrong"). **The client must read and approve every factual claim before launch —
this is a hard gate, see §15.** Placeholder copy is *not* authorised: every
sentence must be traceable to the CVs, the repository READMEs, or the client
quotes recorded in this document.

### 5.1 `/` — Home

Single column, centred, max content width 72rem. Sections in this order:

**(a) Hero.** Contains, in order:
- `<h1>` — `Hadis Surya Al Amin` (the page's only `<h1>`).
- Lead paragraph — the §3 headline sentence, **verbatim**.
- Meta line, monospace, small: `Canberra, Australia · Open to relocation, including Singapore · Master of Machine Learning and Computer Vision, ANU — expected December 2026`
- The portrait (§11).
- **Primary CTA** — a real button, accent-filled, label **"Email me"**,
  `href="mailto:hadisssurya@gmail.com"`. This must be the highest-contrast,
  largest interactive element in the hero.
- **Secondary** — text link **"View CV"** → `/cv/`.
- **Tertiary** — `LinkedIn` and `GitHub` text links (labelled in words, not
  icon-only; if an icon is used it must be accompanied by an accessible name).

**(b) About.** Two-to-three short paragraphs. Draft copy (adjust wording, keep
facts and order):

> I'm a Master of Machine Learning and Computer Vision student at the Australian
> National University, graduating in December 2026 on an LPDP scholarship from
> the Indonesian government.
>
> Before Canberra I spent four years as an engineer in Indonesian industry —
> designing radar control boards and low-noise amplifiers at PT Radar
> Telekomunikasi, modifying PLC logic and writing .NET automation on the
> production line at Schneider Electric, and leading the team that took a
> hospital nurse-call system from PCB design to installed product.
>
> Now I build the software side of the same problem: perception, generative and
> reinforcement-learning models in PyTorch, and the ROS2 systems that carry them.
> I'm based in Canberra and open to relocating, including to Singapore.

**(c) Selected projects.** The five featured projects of §6, **in the order given
there**. Each rendered as a card containing: project name, one-line summary
(actual text given in §6), a metric strip of two-to-three numbers in monospace
with tabular figures, a stack line in monospace, and a link to the detail page.
The whole card is a link target to the detail page; the repo link lives on the
detail page (avoid two competing links inside one card).
Layout: single column below 900px; two columns at ≥900px with the **first card
(DishPatch) spanning both columns** as the lead. All five must be visible without
interaction — no carousel, no "load more", no filtering.

**(d) Other work.** A compact list, one line each, from §6.2, each linking to its
public repository. No images, no metrics, no detail pages. *Phase 3.*

**(e) Contact.** Repeats the primary action, with the email address as **visible
text** (so it can be copied, not just clicked) as well as a `mailto:` link, plus
LinkedIn. Draft copy: "The fastest way to reach me is email — `hadisssurya@gmail.com`.
I'm also on LinkedIn."

**(f) Footer.** Name, the year, a link back to the GitHub repo of this site. No
"built with love", no emoji.

### 5.2 `/projects/<slug>/` — five project detail pages

Slugs: `dishpatch`, `gpt2-from-scratch`, `deep-learning-statistical-arbitrage`,
`idx-alpha`, `maintain-ai`.

One shared template. Structure:
1. Back link — "← All projects" to `/#projects`.
2. `<h1>` — project name (the page's only `<h1>`).
3. One-sentence summary (the §6 card summary may be reused or expanded).
4. **Meta strip** (monospace): context/role, dates, stack.
5. **Metrics block** — two-to-four key numbers, large, monospace, **tabular
   figures aligned**, each with a plain-language label under it. Numbers only
   from §6; no invented figures, no rounding that changes meaning.
6. **What it is** — 1–2 paragraphs.
7. **What I did** — 1–2 paragraphs, first person, specific.
8. **What I found / what I learned** — 1 paragraph. For DLSA this is where the
   negative result goes (§6.1 item 3) — written as a genuine learning outcome,
   in the client's own framing, not as a failure.
9. **Links** — repository, and for DishPatch the two merged pull requests.
   Every external link: `rel="noopener"`, opens in the same tab unless there is a
   reason otherwise.
10. Previous / next project navigation.

### 5.3 `/cv/` — CV page

The full CV as a web page. `<h1>`: `Hadis Surya Al Amin` (append " — CV" if you
prefer, but exactly one `<h1>`). Sections, in order: **Summary**, **Experience**,
**Education**, **Skills**, **Achievements**, **Projects** (brief — one line per
featured project, linking to its detail page). Content strictly from §4 and §6.

- Contact block on this page: email, LinkedIn, GitHub, "Canberra, Australia ·
  open to relocation, including Singapore". **No phone number.**
- A **"Download CV (PDF)"** button that calls `window.print()` — see §10.
- The portrait is **hidden in print** (§10, §11).
- Summary paragraph: adapt from the Aumovio CV's professional summary, made
  company-neutral. Draft:

> Master of Machine Learning and Computer Vision student at the Australian
> National University (LPDP scholarship) with hands-on deep learning built from
> the ground up in PyTorch: generative, reinforcement-learning and language
> models implemented straight from research papers, trained under fixed GPU
> budgets and benchmarked across datasets and decoding regimes. Formal computer
> vision training paired with robotics systems work: built the perception-adjacent
> virtual-robot subsystem in ROS2 with nav2 navigation for an autonomous fleet,
> containerised in Docker on AWS. Backed by an electronics and sensor-hardware
> engineering background — radar control boards and low-noise amplifiers, IoT and
> embedded PCB design — that maps directly onto sensor and perception systems.

**The published CV must be company-neutral.** The seven tailored CVs in
`E:\comp8020\misc_files\CV\` name specific employers (Aumovio, Infineon, Tetra
Pak, Acronis, ThunderSoft, Chubb, WeComms). **No company name from that set may
appear on the site.** Use them only as factual sources.

### 5.4 `/404`

A real page, not a default: `<h1>`, a sentence, a link home. Must satisfy every
invariant in §9 like any other page.

---

## 6. Projects

### 6.1 Featured — five, in this display order

**1. DishPatch — autonomous restaurant service-robot platform**
- Repo: `https://github.com/DDQXZcp/DishPatch` (public, not the client's own repo)
- Context: ANU TechLauncher / COMP8715, client-driven team, Feb 2026 – present
- Card summary: *"ROS2 simulation for an autonomous restaurant service-robot
  fleet, running on AWS EC2 across separate Docker containers over a DDS
  connection. Two pull requests merged into the platform's public repository."*
- Verified facts: open-source, AWS cloud-based restaurant service-robot platform
  integrating ordering, dispatch/control and robotics fleet execution. Hadis
  built the virtual-robot subsystem in ROS2 — wrote movement scripts, launched a
  simulated multi-robot fleet, implemented autonomous navigation with nav2;
  refactored inter-component messaging onto standard ROS message types for
  reusable interfaces; containerised the development stack with Docker;
  collaborated via branch ownership and pull-request review.
- **Merged pull requests (verified on GitHub): #33 "Robot Packages" (merged
  2026-05-06) and #41 "Ros nav2 container" (merged 2026-05-26).**
- The client's own words on what those two PRs did — keep these technical
  specifics, they are what make it credible: *"Create ROS2 simulation run in AWS
  EC2 using separate docker and using DDS connection in EC2 machine."*
- Metrics for the metric strip: `2` pull requests merged into an external
  open-source platform; `ROS2 + nav2`; `AWS EC2`.
- Stack: ROS2, nav2, DDS, Docker, AWS EC2, Git/GitHub.
- **Why it leads:** it is the only item externally validated — someone else
  accepted his code into their public project.

**2. GPT-2 from scratch — multi-stage fine-tuning of a compact language model**
- Repo: `https://github.com/hadissuryaalamin/gpt2-rocstories-finetuning` (public;
  renamed from `nanoGPT` on 2026-08-17 and description landed. The old
  `.../nanoGPT` URL still redirects, but **link the new name**.)
- **Attribution is mandatory in the write-up.** This repo is built on
  `karpathy/nanoGPT` (MIT, retained). The upstream training loop and model
  definition are Karpathy's; the contribution is the data pipelines, the staged
  curriculum, the discourse-tag SFT format, and the eval/comparison tooling. The
  site must credit nanoGPT as the base — presenting this as wholly original work
  would be a defect. The repo README (rewritten 2026-08-17, PR #1) is the
  canonical wording; follow it.
- Context: ANU, COMP8650, 2026
- Card summary: *"A 29.92M-parameter GPT-2-style language model pretrained from
  scratch, then improved from 25.62 to 25.18 test perplexity by a three-stage
  fine-tuning curriculum inside a hard 15-hour single-GPU budget."*
- Verified facts: pretrained a 29.92M-parameter GPT-2-style model from scratch on
  ROCStories (nanoGPT, tiktoken BPE) to a baseline test perplexity of 25.62;
  designed a three-stage fine-tuning curriculum — fluency transfer from
  TinyStories, discourse-tag structure learning, then a clean pass — improving
  test perplexity to 25.18 within a hard 15-hour single-GPU budget on 8 GB of
  memory; ran error analysis across decoding temperatures to characterise
  coherence and length-control failure modes, forcing explicit trade-offs between
  model size, run length, and how many experiments were worth the compute.
- Metrics: `29.92M` parameters · `25.62 → 25.18` test perplexity · `15 h` on one
  8 GB GPU.
- Architecture verified from `config/finetune_rocstories_clean.py`: 6 layers,
  6 heads, `n_embd` 384, `block_size` 256, vocab 50257, `bias=False`, tied
  embedding/output head. The `29.92M` figure is nanoGPT's own
  `get_num_params()`, which excludes position embeddings; the full count is
  30.02M. Use 29.92M, and do not describe it as "GPT-2 sized" — GPT-2 small is
  124M. The 32M-parameter ceiling was a project constraint and is worth stating,
  because the curriculum is what substitutes for scale.
- The three stages, verified from the configs: (1) fluency transfer from
  TinyStories, (2) discourse-tagged SFT teaching
  `<|s1|>`…`<|s5|>` setup/conflict/reaction/attempt/resolution structure,
  (3) a low-LR clean pass that unlearns the tag format while keeping the
  structure, so inference needs no special tokens. Stage 3 is the design's
  point and the write-up should say so.
- Stack: PyTorch, nanoGPT, tiktoken.

**3. Deep Learning Statistical Arbitrage**
- Repo: `https://github.com/hadissuryaalamin/dlsa-public` (public)
- Context: ANU, June 2026 — "Neural Trading Policies on Equity Residuals"
- Card summary: *"Neural trading policies learned directly from equity-return
  residuals, evaluated over 3,781 trading days and 31 retrained subperiods —
  annualised Sharpe up to ≈5.0, plus a clean negative result on the GNN
  extension."*
- Verified facts: built end-to-end neural trading policies (a convolution–
  transformer with a graph/GNN component) in PyTorch learning directly from
  equity-return residuals to maximise out-of-sample Sharpe ratio; extracted
  residuals with three factor models (IPCA, PCA, Fama–French 5-factor);
  evaluated under a leak-free rolling out-of-sample protocol spanning **3,781
  trading days across 31 retrained subperiods**; achieved **annualised Sharpe
  ratios up to ≈5.0 (PCA residuals)**; established a clean negative result
  showing the cross-sectional GNN extension provided no out-of-sample edge once
  factor structure was removed.
- **The negative result is a feature and must be included.** The client's own
  honest framing, to be written in his voice: he did not initially understand
  what the factor model was doing; after running the experiments he learned that
  the factor model already achieved the purpose the GNN was meant to serve — so
  the GNN added nothing beyond the factor structure. Present it as rigour and
  learning, never as a failure or an apology.
- Metrics: `≈5.0` annualised Sharpe (PCA residuals) · `3,781` trading days ·
  `31` retrained subperiods.
- Stack: PyTorch, CNN-Transformer, GNN.
- **Metric discipline:** ≈5.0 belongs to **this** project. Do not confuse it with
  IDX-alpha's 3.62/3.12 — they are different projects with different numbers.

**4. IDX-alpha — daily equity ranking pipeline for the Indonesia Stock Exchange**
- Repo: `https://github.com/hadissuryaalamin/IDX-alpha` (public; description
  landed 2026-08-17)
- Context: self-directed portfolio project; its README states it is a portfolio
  project for an ML engineering role
- **STATUS — READ THIS FIRST. The client stated on 2026-08-17: "IDX-alpha is not
  finished. It just prove the pipeline automation or agent embedd."** So this is
  **work in progress**, and it is featured as a demonstration of *automated ML
  pipeline engineering*, NOT as a finished result and NOT as a trading strategy
  with a performance claim. This overrides any earlier framing in this document.
  - **Do not use any performance figure as the headline.** No Sharpe ratio in the
    card summary, no Sharpe in the hero of the detail page, no Sharpe in a metric
    strip. Performance numbers may appear only inside the body prose, only with
    their cost assumption attached, and only alongside the README's own caveats.
  - **Label it visibly as in progress** on both the card and the detail page.
  - The thing being shown is the *machinery*: leakage-safe validation, data
    contracts, tests, CI, reproducibility, tracking, serving — an automated,
    agent-assisted pipeline that runs end to end. That is the claim, and it is a
    strong one on its own.
- Card summary: *"A work-in-progress ML pipeline for the Indonesia Stock Exchange
  that ranks equities daily — built to prove out end-to-end pipeline automation:
  leakage-safe validation, data contracts, tests, CI and an HTTP serving layer."*
- Verified facts: scores and ranks IDX equities each trading day by predicted
  5-day forward return; backtests the rankings as decile long-short and long-only
  portfolios with liquidity screens and transaction costs; serves the current
  ranking over a small HTTP API. The README frames the *engineering* as the
  product — leakage-safe validation, data contracts, tests, CI, reproducibility,
  tracking, serving and monitoring. Data: **976 tickers, 1.23M rows**, ~2020-07
  to 2026-07; liquidity filter leaves a median of ~257 tradeable names per day.
  Two models compared: base (momentum + flow) at **0.021** out-of-sample
  rank-IC, wide (adding liquidity/microstructure features) at **0.045**. Wide
  model net Sharpe: 3.62 @ 0 bps, **3.12 @ 25 bps**, 2.62 @ 50 bps, 1.62 @ 100
  bps, 0.62 @ 150 bps. Six documented anti-leakage invariants including a
  signature test that snapshots features for a date, randomises all later data,
  rebuilds, and checks the earlier rows are unchanged; purged-and-embargoed
  cross-validation rather than random K-fold; per-date cross-sectional
  standardisation.
- **Superseded by the STATUS block above.** For the avoidance of doubt: net Sharpe
  is NOT the headline for this project. If any performance figure is mentioned in
  body prose, use the after-costs `3.12 @ 25 bps` and never the pre-cost `3.62`
  alone, and attach at least one of the README's own caveats — the README itself
  says *"read the Limitations section before believing the Sharpe"* and that a net
  Sharpe of 3 on Indonesian mid-caps *"is not a deployable edge at face value"*.
  The README names rank-IC (~0.045) as the honest measure of predictive skill.
- Metrics strip (engineering, not performance): `976` tickers · `1.23M` rows ·
  `6` documented anti-leakage invariants · purged + embargoed CV. Deliberately
  no Sharpe figure here.
- Stack: Python 3.13, LightGBM, pandas/numpy/pyarrow, scikit-learn, pandera,
  MLflow, FastAPI, DVC, pytest, GitHub Actions.

**5. maintain-ai — LLM agent for industrial maintenance diagnosis**
- Repo: `https://github.com/hadissuryaalamin/maintain-ai` (public)
- Card summary: *"A secure, cost-aware LLM agent for industrial maintenance
  diagnosis — tool calling and work-order automation, built on four years of
  maintenance engineering at Schneider Electric."*
- Verified from the repo description: "secure, cost-aware LLM agent for
  industrial maintenance diagnosis, tool calling, work-order automation".
- **Build agent must read this repository's README** for the specific
  architecture, guardrails, cost controls and any measured results, and write the
  detail page from it. If the README yields no numbers, the metric strip may use
  qualitative facts (e.g. tool count, model provider, cost-control mechanism) —
  **do not invent numbers.**
- **Why it's featured:** it connects directly to the client's four years at
  Schneider Electric. Make that connection explicit in the copy — it turns a
  side project into a coherent career story.

### 6.2 Other work — one line each, link to code (Phase 3)

- **Personal agent** — `https://github.com/hadissuryaalamin/personal-agent` —
  a **locally-run, push-to-talk voice agent for scheduling**, in **English**
  (local speech-to-text + Ollama + text-to-speech, runs in the background).
  **The GitHub description is out of date and says Bahasa Indonesia — it is
  English now. Do not describe it as Bahasa Indonesia.** Client pre-launch task
  to fix the description (§15).
- **Flow Matching Generative Models** —
  `https://github.com/hadissuryaalamin/COMP4680-8650-Flowmatching` —
  flow-matching generative models implemented from scratch in PyTorch across all
  four prediction/loss parameterisations (x-/v-prediction × x-/v-loss) on
  multiple datasets and ambient dimensions; showed x-prediction scales to high
  dimensions while v-prediction degrades, explained through the rank of each
  prediction target; implemented MeanFlow one-step generation using forward-mode
  automatic differentiation (JVP) consistency training. ANU COMP8650.
- **Safe Reinforcement Learning (PPO-Lagrangian)** — built and compared three RL
  agents (DQN, PPO, Safe PPO) on a constrained MountainCar CMDP to enforce a
  speed-safety constraint; designed a dual-critic PPO-Lagrangian agent with an
  adaptive Lagrangian multiplier (dual ascent) that met the cost budget at no
  measurable return loss; ran a structured two-stage, 72-run hyperparameter
  study and found the base policy's unconstrained *cost* — not its return —
  predicts constrained feasibility. ANU team project.
  **Link only if a public repository exists under `github.com/hadissuryaalamin`;
  otherwise list it with no link. Never publish a link to a private repo.**
- **selfieguard-image** — `https://github.com/hadissuryaalamin/selfieguard-image`
  — PyTorch face anti-spoofing research.
- **Battery-Tapo-Controller** —
  `https://github.com/hadissuryaalamin/Battery-Tapo-Controller` — a small Python
  utility that controls a TP-Link Tapo smart plug based on laptop battery level,
  to keep the battery inside a healthy charge range.

### 6.3 Repository visibility — verified

All of `gpt2-rocstories-finetuning` (renamed from `nanoGPT` on 2026-08-17),
`personal-agent`, `maintain-ai`, `Battery-Tapo-Controller`,
`IDX-alpha`, `dlsa-public` are **public** as of 2026-08-17, and
`DDQXZcp/DishPatch` was already public. Every project link may therefore point at
real code. **Before launch, verify each link returns 200** — a 404 from a
recruiter's click is worse than no link (§12).

---

## 7. Visual direction

The client had **no reference sites** ("nothing in particular"), so this section
is prescriptive on purpose. A build agent should not need to invent taste.

### 7.1 Direction

**Quiet and typographic, rendered dark-first.** Generous whitespace, one strong
typeface, restrained monospace, a single accent colour, no decoration. Explicitly
**not** a terminal/code-editor pastiche, not neon, not glassmorphism, not
gradient-heavy, no glow effects, no purple-to-blue hero gradient, no bento-grid
of empty cards.

**The technical / "futuristic" character is carried by the design, not by the
animation** (the client chose calm motion — §8). It comes from:
- monospace type with **tabular figures** for every metric, label, date and stack
  line, so numbers align in a column like an instrument readout;
- **hairline rules** (1px, low-contrast) separating sections and entries;
- precise, repeated spacing rhythm — the same measurements everywhere;
- uppercase micro-labels with wide letter-spacing for section eyebrows;
- exactly **one** accent colour, used sparingly: the primary CTA, focus rings,
  link underlines, and small marks. Never large accent fills.

### 7.2 Typefaces

- **Text and headings: Inter** (variable). Fallback stack:
  `Inter, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- **Monospace (metrics, labels, dates, stack lines): JetBrains Mono.** Fallback:
  `"JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace`.
- **Self-host** both as subsetted `woff2` in the repo (e.g. via `@fontsource`) —
  do not hotlink a font CDN (privacy, and one less third-party dependency).
  `font-display: swap`; preload only the weights actually used above the fold.
  Enable `font-variant-numeric: tabular-nums` wherever numbers are displayed.
- Weights: 400 and 600 for Inter; 400 (and optionally 500) for JetBrains Mono.
  Do not load more than three font files total.

### 7.3 Type scale (fluid)

| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| `h1` display (name) | `clamp(2.5rem, 6vw, 4rem)` | 600 | 1.05 | -0.02em |
| Hero lead (headline sentence) | `clamp(1.125rem, 2.2vw, 1.5rem)` | 400 | 1.45 | 0 |
| `h2` section | `clamp(1.5rem, 3vw, 2rem)` | 600 | 1.2 | -0.01em |
| `h3` card / entry title | `1.25rem` | 600 | 1.3 | 0 |
| Body | `1rem` (`1.0625rem` ≥1024px) | 400 | 1.6 | 0 |
| Metric number (mono) | `clamp(1.5rem, 3vw, 2.25rem)` | 500 | 1.1 | -0.01em |
| Meta / stack (mono) | `0.875rem` | 400 | 1.5 | 0 |
| Micro-label (mono, uppercase) | `0.75rem` | 500 | 1.4 | 0.1em |

Prose columns max **68ch**. The hero lead max **34ch–46ch** so it breaks into
two or three deliberate lines rather than one long ribbon.

### 7.4 Spacing rhythm

4px base unit. Permitted steps only: `4, 8, 12, 16, 24, 32, 48, 64, 96, 128`.
Section vertical padding: `96px` desktop / `64px` phone. Page container
`max-width: 72rem`; gutters `24px` phone, `32px` ≥768px, `48px` ≥1280px.
Card padding `24px` phone / `32px` desktop. Grid gap `24px`.

### 7.5 Colour tokens

Semantic tokens only — components must never hard-code a hex value. Note the
two distinct accent roles: `--accent` for graphic use (fills, rules, focus) and
`--accent-ink` for accent-coloured **text**, which must independently pass
contrast in each theme.

**Light values (the base — see §7.6 for why these live on bare `:root`):**

```
--bg:            #FFFFFF
--bg-elevated:   #F7F8FA
--surface:       #F2F4F7
--border:        #E3E7EC   /* hairline */
--border-strong: #C9D0D8
--text:          #14181D
--text-muted:    #55606D
--text-faint:    #7A8593
--accent:        #B26A00   /* graphic */
--accent-ink:    #8A5200   /* accent text on --bg */
--accent-contrast: #FFFFFF /* text on an accent fill */
--focus:         #B26A00
--code-bg:       #F2F4F7
```

**Dark values (the primary design):**

```
--bg:            #0B0E11
--bg-elevated:   #14181D
--surface:       #1B2027
--border:        #262C34   /* hairline */
--border-strong: #384150
--text:          #E8ECF1
--text-muted:    #9AA5B1
--text-faint:    #6B7683
--accent:        #F5A524   /* graphic */
--accent-ink:    #F7B84B   /* accent text on --bg */
--accent-contrast: #0B0E11 /* text on an accent fill */
--focus:         #F5A524
--code-bg:       #14181D
```

The accent is a **signal amber** rather than the teal/indigo that saturates
ML portfolios; it also reads as instrumentation, which suits the hardware half of
the positioning. Every token pair above must be verified against the contrast bar
in §9 — if a value fails, darken/lighten it and record the change; do not ship a
failing pair.

### 7.6 Theme mechanics — get this exactly right

Three states must work: system-light, system-dark, and an explicit visitor choice
that overrides the system in **both** directions.

1. Define the **complete** token set on bare `:root` using the **light** values.
2. Override under `@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { … } }`
   so an explicit light choice still wins.
3. Override again under `:root[data-theme="dark"] { … }` so the toggle wins in
   both directions.
4. **Never give any colour its only definition inside a media query or a
   `[data-theme]` block.**
5. `<body>` gets an explicit `background: var(--bg)` — never transparent.
6. Persist the visitor's choice in `localStorage`. A tiny **inline** script in
   `<head>`, before any paint, reads it and sets `data-theme` on
   `<html>` — no flash of the wrong theme on load.
7. The toggle is a real `<button>` with an accessible name and
   `aria-pressed` (or equivalent), reachable by keyboard, in the nav.
8. `<meta name="color-scheme" content="dark light">` so form controls and
   scrollbars follow.

### 7.7 Navigation and shared chrome

Every page has a `<nav>` (required by the invariants) containing: **Home**,
**Projects** (→ `/#projects`), **CV**, **Contact** (→ `mailto:`), plus the theme
toggle. A "Skip to content" link is the first focusable element. Focus styles:
`2px solid var(--focus)` with `2px` offset, visible in both themes — never
`outline: none` without a replacement.

---

## 8. Motion specification

The client asked for scroll motion with a "tech / futuristic" character, then
chose **(b) smooth staged fades and short directional slides**, at intensity
**(b) noticeable but never in the way**. Both are binding, and they resolve like
this: **the motion is calm and precise; the technical character comes from the
typography and layout of §7, not from the animation.** Precision — consistent
durations, consistent offsets, consistent stagger — is what will read as
engineered rather than generic.

**Explicitly NOT built** (these were considered and rejected): counting-up number
counters, a scroll-linked progress spine, parallax, pinned sections, scrubbed
timelines, text scrambles, background animation of any kind.

### 8.1 Tool

**GSAP 3 + ScrollTrigger.** Already familiar in this client's stack. Register
ScrollTrigger explicitly. Use `gsap.matchMedia()` for the reduced-motion split.

### 8.2 Parameters — apply consistently

- Duration **0.4–0.6 s** (use 0.5 s as the default).
- Offset **12–24 px** (16 px default), `y` only for content rising, `x` only
  where a directional slide is genuinely meaningful.
- Easing: crisp, not bouncy — `power2.out`. No `elastic`, no `back`, no bounce.
- Stagger between siblings **0.06–0.08 s**.
- `once: true` — fires on first entry only; **does not reverse on scroll-up**.
- ScrollTrigger `start: "top 85%"`.
- Animate **transform and opacity only**. No animation of width, height, top,
  left, margin, or anything else that triggers layout.

### 8.3 Inventory

- **Hero, on load:** staged fade + 16px rise of `h1`, lead, meta line, then the
  CTA row (stagger 0.06 s). The hero must be fully readable within ~0.6 s.
- **Section headings and body, on enter:** fade + 16px rise, 0.45 s.
- **Project cards, on enter:** fade + 20px rise, 0.5 s, stagger 0.08 s.
- **CV page:** fade only, no slide — it is a document.
- **Nothing else.**

### 8.4 Hard constraints

1. **No ambient background animation.** Standing preference on record. Motion is
   scroll- or load-triggered only.
2. **Motion must never gate content.** Do not author `opacity: 0` (or any hidden
   start state) in CSS — set from-states in JS so that with JavaScript disabled or
   broken, **every word is visible and every link works**. No long scroll journey
   before contact or the CV is reachable. There is a real tension between
   "futuristic scroll motion" and "30-second skim"; the skim wins every time.
3. **Honour `prefers-reduced-motion`.** Via `gsap.matchMedia()`, register
   animations only under `(prefers-reduced-motion: no-preference)`; under
   `reduce`, content sits in its final state with no transform animation.
   Also respect it in any CSS transitions.
4. **Performance:** transforms/opacity only, `will-change` used sparingly and
   removed after, smooth on a mid-range phone. Kill ScrollTriggers on navigation
   if any client-side routing is added (none planned).

---

## 9. Technical decisions

| Decision | Value |
|---|---|
| Stack | **Astro + TypeScript + Tailwind CSS + GSAP** (client chose this over Next.js/React) |
| Package manager | **pnpm** |
| Repo name | **`hadissuryaalamin.github.io`** (must be exactly this — it is what makes it a GitHub *user site* served at the root) |
| Repo owner / visibility | `hadissuryaalamin`, **public** (client confirmed) |
| On-disk build location | **`E:\comp8020\hadissuryaalamin.github.io`** |
| Later clone | The client may clone to `E:\personal-site\` for their own convenience — this imposes **no** build requirement |
| Live URL | `https://hadissuryaalamin.github.io/` |
| Astro `site` | `https://hadissuryaalamin.github.io` |
| Astro `base` | **`/`** — a user site is root-served. Do **not** set a repo-name sub-path; that is the course-repo convention and is wrong here. |
| Output | Fully static (`output: 'static'`), no adapter, no SSR |
| Hosting | GitHub Pages, deployed by GitHub Actions from `main` |
| Custom domain | None |
| Analytics | **GoatCounter** free tier — cookieless, no personal data, therefore **no cookie banner**. One small script tag, loaded `defer`, must not block rendering. **Account exists; site code is `hadissurya`, endpoint `https://hadissurya.goatcounter.com/count`.** *Phase 3.* |
| Browser support | Latest two versions of Chrome, Edge, Firefox, Safari; iOS Safari and Chrome Android |
| Viewports checked | **1920×1080** and **390×844**; layout must hold from **320px** wide upward |
| One-command check | A `pnpm check` script chaining typecheck → build → lint → tests, mirroring the client's existing habit |

### 9.1 Quality bar — client chose "(b) yes, plus more"

**Carried over from the course invariants** (`E:\comp8020\comp4020-ass1-hadissuryaalamin\spec\invariants.test.ts`
is the reference implementation; port it and run it against `dist/`):

- at least one page builds;
- every page declares `lang`;
- every page has a non-empty `<title>`;
- every page has a `meta[name="viewport"]`;
- every page has a `<nav>`;
- every page has **exactly one** `<h1>`;
- every `<img>` has an `alt` attribute;
- `index.html` exists;
- all internal links resolve (link check over `dist/`).

**Added on top:**

- **Automated accessibility scan** — axe (e.g. `@axe-core/playwright`) across
  every page, in **both** themes: **zero serious or critical violations**.
- **Contrast check** — all text meets **WCAG AA**: ≥ 4.5:1 for normal text,
  ≥ 3:1 for large text and for meaningful non-text elements, **in both themes**.
- Keyboard operability: every interactive element reachable and visibly focused;
  logical tab order; skip link works.
- Semantic landmarks: `header`, `nav`, `main`, `footer`; headings in order with
  no level skipped.
- No content conveyed by colour alone.

### 9.2 Performance / weight budget

- Portrait image **under ~60 KB** (§11).
- No render-blocking third-party requests. Fonts self-hosted and preloaded.
- Explicit `width`/`height` (or aspect-ratio) on every image — **zero unexpected
  layout shift**.
- Total transferred weight for the home page **under ~500 KB** including fonts
  and image.
- GSAP imported so only what's used ships (core + ScrollTrigger).

---

## 10. The CV download mechanism

The client's requirement: **"the visitor can generate the CV themselves, and the
generated CV must not contain the phone number. The version with the phone number
is the one I send manually."** The phone number therefore never enters this
project at all.

**Implementation:**

1. The `/cv/` page holds the complete CV as HTML (§5.3) — everything except the
   phone number.
2. A **`@media print`** stylesheet turns that page into a clean document:
   - **Forces light rendering — black text on white — regardless of the active
     theme.** Override the dark tokens *inside* `@media print`; never rely on the
     visitor happening to be in light mode. A dark page printed as-is produces
     white-on-black, wastes ink, and in browsers that drop backgrounds can render
     text invisible.
   - Hides site chrome: nav, theme toggle, the download button itself, footer,
     any decorative rules that don't help on paper.
   - **Hides the portrait** (client decision: photo on the website, not on the
     CV — photos on CVs are not standard practice in Australia or Singapore and
     can count against a candidate in screening).
   - Sets sensible page margins (~15–18mm), a print-appropriate type size
     (10.5–11pt body), and `break-inside: avoid` on each experience/education
     entry so no entry splits across pages.
   - Shows the URL of links where useful, or at minimum keeps link text
     self-explanatory.
3. A **"Download CV (PDF)"** button calling **`window.print()`**. The visitor's
   browser then produces the PDF via its native "Save as PDF" target.

**Honest limitation, recorded deliberately:** the visitor gets a
*browser-generated* PDF, so the exact typography and pagination are the browser's,
not a designed document's. That trade-off is accepted: the client made contact
primary and the CV secondary, this needs no dependencies and cannot silently
break, and `Ctrl+P` works even if the button doesn't. Do **not** replace this with
a JS PDF library (jsPDF/html2pdf) — it adds weight, drifts from the on-screen
layout, and was considered and rejected.

**Acceptance criterion (hard):** the phone number appears **nowhere** — not in
the repository, not in `dist/`, not in the printed output. See §12 for how this
is tested without ever writing the number down.

---

## 11. The portrait image

- **Source:** `E:\comp8020\misc_files\potrait.jpg` — 2048×2048, square, 174 KB
  JPEG. A genuine photograph: head-and-shoulders/upper-body, outdoors in an
  alpine landscape (misty ridgeline, tussock grass, granite boulders), dark navy
  puffer jacket with a backpack strap, face clear and centred, looking at camera,
  neutral-friendly expression, good natural light. Reads outdoorsy and
  approachable rather than corporate — appropriate as chosen.
- **Do not use** `E:\comp8020\misc_files\avatar.png` (a stylised cartoon
  portrait). It is superseded.
- **Crop tighter.** In the full square the face occupies roughly the middle
  third; at a ~250–320px display size the face would be too small to register.
  Produce a tighter head-and-shoulders crop as a build step (committed asset
  preferred over runtime cropping).
- **Face sits slightly above centre** — a naive centre crop or default
  `object-position: center` will cut awkwardly. Pre-crop the asset, or set
  `object-position` biased toward the upper portion.
- **Bright sky vs dark theme:** the background is a near-white misty sky. A
  near-white square on a `#0B0E11` page glares and fights the quiet typographic
  direction. Mitigate deliberately: the tighter crop reduces the sky area; use a
  circular or rounded-square mask (the source is square, so both work cleanly);
  add a subtle 1px `--border` ring so the image reads as a deliberate element
  rather than a bright hole.
- **Optimise:** resize to about **640px** on the long edge (2× a ~320px display),
  serve **WebP or AVIF with a JPEG fallback** (Astro's image pipeline is fine),
  explicit `width`/`height` to prevent layout shift, `loading="eager"` +
  `fetchpriority="high"` if above the fold (it is, in the hero), otherwise lazy.
  **Target under ~60 KB.**
- **Alt text is mandatory** and must describe it honestly, e.g.
  `alt="Hadis Surya Al Amin, photographed outdoors in an alpine landscape"`.
  Do not use `alt=""` — this image carries meaning on a personal site.
- **Hidden in print** (§10).

---

## 12. Acceptance criteria

A testing agent should be able to turn each line into an assertion.

**Build and deploy**
1. `pnpm build` emits a complete static site into `dist/` with zero errors.
2. `pnpm check` (typecheck → build → lint → tests) passes clean.
3. The site is live at `https://hadissuryaalamin.github.io/` and returns 200.
4. No asset 404s on the live URL (base path is `/`, not a sub-path).
5. The repository is public and CI deploys from `main`.

**Invariants (every built page, including `/404`)**
6. `<html lang>` present and non-empty.
7. `<title>` present and non-empty, and distinct per page.
8. `meta[name="viewport"]` present.
9. A `<nav>` element present.
10. Exactly one `<h1>`.
11. Every `<img>` has an `alt` attribute.
12. `index.html` exists at the root of `dist/`.
13. Every internal link resolves (link check over `dist/`, zero broken).

**Content**
14. The §3 headline sentence appears on the home page **verbatim**.
15. `hadisssurya@gmail.com` appears on the home page as a `mailto:` link **and**
    as visible copyable text, and appears on the CV page.
16. The primary "Email me" CTA is present in the hero and is the
    highest-emphasis interactive element there.
17. A "View CV" link resolves to `/cv/`.
18. All five featured projects appear on the home page, in the order of §6.1,
    each with a metric strip and a link to its detail page.
19. Five project detail pages exist at the §5.2 slugs, each with metrics, a
    repository link, and prose in first person.
20. DishPatch's detail page links to pull requests **#33** and **#41** and names
    ROS2, nav2, AWS EC2, separate Docker containers, and DDS.
21. The DLSA detail page states the negative result about the GNN extension.
22. **No Sharpe ratio appears in IDX-alpha's card summary, detail-page hero, or
    metric strip.** IDX-alpha is visibly labelled work-in-progress on both the
    card and the detail page. If a Sharpe figure appears in body prose at all, it
    is the after-costs **3.12 @ 25 bps** with its cost assumption stated and at
    least one README caveat attached; **3.62 never appears alone.**
22b. The `gpt2-rocstories-finetuning` detail page credits `karpathy/nanoGPT` as
    the base, and links the repo under its **new** name, not `nanoGPT`.
23. Every external project link returns 200 (no private-repo 404s).
24. **No COMP4020 web-development prototype is mentioned or linked anywhere.**
25. No company name from the tailored-CV set (Aumovio, Infineon, Tetra Pak,
    Acronis, ThunderSoft, Chubb, WeComms) appears anywhere on the site.
26. The personal agent, where listed, is described as **English**, never Bahasa
    Indonesia.

**Privacy**
27. **The phone number appears nowhere in the repository, in `dist/`, or in the
    printed output.** Test it without recording the number: scan all tracked
    files plus `dist/` for any match of an Australian mobile pattern
    (`/(?:\+?61|0)[\s-]?4\d{2}[\s-]?\d{3}[\s-]?\d{3}/`) and for any run of 9 or
    more consecutive digits outside known-safe contexts (hashes, lockfiles) —
    expect **zero** matches.
28. No street address or postcode anywhere; location strings read "Canberra,
    Australia".
29. No cover-letter content anywhere.

**CV / print**
30. `/cv/` contains Summary, Experience, Education, Skills, Achievements, and a
    brief Projects list, populated from §4/§6.
31. A "Download CV (PDF)" button exists and calls `window.print()`.
32. **Printing `/cv/` while the dark theme is active produces a black-on-white
    document** (assert print-media computed styles: light background, dark text).
33. The portrait is **not** rendered in print media.
34. Site nav, footer, theme toggle and the download button are hidden in print.
35. No experience or education entry splits across a page break.

**Theme**
36. With no stored preference and the OS set to dark, the site renders dark.
37. With no stored preference and the OS set to light, the site renders light.
38. The toggle overrides the system preference in **both** directions and the
    choice survives a reload.
39. No flash of the wrong theme on load.
40. Every colour token is defined on bare `:root`; none is defined *only* inside
    a media query or `[data-theme]` block.

**Motion**
41. With JavaScript disabled, all text and links on every page are visible and
    usable (nothing starts hidden in CSS).
42. With `prefers-reduced-motion: reduce`, no transform/opacity entrance
    animations run and all content is in its final state.
43. No animation runs without a scroll or load trigger — there is no ambient
    background animation.
44. Animations do not reverse on scroll-up (`once: true`).

**Accessibility and quality**
45. axe reports **zero serious or critical violations** on every page, in both
    themes.
46. All text meets WCAG AA contrast (≥4.5:1 normal, ≥3:1 large) in both themes.
47. Every interactive element is keyboard reachable with a visible focus
    indicator; the skip link works.
48. Landmarks `header`/`nav`/`main`/`footer` present; heading levels never skip.

**Performance / layout**
49. Portrait asset under ~60 KB; home page total transfer under ~500 KB.
50. Every image has explicit dimensions; no unexpected layout shift.
51. Layout holds with no horizontal scrolling at 320px, 390×844, 768px, 1280px
    and 1920×1080.

---

## 13. Phasing

Client answer: *build toward (b), treat (a) as the point the link becomes
shareable* — so the site must never be in a half-finished state a recruiter
couldn't be sent to.

**Phase 1 — the shareable milestone (this is the gate that matters)**
Repo created (`hadissuryaalamin.github.io`, public); Astro + TypeScript +
Tailwind + GSAP set up with `base: '/'`; CI build + Pages deploy working; design
tokens and typography in place; **home page complete** (hero with headline,
portrait, primary email CTA, about, five project cards linking to their GitHub
repos, contact, footer); **`/cv/` complete with the print stylesheet**; theme
toggle; nav and 404; entrance motion; invariants and link check green; live at
the URL.
➜ **At the end of Phase 1 the link is shareable with a recruiter.** Do not start
Phase 2 until it is.

**Phase 2 — substance**
The five project detail pages; home cards re-pointed to the detail pages; repo
and PR links moved onto the detail pages; prev/next navigation.

**Phase 3 — completion**
"Other work" list; axe + contrast automation wired into `pnpm check`;
GoatCounter; performance/weight budget verified; Open Graph metadata, sitemap,
`robots.txt`, favicon.

**Timing:** target **this week**, but the client's answer was explicitly
"quality is the gate, not a date" — do **not** ship something they wouldn't send
an employer in order to hit the week. There is no external application deadline
driving this. Avoid colliding with the client's course commitments: the
"An instrument" crit on **2026-08-26** and Assignment 2 on **2026-09-21**.

---

## 14. Decomposition hint — mapping onto the standard field breakdown

Per `E:\comp8020\CLAUDE.md`. One task file per applicable field; disjoint file
ownership so tasks can run concurrently where marked.

| # | Field | Owns | Notes |
|---|---|---|---|
| 001 | **Content & IA** | `src/content/**` or `src/data/projects.ts`, page copy, `<head>` metadata, alt text, sitemap/robots | Drafts all copy from §4/§6. Blocks the client-approval gate (§15). |
| 002 | **Visual design & layout** | `src/styles/**`, `src/layouts/**`, `src/components/**` | Tokens, typography, Tailwind theme, responsive layout, print stylesheet. Imports `ThemeInit` from 004. Use the `frontend-design` skill. |
| 003 | **Motion & interaction** | `src/scripts/motion.ts` | GSAP + ScrollTrigger entrance animations, `matchMedia` reduced-motion split. Use the `gsap-core`, `gsap-scrolltrigger`, `gsap-performance` skills. |
| 004 | **Core functionality/logic** | `astro.config.*`, `src/scripts/theme.ts`, `src/components/ThemeInit.astro`, `public/**`, image pipeline, GoatCounter include | Theme persistence + no-flash inline script, `window.print()` wiring, portrait optimisation. |
| 005 | **Testing & spec compliance** | `spec/**`, `tests/**`, `.github/workflows/**`, `package.json` check script | Port the invariants; add axe/contrast/print/JS-off/reduced-motion/phone-scan tests. Use the `webapp-testing` skill. |

- **Data visualization: NOT APPLICABLE this week.** The metric strips are typeset
  numbers, not charts. Do not add charts.
- **Dependencies:** 002 imports the `ThemeInit` component from 004 — either land
  004's theme files first, or have 002 stub the import and 004 fill it. 003 and
  004 both touch `src/scripts/` but own **different files**; keep it that way.
  001 and 002 can run concurrently (copy vs styling) provided 001 owns text and
  002 owns markup structure — if that proves impossible, sequence 001 → 002.
  005 can be written against this document before the pages exist.
- Each sub-agent flips its task `status` and logs to
  `.claude/epics/personal-site/updates/<task-number>.md`.
- Run `pnpm check` after integration, before calling the fan-out done.

---

## 15. Pre-launch checklist — tasks only the client can do

These are **not** build tasks. Surface them to the client and track them; the
launch is not complete until they're done.

1. **Approve all copy.** Every factual claim on the site must be read and
   approved by the client before launch. **Hard gate — do not publish
   unapproved claims about his own work.** (Client chose "you draft, I read it
   through and correct anything wrong".)
2. ~~**Create the GoatCounter account**~~ — **DONE 2026-08-17.** Site code is
   **`hadissurya`**; endpoint `https://hadissurya.goatcounter.com/count`. Wire
   this exact code into the analytics snippet (Phase 3).
3. ~~**Update three GitHub repository descriptions**~~ — **DONE 2026-08-17.** All
   three landed. Also renamed `nanoGPT` → **`gpt2-rocstories-finetuning`**; link
   the new name everywhere. Its README was rewritten to credit `karpathy/nanoGPT`
   and lead with the actual contribution (PR #1 — merge pending).
4. ~~**Scan the two formerly-private repos for committed secrets.**~~ — **DONE
   2026-08-17, both CLEAN.** Full history scanned (44 commits in
   `gpt2-rocstories-finetuning`, 50 in `personal-agent`, across all refs) for
   OpenAI/HuggingFace/AWS/GitHub/Google/Slack key formats, private keys, and
   hardcoded credential assignments, plus any `.env`/`.pem`/`.key`/`id_rsa` file
   ever added. No findings; the only hit was `personal-agent/.env.example`, a
   valueless template. Nothing to rotate.
5. Confirm the featured-project repos remain public at launch (acceptance
   criterion 23 depends on it).

---

## 16. Open decisions delegated to build agents

The client answered these with "use your judgment". Each is genuinely open — but
only within the stated constraints, which are **not** open.

1. **Exact wording of all prose** (about, project write-ups, CV summary).
   *Constraints:* first person, plain, factual, no adjective inflation, no
   emoji; every claim traceable to §4/§6 or a repo README; no invented numbers;
   client approval before launch.
2. **Exact typeface pairing.** Inter + JetBrains Mono is specified; a substitute
   is allowed only if self-hosted, similarly neutral, with true tabular figures,
   and no more than three font files total.
3. **Final accent hue.** Signal amber is specified. Any change must keep a single
   restrained accent, pass AA contrast in both themes for both accent roles, and
   avoid the teal/indigo default look.
4. **Card layout details** (grid vs list at each breakpoint, whether DishPatch
   spans two columns). *Constraint:* all five featured projects visible without
   interaction; no carousel, no "load more", no filters.
5. **Astro `build.format`** (`directory` vs `file`) and trailing-slash policy.
   *Constraint:* internal links must all resolve in `dist/` and on the live URL;
   pick one and be consistent.
6. **Favicon and Open Graph image.** *Constraints:* no emoji-as-brand; a simple
   monogram or the cropped portrait is fine; OG image must not embed the phone
   number or a company name; provide `apple-touch-icon`.
7. **Whether "other work" items get a shared page or live in a home-page
   section.** *Constraint:* one line each, no detail pages, links only, Phase 3.
8. **Whether the CV page duplicates project prose or links to the detail pages.**
   *Constraint:* one line per project on the CV, linking out — do not duplicate
   paragraphs and risk them diverging.
9. **Lint/test tool choices** beyond what's named. *Constraint:* one `pnpm check`
   entry point; the §12 criteria must all be actually asserted, not assumed.
10. **How the metric strip renders on a 320px screen.** *Constraint:* numbers stay
    aligned and legible; no horizontal scrolling.

Anything **not** listed here and **not** answered in this document should be
resolved by re-reading §1–§3 and choosing what best serves a recruiter with
30 seconds who might email him — then writing the decision into the task's
update log.
