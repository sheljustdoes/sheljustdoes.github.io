# Portfolio

A working index of the technical projects behind [sheljustdoes.github.io](https://sheljustdoes.github.io) —
what each one does, how it works, what it has actually produced, and where it stands.

Maintained as the canonical reference for these projects. When a project changes
materially, this file changes with it.

**Last updated:** 2026-09-26

**How this index is organized**

Three product lines, each led by a flagship: perceptual & imaging phenotyping, certified
structure in biological data, and research cognition. The same way of working runs
through all three: results are compared against a plain baseline, protocols are
committed before scoring where the work allows it (argus, recolo, oncos), and a negative
result is reported as it came out — iridis, argus and recolo each include one. The
supporting sections that follow show how the work gets built and shipped: production
applications, learning tools, and portfolio tooling.

**Status vocabulary**

| Term | Meaning |
|---|---|
| **Shipped** | Deployed or installable, in use |
| **Results committed** | Analysis has been run; outputs are in the repo |
| **Implemented** | Code is complete and runnable; results not published |
| **Designed** | Architecture and method specified; implementation pending |

---

## Perceptual & imaging phenotyping

Measurement science for visible traits that have no ground truth: skin tone, skin
radiance, cell morphology and tumor appearance on CT. Each is measured against a fixed
baseline — clinical labels, a nuclei count, classical survival models — rather than on
its own terms. Capture comes first, because lambent showed that the camera can move a
score further than the skin does.

**Flagship:** iridis. **Also here:** lambent (optics), argus (Cell Painting), oncos (3D CT).

### iridis — perceptual skin-tone phenotyping
**Status:** Results committed · Python, PyTorch, scikit-learn, TabPFN, rembg

Tests empirically whether data-driven perceptual color clusters carry more structure than
the clinical scales used to describe skin tone. Fitzpatrick skin type — six ordinal
buckets originally designed for burn-risk classification — is the de facto standard in
dermatology datasets and therefore in the models trained on them.

**Approach.** A layered masking pipeline isolates skin before any color is measured:
class-agnostic foreground segmentation removes background; a ResNet18-U-Net trained on
ISIC 2018 lesion masks removes the lesion itself so featurization reflects surrounding
skin rather than pathology; a center-crop fallback keeps the pipeline running where
segmentation degenerates. Images are downsampled, pixel-sampled and converted to CIE Lab,
with per-image color taken as the *median* over sampled pixels — far less sensitive to
specular highlights and residual segmentation error than a mean. MiniBatchKMeans produces
a fine-grained partition (k=120), then neighboring clusters are merged by CIEDE2000
perceptual distance so final categories reflect distinctions a human eye would actually
make. The same Lab/LCh features then predict two different targets — Fitzpatrick type and
discovered cluster ID — under matched classifiers so the comparison isn't confounded by
model choice.

**Results.** Benchmarked on Fitzpatrick17k (12,631 images; 12,222 with valid labels), with
and without masking, under both Random Forest and TabPFN. **Measured skin colour barely
tracks Fitzpatrick type.** Type explains 7% of the variance in lightness (L*) and 12% in
yellowness (b*); the middle half of type I (L* 53–71) overlaps the middle half of type IV
(47–61); and predicting type from colour reaches 34.6–42.3% accuracy against 33.8% for
always guessing the commonest type. **Masking does not help:** isolating skin from
background and lesion was expected to make type more predictable, and accuracy stayed flat
or fell slightly. The lesion-exclusion U-Net reaches held-out Dice 0.889 / IoU 0.818 on
ISIC 2018 Task 1 (2,594 dermoscopy images).

**Correction (2026-09-26).** Earlier versions reported the discovered clusters as 2.5–2.8×
more predictable than Fitzpatrick labels (95.8–96.3% against 34.6–42.3%) and read that as
evidence the scale discards real structure. It is not evidence. The clusters are defined
from the same colour features the classifier uses, so predicting them is largely true by
construction. And the perceptual merge chains transitively: one cluster ends up with 68%
of the images and spans nearly the whole lightness range, so the 96% sits against a 68%
baseline. What stands is the weak link between colour and type, which in uncalibrated
clinical photographs cannot yet separate the scale's coarseness from capture variation.

**Limit.** Every Fitzpatrick17k image in the benchmark comes from a single source atlas.
The source is therefore constant rather than a confound, but the result is established on
that atlas only; the dataset's other atlas has a very different skin-type mix and would
need a source audit before it is added.

### lambent — computational quantification of skin radiance
**Status:** Results committed · Python, scikit-image, OpenCV, scikit-learn · 1,816 images, 68 tests

Developed independently on public data, from 2023; a consulting client later applied the
method to its own data. An open-image pipeline estimating interpretable "glow" proxy
features from images, aggregating them by subject, and optionally fitting supervised models where labels exist.
The underlying research question was whether radiance — an attribute that existed only as
a qualitative descriptor — could be quantified from multi-modal physiological image
features at all.

Multi-region extraction (full, center, forehead, left/right cheek, chin) with optional
face detection for region anchoring. Features span Lab, ITA, hue, texture, and
specular/red/dark proxies, aggregated to subject-level tables, with transparent composite
scoring at image, subject-region, and subject level. Packaged as an installable CLI
(`python -m lambent`) with two ingestion modes, folder and manifest.

`docs/methodology.md` carries the consolidated v1–v6 methodology — the metric's evolution
across six iterations.

**Validating a metric with no ground truth.** Public dermatology datasets label skin
*type*, not radiance, so there is nothing to correlate a glow score against. The
validation asks instead what can be answered without labels, by perturbation with a known
dose: add a controlled specular highlight to a real image, or brighten it globally with a
gamma curve, or add fine noise, and measure how the score tracks the dose. Gamma is the
control that carries the argument, because it raises lightness while adding no gloss at
all.

**Results** (1,816 Fitzpatrick17k images, stratified across all six types). The score
tracks added gloss at median Spearman ρ = 1.00 — and tracks plain brightening at ρ = 1.00
as well. **It does not separate gloss from lightness**, which follows from its own
definition, where mean `L*` carries a +0.25 weight. A tone gradient is also present
(ρ = −0.53 against Fitzpatrick type), with mean glow declining monotonically from type 1
to type 6.

**The tone gradient's size is not established, and the reason is the more interesting
result.** Fitzpatrick17k is scraped clinical photography: no controlled illumination, no
camera calibration, no colour reference in frame. Re-scoring each image under capture
changes that cannot alter how glossy skin actually is shows a quarter-stop exposure
difference moving the score by ~51% of the entire type-1-to-type-6 span, half a stop by
90%, and a 10% white-balance drift by ~40%. The metric is about as sensitive to the
camera as to several steps of skin type, so **nothing in this dataset separates the two**
and the tone figure is an upper bound on a confounded quantity. The within-image findings
are untouched by this, because there each image is its own control.

The finding that matters most is that the obvious repair does not work. Dropping the
lightness term and keeping the specular one fails, because the specular detector counts
pixels over an *absolute* brightness threshold and is itself 5.3× higher on the lightest
skin than the darkest. A tone-independent radiance metric needs highlight contrast
measured against each image's own baseline rather than a fixed cut. That is a concrete,
reproducible specification for the next version, arrived at by measurement.

None of it makes the measurement useless — it establishes that what the metric captures
is surface reflectance *including* lightness, under whatever illumination the photograph
was taken in. That is a defensible thing to call radiance on a fixed capture rig, which
is what the original engagement had and what public dermatology data does not.

**The measurement then specified its own replacement**, and the route there is the part
worth reading. Exposure and white-balance sensitivity became the acceptance criterion, and
seven variants were scored through identical experiments so each change was attributable
rather than bundled.

| Variant | Gloss ρ | Brightness ρ | Tone ρ² | exp ±0.25 | Worst capture |
|---|---|---|---|---|---|
| `v6` original | 1.000 | **1.000** | 0.310 | 54.6% | 93.2% |
| `v6` minus lightness | 1.000 | **1.000** | 0.250 | 48.5% | 72.2% |
| `v7` relative features | 0.743 | −0.857 | 0.074 | 31.9% | 74.4% |
| `v8` von Kries | 0.771 | −1.000 | 0.284 | 31.2% | 70.4% |
| `v9` noise-corrected | 0.771 | −1.000 | 0.287 | 31.6% | 71.5% |
| `v10` linear von Kries | 0.771 | −1.000 | 0.044 | 35.8% | 79.7% |
| **`v11` specular-linear** | **0.829** | −0.857 | **0.002** | **26.8%** | **59.4%** |

Tone dependence falls from ρ² 0.310 to **0.002** and worst-case capture sensitivity from
93.2% to 59.4%, while the response to real gloss *improves*.

Three of those rows are failures, and they are kept because the sequence is the argument.
**Deleting the lightness term does nothing** — the other terms are absolute too.
**Relative features fix exposure and break white balance**, because the specular test
gates on saturation and warming an image raises saturation; von Kries repairs that, since
an illuminant change is to first order a diagonal transform `R→aR, G→bG, B→cB` and
dividing each channel by a statistic of itself cancels it. **The noise-floor correction
was a dead end**: the hypothesis that von Kries amplifies sensor noise on darker skin was
implemented in full and changed nothing, because the measured noise floor is ~2% of the
skin median against relative spreads of 20–37%.

Ruling that out is what identified the real cause. Von Kries is a *linear* model, and sRGB
values are not radiance — under a ~1/2.2 transfer curve a fixed linear ratio maps to
different encoded ratios depending on level, which on skin means depending on skin tone.
Undoing the curve first takes the specular term's own tone correlation from +0.47 to
−0.08, and weighting the metric onto that now-neutral term is `v11`. It requires excluding
clipped pixels from the measurement region: a saturated pixel is maximally bright and
minimally saturated, precisely the specular signature, so without the exclusion raising
exposure manufactures gloss that was never in the scene.

What remains unfixed is stated with it. Every variant still responds to a tone curve,
because gamma is not a diagonal transform and no per-channel gain cancels one. Residual
exposure sensitivity is bounded by clipping already present in the source rather than by
the correction. And tone neutrality is established on a single source atlas.

Results are generated into `docs/open_validation.md` from the run's JSON, so the
documented numbers cannot drift from the run that produced them.

### argus — dual-branch fluorescence anomaly detection
**Status:** Results committed · PyTorch, scikit-learn · RxRx3-core, three pre-registered runs, 29 held-out experiments

Anomaly detection over Cell Painting microscopy, splitting the six stains by excitation
wavelength: a UV branch (Hoechst/DNA, ~350 nm) scored by a convolutional autoencoder's
reconstruction error, and an Isolation Forest over pre-computed OpenPhenom embeddings,
fused by rank. Built on Recursion's public RxRx3-core.

**The test.** A protocol committed before scoring asks whether detectors trained only on
control wells can flag the PLK1 and MTOR knockouts that every experiment carries as
positive controls. Six held-out experiments are scored once, with a bootstrap over plates.
The fixed baseline is a plain nuclei count, because PLK1 knockout leaves fewer cells.

**Result: the dual-branch design failed its test.** The autoencoder ranked knockouts as
*less* anomalous than controls (ROC-AUC 0.324). Fewer nuclei leave more empty background,
which reconstructs easily. The score direction was fixed in advance, so it was not flipped
afterwards. Fusion therefore fell to 0.532, below the embedding branch alone (−0.179,
CI −0.206 to −0.152). The embedding branch reached 0.711, a tie with the nuclei count
(0.712): better on PLK1 (0.83 against 0.79), worse on MTOR (0.59 against 0.64). One
more caveat surfaced in the design: OpenPhenom embeds all six channels, so the embedding
branch was never UV-free.

**A second pre-registered run (v2)** tested two repairs on eight experiments nobody had
scored (1,150 wells, 72 plates), because the repairs were designed after seeing v1. v1
replicated: the autoencoder inverted again (0.32) and the embeddings tied the cell count
again. Scoring reconstruction error on nuclear pixels only removed the inversion and left
no signal at all (0.48). Regressing cell count out of the embeddings looked like it left a
real MTOR signal (0.58, interval above 0.5), but a check made after scoring showed the
residualized score still tracked cell count almost as strongly (Spearman −0.48 against
−0.51): a linear regression cannot remove a nonlinear dependence, so the control did not do
its job.

**A third run (v3) compared wells only with controls of the same cell count**, on 15 more
experiments nobody had scored (2,108 wells, 135 plates). Controls were cut into deciles of
nuclei fraction, and each knockout was compared only with controls in its own decile. The
built-in check passed: inside a bin, the cell count alone scored 0.521. Matched on count, the
embeddings still reached 0.690 (CI 0.651–0.724), 0.169 above the count, and MTOR alone
stayed above chance (0.579, CI 0.540–0.615). **So the embeddings do see more than a cell
count.** Unmatched, they tied it again. A check made after scoring (not pre-registered):
binning within each experiment, a stricter match, keeps the overall result above chance
(0.588) but pulls MTOR alone to 0.548, whose interval includes 0.5; and bin by bin, the
embeddings' signal sits in the three lowest-count deciles (AUC 0.68–0.85) and is near chance
above them. The dual-branch design
stays a failure; the embedding branch alone carries real signal.

### oncos — survival prediction from 3D CT
**Status:** Implemented, in progress · public imaging data · PyTorch

Work in progress. It predicts overall survival in non-small cell lung cancer from
pre-treatment 3D CT, on public data. 3D deep learning is compared against classical
survival baselines, with censoring handled explicitly, under an evaluation protocol fixed
before any model was scored. Results and methods will be written up here once the work is
further along.

---

## Certified structure in biological data

Deciding when latent structure in high-dimensional biological data is real enough to act
on. topos is the protocol: eight gated stages that end in an explicit GO, KILL or HOLD.
The case studies apply it to crop genomes and to human precision medicine. A thread
through transposable elements runs across them, from repbox's element discovery to
insertion polymorphisms in sorghum, TE-derived structural variants in tomato (lyco), and
the insertions indicium adds to precision-medicine evidence.

**Flagship:** topos, the method, now a tested package for Stage 0. One stage has been
executed, on strawberry (fragaria): an audit found the first run invalid, and two
pre-registered rebuilds end in a GO that holds across sensitivities, for structure PCA
and UMAP agree on. Every lesson became a rule in the package. The other case studies are
specified and not yet run.

### topos — stability certification for latent structure
**Status:** Implemented (Stage 0 checks) · Python package, 8 stage specifications, 27 tests

High-dimensional biological analysis has a well-known failure mode: embed, cluster, find
something that looks structured, interpret it. Nonlinear methods make this worse rather
than better — they are very good at finding *a* structure and offer no built-in signal for
whether it would survive a different seed, a different preprocessing choice, or an equally
defensible alternative embedding.

topos treats "is this structure real" as a **certification problem rather than a modeling
choice.** It proposes no new clustering algorithm. It specifies the sequence of checks a
discovery must pass before consuming expensive compute or supporting a biological claim,
across eight gating stages from Data Landscape Audit through an explicit GO/KILL/HOLD
Value Audit.

The protocol is specified across three organisms — soybean, sorghum and octoploid
strawberry — with Stage 0 executed on strawberry to date. Stage 0 is now a tested Python
package, and each module enforces a rule the strawberry case taught: missing-value codes
declared at load; stability from resampling the data, with seed agreement refused for a
deterministic pipeline; a confound with no variance treated as untestable; relatedness
capped with structure-robust kinship; grids deduplicated before settings are counted;
and non-redundancy measured on rows both pipelines cluster, so extra coverage is not
mistaken for different structure. fragaria's scored Stage 0 runs on the package and
reproduces its committed results byte for byte; veridian's Explore uses it to choose its
cluster count.

Three design commitments distinguish it: **matched-model comparison** (embedding choices
compared under equivalent clustering assumptions, never cherry-picked pairings);
**density-aware validation** (metrics matched to the clustering model — DBCV for
density-based methods, not silhouette applied indiscriminately); and **mandatory confound
auditing** (a cluster reducing to batch, missingness or preprocessing artifact fails
certification regardless of how clean it looks).

### fragaria — nonlinear haplotype topology in octoploid strawberry
**Status:** Results committed (Stage 0) · Python, scikit-learn

A topos case study on *Fragaria × ananassa* testing whether nonlinear manifold methods
recover stable haplogroup structure beyond linear PCA in an octoploid context, where
dosage ambiguity, subgenome assignment uncertainty and homoeologous exchange all
complicate interpretation. Stage 0 has been run three times; Stage 1 is drafted and
awaiting review.

**The first Stage 0 was invalid.** Its GO reproduced exactly, but an audit found the
file's missing calls (`-1`) were never decoded, so about 930K of them entered PCA as a
genotype value, and three of five rubric criteria passed by construction: seed-only
stability on a deterministic pipeline, and a missingness check that saw no missing data.

**Stage 0 v2, pre-registered: GO, narrowly, for linear structure only.** Rebuilt with
missing calls decoded, full-sib families thinned to three members (one family has 187),
and stability measured by resampling 80% of accessions and markers 20 times, across 189
pipeline settings on 925 individuals. Two PCA→HDBSCAN settings pass every gate —
the minimum the rule allows — with stability 0.82–0.84 and two or three clusters that
track germplasm source (USDA accessions, named cultivars, the breeding program). No UMAP
setting passes, so nothing yet supports the nonlinear hypothesis. The gate that bites is
missingness: it fails 22 of the 24 stable, valid settings, and appears entangled with
source through array ascertainment. Without the family cap, clusters were 72–100% a
single family.

**Stage 0 v3, pre-registered: GO, and it holds.** Three fixes v2 called for: relatedness
capped with KING-robust kinship rather than family labels (234 unrelated accessions; the
standard relationship matrix was rejected because it read population structure as
kinship), a deduplicated grid, and a missingness gate tested within germplasm source.
GO in the primary run and both sensitivities, carried by UMAP pipelines as well as PCA.
The structure is the same either way: on the accessions both methods cluster, the
partitions are identical — breeding-program lines against USDA accessions and named
cultivars. UMAP only assigns the diverse accessions PCA leaves as noise. So stable,
confound-defensible structure exists, and nothing yet shows structure beyond PCA; that is
Stage 1's test. The lessons go upstream into topos. The only topos case study with
executed analysis.

### indicium — graded evidence for precision medicine
**Status:** Results committed (Stage 1, inconclusive) · open human genomics, CIViC, CPIC

Precision-medicine knowledge bases mostly describe single-nucleotide variants and short
indels. Transposable element insertions and larger structural variants are
under-represented in them. indicium brings three kinds of evidence into one knowledge
graph, where every edge records its source and evidence level:
- pharmacogenomics, checked against CPIC guidelines as exact ground truth
- a cancer-variant evidence agent, evaluated against CIViC's curated evidence
- hypotheses generated over the combined graph, evaluated with a temporal holdout

It is the first project built on this portfolio's own frameworks as a stack. topos gates
every hypothesis, sorghum's insertion-polymorphism methods move from plants to humans,
veridian checks whether evidence supports each claim, recolo provides agent memory, argus
contributes Cell Painting phenomics, and catasta serves the demo. Each framework's gap
that indicium closes is fixed in that framework's own repository. Hypotheses, evidence
gates are written, and Stage 0 is complete: an audit of data access, licences and prior
work. Three arms go ahead. One hypothesis turned out to be largely published already and
is being reframed as a replication with a stability analysis. The somatic arm stays
deferred, because its primary data is controlled-access.

**The replication ran once (2026-09-26), pre-registered and signed off in advance.** It
catalogues 69 polymorphic mobile-element insertions in or near the highest-evidence CPIC
pharmacogenes, 61% of checkable calls confirmed by long-read assemblies. Its stability
verdict came back negative, but uninformatively: two of the four pre-registered
perturbation axes turned out not to vary in the public call set, which capped every site
below the stability threshold by construction. A repaired grid, approved afterwards and
labelled post-hoc, gave the same verdict for the same kind of reason: a third axis turned
out not to vary either, and only 16 sites could be checked against long reads, two of
them common HLA insertions that dominated the comparison. So this call set cannot answer
the stability question; the catalogue stands as a plain intersection, and a real test
needs a call set whose filters vary. The check that catches degenerate axes before a run
now lives in topos. indicium was archived on 2026-09-26 with its other arms unstarted;
the transposable-element thread continues in lyco.

### glyma — soybean haplogroup discovery
**Status:** Designed (Stage 0) · *Glycine max*, SoySNP50K

Parallel case study testing the same nonlinearity hypothesis against SoySNP50K, with
conditional escalation into phenotype, transcriptomic and geo-climatic validation.
Ideation, proposal and stage protocols complete; analysis not yet run.

### sorghum — transposable element insertion-site polymorphism
**Status:** Designed (Stage 0–1) · *Sorghum bicolor*, WGS

Case study on reproducible TIP detection and staged escalation, testing whether insertion
sites can be called reproducibly under perturbation of coverage, filtering and annotation
scope before any large-scale interpretation is attempted.

### lyco — transposable-element structural variants and tomato traits
**Status:** Designed (Stage 0) · *Solanum lycopersicum*, public pangenome call sets

Tomato pangenome studies have shown that transposable element insertions affect fruit
traits while being poorly tagged by SNPs, and that structural variants carry heritability
SNPs miss. Most tomato structural variants are TE-derived, but they have not been
separated from other structural variants when partitioning heritability. lyco asks
whether TE origin matters once allele frequency, length and linkage with SNPs are held
fixed, across metabolome, flavour-chemistry and expression traits in 332 accessions,
tested against a permutation null. A validation gate is scored first: do independent
published call sets (short-read, long-read and graph-genotyped) agree on these variants?
Everything runs from published call sets on a laptop; nothing is re-called from reads.
Stage 0 is complete: the broad question is already published, the narrow one was not
found, and genotypes and phenotypes line up for all 332 accessions. No analysis has run.

### repbox — transposable element discovery and annotation
**Status:** Shipped · Python CLI, published · [BMC Bioinformatics (2023)](https://doi.org/10.1186/s12859-023-05419-5)

A Python-first CLI platform for identification and classification of novel repetitive
genomic elements, evolved from thesis-era workflow into an adapter-based v2.0.0 with
semantic versioning, a release process, and smoke-test diagnostics
(`run` / `check` / `smoke` / `smoke-report`). Demonstrated 7% growth in detected elements
across the *A. sativa* genome. Public.

---

## Research cognition

Tools that help a researcher check what they read and keep what they learn. Each is
measured against a plain baseline on held-out data. veridian grounds claims in the
literature. recolo tested whether a biologically inspired memory helps an LLM agent, and
it did not.

**Flagship:** veridian.

### veridian — literature review: map the disagreement, check the claim
**Status:** Results committed (Check) · Explore rebuilt · Python, ONNX Runtime, transformers.js, PubMed E-utilities, Anthropic API

Entering an unfamiliar research domain means facing thousands of papers with no visible
hierarchy of concepts, no sense of which interpretations are dominant versus emerging, and
no way to tell whether a forming claim is actually supported or merely plausible-sounding.
Most tools either summarize — compressing away the interpretive landscape — or generate,
producing claims ungrounded in any specific corpus.

veridian answers two questions against a fixed corpus instead, and every answer points
back to the papers it came from. **Explore** maps the field — clusters, recurring MeSH
concepts, and, as the target, *where papers disagree*. **Check** grounds a specific claim:
supported, contradicted, contested or unsupported, with the sentences behind the verdict.
The two are meant to connect through a map of disagreement: contested claims surface on the
map, and opening one shows the evidence on both sides. That also fixes the original
design's entry problem — a newcomer has no claims of their own to check until the map
supplies some.

**Pipeline.** Retrieve from PubMed E-utilities → embed and partition with K-means, UMAP
for projection → per-cluster thematic summaries grounded in member abstracts rather than
the corpus as a whole → accept free-form user reasoning and extract atomic checkable
claims → match claims to nearest clusters so alignment is judged against actual retrieved
evidence → extract and resolve named entities into canonical nodes, linked to grounding
clusters, producing a queryable knowledge graph rather than a flat similarity index →
surface which claims are well-supported, weakly supported, or ungrounded, without issuing
a grade.

Ships as both CLI and Flask web app with an interactive cluster map, runnable locally
against a pre-computed corpus with no API key. The legacy app has no live deployment — its
GitHub Pages workflow required a public repository and has been retired; the rebuilt demo
below is served from this site instead.

**What the audit found (2026-09-23).** Checked against this repository's own committed
demo payloads, the claim-grounding feature does not discriminate: all six claims map to
the same cluster in both payloads, every similarity clears the threshold, and every
verdict is identical. The cause is structural rather than a matter of tuning — cosine
similarity between a claim and a cluster centroid measures topical *aboutness*, not
evidential support, and a claim and its negation embed almost identically. A centroid is
also the mean of ~18 abstracts, so it can never identify which paper supports a claim.
Separately, cluster summarization injects the user's search rationale into every cluster's
prompt, so summaries echo the query rather than distinguishing the clusters.

Retrieval, UMAP projection, the interactive map and entity resolution work. The
interpretation layer on top of them did not.

**The rework rebuilt Check first**, since it was the broken half: a claim retrieves
specific abstracts and receives a verdict with the evidence cited by PMID, measured against
hand-labelled claims rather than asserted. **Explore was rebuilt next**, with nothing
generated: clusters are labelled by the MeSH terms that distinguish them, represented by
the papers nearest their centroid and the findings those papers state, and the cluster
count is chosen by resampling stability using topos. On the frozen corpus no count is
stable (the best, three clusters, reaches 0.63), and the legacy map's ten clusters score
0.28, so that map was mostly arbitrary partitioning; the rebuilt map says so instead of
drawing false confidence. The demo shows the map with that stability evidence beside it. The same engine also verifies lumen's
curriculum, grounding each generated principle in its source before review.

Retrieval itself is not the differentiator — general research agents and existing tools do
that well. Calibrated judgement with a known error rate on a specific corpus is.

**First piece landed:** the corpus layer now parses what PubMed already returns and the
original parser discarded — PMIDs (without which nothing can be cited), MeSH headings with
their descriptor UIs, and publication types. The knowledge graph gains an authority: keyed
on MeSH UIs, "IL-6" and "interleukin-6" are one node rather than two unrelated strings,
across every *indexed* article rather than the handful of sentences a user typed — though
recent papers are often not yet indexed, and about 30% of the demo corpus carries no MeSH at
all. Publication types are parsed so the evidence behind a verdict can be described; the
verdict itself does not yet weight by study design.

**Embeddings run in the reader's browser.** The demo is meant to be openable — type a
claim, watch abstracts come back — with no API key and no backend, so the corpus and the
query are embedded by the same 23 MB open model, with hosted providers behind the same
interface for when retrieval quality is the binding constraint. Because a reader's claim
is embedded client-side in transformers.js while the corpus is embedded offline in Python,
the two must share a vector space exactly; rather than maintain two implementations,
Python runs *the same quantized ONNX weights* the browser runs.

Making them agree exactly surfaced two int8 quantization behaviours worth knowing about.
The model's output depends on **sequence length** — the same text padded to 19 tokens and
to 256 differs at cosine 0.992, though padding is masked out of the pooling — and on
**batch composition**, since quantization scales are computed across the batch. Both are
pinned: fixed-length padding on both sides, and one text at a time. The two runtimes then
agree to cosine 1.000000, checked against a committed fixture.

A test also records the property the whole rework rests on: a claim and its own negation
embed at cosine **0.93**, while unrelated text sits at **0.01**. The embedding is a strong
topical recall device and blind to polarity — which is precisely why grounding has to be
retrieve-then-entail, and why no threshold on cosine-to-centroid could ever have separated
a supported claim from a contradicted one.

**The grounding replacement is built.** Retrieval finds candidate abstracts, a judge
reads them, and a verdict is aggregated from per-abstract stances. Three things the old
design could not do:

- **Cite.** Every stance names the PMID it came from, so a verdict traces to a paper
  rather than to the mean of eighteen of them.
- **Express disagreement.** Verdicts are supported / contradicted / **contested** /
  unsupported. A corpus that both supports and contradicts a claim is the normal state of
  a live research question, and collapsing it to one similarity score destroys the
  information a reader most needs.
- **Cite real text.** Evidence is *selected*, never generated: abstracts are split into
  sentences, the sentences nearest the claim are chosen, and the judge returns one typed
  stance per sentence, so every quoted sentence exists in its source. That guarantees the
  citation, not the reading — a judge can still misread direction or hedging, or credit an
  animal result to a claim about humans, and isolating a sentence strips the context
  (organism, dose, comparator) that usually lives elsewhere in the abstract.
- **Use the abstract's own structure, where there is one.** Structured abstracts label
  their sections, and BACKGROUND sentences are excluded from evidence. Most abstracts in
  the demo corpus are unstructured, so this covers a minority, and the label list does not
  yet catch every journal's conventions.

The old rule survives as `centroid_baseline()` — unjustified 0.35 threshold and all — so
the rework can be measured against what it replaced rather than merely asserted to be
better.

Narrowing the judge to a typed label per sentence had an unplanned consequence: it asks
for nothing that requires writing prose, so a **typed-decision model** — one that returns
classifications with confidences and no free text at all — is a first-class judge here
rather than a degraded one. An adapter exists for one, which sets up a comparison the
evaluation can make directly: typed-decision model against LLM judge against the embedding
baseline, on the same hand-labelled claims.

**Not yet done, and stated plainly:** the LLM judge has run live (the measured result is
below); the typed-decision adapter has not, and is labelled unrun in the code. The legacy
module is still the CLI entry, so anyone running the app today still gets the old behaviour.

A **browser demo** runs with no key and no backend. Its retrieval tab searches either the
frozen corpus or **any PubMed topic**: the page queries E-utilities directly (NCBI serves
them with CORS open), keeps the top 10, 25 or 50 papers by relevance, and embeds them on the
reader's machine with the same model — 10 abstracts take about two seconds. A button negates
your claim and returns the same papers, which is the architecture's own argument made
visible. Judging needs a hosted model, so live topics get retrieval only; a second tab shows
the full pipeline on the held-out claims — verdict beside the answer-key label, each quoted
sentence with the judge's reasoning — precomputed offline from a fresh run of the scored
configuration, disagreements included.

**Measured result (2026-09-24).** On **21 held-out claims** — written before any fix and
scored once — the rebuilt Check pipeline reached **86% verdict accuracy (18 of 21; 95%
interval 65–95%)** against **48%** for the original rule, which answered "supported" to
every claim. Evidence recall was 77% and precision 75%, and no animal evidence was credited
to a claim about humans.

It got there in two measured steps. The first run, on 51 development claims, scored 55%,
and its errors were diagnosed rather than tuned away: ten came from a rule the answer key
used and the judge was never told (a null result is not a contradiction), five from
evidence that never reached the judge — abstracts truncated at 256 tokens were being ranked
on their background — and the rest from genuine misreadings. The fixes were general: the
judge was given every labelling rule and each sentence's paper context, and papers were
ranked by their single best-matching sentence. Development accuracy rose to 86%. The
held-out set, frozen before those fixes, scored the same — the evidence that they
generalised rather than fitting the claims they were built on.

Two of the three held-out errors fall on the claims that were hardest to label in the first
place, and neither was re-labelled after scoring. The limits are stated with the number:
both answer keys were drafted by Claude and reviewed by Shel — individually for every
judgement call, in bulk for claims following established patterns — the held-out claims
were written by the same hand as the fixes, and the corpus is 150 abstracts on one topic
with no genuine contested claims in it. Total cost of every run: under $6.

138 tests, running offline against committed fixtures.

### recolo — bio-inspired memory for LLM agents
**Status:** Results committed · Python, SQLite, numpy · v0.1.0, 79 tests · LongMemEval, three protocols, 400 held-out questions

Context engineering addresses what enters the window now. Biological memory architecture
addresses what accumulates and is selectively forgotten over time. recolo combines both,
treating **forgetting as a design feature rather than a failure mode.**

The architecture maps biological memory onto an agent: working memory to the live context
window, episodic memory (hippocampus) to a vector store of session memories, semantic
memory (neocortex) to cluster centroids from semantic compression, hippocampal indexing to
semantic clustering as retrieval index, slow-wave consolidation to a scheduled
consolidation loop, synaptic decay to exponential weighting `w(t) = e^(-λt)`, and
amygdala salience modulation to importance scoring with sentiment magnitude as an arousal
proxy.

Grounded in Xie (2025) on LLM forgetting taxonomy and Anthropic's context-engineering
framework, with forgetting made *programmable* — decay rate λ and salience thresholds are
tunable parameters rather than emergent behavior.

**What runs.** Both stores sit behind one interface over SQLite. Decay is computed at
retrieval from the stored timestamp rather than written back, so λ can be changed and a
retrieval re-run without migrating any record. Salience is orthogonal to decay by
construction: a memory can be old and still surface, which is the whole reason the two
signals are separate. Consolidation clusters unconsolidated episodes, promotes centroids,
merges into existing semantic nodes on repeat rather than duplicating them, and
**accelerates decay on episodes a centroid already represents instead of deleting them**
— the episode stays auditable, it just stops competing. Every pass is logged, because a
system whose selling point is deliberate forgetting has to be able to account for what it
discarded.

The default embedder is a deterministic hashing vectorizer with no network dependency, so
the loop runs and is tested offline. It is lexical, and the repository says so plainly:
on its own test fixtures, within-topic similarity overlaps cross-topic similarity. The
clustering algorithm is therefore tested on synthetic vectors with known structure and
the consolidation loop on a separable test double, rather than tuning thresholds until a
lexical accident passes.

**Evaluated: as shipped, it does worse than plain retrieval.** The test was LongMemEval
(Wu et al., 2024): each question sits over a ~115k-token history of dated chat sessions.
Every arm filled the same 6,000-token context from the same memory units. Claude Haiku
4.5 answered, and graded with the benchmark's own prompts. The protocol was committed
before the 99 held-out questions were scored once. recolo scored 0.32 against 0.73 for
plain similarity retrieval over the same memories (paired difference −0.40, 95% CI −0.52
to −0.28). The ablations locate the cause. Decay at its shipped six-day half-life erases
evidence up to a month old: turning it off recovers 38 points and makes recolo
indistinguishable from plain retrieval. Salience and consolidation have no measurable
effect. Decay also failed at its own job: on questions where a newer fact replaces an old
one, recolo scored 0.43 against 0.79 for plain retrieval. With every mechanism off, recolo
and plain retrieval select identical memories, so the gap comes from the mechanisms, not
the plumbing.

**Adaptive decay, second protocol (2026-09-26).** Three decay modes that adapt to the
history — relative to its span, counted in sessions, or only breaking near-ties — were
built, tuned on 61 new questions and tested on 119 more, none used before. On evidence
recall, which needs no model, none beats plain similarity: span-relative decay keeps 75%
of evidence turns and session-counted decay 43%, against 96% for plain retrieval, and the
tie-breaking mode is indistinguishable from it. Plain retrieval already finds every
knowledge-update evidence turn. The answer-accuracy run then checked whether decay helps
by keeping superseded facts out of the context: it does not. On 119 held-out questions,
plain retrieval answered 0.76; the tie-breaking mode matched it (0.77, no detectable
difference), span-relative decay fell to 0.55 and session-counted decay to 0.34, and none
beat plain retrieval on knowledge-update questions. Across both protocols, decay — fixed
or adaptive — does not help an agent answer from its own history; at best it does no harm.

**Salience and consolidation, third protocol (2026-09-26).** With decay off, the two
remaining mechanisms were rebuilt as the evaluations suggested: salience from recurrence (a
topic returning in a later session), used only to break near-ties; and consolidation as an
index, where a query matching a cluster pulls in its member episodes and no label is ever
shown. The test ran at a 1,000-token budget, where ranking decides what the reader sees
(at 6,000 tokens plain retrieval already finds 97% of the evidence), on all 182 questions
no earlier run had touched. On the tuning questions, every setting strong enough to change
the ranking lowered recall. On the held-out questions neither mechanism beat plain
retrieval: salience −0.005 in evidence recall (CI −0.013 to 0.000), consolidation −0.006 on
multi-session questions (CI −0.017 to 0.000). A gate fixed in advance sends only an arm that
beats plain retrieval to the paid answer-accuracy step, so this protocol spent nothing.
Across three protocols, none of recolo's bio-inspired mechanisms helps an agent choose
context from its own history; plain retrieval over its store is the configuration that
works. The library now defaults to it: decay, salience scoring and scheduled consolidation
are opt-in, and the designed configuration is one call away for anyone reproducing the
evaluations.

Direct successor to veridian: it takes that project's core insight — semantic clustering
as a general-purpose meaning-compression mechanism — and redirects it from external
literature to an agent's own persistent memory.

---

## Supporting — production systems

Privately hosted, single- or small-tenant web applications. Repositories are not public;
the engineering is described here. Personal and third-party data is excluded by design.

### menhir — adaptive strength coaching platform
**Status:** Shipped · Next.js (App Router), TypeScript, Auth.js v5, Stripe · ~106K LOC, 349 files, 25 test modules

A dual-role platform serving both athletes and coaches. Its differentiator is adaptive
programming driven by multiple autoregulation signals — readiness, sleep, performance
trend, calibrated RPE — plus a structured coach↔athlete channel.

The architecturally interesting part is the **AI pipeline sitting on top of deterministic
engines rather than replacing them**: a provider abstraction across Groq, OpenAI and
Anthropic generates programs, but 14 methodology generators and an RPE calibration engine
underneath enforce the training mathematics, and generated programs are validated and
shown for preview before they can be committed or assigned. A mock mode runs the entire
flow with live AI disabled.

Also: role-aware route protection over Google OAuth, tiered subscription billing for both
roles, server-backed notifications and Web Push, an installable PWA with cached offline
reads and background-sync offline writes, and a pluggable data layer behind a single
adapter seam.

### audire — self-hosted media library platform
**Status:** Shipped · FastAPI, SvelteKit, Python · 21K LOC, 37 test modules, versioned releases

A personal audio curation and library-management platform, packaged and deployed as a Home
Assistant add-on. FastAPI backend across 21 routers, SvelteKit web client, a native macOS
launcher, and a background queue worker behind Caddy, with library synchronization,
ReplayGain normalization, cover art handling, and metadata enrichment from MusicBrainz and
Wikipedia.

Library hygiene is handled where the obvious approach doesn't work: the same recording
arrives from different sources as separate encodes, so duplicate detection matches on
tags and duration rather than file hashes, grades each match by how much agrees, and
quarantines rather than deletes. Duration alone proved too weak — an album is full of songs
of near-identical length — so a match also needs the title or the track slot to agree, and
a person's "not a duplicate" judgement is remembered per pair of files. Artwork a user sets,
album covers and artist photos alike, is written where the streaming server and every
client read it — into the files and the artist's folder — not into the app's own database.

Notable for its **failure handling against an uncooperative upstream**: randomized pacing
between requests, a single delayed retry for transient rate-limiting that resumes only the
missing items, and no retry at all for permanent failures — waiting doesn't fix a removed
resource. Every release is a tagged version with a changelog entry and a written release
and rollback process; CI runs the Python and web suites and the web build on every push,
pinned to the add-on image's runtime versions. The architecture is written down as it
runs — five processes in one container, the rules that let three of them share one SQLite
file, and a read and a write request traced end to end.

### ponere — content lifecycle tool
**Status:** Shipped · Next.js (App Router), TypeScript, Claude API

A single-user system for taking a rough idea to a published post: capture, a lifecycle
that moves ideas from draft to live to dormant so nothing sits untouched, platform-specific
drafting shaped to how each platform actually works, and a log of what shipped where.
AI-assisted drafting turns a rough capture into a platform-ready draft grounded in stored
voice and platform notes — always a suggestion, never auto-published. Its colours and
typefaces come from the brand stylesheet it shares with scintilla and lumen.

### mara — multi-tenant pricing API
**Status:** Shipped · Next.js route handlers, TypeScript, Postgres, Vercel Cron, Vitest

A pricing API for the moving industry, built to take pricing out of one company's
operations platform and make it a service any mover could call. It prices three kinds of
move: local hourly, interstate by weight and distance against a filed tariff, and military
under the Department of Defense's published 400NG tariff. Its first tenant is a client's
operations platform, which calls it server to server in production on all three tracks.

One `survey` endpoint does what a mover does on a walkthrough. It resolves the shipment's
weight, estimating it from job-site photos with a vision model when asked. It then routes
the move to the right track, recommends a crew, and returns priced line items. The
per-track endpoints remain for callers that already know their track.

- **Multi-tenant by configuration.** Every rate that used to be a constant in the calling
  app is a per-tenant row with calibrated defaults. Scoped API keys resolve to a tenant and
  are stored only as hashes. Military pricing needs a per-tenant approval as well as a
  global flag.
- **Distance resolution degrades rather than fails.** A paid geocoding and routing tier
  falls back to free open-source routing, then to a straight-line estimate, so a missing
  key lowers accuracy without stopping pricing.
- **Reference data maintains itself.** A weekly cron refreshes the fuel surcharge from the
  U.S. Energy Information Administration. A quarterly Action checks for a newer military
  tariff and opens a pull request for review. It never merges and never touches the
  enable flag.
- **Outcomes feed calibration.** Every priced request is logged without personal data,
  and callers report actual against estimated numbers after the job.

10 test modules.

### Additional services

- **An events-business backend** — Express 5, Stripe payments, Google OAuth, transactional
  email, and a schematic tooling layer.
- **A private health-tracking application** — Next.js 16 / React 19, bcrypt plus signed JWT
  session gating on every route, a service-account spreadsheet backend, and a
  server-side-proxied nutrition data integration. Tokenized light/dark design system.
- **A payment-plan portal** — Vercel serverless functions with Stripe invoicing, dual
  authentication (passwordless magic link for participants, password for admin),
  short-lived httpOnly/Secure/SameSite session cookies, timing-safe password comparison,
  and raw-body Stripe webhook signature verification.
- **A single-page marketing site** for a healthcare navigation practice — no framework, no
  build step.
- **An operations platform for a moving company** — Next.js, Postgres through Drizzle,
  Auth.js, Stripe, transactional email and SMS, PDF estimates and e-signatures, taking a job
  from quote request to completion. Its pricing is served by mara, above.

---

## Supporting — learning & knowledge tools

A lesson player and its authoring pipeline, which uses veridian's Check to verify every
generated claim, plus a public reading index.

### scintilla — a free lesson player that checks understanding throughout
**Status:** Implemented · plain HTML, CSS and ES modules; Pyodide; offline service worker

A free learning platform for data science, ML and AI, built as a pair: lumen authors and
verifies curricula, scintilla teaches them in the browser with no account and no cost. The
design targets the usual failures of self-paced courses — passive content, one easy quiz at
the end, lessons that never connect, and nothing that schedules review.

- **Lessons of 5–10 minutes**, each opening with a bridge from what came before, with a
  checkpoint every few paragraphs and at least one hands-on item — predict-then-run, spot
  the bug, or Python run in the browser with Pyodide.
- **A Feynman self-check** against the lesson's principles. A "no" routes the learner down
  the prerequisite graph to the missing idea, then back.
- **Review scheduled by FSRS**, over progress stored locally as an append-only event log,
  so sync across devices cannot conflict and the platform keeps working with its backend
  down.
- **Nothing is generated while a learner uses it.** Every lesson is generated, verified
  and reviewed at authoring time, so no learner needs an API key and the cost per extra
  learner is near zero.

The primary metric is delayed recall at 7 and 30 days, not completion. The first
curriculum is outlined: 35 lessons across a shared core (Python for data, math essentials,
machine-learning basics) and a data-science track that runs from exploration and inference
to a first neural network. The MVP is one of those lessons built end to end through lumen
and tested with four learners.

The player is implemented and runs end to end against lumen's catalog releases. It checks
each release's schema version and sanitises every piece of lesson text to a small allowed
markup set. It records progress as an append-only event log with export and import, and
derives the weekly streak, its forgiveness rules and the "learned" status from that log in
pure, unit-tested functions. Lesson code runs in the browser with Pyodide, loaded only on
first use, and the app and its catalog keep working offline. An end-to-end browser test
runs a full lesson under the production security headers, with an accessibility scan of
every screen. The first lesson, Probability, has been reviewed and ships as catalog release
v0.1.0; the player serves it from a private deployment until the learner test. Its look
comes from a brand stylesheet shared with ponere and lumen and served from this site, so
one change restyles all three.

### lumen — the authoring pipeline behind scintilla
**Status:** Implemented · Python; Claude API at authoring time only; veridian Check

Builds scintilla's curriculum as a versioned static catalog: retrieve openly licensed
sources, generate with a pinned Claude model, verify, review by hand, publish. The catalog
schema is the only contract between the two repositories, and a release that fails
validation is never published. The rules that matter to learners are enforced by the
build: every lesson bridges to its neighbours, every principle has a pinned source and two
representations, every answer key is verified by string match, computation or an
executable check, and every wrong option maps to a named misconception.

Claims are verified with veridian's Check engine, which grounds each principle's statement
in sentences from its source and sends anything unsupported to review. Content is licensed
CC BY-SA 4.0, so it cannot later be put behind a paywall. An earlier pipeline — study notes
refined into three-tier prose and pushed across repositories — never published a section
and is retired; its authoring prompt carries into the new content playbook.

The first artifact of the new pipeline is the catalog outline: 35 lessons, each with its
prerequisites and a stated learner outcome, in a prerequisite graph with a single root.
Every item of the two earlier plans — 74 planned sections and 29 skill-tree nodes — is
mapped into it, deferred to a named future track, or retired with a reason, and a checker
run in CI proves none is missing and that every prerequisite comes first.

The catalog schema (v0.1) is defined too: JSON Schemas for a lesson and a release, and a
validator for the rules a schema can't express. It checks that bridges follow the
prerequisite graph and that every principle has a pinned source revision and two
representations. It also checks that every wrong option names a misconception and every
answer key verifies, by string match or exact arithmetic. Only reviewed lessons can enter a
release.

The pipeline runs. It fetches the pinned source revisions and drafts a lesson with Claude
under structured output against the schema, feeding any validation failures back for
repair. veridian's Check then grounds every principle in its source, as advice for the
reviewer, and the lesson must pass review before a release will include it. The first
lesson, Probability, passed validation on its first draft, and Check found every principle
supported by its source. Reviewing it also surfaced a real defect: every correct answer sat
in the same position. The validator now rejects that, and the pipeline varies it. After
review, the lesson was published as the first immutable catalog release, v0.1.0: 35
lessons listed, one available. A local viewer shows each release as a shelf of subjects,
one collapsible book per module with its lessons as chapters, and opens any published
lesson's record: sources, Check verdicts, checkpoints and review.

### bibliotheca — reading index
**Status:** Shipped · GitHub Actions, Google Books API

A public reading shelf driven entirely by filenames: an ISBN-13-named file pushed to a
status folder triggers an Action that resolves metadata through the Google Books API and
publishes to the public shelf. Moving a file between folders updates reading status and
completion date. The file is the signal.

### bibliotheca-archive — the automation behind the shelf
**Status:** Shipped · GitHub Actions, Google Books API, Git LFS

The private counterpart to bibliotheca, and where its automation actually runs. Adding an
ISBN-13-named file to a status folder fires an Action that resolves the work through the
Google Books API and writes the resulting metadata across to the public shelf repository,
which rebuilds itself. Moving a file between folders updates reading status and stamps a
completion date; an optional sidecar JSON carries a rating and note that get merged in.

Binary files are handled through Git LFS. The design point is that **the filesystem is the
interface** — there is no form, no database and no admin UI, and the only action required
is putting a file where it belongs.

---

## Supporting — tooling & designs

Tooling that keeps the portfolio honest and moving, and designs not yet built out.

### custos — cross-portfolio tooling
**Status:** Shipped · POSIX shell, GitHub Actions

Tooling that operates across every project rather than inside any one of them, built
around a single rule: if an automation would still make sense as a hook on one
repository's own pushes, it belongs in that repository, not here.

Its first tool reports development rotation — which projects have gone longest without
real work. It separates *any* commit from a commit that touched something other than
markdown, and ranks on the latter, so documentation activity cannot disguise a project
that has not been developed in months. Each row carries the first unchecked item from
that project's backlog, so the report answers what is overdue and what to do next
together.

A scheduled workflow runs the same script weekly against treeless clones of every
repository — full history and trees, no file contents — so the automated report and the
local one are the same implementation and cannot drift apart. Results are written to a
single issue that is edited in place rather than reopened.

### catasta — research-pipeline demo pattern
**Status:** Designed (reference pattern) · FastAPI, Next.js, TypeScript

A documented pattern for turning a research pipeline into a polished interactive demo
without shipping the pipeline itself to the browser: a Python backend where the science
lives and stays server-side, paired with a TypeScript frontend where people experience it.
Two deployment topologies — embedded (one shared backend, demos as routes) and standalone
(forked per project) — sharing an identical `preprocess → predict → postprocess` contract.

### noul — non-generative answers about code
**Status:** Results committed (`find` only) · Python, PyTorch, Hugging Face Transformers · 41 labelled queries, 2 codebases

Coding agents answer "where is X" by reading files into their context, where every file
is re-sent with every later turn. TypeSafe's Jev points at an alternative: a model that
returns typed, calibrated numbers instead of prose, in a single pass. Jev is API-only and
its architecture unpublished, so noul asks how much of that shape can be rebuilt from open
models running locally, with no text generation and nothing leaving the machine.

`find` ranks files by how well they match a plain-language description, including
descriptions whose words never appear in the code. It runs in two stages. BM25 and a
33M-parameter embedding model, fused by reciprocal rank, shortlist 20 chunks, and a
568M-parameter cross-encoder reranks only those. Notebooks are read as code and
markdown, without outputs.

**Measured** on 35 answerable, labelled queries across a JavaScript web application
and a Python/notebook research codebase (iridis), plus six queries whose feature does
not exist:

| | P@1 | R@3 | s / query |
|---|---:|---:|---:|
| BM25 alone | 0.63 → 0.69 | 0.80 → 0.83 | < 0.01 |
| Reranker over every chunk | 0.66 → 0.74 | 0.94 → 0.97 | 6.7–25.6 |
| **Two-stage** | **0.69 → 0.77** | **0.94 → 0.97** | **2.1–2.3** |

(Original labels → current labels, with the three widenings.) The honest reading: at top-1 the two-stage lead over
keyword search is two or three queries of 35, too few to call. The replicated gain is the
shortlist, where a correct file is in the top three for 34 of 35 queries against 29 for
BM25 on the current labels, at a tenth of the brute-force cost on the larger codebase.
Three labels were widened after the first run showed defensible answers they had missed.
All 41 labels were drafted by Claude against the source and are not independently
verified, and the sample is small.

**On a strict rule — a query counts only when every correct file is found — the picture
is less flattering.** Every single-file query has its file in the top five, but only 4 of
9 multi-file queries have all their files there, fewer than keyword search (5). The
20-chunk shortlist keeps the best chunks, which tend to come from one dominant file, so
secondary files never reach the reranker. Overall, 30 of 35 queries are complete in the
top five (keyword search 27). A pre-registered fix — a shortlist spread across files —
lifted multi-file completeness from 4 to 6 of 9 on these queries but made no difference on
a fresh held-out codebase (16 of 17 either way), so the default is unchanged. The held-out
miss points somewhere else: test files crowding a source file out of the top five.

**Not yet built:** calibration, which would turn scores into probabilities and let `find`
answer "not here" (no single threshold separates absent features yet); the per-file
yes/no `ask` mode; and a test on a large codebase, where the shortlist actually has to
prove itself. A Claude Code skill already fronts it with a small-model agent, which the
local scorer is meant to replace for all but ambiguous cases.

### legere — ensemble handwriting recognition scaffold
**Status:** Designed (scaffold) · Python, module structure for TrOCR, Donut, PaddleOCR, SimpleHTR

A structural design for extracting handwritten field values from mixed-content forms on
premises — no document content leaving the building, which is the constraint that shapes
the whole architecture. Template-based field segmentation feeds a benchmarking matrix in
which every model is tested against every field type before routing is assigned, a
vision-language model arbitrates across model predictions, and low-confidence fields route
to a human review queue with per-field provenance.

The repository is the **skeleton for that design, not a working system**: each model
adapter is an interface stub, and the arbitration layer is placeholder logic pending a
real implementation. The value here is the separation of concerns — a common prediction
interface per model, arbitration isolated from prediction, evaluation isolated from both —
which is what makes the design extensible.

---

## This site

Next.js (App Router), TypeScript, static export, GitHub Pages. Not listed as a project;
described here because it hosts this index.

The site this index belongs to. Next.js with `output: 'export'` for a fully static build,
deployed to GitHub Pages through an Action on push to main.

Its homepage is a **spatial knowledge graph** rather than a timeline: 46 nodes across
education, roles, projects and capabilities, positioned by hand so proximity carries
meaning.

The structure makes one argument. Roles and education are anchors, each in its own
colour; capabilities are neutral grey rings rather than filled discs, deliberately
subordinate. Roles are never wired to each other directly — a capability touching two
roles *is* the claim that the same competence carried across both, so the shared skill is
what links them. Teaching connects a graduate instructorship, a postdoc, and a current
industry role; bioinformatics connects a doctorate, two research posts, and an agri-genomics
role. Node type is signalled three ways at once — colour, size, and typeface, following the
brand's serif-is-voice / display-is-structure / mono-is-utility rule. Selecting any node
opens résumé-derived detail plus its working vocabulary — the terminology a reader would
search for. Vocabulary terms are themselves navigable: selecting one reveals every node
sharing it, which surfaces relationships no single edge expresses. Hovering
isolates a node's connections; selecting one opens a detail panel whose connection tags
navigate the graph without returning to the canvas. Pannable and zoomable, with
hand-rolled pointer handling and no visualization dependency.

Six projects carry long-form write-ups — iridis, topos, veridian, menhir, lambent and
recolo — reachable from their node in the graph. menhir's is the only public account of a
private codebase; recolo's reports a result that went against the design, as measured.

It also hosts this file, which is the canonical description of everything above. Every
project surface on the site — the résumé page, grouped by area, the graph's project
panels, and a JSON feed the résumé document syncs from — reads one structured registry,
and the build fails if that registry and this file disagree on which projects exist, where
they sit, or their status.

---

## Maintaining this file

This is the canonical description of these projects. When a project's status, results,
architecture or scope changes materially, update the relevant entry here in the same pass
as the change itself.

What belongs here: what a project does, the approach and the reasoning behind it, the
stack, honest status, and results that are reproducible from the repository.

What does not: client names, engagement metrics or any figure covered by confidentiality;
personal health, financial or third-party data; credentials, infrastructure specifics or
anything security-relevant; and private notes about the projects rather than the projects
themselves.
