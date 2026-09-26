import { LINES, PROJECT_BY_ID, SUPPORTING, displayStatus, projectsInArea, type Project } from "@/lib/projects";

export const metadata = { title: "work — shel." };

// The products view of the portfolio: three lines, each led by its flagship,
// then everything else as supporting evidence. Every word comes from
// lib/projects.ts, so this page cannot say something the résumé does not.

export default function ProjectsIndex() {
  return (
    <>
      <span className="kicker">Work</span>
      <h1>Three product lines.</h1>
      <p className="tagline">
        Each line is led by a flagship. Across all three, results are compared against a plain baseline and a negative result is
        reported as it came out. Everything else is supporting evidence of how the work gets built and shipped.
      </p>

      {LINES.map((area) => {
        const flagship = PROJECT_BY_ID[area.flagship!];
        const rest = projectsInArea(area.id).filter((p) => p.id !== flagship.id);
        return (
          <section key={area.id} className="line">
            <h2>{area.label}</h2>
            <p className="line-thesis">{area.thesis}</p>
            <div className="line-flagship">
              <span className="line-flag-label">Flagship</span>
              <h3>
                {flagship.name}. <span className="line-meta">{meta(flagship)}</span>
              </h3>
              <p>{flagship.summary}</p>
              {flagship.link && <a href={flagship.link}>{flagship.linkLabel ?? "Read the write-up →"}</a>}
            </div>
            <ul className="line-rest">
              {rest.map((p) => (
                <Entry key={p.id} p={p} />
              ))}
            </ul>
          </section>
        );
      })}

      <h2>Supporting evidence</h2>
      {SUPPORTING.map((area) => (
        <section key={area.id} className="support">
          <h3 className="support-label">{area.label}</h3>
          <ul className="line-rest">
            {projectsInArea(area.id).map((p) => (
              <Entry key={p.id} p={p} />
            ))}
          </ul>
        </section>
      ))}

      <style>{INDEX_CSS}</style>
    </>
  );
}

const meta = (p: Project) => [p.date, p.status && displayStatus(p.status)].filter(Boolean).join(" · ");

/** A non-flagship project: name and status, the name linking only where a write-up or public page exists. */
function Entry({ p }: { p: Project }) {
  const external = p.link?.startsWith("http");
  return (
    <li>
      {p.link ? (
        <a href={p.link} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
          {p.name}.
        </a>
      ) : (
        <span className="entry-name">{p.name}.</span>
      )}{" "}
      <span className="line-meta">{meta(p)}</span>
    </li>
  );
}

const INDEX_CSS = `
article .line { margin-bottom: 8px; }
article .line-thesis { font-style: italic; color: #4a4540; }
article .line-flagship { border: 1px solid var(--parchment); border-left: 3px solid var(--terracotta); padding: 16px 20px; margin: 0 0 16px; }
article .line-flag-label { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--terracotta); }
article h3 { font-family: var(--display); font-size: 1.15rem; font-weight: 600; margin: 4px 0 8px; }
article .line-flagship p { font-size: 0.92rem; margin-bottom: 10px; }
article .line-flagship a, article .line-rest a { font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.04em; }
article .line-meta { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase; color: #8a8378; font-weight: 400; }
article .line-rest { list-style: none; padding-left: 0; }
article .line-rest li { padding: 4px 0; border-bottom: 1px solid var(--parchment); }
article .entry-name { font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.04em; }
article .support-label { font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: #6a655e; font-weight: 500; margin-top: 20px; }
@media (max-width: 640px) { article .line-flagship { padding: 14px 16px; } }
`;
