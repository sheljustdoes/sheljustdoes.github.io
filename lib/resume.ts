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
  /** A second date line on the site, for a role that overlaps another. */
  dateNote?: string;
  /** An italic lead line above the bullets. */
  lead?: string;
  bullets: string[];
};

export const SUMMARY =
  "Applied scientist who **builds AI for scientists and teaches scientists to build AI**. PhD-trained data scientist with roots in computational biology and 11+ years across research and industry taking AI from ambiguous problem to production: LLM and agentic applications, retrieval and ranking, computer vision, and the evaluations that prove they work. Four years as sole technical lead on client engagements, from scoping to adoption. Four years teaching graduate and undergraduate researchers. Building **scintilla**, an AI curriculum organized around the Feynman method.";

export const EXPERIENCE: Role[] = [
  {
    title: "Principal Applied Scientist",
    company: "Data Science Talent @ Boehringer Ingelheim",
    start: "2025-09",
    bullets: [
      "Own technical scoping and solution architecture for applied AI consulting engagements within the Global Animal Health division, defining conceptual frameworks and initial implementation approaches in **Python, PyTorch, and TensorFlow**",
      "Mentor junior data scientists on modeling technique, code structure, troubleshooting, and best practices for scalable, maintainable AI development — pairing directly on implementation and reviewing code as it moves toward production",
      "Designed and implemented an **LLM-based misinformation detection pipeline** using Databricks and Snowflake to automate social media content triage and reduce manual review in tools like Sprinklr",
      "Enhanced the organization's ability to identify early signals of misinformation around high-visibility products",
      "Delivered a production-ready proof-of-concept in **60 days**, demonstrating automated content classification, clustering, and trend detection to support faster and more proactive corporate communications workflows",
      "Built evaluation and measurement frameworks for LLM pipeline outputs, defining success metrics and regression tests for classification tasks with no single right answer",
      "Developed a **financial potential modeling tool** to estimate purchasing capacity across major customer portfolios, enabling commercial teams to refine targeting strategies and prioritize high-value outreach",
      "Lead stakeholder engagement across commercial, corporate affairs, and analytics teams, translating ambiguous business needs into scoped, actionable modeling objectives",
      "Navigate regulated data-access processes within a pharmaceutical environment, coordinating permissions, adhering to security protocols, and ensuring modeling activities comply with internal governance and regulatory standards",
      "Contribute to project planning, requirement definition, documentation, and cross-team communication alongside technical execution",
      "Build foundational model prototypes and early-stage implementations, partnering with junior data scientists and software engineers for full development, refinement, and deployment",
      "Support ongoing improvements to analytics and AI workflows, contributing to reproducible code practices, stronger documentation, and responsible adoption of emerging generative AI techniques",
    ],
  },
  {
    title: "Applied Scientist — Computer Vision, Color Science & Health Sensing",
    company: "Independent Consultant",
    start: "2021-09",
    end: "2025-09",
    dateNote: "Part-time until Sep 2022",
    lead: "Independent consulting for consumer health-sensing clients, initially part-time until 09/2022 alongside a full-time role at Syngenta.",
    bullets: [
      "Sole data scientist and technical authority across client engagements, owning client relationships, problem scoping, ML research, measurement methodology, delivery, and ongoing support end to end",
      "Trained client teams to operate the systems delivered: onboarded client engineers onto a delivered SDK and anomaly-detection pipeline, and walked client stakeholders through the shade-matching recommendation system's ranking logic and tradeoffs so their team could own it after handoff",
      "Brought non-specialist clients up to speed on perceptual color science and measurement methodology, building the shared vocabulary they needed to interpret results and make product decisions independently — serving as the bridge between AI capability and real-world scientific need",
      "Applied independently developed methods, built on public data — quantification of skin radiance and perceptual skin tone, attributes previously existing only as qualitative descriptors — to client data, validating them against the client's expert grading",
      "Applied a self-developed perceptual-color classification method to build a shade-matching recommendation system for a client, ranking products by perceptual color distance between a user's perceived and actual shade; a version was deployed to real customers",
      "Built a CNN-based anomaly detection system for a client's large-scale clinical imaging database, deployed via AWS SageMaker with automated dataset quality evaluation and a client-facing SDK",
      "Designed and executed A/B testing and causal inference studies, owning protocol design and analysis to isolate causal effects of product features on user behavior",
      "Worked with real-time capacitive sensor data capturing physiological skin states, building longitudinal profiling systems modeling individual baselines over time",
      "Conducted customer segmentation and clustering using K-means, PCA, and UMAP to drive strategic product decisions",
      "Performed statistical analysis and causal inference using SQL and Python (Pandas, scikit-learn, NumPy, SciPy)",
      "Utilized AWS Athena for large-scale dataset retrieval and processing; MongoDB/geoJSON for geolocation-based behavior analysis",
      "Developed interactive dashboards (Plotly Dash, Tableau) to visualize trends for stakeholder decision-making",
      "Defined and operationalized core product health metrics (engagement, retention, conversion)",
      "Communicated technical findings to clients and non-technical stakeholders, translating business needs into development priorities",
    ],
  },
  {
    title: "Data Scientist",
    company: "Syngenta",
    start: "2021-09",
    end: "2022-09",
    bullets: [
      "Built predictive models on haplotype data to identify traits and optimize product performance based on environmental and genetic factors, combining biological domain reasoning with ML modeling end-to-end.",
      "Designed and deployed scalable bioinformatics workflows for trait-based prediction and optimization, integrating outputs into relational databases.",
      "Collaborated cross-functionally across the data science lifecycle — data wrangling, exploratory analysis, hypothesis testing, prototyping, validation, and deployment.",
      "Launched a decision-making analytic platform as **Product Owner** on a small blended team, owning the product vision and backlog using Agile and Scrum methodologies.",
      "Communicated complex analytical work to technical and non-technical stakeholders throughout project execution.",
    ],
  },
  {
    title: "Postdoctoral Researcher",
    company: "NC Research Campus",
    start: "2020-09",
    end: "2021-09",
    bullets: [
      "Designed and implemented analytical pipelines for large-scale NGS datasets in Python across UNIX and cloud/HPC environments, establishing the computational infrastructure underlying all lab research",
      "Developed pipelines for transposable element polymorphism (TEP) detection and structural variant association analysis, applying GWAS-adjacent methodologies to link insertion presence/absence variations to phenotypic outcomes",
      "Extended NGS pipeline work into protein sequence analysis and peptide/protein structure annotation, building optimization workflows in cloud/HPC environments",
      "Owned computational research projects end to end while training graduate and undergraduate researchers in the lab's analytical methods and pipeline implementation, taking students with wet-lab backgrounds and no computational experience to independently running their own NGS analyses",
      "Served as the lab's de facto computational trainer: wrote the internal documentation, ran walkthrough sessions on the pipelines, and provided ongoing troubleshooting support for every researcher using them",
      "Maintained rigorous code documentation and data stewardship practices, ensuring reproducibility and accessibility of datasets across ongoing research.",
    ],
  },
  {
    title: "Graduate Researcher, Teaching Assistant & Course Instructor",
    company: "University of North Carolina at Charlotte",
    start: "2017-01",
    end: "2020-09",
    bullets: [
      "Conducted dissertation research on large-scale genomic annotation of the **A. sativa genome**, designing and deploying real-time analytical pipelines using Illumina and PacBio sequencing data in Python and Linux environments.",
      "Extracted and integrated data from large bioinformatics databases (NCBI, GenBank), developing optimized workflows for large-scale genomic data processing.",
      "Provided computational support for experimental workflows, collaborating with scientists to optimize data models and ensure efficient data capture.",
      "Independent course instructor for **Biological Basis for Bioinformatics** across three Spring semesters at 10–15 students per term, owning syllabus, lecture material, assignments, assessment, and office hours.",
      "Teaching assistant for introductory biology coursework.",
      "Advised students on bioinformatics tooling, data analysis methodology, and the computational workflows they would encounter in industry rather than only in coursework.",
    ],
  },
];

export const EDUCATION: { degree: string; institution: string }[] = [
  { degree: "Doctor of Philosophy, Bioinformatics & Computational Biology (Data Science)", institution: "University of North Carolina at Charlotte" },
  { degree: "Master of Science, Bioinformatics & Computational Biology (Data Science)", institution: "University of North Carolina at Charlotte" },
  { degree: "Bachelor of Science", institution: "University of North Carolina at Charlotte" },
];

export const CERTIFICATIONS: { name: string; note: string }[] = [
  { name: "Claude Certified Architect — Foundations (CCAR-F), Anthropic", note: "In Progress" },
  { name: "Claude Certified Architect — Professional (CCAR-P), Anthropic", note: "In Progress" },
  { name: "Databricks Certified Generative AI Engineer Associate", note: "In Progress" },
  { name: "Databricks Certified Generative AI Fundamentals", note: "2026" },
];

export const SKILLS = [
  "Large Language Models (LLMs)", "Generative AI", "Agentic AI", "Multi-Agent Systems", "Agent Orchestration",
  "Agent Memory Architecture", "Retrieval-Augmented Generation (RAG)", "Model Context Protocol (MCP)",
  "Tool Use & Structured Output", "Prompt Engineering", "Context Engineering", "Claude / Anthropic API",
  "LLM Evaluation", "Evaluation Frameworks", "Semantic Search", "Embedding-Based Retrieval", "Vector Databases",
  "Ranking & Recommendation Systems", "Knowledge Graph Reasoning", "Entity Relationships", "Semantic Architecture",
  "Machine Learning", "Deep Learning", "PyTorch", "TensorFlow", "Scikit-learn", "Python", "Pandas", "NumPy", "SciPy",
  "Statistical Modeling", "Experimental Design", "A/B Testing", "Causal Inference", "Hypothesis Testing",
  "Model Evaluation", "Model Deployment", "Supervised Learning", "Unsupervised Learning", "Regression Analysis",
  "Classification", "Clustering (K-means, HDBSCAN)", "Dimensionality Reduction (PCA, UMAP)", "Time Series Analysis",
  "Forecasting", "Computer Vision", "CNNs", "Vision Transformers", "Perceptual Color Science (CIE Lab/LCh, CIEDE2000)",
  "Signal Processing", "Bioinformatics", "Biological Sequence Analysis", "NGS Data Analysis", "Bioconda", "SQL",
  "MongoDB (geoJSON)", "MySQL", "NoSQL", "Databricks", "Snowflake", "AWS (Athena, SageMaker, S3)",
  "SDK & API Development", "TypeScript", "React", "Next.js", "Git", "Bash", "Shell Script", "Jupyter Notebook",
  "Data Visualization (Tableau, Plotly Dash)", "Solution Architecture", "Technical Scoping", "Stakeholder Engagement",
  "Product Ownership", "Mentorship", "Curriculum Development", "Technical Training", "Workshop Design",
  "Technical Communication", "Regulated Environment Compliance", "Agile (Jira)", "Kanban (Trello)",
];

// ---- Formatting shared by the site and the Doc feed ----

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Site: "Sep 2025 — Present". */
export const siteDates = (r: Role) => {
  const f = (m: Month) => `${MONTHS[Number(m.slice(5)) - 1]} ${m.slice(0, 4)}`;
  return `${f(r.start)} — ${r.end ? f(r.end) : "Present"}`;
};

/** Doc: "09/2025 - Present", the format the Doc résumé has always used. */
export const docDates = (r: Role) => {
  const f = (m: Month) => `${m.slice(5)}/${m.slice(0, 4)}`;
  return `${f(r.start)} - ${r.end ? f(r.end) : "Present"}`;
};

/** Emphasis markers removed, for surfaces without inline bold. */
export const plain = (text: string) => text.replace(/\*\*/g, "");

/** Splits on emphasis markers: odd-indexed parts are emphasized. */
export const emphasisParts = (text: string) => text.split("**");
