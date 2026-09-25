// The one place a project is described on this site.
//
// PORTFOLIO.md is the canonical long-form description; this file is its
// structured mirror. The résumé page, the homepage graph, and the JSON feed the
// Google Doc résumé syncs from (/resume-projects.json) all read from here, so a
// project changes in one place and every surface follows.
//
// scripts/check-projects.mjs runs after every build and fails it when this file
// and PORTFOLIO.md disagree on which projects exist, which section each sits
// in, or its status — so the deploy cannot ship a drifted résumé.

export type AreaId = "vision" | "genomics" | "ai" | "education" | "apps";

export type Area = {
  id: AreaId;
  label: string;
  /** The `## ` heading this area mirrors in PORTFOLIO.md, verbatim. */
  portfolioSection: string;
};

/** In PORTFOLIO.md order. */
export const AREAS: Area[] = [
  { id: "vision", label: "Perceptual & Imaging Phenotyping", portfolioSection: "Research — perceptual & imaging phenotyping" },
  { id: "genomics", label: "Genomics & Stability", portfolioSection: "Research — manifold stability & genomics" },
  { id: "ai", label: "AI Systems & Agents", portfolioSection: "AI systems & agent architecture" },
  { id: "education", label: "Education & Knowledge Systems", portfolioSection: "Education & knowledge systems" },
  { id: "apps", label: "Applications & Production Systems", portfolioSection: "Applications & production systems" },
];

export type Project = {
  /** Matches the first word of the `### ` heading in PORTFOLIO.md. */
  id: string;
  name: string;
  area: AreaId;
  /**
   * The status exactly as PORTFOLIO.md's `**Status:**` line gives it, up to the
   * first " · ". Always begins with Shipped, Results committed, Implemented or
   * Designed. Absent only where PORTFOLIO.md gives none.
   */
  status?: string;
  date?: string;
  /** Shared by the résumé card, the graph panel lead, and the Google Doc. */
  summary: string;
  /** Included in the Google Doc résumé. The site résumé always shows everything. */
  featured?: boolean;
  /** Write-ups and public destinations only — never a private repository. */
  link?: string;
  linkLabel?: string;
};

export const PROJECTS: Project[] = [
  // ---- Perceptual & imaging phenotyping ----
  {
    id: "iridis", name: "iridis", area: "vision", status: "Results committed", date: "2023–2025", featured: true,
    link: "/projects/iridis/", linkLabel: "Read the write-up →",
    summary:
      "Perceptual skin-tone phenotyping over ~17.8K open dermatology images (Fitzpatrick17k, ISIC 2018). A layered masking pipeline — foreground segmentation plus a ResNet18-U-Net lesion mask (held-out Dice 0.889) — isolates skin before CIE Lab featurization and CIEDE2000 perceptual clustering. Discovered clusters proved 2.5–2.8× more predictable than clinical Fitzpatrick labels from identical features; masking did not close the gap — a negative finding reported as-is.",
  },
  {
    id: "lambent", name: "lambent", area: "vision", status: "Results committed", date: "2023–", featured: true,
    link: "/projects/lambent/", linkLabel: "Read the write-up →",
    summary:
      "Computational quantification of skin radiance from multi-region image features, developed independently on public data. Re-validated on 1,816 public dermatology images by dose-response perturbation, which showed the original score could not separate gloss from brightening and was confounded by capture conditions. Rebuilt through seven measured variants into a capture-robust, tone-neutral metric: tone dependence ρ² 0.310 → 0.002, worst-case capture sensitivity 93% → 59%.",
  },
  {
    id: "argus", name: "argus", area: "vision", status: "Results committed", date: "2026–",
    summary:
      "Anomaly detection for Cell Painting on Recursion's public RxRx3-core: a UV-channel autoencoder and an Isolation Forest over OpenPhenom embeddings, fused by rank, tested under a protocol fixed in advance on PLK1 and MTOR knockouts held out by experiment. The dual-branch design failed its test: the autoencoder ranked knockouts as less anomalous than controls (AUC 0.32), fusion fell to 0.53, and the embedding branch (0.71) only tied a nuclei count.",
  },
  {
    id: "oncos", name: "oncos", area: "vision", status: "Implemented, in progress", date: "2026–", featured: true,
    summary:
      "Work in progress: 3D deep learning for overall-survival prediction in non-small cell lung cancer from pre-treatment CT, on public imaging data, evaluated against classical survival baselines under a protocol fixed before any model was scored.",
  },

  // ---- Genomics & stability ----
  {
    id: "topos", name: "topos", area: "genomics", status: "Designed (protocol)", date: "2025–", featured: true,
    link: "/projects/topos/", linkLabel: "Read the write-up →",
    summary:
      "A stability-certification protocol for deciding when latent structure in high-dimensional biological data is real enough to act on: eight gating stages ending in an explicit GO/KILL/HOLD verdict, matched-model comparison, density-appropriate validation, and mandatory confound auditing. Specified for soybean, sorghum and octoploid strawberry; Stage 0 has been executed on strawberry.",
  },
  {
    id: "fragaria", name: "fragaria", area: "genomics", status: "Results committed (Stage 0)", date: "2026–", featured: true,
    summary:
      "Nonlinear haplotype topology in octoploid strawberry: does manifold learning recover stable haplogroup structure beyond PCA, despite dosage ambiguity and subgenome uncertainty? The only topos case study with executed analysis — consensus co-occurrence, stability dashboards, embedding analysis and a decision-rubric scorecard are committed.",
  },
  {
    id: "glyma", name: "glyma", area: "genomics", status: "Designed (Stage 0)", date: "2026–",
    summary:
      "A topos case study testing whether nonlinear manifold learning reveals stable soybean haplogroup substructure beyond PCA on SoySNP50K, with conditional escalation into phenotype, transcriptomic and geo-climatic validation. Protocols complete; analysis not yet run.",
  },
  {
    id: "sorghum", name: "sorghum", area: "genomics", status: "Designed (Stage 0–1)", date: "2021–",
    summary:
      "Reproducible detection of transposable element insertion-site polymorphisms in Sorghum bicolor: can insertion sites be called reproducibly under perturbation of coverage, filtering and annotation scope before any interpretation is attempted? Go/kill criteria gate escalation; the pilot has not yet run.",
  },
  {
    id: "repbox", name: "repbox", area: "genomics", status: "Shipped", date: "2020–2023", featured: true,
    link: "https://doi.org/10.1186/s12859-023-05419-5", linkLabel: "View publication ↗",
    summary:
      "Python-first CLI for discovering and classifying novel repetitive genomic elements, evolved from dissertation work into an adapter-based v2.0.0 with semantic versioning and smoke-test diagnostics. Demonstrated 7% growth in detected elements across the A. sativa genome. Published in BMC Bioinformatics (2023).",
  },
  {
    id: "indicium", name: "indicium", area: "genomics", status: "Designed (Stage 0 complete)", date: "2026–",
    summary:
      "Graded evidence for precision medicine in one knowledge graph: pharmacogenomics checked against CPIC guidelines, a cancer-variant evidence agent evaluated against CIViC, and hypotheses over the combined graph evaluated with a temporal holdout — extending coverage to the transposable element insertions existing knowledge bases under-represent. A Stage 0 audit of data access, licences and prior work is complete: three arms proceed and one hypothesis, found largely published, is being reframed as a replication. No analysis has run.",
  },

  // ---- AI systems & agents ----
  {
    id: "veridian", name: "veridian", area: "ai", status: "Implemented, under rework", date: "2025", featured: true,
    link: "/projects/veridian/", linkLabel: "Read the write-up →",
    summary:
      "A literature review tool with two modes over one frozen corpus: Explore maps a field and where it disagrees; Check grounds a claim against the papers, citing the sentences behind the verdict. After an audit found the original grounding answered “supported” to every claim, the rebuilt Check reached 86% verdict accuracy on 21 held-out claims written before any fix (95% interval 65–95%), against 48% for the original rule.",
  },
  {
    id: "recolo", name: "recolo", area: "ai", status: "Results committed", date: "2026–", featured: true,
    link: "/projects/recolo/", linkLabel: "Read the write-up →",
    summary:
      "Bio-inspired memory for LLM agents: episodic and semantic stores over SQLite, exponential decay computed at retrieval, salience scored independently of age, and a consolidation loop that promotes cluster centroids and accelerates decay on what they already represent rather than deleting it. Evaluated on LongMemEval under a protocol committed before scoring: as shipped it scored 0.32 against 0.73 for plain retrieval over the same memories, and ablations trace the loss to decay on a fixed clock. Reported as-is.",
  },
  {
    id: "noul", name: "noul", area: "ai", status: "Results committed (`find` only)", date: "2026–", featured: true,
    summary:
      "Local, non-generative code search: BM25 and a small embedding model shortlist candidates and a cross-encoder reranks only those — typed scores in a single pass instead of an agent reading files, with nothing leaving the machine. On 35 hand-labelled queries across two codebases, the right file is in the top three for 33 (BM25 alone: 28) at a tenth of brute-force cost; at top-1 it does not yet beat keyword search.",
  },
  {
    id: "legere", name: "legere", area: "ai", status: "Designed (scaffold)", date: "2026–",
    summary:
      "Architecture for on-premises handwriting extraction from mixed-content forms: template-based field segmentation, a benchmarking matrix that tests every model against every field type before routing, vision-language arbitration across predictions, and a human review queue with per-field provenance. The repository is the scaffold for that design; model adapters are interface stubs.",
  },

  // ---- Education & knowledge systems ----
  {
    id: "scintilla", name: "scintilla", area: "education", status: "Implemented", date: "2026–", featured: true,
    summary:
      "A free, local-first lesson player for data science, ML and AI that checks understanding throughout every lesson: 5–10 minute lessons with bridges to what came before, frequent checkpoints, a hands-on item such as Python run in the browser, a Feynman self-check that routes to the missing prerequisite, and FSRS-scheduled review. Nothing is generated live, so learners need no account and no key. The player runs end to end on lumen's catalog, offline-capable and accessibility-tested; the first reviewed lesson is live in a private deployment.",
  },
  {
    id: "lumen", name: "lumen", area: "education", status: "Implemented", date: "2026–",
    summary:
      "The authoring pipeline behind scintilla: retrieves openly licensed sources, generates with a pinned Claude model, verifies every claim against its source with veridian's Check engine, and publishes a versioned, validated catalog after human review. The build enforces the learner-facing rules — bridges, pinned sources, verified answer keys, named misconceptions. The pipeline runs: its first lesson passed validation on the first draft, with every principle supported by its source, and after review shipped as catalog release v0.1.0.",
  },
  {
    id: "catasta", name: "catasta", area: "education", status: "Designed (reference pattern)", date: "2026–",
    summary:
      "A documented pattern for turning a research pipeline into an interactive demo without shipping the science to the browser: a Python backend where the pipeline stays server-side, a TypeScript frontend, and one preprocess → predict → postprocess contract shared by embedded and standalone deployments.",
  },
  {
    id: "bibliotheca", name: "bibliotheca", area: "education", status: "Shipped", date: "2025–",
    link: "https://github.com/sheljustdoes/bibliotheca", linkLabel: "View repository ↗",
    summary:
      "A public reading index driven entirely by filenames: an ISBN-13-named file pushed to a status folder triggers a GitHub Action that resolves metadata through the Google Books API and publishes it. Moving a file between folders updates reading status and completion date.",
  },
  {
    id: "bibliotheca-archive", name: "bibliotheca-archive", area: "education", status: "Shipped", date: "2026–",
    summary:
      "The automation behind the bibliotheca shelf: an ISBN-named file in a status folder fires an Action that resolves the work through the Google Books API and writes its metadata to the public shelf, with Git LFS for binaries. The filesystem is the interface — no form, database or admin UI.",
  },
  {
    id: "custos", name: "custos", area: "education", status: "Shipped", date: "2026–",
    summary:
      "Cross-portfolio tooling. Its rotation report ranks every project by its last commit that touched more than markdown, so documentation activity cannot disguise a stalled project, and pairs each with its next backlog item. The same script runs locally and as a weekly Action over treeless clones.",
  },

  // ---- Applications & production systems ----
  {
    id: "menhir", name: "menhir", area: "apps", status: "Shipped", date: "2026–", featured: true,
    link: "/projects/menhir/", linkLabel: "Read the write-up →",
    summary:
      "A dual-role athlete and coach training platform, built and maintained solo. A multi-provider LLM pipeline generates programs on top of 14 deterministic methodology engines and an RPE calibration engine, and every generated program is validated and previewed before it can be committed. OAuth with role-aware access, tiered billing, Web Push, and an offline-capable PWA. ~106K LOC, 25 test modules.",
  },
  {
    id: "audire", name: "audire", area: "apps", status: "Shipped", date: "2026–",
    summary:
      "A self-hosted audio library platform packaged as a Home Assistant add-on: FastAPI across 21 routers, a SvelteKit client, a native macOS launcher and a background queue worker behind Caddy, with ReplayGain normalization and MusicBrainz enrichment. Failure handling is deliberate — randomized pacing, one delayed retry that resumes only what is missing, no retry for permanent failures. Duplicate detection matches on tags and duration rather than hashes, because separate encodes of one recording never hash alike. 21K LOC, 37 test modules.",
  },
  {
    id: "ponere", name: "ponere", area: "apps", status: "Shipped", date: "2025–",
    summary:
      "A single-user tool for taking a rough idea to a published post: a capture → draft → live → dormant lifecycle so nothing sits untouched, platform-specific drafting, and a log of what shipped where. Claude-assisted drafting is grounded in stored voice and platform notes — always a suggestion, never auto-published.",
  },
  {
    id: "mara", name: "mara", area: "apps", status: "Shipped", date: "2026–", featured: true,
    summary:
      "A multi-tenant pricing API for the moving industry: local hourly, interstate tariff and military 400NG pricing behind one survey endpoint that estimates weight from job-site photos, routes the move, recommends a crew and returns priced line items. Per-tenant rate configuration, hashed scoped API keys, distance resolution that falls back to free routing, and self-refreshing fuel and tariff data. In production as a client platform's pricing service. 10 test modules.",
  },
  {
    id: "additional", name: "Additional services", area: "apps",
    summary:
      "Smaller production services, described by their engineering: an events-business backend with Stripe payments and Google OAuth; a private health-tracking application with signed-session gating on every route; a payment-plan portal with Stripe invoicing, magic-link login and verified webhooks; a moving company's operations platform, from quote to completed job, priced by mara; and a no-build marketing site.",
  },
];

export const PROJECT_BY_ID: Record<string, Project> = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));

export const projectsInArea = (area: AreaId) => PROJECTS.filter((p) => p.area === area);

/** Status for display: PORTFOLIO.md's inline-code backticks dropped. */
export const displayStatus = (status: string) => status.replace(/`/g, "");
