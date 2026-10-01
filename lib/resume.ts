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
export const HEADLINE = { title: "Senior Data Scientist", field: "Applied ML & LLM Systems" };

export const SUMMARY =
  "PhD-trained data scientist with 9+ years across research and industry, building ML and LLM systems and the evaluation that shows whether they work. Paid work spans **LLM classification on regulated pharmaceutical data**, computer vision and recommendation systems deployed for consumer clients, A/B testing and causal inference on product features, and trait prediction from genomic data. Independent work adds an LLM-backed product in production, a multi-tenant API, and retrieval and agent-memory systems, each tested against plain baselines with negative results reported. Has mentored two junior data scientists and, as a graduate student, taught the lab for a graduate bioinformatics course for three terms. Looking for a senior data science role where production ML and careful evaluation both count.";

export const EXPERIENCE: Role[] = [
  {
    title: "Principal Applied Scientist (Contract)",
    company: "Boehringer Ingelheim Animal Health, via Data Science Talent",
    start: "2025-09",
    end: "2026-10",
    bullets: [
      "Designed and built an **LLM-based misinformation detection pipeline** on Databricks and Snowflake that triages social media content about high-visibility products, flagging early misinformation signals and reducing manual review in Sprinklr",
      "Delivered the working proof of concept in **60 days**: automated classification, clustering and trend detection for corporate communications, built on regulated pharmaceutical data under the company's data-access and governance controls, then handed it off for further development",
      "Built the evaluation framework for the pipeline's outputs: success metrics and regression tests for classification with no single right answer",
      "Built a **financial potential model** for commercial excellence in livestock and farming, estimating customers' purchasing capacity to help set targeting and outreach priorities",
      "Owned technical scoping and solution architecture for applied AI work in the Global Animal Health division (Python, PyTorch, TensorFlow), turning ambiguous asks from commercial, corporate affairs and analytics teams into scoped modeling objectives",
      "Mentored **two junior data scientists** through pairing and code review",
    ],
  },
  {
    title: "Data Scientist (Contract)",
    company: "Confidential consumer health-sensing startup",
    start: "2021-09",
    end: "2025-09",
    lead: "Sole data scientist on engagements for the startup's two anchor clients, a Fortune 500 pharmacy group and a global prestige beauty retailer. Part-time until 2022 alongside Syngenta.",
    bullets: [
      "Built a **shade-matching recommendation system** that ranks products by perceptual color distance (CIEDE2000) between a user's perceived and actual shade, applying a color-classification method developed independently on public data; a version was deployed to the client's customers",
      "Built a **CNN-based anomaly detection system** for a client's large clinical imaging database, deployed on AWS SageMaker with automated dataset quality checks and a client-facing SDK, and onboarded the client's engineers onto the SDK",
      "Applied independently developed measures of skin radiance and perceptual skin tone to client data, validating them against the client's expert grading",
      "Designed and analyzed A/B tests and causal inference studies on product features (SQL, Python, AWS Athena), and defined the product health metrics (engagement, retention, conversion) tracked in Plotly Dash and Tableau dashboards",
      "Modeled individual baselines over time from capacitive skin sensor data, and segmented customers with K-means, PCA and UMAP to inform product decisions",
      "Worked as sole data scientist from scoping to handoff, teaching client stakeholders the color science and ranking tradeoffs so their teams could own the delivered systems",
    ],
  },
  {
    title: "Data Scientist",
    company: "Syngenta",
    start: "2021-09",
    end: "2022-09",
    bullets: [
      "Built predictive models on genomic marker data (VCF) for **crop trait prediction**, combining environmental and genetic factors with domain reasoning",
      "Designed and deployed scalable bioinformatics workflows for trait-based prediction, integrating outputs into relational databases",
      "Led the build of a decision-making analytics platform as **Product Owner** on a small blended team, owning the vision and backlog through development (Agile, Scrum)",
    ],
  },
  {
    title: "Postdoctoral Researcher",
    company: "Cooper Lab, North Carolina Research Campus",
    start: "2020-09",
    end: "2021-09",
    bullets: [
      "Designed and implemented the lab's analytical pipelines for large-scale NGS datasets in Python across UNIX and cloud/HPC environments",
      "Developed variant detection and association analysis pipelines linking genetic variation to phenotypes",
      "Trained the lab's graduate and undergraduate researchers: wrote the internal documentation, ran pipeline walkthroughs and supported every researcher using them, taking students with wet-lab backgrounds and no computational experience to running their own NGS analyses",
      "Maintained code documentation and data stewardship practices so datasets stayed reproducible and accessible across ongoing research",
    ],
  },
  {
    title: "Graduate Researcher & Lab Instructor",
    company: "University of North Carolina at Charlotte",
    start: "2017-01",
    end: "2020-09",
    bullets: [
      "Built analytical pipelines in Python and Linux over large Illumina and PacBio sequencing datasets",
      "Turned the repeat-discovery work into **RepBox**, an open-source tool published in BMC Bioinformatics (2023)",
      "Taught the lab for a graduate course, **Biological Basis of Bioinformatics** (BINF 8100), across three Spring semesters at 10–15 students per term",
    ],
  },
];

export const EDUCATION: { degree: string; institution: string; year: string }[] = [
  { degree: "Doctor of Philosophy, Bioinformatics & Computational Biology", institution: "College of Computing and Informatics, University of North Carolina at Charlotte", year: "2020" },
  { degree: "Master of Science, Bioinformatics & Computational Biology", institution: "College of Computing and Informatics, University of North Carolina at Charlotte", year: "2016" },
  { degree: "Bachelor of Science", institution: "University of North Carolina at Charlotte", year: "2013" },
  { degree: "GAANN Fellowship (Graduate Assistance in Areas of National Need)", institution: "University of North Carolina at Charlotte", year: "2020 to 2021" },
];

export const PUBLICATIONS: { citation: string; doi: string }[] = [
  {
    citation: "Burkes-Patton S, Cooper EA, Schlueter J. RepBox: a toolbox for the identification of repetitive elements. BMC Bioinformatics 24, 317 (2023).",
    doi: "10.1186/s12859-023-05419-5",
  },
];

export const CERTIFICATIONS: { name: string; note: string }[] = [
  { name: "Databricks Generative AI Fundamentals (accreditation)", note: "2026" },
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
      "Evaluation design and pre-registered protocols",
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
