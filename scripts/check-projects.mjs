// Post-build drift check: fails the build when lib/projects.ts and PORTFOLIO.md
// disagree, or when a featured or Shipped project has no homepage graph node.
// Runs as `postbuild`, so `npm run build` — and therefore the Pages deploy —
// fails instead of shipping a résumé that has fallen behind.
//
// Reads the built feed (out/resume-projects.json) rather than the TypeScript
// source, so it needs nothing beyond Node.

import { readFileSync } from "node:fs";

const feed = JSON.parse(readFileSync("out/resume-projects.json", "utf8"));
const portfolio = readFileSync("PORTFOLIO.md", "utf8");

const VOCAB = ["Shipped", "Results committed", "Implemented", "Designed"];

// ---- Parse PORTFOLIO.md: `## ` sections, `### ` projects, `**Status:**` lines ----
const canonical = new Map();
/** Section → the id named on its `**Flagship:**` line. */
const flagshipLines = new Map();
let section = null;
let current = null;
for (const line of portfolio.split("\n")) {
  const h2 = line.match(/^## (.+)$/);
  if (h2) {
    section = h2[1].trim();
    current = null;
    continue;
  }
  const flag = line.match(/^\*\*Flagship:\*\* ([\w-]+)/);
  if (flag && section && !current) {
    flagshipLines.set(section, flag[1]);
    continue;
  }
  const h3 = line.match(/^### (.+)$/);
  if (h3) {
    const title = h3[1].trim();
    const id = title.split(" — ")[0].trim();
    current = { id: id === "Additional services" ? "additional" : id, section, status: null };
    canonical.set(current.id, current);
    continue;
  }
  const status = line.match(/^\*\*Status:\*\* (.+)$/);
  if (status && current && current.status === null) {
    current.status = status[1].split(" · ")[0].trim();
  }
}

// ---- Compare against the feed ----
const errors = [];
const seen = new Set();

for (const area of feed.areas) {
  for (const p of area.projects) {
    seen.add(p.id);
    const c = canonical.get(p.id);
    if (!c) {
      errors.push(`${p.id}: in lib/projects.ts but has no "### ${p.id} — …" entry in PORTFOLIO.md`);
      continue;
    }
    if (c.section !== area.portfolioSection) {
      errors.push(`${p.id}: filed under "${area.portfolioSection}" here, but under "${c.section}" in PORTFOLIO.md`);
    }
    if ((c.status ?? null) !== (p.status ?? null)) {
      errors.push(`${p.id}: status "${p.status ?? "(none)"}" here, but "${c.status ?? "(none)"}" in PORTFOLIO.md`);
    }
    if (p.status && !VOCAB.some((v) => p.status.startsWith(v))) {
      errors.push(`${p.id}: status "${p.status}" does not start with ${VOCAB.join(" / ")}`);
    }
  }
}

for (const c of canonical.values()) {
  if (!seen.has(c.id)) {
    errors.push(`${c.id}: in PORTFOLIO.md ("${c.section}") but missing from lib/projects.ts`);
  }
}

// ---- Product lines: each leads with one flagship, first, with a write-up ----
// The flagship is what a reader opens first, so it must have somewhere to go;
// PORTFOLIO.md names the same flagship on the line's `**Flagship:**` line.
for (const area of feed.areas) {
  const named = flagshipLines.get(area.portfolioSection) ?? null;
  if (area.kind === "line") {
    const first = area.projects[0];
    if (!area.flagship) {
      errors.push(`${area.id}: product line with no flagship`);
    } else if (first?.id !== area.flagship) {
      errors.push(`${area.id}: flagship ${area.flagship} must be listed first (found ${first?.id ?? "nothing"})`);
    } else if (!first.link?.startsWith("/projects/")) {
      errors.push(`${area.flagship}: flagship of ${area.id} needs a write-up link under /projects/`);
    }
    if (named !== area.flagship) {
      errors.push(`${area.id}: flagship ${area.flagship ?? "(none)"} here, but PORTFOLIO.md's **Flagship:** line names ${named ?? "nothing"}`);
    }
  } else if (area.flagship || named) {
    errors.push(`${area.id}: supporting areas have no flagship`);
  }
}

// ---- Graph coverage: every featured or Shipped project needs a homepage node ----
// Placement is authored, so a node cannot be generated; the build fails instead,
// so a project cannot reach the résumé and quietly miss the graph.
const graph = readFileSync("lib/graph-data.ts", "utf8");
const graphProjects = new Set([
  ...[...graph.matchAll(/\{ id: "([^"]+)", label: "[^"]*", type: "project"/g)].map((m) => m[1]),
  // A node that stands for a pair names the other entries in `covers`.
  ...[...graph.matchAll(/covers: \[([^\]]*)\]/g)].flatMap((m) => [...m[1].matchAll(/"([^"]+)"/g)].map((c) => c[1])),
]);
for (const area of feed.areas) {
  for (const p of area.projects) {
    const needsNode = p.featured || p.status?.startsWith("Shipped");
    if (needsNode && !graphProjects.has(p.id)) {
      errors.push(`${p.id}: ${p.featured ? "featured" : "Shipped"} but has no node in lib/graph-data.ts — give it a position and edges`);
    }
  }
}

if (errors.length) {
  console.error("\nProject drift — lib/projects.ts, PORTFOLIO.md and the graph disagree:\n");
  for (const e of errors) console.error(`  ✗ ${e}`);
  console.error("\nUpdate lib/projects.ts in the same pass as PORTFOLIO.md.\n");
  process.exit(1);
}

const featured = feed.areas.flatMap((a) => a.projects).filter((p) => p.featured).length;
console.log(`✓ ${seen.size} projects match PORTFOLIO.md (${featured} featured on the Google Doc résumé); ${graphProjects.size} on the graph`);
