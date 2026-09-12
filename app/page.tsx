"use client";

import { useState } from "react";
import { ENTRIES, computeProjectCardStyle, type TimelineEntry } from "@/lib/timeline-data";

function find(id: string): TimelineEntry {
  const e = ENTRIES.find((x) => x.id === id);
  if (!e) throw new Error(`Unknown timeline entry: ${id}`);
  return e;
}

function linkLabelFor(entry: TimelineEntry): string {
  if (entry.linkLabel) return entry.linkLabel;
  if (!entry.link) return "Open link ↗";
  if (entry.link.includes("github.com")) return "View on GitHub ↗";
  if (entry.link.includes("doi.org")) return "View publication ↗";
  return "Open link ↗";
}

function externalProps(href: string) {
  return href.startsWith("/") ? {} : { target: "_blank", rel: "noopener" };
}

function link2LabelFor(entry: TimelineEntry): string {
  if (entry.link2Label) return entry.link2Label;
  if (!entry.link2) return "Open link ↗";
  if (entry.link2.includes("github.io")) return "Visit site ↗";
  return "Open link ↗";
}

export default function HomePage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = selectedId ? find(selectedId) : null;

  function toggle(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  // Role cards with a static authored color (kind="role" but styled like a card).
  const roleCard = (id: string, color: string, dark: boolean) => {
    const ink = dark ? { text: "rgba(30,28,26,0.9)", date: "rgba(30,28,26,0.55)" } : { text: "rgba(245,241,235,0.92)", date: "rgba(245,241,235,0.7)" };
    return { "--card-color": `var(--${color})`, "--card-text": ink.text, "--card-date": ink.date } as React.CSSProperties;
  };

  const Trigger = ({
    id,
    variant,
    label,
    date,
    style,
  }: {
    id: string;
    variant: "card" | "text";
    label: React.ReactNode;
    date: string;
    style?: React.CSSProperties;
  }) => (
    <button type="button" className="event-trigger" aria-expanded={selectedId === id} onClick={() => toggle(id)}>
      <div className={`${variant === "card" ? "event-card" : "event-text"}${selectedId === id ? " is-selected" : ""}`} style={style}>
        <span className="date">{date}</span>
        <span className="label">{label}</span>
      </div>
    </button>
  );

  const ProjectTrigger = ({ id, label, dotRef }: { id: string; label: React.ReactNode; dotRef?: (color: string) => void }) => {
    const e = find(id);
    const s = computeProjectCardStyle(colorTokenFor(id), e.ai ?? 0, e.complexity ?? 0);
    dotRef?.(s.color);
    return (
      <Trigger
        id={id}
        variant="card"
        date={e.date}
        label={label}
        style={{ "--card-color": s.color, "--card-text": s.text, "--card-date": s.date } as React.CSSProperties}
      />
    );
  };

  return (
    <div className="page">
      <style>{TIMELINE_CSS}</style>

      <div className="intro-panel">
        <h1>
          shel<span className="period">.</span>
        </h1>
        <p className="subtitle">Principal Applied Scientist</p>
        <ul className="social-icons">
          <li>
            <a href="https://github.com/sheljustdoes" target="_blank" rel="noopener" className="fab fa-github" title="GitHub" aria-label="GitHub" />
          </li>
        </ul>

        <a href="/resume/" target="_blank" rel="noopener" className="resume-btn">
          View résumé ↗
        </a>

        <div className="details-panel" aria-live="polite" aria-atomic="true">
          <div className="details-meta">
            <span className="details-kicker">{selected ? (selected.kind === "project" ? "Project details" : "Career & education details") : "Event details"}</span>
            <button type="button" className="details-clear" aria-label="Clear selected event" onClick={() => setSelectedId(null)}>
              Clear
            </button>
          </div>
          <h2 className="details-title">{selected?.title ?? "Click an event"}</h2>
          <p className="details-date">{selected?.date ?? ""}</p>
          <p className="details-summary">{selected?.summary ?? "Click a career/education event to see a short summary here."}</p>
          {selected?.kind === "project" && selected.tags && selected.tags.length > 0 && (
            <div className="details-tags">
              {selected.tags.slice(0, 12).map((t) => (
                <span key={t} className="details-tag">
                  {t}
                </span>
              ))}
            </div>
          )}
          {selected?.kind === "project" && selected.link && (
            <a className="details-link" href={selected.link} {...externalProps(selected.link)}>
              {linkLabelFor(selected)}
            </a>
          )}
          {selected?.kind === "project" && selected.link2 && (
            <a className="details-link-2" href={selected.link2} {...externalProps(selected.link2)}>
              {link2LabelFor(selected)}
            </a>
          )}
        </div>
      </div>

      <div className="timeline-scroll">
        <div className="timeline-track">
          <Column dot="forest">
            <Trigger id="bs-biology" variant="text" date="2013" label={<>BS Biology<br />UNCC</>} />
          </Column>

          <Column dot="forest">
            <Trigger id="ms-bioinformatics" variant="text" date="2016" label={<>MS Bioinformatics<br />UNCC</>} />
          </Column>

          <Column dot="forest">
            <Trigger id="grad-researcher" variant="card" date="2017–20" label={<>Graduate Researcher<br />&amp; Teaching Assistant<br />UNCC</>} style={roleCard("grad-researcher", "forest", false)} />
          </Column>

          <Column dot="forest" below={<Trigger id="thesis-defense" variant="card" date="Thesis Defense" label={<>Comparative Analysis of<br />Repeat Landscapes<br />in Avena (Oat)</>} style={roleCard("thesis-defense", "forest-pale", true)} />}>
            <Trigger id="phd" variant="text" date="2020" label={<>PhD Bioinformatics<br />UNCC</>} />
          </Column>

          <Column dot="forest-pale">
            <Trigger id="postdoc" variant="card" date="2020–21" label={<>Postdoctoral<br />Researcher<br />NC Research Campus</>} style={roleCard("postdoc", "forest-pale", true)} />
          </Column>

          <Column dot={dotColor("repbox")} projectBelow={<ProjectTrigger id="repbox" label={<>RepBox<br />BMC Bioinformatics<br />Publication</>} />} />

          <Column dot="amber">
            <Trigger id="syngenta" variant="card" date="2021–22" label={<>Data Scientist<br />Syngenta</>} style={roleCard("syngenta", "amber", true)} />
          </Column>

          <Column dot="dusty-blue">
            <Trigger id="fitskin" variant="card" date="2021–25" label={<>Applied Scientist<br />Independent Consultant</>} style={roleCard("fitskin", "dusty-blue", false)} />
          </Column>

          <Column dot={dotColor("argus")} projectBelow={<ProjectTrigger id="argus" label={<>argus.<br />Cell Painting QC<br />Dual-Branch Pipeline</>} />} />
          <Column dot={dotColor("iridis")} projectBelow={<ProjectTrigger id="iridis" label={<>iridis.<br />Color Analysis<br />Lab/LCh Clustering</>} />} />
          <Column dot={dotColor("lambent")} projectBelow={<ProjectTrigger id="lambent" label={<>lambent.<br />Skin Glow<br />Proxy Pipeline</>} />} />

          <Column dot="indigo">
            <Trigger id="bi" variant="card" date="2025–Now" label={<>Principal Applied<br />Scientist<br />Boehringer Ingelheim</>} style={roleCard("bi", "indigo", false)} />
          </Column>

          <Column dot={dotColor("veridian")} projectBelow={<ProjectTrigger id="veridian" label={<>veridian.<br />Research Cognition Engine<br />Literature &amp; Reflection</>} />} />

          {/* topos. + case-study branch tree */}
          <div className="event-col" style={{ width: 600 }}>
            <div className="above" />
            <div className="connector" />
            <div className="dot" style={{ "--dot-color": dotColor("topos") } as React.CSSProperties} />
            <div className="connector" />
            <div className="below">
              <div className="branch-tree">
                <ProjectTrigger id="topos" label={<>topos.<br />Stability-First<br />Discovery Framework</>} />
                <div className="branch-stem" />
                <div className="branch-children branch-children--3">
                  <div className="branch-child">
                    <StaticProjectTrigger id="glyma" color="indigo-soft" dark={false} label={<>glyma.<br />Soybean Haplogroup<br />Discovery</>} />
                  </div>
                  <div className="branch-child">
                    <StaticProjectTrigger id="fragaria" color="indigo-deep" dark={false} label={<>fragaria.<br />Octoploid Strawberry<br />Manifold Genomics</>} />
                  </div>
                  <div className="branch-child">
                    <StaticProjectTrigger id="sorghum" color="indigo" dark={false} label={<>sorghum.<br />Sorghum TIP<br />Stability Case Study</>} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* scintilla. + lumen branch tree */}
          <div className="event-col">
            <div className="above" />
            <div className="connector" />
            <div className="dot" style={{ "--dot-color": dotColor("scintilla") } as React.CSSProperties} />
            <div className="connector" />
            <div className="below">
              <ProjectTrigger id="scintilla" label={<>scintilla.<br />Applied Scientist<br />Curriculum</>} />
              <div className="branch-stem" />
              <div className="branch-children">
                <div className="branch-child">
                  <StaticProjectTrigger id="lumen" color="amber-soft" dark={true} label={<>lumen<br />Projects &amp; Notebooks<br />derived from scintilla.</>} />
                </div>
              </div>
            </div>
          </div>

          <div className="timeline-arrow" />
        </div>
      </div>

      <p className="copyright">&copy; shel burkes, phd</p>
    </div>
  );

  // -- local helpers that need closure over `toggle`/`selectedId` --
  function Column({
    dot,
    children,
    below,
    projectBelow,
  }: {
    dot: string;
    children?: React.ReactNode;
    below?: React.ReactNode;
    projectBelow?: React.ReactNode;
  }) {
    return (
      <div className="event-col">
        <div className="above">{children}</div>
        <div className="connector" />
        <div className="dot" style={{ "--dot-color": dot.startsWith("rgb") ? dot : `var(--${dot})` } as React.CSSProperties} />
        <div className="connector" />
        <div className="below">{below ?? projectBelow}</div>
      </div>
    );
  }

  function StaticProjectTrigger({ id, color, dark, label }: { id: string; color: string; dark: boolean; label: React.ReactNode }) {
    const e = find(id);
    return <Trigger id={id} variant="card" date={e.date} label={label} style={roleCard(id, color, dark)} />;
  }

  function dotColor(id: string): string {
    const e = find(id);
    return computeProjectCardStyle(colorTokenFor(id), e.ai ?? 0, e.complexity ?? 0).color;
  }
}

// Base color token each project card is desaturated from (matches the
// original static HTML's --card-color before the JS-driven adjustment).
function colorTokenFor(id: string): string {
  const map: Record<string, string> = {
    repbox: "dusty-blue",
    argus: "terracotta",
    iridis: "terracotta",
    lambent: "terracotta",
    veridian: "forest",
    topos: "indigo",
    scintilla: "amber",
  };
  return map[id] ?? "terracotta";
}

const TIMELINE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=DM+Mono:wght@300;400;500&display=swap');
@import url('/assets/css/fontawesome-all.min.css');

:root {
  --cream:#f5f1eb; --parchment:#eae4d9; --taupe:#c8bfb0; --warm-taupe:#c8bfb0;
  --charcoal:#1e1c1a; --near-black:#141210; --ink:#141210;
  --terracotta:#d4603a; --amber:#e8a830; --amber-soft:#f0c263; --amber-deep:#b07d1a;
  --blush:#e8b4a2; --blush-deep:#d4896e; --indigo:#3a4d8f; --indigo-pale:#b8c0dc;
  --indigo-soft:#5069a8; --indigo-deep:#2f3e7a; --forest:#2e5a45; --forest-pale:#a8c4b4;
  --dusty-blue:#7a8fb5; --sage:#7a8c6e; --sage-pale:#c4d0b8; --rose-dust:#c4887a; --plum:#7a4d72;
  --g-0:#141210; --g-1:#1e1c1a; --g-2:#2e2b29; --g-3:#45413e; --g-4:#615c58;
  --g-5:#7c7670; --g-6:#a29a92; --g-7:#c8bfb0; --g-8:#e0d9cf; --g-9:#f5f1eb;
  --bg:var(--cream); --surface:var(--parchment); --surface-2:#fbf9f5;
  --ink-mid:rgba(30,28,26,0.72); --ink-soft:rgba(30,28,26,0.52); --rule:rgba(30,28,26,0.14);
  --primary:var(--g-2); --highlight:var(--g-3);
  --display:'Outfit', sans-serif; --serif:'Lora', Georgia, serif;
  --body:'Lora', Georgia, 'Times New Roman', Times, serif;
  --mono:'DM Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; overflow-x: auto; overflow-y: hidden; background-color: var(--bg);
  background-image: linear-gradient(rgba(30,28,26,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(30,28,26,0.055) 1px, transparent 1px);
  background-size: 28px 28px; color: var(--ink); font-family: var(--body); font-size: 14px; -webkit-text-size-adjust: none; }
.page { display: flex; align-items: stretch; min-width: max-content; height: 100%; }
.intro-panel { width: 240px; flex-shrink: 0; display: flex; flex-direction: column; justify-content: flex-start; gap: 0.5rem;
  padding: 2rem 2rem 2rem 2.5rem; border-right: 1px solid var(--rule); position: sticky; left: 0; z-index: 10; background: var(--cream); overflow-y: auto; }
.intro-panel h1 { font-family: var(--display); font-size: 3rem; font-weight: 600; line-height: 1; letter-spacing: -0.03em; color: var(--ink); }
.intro-panel .subtitle { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--taupe); line-height: 1.6; }
.intro-panel h1 .period { font-family: var(--display); font-weight: 600; font-style: normal; color: var(--charcoal); }
.social-icons { list-style: none; display: flex; gap: 0.75rem; margin-top: 0.5rem; }
.social-icons a { display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; border-radius: 50%;
  border: 1px solid var(--rule); color: var(--ink-mid); font-size: 0.78rem; line-height: 1; font-style: normal; text-decoration: none; transition: border-color 0.2s, color 0.2s; }
.social-icons a:hover { border-color: var(--primary); color: var(--primary); }
.resume-btn { display: inline-block; margin-top: 0.75rem; padding: 0.35rem 0.9rem; border: 1.5px solid var(--charcoal); border-radius: 999px;
  font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; background: var(--charcoal); color: var(--cream);
  text-decoration: none; transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease; }
.resume-btn:hover { background: var(--near-black); border-color: var(--near-black); color: var(--cream); }
.details-panel { margin-top: 1.25rem; padding-top: 1rem; border-top: 1px solid var(--rule); }
.details-meta { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.6rem; }
.details-kicker { font-family: var(--mono); font-size: 0.55rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--ink-soft); }
.details-clear { -webkit-appearance: none; appearance: none; background: transparent; border: 0; padding: 0; font-family: var(--mono);
  font-size: 0.55rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--terracotta); cursor: pointer; }
.details-clear:hover { text-decoration: underline; text-underline-offset: 2px; }
.details-title { font-family: var(--display); font-weight: 600; font-size: 1.05rem; line-height: 1.2; letter-spacing: -0.02em; margin-bottom: 0.4rem; }
.details-date { font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 0.6rem; }
.details-summary { font-size: 0.86rem; line-height: 1.55; color: var(--ink-mid); }
.timeline-scroll { flex: 1; overflow-x: visible; overflow-y: hidden; display: flex; align-items: center; }
.timeline-track { position: relative; height: 100%; display: flex; align-items: center; padding: 0 5rem 0 4rem; }
.timeline-track::before { content: ''; position: absolute; top: 50%; left: 0; right: 2rem; height: 1px; background: rgba(30,28,26,0.16); transform: translateY(-50%); z-index: 0; }
.timeline-arrow { position: absolute; right: 1.25rem; top: 50%; transform: translateY(-50%); width: 0; height: 0;
  border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 11px solid rgba(30,28,26,0.16); z-index: 1; }
.event-col { display: flex; flex-direction: column; align-items: center; width: 190px; height: 100%; flex-shrink: 0; z-index: 1; }
.event-trigger { -webkit-appearance: none; appearance: none; display: block; border: 0; padding: 0; background: transparent; color: inherit; font: inherit; cursor: pointer; }
.event-trigger:focus { outline: none; }
.event-trigger:focus-visible .event-card, .event-trigger:focus-visible .event-text { outline: 2px solid rgba(69,65,62,0.55); outline-offset: 3px; }
.event-card.is-selected, .event-text.is-selected { outline: 2px solid rgba(46,43,41,0.35); outline-offset: 3px; }
.above, .below { flex: 1; display: flex; flex-direction: column; align-items: center; width: 100%; }
.above { justify-content: flex-end; padding-bottom: 0.6rem; }
.below { justify-content: flex-start; padding-top: 0.6rem; }
.connector { width: 1px; flex: 0 0 2rem; border-left: 1px dashed rgba(30,28,26,0.12); }
.dot { width: 8px; height: 8px; border-radius: 50%; background: var(--dot-color, var(--warm-taupe)); flex-shrink: 0; z-index: 2; }
.event-card { background: var(--card-color, var(--surface)); border-radius: 4px; padding: 0.5rem 0.9rem; line-height: 1.55; text-align: center; max-width: 175px; border: 1px solid rgba(30,28,26,0.12); }
.event-card .date { display: block; font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.08em; margin-bottom: 0.2rem; color: var(--card-date, var(--ink-soft)); }
.event-card .label { display: block; font-family: var(--display); font-size: 0.76rem; font-weight: 500; letter-spacing: 0.01em; line-height: 1.4; color: var(--card-text, var(--ink)); }
.event-text { text-align: center; max-width: 165px; }
.event-text .date { display: block; font-family: var(--mono); font-size: 0.58rem; letter-spacing: 0.08em; margin-bottom: 0.15rem; color: var(--ink-soft); }
.event-text .label { display: block; font-family: var(--mono); font-size: 0.68rem; line-height: 1.6; color: var(--ink-mid); }
.branch-tree { display: flex; flex-direction: column; align-items: center; width: 100%; }
.branch-stem { width: 1px; height: 0.9rem; border-left: 1px dashed rgba(30,28,26,0.18); }
.branch-children { position: relative; display: flex; gap: 1.5rem; justify-content: center; padding-top: 0.8rem; width: 100%; }
.branch-children::before { content: ''; position: absolute; top: 0; left: calc(50% - 87.5px - 0.75rem); right: calc(50% - 87.5px - 0.75rem); border-top: 1px dashed rgba(30,28,26,0.18); }
.branch-child { position: relative; display: flex; flex-direction: column; align-items: center; width: 175px; flex-shrink: 0; }
.branch-child::before { content: ''; position: absolute; top: -0.8rem; left: 50%; transform: translateX(-50%); width: 1px; height: 0.8rem; border-left: 1px dashed rgba(30,28,26,0.18); }
.branch-children--3::before { left: calc(50% - 199px); right: calc(50% - 199px); }
.details-link, .details-link-2 { display: inline-block; margin-top: 0.75rem; font-family: var(--mono); font-size: 0.6rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--terracotta); text-decoration: none; }
.details-link-2 { margin-left: 0.75rem; }
.details-link:hover, .details-link-2:hover { text-decoration: underline; text-underline-offset: 2px; }
.details-tags { display: flex; flex-wrap: wrap; gap: 0.45rem 0.55rem; margin-top: 0.75rem; }
.details-tag { display: inline-flex; align-items: center; padding: 0.32rem 0.75rem; border-radius: 999px; border: 1.5px solid rgba(30,28,26,0.75);
  background: transparent; font-family: var(--display); font-size: 0.72rem; font-weight: 500; letter-spacing: 0.01em; color: var(--ink);
  transition: background 0.18s ease, color 0.18s ease, border-color 0.18s ease; user-select: none; }
.details-tag:hover { background: rgba(30,28,26,0.92); border-color: rgba(30,28,26,0.92); color: var(--bg); }
.copyright { position: fixed; bottom: 0.75rem; left: 2.5rem; font-family: var(--mono); font-size: 0.55rem; letter-spacing: 0.1em; color: var(--ink-soft); text-transform: uppercase; pointer-events: none; }
`;
