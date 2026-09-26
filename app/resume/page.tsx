import { LINES, SUPPORTING, displayStatus, projectsInArea, type Area, type AreaId } from "@/lib/projects";
import { CERTIFICATIONS, EDUCATION, EXPERIENCE, SKILLS, SUMMARY, emphasisParts, siteDates } from "@/lib/resume";

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
            <a href="mailto:shel.burkes@gmail.com">shel.burkes@gmail.com</a>
            <br />
            <a href="https://sheljustdoes.github.io" target="_blank" rel="noopener">
              sheljustdoes.github.io
            </a>
            <br />
            <a href="https://www.linkedin.com/in/shelburkes/" target="_blank" rel="noopener">
              linkedin.com/in/shelburkes
            </a>
            <br />
            ORCID 0000-0002-7339-1060
          </div>
        </div>
        <div className="title-row">
          <div className="title-dot" style={{ background: "var(--terracotta)" }} />
          <span className="title-mono">Principal Applied Scientist</span>
          <div className="title-dot" style={{ background: "var(--indigo)" }} />
          <span className="title-mono">AI for Life Sciences</span>
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
            dateNote={role.dateNote}
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
              <span className="edu-inst">, {e.institution}</span>
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
              <span className="edu-inst"> — {c.note}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="section-label">Projects</div>
        {LINES.map((area) => (
          <AreaGroup key={area.id} area={area} open />
        ))}
        <div className="supporting-label">Supporting evidence — how the work gets built</div>
        {SUPPORTING.map((area) => (
          <AreaGroup key={area.id} area={area} />
        ))}
      </section>

      <section>
        <div className="section-label">Skills</div>
        <div className="skills-wrap">
          {SKILLS.map((s) => (
            <span key={s} className="skill">
              {s}
            </span>
          ))}
        </div>
      </section>
    </>
  );
}

// One accent per area, so a card's colour says which body of work it belongs to.
const AREA_ACCENT: Record<AreaId, string> = {
  phenotyping: "var(--indigo)",
  structure: "var(--forest)",
  cognition: "var(--terracotta)",
  production: "var(--dusty-blue)",
  learning: "var(--amber)",
  tooling: "var(--sage)",
};

/**
 * One area of the Projects section. Product lines open with their thesis and
 * lead with the flagship; supporting areas start folded, so the lines read first.
 */
function AreaGroup({ area, open = false }: { area: Area; open?: boolean }) {
  const projects = projectsInArea(area.id);
  return (
    <details className={`area area-${area.kind}`} open={open}>
      <summary className="area-summary">
        <span className="area-dot" style={{ background: AREA_ACCENT[area.id] }} />
        <span className="area-label">{area.label}</span>
        <span className="area-count">{projects.length}</span>
      </summary>
      {area.thesis && <p className="area-thesis">{area.thesis}</p>}
      <div className="projects-grid">
        {projects.map((p) => (
          <Project
            key={p.id}
            accent={AREA_ACCENT[area.id]}
            name={`${p.name}.`}
            tag={[p.id === area.flagship && "Flagship", p.date, p.status && displayStatus(p.status)].filter(Boolean).join(" · ")}
            flagship={p.id === area.flagship}
            href={p.link}
            linkLabel={p.linkLabel}
          >
            {p.summary}
          </Project>
        ))}
      </div>
    </details>
  );
}

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
  dateNote,
  title,
  children,
  last,
}: {
  company: string;
  date: string;
  /** A second date line, for a role that overlaps another. */
  dateNote?: string;
  title: string;
  children: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div className="job" style={last ? { borderBottom: "none", marginBottom: 0, paddingBottom: 0 } : undefined}>
      <div className="job-meta">
        <div className="job-company">{company}</div>
        <div className="job-date">{date}</div>
        {dateNote && <div className="job-date">{dateNote}</div>}
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
  flagship = false,
  children,
}: {
  accent: string;
  name: string;
  tag: string;
  flagship?: boolean;
  href?: string;
  linkLabel?: string;
  children: React.ReactNode;
}) {
  const external = href?.startsWith("http");
  return (
    <div className={flagship ? "project project-flagship" : "project"}>
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
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
@import url('https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=DM+Mono:wght@300;400;500&display=swap');
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
.project-link { display: block; margin-top: 10px; font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase;
  color: var(--terracotta); text-decoration: none; }
.project-link:hover { text-decoration: underline; text-underline-offset: 2px; }
/* Each area collapses independently. Open by default so a skim, and a print,
   show everything; the marker is drawn by hand to match the mono labels. */
.area { margin-bottom: 18px; }
.area:last-child { margin-bottom: 0; }
.area-summary { list-style: none; cursor: pointer; display: flex; align-items: center; gap: 10px; padding: 6px 0 10px;
  font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--charcoal); }
.area-summary::-webkit-details-marker { display: none; }
.area-summary::before { content: '▸'; color: var(--warm-taupe); font-size: 0.7rem; transition: transform 0.15s ease; }
.area[open] > .area-summary::before { transform: rotate(90deg); }
.area-summary:hover .area-label { color: var(--terracotta); }
.area-summary:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }
.area-dot { width: 6px; height: 6px; flex-shrink: 0; }
.area-count { color: var(--warm-taupe); letter-spacing: 0.04em; }
.area-thesis { font-family: var(--serif); font-style: italic; font-size: 0.84rem; color: #5a5550; margin: -4px 0 12px 16px; max-width: 62ch; }
/* The flagship spans the row so each line visibly leads with it. */
.project-flagship { grid-column: 1 / -1; border-color: var(--taupe); }
.supporting-label { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--warm-taupe);
  margin: 28px 0 10px; padding-top: 14px; border-top: 1px solid var(--parchment); }
/* Supporting areas start folded on screen; print shows everything. */
@media print { .area-supporting::details-content { content-visibility: visible; } }
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
  .edu-degree, .edu-inst { font-size: 0.84rem; }
}
`;
