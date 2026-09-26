import Figure from "../Figure";

export const metadata = { title: "fragaria. — shel." };

export default function FragariaPage() {
  return (
    <>
      <span className="kicker">Project — 2026–</span>
      <h1>fragaria.</h1>
      <p className="tagline">
        Is there stable haplogroup structure in strawberry, and is any of it nonlinear? The first answer came back GO, and an audit found
        it invalid. Across three panels and five pre-registered protocols, the answer is yes to the first question and no to the second,
        and the structure turns out to be most useful as a map of what crossing would add.
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

      <h2>The third run: fixing what the second one found</h2>
      <p>
        The second run left three problems, and a third protocol, committed before its code, fixed them. <strong>Relatives.</strong> The
        family cap misses half-sibs: 22 accessions from eight related families still sat together. The third run removes relatives by
        measured kinship instead, pruning until no two accessions are second-degree relatives or closer, which leaves 234. The usual
        genomic relationship matrix was tried first and rejected. It treats the breeding program&apos;s allele frequencies as the norm, so
        diverse accessions looked related merely for sharing alleles that are rare in the program, and pruning with it would have kept 5
        of 190 USDA accessions. KING-robust kinship does not have that bias. <strong>Missingness</strong> is now tested within each germplasm
        source, so the gate no longer penalizes clusters for following source. <strong>The grid</strong> no longer counts one setting twice.
      </p>
      <p>
        <strong>The verdict is GO, and this time it holds.</strong> It passes in the primary run and in both sensitivity runs, one with a
        looser kinship cut (480 accessions) and one restricted to markers that genotype cleanly in every source. Removing relatives
        stabilized the UMAP→HDBSCAN pipelines, whose median stability rose from 0.35 to 0.76 (Fig. 5a), and 29 of their settings pass
        every gate.
      </p>
      <p>
        That looks like support for the nonlinear hypothesis. It is not. The pre-registered non-redundancy check, comparing the best
        linear and nonlinear partitions, gave an agreement of 0.68, which reads as partial disagreement. A check made after the result
        found the disagreement is entirely noise: on the 157 samples both pipelines assign to a cluster, their partitions are
        identical (Fig. 5b). Both find the same two groups, breeding-program lines against USDA accessions and named cultivars. UMAP
        simply assigns 79 of the 80 samples PCA→HDBSCAN leaves as noise, 75 of them to the diverse group. It adds coverage, not
        structure.
      </p>

      <Figure
        n={5}
        src="/projects/fragaria/fig5_v3.png"
        alt="Two panels. a: stability by pipeline family in the second and third runs; UMAP to HDBSCAN rises from a median of 0.35 to 0.76, other families change little. b: the first two principal components of 237 samples, with a program cluster on the right and a diverse cluster on the left; hollow markers show 79 samples PCA left as noise that UMAP assigned."
        lead="What removing relatives changed, and what it did not."
      >
        <b>a</b>, Stability (median adjusted Rand index over resampled draws) for every setting in the second run (grey circles, panel
        with relatives) and the third (blue squares, 234 unrelated accessions); black bars mark medians; dashed line, the 0.80 bar.
        <b>b</b>, The passing PCA→HDBSCAN and UMAP→HDBSCAN partitions on the first two principal components. Filled markers, samples both
        pipelines cluster, where the partitions are identical; hollow markers, samples PCA→HDBSCAN leaves as noise and UMAP assigns.
        Panel b is an analysis made after the result.
      </Figure>

      <h2>Stage 1b: a wild panel</h2>
      <p>
        Cultivated strawberry&apos;s structure is already explained by breeding, so the better test of the question is a population
        breeding never shaped. Stage 1b took a public whole-genome panel of 202 wild woodland strawberries (<em>F. vesca</em>, diploid,
        sampled across Europe; Toivainen et al. 2026, released CC0) and ran the Stage 0 checks and the Stage 1 test on it. The protocol
        was committed before the data was downloaded, and an amendment, made after inspecting the file and before any embedding,
        handled what it did not anticipate: the genotypes are imputed, so no missingness confound can be tested, and sites are labelled
        only by country. Kinship pruning kept 176 unrelated plants.
      </p>
      <p>
        Stage 0&apos;s checks passed on an east–west split (Finland, the Baltics and Russia against the rest), as the paper&apos;s own
        analysis would predict. The Stage 1 rule then returned GO: three nonlinear settings on the whole panel, and four inside the
        western group, found stable clusters their matched linear settings did not. The expectation had been HOLD or KILL.
      </p>
      <Figure
        n={6}
        src="/projects/fragaria/fig6_stage1b.png"
        alt="Two panels of country-by-cluster count grids, countries ordered from Portugal to Russia. a: whole panel; UMAP with HDBSCAN finds three clusters, south and central Europe, the North Atlantic (Norway 44, Iceland 13, UK 7), and the east (Finland 22, Lithuania 7, Russia 7, Norway 5); PCA with k-means at k 3 finds almost the same three. b: western group; UMAP with k-means at k 3 separates Iberia (Spain 16), central and southern Europe, and the North Atlantic; PCA with k-means at k 5 recovers Iberia and central-southern Europe and splits the North Atlantic into Iceland and two Norwegian groups."
        lead="What the qualifying nonlinear partitions are, beside a linear one that passes the same gates."
      >
        Accessions per country (rows) and cluster (columns). <b>a</b>, Whole panel: a qualifying UMAP→HDBSCAN partition and PCA→k-means
        at k 3 find the same three groups; the eastern cluster is identical. <b>b</b>, Western group: the qualifying UMAP partition
        (all four qualifying settings give this one) and PCA→k-means at k 5, which splits the North Atlantic further. Both panels are
        an analysis made after the result.
      </Figure>
      <p>
        <strong>The GO does not mean what it says.</strong> The rule compared each nonlinear setting only with the linear one sharing its
        clusterer. On this panel, density clustering on PCA coordinates fails outright, so any working nonlinear setting beat it. But
        k-means on the same PCA coordinates passes every gate and recovers the same clusters, and in the western group it finds more.
        Wild woodland strawberry has stable, geographic structure beyond the east–west split, in Iberia, the North Atlantic and
        central-southern Europe, and it is linear. The pre-registered outcome stands as recorded; the reading is that it does not support
        the hypothesis, and the rule needs a stricter linear comparison before any next stage.
      </p>

      <h2>Stage 1c: wild octoploids, and a stricter rule</h2>
      <p>
        A stricter rule re-scored on the woodland strawberry would not have been a test, since the check above already showed the answer.
        So the rule was fixed first and applied to a panel it had not seen: 102 wild octoploids, <em>F. chiloensis</em> and{" "}
        <em>F. virginiana</em>, from a public whole-genome set (Fan and Whitaker 2023, CC-BY). The 33.6 GB variant file was streamed over
        parallel connections and never stored; a hash of each site&apos;s position kept about 2%, 475,741 SNPs. Under the new rule a
        nonlinear partition counts only if no linear setting that passes the same gates recovers it, under any clusterer and k-means at every
        k from 2 to 10, either by agreeing with it or by splitting it more finely.
      </p>
      <Figure
        n={7}
        src="/projects/fragaria/fig7_stage1c.png"
        alt="Two panels. a: 87 unrelated wild octoploids on the first two principal components; F. chiloensis forms one cluster on the right, eastern F. virginiana (mostly subspecies virginiana) a tight cluster at lower left, and western F. virginiana (subspecies platypetala and glauca) spreads upward on the left. b: for the four UMAP settings that pass the gates, agreement with the matched PCA partition: three at exactly 1.0, one at 0.63, all above the 0.5 needed to count as different."
        lead="On wild octoploids, UMAP reproduces PCA's partitions accession for accession."
      >
        <b>a</b>, The 87 unrelated wild accessions on the first two principal components, by taxon. <b>b</b>, Agreement between each UMAP
        setting that passes the gates and its matched PCA setting, on accessions both cluster. Structure counts as new only at 0.5 or below.
      </Figure>
      <p>
        The panel has stable, confound-checked structure that follows taxonomy: <em>F. chiloensis</em>, eastern <em>F. virginiana</em>,
        and the western subspecies. Every UMAP setting that finds it reproduces the matched PCA partition, three of them exactly, so none
        even reached the stricter comparison. The verdict is KILL. Across a cultivated array panel, a wild diploid panel and a wild
        octoploid panel, the answer is the same: stable structure is real, it is geographic or taxonomic, and a linear embedding finds it.
      </p>

      <h2>Stage 2x: what would crossing add?</h2>
      <p>
        The hypothesis was never the only reason to map this structure. The practical question is which populations carry variation that
        cultivated strawberry lacks. A second protocol, written before Stage 1c finished, fixed the measures in advance: how differentiated
        each group is, the alleles no other group carries, and the headline measure, the share of sites where a wild group carries an
        allele at 20% or more that the UC Davis and Florida breeding programs hold at under 5%.
      </p>
      <Figure
        n={8}
        src="/projects/fragaria/fig8_stage2x.png"
        alt="Three panels. a: share of sites where the wild group carries an allele at 20% or more that the breeding programs hold at under 5%: F. chiloensis 11.9%, western F. virginiana 7.5%, eastern F. virginiana 3.6%. b: private alleles per 100 sites, rarefied: F. chiloensis 11.4, western virginiana 7.3, eastern 6.7, named cultivars 2.8, Florida program 1.4, UC Davis program 0.7. c: pairwise F_ST, from 0.07 between Florida and named cultivars to 0.40 between F. chiloensis and UC Davis."
        lead="Pacific F. chiloensis holds the most variation the breeding programs have lost."
      >
        <b>a</b>, Novel-allele supply for each wild group, with 95% intervals from resampling 1 Mb blocks. <b>b</b>, Alleles found in one
        group only, rarefied to equal sample size. <b>c</b>, Hudson&apos;s F_ST between groups.
      </Figure>
      <p>
        Every ranking is distinct. <em>F. chiloensis</em> supplies the most variation the programs lack, then the western{" "}
        <em>F. virginiana</em> subspecies, then eastern <em>F. virginiana</em>, which sits closest to the historic cultivars. Between wild
        groups the two measures disagree, which is the useful part: crossing eastern <em>virginiana</em> with <em>chiloensis</em> adds the
        most heterozygosity, while western <em>virginiana</em> with <em>chiloensis</em> together carry the most of what the programs lack.
        The programs themselves hold almost no private alleles. These are diversity measures: they count favourable, neutral and harmful
        alleles alike.
      </p>
      <p>
        The second part links them to traits. The same study released fruit-size and yield records for 1,787 Florida breeding lines typed
        on a 50K array. The array&apos;s coordinates do not match the whole-genome reference, but 52 lines were genotyped on both, which
        maps every array chromosome to its genome counterpart and tags each associated array marker with a genome site. A mixed-model
        association scan then found three fruit-size loci and no yield locus.
      </p>
      <Figure
        n={9}
        src="/projects/fragaria/fig9_stage2x_b.png"
        alt="Two panels. a: association scans across the genome for fruit size, with three markers above the significance line, all on homoeologous group 1, and for yield, with none. b: for each fruit-size locus, the frequency of the size-increasing allele by group. At 1B, 4.1 Mb: F. chiloensis 0.43, eastern virginiana 0.23, western 0.09, Florida program 0.40, UC Davis 0.07, programs pooled 0.21. At 1A, 4.8 Mb: all wild groups 0.03 or less, programs pooled 0.10. At 1C, 1.2 Mb: eastern virginiana 0.27, chiloensis and western virginiana near 0, programs pooled 0.16."
        lead="Three fruit-size signals on group 1, which a follow-up test showed to be one locus."
      >
        <b>a</b>, Mixed-model association scans; dashed line, the Bonferroni threshold. <b>b</b>, Frequency of the allele that increases
        fruit size, by group, at each locus; vertical bar, the two programs pooled.
      </Figure>
      <p>
        Read naively, panel b says Pacific <em>F. chiloensis</em> carries the size-increasing allele at 0.43, twice the programs&apos;
        frequency. A follow-up test, fixed in advance, withdrew that. The three loci sit on three different subgenomes, which segregate
        independently, yet their markers are strongly associated (r² 0.40–0.68, against a background of 0.05), and conditioning on the
        strongest removes the other two. They are one signal. Its three genome tags, each found by correlation in Florida lines, disagree
        about the wild groups, so the wild frequencies cannot be trusted until the causal site is known. What survives is inside the
        breeding programs, where the tags are read in the population they came from: Florida carries the size-increasing allele at two to
        six times UC Davis&apos;s frequency, with intervals that exclude no difference. That is a crossing lead between programs, with no
        wild material needed.
      </p>

      <h2>Limits</h2>
      <p>
        One array, with pseudo-diploid calls on an octoploid, and no batch or plate records, so missingness is the only technical
        confound. Removing relatives leaves 234 accessions, because the breeding program is densely related: 124 of its 1,227 genotyped
        lines survive. And two groups is the coarsest structure a Stage 0 can certify. Whether a manifold method finds finer stable
        structure inside either group is the real test, and nothing here answers it.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed (Stage 2x).</strong> Six protocols and three amendments, code, 46 unit tests, every setting&apos;s scores and these figures
        are committed; each Stage 0 run takes about 21 minutes on a laptop, Stages 1b and 1c about 7, Stage 2x under one. Each protocol was
        committed before its code, and the code before the result.
      </p>
      <p>
        The nonlinear hypothesis is closed as not supported. Next: find which subgenome holds the fruit-size locus, then ask the
        wild-donor question again. Every lesson here went
        upstream into <a href="/projects/topos/">topos</a>, which now enforces them in code.
      </p>
    </>
  );
}
