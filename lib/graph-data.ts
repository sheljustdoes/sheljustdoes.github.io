// Spatial knowledge graph for the homepage.
//
// Positions are authored, not simulated. The composition is the point: clusters
// communicate meaning through proximity, so a settling simulation would undo the
// argument the layout is making. Coordinates live in a fixed virtual canvas
// (CANVAS below); the view is fitted and then pan/zoomed on top of that.
//
// Node type drives three cues simultaneously, per the brand guide's role
// definitions — serif is voice, display is structure, mono is utility:
//
//   type        colour family      typeface       meaning
//   education   forest             Lora italic    where it started
//   role        archive palette    Lora italic    who it was for
//   project     terracotta family  Outfit         what was built
//   skill       sage family        DM Mono        what it required
//
// Among projects, full terracotta is reserved for the three product-line
// flagships (iridis, topos, veridian — see AREAS in lib/projects.ts).

import { PROJECT_BY_ID } from "@/lib/projects";
import { EXPERIENCE, type Role } from "@/lib/resume";

export type NodeType = "education" | "role" | "project" | "skill";

export type GraphNode = {
  id: string;
  label: string;
  type: NodeType;
  /** Palette token from the archive palette. */
  color: string;
  /** Radius in canvas units. Larger = more gravity. */
  r: number;
  x: number;
  y: number;
  date?: string;
  summary: string;
  /** Substantive detail, drawn from the résumé. Rendered as a list in the panel. */
  points?: string[];
  /** The working vocabulary for this node — the terms a reader would search for. */
  keywords?: string[];
  link?: string;
  linkLabel?: string;
  /** Other lib/projects.ts entries this node also stands for, when one node shows a pair. */
  covers?: string[];
};

export type GraphEdge = [string, string];

/** Virtual canvas the authored coordinates live in. */
export const CANVAS = { w: 1760, h: 1120 };

/**
 * A project node's summary, date and link come from lib/projects.ts, not from here.
 * A role node names its résumé entry in `company`; its date comes from lib/resume.ts.
 */
type AuthoredNode = Omit<GraphNode, "summary"> & { summary?: string; company?: string };

const AUTHORED: AuthoredNode[] = [
  // ---- Academic origin. Anchors the lower-left region. ----
  { id: "bs-biology", label: "BS Biology", type: "education", color: "forest", r: 17, x: 120, y: 838, date: "2013",
    summary: "Foundation in biology and scientific method at UNC Charlotte — the domain grounding underneath everything computational that followed.",
    points: [
      "Biology, UNC Charlotte — the domain grounding underneath the computational work",
    ],
    keywords: ["Molecular Biology", "Genetics", "Scientific Method", "Laboratory Technique"] },
  { id: "ms-bioinformatics", label: "MS Bioinformatics", type: "education", color: "forest", r: 19, x: 116, y: 690, date: "2016",
    summary: "Graduate training in bioinformatics and data science: statistical modeling, computational methods, and large-scale biological data analysis.",
    points: [
      "Bioinformatics & Computational Biology (Data Science), UNC Charlotte",
    ],
    keywords: ["Bioinformatics", "Computational Biology", "Statistical Modeling", "Algorithms", "Python", "R"] },
  { id: "phd", label: "PhD Data Science", type: "education", color: "forest", r: 24, x: 124, y: 540, date: "2020",
    summary: "Doctorate in Bioinformatics & Computational Biology. Dissertation on large-scale genomic annotation of the Avena sativa genome, building real-time analytical pipelines over Illumina and PacBio sequencing data.",
    points: [
      "Bioinformatics & Computational Biology (Data Science), UNC Charlotte",
      "Dissertation: comparative analysis of repeat landscapes in Avena, the work that became repbox",
    ],
    keywords: ["Genome Annotation", "Transposable Elements", "Illumina", "PacBio", "Comparative Genomics", "Python", "Linux", "Research Design"] },
  { id: "grad-researcher", label: "Graduate Researcher\n& Instructor", type: "role", color: "plum", r: 27, x: 348, y: 430, company: "University of North Carolina at Charlotte",
    summary: "Dissertation research alongside teaching: three Spring semesters as independent instructor of Biological Basis for Bioinformatics at 10–15 students per term, owning syllabus through assessment, plus teaching assistant work in introductory biology.",
    points: [
      "Dissertation research on large-scale genomic annotation of the Avena sativa genome, building real-time pipelines over Illumina and PacBio data",
      "Extracted and integrated data from NCBI and GenBank into optimized large-scale processing workflows",
      "Independent course instructor for Biological Basis for Bioinformatics across three Spring semesters, 10–15 students per term",
      "As independent course instructor, owned syllabus, lecture material, assignments, assessment, and office hours",
      "As teaching assistant for introductory biology, led sessions, gave written feedback, and held standing office hours debugging students' code",
    ],
    keywords: ["Genome Annotation", "NCBI", "GenBank", "Curriculum Design", "Assessment", "Teaching Assistant", "Course Instructor", "Python", "Linux"] },
  { id: "postdoc", label: "Postdoctoral\nResearcher", type: "role", color: "amber-deep", r: 26, x: 344, y: 712, company: "NC Research Campus",
    summary: "NC Research Campus. Built the analytical infrastructure underlying all lab research — NGS pipelines across UNIX and HPC — and served as the lab's de facto computational trainer, taking wet-lab researchers to independently running their own analyses.",
    points: [
      "Designed the analytical pipelines for large-scale NGS datasets across UNIX and HPC that underpinned all lab research",
      "Built transposable element polymorphism detection and structural variant association analysis, applying GWAS-adjacent methods",
      "Extended the work into protein sequence analysis and peptide structure annotation",
      "Served as the lab's computational trainer: wrote the internal documentation, ran pipeline walkthroughs, and debugged for every researcher using them",
      "Took students with wet-lab backgrounds and no computational experience to independently running their own NGS analyses",
    ],
    keywords: ["NGS", "GWAS", "Structural Variants", "TE Insertion Polymorphism", "Protein Structure Annotation", "HPC", "UNIX", "Reproducibility", "Mentorship", "Transposable Elements"] },
  { id: "repbox", label: "repbox", type: "project", color: "rose-dust", r: 21, x: 120, y: 1022,
    points: [
      "Python-first CLI for transposable element discovery and annotation, evolved from the thesis-era workflow",
      "Adapter-based integration with RepeatModeler and RepeatMasker paths",
      "Commands: run, check, smoke, smoke-report — with machine-readable diagnostics",
      "Semantic versioning and a documented release process; v2.0.0 is the stable baseline",
      "Demonstrated 7% growth in detected elements across the A. sativa genome",
      "Published in BMC Bioinformatics (2023)",
    ],
    keywords: ["Transposable Elements", "RepeatModeler", "RepeatMasker", "Genome Annotation", "CLI Design", "Semantic Versioning", "Python Packaging", "Bioconda"] },

  // ---- Skill clusters. Placed between the work that produced them. ----
  { id: "bioinformatics", label: "Bioinformatics\n& NGS", type: "skill", color: "stone", r: 20, x: 300, y: 934,
    summary: "Sequence analysis, NGS pipelines, genomic annotation, and reproducible computational workflows across UNIX, HPC, and cloud — the through-line from dissertation work to the topos case studies.",
    points: [
      "NGS pipeline design across UNIX, HPC and cloud environments",
      "Genomic annotation, transposable element discovery, structural variant association",
      "Biological sequence analysis and reproducible, documented computational workflows",
      "Demonstrated across repbox, the postdoctoral pipelines, and the three topos case studies",
    ],
    keywords: ["Bioinformatics", "NGS", "Genome Annotation", "Sequence Analysis", "Transposable Elements", "GWAS", "Structural Variants", "Bioconda", "SAM/BAM", "VCF", "HPC", "Reproducible Pipelines", "Population Genetics", "TE Insertion Polymorphism", "Haplotype Analysis"] },
  { id: "teaching", label: "Technical\nEducation", type: "skill", color: "stone", r: 20, x: 760, y: 150,
    summary: "Four years of formal teaching, ongoing mentorship of junior data scientists, and a curriculum practice built on the premise that you do not understand something until you can explain it plainly.",
    points: [
      "Independent course instructor for Biological Basis for Bioinformatics across three Spring semesters, plus TA work in introductory biology",
      "Lab computational trainer: internal documentation, pipeline walkthroughs, and ongoing debugging support",
      "Currently mentors junior data scientists on technique, structure and troubleshooting",
      "Building scintilla and lumen — a curriculum built on the premise that you do not understand something until you can explain it plainly",
    ],
    keywords: ["Curriculum Design", "Technical Training", "Workshop Design", "Mentorship", "Feynman Method", "Assessment Design", "Technical Communication", "Documentation"] },
  { id: "metric-development", label: "Novel Metric\nDevelopment", type: "skill", color: "stone", r: 20, x: 566, y: 848,
    summary: "Building quantification where none previously existed: defining what to measure, constructing composite scores from multi-modal features, and validating them against expert judgment rather than against convenience.",
    points: [
      "Defining what to measure where no prior quantification exists",
      "Composite scoring from multi-modal features, validated against expert judgment rather than convenience",
      "Demonstrated in lambent's radiance scoring and iridis's perceptual cluster benchmark",
    ],
    keywords: ["Novel Metric Development", "Composite Scoring", "Construct Validity", "Expert-Grading Validation", "Feature Engineering", "Measurement Theory"] },
  { id: "perceptual-color", label: "Perceptual\nColor Science", type: "skill", color: "stone", r: 20, x: 700, y: 962,
    summary: "CIE Lab/LCh featurization, CIEDE2000 perceptual distance, and the measurement methodology that makes colour comparisons reflect what an eye would actually distinguish.",
    points: [
      "CIE Lab / LCh featurization and CIEDE2000 perceptual distance",
      "Robust sampling that survives specular highlights and imperfect segmentation",
      "Measurement methodology translated for non-specialist stakeholders so they could act on results independently",
    ],
    keywords: ["CIE Lab", "LCh", "CIEDE2000", "ITA", "Perceptual Colour Distance", "Colour Constancy", "Fitzpatrick Scale", "Monk Skin Tone Scale"] },
  { id: "manifold-stability", label: "Manifold\n& Clustering", type: "skill", color: "stone", r: 20, x: 886, y: 716,
    summary: "Dimensionality reduction, density clustering, and — more importantly — the stability testing that separates structure which survives perturbation from structure an embedding invented.",
    points: [
      "Dimensionality reduction and density clustering — PCA, UMAP, K-means, HDBSCAN",
      "Stability testing that separates structure surviving perturbation from structure an embedding invented",
      "Matched-model comparison and density-appropriate validation metrics",
      "Underpins topos, its three case studies, iridis's clustering, and veridian's corpus partitioning",
    ],
    keywords: ["UMAP", "t-SNE", "PCA", "K-means", "HDBSCAN", "MiniBatchKMeans", "Density Clustering", "DBCV", "Silhouette", "Cluster Stability", "Dimensionality Reduction", "Consensus Clustering", "Manifold Learning", "Clustering"] },
  { id: "evaluation", label: "Evaluation\n& Experimental Design", type: "skill", color: "stone", r: 20, x: 966, y: 470,
    summary: "A/B testing, causal inference, and evaluation frameworks for problems with no single right answer — success metrics and regression tests for classification tasks where ground truth is contested.",
    points: [
      "A/B testing and causal inference, owning protocol design through analysis",
      "Evaluation frameworks for LLM outputs where no single right answer exists",
      "Success metrics and regression tests for contested-ground-truth classification",
      "Experimental design as a gating discipline — the go / kill criteria in topos are the same instinct",
    ],
    keywords: ["A/B Testing", "Causal Inference", "Hypothesis Testing", "Experimental Design", "Model Evaluation", "LLM Evaluation", "LLM-as-Judge", "Inter-Annotator Agreement", "Regression Testing", "Precision/Recall", "ROC-AUC", "Negative Results", "Pre-registered Protocols", "Reproducibility", "Perturbation Testing"] },
  { id: "llm-agents", label: "LLMs\n& Agent Architecture", type: "skill", color: "stone", r: 20, x: 1380, y: 474,
    summary: "Retrieval-augmented and agentic systems, structured output, tool use, and memory architecture — with deterministic engines underneath generation wherever correctness matters.",
    points: [
      "Retrieval-augmented generation, semantic search, and embedding-based retrieval",
      "Agent architecture, tool use, structured output, and memory design",
      "Knowledge graph construction and entity resolution over retrieved corpora",
      "Deterministic engines underneath generation wherever correctness matters",
      "Demonstrated across veridian, recolo, menhir's programming pipeline, and the BI classification work",
    ],
    keywords: ["LLMs", "Agentic AI", "Multi-Agent Systems", "Agent Orchestration", "Agent Memory", "RAG", "Model Context Protocol", "Tool Use", "Structured Output", "Prompt Engineering", "Context Engineering", "Embeddings", "Vector Databases", "Semantic Search", "Knowledge Graphs", "Claude API", "Human-in-the-Loop"] },
  { id: "production-eng", label: "Production\nEngineering", type: "skill", color: "stone", r: 20, x: 1340, y: 848,
    summary: "Shipping and keeping running the services people depend on: deployment, scheduled automation, release cadence, and test suites — solo, end to end.",
    points: [
      "Model deployment on AWS SageMaker for a client's clinical imaging pipeline",
      "Versioned releases, CI, and test suites across every shipped service",
      "Scheduled jobs that keep reference data current: a weekly fuel-price refresh and a quarterly tariff check that opens a pull request for review",
      "Failure handling that degrades rather than stops — fallback tiers, bounded retries",
      "Demonstrated in menhir, audire, mara, and a client model deployment on AWS SageMaker",
    ],
    keywords: ["Model Deployment", "AWS SageMaker", "MLOps", "CI/CD", "Docker", "Release Management", "Testing", "Scheduled Jobs", "Graceful Degradation"] },

  { id: "stats-ml", label: "Statistical Modeling\n& ML", type: "skill", color: "stone", r: 20, x: 400, y: 580,
    summary: "Classical statistics and machine learning where they are the right tool: predictive models on tabular features, survival models with censoring, and anomaly detectors, chosen and validated against simple baselines.",
    points: [
      "Predictive models on haplotype data for trait prediction at Syngenta",
      "Statistical analysis and causal inference in Python and SQL across consulting engagements",
      "Survival modeling with censoring handled explicitly: Cox models as the baseline a 3D CNN had to beat",
      "Random forests, gradient boosting and TabPFN over engineered image features",
      "Isolation Forest anomaly scoring over foundation-model embeddings",
    ],
    keywords: ["Machine Learning", "Statistical Modeling", "Predictive Modeling", "Supervised Learning", "Regression", "Classification", "Random Forest", "XGBoost", "TabPFN", "Isolation Forest", "Survival Analysis", "Cox Models", "scikit-learn", "Cross-Validation", "R"] },

  { id: "web-api", label: "Full-Stack\n& APIs", type: "skill", color: "stone", r: 20, x: 1580, y: 590,
    summary: "Building the product surface around the science: typed web applications, APIs other systems call, and the authentication, billing and data layers underneath them.",
    points: [
      "Next.js and TypeScript applications with role-aware authentication and tiered Stripe billing",
      "APIs designed for other callers: a multi-tenant pricing API with scoped keys, and a client-facing SDK",
      "FastAPI services behind a SvelteKit client, packaged for self-hosting",
      "Offline-capable PWAs with background-sync writes",
      "Demonstrated in menhir, audire, ponere, mara, and a delivered client SDK",
    ],
    keywords: ["Next.js", "TypeScript", "React", "SvelteKit", "FastAPI", "API Design", "SDK Development", "Multi-Tenancy", "Postgres", "OAuth", "Auth.js", "JWT", "Stripe", "Webhooks", "PWA", "Service Workers"] },

  { id: "computer-vision", label: "Computer\nVision", type: "skill", color: "stone", r: 20, x: 940, y: 880,
    summary: "Extracting quantitative signal from images — segmentation, featurization, and classification over biological and clinical imaging, where the hard part is usually deciding what to measure rather than which architecture to use.",
    points: [
      "CNN architectures for anomaly detection over large clinical imaging databases",
      "Semantic segmentation with a ResNet18-U-Net for lesion exclusion (held-out Dice 0.889 / IoU 0.818)",
      "Vision Transformers for large-scale perceptual classification on a proprietary image database",
      "Robust image featurization: median-based pixel sampling, region anchoring, face detection, and masking pipelines that survive artifacts",
      "Autoencoder reconstruction error and Isolation Forest scoring for unsupervised anomaly detection",
    ],
    keywords: ["Computer Vision", "CNNs", "Vision Transformers", "Semantic Segmentation", "U-Net", "ResNet", "Image Classification", "Anomaly Detection", "Convolutional Autoencoders", "Feature Extraction", "OpenCV", "scikit-image", "PyTorch", "Vision-Language Models", "Biomedical Imaging"] },
  { id: "data-engineering", label: "Data\nEngineering", type: "skill", color: "stone", r: 20, x: 520, y: 520,
    summary: "Moving large biological and commercial datasets from where they live to where they can be modeled — pipelines, warehouses, and query layers, built to be rerun rather than run once.",
    points: [
      "Analytical pipelines for large-scale NGS datasets across UNIX, HPC, and cloud environments",
      "LLM classification pipelines on Databricks and Snowflake in a regulated pharmaceutical environment",
      "AWS Athena for large-scale dataset retrieval; MongoDB with geoJSON for geolocation-based behaviour analysis",
      "Bioinformatics workflows integrating outputs into relational databases for downstream consumption",
      "Reproducible, documented workflows — pipelines that a second person can run and get the same answer",
    ],
    keywords: ["Data Engineering", "ETL", "Databricks", "Snowflake", "AWS Athena", "AWS S3", "SQL", "MySQL", "NoSQL", "MongoDB", "geoJSON", "Pandas", "NumPy", "HPC", "Workflow Orchestration", "Relational Databases", "GitHub Actions", "Automation"] },
  { id: "solution-architecture", label: "Solution Architecture\n& Delivery", type: "skill", color: "stone", r: 21, x: 966, y: 316,
    summary: "Turning an ambiguous business or scientific problem into a scoped, buildable system — then delivering it, handing it over, and training the people who will own it afterward.",
    points: [
      "Technical scoping and solution architecture across applied AI consulting engagements",
      "Four years as sole technical authority: client relationships, problem scoping, delivery, adoption, and ongoing support",
      "Stakeholder engagement across commercial, corporate affairs, and analytics teams, translating ambiguous needs into modeling objectives",
      "Product Owner for a decision-making analytics platform, owning vision and backlog under Agile and Scrum",
      "Client training and handover — onboarding engineers onto delivered SDKs and walking stakeholders through ranking logic and tradeoffs",
      "Navigating regulated data-access processes, governance, and compliance in a pharmaceutical environment",
    ],
    keywords: ["Solution Architecture", "Technical Scoping", "Stakeholder Engagement", "Requirements Definition", "Product Ownership", "Agile", "Scrum", "Jira", "Kanban", "Client Delivery", "Technical Communication", "Regulated Environments", "GxP", "Data Governance", "Cross-Functional Leadership"] },
  { id: "signal-timeseries", label: "Signal Processing\n& Time Series", type: "skill", color: "stone", r: 20, x: 612, y: 716,
    summary: "Characterizing physiological signals that arrive as streams rather than snapshots — establishing what an individual's baseline is before deciding whether a reading has departed from it.",
    points: [
      "Real-time capacitive sensor data capturing physiological skin states",
      "Longitudinal profiling systems modeling individual baselines over time, across clinical cohorts",
      "Physiological signal characterization where the measurement itself had to be defined first",
      "Trend detection over time-ordered content streams in the misinformation classification pipeline",
    ],
    keywords: ["Time Series Analysis", "Forecasting", "Signal Processing", "Physiological Signal Characterization", "Longitudinal Modeling", "Baseline Estimation", "Sensor Data", "Trend Detection", "Drift Detection", "SciPy"] },
  { id: "ranking", label: "Ranking &\nRecommendation", type: "skill", color: "stone", r: 20, x: 988, y: 566,
    summary: "Ordering candidates by a distance that means something. The hard part is rarely the ranker — it is choosing the metric the ordering is computed against, and understanding how presentation order changes what people pick.",
    points: [
      "Shade-matching recommendation system, built for a client on a self-developed perceptual-color method, ranking products by perceptual colour distance between a user's perceived and actual shade; a version was deployed to real customers",
      "A/B tested how result ordering affected selection, finding that presentation position interacted with user skin tone",
      "Constraining candidates to a bounded perceptual distance shifted selection bias directionally by tone group",
      "Ranked, salience-weighted retrieval in agent memory and corpus-grounded claim matching",
    ],
    keywords: ["Ranking", "Recommendation Systems", "Similarity Search", "Perceptual Distance", "Relevance Scoring", "Candidate Generation", "Presentation Bias", "Semantic Search", "Embedding Retrieval"] },
  // ---- Employers. Each anchors its own region. ----
  { id: "syngenta", label: "Syngenta", type: "role", color: "amber", r: 26, x: 630, y: 300, company: "Syngenta",
    summary: "Data Scientist. Predictive models on VCF-derived haplotype data for corn trait prediction, scalable bioinformatics workflows, and a decision-making analytics platform launched as Product Owner across the breeding organization.",
    points: [
      "Built predictive models on VCF-derived haplotype data for corn trait prediction, combining biological domain reasoning with ML end to end",
      "Designed and deployed scalable bioinformatics workflows, integrating outputs into relational databases",
      "Launched a decision-making analytics platform as Product Owner, adopted across the corn and specialty-crop breeding organization",
      "Worked the full data science lifecycle cross-functionally — wrangling, EDA, hypothesis testing, prototyping, validation, deployment",
    ],
    keywords: ["Haplotype Analysis", "VCF", "Trait Prediction", "Predictive Modeling", "Plant Breeding", "Product Ownership", "Agile", "Scrum", "Machine Learning"] },
  { id: "consulting", label: "Independent\nConsultant", type: "role", color: "dusty-blue", r: 32, x: 760, y: 640, company: "Independent Consultant",
    summary: "Four years as sole data scientist and technical authority across client engagements in consumer health sensing — owning client relationships, problem scoping, ML research, measurement methodology, delivery, and the training that let client teams operate what was handed over.",
    points: [
      "Sole data scientist and technical authority across two primary clients over four years — scoping, research, measurement methodology, delivery, and support",
      "Trained client teams to operate what was handed over, including onboarding engineers onto a delivered SDK and anomaly-detection pipeline",
      "Brought non-specialist clients up to speed on perceptual colour science so they could interpret results and make product decisions independently",
      "Led original research quantifying physiological skin properties that previously existed only as qualitative descriptors",
      "Designed and ran A/B tests and causal inference studies, owning protocol design through analysis",
      "Built longitudinal profiling over real-time capacitive sensor data, modeling individual baselines over time",
      "Defined and operationalized product health metrics, with Plotly Dash and Tableau dashboards for stakeholders",
    ],
    keywords: ["Applied ML", "Measurement Methodology", "Computer Vision", "Colour Science", "A/B Testing", "Causal Inference", "Client Delivery", "SDK Development", "Stakeholder Training", "Biomedical Imaging"] },
  { id: "bi", label: "Boehringer\nIngelheim", type: "role", color: "indigo", r: 34, x: 1210, y: 232, company: "Data Science Talent @ Boehringer Ingelheim",
    summary: "Principal Applied Scientist, Global Animal Health. Technical scoping and solution architecture across applied AI engagements; built an LLM-based misinformation detection pipeline on Databricks and Snowflake, delivered production-ready in 60 days, with the evaluation frameworks to prove it worked.",
    points: [
      "Own technical scoping and solution architecture for applied AI engagements in the Global Animal Health division",
      "Designed and built an LLM-based misinformation detection pipeline on Databricks and Snowflake, automating social-media content triage where no prior capability existed",
      "Delivered production-ready in 60 days — classification, clustering, and trend detection feeding corporate communications",
      "Built the evaluation and measurement frameworks behind it: success metrics and regression tests for classification tasks with no single right answer",
      "Developed a financial potential model estimating purchasing capacity across major customer portfolios",
      "Mentor junior data scientists on modeling technique, code structure, and review as work moves toward production",
      "Navigate regulated data-access processes, coordinating permissions against internal governance and regulatory standards",
    ],
    keywords: ["LLMs", "Generative AI", "Text Classification", "Clustering", "Trend Detection", "Databricks", "Snowflake", "LLM Evaluation", "Regulated Environments", "Mentorship", "Solution Architecture"] },

  // ---- Consulting-era research projects. ----
  { id: "lambent", label: "lambent", type: "project", color: "blush-deep", r: 20, x: 520, y: 1002,
    points: [
      "Multi-region extraction across full, centre, forehead, cheeks and chin, with optional face detection for anchoring",
      "Features span Lab, ITA, hue, texture, and specular / red / dark proxies, aggregated to subject level",
      "Transparent composite scoring at image, subject-region and subject level",
      "Validated without ground truth by perturbation: known doses of synthetic gloss, global brightening and noise applied to real images",
      "Tracks added gloss at Spearman rho = 1.00 — and tracks plain brightening just as strongly, so it does not separate the two",
      "The specular term is itself 5.3x higher on the lightest skin than the darkest, because it counts pixels over an absolute brightness threshold",
      "A quarter-stop exposure difference moved the original score by ~51% of the full type-1-to-type-6 span, so uncalibrated data could not separate skin tone from the camera",
      "Rebuilt through seven measured variants into a capture-robust, tone-neutral metric: tone dependence falls from rho-squared 0.310 to 0.002 and worst-case capture sensitivity from 93% to 59%",
      "The decisive step was colour-science rather than statistical — von Kries is a linear model, so applying it to gamma-encoded sRGB left a residue that varied with skin tone",
      "Packaged as an installable CLI with folder and manifest ingestion modes",
      "Methodology documented across six iterations; the public repo is the sanitized open-image reimplementation",
    ],
    keywords: ["Skin Radiance", "Composite Scoring", "CIE Lab", "ITA", "Texture Features", "Region Segmentation", "Face Detection", "scikit-learn", "XGBoost", "Perturbation Testing", "Biomedical Imaging"] },
  { id: "iridis", label: "iridis", type: "project", color: "terracotta", r: 26, x: 762, y: 1092,
    points: [
      "Layered masking isolates skin before colour is measured: foreground segmentation, a ResNet18-U-Net trained on ISIC 2018 to exclude the lesion, and a centre-crop fallback",
      "Per-image colour is the median over sampled pixels in CIE Lab — far less sensitive to specular highlights and residual segmentation error than a mean",
      "MiniBatchKMeans at k=120, then perceptual merging by CIEDE2000 distance so categories reflect what an eye would distinguish",
      "Benchmarked on Fitzpatrick17k (12,631 images) under matched Random Forest and TabPFN classifiers",
      "Clusters: 95.8–96.3% accuracy. Fitzpatrick labels: 34.6–42.3%. A 2.5–2.8× gap from identical features",
      "Lesion U-Net reaches held-out Dice 0.889 / IoU 0.818",
      "Masking did not close the gap — the negative result, and the more interesting one",
    ],
    keywords: ["CIE Lab", "LCh", "CIEDE2000", "MiniBatchKMeans", "TabPFN", "Random Forest", "U-Net", "rembg", "Fitzpatrick17k", "ISIC 2018", "Algorithmic Fairness", "Negative Results", "Biomedical Imaging"] },
  { id: "argus", label: "argus", type: "project", color: "blush", r: 19, x: 1110, y: 665,
    points: [
      "Built on Recursion's public RxRx3-core: a UV-channel autoencoder and an Isolation Forest over OpenPhenom embeddings, fused by rank",
      "Tested under a protocol fixed in advance: flag PLK1 and MTOR knockouts, with detectors trained on control wells only",
      "The dual-branch design failed its test: the autoencoder scored knockouts as less anomalous than controls (AUC 0.32), and fusion fell to 0.53",
      "The embedding branch reached 0.71, a tie with a plain nuclei count, which is the baseline any detector has to beat",
      "A second pre-registered run on eight unscored experiments replicated all of it; nuclear-pixel scoring removed the inversion but left no signal",
      "A third run compared knockouts only with controls of the same cell count: the embeddings still separated them (0.69 against 0.52), so they see more than a count",
    ],
    keywords: ["Anomaly Detection", "Cell Painting", "Fluorescence Microscopy", "Convolutional Autoencoders", "Isolation Forest", "OpenPhenom", "RxRx3", "Negative Results", "PyTorch", "Pre-registered Protocols", "Biomedical Imaging"] },

  // ---- Current-era AI work. ----
  { id: "veridian", label: "veridian", type: "project", color: "terracotta", r: 25, x: 1232, y: 700,
    points: [
      "Two modes over one frozen PubMed corpus: Explore maps a field and where it disagrees; Check grounds a claim in cited sentences",
      "Audited 2026-09-23: the original grounding answered “supported” to every claim — recorded rather than quietly patched",
      "Check retrieves abstracts, selects the sentences nearest the claim, and a judge returns one typed stance per sentence, so every quote exists in its source",
      "Verdicts are supported, contradicted, contested or unsupported, each traced to the PMIDs behind it",
      "Rebuilt Check: 86% verdict accuracy on 21 held-out claims written before any fix (95% interval 65–95%), against 48% for the original rule",
      "Errors were diagnosed, not tuned away — the fixes were general, and the held-out set, frozen before them, scored the same as development",
      "Embeddings run in the reader's browser; Python runs the same quantized ONNX weights, and the two agree to cosine 1.000000",
      "A keyless browser demo, hosted on this site, searches the frozen corpus or any PubMed topic",
      "Explore still runs only in the legacy app and is next in the rework",
    ],
    keywords: ["Claim Grounding", "Retrieve-then-Entail", "LLM-as-Judge", "LLM Evaluation", "Embeddings", "ONNX Runtime", "transformers.js", "PubMed E-utilities", "MeSH", "UMAP", "Knowledge Graph", "Pre-registered Protocols", "Negative Results", "Claude API", "Local-First"] },
  { id: "recolo", label: "recolo", type: "project", color: "blush-deep", r: 22, x: 1560, y: 372,
    points: [
      "Maps biological memory onto an agent: episodic store, semantic store from cluster centroids, and a consolidation loop standing in for slow-wave replay",
      "Exponential decay w(t) = e^(−λt) on episodic weights, with λ a tunable parameter",
      "Salience scoring modulates retrieval, using sentiment magnitude as an arousal proxy",
      "Grounded in Xie (2025) on LLM forgetting and Anthropic's context-engineering framework",
      "Extends veridian's insight — semantic clustering as meaning compression — from external literature to an agent's own memory",
      "Evaluated on LongMemEval (99 held-out questions): 0.32 as shipped against 0.73 for plain retrieval; ablations trace the loss to fixed-clock decay",
    ],
    keywords: ["Agent Memory", "Episodic Memory", "Semantic Memory", "Memory Consolidation", "Temporal Decay", "Salience Scoring", "Context Engineering", "SQLite", "Clustering", "Negative Results", "Pre-registered Protocols"] },

  // ---- topos and its case studies. ----
  { id: "topos", label: "topos", type: "project", color: "terracotta", r: 26, x: 1050, y: 934,
    points: [
      "Eight gating stages, from Data Landscape Audit through an explicit GO / KILL / HOLD Value Audit",
      "Matched-model comparison: embeddings compared under equivalent clustering assumptions, never cherry-picked pairings",
      "Density-aware validation — DBCV for density-based methods, not silhouette applied indiscriminately",
      "Confound auditing is mandatory: a cluster reducing to batch, missingness or preprocessing artifact fails certification regardless of how clean it looks",
      "Specified for three case studies — soybean, sorghum and octoploid strawberry",
      "Stage 0 is a tested Python package: each module enforces a rule learned on fragaria's data",
      "Stage 0 executed on strawberry three times; the pre-registered third run returns a GO that holds across sensitivities",
    ],
    keywords: ["Cluster Stability", "Perturbation Testing", "Matched-Model Comparison", "DBCV", "Confound Auditing", "Foundation Model Embeddings", "Go/Kill Criteria", "Manifold Learning", "Reproducibility"] },
  { id: "fragaria", label: "fragaria", type: "project", color: "blush-deep", r: 18, x: 1006, y: 1062,
    points: [
      "Tests whether nonlinear manifold methods recover stable haplogroup structure beyond PCA in an octoploid system",
      "Run on the 50K array; the final panel is 234 accessions with no second-degree relatives, by KING kinship",
      "An audit found the first Stage 0 invalid (undecoded missing calls, a rubric passed by construction); two pre-registered rebuilds followed",
      "The third run returns GO in every sensitivity run; PCA and UMAP find identical groups wherever both cluster, so nothing yet goes beyond PCA",
      "Contends with dosage ambiguity, subgenome assignment uncertainty, and homoeologous exchange",
      "The only topos case study with executed analysis",
    ],
    keywords: ["Fragaria × ananassa", "Polyploid Genomics", "Haplogroups", "Manifold Learning", "UMAP", "Consensus Clustering", "Cluster Stability", "Population Genetics", "Haplotype Analysis"] },
  { id: "glyma", label: "glyma", type: "project", color: "blush", r: 17, x: 1164, y: 1092,
    points: [
      "Tests the same nonlinearity hypothesis against the SoyBase SoySNP50K panel",
      "Conditional escalation into phenotype, transcriptomic and geo-climatic validation",
      "Ideation, proposal and stage protocols complete; Stage 0 not yet executed",
    ],
    keywords: ["Glycine max", "SoySNP50K", "LD Pruning", "Manifold Learning", "Density Clustering", "Population Genetics", "Haplotype Analysis"] },
  { id: "sorghum", label: "sorghum", type: "project", color: "blush", r: 17, x: 1236, y: 986,
    points: [
      "Reproducible detection of transposable element insertion-site polymorphisms in Sorghum bicolor",
      "Tests whether TIPs can be called reproducibly under perturbation of coverage, filtering and annotation scope",
      "Explicit go / kill criteria gate escalation before large-scale interpretation",
      "Carries legacy exploratory outputs from the 2021 project as its only baseline",
    ],
    keywords: ["Sorghum bicolor", "TE Insertion Polymorphism", "WGS", "Short-Read Alignment", "Presence/Absence Variation", "Transposable Elements", "Perturbation Testing"] },

  // ---- Curriculum. ----
  { id: "scintilla", label: "scintilla", type: "project", color: "blush-deep", r: 23, x: 900, y: 70,
    points: [
      "Free and local-first: no account, no key, and it keeps working with the backend down",
      "5–10 minute lessons with opening and closing bridges, a checkpoint every few paragraphs, and at least one hands-on item",
      "Feynman self-check: a “no” traces down the prerequisite graph to the missing idea, capped at three levels",
      "FSRS-scheduled review over an append-only progress log; delayed recall at 7 and 30 days is the primary metric",
      "Implemented: the player runs end to end on lumen's catalog, offline, under an accessibility-tested design; first reviewed lesson live privately",
    ],
    keywords: ["Curriculum Design", "Learning Science", "Spaced Repetition", "FSRS", "Feynman Method", "Local-First", "Pyodide", "Accessibility"] },
  { id: "lumen", label: "lumen", type: "project", color: "blush", r: 18, x: 1084, y: 100,
    points: [
      "Builds scintilla's curriculum as a versioned static catalog, the only contract between the two repositories",
      "Retrieve openly licensed sources, generate with a pinned Claude model, verify, review by hand, publish",
      "The build enforces learner-facing rules: bridges, pinned sources, two representations, verified answer keys, named misconceptions",
      "veridian's Check engine grounds every principle in sentences from its source",
      "First curriculum outlined: 35 lessons in a prerequisite graph, checked in CI, with every item of the two earlier plans mapped, deferred or retired",
    ],
    keywords: ["Content Pipelines", "LLM Generation", "Verification", "Schema Validation", "Provenance", "Open Licensing", "GitHub Actions", "Technical Writing", "Human-in-the-Loop", "Claude API"] },

  // ---- Production systems. ----
  { id: "menhir", label: "menhir", type: "project", color: "blush-deep", r: 24, x: 1560, y: 900,
    points: [
      "Dual-role platform serving athletes and coaches, built and maintained solo",
      "Adaptive programming driven by multiple autoregulation signals — readiness, sleep, performance trend, calibrated RPE",
      "Multi-provider LLM pipeline (Groq / OpenAI / Anthropic) generating programs on top of 14 deterministic methodology generators and an RPE calibration engine",
      "Generated programs are validated and previewed before they can be committed or assigned",
      "Auth.js v5 OAuth with role-aware route protection; tiered Stripe billing across five plans",
      "Installable PWA with cached offline reads and background-sync offline writes",
      "~106K LOC across 349 files, 25 test modules, 458 commits",
    ],
    keywords: ["Next.js", "TypeScript", "Auth.js", "OAuth", "Stripe", "Web Push", "PWA", "Offline Sync", "Background Sync", "Multi-Provider LLM", "Deterministic Engines", "RPE", "Autoregulation"] },
  { id: "audire", label: "audire", type: "project", color: "blush-deep", r: 20, x: 1420, y: 1034,
    points: [
      "Audio curation and library management, packaged and deployed as a Home Assistant add-on",
      "FastAPI backend across 20 routers, SvelteKit client, native macOS launcher, background queue worker, behind Caddy",
      "Library synchronization, ReplayGain normalization, cover art, and metadata enrichment from MusicBrainz and Wikipedia",
      "Deliberate failure handling against an uncooperative upstream: randomized pacing, one delayed retry resuming only what is missing, and no retry at all for permanent failures",
      "21K LOC, 37 test modules, versioned release cadence, in daily use",
    ],
    keywords: ["FastAPI", "SvelteKit", "Home Assistant", "Caddy", "Queue Workers", "MusicBrainz", "ReplayGain", "Navidrome", "Release Management", "pytest", "Local-First"] },

  // ---- Added 2026-09-25: every featured or Shipped project gets a node. ----
  { id: "oncos", label: "oncos", type: "project", color: "blush-deep", r: 21, x: 872, y: 1008,
    points: [
      "Overall-survival prediction in non-small cell lung cancer from pre-treatment 3D CT, on public imaging data",
      "3D deep learning compared against classical survival baselines, with censoring handled explicitly",
      "Evaluated under a protocol fixed before any model was scored",
      "Work in progress; methods and results will be written up once further along",
    ],
    keywords: ["Survival Analysis", "3D CNNs", "CT Imaging", "Censoring", "Cox Models", "Pre-registered Protocols", "PyTorch", "MONAI", "Negative Results", "Biomedical Imaging"] },
  { id: "noul", label: "noul", type: "project", color: "blush-deep", r: 20, x: 1110, y: 395,
    points: [
      "Local, non-generative code search: typed scores in a single pass instead of an agent reading files, with nothing leaving the machine",
      "BM25 and a 33M-parameter embedding model shortlist 20 chunks; a 568M-parameter cross-encoder reranks only those",
      "On a strict rule (every correct file found), all single-file answers land in the top five but only 4 of 9 multi-file answers are complete",
      "At top-1 its lead over keyword search is three queries of 35, too few to call — reported as-is",
      "Fronted by a Claude Code skill; calibration and the per-file yes/no mode are next",
    ],
    keywords: ["Code Search", "BM25", "Cross-Encoder Reranking", "Reciprocal Rank Fusion", "Embeddings", "Hugging Face Transformers", "Claude Code", "Negative Results", "Local-First"] },
  { id: "legere", label: "legere", type: "project", color: "blush", r: 17, x: 1170, y: 810,
    points: [
      "Architecture for on-premises handwriting extraction from mixed-content forms — no document leaves the building",
      "A benchmarking matrix tests every model against every field type before routing is assigned",
      "A vision-language model arbitrates across predictions; low-confidence fields go to human review with per-field provenance",
      "A scaffold, not a working system: model adapters are interface stubs",
    ],
    keywords: ["Handwriting Recognition", "OCR", "TrOCR", "Donut", "PaddleOCR", "Vision-Language Models", "Human-in-the-Loop", "Document AI", "Local-First"] },
  { id: "indicium", label: "indicium", type: "project", color: "blush", r: 17, x: 300, y: 1080,
    points: [
      "Graded evidence for precision medicine in one knowledge graph, where every edge records its source and evidence level",
      "Pharmacogenomics checked against CPIC guidelines; a cancer-variant evidence agent evaluated against CIViC",
      "Extends coverage to the transposable element insertions existing knowledge bases under-represent",
      "Built on this portfolio's own frameworks as a stack; Stage 0 complete",
      "The pre-registered replication arm ran: 69 mobile-element insertions near CPIC Level A genes, 61% confirmed by long reads; its stability verdict was uninformative (two perturbation axes did not vary)",
    ],
    keywords: ["Precision Medicine", "Pharmacogenomics", "CPIC", "CIViC", "Knowledge Graph", "Transposable Elements", "Structural Variants", "Temporal Holdout", "TE Insertion Polymorphism"] },
  { id: "catasta", label: "catasta", type: "project", color: "blush", r: 16, x: 1420, y: 720,
    points: [
      "A pattern for turning a research pipeline into an interactive demo without shipping the science to the browser",
      "Python backend where the pipeline stays server-side; TypeScript frontend where people use it",
      "One preprocess → predict → postprocess contract shared by embedded and standalone deployments",
    ],
    keywords: ["FastAPI", "Next.js", "TypeScript", "API Contracts", "Model Serving", "Demo Architecture"] },
  { id: "ponere", label: "ponere", type: "project", color: "blush", r: 17, x: 1668, y: 740,
    points: [
      "Takes a rough idea to a published post: capture, draft, live, dormant — so nothing sits untouched",
      "Platform-specific drafting shaped to how each platform actually works, and a log of what shipped where",
      "Claude-assisted drafting grounded in stored voice and platform notes — always a suggestion, never auto-published",
    ],
    keywords: ["Next.js", "TypeScript", "Claude API", "Content Lifecycle", "Human-in-the-Loop"] },
  { id: "mara", label: "mara", type: "project", color: "blush-deep", r: 19, x: 1610, y: 1050,
    points: [
      "Multi-tenant pricing API for the moving industry: local hourly, interstate tariff, and military 400NG tracks",
      "One survey endpoint estimates weight from job-site photos with a vision model, routes the move, recommends a crew and prices it",
      "Per-tenant rate configuration and scoped API keys stored only as hashes",
      "Distance resolution falls back from paid routing to free routing to a straight-line estimate, so a missing key never stops pricing",
      "Fuel surcharge refreshed weekly by cron; a quarterly Action checks for a newer tariff and opens a pull request for review",
      "In production as a client platform's pricing service; 10 test modules",
    ],
    keywords: ["API Design", "Multi-Tenancy", "API Keys", "Postgres", "Vercel Cron", "Vision-Language Models", "Graceful Degradation", "Vitest"] },

  // ---- Personal tooling. Anchors the upper-left. ----
  { id: "custos", label: "custos", type: "project", color: "blush", r: 16, x: 380, y: 190,
    points: [
      "Cross-portfolio tooling: a rotation report ranking every project by its last commit that touched more than markdown",
      "Documentation activity cannot disguise a stalled project; each row carries its next backlog item",
      "The same script runs locally and as a weekly Action over treeless clones, posting to one issue edited in place",
    ],
    keywords: ["POSIX Shell", "GitHub Actions", "Developer Tooling", "Git Internals", "Automation"] },
  { id: "bibliotheca", label: "bibliotheca", type: "project", color: "blush", r: 17, x: 200, y: 190,
    covers: ["bibliotheca-archive"],
    points: [
      "A public reading shelf driven entirely by filenames, and the private automation behind it",
      "An ISBN-13-named file pushed to a status folder fires an Action that resolves the work through the Google Books API and writes it to the public shelf",
      "Moving a file between folders updates reading status and stamps a completion date",
      "The filesystem is the interface: no form, no database, no admin UI; binaries through Git LFS",
    ],
    keywords: ["GitHub Actions", "Google Books API", "Git LFS", "Static Publishing", "Automation"] },
];

// Edges are the graph's argument — they show why a project belongs to both a
// role and a capability. Ordering is cosmetic; adjacency is derived both ways.
export const EDGES: GraphEdge[] = [
  // Education progression.
  ["bs-biology", "ms-bioinformatics"],
  ["ms-bioinformatics", "phd"],
  ["phd", "grad-researcher"],

  // Capabilities bridge the roles and education that share them. A skill node
  // touching two roles is the statement that the same capability carried across
  // both — that adjacency is the graph's argument, so roles are not wired to
  // each other directly.
  ["bioinformatics", "ms-bioinformatics"],
  ["bioinformatics", "phd"],
  ["bioinformatics", "grad-researcher"],
  ["bioinformatics", "postdoc"],
  ["bioinformatics", "syngenta"],

  ["teaching", "grad-researcher"],
  ["teaching", "postdoc"],
  ["teaching", "bi"],

  ["evaluation", "syngenta"],
  ["evaluation", "consulting"],
  ["evaluation", "bi"],

  ["manifold-stability", "syngenta"],
  ["manifold-stability", "consulting"],

  ["metric-development", "consulting"],
  ["metric-development", "bi"],

  ["perceptual-color", "consulting"],
  ["production-eng", "consulting"],
  ["llm-agents", "bi"],

  ["computer-vision", "consulting"],
  ["data-engineering", "postdoc"],
  ["data-engineering", "syngenta"],
  ["data-engineering", "consulting"],
  ["data-engineering", "bi"],
  ["solution-architecture", "syngenta"],
  ["solution-architecture", "consulting"],
  ["solution-architecture", "bi"],
  ["signal-timeseries", "consulting"],
  ["signal-timeseries", "bi"],
  ["ranking", "consulting"],
  ["ranking", "veridian"],
  ["ranking", "recolo"],

  // Projects attach to the role that produced them and the capabilities they exercise.
  ["repbox", "phd"],
  ["repbox", "bioinformatics"],
  ["lambent", "metric-development"],
  ["lambent", "perceptual-color"],
  ["iridis", "perceptual-color"],
  ["iridis", "metric-development"],
  ["iridis", "manifold-stability"],
  ["argus", "evaluation"],
  ["argus", "computer-vision"],
  ["iridis", "computer-vision"],
  ["lambent", "computer-vision"],
  ["repbox", "data-engineering"],
  ["veridian", "llm-agents"],
  ["veridian", "manifold-stability"],
  ["veridian", "recolo"],
  ["recolo", "llm-agents"],
  ["recolo", "evaluation"],
  ["topos", "manifold-stability"],
  ["topos", "evaluation"],
  ["topos", "fragaria"],
  ["topos", "glyma"],
  ["topos", "sorghum"],
  ["fragaria", "bioinformatics"],
  ["glyma", "bioinformatics"],
  ["sorghum", "bioinformatics"],
  ["scintilla", "teaching"],
  ["scintilla", "llm-agents"],
  ["lumen", "scintilla"],
  ["lumen", "teaching"],
  ["menhir", "production-eng"],
  ["menhir", "llm-agents"],
  ["audire", "production-eng"],

  ["oncos", "computer-vision"],
  ["oncos", "evaluation"],
  ["noul", "ranking"],
  ["noul", "evaluation"],
  ["noul", "llm-agents"],
  ["legere", "computer-vision"],
  ["legere", "llm-agents"],
  ["indicium", "bioinformatics"],
  ["indicium", "repbox"],
  ["ponere", "llm-agents"],
  ["mara", "production-eng"],
  ["custos", "data-engineering"],
  ["custos", "bibliotheca"],

  // Added 2026-09-25 after a tag audit. A tag a project shares with a capability becomes an
  // edge where the line reads cleanly; where it would cut across the graph (iridis to
  // evaluation, lumen to agents), the shared term alone connects them in the vocabulary view.
  ["web-api", "consulting"],
  ["web-api", "menhir"],
  ["web-api", "audire"],
  ["web-api", "ponere"],
  ["web-api", "mara"],
  ["web-api", "catasta"],
  ["veridian", "evaluation"],
  ["fragaria", "manifold-stability"],
  ["glyma", "manifold-stability"],
  ["bibliotheca", "data-engineering"],

  ["stats-ml", "ms-bioinformatics"],
  ["stats-ml", "syngenta"],
  ["stats-ml", "consulting"],
  ["stats-ml", "lambent"],
  ["stats-ml", "oncos"],
];

const ROLE_BY_COMPANY: Record<string, Role> = Object.fromEntries(EXPERIENCE.map((r) => [r.company, r]));

/** Every figure in a role node must appear in its résumé entry, so the two cannot drift. */
const figures = (text: string) => text.match(/\d+(?:[.,]\d+)?/g) ?? [];

function fromResume(n: AuthoredNode): AuthoredNode {
  const role = n.company ? ROLE_BY_COMPANY[n.company] : undefined;
  if (!role) throw new Error(`Role node "${n.id}" names no résumé entry in lib/resume.ts (company: ${n.company ?? "missing"})`);
  const resumeText = [role.title, role.company, role.lead ?? "", role.dateNote ?? "", ...role.bullets].join(" ");
  const resumeFigures = new Set(figures(resumeText));
  for (const f of figures([n.summary ?? "", ...(n.points ?? [])].join(" "))) {
    if (!resumeFigures.has(f)) throw new Error(`Role node "${n.id}" says "${f}", which its résumé entry in lib/resume.ts does not`);
  }
  const year = (m: string) => m.slice(0, 4);
  return { ...n, date: `${year(role.start)}–${role.end ? year(role.end) : "Present"}` };
}

export const NODES: GraphNode[] = AUTHORED.map((raw) => {
  const n = raw.type === "role" ? fromResume(raw) : raw;
  if (n.type !== "project") {
    if (n.summary === undefined) throw new Error(`Graph node "${n.id}" has no summary`);
    return { ...n, summary: n.summary };
  }
  const p = PROJECT_BY_ID[n.id];
  if (!p) throw new Error(`Graph project "${n.id}" has no entry in lib/projects.ts`);
  return { ...n, summary: p.summary, date: p.date, link: p.link, linkLabel: p.linkLabel };
});

export const NODE_BY_ID: Record<string, GraphNode> = Object.fromEntries(NODES.map((n) => [n.id, n]));

/**
 * Tight bounding box of the composition, allowing for each node's radius plus
 * the label sitting beneath it. Fitting to this rather than to CANVAS keeps the
 * graph from floating in dead space when the authored coordinates do not happen
 * to reach the canvas edges.
 */
export const BOUNDS = (() => {
  const LABEL_BELOW = 46;
  const LABEL_SIDE = 62;
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const n of NODES) {
    x0 = Math.min(x0, n.x - n.r - LABEL_SIDE);
    x1 = Math.max(x1, n.x + n.r + LABEL_SIDE);
    y0 = Math.min(y0, n.y - n.r);
    y1 = Math.max(y1, n.y + n.r + LABEL_BELOW);
  }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
})();

/** Undirected adjacency, built once at module load. */
export const ADJACENCY: Record<string, string[]> = (() => {
  const a: Record<string, string[]> = Object.fromEntries(NODES.map((n) => [n.id, [] as string[]]));
  for (const [s, t] of EDGES) {
    if (!a[s] || !a[t]) throw new Error(`Edge references unknown node: ${s} -> ${t}`);
    a[s].push(t);
    a[t].push(s);
  }
  return a;
})();

/**
 * Which nodes share each vocabulary term. Selecting a term reveals the spread of a
 * capability across roles and projects that no single edge expresses — "UMAP" touches
 * a skill, three case studies and a research engine, none of them adjacent.
 */
export const KEYWORD_INDEX: Record<string, string[]> = (() => {
  const idx: Record<string, string[]> = {};
  for (const n of NODES) for (const k of n.keywords ?? []) (idx[k] ??= []).push(n.id);
  return idx;
})();

export const TYPE_LABEL: Record<NodeType, string> = {
  education: "Education",
  role: "Role",
  project: "Project",
  skill: "Capability",
};
