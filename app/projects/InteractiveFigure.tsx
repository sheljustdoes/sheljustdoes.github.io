"use client";

import { useEffect, useRef, useState } from "react";

// Pinned cartesian bundle (scatter, bar, heatmap …), loaded only when a figure nears the viewport.
const PLOTLY_SRC = "https://cdn.jsdelivr.net/npm/plotly.js-cartesian-dist-min@4.1.1/plotly-cartesian.min.js";
const PLOTLY_SRI = "sha384-zc4SwKObGL/W0M3RUI09UPWjlgIZHfbwMgcZO6713mRh78tfUmIQKhzCyE2LIiUg";
// Below this width the multi-panel layouts do not fit; the static image and the data table stay.
const MIN_WIDTH = 640;

type Table = { caption: string; columns: string[]; rows: (string | number | null)[][] };
type Spec = { data: unknown[]; layout: Record<string, unknown>; table?: Table };
type PlotlyLike = {
  newPlot: (el: HTMLElement, data: unknown[], layout: unknown, config: unknown) => Promise<unknown>;
  purge: (el: HTMLElement) => void;
  Plots: { resize: (el: HTMLElement) => void };
};

let plotly: Promise<PlotlyLike> | null = null;
function loadPlotly(): Promise<PlotlyLike> {
  const w = window as unknown as { Plotly?: PlotlyLike };
  if (w.Plotly) return Promise.resolve(w.Plotly);
  plotly ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = PLOTLY_SRC;
    s.integrity = PLOTLY_SRI;
    s.crossOrigin = "anonymous";
    s.async = true;
    s.onload = () => (w.Plotly ? resolve(w.Plotly) : reject(new Error("Plotly missing")));
    s.onerror = () => {
      plotly = null;
      reject(new Error("Plotly failed to load"));
    };
    document.head.appendChild(s);
  });
  return plotly;
}

/**
 * A journal-style figure whose chart is interactive (hover, zoom, legend toggles) once Plotly
 * loads. The static PNG shows first and stays as the fallback: without JavaScript, on narrow
 * screens, in print, or if the chart fails to load. The spec's table is offered as a data view.
 */
export default function InteractiveFigure({ n, spec, src, alt, lead, children, slug = "figure", minWidth = MIN_WIDTH, label = "Fig." }: {
  n: number; spec: string; src: string; alt: string; lead: string; children: React.ReactNode;
  slug?: string; minWidth?: number; label?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const plot = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "loading" | "ready">("static");
  const [table, setTable] = useState<Table | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    let canceled = false;
    const start = async () => {
      if (el.clientWidth < minWidth) {
        fetch(spec).then((r) => r.json()).then((s: Spec) => !canceled && setTable(s.table ?? null)).catch(() => {});
        return;
      }
      setState("loading");
      try {
        const [P, s] = await Promise.all([loadPlotly(), fetch(spec).then((r) => r.json() as Promise<Spec>)]);
        if (canceled || !plot.current) return;
        setTable(s.table ?? null);
        await P.newPlot(plot.current, s.data, { ...s.layout, autosize: true }, {
          responsive: true,
          displaylogo: false,
          modeBarButtonsToRemove: ["select2d", "lasso2d", "autoScale2d", "toggleSpikelines", "hoverClosestCartesian", "hoverCompareCartesian"],
          toImageButtonOptions: { format: "png", filename: `${slug}-fig${n}`, scale: 2 },
        });
        if (!canceled) setState("ready");
      } catch (e) {
        console.warn(`Fig. ${n}: interactive chart unavailable, showing the static image`, e);
        if (!canceled) setState("static");
      }
    };
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        start();
      }
    }, { rootMargin: "600px 0px" });
    io.observe(el);
    return () => {
      canceled = true;
      io.disconnect();
      const w = window as unknown as { Plotly?: PlotlyLike };
      if (plot.current && w.Plotly) w.Plotly.purge(plot.current);
    };
  }, [spec, n]);

  // The plot is drawn while hidden (display: none until ready), so Plotly falls back to its default
  // 700 px width. Once React has shown it, resize so the chart fills the figure.
  useEffect(() => {
    const w = window as unknown as { Plotly?: PlotlyLike };
    if (state === "ready" && plot.current && w.Plotly) w.Plotly.Plots.resize(plot.current);
  }, [state]);

  return (
    <figure className="wide ifig" data-state={state}>
      <div ref={box} className="ifig-box">
        <a href={src} target="_blank" rel="noopener" className="ifig-static">
          <img src={src} alt={alt} loading="lazy" />
        </a>
        <div ref={plot} className="ifig-plot" role="img" aria-label={alt} />
      </div>
      <figcaption>
        <span className="fig-lead">
          {label} {n} | {lead}
        </span>{" "}
        {children}
        {state === "ready" && <span className="ifig-hint"> Hover for values; drag to zoom, double-click to reset; click a legend entry to hide it.</span>}
      </figcaption>
      {table && (
        <details className="ifig-data">
          <summary>Show the data</summary>
          <div className="ifig-table">
            <table>
              <caption>{table.caption}</caption>
              <thead>
                <tr>{table.columns.map((c) => <th key={c} scope="col">{c}</th>)}</tr>
              </thead>
              <tbody>
                {table.rows.map((row, i) => (
                  <tr key={i}>{row.map((v, j) => <td key={j}>{v ?? ""}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          <a href={src} target="_blank" rel="noopener">Static image</a>
        </details>
      )}
    </figure>
  );
}
