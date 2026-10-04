// Force simulation for the homepage graph.
//
// Every node has a fixed home: its authored position in lib/graph-data.ts. The layout is
// the same on every load, so a reader can learn where things live (Shel's call,
// 2026-10-03, replacing the per-load random layout of 2026-09-27).
//
// The simulation only matters while a node is dragged. Each link's rest length is the
// distance between its two homes and every node is pulled toward its home, so at rest
// every force is satisfied exactly at the authored positions. Dragging a node stretches
// its links and tugs its neighbors along; collision moves other nodes out of the way;
// on release everything springs back home.

import { forceCollide, forceLink, forceSimulation, type Simulation, type SimulationNodeDatum } from "d3-force";
import { EDGES, NODES, type GraphNode } from "@/lib/graph-data";

export type SimNode = GraphNode & SimulationNodeDatum & { hx: number; hy: number };
type SimLink = { source: string | SimNode; target: string | SimNode; rest: number };

/** Pull toward home. Weaker than the links, so a drag visibly carries neighbors. */
const HOME_STRENGTH = 0.08;
const LINK_STRENGTH = 0.22;
/** Clearance between discs, in canvas units. Labels are kept clear by the authored layout. */
const COLLIDE_PAD = 10;

export function createSimulation(): Simulation<SimNode, SimLink> {
  const nodes: SimNode[] = NODES.map((n) => ({ ...n, hx: n.x, hy: n.y }));
  const home = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const links: SimLink[] = EDGES.map(([s, t]) => ({
    source: s,
    target: t,
    rest: Math.hypot(home[s].hx - home[t].hx, home[s].hy - home[t].hy),
  }));
  // Created stopped: it runs only while a node is dragged, and never during server render.
  return forceSimulation(nodes)
    .stop()
    .alphaDecay(0.035)
    .force("home", forceHome(nodes))
    .force(
      "link",
      forceLink<SimNode, SimLink>(links)
        .id((d) => d.id)
        .distance((l) => l.rest)
        .strength(LINK_STRENGTH),
    )
    .force("collide", forceCollide<SimNode>((d) => d.r + COLLIDE_PAD).strength(1).iterations(2));
}

/**
 * A spring to each node's home that, unlike d3's forceX/forceY, does not fade with alpha.
 * Those weaken as the simulation cools and freeze nodes short of home; this one keeps
 * pulling until the simulation stops, by which time every node has arrived.
 */
function forceHome(nodes: SimNode[]) {
  return () => {
    for (const n of nodes) {
      n.vx! += (n.hx - n.x!) * HOME_STRENGTH;
      n.vy! += (n.hy - n.y!) * HOME_STRENGTH;
    }
  };
}

/** Puts every node exactly on its home: after a drag cools, or at once under reduced motion. */
export function snapHome(sim: Simulation<SimNode, SimLink>): void {
  sim.stop();
  for (const n of sim.nodes()) {
    n.x = n.hx;
    n.y = n.hy;
    n.vx = n.vy = 0;
    n.fx = n.fy = null;
  }
}
