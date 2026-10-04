import { RESUME_PROJECTS, displayStatus, type AreaId } from "@/lib/projects";
import { CERTIFICATIONS, EDUCATION, EXPERIENCE, HEADLINE, PUBLICATIONS, SKILLS, SUMMARY, emphasisParts, siteDates } from "@/lib/resume";

export const metadata = { title: "shel. — resume" };

export default function ResumePage() {
  return (
    <>
      {/* Same reason as <body> in layout.tsx: dark-mode extensions rewrite this tag
          (adding class="native-dark-class-modified") before hydration. */}
      <style suppressHydrationWarning>{RESUME_CSS}</style>

      <header>
        <div className="header">
          <div className="name">
            Shel Burkes<em>, PhD</em>
          </div>
          <div className="contact">
            <a href="https://sheljustdoes.github.io" target="_blank" rel="noopener">
              sheljustdoes.github.io
            </a>
            <br />
            <a href="https://github.com/sheljustdoes" target="_blank" rel="noopener">
              github.com/sheljustdoes
            </a>
            <br />
            <a href="https://orcid.org/0000-0002-7339-1060" target="_blank" rel="noopener">
              ORCID 0000-0002-7339-1060
            </a>
          </div>
        </div>
        <div className="title-row">
          <div className="title-dot" style={{ background: "var(--terracotta)" }} />
          <span className="title-mono">{HEADLINE.title}</span>
          <div className="title-dot" style={{ background: "var(--indigo)" }} />
          <span className="title-mono">{HEADLINE.field}</span>
        </div>
      </header>

      <section>
        <div className="section-label">Summary</div>
        <p className="summary">
          <Rich text={SUMMARY} />
        </p>
      </section>

      <section>
        <div className="section-label">Experience</div>
        {EXPERIENCE.map((role, i) => (
          <Job
            key={role.company + role.start}
            company={role.company}
            date={siteDates(role)}
            title={role.title}
            last={i === EXPERIENCE.length - 1}
          >
            {role.lead && <div className="job-lead">{role.lead}</div>}
            {role.bullets.map((b) => (
              <li key={b}>
                <Rich text={b} />
              </li>
            ))}
          </Job>
        ))}
      </section>

      <section>
        <div className="section-label">Education</div>
        <ul className="edu-list">
          {EDUCATION.map((e) => (
            <li key={e.degree} className="edu-row">
              <span className="edu-degree">{e.degree}</span>
              <span className="edu-inst">
                , {e.institution}
                {e.year && `, ${e.year}`}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="section-label">Publication</div>
        <ul className="edu-list">
          {PUBLICATIONS.map((p) => (
            <li key={p.doi} className="edu-row">
              <span className="edu-inst">{p.citation} </span>
              <a className="pub-doi" href={`https://doi.org/${p.doi}`} target="_blank" rel="noopener">
                doi:{p.doi}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="section-label">Certifications</div>
        <ul className="edu-list">
          {CERTIFICATIONS.map((c) => (
            <li key={c.name} className="edu-row">
              <span className="edu-degree">{c.name}</span>
              <span className="edu-inst">, {c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="section-label">Selected projects</div>
        <div className="projects-grid">
          {RESUME_PROJECTS.map((p) => (
            <Project
              key={p.id}
              accent={AREA_ACCENT[p.area]}
              name={`${p.name}.`}
              tag={[p.date, p.status && displayStatus(p.status)].filter(Boolean).join(" · ")}
              href={p.link}
              linkLabel={p.linkLabel}
            >
              {p.resumeLine ?? p.summary}
            </Project>
          ))}
        </div>
        <a className="all-projects" href="/projects/">
          All projects →
        </a>
      </section>

      <section>
        <div className="section-label">Skills</div>
        {SKILLS.map((g) => (
          <div key={g.group} className="skill-group">
            <div className="skill-group-label">{g.group}</div>
            <div className="skills-wrap">
              {g.items.map((s) => (
                <span key={s} className="skill">
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}

// One accent per area, so a card's color says which body of work it belongs to.
// Frameworks take the deep blue of the blueprint grid their banners sit on.
const AREA_ACCENT: Record<AreaId, string> = {
  frameworks: "var(--indigo-deep)",
  phenotyping: "var(--terracotta)",
  structure: "var(--forest)",
  production: "var(--dusty-blue)",
  learning: "var(--amber)",
  tooling: "var(--sage)",
};

/** Renders **emphasis** markers from lib/resume.ts as bold. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {emphasisParts(text).map((part, i) => (i % 2 ? <strong key={i}>{part}</strong> : part))}
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
  href,
  linkLabel,
  children,
}: {
  accent: string;
  name: string;
  tag: string;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  const external = href?.startsWith("http");
  return (
    <div className="project">
      <div className="project-accent" style={{ background: accent }} />
      <div className="project-name">{name}</div>
      <div className="project-tag">{tag}</div>
      <div className="project-desc">{children}</div>
      {href && (
        <a className="project-link" href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
          {linkLabel ?? "Read the write-up →"}
        </a>
      )}
    </div>
  );
}

const RESUME_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Mono:wght@300;400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --cream:#F5F1EB; --parchment:#EAE4D9; --taupe:#C8BFB0; --warm-taupe:#C8BFB0;
  --charcoal:#1E1C1A; --ink:#141210; --near-black:#141210;
  --terracotta:#D4603A; --amber:#E8A830; --blush:#E8B4A2; --blush-deep:#D4896E;
  --indigo:#3A4D8F; --indigo-pale:#B8C0DC; --indigo-deep:#2F3E7A; --forest:#2E5A45; --forest-pale:#A8C4B4;
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
.project-link { display: block; margin-top: 10px; font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--terracotta); text-decoration: none; }
.project-link:hover { text-decoration: underline; text-underline-offset: 2px; }
.all-projects { display: inline-block; margin-top: 14px; font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--terracotta); text-decoration: none; }
.all-projects:hover { text-decoration: underline; text-underline-offset: 2px; }
.skill-group { display: grid; grid-template-columns: 148px 1fr; gap: 0 28px; margin-bottom: 10px; }
.skill-group-label { font-family: var(--mono); font-size: 0.63rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--terracotta); padding-top: 6px; }
.pub-doi { font-family: var(--mono); font-size: 0.72rem; color: var(--indigo); text-decoration: none; }
.pub-doi:hover { color: var(--terracotta); }
/* Credentials read as a list, marked with the same arrow the experience
   bullets use, rather than separated by rules. */
.edu-list { list-style: none; padding: 0; margin: 0; }
.edu-row { padding: 3px 0 3px 16px; position: relative; line-height: 1.6; }
.edu-row::before { content: '→'; position: absolute; left: 0; top: 5px; color: var(--warm-taupe); font-family: var(--mono); font-size: 0.68rem; }
/* Serif for the degree, which is the voice of the credential; the institution
   stays regular weight so the qualification leads the line. */
.edu-degree { font-family: var(--serif); font-weight: 600; font-size: 0.9rem; color: var(--charcoal); }
.edu-inst { font-family: var(--serif); font-weight: 400; font-size: 0.9rem; color: var(--ink-soft); }
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
  .skill-group { grid-template-columns: 1fr; gap: 4px; }
  .edu-degree, .edu-inst { font-size: 0.84rem; }
}
`;
