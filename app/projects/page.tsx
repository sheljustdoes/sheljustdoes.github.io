import { FRAMEWORKS, LINES, PROJECT_BY_ID, SUPPORTING, displayStatus, projectsInArea, type AreaId, type Project } from "@/lib/projects";
import SectionNav from "./SectionNav";

export const metadata = { title: "work — shel." };

// The products view of the portfolio: the frameworks the research builds on, then the research
// areas, each section led by one flagship card with the rest listed below it, then everything
// else as supporting evidence. Every word comes from
// lib/projects.ts, so this page cannot say something the résumé does not.

export default function ProjectsIndex() {
  return (
    <>
      <span className="kicker">Work</span>
      <h1>Selected work.</h1>
      <p className="tagline">
        Frameworks for testing whether a result holds up, the research that uses them, and the systems built along the way. Each
        entry gives its status; research links to a write-up, and supporting work is shown as screenshots.
      </p>

      <SectionNav
        items={[...[...FRAMEWORKS, ...LINES].map((a) => ({ id: a.id, label: NAV_LABEL[a.id] ?? a.label })), { id: "supporting", label: "Supporting" }]}
      />

      {[...FRAMEWORKS, ...LINES].map((area) => {
        const flagship = PROJECT_BY_ID[area.flagship!];
        const rest = projectsInArea(area.id).filter((p) => p.id !== flagship.id);
        const isFramework = FRAMEWORKS.includes(area);
        const kicker = isFramework ? "Foundations" : `Research ${String(LINES.indexOf(area) + 1).padStart(2, "0")}`;
        return (
          <section key={area.id} id={area.id} className="line">
            <SectionHead kicker={kicker} title={area.label} />
            <p className="line-thesis">{area.thesis}</p>
            <div className={isFramework ? "line-flagship framework" : "line-flagship"}>
              <span className="line-flag-label">Flagship</span>
              <h3>
                {flagship.name}. <span className="line-meta">{meta(flagship)}</span>
              </h3>
              <p>{flagship.summary}</p>
              <Links p={flagship} />
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
        <p className="line-thesis">The systems built along the way, shown as they run. Screens use demo data.</p>
        <ol className="tile-grid">
          {SUPPORTING.flatMap((area) => projectsInArea(area.id).map((p) => ({ p, area: area.label }))).map(({ p, area }, i) => (
            <Tile key={p.id} p={p} n={i + 1} area={area} />
          ))}
        </ol>
      </section>

      {/* suppressHydrationWarning: dark-mode browser extensions tag <style> elements before hydration */}
      <style suppressHydrationWarning>{INDEX_CSS}</style>
    </>
  );
}

/** Short names for the section tags, so the bar fits on one line on a laptop. */
const NAV_LABEL: Partial<Record<AreaId, string>> = {
  phenotyping: "Phenotyping",
  structure: "Certified structure",
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

/** A card's link. A visual story is reached from its write-up, never linked here. */
function Links({ p }: { p: Project }) {
  if (!p.link) return null;
  return (
    <p className="line-links">
      <a href={p.link}>{p.linkLabel ?? "Read the write-up →"}</a>
    </p>
  );
}

/**
 * A non-flagship project: name and status. The name links to a write-up or public page where one
 * exists; otherwise it opens the project's summary in place, since a private repo would 404.
 */
function Entry({ p }: { p: Project }) {
  const external = p.link?.startsWith("http");
  if (!p.link) {
    return (
      <li>
        <details className="entry-more">
          <summary>
            <span className="entry-name">{p.name}.</span> <span className="line-meta">{meta(p)}</span>
          </summary>
          <p>{p.summary}</p>
        </details>
      </li>
    );
  }
  return (
    <li>
      <a href={p.link} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
        {p.name}.
      </a>{" "}
      <span className="line-meta">{meta(p)}</span>
    </li>
  );
}

/** A supporting project as a catalog tile: the screenshot, its number, name, and one line. */
function Tile({ p, n, area }: { p: Project; n: number; area: string }) {
  const href = p.link ?? p.shot?.src;
  const external = href?.startsWith("http") || href === p.shot?.src;
  return (
    <li className="tile">
      {p.shot && href && (
        <a className="tile-img" href={href} {...(external ? { target: "_blank", rel: "noopener" } : {})}>
          <img src={p.shot.src} alt={p.shot.alt} loading="lazy" />
        </a>
      )}
      <div className="tile-head">
        <span className="tile-n">{String(n).padStart(2, "0")}</span>
        <h3>{p.link ? <a href={p.link}>{p.name}.</a> : <>{p.name}.</>}</h3>
      </div>
      <p className="line-meta">{[area, meta(p)].join(" · ")}</p>
      {p.shot && <p className="tile-cap">{p.shot.caption}</p>}
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
/* Framework cards carry the blueprint blue instead of the flagship terracotta. */
article .line-flagship.framework { border-left-color: var(--indigo-deep); }
article .line-flag-label { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--terracotta); }
article h3 { font-family: var(--display); font-size: 1.15rem; font-weight: 600; margin: 4px 0 8px; }
article .line-flagship p { font-size: 0.92rem; margin-bottom: 10px; }
article .line-flagship a, article .line-rest a { font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.04em; }
/* Card links as CTA pills: the section-nav shape, filled with the AA-safe terracotta so cream text clears 5:1. */
article .line-flagship .line-links { display: flex; flex-wrap: wrap; gap: 10px; margin: 4px 0 0; }
article .line-flagship .line-links a { font-size: 0.66rem; letter-spacing: 0.08em; text-transform: uppercase; text-decoration: none;
  color: var(--cream); background: #a8431f; border: 1px solid #a8431f; padding: 7px 14px; border-radius: 999px; transition: background 0.15s ease; }
article .line-flagship .line-links a:hover { background: #8a3617; border-color: #8a3617; }
article .line-flagship .line-links a:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { article .line-flagship .line-links a { transition: none; } }
article .line-meta { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.06em; text-transform: uppercase; color: #8a8378; font-weight: 400; }
article .line-rest { list-style: none; padding-left: 0; }
article .line-rest li { padding: 4px 0; border-bottom: 1px solid var(--parchment); }
article .entry-name { font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.04em; }
/* Entries without a page: the name reads as a link and opens the summary in place. */
article .entry-more summary { list-style: none; cursor: pointer; }
article .entry-more summary::-webkit-details-marker { display: none; }
article .entry-more .entry-name { color: #a8431f; text-decoration: underline; }
article .entry-more summary:hover .entry-name { color: #8a3617; }
article .entry-more summary:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }
article .entry-more p { font-size: 0.88rem; margin: 6px 0 4px; color: #4a4540; }
/* Supporting tiles: a catalog grid, wider than the text column. */
article .tile-grid { list-style: none; padding: 0; position: relative; left: 50%; transform: translateX(-50%);
  width: min(1040px, calc(100vw - 32px)); display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px 28px; margin: 28px 0 0; }
article .tile-img { display: flex; align-items: center; justify-content: center; aspect-ratio: 4 / 3; background: var(--parchment);
  padding: 22px; overflow: hidden; }
article .tile-img img { max-width: 100%; max-height: 100%; object-fit: contain; box-shadow: 0 6px 18px rgba(30, 28, 26, 0.14);
  transition: transform 0.25s ease; }
article .tile-img:hover img { transform: translateY(-3px); }
article .tile-img:focus-visible { outline: 2px solid var(--indigo); outline-offset: 2px; }
article .tile-head { display: flex; align-items: baseline; gap: 10px; margin-top: 14px; }
article .tile-n { font-family: var(--display); font-size: 1.4rem; font-weight: 300; color: var(--terracotta); line-height: 1; }
article .tile h3 { margin: 0; font-size: 1.05rem; }
article .tile h3 a { color: inherit; text-decoration: none; font-family: inherit; font-size: inherit; letter-spacing: 0; }
article .tile h3 a:hover { color: var(--terracotta); }
article .tile .line-meta { margin: 2px 0 6px; line-height: 1.5; }
article .tile-cap { font-size: 0.86rem; line-height: 1.55; margin: 0; color: #4a4540; }
@media (max-width: 900px) { article .tile-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 560px) { article .tile-grid { grid-template-columns: 1fr; } }
@media (prefers-reduced-motion: reduce) { article .tile-img img { transition: none; } }
@media (max-width: 640px) {
  article .line-flagship { padding: 14px 16px; }
  article .section-head { margin-top: 48px; }
  article h2.section-title { font-size: 1.5rem; }
}
`;
