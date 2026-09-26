export const metadata = { title: "fragaria. — shel." };

/** One journal-style figure: wide image linking to its full-resolution file, sans caption. */
function Figure({ n, src, alt, lead, children }: { n: number; src: string; alt: string; lead: string; children: React.ReactNode }) {
  return (
    <figure className="wide">
      <a href={src} target="_blank" rel="noopener">
        <img src={src} alt={alt} loading="lazy" />
      </a>
      <figcaption>
        <span className="fig-lead">
          Fig. {n} | {lead}
        </span>{" "}
        {children}
      </figcaption>
    </figure>
  );
}

export default function FragariaPage() {
  return (
    <>
      <span className="kicker">Project — 2026–</span>
      <h1>fragaria.</h1>
      <p className="tagline">
        Is there stable haplogroup structure in cultivated strawberry, and is any of it nonlinear? The first answer came back GO. An
        audit found it invalid. A pre-registered rebuild says GO again, narrowly, and only for structure a linear projection can find.
      </p>

      <h2>Why this exists</h2>
      <p>
        Cultivated strawberry is octoploid. Array genotypes flatten eight copies of each chromosome into three calls, subgenomes blur
        together, and breeding programs cross closely related parents. In data like this it is easy to embed, cluster, and find
        something that looks like population structure. fragaria is the first case study of{" "}
        <a href="/projects/topos/">topos</a>, a protocol for deciding when structure like that is real enough to act on. Stage 0, the
        data-landscape audit, asks three things before anything more expensive runs: is there structure that survives perturbation, is
        it explained by a technical artifact, and does it agree with anything the genotypes did not see?
      </p>

      <h2>The first Stage 0, and why it did not count</h2>
      <p>
        The first run returned GO with every criterion passing, three of them at exactly perfect values. Rerunning it from a clean kernel
        reproduced every output, so the problem was not reproducibility. An audit found two others.
      </p>
      <p>
        <strong>Three criteria passed by construction.</strong> Stability was measured as agreement across random seeds, but the winning
        pipeline, PCA followed by HDBSCAN, uses no seed, so ten identical runs agreed perfectly. The best pipeline was chosen by that same
        agreement, so a deterministic one was always going to win. A fifth criterion, external coherence, was defined in code as the
        confound result.
      </p>
      <p>
        <strong>The missing calls were never decoded.</strong> The genotype file marks a missing call as −1. The notebook read −1 as a
        number, so no call was ever treated as missing. Quality control saw zero missingness, imputation never ran, and about 930,000
        missing calls entered PCA as a genotype of −1. The confound check reported that missingness explained nothing about the clusters,
        because as far as the notebook knew there was none (Fig. 1).
      </p>

      <Figure
        n={1}
        src="/projects/fragaria/fig1_decoding.png"
        alt="Two panels. a: bar chart of genotype codes, 0 at 28.5%, 1 at 31.0%, 2 at 39.1%, and -1 (missing) at 1.5%. b: histogram of missing calls per accession after decoding, ranging from 0.2% to 9.1%, with a red line at 0% marking what the first run saw."
        lead="The first run never decoded missing calls."
      >
        <b>a</b>, Share of all 64 million calls by code. The file marks missing calls as −1 (1.5%, about 930,000 calls); the first run
        analysed them as a genotype value. <b>b</b>, Per-accession missingness once −1 is decoded (1,520 accessions). The first run saw
        0% for every accession (red line), so its missingness confound had nothing to test.
      </Figure>

      <h2>The rebuilt test</h2>
      <p>
        The protocol was rewritten and committed before any new code existed, including a written guess at the result. It fixed five
        things.
      </p>
      <ul>
        <li>
          <strong>Missing calls are decoded first,</strong> then filtered and imputed. Of 42,081 markers, 41,691 pass quality control and
          placement, and pruning linked markers within each chromosome leaves 5,408.
        </li>
        <li>
          <strong>Stability comes from perturbing the data.</strong> Each of 20 draws keeps 80% of accessions and 80% of markers and refits
          everything. Stability is the median agreement (adjusted Rand index) across all 190 pairs of draws, on the accessions they share.
        </li>
        <li>
          <strong>Every pipeline is scored.</strong> The full grid is 189 settings: PCA or UMAP embeddings, KMeans or HDBSCAN clustering,
          across their parameters. A GO needs two settings from the same pipeline family to pass every gate, so no verdict rests on one
          lucky choice.
        </li>
        <li>
          <strong>Pedigree is controlled.</strong> One full-sib family has 187 members. Each family is capped at three, leaving 925
          individuals.
        </li>
        <li>
          <strong>Coherence uses what the genotypes never saw:</strong> germplasm source (USDA accessions, named cultivars, the breeding
          program) and technical replicates of the same plant, which must land in the same cluster.
        </li>
      </ul>

      <h2>What it found</h2>
      <p>
        <strong>GO, by the pre-registered rule, and no more than that.</strong> Exactly two settings pass every gate, the minimum the rule
        allows. Both are PCA on 10 components followed by HDBSCAN, with stability of 0.82 and 0.84 against a bar of 0.80 (Fig. 2).
      </p>
      <p>
        The gate that decides it is not stability. Twenty-four settings pass stability and validity, and 22 of them fail the missingness
        check: their clusters differ in how many calls failed, with the effect size between 0.23 and 0.61 against a limit of 0.20. The
        written expectation said missingness would pass. It mostly did not.
      </p>

      <Figure
        n={2}
        src="/projects/fragaria/fig2_gates.png"
        alt="Two panels. a: strip plot of stability for each of four pipeline families; PCA settings cluster above 0.8, UMAP to HDBSCAN settings mostly between 0.2 and 0.6. b: scatter of missingness effect size against stability; most stable settings sit above the 0.2 missingness bar, and only two settings fall in the passing region."
        lead="Stability and the gates across all 189 settings."
      >
        <b>a</b>, Stability (median adjusted Rand index over 190 pairs of resampled draws) for each setting, by pipeline family. Dashed
        line, the pre-registered bar of 0.80. <b>b</b>, Missingness effect size (η² of per-accession missingness across clusters) against
        stability. Shaded, the region that passes both. Grey, fails stability or validity; blue, stable and valid but fails another gate;
        red, passes every gate. Only two settings, both PCA on 10 components followed by HDBSCAN, reach the shaded region.
      </Figure>

      <p>
        The structure that passes follows germplasm source (Fig. 3a, b). The largest cluster, 567 samples, is 96% breeding-program
        lines and runs along that arm of the first principal component. Two small clusters (51 and 25) are mostly USDA accessions and
        named cultivars. About a third of samples are left as noise, including most USDA accessions (138 of 190), so the diverse
        material is the part this pipeline resolves least. In both passing settings, replicates of the same plant land together.
      </p>
      <p>
        Missingness follows source too (Fig. 3c). USDA accessions fail 2.8% of calls on average and breeding-program lines 1.0%. That is
        the signature of array ascertainment: a genotyping array designed on one set of germplasm fails more calls on material that
        diverges from it. So the missingness check, meant to catch a technical artifact, partly penalizes structure because it is real.
        That reading came after the result and does not change the verdict, but it changes what the next test must do.
      </p>

      <Figure
        n={3}
        src="/projects/fragaria/fig3_structure.png"
        alt="Three panels. a: first two principal components of 932 samples coloured by germplasm source, with breeding-program lines along the right arm and USDA accessions at the left. b: the same projection coloured by HDBSCAN clusters, with a large cluster on the program arm, a small USDA cluster, and grey noise. c: missing calls per accession by source, with means of 1.0% for the program, 1.6% for named cultivars and 2.8% for USDA accessions."
        lead="The structure that passes, and why missingness tracks it."
      >
        <b>a</b>, First two principal components of the thinned panel (925 individuals, 932 samples including replicates), by germplasm
        source; shape repeats colour. <b>b</b>, The same projection coloured by the clusters of the passing setting (PCA on 10
        components, HDBSCAN with minimum cluster size 25 and minimum samples 10). Grey, noise. <b>c</b>, Missing calls per accession by
        source; bars mark means. Panel c is an analysis made after the result, not part of the pre-registered protocol.
      </Figure>

      <p>
        <strong>No UMAP setting passes.</strong> UMAP pipelines were less stable under resampling, as expected, and the few that were
        stable and valid failed missingness. So nothing here supports the hypothesis fragaria exists to test, that manifold methods find structure
        PCA misses. That test belongs to a later stage and has not run.
      </p>

      <h2>Why the family cap mattered</h2>
      <p>
        Without the cap, the analysis finds families. On the full panel, the same PCA settings produce clusters that are 72–100% a
        single full-sib family, and the 187-member family pulls a principal component of its own (Fig. 4). With three per family, no
        cluster is more than 18% one family.
      </p>

      <Figure
        n={4}
        src="/projects/fragaria/fig4_pedigree.png"
        alt="Two panels. a: first two principal components of all 1,520 accessions, with one 187-member full-sib family forming a tight isolated group. b: for 18 distinct PCA settings, the largest share of any cluster drawn from one family, between 1% and 18% after thinning and 72% to 100% on the full panel."
        lead="Without the family cap, clusters are families."
      >
        <b>a</b>, First two principal components of the full panel (1,520 accessions) before thinning; red, the 187 members of one
        full-sib family. <b>b</b>, For each distinct PCA setting (18; three duplicate HDBSCAN settings removed), the largest share of any
        cluster drawn from a single full-sib family, after thinning to three per family (blue) and on the full panel (red).
      </Figure>

      <h2>Limits</h2>
      <p>
        One array, with pseudo-diploid calls on an octoploid. No batch or plate records exist, so missingness is the only technical
        confound, and it is entangled with source. The family cap controls full-sibs but not half-sibs: 22 accessions from eight related
        2016 families still sit together after thinning, though the passing setting labels them noise. And the HDBSCAN grid counted one
        setting twice, which does not affect this verdict but would weaken a rule that asks for two.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed (Stage 0).</strong> The protocol, code, 10 unit tests, every setting&apos;s scores and these figures
        are committed, and the full run takes about 21 minutes on a laptop. The protocol was committed before the code, and the code
        before the result.
      </p>
      <p>
        Before Stage 1: separate ascertainment from technical failure by testing missingness within each source, or on markers that
        genotype cleanly in every group; cap relatedness by kinship rather than family labels; remove the duplicate setting. Then the
        real test, whether a manifold method finds stable structure beyond this PCA reference, gets pre-registered against it. The
        lessons also go upstream: topos now requires missing-value codes to be declared and decoded at load, and parameter grids to be
        deduplicated before any rule counts settings.
      </p>
    </>
  );
}
