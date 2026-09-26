"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ADJACENCY, BOUNDS, EDGES, KEYWORD_INDEX, NODES, NODE_BY_ID, TYPE_LABEL, type GraphNode } from "@/lib/graph-data";

const FIT_PADDING = 64;
const MIN_K = 0.35;
const MOBILE_MIN_K = 0.56;
const MAX_K = 2.6;

type View = { x: number; y: number; k: number };

function fontFor(t: GraphNode["type"]): string {
  if (t === "skill") return "var(--mono)";
  if (t === "project") return "var(--display)";
  return "var(--serif)";
}

/** Labels carry authored line breaks; render them as tspans so they stay centred. */
function Label({ node, dim }: { node: GraphNode; dim: boolean }) {
  const lines = node.label.split("\n");
  const size = node.type === "skill" ? 12.5 : node.r >= 25 ? 16 : 14;
  const top = node.r + 17;
  return (
    <text
      className="g-label"
      x={node.x}
      y={node.y + top}
      textAnchor="middle"
      fontFamily={fontFor(node.type)}
      fontSize={size}
      fontStyle={node.type === "role" || node.type === "education" ? "italic" : "normal"}
      fontWeight={node.type === "project" ? 500 : 400}
      opacity={dim ? 0.16 : node.type === "skill" ? 0.78 : 1}
    >
      {lines.map((l, i) => (
        <tspan key={i} x={node.x} dy={i === 0 ? 0 : size * 1.18}>
          {l}
        </tspan>
      ))}
    </text>
  );
}

export default function HomePage() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 });
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [hintGone, setHintGone] = useState(false);
  const [activeKw, setActiveKw] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  const activeId = selectedId ?? hoverId;
  const selected = selectedId ? NODE_BY_ID[selectedId] : null;

  const kwNodes = useMemo(() => (activeKw ? new Set(KEYWORD_INDEX[activeKw] ?? []) : null), [activeKw]);
  const neighbours = useMemo(
    () => kwNodes ?? (activeId ? new Set([activeId, ...ADJACENCY[activeId]]) : null),
    [kwNodes, activeId],
  );

  // Fit the authored canvas into the viewport. Re-fits on resize so the default
  // view always frames the whole composition without interaction.
  const fit = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    if (!width || !height) return;
    const narrow = width < 760;
    const pad = narrow ? 16 : FIT_PADDING;
    const fitK = Math.min((width - pad * 2) / BOUNDS.w, (height - pad * 2) / BOUNDS.h);
    const k = narrow ? Math.max(fitK, MOBILE_MIN_K) : fitK;
    setView({
      k,
      x: (width - BOUNDS.w * k) / 2 - BOUNDS.x * k,
      y: (height - BOUNDS.h * k) / 2 - BOUNDS.y * k,
    });
    setReady(true);
  }, []);

  useEffect(() => {
    fit();
    const ro = new ResizeObserver(fit);
    if (wrapRef.current) ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [fit]);

  useEffect(() => {
    const t = setTimeout(() => setHintGone(true), 5200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setActiveKw(null);
        setSelectedId(null);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // ---- pan / zoom. Hand-rolled: no dependency, and the interaction is simple. ----
  const drag = useRef<{ id: number; x: number; y: number; moved: boolean } | null>(null);
  const pinch = useRef<{ d: number; k: number } | null>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());

  const zoomAbout = useCallback((cx: number, cy: number, factor: number) => {
    setView((v) => {
      const k = Math.min(MAX_K, Math.max(MIN_K, v.k * factor));
      if (k === v.k) return v;
      const s = k / v.k;
      return { k, x: cx - (cx - v.x) * s, y: cy - (cy - v.y) * s };
    });
  }, []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      zoomAbout(e.clientX - r.left, e.clientY - r.top, Math.exp(-e.deltaY * 0.0016));
    },
    [zoomAbout],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(a.x - b.x, a.y - b.y), k: view.k };
      drag.current = null;
      return;
    }
    drag.current = { id: e.pointerId, x: e.clientX, y: e.clientY, moved: false };
    // Deliberately NOT capturing the pointer here. Capturing on pointerdown
    // retargets the subsequent click to this wrapper, so clicks never reach the
    // node elements inside and selection silently stops working. Capture is taken
    // in onPointerMove instead, once the gesture is actually a drag.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r || !pinch.current.d) return;
      const target = Math.min(MAX_K, Math.max(MIN_K, pinch.current.k * (d / pinch.current.d)));
      const cx = (a.x + b.x) / 2 - r.left;
      const cy = (a.y + b.y) / 2 - r.top;
      setView((v) => {
        const s = target / v.k;
        return { k: target, x: cx - (cx - v.x) * s, y: cy - (cy - v.y) * s };
      });
      return;
    }

    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && Math.hypot(dx, dy) > 4) {
      d.moved = true;
      // Now that this is a drag and not a tap, capture so the pan survives the
      // pointer leaving the element. A click will not be synthesised afterwards.
      try {
        wrapRef.current?.setPointerCapture(e.pointerId);
      } catch {
        /* capture is best-effort; panning still works without it */
      }
    }
    d.x = e.clientX;
    d.y = e.clientY;
    if (d.moved) setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
  };

  const endPointer = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (wrapRef.current?.hasPointerCapture?.(e.pointerId)) {
      wrapRef.current.releasePointerCapture(e.pointerId);
    }
    if (pointers.current.size < 2) pinch.current = null;
    if (drag.current?.id === e.pointerId) {
      // A drag that never moved is a click on empty canvas: clear selection.
      if (!drag.current.moved && (e.target as Element).classList?.contains("g-surface")) setSelectedId(null);
      drag.current = null;
    }
  };

  const panelRef = useRef<HTMLDivElement | null>(null);

  // The panel overlays the bottom of the canvas. If the node just selected would
  // sit beneath it, lift the view so the node stays visible alongside its detail.
  const keepClear = useCallback((id: string) => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const n = NODE_BY_ID[id];
    requestAnimationFrame(() => {
      const h = wrap.getBoundingClientRect().height;
      const panelH = panelRef.current?.getBoundingClientRect().height ?? 0;
      setView((v) => {
        const screenY = n.y * v.k + v.y;
        const limit = h - panelH - n.r * v.k - 42;
        return screenY > limit ? { ...v, y: v.y - (screenY - limit) } : v;
      });
    });
  }, []);

  const pick = (id: string) => {
    setHintGone(true);
    setActiveKw(null);
    setSelectedId((p) => {
      const next = p === id ? null : id;
      if (next) keepClear(next);
      return next;
    });
  };

  return (
    <div className="page">
      {/* Same reason as <body> in layout.tsx: dark-mode extensions rewrite this tag
          (adding class="native-dark-class-modified") before hydration. */}
      <style suppressHydrationWarning>{GRAPH_CSS}</style>

      <header className="hdr">
        <div className="hdr-id">
          <h1>
            shel<span className="dot-p">.</span>
          </h1>
          <p className="hdr-sub">
            Principal Applied Scientist<span className="hdr-sub-x"> · AI for Life Sciences</span>
          </p>
        </div>
        <nav className="hdr-nav">
          <a href="/projects/">work</a>
          <a href="/resume/">résumé</a>
          <a href="https://github.com/sheljustdoes" target="_blank" rel="noopener">
            github
          </a>
        </nav>
      </header>

      <div
        ref={wrapRef}
        className="canvas-wrap"
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <svg className="canvas" width="100%" height="100%" role="presentation">

          {/* Transparent surface so a click on empty space is detectable. */}
          <rect className="g-surface" x={0} y={0} width="100%" height="100%" fill="transparent" />

          <g
            style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`, opacity: ready ? 1 : 0 }}
            className="g-root"
          >
            <g className="g-edges">
              {EDGES.map(([s, t]) => {
                const a = NODE_BY_ID[s];
                const b = NODE_BY_ID[t];
                const live = kwNodes ? kwNodes.has(s) && kwNodes.has(t) : activeId === s || activeId === t;
                const other = activeId === s ? b : a;
                return (
                  <line
                    key={`${s}-${t}`}
                    x1={a.x}
                    y1={a.y}
                    x2={b.x}
                    y2={b.y}
                    stroke={live ? `var(--${other.color})` : "rgba(30,28,26,0.9)"}
                    strokeWidth={live ? 1.5 : 0.8}
                    opacity={live ? 0.66 : activeId ? 0.04 : 0.17}
                  />
                );
              })}
            </g>

            <g className="g-nodes">
              {NODES.map((n) => {
                const dim = !!neighbours && !neighbours.has(n.id);
                const isSel = selectedId === n.id;
                return (
                  <g
                    key={n.id}
                    className={`g-node${isSel ? " is-sel" : ""}`}
                    tabIndex={0}
                    role="button"
                    aria-pressed={isSel}
                    aria-label={`${n.label.replace(/\n/g, " ")} — ${TYPE_LABEL[n.type]}`}
                    onPointerEnter={() => setHoverId(n.id)}
                    onPointerLeave={() => setHoverId((p) => (p === n.id ? null : p))}
                    onClick={() => pick(n.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        pick(n.id);
                      }
                    }}
                  >
                    {isSel && <circle cx={n.x} cy={n.y} r={n.r + 7} className="g-ring" stroke={`var(--${n.color})`} />}
                    <circle
                      cx={n.x}
                      cy={n.y}
                      r={n.r}
                      fill={n.type === "skill" ? "var(--cream)" : `var(--${n.color})`}
                      stroke={n.type === "skill" ? `var(--${n.color})` : "none"}
                      strokeWidth={n.type === "skill" ? 2 : 0}
                      opacity={dim ? 0.22 : 1}
                      className="g-disc"
                    />
                    <Label node={n} dim={dim} />
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        <div className={`hint${hintGone ? " is-gone" : ""}`}>explore the graph</div>

        {activeKw && (
          <div className="kwbar">
            <span className="kwbar-t">{activeKw}</span>
            <span className="kwbar-n">
              {(KEYWORD_INDEX[activeKw] ?? []).length} node
              {(KEYWORD_INDEX[activeKw] ?? []).length === 1 ? "" : "s"}
            </span>
            <button type="button" className="kwbar-x" onClick={() => setActiveKw(null)}>
              clear
            </button>
          </div>
        )}

        {/* The swatch count mirrors reality: education and capabilities are one
            colour each, roles and projects each span a family. A single dot for
            roles would claim a uniformity the graph does not have. */}
        <div className="legend" aria-hidden="true">
          <span className="lg">
            <span className="sw">
              <i style={{ background: "var(--forest)" }} />
            </span>
            education
          </span>
          <span className="lg">
            <span className="sw">
              <i style={{ background: "var(--plum)" }} />
              <i style={{ background: "var(--dusty-blue)" }} />
              <i style={{ background: "var(--indigo)" }} />
            </span>
            roles — one colour each
          </span>
          <span className="lg">
            <span className="sw">
              <i style={{ background: "var(--terracotta)" }} />
              <i style={{ background: "var(--blush-deep)" }} />
            </span>
            projects
          </span>
          <span className="lg">
            <span className="sw">
              <i className="ring" />
            </span>
            capabilities — shared ones link roles
          </span>
        </div>
      </div>

      <div ref={panelRef} className={`panel${selected ? " is-open" : ""}`} aria-live="polite">
        {selected && (
          <div className="panel-inner">
            <div className="panel-head">
              <span className="panel-kind" style={{ color: `var(--${selected.color})` }}>
                {TYPE_LABEL[selected.type]}
                {selected.date ? ` · ${selected.date}` : ""}
              </span>
              <button type="button" className="panel-x" onClick={() => setSelectedId(null)} aria-label="Close details">
                close
              </button>
            </div>
            <h2 className="panel-title" style={{ fontFamily: fontFor(selected.type) }}>
              {selected.label.replace(/\n/g, " ")}
            </h2>
            <p className="panel-body">{selected.summary}</p>
            {selected.points && selected.points.length > 0 && (
              <ul className="panel-points">
                {selected.points.map((pt, i) => (
                  <li key={i}>{pt}</li>
                ))}
              </ul>
            )}
            {selected.keywords && selected.keywords.length > 0 && (
              <>
                <span className="panel-tags-label">Vocabulary</span>
                <div className="panel-kw">
                  {selected.keywords.map((k) => {
                    const n = (KEYWORD_INDEX[k] ?? []).length;
                    return (
                      <button
                        key={k}
                        type="button"
                        className={`kw${activeKw === k ? " is-on" : ""}${n > 1 ? " is-shared" : ""}`}
                        onClick={() => setActiveKw((p) => (p === k ? null : k))}
                        title={n > 1 ? `${n} nodes share this` : "Only here"}
                      >
                        {k}
                        {n > 1 && <span className="kw-n">{n}</span>}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
            <span className="panel-tags-label">Connected to</span>
            <div className="panel-tags">
              {ADJACENCY[selected.id].map((cid) => {
                const c = NODE_BY_ID[cid];
                return (
                  <button key={cid} type="button" className="tag" onClick={() => pick(cid)} style={{ borderColor: `var(--${c.color})` }}>
                    <span className="tag-dot" style={{ background: `var(--${c.color})` }} />
                    {c.label.replace(/\n/g, " ")}
                  </button>
                );
              })}
            </div>
            {selected.link && (
              <a className="panel-link" href={selected.link} {...(selected.link.startsWith("/") ? {} : { target: "_blank", rel: "noopener" })}>
                {selected.linkLabel ?? "Open ↗"}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const GRAPH_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600&family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=DM+Mono:wght@300;400;500&display=swap');

:root {
  --cream:#f5f1eb; --parchment:#eae4d9; --taupe:#c8bfb0;
  --charcoal:#1e1c1a; --near-black:#141210; --ink:#141210;
  --terracotta:#d4603a; --amber:#e8a830; --amber-soft:#f0c263; --amber-deep:#b07d1a;
  --blush:#e8b4a2; --blush-deep:#d4896e; --rose-dust:#c4887a;
  --indigo:#3a4d8f; --indigo-pale:#b8c0dc; --indigo-soft:#5069a8; --indigo-deep:#2f3e7a;
  --forest:#2e5a45; --forest-pale:#a8c4b4;
  --dusty-blue:#7a8fb5; --sage:#7a8c6e; --sage-pale:#c4d0b8; --plum:#7a4d72;
  --stone:#9b948a;
  --ink-mid:rgba(30,28,26,0.72); --ink-soft:rgba(30,28,26,0.52);
  --rule:rgba(30,28,26,0.14);
  --display:'Outfit', sans-serif;
  --serif:'Lora', Georgia, serif;
  --mono:'DM Mono', ui-monospace, Menlo, monospace;
}

*, *::before, *::after { box-sizing: border-box; }

.page {
  position: fixed; inset: 0; display: flex; flex-direction: column;
  background-color: var(--cream);
  /* grid paper: the order the nodes float against */
  background-image:
    linear-gradient(rgba(30,28,26,0.055) 1px, transparent 1px),
    linear-gradient(90deg, rgba(30,28,26,0.055) 1px, transparent 1px);
  background-size: 28px 28px;
  color: var(--ink); font-family: var(--serif);
  overflow: hidden;
}

/* ---- header: disciplined and quiet, so the graph is the disruption ---- */
.hdr {
  flex: none; display: flex; align-items: flex-end; justify-content: space-between;
  gap: 24px; padding: 26px 32px 18px;
}
.hdr-id h1 {
  margin: 0; font-family: var(--display); font-weight: 500;
  font-size: 2rem; letter-spacing: -0.02em; line-height: 1;
}
.dot-p { color: var(--terracotta); }
.hdr-sub {
  margin: 7px 0 0; font-family: var(--mono); font-size: 0.68rem;
  letter-spacing: 0.13em; text-transform: uppercase; color: var(--ink-soft);
}
.hdr-nav { display: flex; gap: 20px; }
.hdr-nav a {
  font-family: var(--mono); font-size: 0.72rem; letter-spacing: 0.08em;
  color: var(--ink-mid); text-decoration: none; padding-bottom: 2px;
  border-bottom: 1px solid var(--rule); transition: color .2s, border-color .2s;
}
.hdr-nav a:hover { color: var(--terracotta); border-color: var(--terracotta); }

/* ---- canvas ---- */
.canvas-wrap { position: relative; flex: 1 1 auto; min-height: 0; touch-action: none; cursor: grab; }
.canvas-wrap:active { cursor: grabbing; }
.canvas { display: block; width: 100%; height: 100%; }
.g-root { transform-origin: 0 0; transition: opacity .5s ease; }
.g-edges line, .g-disc, .g-label { transition: opacity .24s ease, stroke .24s ease, stroke-width .24s ease; }

.g-node { cursor: pointer; outline: none; }
.g-node .g-disc { transition: opacity .28s ease, transform .2s ease; transform-origin: center; }
.g-node:hover .g-disc { filter: brightness(1.05); }
.g-node:focus-visible .g-disc { stroke: var(--ink); stroke-width: 2; }
.g-label { fill: var(--ink); paint-order: stroke; stroke: var(--cream); stroke-width: 3.5px; stroke-linejoin: round; pointer-events: none; }
.g-ring { fill: none; stroke-width: 1.4; opacity: .85; }

/* ---- first-visit nudge ---- */
.hint {
  position: absolute; left: 50%; bottom: 26px; transform: translateX(-50%);
  font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.18em;
  text-transform: uppercase; color: var(--ink-soft); opacity: 0;
  animation: hintIn .9s ease .7s forwards; pointer-events: none; white-space: nowrap;
}
.hint.is-gone { animation: hintOut .7s ease forwards; }
@keyframes hintIn { to { opacity: .55; } }
@keyframes hintOut { to { opacity: 0; } }

/* ---- legend ---- */
.legend { position: absolute; left: 32px; bottom: 22px; display: flex; flex-direction: column; gap: 5px; pointer-events: none; }
.lg {
  font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.1em;
  color: var(--ink-soft); display: flex; align-items: center; gap: 7px;
}
.sw { display: inline-flex; gap: 3px; flex: none; }
.sw i { display: block; width: 8px; height: 8px; border-radius: 50%; box-sizing: border-box; }
.sw i.ring { background: var(--cream); border: 2px solid var(--stone); }

/* ---- detail panel: a tooltip that grew up ---- */
.panel {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 5;
  border-top: 1px solid var(--rule); background: rgba(245,241,235,0.95);
  backdrop-filter: blur(10px);
  max-height: 0; overflow: hidden;
  transform: translateY(14px); opacity: 0; pointer-events: none;
  transition: max-height .34s ease, transform .34s ease, opacity .26s ease;
}
.panel.is-open { max-height: 52vh; transform: translateY(0); opacity: 1; overflow-y: auto; pointer-events: auto; }
.panel-inner { padding: 18px 32px 26px; max-width: 1340px; }
.panel-head { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; }
.panel-kind { font-family: var(--mono); font-size: 0.64rem; letter-spacing: 0.14em; text-transform: uppercase; }
.panel-x {
  font-family: var(--mono); font-size: 0.64rem; letter-spacing: 0.1em; color: var(--ink-soft);
  background: none; border: none; cursor: pointer; padding: 2px 0;
}
.panel-x:hover { color: var(--terracotta); }
.panel-title { margin: 6px 0 10px; font-size: 1.45rem; font-weight: 500; letter-spacing: -0.01em; }
.panel-body { margin: 0 0 14px; font-size: 0.93rem; line-height: 1.62; color: var(--ink-mid); max-width: 72ch; }
.panel-points { margin: 0 0 16px; padding: 0; list-style: none; max-width: 78ch; }
/* Wide viewports have the horizontal room; using it keeps the panel short
   enough that it never swallows the graph. */
@media (min-width: 1080px) {
  .panel-body { max-width: 80ch; }
  .panel-points { max-width: none; columns: 2; column-gap: 44px; }
  .panel-points li { break-inside: avoid; page-break-inside: avoid; }
}
.panel-points li {
  position: relative; padding-left: 16px; margin-bottom: 6px;
  font-size: 0.875rem; line-height: 1.58; color: var(--ink-mid);
}
.panel-points li::before {
  content: ''; position: absolute; left: 0; top: 0.62em;
  width: 5px; height: 1px; background: var(--taupe);
}
.panel-tags-label {
  display: block; margin-bottom: 7px; font-family: var(--mono);
  font-size: 0.58rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--ink-soft);
}
/* Vocabulary chips are flat and non-interactive — they are terminology, not
   navigation. The connection tags below them are the clickable ones. */
.panel-kw { display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 16px; }
.kw {
  display: inline-flex; align-items: center; gap: 5px;
  font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.02em;
  padding: 3px 8px; border-radius: 3px; border: 1px solid transparent;
  background: rgba(30,28,26,0.045); color: var(--ink-soft);
  cursor: pointer; transition: background .16s, color .16s, border-color .16s;
}
.kw.is-shared { color: var(--ink-mid); }
.kw:hover { background: rgba(30,28,26,0.09); color: var(--ink); }
.kw.is-on { background: var(--charcoal); color: var(--cream); border-color: var(--charcoal); }
.kw-n { font-size: 0.56rem; opacity: .6; }
.kw.is-on .kw-n { opacity: .8; }
.kwbar {
  position: absolute; left: 50%; top: 16px; transform: translateX(-50%);
  display: flex; align-items: center; gap: 12px; z-index: 6;
  padding: 7px 14px; border: 1px solid var(--rule); border-radius: 999px;
  background: rgba(245,241,235,0.95); backdrop-filter: blur(8px);
  font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.04em;
}
.kwbar-t { color: var(--ink); }
.kwbar-n { color: var(--ink-soft); }
.kwbar-x { background: none; border: none; cursor: pointer; font: inherit; color: var(--terracotta); padding: 0; }
.panel-tags { display: flex; flex-wrap: wrap; gap: 7px; }
.tag {
  display: inline-flex; align-items: center; gap: 6px;
  font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.04em;
  padding: 4px 10px; border: 1px solid var(--rule); border-radius: 999px;
  background: transparent; color: var(--ink-mid); cursor: pointer;
  transition: background .18s, color .18s;
}
.tag:hover { background: rgba(30,28,26,0.05); color: var(--ink); }
.tag-dot { width: 6px; height: 6px; border-radius: 50%; flex: none; }
.panel-link {
  display: inline-block; margin-top: 14px; font-family: var(--mono); font-size: 0.7rem;
  letter-spacing: 0.06em; color: var(--terracotta); text-decoration: none;
  border-bottom: 1px solid currentColor; padding-bottom: 1px;
}

@media (max-width: 760px) {
  /* Plain block stacking on narrow screens. Flex with space-between kept
     pushing the nav past the right edge here, and there is nothing to gain
     from horizontal distribution at this width. */
  .hdr { display: block; padding: 12px 18px 8px; }
  .hdr-id h1 { font-size: 1.4rem; }
  .hdr-sub { margin-top: 4px; font-size: 0.58rem; letter-spacing: 0.1em; }
  .hdr-sub-x { display: none; }
  .hdr-nav { margin-top: 8px; gap: 16px; justify-content: flex-start; }
  .hdr-nav a { font-size: 0.66rem; letter-spacing: 0.05em; }
  .hdr-nav a { font-size: 0.64rem; letter-spacing: 0.05em; }
  .legend { display: none; }
  .panel-inner { padding: 16px 20px 20px; }
  .panel.is-open { max-height: 56vh; }
  .panel-title { font-size: 1.2rem; }
}

@media (prefers-reduced-motion: reduce) {
  .g-root, .g-edges line, .g-disc, .g-label, .panel { transition: none; }
  .hint { animation: none; opacity: .55; }
  .hint.is-gone { opacity: 0; }
}
`;
