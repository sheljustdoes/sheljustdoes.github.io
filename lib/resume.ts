// Every résumé section except Projects (which lives in lib/projects.ts).
//
// The résumé page renders from here, and /resume.json publishes it for the
// Google Doc résumé, whose Apps Script (scripts/resume-sync.gs) rebuilds each
// section to match. Edit the résumé here; the Doc follows the next morning.
//
// Text may mark emphasis with **double asterisks**. The site renders it bold;
// the Doc receives plain text, because its body type carries no inline bold.

export type Month = `${number}-${number}`; // "2025-09"

export type Role = {
  title: string;
  company: string;
  start: Month;
  /** Absent while the role is current. */
  end?: Month;
  /** An italic lead line above the bullets. */
  lead?: string;
  bullets: string[];
};

/** The headline under the name, on the résumé, the homepage and the page metadata. */
export const HEADLINE = { title: "Scientist", field: "I test whether AI works as well for everyone it measures." };

export const SUMMARY =
  "Scientist with a PhD and 11 years of data science and computational research, working on **fairness in measurement**: whether a skin, color or language measure means the same thing for everyone it is applied to, and how to test that with AI evaluation. Independent work shows where common measures break. In iridis, skin-tone measurement error traces to the camera rather than the tone scale, and a per-device color correction reaches ρ 0.915. In lambent, a radiance metric's specular threshold sits 5.3 times higher on the lightest skin type than the darkest. In veridian, an LLM judge is checked against hand-labeled claims because embeddings place a claim and its negation almost together. Before that, four years as sole data scientist at a consumer health-sensing startup, building computer vision models that ran on in-store devices, and applied AI work on a team in a pharmaceutical animal-health division, including an LLM classification pipeline and its regression tests. Mentors junior data scientists, has trained researchers with no computational background to run their own analyses, writes production software including a multi-tenant pricing API, and publishes negative results rather than shipping weaker systems.";

export const EXPERIENCE: Role[] = [
  {
    title: "Principal Applied Scientist (Contract)",
    company: "Boehringer Ingelheim Animal Health, via Data Science Talent",
    start: "2025-09",
    end: "2026-10",
    lead: "On the applied AI team in the Global Animal Health division. Python, PyTorch, TensorFlow, Databricks, Snowflake, GitHub Copilot.",
    bullets: [
      "Contributed to technical scoping and solution architecture for applied AI engagements, drafting conceptual frameworks and first implementation approaches",
      "Built model prototypes and early implementations in Python, PyTorch and TensorFlow, then handed them to engineering teams for production development",
      "Worked with client teams across commercial, corporate affairs and analytics to translate business needs into scoped modeling objectives",
      "Worked within regulated pharmaceutical data-access processes, coordinating permissions so modeling followed internal governance standards",
      "With the team, built an LLM-based **misinformation detection pipeline** on Databricks over social media data in Snowflake: LLM classification of posts through the company's internal gateway of vetted LLM APIs, clustering and trend detection over flagged content, and triage output for review in Sprinklr. Delivered as a proof of concept in **60 days**",
      "The pipeline gave corporate communications earlier signals of misinformation about high-visibility animal health products",
      "Helped define success metrics and regression tests for classification with no single right answer, so changes could be checked before handoff",
      "Built a **financial potential model** for livestock and farming customers, estimating purchasing capacity across major customer portfolios to guide commercial targeting and outreach",
      "Mentored **two junior data scientists** on modeling techniques, code structure and maintainable practices",
      "Contributed to project planning, requirements, documentation and cross-team communication",
    ],
  },
  {
    title: "Senior Data Scientist (Contract)",
    company: "Confidential consumer health-sensing startup",
    start: "2021-09",
    end: "2025-09",
    lead: "Sole data scientist for the startup, owning ML research, measurement methodology and analytics infrastructure from scoping to handoff. Part-time until 2022 alongside Syngenta.",
    bullets: [
      "Built **three anomaly detection models**, including a UV-mode model, in TensorFlow/Keras and PyTorch, trained on SageMaker and run in production on in-store devices for a global prestige beauty retailer and a Fortune 500 pharmacy group",
      "Created image-based measures of **skin radiance**, an attribute that had existed only as a qualitative descriptor, validated against expert grading",
      "Conceived a **skin-tone classification system** on the startup's internal image data, later offered to clients as a paid service",
      "Designed **shade-matching logic** for a luxury beauty house that ranks products by perceptual color distance",
      "Scoped exploratory models for a national beauty retailer and a national pharmacy chain",
      "Owned A/B tests and causal inference studies from protocol design to analysis, isolating the effect of product features on user behavior",
      "Defined core product health metrics (engagement, retention, conversion) used in product, engineering and executive reporting",
      "Segmented customers with K-means, PCA and UMAP, including geolocation analysis, to inform product decisions",
      "Built Plotly Dash and Tableau dashboards and turned findings into development priorities for clients and non-technical stakeholders",
    ],
  },
  {
    title: "Data Scientist",
    company: "Syngenta",
    start: "2021-09",
    end: "2022-09",
    bullets: [
      "Built predictive models on haplotype data to identify traits and optimize product performance based on environmental and genetic factors, combining biological domain reasoning with ML modeling end-to-end",
      "Designed and deployed scalable bioinformatics workflows for trait-based prediction and optimization, integrating outputs into relational databases",
      "Collaborated cross-functionally across the data science lifecycle — data wrangling, exploratory analysis, hypothesis testing, prototyping, validation, and deployment",
      "Launched a decision-making analytic platform as **Product Owner** on a small blended team, owning the product vision and backlog using Agile and Scrum methodologies",
      "Communicated complex analytical work to technical and non-technical stakeholders throughout project execution",
    ],
  },
  {
    title: "Postdoctoral Research Fellow",
    company: "Cooper Lab, North Carolina Research Campus",
    start: "2020-09",
    end: "2021-09",
    lead: "Multicultural Postdoctoral Fellow, University of North Carolina at Charlotte.",
    bullets: [
      "Owned the lab's analytical pipelines for large-scale NGS datasets in Python across UNIX and cloud/HPC environments",
      "Developed pipelines for transposable element polymorphism detection and structural variant association analysis in tomato, linking insertion presence/absence to phenotypes",
      "Mentored the lab's graduate and undergraduate researchers: wrote internal documentation, ran pipeline walkthroughs, and took students with wet-lab backgrounds and no computational experience to running their own NGS analyses",
      "Maintained code documentation and data stewardship so datasets stayed reproducible across ongoing research",
    ],
  },
  {
    title: "Graduate Researcher & Lab Instructor",
    company: "Schlueter Lab, University of North Carolina at Charlotte",
    start: "2015-08",
    end: "2020-09",
    bullets: [
      "Conducted dissertation research on repeat landscapes in Avena (oat), building analytical pipelines in Python and Linux over large Illumina and PacBio sequencing datasets",
      "Integrated data from NCBI and GenBank into large-scale genomic processing workflows",
      "Turned the repeat-discovery work into **RepBox**, an open-source tool published in BMC Bioinformatics (2023)",
      "Taught the lab for a graduate course, **Biological Basis of Bioinformatics** (BINF 8100), across three Spring semesters at 10–15 students per term",
      "Served as teaching assistant for Biological Basis of Bioinformatics",
    ],
  },
];

export const EDUCATION: { degree: string; institution: string; year: string }[] = [
  { degree: "Doctor of Philosophy, Bioinformatics & Computational Biology", institution: "College of Computing and Informatics, University of North Carolina at Charlotte", year: "2020" },
  { degree: "Master of Science, Bioinformatics & Computational Biology", institution: "College of Computing and Informatics, University of North Carolina at Charlotte", year: "2016" },
  { degree: "Bachelor of Science", institution: "University of North Carolina at Charlotte", year: "2013" },
  { degree: "GAANN Fellowship (Graduate Assistance in Areas of National Need)", institution: "University of North Carolina at Charlotte", year: "2017 to 2020" },
  { degree: "Multicultural Postdoctoral Fellowship", institution: "University of North Carolina at Charlotte", year: "2020 to 2021" },
];

export const PUBLICATIONS: { citation: string; doi: string }[] = [
  {
    citation: "Burkes-Patton S, Cooper EA, Schlueter J. RepBox: a toolbox for the identification of repetitive elements. BMC Bioinformatics 24, 317 (2023).",
    doi: "10.1186/s12859-023-05419-5",
  },
];

export const CERTIFICATIONS: { name: string; note: string }[] = [
  { name: "Databricks Generative AI Fundamentals (accreditation)", note: "2026" },
  { name: "Agile Product Owner Role: Foundations, LinkedIn", note: "2021" },
  { name: "Databricks Certified Generative AI Engineer Associate", note: "In progress" },
  { name: "Claude Certified Architect, Foundations (CCAR-F), Anthropic", note: "In progress" },
  { name: "Claude Certified Architect, Professional (CCAR-P), Anthropic", note: "In progress" },
];

/** Grouped, and each skill backed by an Experience bullet or a listed project. */
export const SKILLS: { group: string; items: string[] }[] = [
  { group: "Languages", items: ["Python", "SQL", "TypeScript", "Bash"] },
  {
    group: "ML and statistics",
    items: [
      "PyTorch", "TensorFlow", "scikit-learn", "Computer vision (CNNs)", "Recommendation and ranking",
      "Clustering and dimensionality reduction (K-means, PCA, UMAP)", "A/B testing and causal inference",
      "Statistical modeling",
    ],
  },
  {
    group: "LLM systems",
    items: [
      "LLM classification pipelines", "Multi-provider LLM pipelines with output validation",
      "Retrieval and reranking (BM25, embeddings, cross-encoders)", "Agent memory",
      "Evaluation design and pre-registered protocols", "LLM APIs (Anthropic, OpenAI, Groq)", "Claude Code (skills, subagents, hooks)", "GitHub Copilot",
    ],
  },
  {
    group: "Data and deployment",
    items: ["Databricks", "Snowflake", "AWS (SageMaker, Athena)", "APIs and SDKs", "Plotly Dash and Tableau", "Linux and HPC", "Git"],
  },
  {
    group: "Domains",
    items: ["Regulated pharmaceutical data", "Consumer health and beauty", "Genomics and crop breeding", "Biomedical imaging"],
  },
];

// ---- Formatting shared by the site and the Doc feed ----


/** Years only, so the public résumé never dates a move to the month. */
const year = (m: Month) => m.slice(0, 4);

/** Site: "2025 to 2026". */
export const siteDates = (r: Role) => `${year(r.start)} to ${r.end ? year(r.end) : "Present"}`;

/** Doc: "2025 - 2026". */
export const docDates = (r: Role) => `${year(r.start)} - ${r.end ? year(r.end) : "Present"}`;

/** Emphasis markers removed, for surfaces without inline bold. */
export const plain = (text: string) => text.replace(/\*\*/g, "");

/** Splits on emphasis markers: odd-indexed parts are emphasized. */
export const emphasisParts = (text: string) => text.split("**");
