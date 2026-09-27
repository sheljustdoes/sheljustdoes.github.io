import Figure from "../Figure";

// Linked from the résumé but kept out of search results while the open work below is unfinished.
export const metadata = { title: "fragaria. — shel.", robots: { index: false, follow: true } };

export default function FragariaPage() {
  return (
    <>
      <span className="kicker">Project — 2026–</span>
      <h1>fragaria.</h1>
      <p className="tagline">
        Is there stable haplogroup structure in strawberry, and is any of it nonlinear? The first answer came back GO, and an audit found
        it invalid. Across three panels and a chain of pre-registered tests, the answer is yes to the first question, and the second found no support.
        The structure turned out to be most useful as a map of what crossing would add. It also led back to a fruit-size locus the
        source study had already reported, now placed on one subgenome: real in Florida breeding lines and still untested elsewhere.
      </p>

      <h2>Abstract</h2>
      <p className="abstract">
        <strong>Background.</strong> Cultivated strawberry (<em>Fragaria × ananassa</em>) is a young allo-octoploid bred from a narrow
        founder base, and the genotyping arrays used on it reduce eight chromosome copies to three calls. In data like this, nonlinear
        embeddings such as UMAP can draw convincing clusters whether or not the structure behind them is real. This study asked whether
        stable population structure exists in strawberry, whether any of it is nonlinear, meaning missed by principal component analysis
        (PCA), and what the structure implies for breeding. <strong>Methods.</strong> Six protocols were each committed to the project repository
        before their code and data. Structure was scored by stability under resampling (median adjusted Rand index over 20 draws of 80% of samples and
        markers) across up to 189 PCA and UMAP settings with k-means or HDBSCAN clustering, behind gates for missing-data confounding,
        relatedness (KING-robust kinship pruning) and agreement with labels the genotypes never saw. Three panels were tested: 1,520
        cultivated accessions on a 50K array, 202 wild diploid <em>F. vesca</em>, and 102 wild octoploid <em>F. chiloensis</em> and{" "}
        <em>F. virginiana</em>, the last two whole-genome. Diversity measures, a mixed-model association scan of fruit size in 1,787
        Florida breeding lines, and a replication in 529 UC Davis individuals followed. <strong>Results.</strong> The first run&apos;s GO
        verdict was invalid: missing calls were never decoded, and three criteria passed by construction. Rebuilt, every panel held
        stable, confound-checked structure: breeding program against diverse germplasm (234 unrelated cultivated accessions), geography
        (176 <em>F. vesca</em>), and taxonomy (87 wild octoploids). In each panel a linear embedding recovered it (for <em>F. vesca</em>, on a check made
        afterwards), and UMAP added coverage, not new groups. The nonlinear hypothesis found no support, though the test compares
        partitions rather than geometry and has no positive control yet. <em>F. chiloensis</em> carries alleles the breeding programs
        lack at 11.9% of sites, against 7.5% and 3.6% for western and eastern <em>F. virginiana</em>. The strongest fruit-size
        association, already reported by the source study, was placed on subgenome 1B. Its larger-fruit allele is common in wild
        octoploids (0.47–0.86) and rare at UC Davis (0.08), A replication there found no effect (−0.18 g per allele, 95% interval −1.00 to
        +0.64) but had only about 50% power at the likely effect size, and whether the array marker still tags the haplotype at UC Davis
        is unresolved once allele frequency is accounted for. <strong>Conclusions.</strong>{" "}
        Stable structure in strawberry is real, and linear methods recover it; nonlinear structure was not detected. Its practical
        use is as a map of what crossing with wild relatives would add. The 1B fruit-size locus holds in Florida lines; the one
        replication elsewhere was inconclusive.
      </p>

      <h2>Background</h2>
      <p>
        Cultivated strawberry arose in eighteenth-century Europe from chance hybrids between two wild octoploids, the Chilean{" "}
        <em>F. chiloensis</em> and the North American <em>F. virginiana</em>. Its genome holds four subgenomes of distinct diploid
        ancestry [1]. Resequencing traces a short breeding history with a sharp early fall in effective population size, and
        a later divergence between the University of California and University of Florida programs as each selected for its own climate{" "}
        [2, 3]. A crop this young, bred from so few founders, leaves much of its wild relatives&apos; variation unused.
        Wild relatives are a recognized reservoir for crop improvement [4], and in strawberry, gene bank accessions carry disease resistance the
        elite pool lacks [5], while heterosis that has disappeared within an elite population persists in wide hybrids{" "}
        [6]. Knowing
        which wild populations differ, and how, is the first step to using them.
      </p>
      <p>
        The data make that harder than it looks. Most strawberry genotypes come from Axiom arrays, the IStraw90 and its 50K successor{" "}
        [7, 8], which call each marker as one of three classes. The dosage of eight chromosome copies and the
        subgenome a probe hits are both blurred, a general problem for polyploid genotyping [9]. Arrays are also designed on
        a discovery panel, here mostly cultivated germplasm, so they sample divergent material unevenly and fail more calls on it{" "}
        [10]. Missing data and ancestry become entangled, and relatives are common in breeding panels.
      </p>
      <p>
        Methods for finding structure have their own hazards. PCA is the standard way to summarize genetic structure [11].
        UMAP [12] has revealed fine-scale structure in large human cohorts that PCA plots obscure [13], which makes it
        a natural candidate for complex crop panels. But nonlinear embeddings distort distances and can show clean clusters in data
        with no discrete structure [14], and density clustering such as HDBSCAN [15] will partition whatever
        embedding it is given. A cluster is credible only if it survives perturbation of the data [16], measured with a
        chance-corrected agreement index [17]. It must also survive checks against relatedness [18] and
        technical artifacts, and every choice has to be fixed before the result is seen, because a flexible analysis can find almost
        anything [19]. fragaria is the first case study of <a href="/projects/topos/">topos</a>, a protocol that encodes those
        requirements as gates. Its Stage 0, the data-landscape audit, asks three things before anything more expensive runs: is there
        structure that survives perturbation, is it explained by a technical artifact, and does it agree with anything the genotypes
        did not see?
      </p>
      <p>
        Linking structure to traits brings a second set of problems. Mixed-model association scans control for relatedness with a
        kinship matrix [20], and multi-locus methods such as FarmCPU trade some of that conservatism for power [21], so the
        same data can yield different locus counts under different models. Association scans for fruit size and other quality traits
        have been run in strawberry breeding lines and diversity panels [3, 22]. Effects estimated in the scan that finds a locus are biased
        upward [23, 24]. A marker that tags a causal haplotype in one population may not in another, because linkage phase
        does not always persist between populations [25]. Both effects predict failed replications, and a failed replication
        alone cannot say which one is at work.
      </p>
      <p>
        This study asked three questions: whether stable structure exists in strawberry, whether any of it is nonlinear, and which
        wild groups carry variation the breeding programs lack.
      </p>

      <h2>The questions, in order</h2>
      <p>
        Answering those three took twelve narrower questions. Rows 1 to 5 take the first two; rows 6 to 12 take the third, down to a
        single fruit-size locus. Each rule was written before the data that answered it were analyzed, and each question after the
        answer before it. Several answers reversed an earlier one. They are kept.
      </p>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Question</th>
            <th>Answer</th>
            <th>What it changed</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>1</td><td>Is there stable structure in cultivated strawberry? (Stage 0)</td><td>GO, then an audit found the run invalid</td><td>Rebuilt with missing calls decoded and honest gates</td></tr>
          <tr><td>2</td><td>Does it survive a proper rebuild? (Stage 0 v2)</td><td>GO, narrowly; PCA only; driven by relatives</td><td>Relatives removed by kinship</td></tr>
          <tr><td>3</td><td>With unrelated accessions only? (Stage 0 v3)</td><td>GO: two groups, breeding program vs the rest</td><td>Structure exists, but PCA and UMAP agree exactly</td></tr>
          <tr><td>4</td><td>Does UMAP find structure PCA misses in a wild panel? (Stage 1b)</td><td>GO by the rule; a later check found PCA with k-means recovers the same clusters</td><td>The rule was too lenient; tightened</td></tr>
          <tr><td>5</td><td>Under the stricter rule, on wild octoploids? (Stage 1c)</td><td>KILL: UMAP reproduces PCA exactly</td><td>Not supported; the test has no positive control yet</td></tr>
          <tr><td>6</td><td>Which wild groups carry variation the breeding programs lack? (Stage 2x A)</td><td><em>F. chiloensis</em> most (12% of sites), then western, then eastern <em>F. virginiana</em></td><td>A diversity ranking for crossing; stands</td></tr>
          <tr><td>7</td><td>Which loci affect fruit size, and do wild groups carry the good allele? (2x B)</td><td>Three fruit-size loci; <em>F. chiloensis</em> looked like a donor. The strongest was already in the source study&apos;s results</td><td>Prompted a check on the three loci</td></tr>
          <tr><td>8</td><td>Are the three loci really one? (C)</td><td>Yes, one signal; the donor reading was withdrawn</td><td>Florida carries the allele at 2–6× UC Davis (15 and 20 unrelated lines)</td></tr>
          <tr><td>9</td><td>Which subgenome holds it? (D)</td><td>1B; its larger-fruit allele is common in the wild</td><td>Donor reading restored, on firmer ground</td></tr>
          <tr><td>10</td><td>Can the region be narrowed, and is 1B right? (E, F)</td><td>Not narrowed (the array is too sparse); 1B confirmed by an independent marker table</td><td>1B first in 99% of resamples; clears the formal margin in 67%</td></tr>
          <tr><td>11</td><td>Does the effect hold at UC Davis? (G)</td><td>No detectable effect, at about 50% power; the wild test could not run</td><td>Practical readings put on hold</td></tr>
          <tr><td>12</td><td>Why not? (H)</td><td>Unresolved once allele frequency is accounted for (later check)</td><td>The replication is inconclusive; paused</td></tr>
        </tbody>
      </table>
      <p>
        <strong>What stands.</strong> Stable structure in strawberry is real, linear methods recover it, and nonlinear structure
        was not detected (1–5). Wild groups differ in what they could add to
        breeding, with <em>F. chiloensis</em> first (6). A fruit-size association the source study had already reported sits on subgenome 1B in
        Florida lines, and alleles linked to it there are common in wild octoploids (7–10). Whether it matters outside Florida is open: the one
        replication was inconclusive (11–12).
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
        analyzed them as a genotype value. <b>b</b>, Per-accession missingness once −1 is decoded (1,520 accessions). The first run saw
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
          everything. Stability is the median agreement (adjusted Rand index [17]) across all 190 pairs of draws, on the accessions they share.
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
        alt="Three panels. a: first two principal components of 932 samples colored by germplasm source, with breeding-program lines along the right arm and USDA accessions at the left. b: the same projection colored by HDBSCAN clusters, with a large cluster on the program arm, a small USDA cluster, and grey noise. c: missing calls per accession by source, with means of 1.0% for the program, 1.6% for named cultivars and 2.8% for USDA accessions."
        lead="The structure that passes, and why missingness tracks it."
      >
        <b>a</b>, First two principal components of the thinned panel (925 individuals, 932 samples including replicates), by germplasm
        source; shape repeats color. <b>b</b>, The same projection colored by the clusters of the passing setting (PCA on 10
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
        genomic relationship matrix [26] was tried first and rejected. It treats the breeding program&apos;s allele frequencies as the norm, so
        diverse accessions looked related merely for sharing alleles that are rare in the program, and pruning with it would have kept 5
        of 190 USDA accessions. KING-robust kinship [18] does not have that bias. <strong>Missingness</strong> is now tested within each germplasm
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
        sampled across Europe; Toivainen et al. 2026 [27], released CC0) and ran the Stage 0 checks and the Stage 1 test on it. The protocol
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
        <em>F. virginiana</em>, from a public whole-genome set (Fan and Whitaker 2024 [3], CC-BY). The 33.6 GB variant file was streamed over
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
      <p>
        KILL here means not detected, and the test has three limits. It compares partitions, so it cannot see clines or curved
        structure inside a cluster. The linear side gets far more chances to match, every setting and k-means at every k from 2 to 10,
        while a nonlinear partition must beat all of them. And the pipeline has not yet been shown to return GO on data with known
        nonlinear structure, the positive control that would show a KILL means absent rather than missed.
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
        lead="Pacific F. chiloensis holds the most variation the breeding programs lack."
      >
        <b>a</b>, Novel-allele supply for each wild group, with 95% intervals from resampling 1 Mb blocks. <b>b</b>, Alleles found in one
        group only, rarefied to equal sample size [28]. <b>c</b>, Hudson&apos;s F_ST between groups [29]. Unrelated plants per group: <em>F. chiloensis</em> 31, western{" "}
        <em>F. virginiana</em> 23, eastern 33, UC Davis 20, Florida 15, named cultivars 24.
      </Figure>
      <p>
        Every ranking is distinct. <em>F. chiloensis</em> supplies the most variation the programs lack, then the western{" "}
        <em>F. virginiana</em> subspecies, then eastern <em>F. virginiana</em>, which sits closest to the historic cultivars. Between wild
        groups the two measures disagree, which is the useful part: crossing eastern <em>virginiana</em> with <em>chiloensis</em> adds the
        most heterozygosity, while western <em>virginiana</em> with <em>chiloensis</em> together carry the most of what the programs lack.
        The programs themselves hold almost no private alleles. These are diversity measures: they count favorable, neutral and harmful
        alleles alike. Two caveats weigh on them. The programs contribute 15 and 20 unrelated lines, so &quot;held at under 5%&quot; means
        at most one or two copies. And the ranking has not been checked against reads from divergent wild plants mapping to the wrong
        homoeolog, which would inflate apparent novelty most in the most divergent group.
      </p>
      <p>
        The second part links them to traits. The same study released fruit-size and yield records for 1,787 Florida breeding lines typed
        on a 50K array. The array&apos;s coordinates do not match the whole-genome reference, but 52 lines were genotyped on both, which
        maps every array chromosome to its genome counterpart and tags each associated array marker with a genome site. A mixed-model
        association scan [20] then found three fruit-size loci and no yield locus.
      </p>
      <p>
        That scan was not the first on these lines. The source study ran its own, with a different method, and reported 26 fruit-size
        signals and 11 yield signals [3]. A comparison made afterwards shows the strongest locus here is among its 26, so what follows
        confirms and places a published association rather than finding a new one. Beyond that locus the two scans disagree: only 2 of
        the study&apos;s 26 fruit-size signals and none of its 11 yield signals pass the stricter threshold used here, including its
        strongest, on subgenome 6D. The method used here tests one marker at a time under a Bonferroni threshold. The study&apos;s
        method [21] fits its strongest markers as covariates and controls the false discovery rate instead, which finds more.
      </p>
      <Figure
        n={9}
        src="/projects/fragaria/fig9_stage2x_b.png"
        alt="Two panels. a: association scans across the genome for fruit size, with three markers above the significance line, all on homoeologous group 1, and for yield, with none. b: for each fruit-size locus, the frequency of the size-increasing allele by group. At 1B, 4.1 Mb: F. chiloensis 0.43, eastern virginiana 0.23, western 0.09, Florida program 0.40, UC Davis 0.07, programs pooled 0.21. At 1A, 4.8 Mb: all wild groups 0.03 or less, programs pooled 0.10. At 1C, 1.2 Mb: eastern virginiana 0.27, chiloensis and western virginiana near 0, programs pooled 0.16."
        lead="Three fruit-size signals on group 1, which a follow-up test showed to be one locus."
      >
        <b>a</b>, Mixed-model association scans; dashed line, the Bonferroni threshold. <b>b</b>, Frequency of the allele that increases
        fruit size, by group, at each locus; vertical bar, the two programs pooled. Positions are each marker&apos;s best genome tag at
        this sparse first pass; the dense pass (Fig. 10) placed the signal.
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
      <p>
        To ask the wild question again, the locus had to be placed. A second, targeted pass read every variant in the first 6 Mb of all
        four group-1 subgenomes, 585,789 sites, by locating their byte ranges in the file and fetching only those. In the 52 lines typed
        on both platforms, one subgenome stands out.
      </p>
      <Figure
        n={10}
        src="/projects/fragaria/fig10_stage2x_d.png"
        alt="Two panels. a: correlation with the lead array marker along the first 6 Mb of subgenomes 1A to 1D; only 1B has many sites above 0.9, clustered at 2.2 to 2.8 Mb with a few near 4 and 5 Mb; 1C has one; 1A and 1D none. b: frequency of the allele that goes with larger fruit, median over 38 sites with range: F. chiloensis 0.86, western F. virginiana 0.60, eastern F. virginiana 0.47, named cultivars 0.21, Florida program 0.33, UC Davis 0.08; black ticks mark the wild frequency of program-frequency-matched background alleles, near 0.05."
        lead="The fruit-size signal sits on subgenome 1B, and alleles linked to it in Florida lines are common in the wild."
      >
        <b>a</b>, Correlation of every dense site with the lead array marker, by subgenome; orange, sites at 0.9 or above. <b>b</b>, The
        larger-fruit allele&apos;s frequency by group, median over the 38 sites on 1B (line, range); black tick, background alleles matched
        on program frequency (an analysis made after the result).
      </Figure>
      <p>
        The signal sits on 1B, in a long haplotype at 2.2 to 5.3 Mb. Resampling the 52 lines puts 1B first 99.4% of the time, but its
        margin over 1C clears the pre-registered bar in only two thirds of resamples. There the allele that goes with larger fruit in
        Florida lines is common in wild octoploids: 0.86 (95% interval 0.79–0.93) in Pacific <em>F. chiloensis</em>, 0.60 (0.52–0.66)
        and 0.47 (0.42–0.54) in the two <em>F. virginiana</em> groups, against 0.08 (0–0.15) at UC Davis. A check made afterwards rules out the obvious artifact, that anything the
        programs have lost looks common in the wild: background alleles at the same program frequency sit near 0.05 in the wild. A later control rules out the
        region&apos;s ancestry: other alleles in the same stretch of 1B, matched on program frequency, sit at 0.02 to 0.08 in the wild.
        What the frequencies cannot show is that the wild alleles sit on the Florida haplotype. Which allele counts as larger-fruit comes
        from linkage in Florida lines, and linkage in wild species is untested. The
        pattern fits an ancestral haplotype that breeding mostly lost and Florida partly kept, though that history is inferred from
        frequencies, not observed, and each wild frequency rests on 23 to 33 plants. The effect is measured in Florida lines
        only; whether the wild haplotype raises fruit size in a wild background is untested.
      </p>
      <p>
        Two checks followed. Fine-mapping across all 1,787 array lines left the lead marker alone (posterior 0.99998): the array is too
        sparse to narrow the haplotype further. And a public marker table from a UC Davis study [30], independent of everything above, puts the
        lead probe on subgenome 1B at 1.7 Mb, while flagging the 1C &quot;locus&quot; as a probe that cannot tell the homoeologs apart. The
        probe sits just before the haplotype, and its strongest genome proxies 0.5 Mb downstream, so the core region is 1.7 to 2.8 Mb
        either way. That supports the placement and explains why one locus looked like three.
      </p>
      <p>
        Then a replication: does the allele do anything outside Florida? A public UC Davis set (Feldmann et al. 2024 [6]) has 529
        genotyped individuals with fruit weight, including hybrids with the wild <em>F. chiloensis</em> &apos;Del Norte&apos;. The test was
        fixed before the files were opened. There the allele varies well, yet its effect is −0.18 g per copy (95% interval −1.00 to +0.64 g). Florida&apos;s trait is grams
        per marketable fruit, so the scales match. Its effect there is +1.2 g per copy under the model used here and +0.7 g under the
        source study&apos;s, and the interval excludes both, the second only narrowly. Both Florida estimates come from the scan that
        found the locus, which tends to inflate them [24], so the exclusion is weaker than it looks. The test was also weak: one-sided power was 90% at the Florida estimate used here, 52%
        at the source study&apos;s and 33% at 0.5 g, and growing environment and trait definition differ between the programs. &apos;Del Norte&apos; does carry two copies, but its elite mates carry almost none, so all its
        hybrids have exactly one and the wild test could not run. On its face that undercuts both practical readings built on the locus, the
        Florida-to-UC Davis crossing lead and the wild-donor reading, but a test this weak cannot take them down.
      </p>
      <p>
        One last check asked why. In Florida lines, the array marker&apos;s best genome tag and the 38 sites that define the larger-fruit haplotype
        travel together (average r² 0.85). At UC Davis the figure is 0.43, which at first read as the haplotype broken apart. A later
        check found the gap is mostly arithmetic. The tag&apos;s allele is rare at UC Davis, about 7 copies in 74 lines, and r² between
        sites of unequal frequency has a ceiling, which averages 0.61 there against 0.91 in Florida. Scored against that ceiling the
        programs sit at 0.94 and 0.79, a gap of 0.14 whose interval (−0.23 to 0.24) includes zero: unresolved by the check&apos;s own
        rule. (The tag stands in for the array marker because the genome panel does not carry the probe.) So neither test settles
        anything. The replication is inconclusive, and whether the array marker tags the haplotype at UC Davis is unknown. What would
        settle it is UC Davis lines genotyped across the haplotype itself, with fruit weight, in numbers near 2,300 for 80% power at
        0.5 g, which no open dataset found here provides. The thread pauses on that open question.
      </p>

      <h2>Limits</h2>
      <p>
        The cultivated panel is one 50K array, with pseudo-diploid calls on an octoploid and no batch records. The wild octoploid panel is
        whole-genome but sampled at about 2% of sites for the structure tests, with calls simplified to diploid; its wild groups hold 23 to 33
        unrelated plants each, too few for within-group tests. The fruit-size locus was found in one program&apos;s lines; its effect has been
        measured only there, its placement rests on 52 lines typed on both platforms, and its wild frequencies say which plants carry the
        allele, not whether it enlarges fruit in them. Its Florida effect is likely inflated by the scan that found it, and how many
        fruit-size loci the lines hold depends on the association model: the source study&apos;s finds 26 where this one finds one.
      </p>
      <p>
        &quot;Pre-registered&quot; here means committed to the project&apos;s own repository before the analysis, not filed with an
        independent registry. Stage 0 was rebuilt twice on the same panel, each time after seeing the previous failure, so its final GO
        is a result on that panel after two revisions, not an independent confirmation. And Amendments B to H were each written after
        reading the result before them: every step was fixed in advance, but the path through them was not.
      </p>

      <h2>What still needs doing</h2>
      <ul>
        <li>
          <strong>A positive control for the nonlinear test.</strong> Simulated panels with known nonlinear structure, run through the
          same gates. Until the pipeline finds structure it should find, its KILL means not detected, not absent.
        </li>
        <li>
          <strong>A fair stability comparison.</strong> Each resampling draw also sets UMAP&apos;s random seed, while PCA is
          deterministic, so UMAP is penalized for seed noise.
        </li>
        <li>
          <strong>A measure of shape, not only of clusters.</strong> Partition agreement cannot see clines or curved structure inside a
          cluster.
        </li>
        <li>
          <strong>A cleaner diversity ranking.</strong> Rerun on sites that map to one homoeolog only, so misplaced wild reads cannot
          inflate novelty.
        </li>
        <li>
          <strong>Threshold sensitivity.</strong> Every cut-off here was chosen once; none has been varied.
        </li>
      </ul>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed (Stage 2x); paused.</strong> Six protocols, seven amendments and three post-hoc checks, code, 56 unit tests, every
        setting&apos;s scores and these figures are committed; each Stage 0 run takes about 21 minutes on a laptop, Stages 1b and 1c about 7,
        each Stage 2x step a minute or two. Each protocol was committed to the project repository before its code, and the code before the result; the repository is
        the only registry.
      </p>
      <p>
        The nonlinear hypothesis is not supported, and stays closed only once the test is shown to detect nonlinear structure where it
        exists. The fruit-size thread pauses until data exist that genotype the 1B haplotype in
        lines outside Florida with fruit weight, or a cross in which the wild haplotype segregates. Every lesson here went upstream into{" "}
        <a href="/projects/topos/">topos</a>, which now enforces them in code.
      </p>

      <h2>References</h2>
      <ol className="references">
        <li>Edger PP, Poorten TJ, VanBuren R, et al. Origin and evolution of the octoploid strawberry genome. <em>Nature Genetics</em> 51, 541–547 (2019). <a href="https://doi.org/10.1038/s41588-019-0356-4">doi:10.1038/s41588-019-0356-4</a>.</li>
        <li>Hardigan MA, Lorant A, Pincot DDA, et al. Unraveling the Complex Hybrid Ancestry and Domestication History of Cultivated Strawberry. <em>Molecular Biology and Evolution</em> 38, 2285–2305 (2021). <a href="https://doi.org/10.1093/molbev/msab024">doi:10.1093/molbev/msab024</a>.</li>
        <li>Fan Z, Whitaker VM. Genomic signatures of strawberry domestication and diversification. <em>The Plant Cell</em> 36, 1622–1636 (2024). <a href="https://doi.org/10.1093/plcell/koad314">doi:10.1093/plcell/koad314</a>. Data: <a href="https://doi.org/10.5281/zenodo.8067127">Zenodo 8067127</a>, CC-BY 4.0. Its per-marker association results are Supplemental Data Sets S4 and S5, whose captions are swapped: the set captioned yield holds fruit size.</li>
        <li>Dempewolf H, Baute G, Anderson J, et al. Past and Future Use of Wild Relatives in Crop Breeding. <em>Crop Science</em> 57, 1070–1082 (2017). <a href="https://doi.org/10.2135/cropsci2016.10.0885">doi:10.2135/cropsci2016.10.0885</a>.</li>
        <li>Jiménez NP, Feldmann MJ, Famula RA, et al. Harnessing underutilized gene bank diversity and genomic prediction of cross usefulness to enhance resistance to Phytophthora cactorum in strawberry. <em>The Plant Genome</em> 16, e20275 (2023). <a href="https://doi.org/10.1002/tpg2.20275">doi:10.1002/tpg2.20275</a>.</li>
        <li>Feldmann MJ, Pincot DDA, Seymour DK, et al. A dominance hypothesis argument for historical genetic gains and the fixation of heterosis in octoploid strawberry. <em>Genetics</em>, iyae159 (2024). <a href="https://doi.org/10.1093/genetics/iyae159">doi:10.1093/genetics/iyae159</a>. Data: <a href="https://doi.org/10.5061/dryad.866t1g20j">Dryad</a>, CC0.</li>
        <li>Bassil NV, Davis TM, Zhang H, et al. Development and preliminary evaluation of a 90 K Axiom® SNP array for the allo-octoploid cultivated strawberry Fragaria × ananassa. <em>BMC Genomics</em> 16, 155 (2015). <a href="https://doi.org/10.1186/s12864-015-1310-1">doi:10.1186/s12864-015-1310-1</a>.</li>
        <li>Hardigan MA, Feldmann MJ, Lorant A, et al. Genome Synteny Has Been Conserved Among the Octoploid Progenitors of Cultivated Strawberry Over Millions of Years of Evolution. <em>Frontiers in Plant Science</em> 10, 1789 (2020). <a href="https://doi.org/10.3389/fpls.2019.01789">doi:10.3389/fpls.2019.01789</a>.</li>
        <li>Gerard D, Ferrão LFV, Garcia AAF, et al. Genotyping Polyploids from Messy Sequencing Data. <em>Genetics</em> 210, 789–807 (2018). <a href="https://doi.org/10.1534/genetics.118.301468">doi:10.1534/genetics.118.301468</a>.</li>
        <li>Lachance J, Tishkoff SA. SNP ascertainment bias in population genetic analyses: Why it is important, and how to correct it. <em>BioEssays</em> 35, 780–786 (2013). <a href="https://doi.org/10.1002/bies.201300014">doi:10.1002/bies.201300014</a>.</li>
        <li>Patterson N, Price AL, Reich D. Population Structure and Eigenanalysis. <em>PLoS Genetics</em> 2, e190 (2006). <a href="https://doi.org/10.1371/journal.pgen.0020190">doi:10.1371/journal.pgen.0020190</a>.</li>
        <li>McInnes L, Healy J, Melville J. UMAP: Uniform Manifold Approximation and Projection for dimension reduction. arXiv 1802.03426 (2018). <a href="https://arxiv.org/abs/1802.03426">arXiv:1802.03426</a>.</li>
        <li>Diaz-Papkovich A, Anderson-Trocmé L, Ben-Eghan C, et al. UMAP reveals cryptic population structure and phenotype heterogeneity in large genomic cohorts. <em>PLOS Genetics</em> 15, e1008432 (2019). <a href="https://doi.org/10.1371/journal.pgen.1008432">doi:10.1371/journal.pgen.1008432</a>.</li>
        <li>Chari T, Pachter L. The specious art of single-cell genomics. <em>PLOS Computational Biology</em> 19, e1011288 (2023). <a href="https://doi.org/10.1371/journal.pcbi.1011288">doi:10.1371/journal.pcbi.1011288</a>.</li>
        <li>Campello RJGB, Moulavi D, Sander J. Density-Based Clustering Based on Hierarchical Density Estimates. <em>Advances in Knowledge Discovery and Data Mining (PAKDD)</em>, LNCS 7819, 160–172 (2013). <a href="https://doi.org/10.1007/978-3-642-37456-2_14">doi:10.1007/978-3-642-37456-2_14</a>.</li>
        <li>Lange T, Roth V, Braun ML, et al. Stability-Based Validation of Clustering Solutions. <em>Neural Computation</em> 16, 1299–1323 (2004). <a href="https://doi.org/10.1162/089976604773717621">doi:10.1162/089976604773717621</a>.</li>
        <li>Hubert L, Arabie P. Comparing partitions. <em>Journal of Classification</em> 2, 193–218 (1985). <a href="https://doi.org/10.1007/BF01908075">doi:10.1007/BF01908075</a>.</li>
        <li>Manichaikul A, Mychaleckyj JC, Rich SS, et al. Robust relationship inference in genome-wide association studies. <em>Bioinformatics</em> 26, 2867–2873 (2010). <a href="https://doi.org/10.1093/bioinformatics/btq559">doi:10.1093/bioinformatics/btq559</a>.</li>
        <li>Nosek BA, Ebersole CR, DeHaven AC, et al. The preregistration revolution. <em>Proceedings of the National Academy of Sciences</em> 115, 2600–2606 (2018). <a href="https://doi.org/10.1073/pnas.1708274114">doi:10.1073/pnas.1708274114</a>.</li>
        <li>Kang HM, Sul JH, Service SK, et al. Variance component model to account for sample structure in genome-wide association studies. <em>Nature Genetics</em> 42, 348–354 (2010). <a href="https://doi.org/10.1038/ng.548">doi:10.1038/ng.548</a>.</li>
        <li>Liu X, Huang M, Fan B, et al. Iterative Usage of Fixed and Random Effect Models for Powerful and Efficient Genome-Wide Association Studies. <em>PLOS Genetics</em> 12, e1005767 (2016). <a href="https://doi.org/10.1371/journal.pgen.1005767">doi:10.1371/journal.pgen.1005767</a>.</li>
        <li>Prohaska A, Rey-Serra P, Petit J, et al. Exploration of a European-centered strawberry diversity panel provides markers and candidate genes for the control of fruit quality traits. <em>Horticulture Research</em>, uhae137 (2024). <a href="https://doi.org/10.1093/hr/uhae137">doi:10.1093/hr/uhae137</a>.</li>
        <li>Göring HHH, Terwilliger JD, Blangero J. Large Upward Bias in Estimation of Locus-Specific Effects from Genomewide Scans. <em>The American Journal of Human Genetics</em> 69, 1357–1369 (2001). <a href="https://doi.org/10.1086/324471">doi:10.1086/324471</a>.</li>
        <li>Xu S. Theoretical Basis of the Beavis Effect. <em>Genetics</em> 165, 2259–2268 (2003). <a href="https://doi.org/10.1093/genetics/165.4.2259">doi:10.1093/genetics/165.4.2259</a>.</li>
        <li>de Roos APW, Hayes BJ, Spelman RJ, et al. Linkage Disequilibrium and Persistence of Phase in Holstein–Friesian, Jersey and Angus Cattle. <em>Genetics</em> 179, 1503–1512 (2008). <a href="https://doi.org/10.1534/genetics.107.084301">doi:10.1534/genetics.107.084301</a>.</li>
        <li>VanRaden PM. Efficient Methods to Compute Genomic Predictions. <em>Journal of Dairy Science</em> 91, 4414–4423 (2008). <a href="https://doi.org/10.3168/jds.2007-0980">doi:10.3168/jds.2007-0980</a>.</li>
        <li>Toivainen T, Salonen JS, Kirshner J, et al. The Late Quaternary climate impact on the genome of the woodland strawberry (Fragaria vesca), a perennial herb. <em>Communications Biology</em> 9, 263 (2026). <a href="https://doi.org/10.1038/s42003-026-09539-5">doi:10.1038/s42003-026-09539-5</a>. Data: <a href="https://doi.org/10.5061/dryad.8cz8w9h43">Dryad</a>, CC0.</li>
        <li>Kalinowski ST. Counting Alleles with Rarefaction: Private Alleles and Hierarchical Sampling Designs. <em>Conservation Genetics</em> 5, 539–543 (2004). <a href="https://doi.org/10.1023/B:COGE.0000041021.91777.1a">doi:10.1023/B:COGE.0000041021.91777.1a</a>.</li>
        <li>Bhatia G, Patterson N, Sankararaman S, et al. Estimating and interpreting F<sub>ST</sub>: the impact of rare variants. <em>Genome Research</em> 23, 1514–1521 (2013). <a href="https://doi.org/10.1101/gr.154831.113">doi:10.1101/gr.154831.113</a>.</li>
        <li>Feldmann MJ, Torgeman S. Genetic architecture of angular leaf spot resistance in cultivated strawberry shaped by epistasis and genotype-by-environment interactions. Data and marker table (2026). <a href="https://doi.org/10.5281/zenodo.17635125">Zenodo 17635125</a>, CC-BY 4.0.</li>
      </ol>
    </>
  );
}
