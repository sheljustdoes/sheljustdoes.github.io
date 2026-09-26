import { LINES, PROJECT_BY_ID, SUPPORTING, displayStatus, projectsInArea, type AreaId, type Project } from "@/lib/projects";
import SectionNav from "./SectionNav";

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

      <SectionNav
        items={[...LINES.map((a) => ({ id: a.id, label: NAV_LABEL[a.id] ?? a.label })), { id: "supporting", label: "Supporting" }]}
      />

      {LINES.map((area, i) => {
        const flagship = PROJECT_BY_ID[area.flagship!];
        const rest = projectsInArea(area.id).filter((p) => p.id !== flagship.id);
        return (
          <section key={area.id} id={area.id} className="line">
            <SectionHead kicker={`Line ${String(i + 1).padStart(2, "0")}`} title={area.label} />
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

      <section id="supporting">
        <SectionHead kicker="Everything else" title="Supporting evidence" />
        {SUPPORTING.map((area) => (
          <div key={area.id} className="support">
            <h3 className="support-label">{area.label}</h3>
            <ul className="line-rest">
              {projectsInArea(area.id).map((p) => (
                <Entry key={p.id} p={p} />
              ))}
            </ul>
          </div>
        ))}
      </section>

      <style>{INDEX_CSS}</style>
    </>
  );
}

/** Short names for the section tags, so the bar fits on one line on a laptop. */
const NAV_LABEL: Partial<Record<AreaId, string>> = {
  phenotyping: "Phenotyping",
  structure: "Certified structure",
  cognition: "Research cognition",
};

/**
 * The section heading carries the page's structure, so it has to outrank the
 * flagship card below it: display face, larger than the card's title, under a
 * heavy rule. The write-up h2 style (small mono label) is too quiet for that.
 */
function SectionHead({ kicker, title }: { kicker: string; title: string }) {
  return (
    <header className="section-head">
      <span className="section-kicker">{kicker}</span>
      <h2 className="section-title">{title}</h2>
    </header>
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
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
/* Persistent section tags. Sections leave room for the bar when jumped to. */
article .section-nav { position: sticky; top: 0; z-index: 5; display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none;
  margin: 8px -32px 0; padding: 12px 32px; background: var(--cream); border-bottom: 1px solid var(--parchment); }
article .section-nav::-webkit-scrollbar { display: none; }
article .section-nav a { flex-shrink: 0; font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.08em; text-transform: uppercase;
  text-decoration: none; color: #4a4540; border: 1px solid var(--taupe); padding: 6px 12px; border-radius: 999px; }
article .section-nav a:hover { border-color: var(--terracotta); color: var(--terracotta); }
article .section-nav a:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }
article .section-nav a.is-active { background: var(--charcoal); border-color: var(--charcoal); color: var(--cream); }
article section[id] { scroll-margin-top: 64px; }
article .line { margin-bottom: 8px; }
article .section-head { margin: 64px 0 14px; padding-top: 18px; border-top: 3px solid var(--charcoal); }
article .section-kicker { display: block; font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--terracotta); margin-bottom: 6px; }
article h2.section-title { display: block; margin: 0; font-family: var(--serif); font-size: 1.9rem; font-weight: 500; letter-spacing: -0.01em;
  line-height: 1.15; text-transform: none; color: var(--charcoal); }
article h2.section-title::after { content: none; }
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
/* Projects sit one step in under their supporting subheading. */
article .support .line-rest { padding-left: 24px; }
article .support-label { font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.12em; text-transform: uppercase; color: #6a655e; font-weight: 500; margin-top: 20px; }
@media (max-width: 640px) {
  article .line-flagship { padding: 14px 16px; }
  article .section-head { margin-top: 48px; }
  article h2.section-title { font-size: 1.5rem; }
}
`;
