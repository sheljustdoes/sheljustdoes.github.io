export const metadata = { title: "shel. — resume" };

export default function ResumePage() {
  return (
    <>
      <style>{RESUME_CSS}</style>

      <header>
        <div className="header">
          <div className="name">
            Shel Burkes<em>, PhD</em>
          </div>
          <div className="contact">
            <a href="mailto:shel.burkes@gmail.com">shel.burkes@gmail.com</a>
            <br />
            <a href="https://sheljustdoes.github.io" target="_blank" rel="noopener">
              sheljustdoes.github.io
            </a>
            <br />
            ORCID 0000-0002-7339-1060
          </div>
        </div>
        <div className="title-row">
          <div className="title-dot" style={{ background: "var(--terracotta)" }} />
          <span className="title-mono">Principal Applied Scientist</span>
          <div className="title-dot" style={{ background: "var(--indigo)" }} />
          <span className="title-mono">ML Research</span>
          <div className="title-dot" style={{ background: "var(--amber)" }} />
          <span className="title-mono">Health Sensing</span>
          <div className="title-dot" style={{ background: "var(--forest)" }} />
          <span className="title-mono">Computational Biology</span>
        </div>
      </header>

      <section>
        <div className="section-label">Research Profile</div>
        <p className="summary">
          Applied scientist with a research-driven approach to biomedical AI, specializing in the design of{" "}
          <strong>novel measurement frameworks, classification systems, and knowledge architectures</strong> for complex biological data.
          PhD-trained in data science with deep roots in computational biology and bioinformatics, bridging domain expertise in biological
          systems with frontier AI methods — including deep learning, vision transformers, LLM-based pipelines, knowledge graph reasoning,
          and bio-inspired agent architectures. Track record of{" "}
          <strong>building original metrics and validated methodologies in spaces where no prior quantification existed,</strong> from
          perceptual color-clustering pipelines benchmarked against clinical standards to corpus-grounded scientific reasoning tools.
          Experienced in regulated pharmaceutical environments (Boehringer Ingelheim) and high-throughput biological data pipelines.
          Committed to scalable, rigorous AI systems that accelerate biomedical discovery and reflect the full complexity of human biology.
        </p>
      </section>

      <section>
        <div className="section-label">Technical Skills</div>
        <div className="skills-wrap">
          {[
            "Time Series Analysis",
            "Clustering Specialist",
            "Novel Metric Development",
            "Composite Scoring Systems",
            "Physiological Signal Characterization",
          ].map((s) => (
            <span key={s} className="skill core">
              {s}
            </span>
          ))}
          {[
            "LLMs · Generative AI",
            "Agentic AI · RAG",
            "Prompt & Context Engineering",
            "Knowledge Graph Reasoning",
            "Python",
            "PyTorch",
            "TensorFlow",
            "Scikit-learn",
            "Deep Learning",
            "Computer Vision",
            "Statistical Modeling",
            "Experimental Design",
            "Hypothesis Testing",
            "Signal Processing",
            "PCA · UMAP · K-means · HDBSCAN",
            "Model Evaluation",
            "Dimensionality Reduction",
            "Bioinformatics · NGS",
            "SQL · MongoDB · NoSQL",
            "AWS Athena · SageMaker",
            "Databricks · Snowflake",
            "Git · Bash",
            "Tableau · Plotly Dash",
            "Agile · Jira · Kanban",
          ].map((s) => (
            <span key={s} className="skill">
              {s}
            </span>
          ))}
        </div>
      </section>

      <section>
        <div className="section-label">Experience</div>

        <Job company="Boehringer Ingelheim" date="Sep 2025 — Present" title="Principal Applied Scientist">
          <li>
            Own technical scoping and solution architecture for applied AI consulting engagements within the Global Animal Health division,
            defining conceptual frameworks and initial implementation approaches in <strong>Python, PyTorch, and TensorFlow</strong>.
          </li>
          <li>Build foundational model prototypes and early-stage implementations, partnering with junior data scientists and software engineers for full development, refinement, and deployment.</li>
          <li>
            Designed and implemented an <strong>LLM-based misinformation detection pipeline</strong> using Databricks and Snowflake to
            automate social media content triage and reduce manual review — enhancing early identification of misinformation around
            high-visibility products.
          </li>
          <li>
            Delivered a production-ready proof-of-concept in <strong>60 days</strong>, demonstrating automated content classification,
            clustering, and trend detection to support faster, more proactive corporate communications workflows.
          </li>
          <li>
            Built a <strong>financial potential modeling tool</strong> to estimate purchasing capacity across major customer portfolios,
            enabling commercial teams to refine targeting and prioritize high-value outreach.
          </li>
          <li>
            Lead stakeholder engagement across commercial, corporate affairs, and analytics teams, translating ambiguous business needs into
            scoped, actionable modeling objectives.
          </li>
          <li>
            Navigate regulated data-access processes in a pharmaceutical environment, coordinating permissions and ensuring modeling
            activities comply with internal governance and regulatory standards.
          </li>
          <li>Contribute to project planning, requirement definition, documentation, and cross-team communication alongside technical execution.</li>
          <li>Mentor junior data scientists on modeling techniques, code structure, troubleshooting, and best practices for scalable, maintainable AI development.</li>
          <li>Support ongoing improvements to analytics and AI workflows, contributing to reproducible code practices, stronger documentation, and responsible adoption of emerging generative AI techniques.</li>
        </Job>

        <Job company="Independent Consultant" date="Sep 2021 — Sep 2025" title="Applied Scientist — Computer Vision &amp; Health Sensing">
          <div className="job-lead">
            Independent research and consulting for consumer health-sensing clients — initially alongside a full-time role at Syngenta,
            then full-time from 2022 — owning the full scope of ML research, measurement methodology, and analytical infrastructure for
            each engagement.
          </div>
          <li>
            Led original research into computational quantification of physiological skin properties, developing novel metrics and deep
            learning systems to measure attributes — including radiance and tone — previously existing only as qualitative descriptors.
          </li>
          <li>
            Developed composite scoring systems quantifying skin radiance from multi-modal physiological features, validated against expert
            grading.
          </li>
          <li>
            Built a large-scale perceptual skin-tone classification system for a client, trained on a private database of{" "}
            <strong>2M+ images</strong> using Vision Transformers.
          </li>
          <li>Developed a CNN-based anomaly detection system for large-scale clinical imaging databases, deployed via AWS SageMaker with automated dataset quality evaluation and a client-facing SDK.</li>
          <li>
            Designed and executed <strong>A/B testing and causal inference</strong> studies, owning protocol design and analysis to isolate
            causal effects of product features on user behavior.
          </li>
          <li>
            Worked with real-time <strong>capacitive sensor data</strong> capturing physiological skin states, building longitudinal
            profiling systems modeling individual baselines over time.
          </li>
          <li>Conducted customer segmentation and clustering using K-means, PCA, and UMAP to drive strategic product decisions.</li>
          <li>Performed statistical analysis and causal inference using SQL and Python (Pandas, scikit-learn, NumPy, SciPy).</li>
          <li>Utilized AWS Athena for large-scale dataset retrieval and processing; MongoDB/geoJSON for geolocation-based behavior analysis.</li>
          <li>Developed interactive dashboards (Plotly Dash, Tableau) to visualize trends for stakeholder decision-making.</li>
          <li>Defined and operationalized core product health metrics (engagement, retention, conversion).</li>
          <li>Communicated technical findings to clients and non-technical stakeholders, translating business needs into development priorities.</li>
        </Job>

        <Job company="Syngenta" date="Sep 2021 — Sep 2022" title="Data Scientist">
          <li>
            Built <strong>predictive models on haplotype biological datasets</strong> to identify traits and optimize product performance
            based on environmental and genetic factors, combining biological domain reasoning with ML modeling end-to-end.
          </li>
          <li>Designed and deployed scalable bioinformatics workflows for trait-based prediction and optimization, integrating outputs into relational databases.</li>
          <li>Collaborated cross-functionally across the data science lifecycle — data wrangling, exploratory analysis, hypothesis testing, prototyping, validation, and deployment.</li>
          <li>
            Launched a decision-making analytics platform as <strong>Product Owner</strong> on a small blended team, owning the product
            vision and backlog using Agile and Scrum methodologies.
          </li>
          <li>Communicated complex analytical work to technical and non-technical stakeholders throughout project execution.</li>
        </Job>

        <Job company="NC Research Campus" date="Sep 2020 — Sep 2021" title="Postdoctoral Researcher">
          <li>
            Designed and implemented analytical pipelines for large-scale <strong>next-generation sequencing (NGS)</strong> datasets in
            Python across UNIX and cloud/HPC environments, establishing the computational infrastructure underlying all lab research.
          </li>
          <li>
            Developed pipelines for transposable element polymorphism (TEP) detection and structural variant association analysis, applying
            GWAS-adjacent methodologies to link insertion presence/absence variations to phenotypic outcomes.
          </li>
          <li>Extended NGS pipeline work into protein sequence analysis and peptide/protein structure annotation, building optimization workflows in cloud/HPC environments.</li>
          <li>Owned computational research projects end-to-end, collaborating with graduate and undergraduate students on analytical methods and pipeline implementation.</li>
          <li>Maintained rigorous code documentation and data stewardship practices, ensuring reproducibility and accessibility of datasets across ongoing research.</li>
        </Job>

        <Job company="UNC Charlotte" date="Jan 2017 — Sep 2020" title="Graduate Researcher & Teaching Assistant" last>
          <li>
            Conducted dissertation research on large-scale genomic annotation of the <strong>A. sativa genome</strong>, designing and
            deploying real-time analytical pipelines using Illumina and PacBio sequencing data in Python and Linux environments.
          </li>
          <li>Extracted and integrated data from large bioinformatics databases (NCBI, GenBank), developing optimized workflows for large-scale genomic data processing.</li>
          <li>Provided computational support for experimental workflows, collaborating with scientists to optimize data models and ensure efficient data capture.</li>
          <li>Served as teaching assistant and independent course instructor at different points, advising students on bioinformatics tools, data analysis methodologies, and industry-relevant workflows.</li>
        </Job>
      </section>

      <section>
        <div className="section-label">Selected Projects</div>
        <div className="projects-grid">
          <Project accent="var(--indigo)" name="iridis." tag="Perceptual Color Analysis · 2024–">
            Open-data pipeline extracting robust CIE Lab/LCh color features from ~17.8K dermatology images, clustering with MiniBatchKMeans
            and CIEDE2000 perceptual merging. Discovered clusters are ~2.5x more predictable than clinical Fitzpatrick labels from identical
            features.
          </Project>
          <Project accent="var(--indigo-pale)" name="veridian." tag="Research Cognition Engine · 2025–">
            Corpus-grounded research cognition engine: retrieves PubMed literature, clusters and semantically summarizes it, grounds a
            user&apos;s own reasoning against the retrieved corpus, and builds a typed knowledge graph of clusters and entities.
          </Project>
          <Project accent="var(--forest)" name="topos." tag="Stability-First Discovery Framework · 2025–">
            Stability-certified protocol for deciding when latent structure in high-dimensional biological data is real: perturbation
            stability, matched-model comparison, and explicit go/kill criteria before expensive escalation. Applied across three organisms.
          </Project>
          <Project accent="var(--sage)" name="recolo." tag="Agent Memory Architecture · 2026–">
            Bio-inspired memory framework for LLM agents: episodic and semantic memory stores, tunable decay, salience-based retrieval, and
            a scheduled consolidation loop modeled on hippocampal replay. Extends prior semantic-clustering work as a cross-session context
            layer.
          </Project>
          <Project
            wide
            accent="linear-gradient(90deg, var(--indigo) 0%, var(--terracotta) 50%, var(--amber) 100%)"
            name="RepBox."
            tag="BMC Bioinformatics · Published 2023 · doi:10.1186/s12859-023-05419-5"
            stat="Peer-reviewed · BMC Bioinformatics 2023"
          >
            Bioinformatics pipeline for identification and classification of novel repetitive genomic elements. Demonstrated 7% growth in
            detected repetitive elements and increased diversity of identified types across the A. sativa genome.
          </Project>
        </div>
      </section>

      <section>
        <div className="section-label">Education</div>
        <div className="edu-row">
          <div className="edu-level">PhD</div>
          <div className="edu-degree">Data Science &amp; Bioinformatics</div>
          <div className="edu-inst">UNC Charlotte</div>
        </div>
        <div className="edu-row">
          <div className="edu-level">MS</div>
          <div className="edu-degree">Data Science &amp; Bioinformatics</div>
          <div className="edu-inst">UNC Charlotte</div>
        </div>
        <div className="edu-row">
          <div className="edu-level">BS</div>
          <div className="edu-degree">Biology</div>
          <div className="edu-inst">UNC Charlotte</div>
        </div>
      </section>

      <footer className="resume-footer">
        <div className="f-mark">
          shel<span style={{ fontFamily: "var(--display)", fontWeight: 600, color: "var(--charcoal)" }}>.</span>
        </div>
        <div className="f-center">sheljustdoes.github.io &nbsp;·&nbsp; Atlanta Metro &nbsp;·&nbsp; Remote</div>
        <div className="f-right">
          ORCID 0000-0002-7339-1060
          <br />
          shel.burkes
        </div>
      </footer>
    </>
  );
}

function Job({
  company,
  date,
  title,
  children,
  last,
}: {
  company: string;
  date: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="job" style={last ? { borderBottom: "none", marginBottom: 0, paddingBottom: 0 } : undefined}>
      <div className="job-meta">
        <div className="job-company">{company}</div>
        <div className="job-date">{date}</div>
      </div>
      <div className="job-body">
        <div className="job-title">{title}</div>
        <ul>{children}</ul>
      </div>
    </div>
  );
}

function Project({
  accent,
  name,
  tag,
  stat,
  wide,
  children,
}: {
  accent: string;
  name: string;
  tag: string;
  stat?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={`project${wide ? " wide" : ""}`}>
      <div className="project-accent" style={{ background: accent }} />
      <div className="project-name">{name}</div>
      <div className="project-tag">{tag}</div>
      <div className="project-desc">{children}</div>
      {stat && (
        <div>
          <span className="project-stat">{stat}</span>
        </div>
      )}
    </div>
  );
}

const RESUME_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@import url('https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=DM+Mono:wght@300;400;500&display=swap');
:root {
  --cream:#F5F1EB; --parchment:#EAE4D9; --taupe:#C8BFB0; --warm-taupe:#C8BFB0;
  --charcoal:#1E1C1A; --ink:#141210; --near-black:#141210;
  --terracotta:#D4603A; --amber:#E8A830; --blush:#E8B4A2; --blush-deep:#D4896E;
  --indigo:#3A4D8F; --indigo-pale:#B8C0DC; --forest:#2E5A45; --forest-pale:#A8C4B4;
  --dusty-blue:#7A8FB5; --sage:#7A8C6E; --sage-pale:#C4D0B8; --rose-dust:#C4887A;
  --display:'Outfit', sans-serif; --serif:'Lora', Georgia, serif; --mono:'DM Mono', monospace;
}
body { background-color: var(--cream);
  background-image: linear-gradient(rgba(30,28,26,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(30,28,26,0.055) 1px, transparent 1px);
  background-size: 28px 28px; color: var(--charcoal); font-family: var(--serif); font-size: 15px; line-height: 1.6;
  max-width: 860px; margin: 0 auto; padding: 56px 64px 80px; }
.header { display: grid; grid-template-columns: 1fr auto; align-items: end; gap: 32px; margin-bottom: 6px; }
.name { font-family: var(--display); font-size: 3rem; font-weight: 600; letter-spacing: -0.03em; line-height: 1; color: var(--charcoal); }
.name em { font-family: var(--serif); font-style: italic; font-weight: 400; color: var(--terracotta); }
.contact { text-align: right; font-family: var(--mono); font-size: 0.68rem; color: var(--warm-taupe); line-height: 1.9; letter-spacing: 0.02em; }
.contact a { color: var(--indigo); text-decoration: none; }
.contact a:hover { color: var(--terracotta); }
.title-row { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid var(--parchment); margin-top: 10px; }
.title-mono { font-family: var(--mono); font-size: 0.68rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--warm-taupe); }
.title-dot { width: 5px; height: 5px; flex-shrink: 0; }
.section-label { font-family: var(--mono); font-size: 0.63rem; letter-spacing: 0.2em; text-transform: uppercase; color: var(--warm-taupe);
  margin-bottom: 16px; display: flex; align-items: center; gap: 12px; }
.section-label::after { content: ''; flex: 1; height: 1px; background: var(--parchment); }
section { margin-bottom: 40px; }
.summary { font-family: var(--serif); font-size: 0.98rem; line-height: 1.78; color: var(--charcoal); max-width: 700px; }
.summary strong { font-weight: 500; color: var(--indigo); }
.skills-wrap { display: flex; flex-wrap: wrap; gap: 6px; }
.skill { font-family: var(--display); font-size: 0.72rem; font-weight: 600; letter-spacing: 0.01em; color: var(--charcoal);
  border: 1.5px solid var(--charcoal); padding: 4px 14px; border-radius: 999px; background: transparent; }
.skill.core { color: #fff; letter-spacing: 0.07em; }
.skill.core:nth-child(1) { background: var(--indigo); border-color: var(--indigo); }
.skill.core:nth-child(2) { background: var(--terracotta); border-color: var(--terracotta); }
.skill.core:nth-child(3) { background: var(--forest); border-color: var(--forest); }
.skill.core:nth-child(4) { background: var(--amber); border-color: var(--amber); color: var(--near-black); }
.skill.core:nth-child(5) { background: var(--dusty-blue); border-color: var(--dusty-blue); }
.job { display: grid; grid-template-columns: 148px 1fr; gap: 0 28px; margin-bottom: 28px; padding-bottom: 28px; border-bottom: 1px solid var(--parchment); }
.job-meta { padding-top: 2px; }
.job-company { font-family: var(--mono); font-size: 0.63rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terracotta); margin-bottom: 4px; }
.job-date { font-family: var(--mono); font-size: 0.61rem; color: var(--warm-taupe); letter-spacing: 0.04em; line-height: 1.7; }
.job-title { font-family: var(--display); font-size: 0.98rem; font-weight: 600; color: var(--charcoal); letter-spacing: -0.01em; margin-bottom: 8px; }
.job-lead { font-family: var(--serif); font-style: italic; font-size: 0.87rem; color: var(--charcoal); line-height: 1.65; margin-bottom: 10px; padding-left: 12px; border-left: 2px solid var(--terracotta); }
.job ul { list-style: none; padding: 0; }
.job li { font-family: var(--serif); font-size: 0.84rem; color: #4a4540; line-height: 1.65; padding: 2px 0 2px 16px; position: relative; }
.job li::before { content: '→'; position: absolute; left: 0; color: var(--warm-taupe); font-family: var(--mono); font-size: 0.68rem; top: 5px; }
.job li strong { font-weight: 500; color: var(--charcoal); }
.stat-pill { display: inline-block; font-family: var(--display); font-size: 0.65rem; font-weight: 600; letter-spacing: 0.01em; color: var(--forest);
  border: 1.5px solid var(--forest); background: transparent; padding: 2px 10px; border-radius: 999px; margin-left: 3px; position: relative; top: -1px; }
.projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.project { border: 1px solid var(--parchment); padding: 16px 18px; position: relative; }
.project-accent { position: absolute; top: 0; left: 0; width: 100%; height: 3px; }
.project-name { font-family: var(--serif); font-style: italic; font-size: 1rem; font-weight: 500; color: var(--charcoal); margin-bottom: 2px; }
.project-tag { font-family: var(--mono); font-size: 0.59rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--warm-taupe); margin-bottom: 8px; }
.project-desc { font-family: var(--serif); font-size: 0.79rem; color: #5a5550; line-height: 1.6; }
.project-stat { display: inline-block; margin-top: 8px; font-family: var(--display); font-size: 0.68rem; font-weight: 600; letter-spacing: 0.01em;
  color: var(--amber); border: 1.5px solid var(--amber); background: transparent; padding: 3px 12px; border-radius: 999px; }
.project.wide { grid-column: span 2; }
.edu-row { display: grid; grid-template-columns: 148px 1fr auto; gap: 0 28px; align-items: baseline; padding: 9px 0; border-bottom: 1px solid var(--parchment); }
.edu-row:last-child { border-bottom: none; }
.edu-level { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--warm-taupe); }
.edu-degree { font-family: var(--display); font-weight: 500; font-size: 0.88rem; color: var(--charcoal); }
.edu-inst { font-family: var(--mono); font-size: 0.61rem; color: var(--warm-taupe); letter-spacing: 0.04em; text-align: right; }
.resume-footer { margin-top: 48px; padding-top: 16px; border-top: 2px solid var(--charcoal); display: grid; grid-template-columns: 1fr 1fr 1fr; align-items: baseline; }
.resume-footer .f-mark { font-family: var(--display); font-size: 22px; font-weight: 600; letter-spacing: -0.5px; color: var(--charcoal); line-height: 1; }
.resume-footer .f-center { text-align: center; font-family: var(--serif); font-size: 0.81rem; font-style: italic; color: var(--warm-taupe); }
.resume-footer .f-right { text-align: right; font-family: var(--mono); font-size: 0.61rem; color: var(--warm-taupe); letter-spacing: 0.07em; line-height: 2; }
@media print { body { padding: 32px 40px; font-size: 13px; background-image: none; } }
@media (max-width: 640px) {
  body { padding: 28px 20px; }
  .header { grid-template-columns: 1fr; }
  .contact { text-align: left; margin-top: 12px; }
  .name { font-size: 2.2rem; }
  .job { grid-template-columns: 1fr; gap: 4px; }
  .job-meta { display: flex; gap: 16px; align-items: baseline; margin-bottom: 8px; }
  .projects-grid { grid-template-columns: 1fr; }
  .project.wide { grid-column: span 1; }
  .edu-row { grid-template-columns: 1fr; gap: 2px; }
  .edu-inst { text-align: left; }
}
`;
