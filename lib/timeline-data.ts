// Data + color math for the homepage timeline. Ported from the original
// vanilla-JS implementation in index.html — same algorithm, same palette,
// computed once at module load instead of mutating the DOM after mount.

// ---- Palette (mirrors :root in the original timeline.css) ----
export const PALETTE: Record<string, string> = {
  cream: "#f5f1eb",
  parchment: "#eae4d9",
  taupe: "#c8bfb0",
  charcoal: "#1e1c1a",
  "near-black": "#141210",
  terracotta: "#d4603a",
  amber: "#e8a830",
  "amber-soft": "#f0c263",
  "amber-deep": "#b07d1a",
  blush: "#e8b4a2",
  "blush-deep": "#d4896e",
  indigo: "#3a4d8f",
  "indigo-pale": "#b8c0dc",
  "indigo-soft": "#5069a8",
  "indigo-deep": "#2f3e7a",
  forest: "#2e5a45",
  "forest-pale": "#a8c4b4",
  "dusty-blue": "#7a8fb5",
  sage: "#7a8c6e",
  "sage-pale": "#c4d0b8",
  "rose-dust": "#c4887a",
  plum: "#7a4d72",
};

type Rgb = { r: number; g: number; b: number };

function hexToRgb(hex: string): Rgb {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

function clamp(min: number, x: number, max: number): number {
  return Math.min(max, Math.max(min, x));
}

function relativeLuminance({ r, g, b }: Rgb): number {
  const toLinear = (v: number) => {
    const x = v / 255;
    return x <= 0.04045 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function rgbToHsl({ r, g, b }: Rgb) {
  const R = r / 255, G = g / 255, B = b / 255;
  const max = Math.max(R, G, B), min = Math.min(R, G, B);
  const delta = max - min;
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case R: h = ((G - B) / delta) % 6; break;
      case G: h = (B - R) / delta + 2; break;
      default: h = (R - G) / delta + 4;
    }
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

function hslToRgb({ h, s, l }: { h: number; s: number; l: number }): Rgb {
  const C = (1 - Math.abs(2 * l - 1)) * s;
  const hp = (h % 360) / 60;
  const X = C * (1 - Math.abs((hp % 2) - 1));
  let r1 = 0, g1 = 0, b1 = 0;
  if (hp >= 0 && hp < 1) [r1, g1, b1] = [C, X, 0];
  else if (hp >= 1 && hp < 2) [r1, g1, b1] = [X, C, 0];
  else if (hp >= 2 && hp < 3) [r1, g1, b1] = [0, C, X];
  else if (hp >= 3 && hp < 4) [r1, g1, b1] = [0, X, C];
  else if (hp >= 4 && hp < 5) [r1, g1, b1] = [X, 0, C];
  else [r1, g1, b1] = [C, 0, X];
  const m = l - C / 2;
  return { r: Math.round((r1 + m) * 255), g: Math.round((g1 + m) * 255), b: Math.round((b1 + m) * 255) };
}

function desaturateRgb(rgb: Rgb, factor: number): Rgb {
  const hsl = rgbToHsl(rgb);
  return hslToRgb({ h: hsl.h, s: clamp(0, hsl.s * factor, 1), l: hsl.l });
}

function rgbToCss({ r, g, b }: Rgb): string {
  return `rgb(${r} ${g} ${b})`;
}

const LIGHT_INK = { text: "rgba(245,241,235,0.92)", date: "rgba(245,241,235,0.7)" };
const DARK_INK = { text: "rgba(30,28,26,0.9)", date: "rgba(30,28,26,0.55)" };

/** Computed once per project card: desaturate by (AI + complexity) score, then
 * pick readable ink from the resulting luminance. Mirrors applyProjectStyling(). */
export function computeProjectCardStyle(colorToken: string, ai: number, complexity: number) {
  const base = hexToRgb(PALETTE[colorToken]);
  const aiN = clamp(0, ai / 5, 1);
  const complexN = clamp(0, complexity / 5, 1);
  const score = 0.6 * aiN + 0.4 * complexN;
  const satFactor = 0.2 + 0.8 * score;
  const adjusted = desaturateRgb(base, satFactor);
  const lum = relativeLuminance(adjusted);
  const ink = lum < 0.35 ? LIGHT_INK : DARK_INK;
  return { color: rgbToCss(adjusted), text: ink.text, date: ink.date };
}

// ---- Entry data ----

export type Kind = "role" | "project";

export interface TimelineEntry {
  id: string;
  kind: Kind;
  title: string;
  date: string;
  summary: string;
  ai?: number;
  complexity?: number;
  tags?: string[];
  link?: string;
  linkLabel?: string;
  link2?: string;
  link2Label?: string;
}

export const ENTRIES: TimelineEntry[] = [
  { id: "bs-biology", kind: "role", title: "BS Biology — UNCC", date: "2013", summary: "Foundation in biology and scientific method at UNC Charlotte, building the analytical mindset that would drive a career at the intersection of computation and life science." },
  { id: "ms-bioinformatics", kind: "role", title: "MS Bioinformatics — UNCC", date: "2016", summary: "Graduate training in bioinformatics and data science at UNC Charlotte, developing core skills in statistical modeling, computational methods, and large-scale biological data analysis." },
  { id: "grad-researcher", kind: "role", title: "Graduate Researcher & Teaching Assistant — UNCC", date: "2017–2020", summary: "Designed and deployed real-time bioinformatics pipelines for large-scale genomic annotation (Illumina/PacBio) in Python on Linux/HPC. Taught bioinformatics courses and mentored students on computational methods and data analysis workflows." },
  { id: "phd", kind: "role", title: "PhD Bioinformatics — UNCC", date: "2020", summary: "Curriculum centered on data science for biology: statistics/mathematics as the applied foundation for modeling and inference, combined with computer science for scalable computation and modern biology for domain grounding. Advanced coursework and seminars paired with mentored research, culminating in original dissertation work on computational methods for large-scale genomic data." },
  { id: "thesis-defense", kind: "role", title: "Thesis Defense", date: "2020", summary: "PhD thesis on common oat (Avena sativa) genomics, focused on the challenges of a large, repeat-rich allohexaploid genome. Developed a pipeline to more precisely characterize repetitive elements using well-characterized diploid Avena references, then extended the work with phylogenetic analyses to better understand transposable element evolution across the Avena lineage." },
  { id: "postdoc", kind: "role", title: "Postdoctoral Researcher — NC Research Campus", date: "2020–2021", summary: "Built analytical pipelines for large-scale NGS datasets in Python on cloud/HPC environments. Led computational biology projects applying ML to protein sequence analysis, structure annotation, and optimization workflows." },
  { id: "repbox", kind: "project", title: "RepBox", date: "Submitted 2021 · Published 2023", summary: "RepBox: a bioinformatics pipeline for improved repetitive element identification. Published in BMC Bioinformatics (2023).", ai: 1, complexity: 4, tags: ["python", "bioinformatics", "pipeline", "genomics", "transposable-elements", "plant-genomics"], link: "https://doi.org/10.1186/s12859-023-05419-5" },
  { id: "syngenta", kind: "role", title: "Data Scientist — Syngenta", date: "2021–2022", summary: "Developed predictive models for agricultural product optimization using haplotype and environmental data. Launched a decision-making analytics platform as Product Owner (Agile/Scrum) and built scalable bioinformatics pipelines for experimental data integration." },
  { id: "fitskin", kind: "role", title: "Applied Scientist — Computer Vision & Health Sensing (Independent Consultant)", date: "2021–2025", summary: "Independent consulting in computer vision and physiological signal characterization for consumer health-sensing clients: a clinical imaging anomaly detection pipeline (AWS SageMaker), a large-scale client skin-tone classification system trained on a private 2M+ image database using Vision Transformers, and skin-radiance scoring research. Led A/B testing and causal inference studies, customer segmentation, and stakeholder-facing analytics dashboards." },
  { id: "argus", kind: "project", title: "argus.", date: "2022–2023", summary: "Dual-branch anomaly detection pipeline for 6-channel Cell Painting (RxRx3-core) microscopy images. UV channel (Hoechst/DNA) is processed by a convolutional autoencoder scored by reconstruction error; non-UV channels (ConA, Actin, Syto14, MitoTracker, WGA) use pre-computed OpenPhenom embeddings scored with Isolation Forest. Both branches are fused into a joint anomaly score, with a downstream perturbation-type classification head evaluated by ROC-AUC and UMAP visualization.", ai: 4, complexity: 4, tags: ["cell-painting", "anomaly-detection", "autoencoder", "isolation-forest", "pytorch", "umap"] },
  { id: "iridis", kind: "project", title: "iridis.", date: "2024", summary: "Open-data research pipeline for skin-adjacent color analysis. Extracts robust CIE Lab/LCh features from images using median-based sampling, clusters them with MiniBatchKMeans, and merges nearby clusters using CIEDE2000 perceptual distance. Discovered clusters proved ~2.5x more predictable than clinical Fitzpatrick skin-type labels from identical features — evidence the clinical scale collapses real perceptual structure.", ai: 2, complexity: 2, tags: ["color-science", "lab-space", "ciede2000", "clustering", "skin-tone"], link: "/projects/iridis/", linkLabel: "Read the write-up →" },
  { id: "lambent", kind: "project", title: "lambent.", date: "2025", summary: "Open-image pipeline for estimating interpretable skin-glow proxy features from images. Extracts region-level color (Lab, ITA, hue), texture, and specular/reflectance signals across up to six face regions, aggregates to subject-level tables, and optionally fits supervised models when grading labels are provided. Supports folder-mode and manifest-mode ingestion.", ai: 3, complexity: 4, tags: ["color-science", "feature-extraction", "ita", "skin-glow", "supervised-modeling", "face-regions"] },
  { id: "bi", kind: "role", title: "Principal Applied Scientist — Boehringer Ingelheim", date: "2025–Now", summary: "Leads AI strategy and generative AI development for pharmaceutical operations across the Global Animal Health division. Builds financial models, champions responsible AI practices, and mentors junior data scientists." },
  { id: "veridian", kind: "project", title: "veridian. — Corpus-Grounded Research Cognition Engine", date: "2025–", summary: "Retrieves PubMed literature on a research topic, clusters and semantically summarizes it, extracts and grounds claims from a user's own reasoning against that corpus, and builds a typed knowledge graph — an orientation and reflection system, not a summary generator.", ai: 5, complexity: 4, tags: ["llm", "semantic-clustering", "literature-review", "knowledge-graph"], link: "/projects/veridian/", linkLabel: "Read the write-up →" },
  { id: "topos", kind: "project", title: "topos.", date: "2025–", summary: "Stability-certified protocol for deciding when latent structure in high-dimensional biological data is real enough to act on: perturbation stability, matched-model comparison, confound auditing, and explicit go/kill criteria before biological interpretation or expensive escalation. Applied across three organisms — soybean (glyma), octoploid strawberry (fragaria), and sorghum — each currently at early protocol stages by design.", ai: 4, complexity: 5, tags: ["framework", "manifold-learning", "foundation-models", "ai-augmented-discovery"], link: "/projects/topos/", linkLabel: "Read the write-up →" },
  { id: "glyma", kind: "project", title: "glyma.", date: "2026–", summary: "Haplogroup discovery in soybean germplasm (Glycine max). Tests whether nonlinear manifold learning — UMAP, UMATO, MAPLE — reveals stable haplogroup substructure beyond PCA, using density clustering on LD-pruned SNP-array data. Cluster-defining loci evaluated in genomic foundation model embedding space for cross-modal agreement. A topos. case study, currently at Stage 0–1.", ai: 4, complexity: 5, tags: ["bioinformatics", "genomics", "population-genetics", "manifold-learning", "umap", "soybean"], link: "https://github.com/sheljustdoes/glyma" },
  { id: "fragaria", kind: "project", title: "fragaria.", date: "2026–", summary: "Nonlinear haplotype topology discovery in octoploid strawberry (Fragaria × ananassa). Tests whether manifold learning reveals stable haplogroup structure beyond PCA and standard admixture methods in this polyploid system, with cross-modal validation planned against phenotype, geography, subgenome composition, and disease resistance data. A topos. case study, currently at Stage 0.", ai: 4, complexity: 5, tags: ["bioinformatics", "genomics", "population-genetics", "manifold-learning", "umap", "strawberry"], link: "https://github.com/sheljustdoes/fragaria" },
  { id: "sorghum", kind: "project", title: "sorghum.", date: "2026–", summary: "Stability-first discovery of transposable element insertion-site polymorphisms (TIPs) in Sorghum bicolor. Explicit go/kill criteria and perturbation robustness tests gate escalation to population-structure and trait-relevance analysis. A topos. case study, currently at Stage 0–1.", ai: 4, complexity: 5, tags: ["bioinformatics", "genomics", "transposable-elements", "population-genetics", "sorghum"], link: "https://github.com/sheljustdoes/sorghum" },
  { id: "scintilla", kind: "project", title: "scintilla.", date: "2026", summary: "Applied Scientist curriculum: a structured learning path and reference set for applied research, experimentation, and production ML.", ai: 3, complexity: 4, tags: ["machine-learning", "deep-learning", "transformers", "skill-tree", "self-directed-learning"], link: "https://github.com/sheljustdoes/scintilla", link2: "https://sheljustdoes.github.io/scintilla/", link2Label: "Visit site ↗" },
  { id: "lumen", kind: "project", title: "lumen", date: "2026–", summary: "A public learning log tracking progression through modern AI via scintilla constellations, pairing Feynman writeups with notebooks and figures.", ai: 2, complexity: 4, tags: ["learning", "constellations", "feynman", "notebooks", "figures"], link: "https://github.com/sheljustdoes/lumen" },
];
