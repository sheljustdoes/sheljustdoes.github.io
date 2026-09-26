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

export type AreaId = "phenotyping" | "structure" | "cognition" | "production" | "learning" | "tooling";

export type Area = {
  id: AreaId;
  label: string;
  /** The `## ` heading this area mirrors in PORTFOLIO.md, verbatim. */
  portfolioSection: string;
  /**
   * A product line leads with a flagship; supporting areas show how the work
   * gets built. The résumé page leads with the lines and folds the rest.
   */
  kind: "line" | "supporting";
  /** Product lines only: one sentence on what the line is for. */
  thesis?: string;
  /** Product lines only: the project that leads it. Listed first, with a write-up. */
  flagship?: string;
};

/** In PORTFOLIO.md order. */
export const AREAS: Area[] = [
  {
    id: "phenotyping", label: "Perceptual & Imaging Phenotyping", portfolioSection: "Perceptual & imaging phenotyping",
    kind: "line", flagship: "iridis",
    thesis: "Measurement science for visible traits that have no ground truth, each tested against a fixed baseline rather than on its own terms.",
  },
  {
    id: "structure", label: "Certified Structure in Biological Data", portfolioSection: "Certified structure in biological data",
    kind: "line", flagship: "topos",
    thesis: "Deciding when latent structure in high-dimensional biological data is real enough to act on, through gates that end in GO, KILL or HOLD.",
  },
  {
    id: "cognition", label: "Research Cognition", portfolioSection: "Research cognition",
    kind: "line", flagship: "veridian",
    thesis: "Tools that help a researcher check what they read and keep what they learn, measured against a plain baseline on held-out data.",
  },
  { id: "production", label: "Production Systems", portfolioSection: "Supporting — production systems", kind: "supporting" },
  { id: "learning", label: "Learning & Knowledge Tools", portfolioSection: "Supporting — learning & knowledge tools", kind: "supporting" },
  { id: "tooling", label: "Tooling & Designs", portfolioSection: "Supporting — tooling & designs", kind: "supporting" },
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
    id: "iridis", name: "iridis", area: "phenotyping", status: "Results committed", date: "2023–2025", featured: true,
    link: "/projects/iridis/", linkLabel: "Read the write-up →",
    summary:
      "Perceptual skin-tone phenotyping over ~17.8K open dermatology images (Fitzpatrick17k, ISIC 2018). A layered masking pipeline — foreground segmentation plus a ResNet18-U-Net lesion mask (held-out Dice 0.889) — isolates skin before CIE Lab featurization and CIEDE2000 perceptual clustering. Measured colour barely tracks Fitzpatrick type: type explains 7% of lightness variance, and predicting it from colour barely beats guessing the commonest type (35–42% against 34%); masking did not help. An earlier claim that discovered clusters were 2.5–2.8× more predictable was withdrawn as largely circular.",
  },
  {
    id: "lambent", name: "lambent", area: "phenotyping", status: "Results committed", date: "2023–", featured: true,
    link: "/projects/lambent/", linkLabel: "Read the write-up →",
    summary:
      "Computational quantification of skin radiance from multi-region image features, developed independently on public data. Re-validated on 1,816 public dermatology images by dose-response perturbation, which showed the original score could not separate gloss from brightening and was confounded by capture conditions. Rebuilt through seven measured variants into a capture-robust, tone-neutral metric: tone dependence ρ² 0.310 → 0.002, worst-case capture sensitivity 93% → 59%.",
  },
  {
    id: "argus", name: "argus", area: "phenotyping", status: "Results committed", date: "2026–",
    link: "/projects/argus/", linkLabel: "Read the write-up →",
    summary:
      "Anomaly detection for Cell Painting on Recursion's public RxRx3-core, tested in three pre-registered runs against a baseline that only counts cells. The dual-branch design failed: the UV autoencoder ranked knockouts as less anomalous than controls (AUC 0.32, replicated on fresh experiments), and the embeddings only tied the cell count. Scoring nuclear pixels alone removed the inversion and left no signal; regressing out cell count did not remove its influence. A third run compared each knockout only with controls of the same cell count: there the embeddings still separated them (AUC 0.69, against 0.52 for the count), so they see more than a cell count, though the subtler MTOR signal weakens under a stricter post-hoc match.",
  },
  {
    id: "oncos", name: "oncos", area: "phenotyping", status: "Implemented, in progress", date: "2026–", featured: true,
    summary:
      "Work in progress: 3D deep learning for overall-survival prediction in non-small cell lung cancer from pre-treatment CT, on public imaging data, evaluated against classical survival baselines under a protocol fixed before any model was scored.",
  },

  // ---- Certified structure in biological data ----
  {
    id: "topos", name: "topos", area: "structure", status: "Implemented (Stage 0 checks)", date: "2025–", featured: true,
    link: "/projects/topos/", linkLabel: "Read the write-up →",
    summary:
      "A stability-certification protocol for deciding when latent structure in high-dimensional biological data is real enough to act on: eight gating stages ending in an explicit GO/KILL/HOLD verdict. Stage 0 is a tested Python package whose every module enforces a rule learned on real data — declared missing-value codes, stability from resampling rather than seeds, untestable confounds blocking a GO, kinship-based relatedness control, deduplicated grids, and non-redundancy measured on rows both pipelines cluster. fragaria's scored Stage 0 runs on it and reproduces its results exactly.",
  },
  {
    id: "fragaria", name: "fragaria", area: "structure", status: "Results committed (Stage 0)", date: "2026–", featured: true,
    link: "/projects/fragaria/", linkLabel: "Read the write-up →",
    summary:
      "Nonlinear haplotype topology in octoploid strawberry: does manifold learning recover stable haplogroup structure beyond PCA? An audit found the first Stage 0 invalid; two pre-registered rebuilds followed. The second — 234 unrelated accessions by KING kinship, missingness tested within germplasm source — returns GO in every sensitivity run. PCA and UMAP find the same two groups wherever both cluster, so stable structure exists and nothing yet shows structure beyond PCA.",
  },
  {
    id: "indicium", name: "indicium", area: "structure", status: "Results committed (Stage 1, inconclusive)", date: "2026",
    summary:
      "Graded evidence for precision medicine in one knowledge graph: pharmacogenomics checked against CPIC guidelines, a cancer-variant evidence agent evaluated against CIViC, and hypotheses over the combined graph evaluated with a temporal holdout — extending coverage to the transposable element insertions existing knowledge bases under-represent. The replication arm ran first, pre-registered: a catalogue of 69 mobile-element insertions in or near the highest-evidence CPIC pharmacogenes, 61% confirmed by long-read assemblies. Its stability verdict was negative but uninformative — two perturbation axes did not vary in the public call set — and a post-hoc repair failed the same way, so the stability question cannot be answered with this call set. Archived in 2026 with its other arms unstarted.",
  },
  {
    id: "glyma", name: "glyma", area: "structure", status: "Designed (Stage 0)", date: "2026–",
    summary:
      "A topos case study testing whether nonlinear manifold learning reveals stable soybean haplogroup substructure beyond PCA on SoySNP50K, with conditional escalation into phenotype, transcriptomic and geo-climatic validation. Protocols complete; analysis not yet run.",
  },
  {
    id: "sorghum", name: "sorghum", area: "structure", status: "Designed (Stage 0–1)", date: "2021–",
    summary:
      "Reproducible detection of transposable element insertion-site polymorphisms in Sorghum bicolor: can insertion sites be called reproducibly under perturbation of coverage, filtering and annotation scope before any interpretation is attempted? Go/kill criteria gate escalation; the pilot has not yet run.",
  },
  {
    id: "lyco", name: "lyco", area: "structure", status: "Designed (Stage 0)", date: "2026–",
    summary:
      "Do transposable-element-derived structural variants carry more of tomato's trait heritability than other structural variants, once frequency, length and linkage with SNPs are held fixed? Metabolome, flavour-chemistry and expression traits in 332 accessions from published pangenome call sets, tested against a permutation null, with agreement across independent call sets scored first as a validation gate. Stage 0 complete; no analysis has run.",
  },
  {
    id: "repbox", name: "repbox", area: "structure", status: "Shipped", date: "2020–2023", featured: true,
    link: "https://doi.org/10.1186/s12859-023-05419-5", linkLabel: "View publication ↗",
    summary:
      "Python-first CLI for discovering and classifying novel repetitive genomic elements, evolved from dissertation work into an adapter-based v2.0.0 with semantic versioning and smoke-test diagnostics. Demonstrated 7% growth in detected elements across the A. sativa genome. Published in BMC Bioinformatics (2023).",
  },

  // ---- Research cognition ----
  {
    id: "veridian", name: "veridian", area: "cognition", status: "Results committed (Check)", date: "2025", featured: true,
    link: "/projects/veridian/", linkLabel: "Read the write-up →",
    summary:
      "A literature review tool with two modes over one frozen corpus: Explore maps a field and where it disagrees; Check grounds a claim against the papers, citing the sentences behind the verdict. After an audit found the original grounding answered “supported” to every claim, the rebuilt Check reached 86% verdict accuracy on 21 held-out claims written before any fix (95% interval 65–95%), against 48% for the original rule.",
  },
  {
    id: "recolo", name: "recolo", area: "cognition", status: "Results committed", date: "2026–", featured: true,
    link: "/projects/recolo/", linkLabel: "Read the write-up →",
    summary:
      "Bio-inspired memory for LLM agents: episodic and semantic stores over SQLite, exponential decay computed at retrieval, salience scored independently of age, and a consolidation loop that promotes cluster centroids and accelerates decay on what they already represent rather than deleting it. Evaluated on LongMemEval under a protocol committed before scoring: as shipped it scored 0.32 against 0.73 for plain retrieval over the same memories, and ablations trace the loss to decay on a fixed clock. A second protocol tested decay that adapts to the history: none of three modes beat plain retrieval, even on knowledge-update questions. A third tested salience as a tie-breaker and consolidation as an index over its member episodes, with decay off: neither retrieved evidence better than plain retrieval, so none of recolo's mechanisms helps. Reported as-is.",
  },

  // ---- Supporting — production systems ----
  {
    id: "menhir", name: "menhir", area: "production", status: "Shipped", date: "2026–", featured: true,
    link: "/projects/menhir/", linkLabel: "Read the write-up →",
    summary:
      "A dual-role athlete and coach training platform, built and maintained solo. A multi-provider LLM pipeline generates programs on top of 14 deterministic methodology engines and an RPE calibration engine, and every generated program is validated and previewed before it can be committed. OAuth with role-aware access, tiered billing, Web Push, and an offline-capable PWA. ~106K LOC, 25 test modules.",
  },
  {
    id: "audire", name: "audire", area: "production", status: "Shipped", date: "2026–",
    summary:
      "A self-hosted audio library platform packaged as a Home Assistant add-on: FastAPI across 21 routers, a SvelteKit client, a native macOS launcher and a background queue worker behind Caddy, with ReplayGain normalization and MusicBrainz enrichment. Failure handling is deliberate — randomized pacing, one delayed retry that resumes only what is missing, no retry for permanent failures. Duplicate detection matches on tags and duration rather than hashes, because separate encodes of one recording never hash alike. 21K LOC, 37 test modules.",
  },
  {
    id: "ponere", name: "ponere", area: "production", status: "Shipped", date: "2025–",
    summary:
      "A single-user tool for taking a rough idea to a published post: a capture → draft → live → dormant lifecycle so nothing sits untouched, platform-specific drafting, and a log of what shipped where. Claude-assisted drafting is grounded in stored voice and platform notes — always a suggestion, never auto-published.",
  },
  {
    id: "mara", name: "mara", area: "production", status: "Shipped", date: "2026–", featured: true,
    summary:
      "A multi-tenant pricing API for the moving industry: local hourly, interstate tariff and military 400NG pricing behind one survey endpoint that estimates weight from job-site photos, routes the move, recommends a crew and returns priced line items. Per-tenant rate configuration, hashed scoped API keys, distance resolution that falls back to free routing, and self-refreshing fuel and tariff data. In production as a client platform's pricing service. 10 test modules.",
  },
  {
    id: "additional", name: "Additional services", area: "production",
    summary:
      "Smaller production services, described by their engineering: an events-business backend with Stripe payments and Google OAuth; a private health-tracking application with signed-session gating on every route; a payment-plan portal with Stripe invoicing, magic-link login and verified webhooks; a moving company's operations platform, from quote to completed job, priced by mara; and a no-build marketing site.",
  },

  // ---- Supporting — learning & knowledge tools ----
  {
    id: "scintilla", name: "scintilla", area: "learning", status: "Implemented", date: "2026–", featured: true,
    summary:
      "A free, local-first lesson player for data science, ML and AI that checks understanding throughout every lesson: 5–10 minute lessons with bridges to what came before, frequent checkpoints, a hands-on item such as Python run in the browser, a Feynman self-check that routes to the missing prerequisite, and FSRS-scheduled review. Nothing is generated live, so learners need no account and no key. The player runs end to end on lumen's catalog, offline-capable and accessibility-tested; the first reviewed lesson is live in a private deployment.",
  },
  {
    id: "lumen", name: "lumen", area: "learning", status: "Implemented", date: "2026–",
    summary:
      "The authoring pipeline behind scintilla: retrieves openly licensed sources, generates with a pinned Claude model, verifies every claim against its source with veridian's Check engine, and publishes a versioned, validated catalog after human review. The build enforces the learner-facing rules — bridges, pinned sources, verified answer keys, named misconceptions. The pipeline runs: its first lesson passed validation on the first draft, with every principle supported by its source, and after review shipped as catalog release v0.1.0.",
  },
  {
    id: "bibliotheca", name: "bibliotheca", area: "learning", status: "Shipped", date: "2025–",
    link: "https://github.com/sheljustdoes/bibliotheca", linkLabel: "View repository ↗",
    summary:
      "A public reading index driven entirely by filenames: an ISBN-13-named file pushed to a status folder triggers a GitHub Action that resolves metadata through the Google Books API and publishes it. Moving a file between folders updates reading status and completion date.",
  },
  {
    id: "bibliotheca-archive", name: "bibliotheca-archive", area: "learning", status: "Shipped", date: "2026–",
    summary:
      "The automation behind the bibliotheca shelf: an ISBN-named file in a status folder fires an Action that resolves the work through the Google Books API and writes its metadata to the public shelf, with Git LFS for binaries. The filesystem is the interface — no form, database or admin UI.",
  },

  // ---- Supporting — tooling & designs ----
  {
    id: "custos", name: "custos", area: "tooling", status: "Shipped", date: "2026–",
    summary:
      "Cross-portfolio tooling. Its rotation report ranks every project by its last commit that touched more than markdown, so documentation activity cannot disguise a stalled project, and pairs each with its next backlog item. The same script runs locally and as a weekly Action over treeless clones.",
  },
  {
    id: "catasta", name: "catasta", area: "tooling", status: "Designed (reference pattern)", date: "2026–",
    summary:
      "A documented pattern for turning a research pipeline into an interactive demo without shipping the science to the browser: a Python backend where the pipeline stays server-side, a TypeScript frontend, and one preprocess → predict → postprocess contract shared by embedded and standalone deployments.",
  },
  {
    id: "noul", name: "noul", area: "tooling", status: "Results committed (`find` only)", date: "2026–", featured: true,
    link: "/projects/noul/", linkLabel: "Read the write-up →",
    summary:
      "Local, non-generative code search: BM25 and a small embedding model shortlist candidates and a cross-encoder reranks only those — typed scores in a single pass instead of an agent reading files, with nothing leaving the machine. On 35 labelled queries across two codebases, every single-file answer lands in the top five, at a tenth of brute-force cost on the larger codebase; but on a strict rule that requires every correct file, only 4 of 9 multi-file answers are complete. A pre-registered fix helped on those queries but not on a fresh held-out codebase, so the default is unchanged.",
  },
  {
    id: "legere", name: "legere", area: "tooling", status: "Designed (scaffold)", date: "2026–",
    summary:
      "Architecture for on-premises handwriting extraction from mixed-content forms: template-based field segmentation, a benchmarking matrix that tests every model against every field type before routing, vision-language arbitration across predictions, and a human review queue with per-field provenance. The repository is the scaffold for that design; model adapters are interface stubs.",
  },
];

export const PROJECT_BY_ID: Record<string, Project> = Object.fromEntries(PROJECTS.map((p) => [p.id, p]));

export const LINES = AREAS.filter((a) => a.kind === "line");
export const SUPPORTING = AREAS.filter((a) => a.kind === "supporting");

export const projectsInArea = (area: AreaId) => PROJECTS.filter((p) => p.area === area);

/** Status for display: PORTFOLIO.md's inline-code backticks dropped. */
export const displayStatus = (status: string) => status.replace(/`/g, "");
