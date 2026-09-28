import InteractiveFigure from "../InteractiveFigure";
import Ref from "../Ref";

// Linked from the résumé but kept out of search results while the open work below is unfinished.
export const metadata = { title: "fragaria. — shel.", robots: { index: false, follow: true } };

export default function FragariaPage() {
  return (
    <>
      <span className="kicker">Project — fragaria · 2026</span>
      <h1>Stable population structure in strawberry is linear and maps unused wild variation</h1>
      <p className="byline">
        Shel Burkes, PhD<span className="sep">·</span>First protocol 23 February 2026<span className="sep">·</span>Rebuilt and
        scored 25–28 September 2026<span className="sep">·</span>Paused
      </p>

      <div className="abstract">
        <span className="abstract-label">Abstract</span>
        Cultivated strawberry (<em>Fragaria × ananassa</em>) is a young allo-octoploid bred from a narrow founder base, and the
        arrays that genotype it reduce eight chromosome copies to three calls — data in which nonlinear embeddings such as UMAP can
        draw convincing clusters whether or not the structure behind them is real. Whether stable population structure exists in
        strawberry, and whether any of it is nonlinear — missed by principal component analysis (PCA) — had not been tested under
        rules fixed in advance. Here we show, across three panels scored by pre-registered gates — 1,520 cultivated accessions on a
        50K array, 202 wild diploid <em>F. vesca</em> and 102 wild octoploids, the last two whole-genome — that stable,
        confound-checked structure exists in every panel and that a linear method recovers all of it: every qualifying UMAP
        partition reproduced a PCA partition, three of them exactly, and a rerun on the genotypes themselves found nothing more.
        The structure maps what crossing would add. <em>F. chiloensis</em> carries alleles the breeding programs lack at 11.9% of
        sites, against 7.5% and 3.6% for western and eastern <em>F. virginiana</em>. A fruit-size association already reported in
        Florida lines places on subgenome 1B, where wild octoploids carry the allele linked to larger fruit at high frequency; one
        replication elsewhere was inconclusive (−0.18 g per copy, 95% interval −1.00 to +0.64 g, at about 50% power). An invalid
        first analysis, which passed every check with missing calls undecoded, is retained as a finding.
      </div>

      <p>
        Cultivated strawberry arose in eighteenth-century Europe from chance hybrids between two wild octoploids, the Chilean{" "}
        <em>F. chiloensis</em> and the North American <em>F. virginiana</em>; its genome holds four subgenomes of distinct diploid
        ancestry<Ref n={1} />. Resequencing traces a short breeding history with a sharp early fall in effective population size,
        and a later divergence between the University of California and University of Florida programs as each selected for its own
        climate<Ref n={[2, 3]} />. A crop this young, bred from so few founders, leaves much of its wild relatives&apos; variation
        unused. Wild relatives are a recognized reservoir for crop improvement<Ref n={4} />; in strawberry, gene bank accessions
        carry disease resistance the elite pool lacks<Ref n={5} />, and heterosis that has disappeared within an elite population
        persists in wide hybrids<Ref n={6} />. Knowing which wild populations differ, and how, is the first step to using them.
      </p>
      <p>
        The data resist easy answers. Most strawberry genotypes come from Axiom arrays, the IStraw90 and its 50K
        successor<Ref n={[7, 8]} />, which call each marker as one of three classes: the dosage of eight chromosome copies and the
        subgenome a probe hits are both blurred, a general problem for polyploid genotyping<Ref n={9} />. Arrays are also designed
        on a discovery panel, here mostly cultivated germplasm, so they sample divergent material unevenly and fail more calls on
        it<Ref n={10} />. Missing data and ancestry become entangled, and relatives are common in breeding panels. Methods for
        finding structure add hazards of their own. PCA is the standard summary of genetic structure<Ref n={11} />. UMAP
        <Ref n={12} /> has revealed fine-scale structure in large human cohorts that PCA plots obscure<Ref n={13} />, which makes
        it a natural candidate for complex crop panels; but nonlinear embeddings distort distances and can show clean clusters in
        data with no discrete structure<Ref n={14} />, and density clustering such as HDBSCAN<Ref n={15} /> will partition whatever
        embedding it is given. A cluster is credible only if it survives perturbation of the data<Ref n={16} />, measured with a
        chance-corrected agreement index<Ref n={17} />; it must also survive checks against relatedness<Ref n={18} /> and technical
        artifacts, and every choice has to be fixed before the result is seen, because a flexible analysis can find almost
        anything<Ref n={19} />.
      </p>
      <p>
        Linking structure to traits brings a second set of problems. Mixed-model association scans control for relatedness with a
        kinship matrix<Ref n={20} />, and multi-locus methods such as FarmCPU trade some of that conservatism for
        power<Ref n={21} />, so the same data can yield different locus counts under different models. Association scans for fruit
        size and other quality traits have been run in strawberry breeding lines and diversity panels<Ref n={[3, 22]} />. Effects
        estimated in the scan that finds a locus are biased upward<Ref n={[23, 24]} />, and a marker that tags a causal haplotype
        in one population may not in another, because linkage phase does not always persist between
        populations<Ref n={25} />. Both effects predict failed replications, and a failed replication alone cannot say which is at
        work.
      </p>
      <p>
        We asked three questions: whether stable structure exists in strawberry, whether any of it is nonlinear, and which wild
        groups carry variation the breeding programs lack. Answering them took twelve narrower pre-registered questions (Table 1),
        each committed to the project repository before the data that answered it were analysed, under the gates of{" "}
        <a href="/projects/topos/">topos</a>, the structure-certification protocol this project is the first case study of (Box 1,
        Methods). Several answers reversed an earlier one; all are kept.
      </p>

      <aside className="box">
        <span className="box-lead">Box 1 | How to read the verdicts</span>
        <p>
          Each stage fixes, before it runs, the rule that turns its results into one of three verdicts: <strong>GO</strong>, the
          hypothesis passes and the next stage may run; <strong>KILL</strong>, it fails and that line stops; <strong>HOLD</strong>,
          partial support that neither advances nor stops it. Stage 0 audits a panel: is there stable structure, is it a technical
          artifact, and does it agree with labels the genotypes never saw? Stage 1 tests the nonlinear hypothesis itself, and
          Stages 1b and 1c are its runs on two wild panels. Stage 2x is a practical follow-up; its amendments, lettered B to H,
          each fixed one step before that step ran. Two gate statistics recur. <strong>Stability</strong> is the median adjusted
          Rand index between clusterings of resampled draws of the data — agreement corrected for chance, where 1 is identical.{" "}
          <strong>Validity</strong> asks whether a clustering beats its own quality floor: silhouette for k-means and the
          density-based index for HDBSCAN, each above zero. <strong>η²</strong> is the share of variation in a per-sample quantity,
          such as missing calls, explained by cluster membership. Any analysis made after seeing a result is labelled as such
          wherever it appears.
        </p>
      </aside>

      <figure className="article-table">
        <figcaption>
          <span className="fig-lead">Table 1 | Twelve pre-registered questions, their verdicts, and what each changed.</span>{" "}
          Rows 1–5 address whether stable structure exists and whether any of it is nonlinear; rows 6–12 address what crossing
          would add, 7–12 following a single fruit-size locus (Coda). Each rule was fixed before the data that answered it were
          analysed, and each question after the answer before it.
        </figcaption>
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
            <tr><td>6</td><td>Which wild groups carry variation the breeding programs lack? (Stage 2x, part A)</td><td><em>F. chiloensis</em> most (12% of sites), then western, then eastern <em>F. virginiana</em></td><td>A diversity ranking for crossing; stands</td></tr>
            <tr><td>7</td><td>Which loci affect fruit size, and do wild groups carry the good allele? (Stage 2x, amendment B)</td><td>Three fruit-size loci; <em>F. chiloensis</em> looked like a donor. The strongest was already in the source study&apos;s results</td><td>Prompted a check on the three loci</td></tr>
            <tr><td>8</td><td>Are the three loci really one? (amendment C)</td><td>Yes, one signal; the donor reading was withdrawn</td><td>Florida carries the allele at 2–6× UC Davis (15 and 20 unrelated lines)</td></tr>
            <tr><td>9</td><td>Which subgenome holds it? (amendment D)</td><td>1B; its larger-fruit allele is common in the wild</td><td>Donor reading restored, on firmer ground</td></tr>
            <tr><td>10</td><td>Can the region be narrowed, and is 1B right? (amendment E, check F)</td><td>Not narrowed (the array is too sparse); 1B confirmed by an independent marker table</td><td>1B first in 99% of resamples; clears the formal margin in 67%</td></tr>
            <tr><td>11</td><td>Does the effect hold at UC Davis? (amendment G)</td><td>No detectable effect, at about 50% power; the wild test could not run</td><td>Practical readings put on hold</td></tr>
            <tr><td>12</td><td>Why not? (amendment H)</td><td>Unresolved once allele frequency is accounted for (later check)</td><td>The replication is inconclusive; paused</td></tr>
          </tbody>
        </table>
        <p className="footnote">
          Stage and amendment protocols, their commit dates and deviations are recorded in the project repository (Methods,
          Pre-registration statement).
        </p>
      </figure>

      <h2>An invalid first analysis passed every check</h2>
      <p>
        The first Stage 0 returned GO with every criterion passing, three of them at exactly perfect values, and rerunning it from
        a clean kernel reproduced every output. An audit found the run invalid for two reasons. First, three criteria passed by
        construction: stability was measured as agreement across random seeds, but the winning pipeline, PCA followed by HDBSCAN,
        uses no seed, so ten identical runs agreed perfectly — and the best pipeline was chosen by that same agreement, so a
        deterministic one was always going to win. A fifth criterion, external coherence, was defined in code as the confound
        result. Second, the missing calls were never decoded. The genotype file marks a missing call as −1, and the analysis read
        −1 as a genotype value: quality control saw zero missingness, imputation never ran, and about 930,000 missing calls entered
        PCA as a genotype of −1 (Fig. 1). The missingness confound check reported that missingness explained nothing about the
        clusters because, as far as the analysis knew, there was none. The verdict was voided and the protocol rebuilt (Methods);
        the invalid run is reported here because a pipeline that passes every check it defines for itself is exactly the failure
        the rebuilt gates exist to catch.
      </p>

      <InteractiveFigure slug="fragaria"
        n={1}
        spec="/projects/fragaria/interactive/fig1.json"
        src="/projects/fragaria/fig1_decoding.png"
        alt="Two panels. a: bar chart of genotype codes, 0 at 28.5%, 1 at 31.0%, 2 at 39.1%, and -1 (missing) at 1.5%. b: histogram of missing calls per accession after decoding, ranging from 0.2% to 9.1%, with a red line at 0% marking what the first run saw."
        lead="The first analysis never decoded missing calls."
      >
        <b>a</b>, Share of all 64 million calls by code. The file marks missing calls as −1 (1.5%, about 930,000 calls); the first
        analysis treated them as a genotype value. <b>b</b>, Per-accession missingness once −1 is decoded (1,520 accessions). The
        first analysis saw 0% for every accession (red line), so its missingness confound had nothing to test.
      </InteractiveFigure>

      <h2>Cultivated strawberry has stable structure, and it follows germplasm source</h2>
      <p>
        Under the rebuilt protocol — missing calls decoded, stability measured by perturbing the data, every pipeline scored on one
        grid, one full-sib family capped, and coherence judged against labels the genotypes never saw (Methods) — the verdict was
        GO by the pre-registered rule, and no more than that. Exactly two of 189 settings passed every gate, the minimum the rule
        allows, both PCA on 10 components followed by HDBSCAN, with stability 0.82 and 0.84 against a bar of 0.80 (Fig. 2).
        Missingness decided it: 24 settings passed stability and validity, and 22 of them failed the missingness check, with
        cluster membership explaining between 0.23 and 0.61 of per-accession missingness against a limit of 0.20. The written
        expectation had been that missingness would pass; it mostly did not.
      </p>

      <InteractiveFigure slug="fragaria"
        n={2}
        spec="/projects/fragaria/interactive/fig2.json"
        src="/projects/fragaria/fig2_gates.png"
        alt="Two panels. a: strip plot of stability for each of four pipeline families; PCA settings cluster above 0.8, UMAP to HDBSCAN settings mostly between 0.2 and 0.6. b: scatter of missingness effect size against stability; most stable settings sit above the 0.2 missingness bar, and only two settings fall in the passing region."
        lead="Stability and the gates across all 189 settings."
      >
        <b>a</b>, Stability (median adjusted Rand index over 190 pairs of resampled draws) for each setting, by pipeline family.
        Dashed line, the pre-registered bar of 0.80. <b>b</b>, Missingness effect size (η² of per-accession missingness across
        clusters) against stability. Shaded, the region that passes both. Grey, fails stability or validity; blue, stable and
        valid but fails another gate; red, passes every gate. Only two settings, both PCA on 10 components followed by HDBSCAN,
        reach the shaded region.
      </InteractiveFigure>

      <p>
        The structure that passed follows germplasm source (Fig. 3a, b). The largest cluster, 567 samples, was 96%
        breeding-program lines and ran along one arm of the first principal component; two small clusters (51 and 25) were mostly
        USDA accessions and named cultivars. About a third of samples were left as noise, including most USDA accessions (138 of
        190), so the diverse material was the part this pipeline resolved least. In both passing settings, replicates of the same
        plant landed together. Missingness follows source too (Fig. 3c): USDA accessions failed 2.8% of calls on average and
        breeding-program lines 1.0%, the signature of array ascertainment — an array designed on one set of germplasm fails more
        calls on material that diverges from it<Ref n={10} />. The missingness check, meant to catch a technical artifact, was
        therefore partly penalizing structure for being real. That reading came after the result and did not change the verdict,
        but it set what the next protocol had to fix. No UMAP setting passed: UMAP pipelines were less stable under resampling,
        and the few that were stable and valid failed missingness.
      </p>

      <InteractiveFigure slug="fragaria"
        n={3}
        spec="/projects/fragaria/interactive/fig3.json"
        src="/projects/fragaria/fig3_structure.png"
        alt="Three panels. a: first two principal components of 932 samples colored by germplasm source, with breeding-program lines along the right arm and USDA accessions at the left. b: the same projection colored by HDBSCAN clusters, with a large cluster on the program arm, a small USDA cluster, and grey noise. c: missing calls per accession by source, with means of 1.0% for the program, 1.6% for named cultivars and 2.8% for USDA accessions."
        lead="The structure that passes, and why missingness tracks it."
      >
        <b>a</b>, First two principal components of the thinned panel (925 individuals, 932 samples including replicates), by
        germplasm source; shape repeats color. <b>b</b>, The same projection colored by the clusters of the passing setting (PCA
        on 10 components, HDBSCAN with minimum cluster size 25 and minimum samples 10). Grey, noise. <b>c</b>, Missing calls per
        accession by source; bars mark means. Panel c is an analysis made after the result, not part of the pre-registered
        protocol.
      </InteractiveFigure>

      <h2>Without a relatedness control, the clusters are families</h2>
      <p>
        On the full panel, the same PCA settings produced clusters that were 72–100% a single full-sib family, and one 187-member
        family pulled a principal component of its own (Fig. 4). With families capped at three members, no cluster was more than
        18% one family. The cap itself proved insufficient — 22 accessions from eight related half-sib families still clustered
        together — which motivated the kinship-based control of the third protocol.
      </p>

      <InteractiveFigure slug="fragaria"
        n={4}
        spec="/projects/fragaria/interactive/fig4.json"
        src="/projects/fragaria/fig4_pedigree.png"
        alt="Two panels. a: first two principal components of all 1,520 accessions, with one 187-member full-sib family forming a tight isolated group. b: for 18 distinct PCA settings, the largest share of any cluster drawn from one family, between 1% and 18% after thinning and 72% to 100% on the full panel."
        lead="Without the family cap, clusters are families."
      >
        <b>a</b>, First two principal components of the full panel (1,520 accessions) before thinning; red, the 187 members of one
        full-sib family. <b>b</b>, For each distinct PCA setting (18; three duplicate HDBSCAN settings removed), the largest share
        of any cluster drawn from a single full-sib family, after thinning to three per family (blue) and on the full panel (red).
      </InteractiveFigure>

      <h2>With relatives removed the structure holds, and UMAP adds nothing</h2>
      <p>
        The third protocol removed relatives by measured kinship rather than pedigree, pruning until no two accessions were
        second-degree relatives or closer (234 remain), tested missingness within each germplasm source so the gate no longer
        penalized clusters for following source, and deduplicated the grid (Methods). The verdict was GO, in the primary run and
        in both sensitivity runs — one with a looser kinship cut (480 accessions) and one restricted to markers that genotype
        cleanly in every source. Removing relatives stabilized the UMAP→HDBSCAN pipelines, whose median stability rose from 0.35
        to 0.76 (Fig. 5a), and 29 of their settings passed every gate. That is not support for the nonlinear hypothesis. The
        pre-registered non-redundancy check, comparing the best linear and nonlinear partitions, gave an agreement of 0.68, which
        reads as partial disagreement — but the check scored HDBSCAN&apos;s noise as a cluster of its own, so it could not tell a
        different partition from a difference in which samples are left unassigned, a design flaw in the check. On the 157 samples
        both pipelines assign to a cluster, the partitions are identical (Fig. 5b; an analysis made after the result): both find
        the same two groups, breeding-program lines against USDA accessions and named cultivars, and UMAP assigns 79 of the 80
        samples PCA→HDBSCAN leaves as noise, 75 of them to the diverse group. Stage 1c&apos;s rule compares only samples both
        pipelines assign.
      </p>

      <InteractiveFigure slug="fragaria"
        n={5}
        spec="/projects/fragaria/interactive/fig5.json"
        src="/projects/fragaria/fig5_v3.png"
        alt="Two panels. a: stability by pipeline family in the second and third runs; UMAP to HDBSCAN rises from a median of 0.35 to 0.76, other families change little. b: the first two principal components of 237 samples, with a program cluster on the right and a diverse cluster on the left; hollow markers show 79 samples PCA left as noise that UMAP assigned."
        lead="What removing relatives changed, and what it did not."
      >
        <b>a</b>, Stability (median adjusted Rand index over resampled draws) for every setting in the second run (grey circles,
        panel with relatives) and the third (blue squares, 234 unrelated accessions); black bars mark medians; dashed line, the
        0.80 bar. <b>b</b>, The passing PCA→HDBSCAN and UMAP→HDBSCAN partitions on the first two principal components, for 237
        samples (the 234 accessions and 3 technical replicates). Filled markers, samples both pipelines cluster, where the
        partitions are identical; hollow markers, samples PCA→HDBSCAN leaves as noise and UMAP assigns. Panel b is an analysis
        made after the result.
      </InteractiveFigure>

      <h2>Wild woodland strawberry has geographic structure, and it is linear</h2>
      <p>
        Cultivated strawberry&apos;s structure is explained by breeding, so the sharper test of the nonlinear hypothesis is a
        population breeding never shaped. Stage 1b took a public whole-genome panel of 202 wild woodland strawberries
        (<em>F. vesca</em>, diploid, sampled across Europe<Ref n={27} />) and ran the Stage 0 checks and the Stage 1 test on it,
        with the protocol committed before the data were downloaded and one amendment, made after inspecting the file and before
        any embedding, recording what it did not anticipate: the genotypes are imputed, so no missingness confound can be tested,
        and sites are labelled only by country (Methods). Kinship pruning kept 176 unrelated plants. Stage 0&apos;s checks passed
        on an east–west split — Finland, Lithuania and Russia, with 5 Norwegian plants and 1 Romanian, against the rest — as the
        source study&apos;s own analysis predicts<Ref n={27} />. The Stage 1 rule then returned GO, against a written expectation
        of HOLD or KILL: three nonlinear settings on the whole panel, and four inside the western group, found stable clusters
        their matched linear settings did not.
      </p>
      <InteractiveFigure slug="fragaria"
        n={6}
        spec="/projects/fragaria/interactive/fig6.json"
        src="/projects/fragaria/fig6_stage1b.png"
        alt="Two panels of country-by-cluster count grids, countries ordered from Portugal to Russia. a: whole panel; UMAP with HDBSCAN finds three clusters, south and central Europe, the North Atlantic (Norway 44, Iceland 13, UK 7), and the east (Finland 22, Lithuania 7, Russia 7, Norway 5); PCA with k-means at k 3 finds almost the same three. b: western group; UMAP with k-means at k 3 separates Iberia (Spain 16), central and southern Europe, and the North Atlantic; PCA with k-means at k 5 recovers Iberia and central-southern Europe and splits the North Atlantic into Iceland and two Norwegian groups."
        lead="The qualifying nonlinear partitions, beside a linear one that passes the same gates."
      >
        Accessions per country (rows) and cluster (columns). <b>a</b>, Whole panel: a qualifying UMAP→HDBSCAN partition and
        PCA→k-means at k 3 find the same three groups; the eastern cluster is identical. <b>b</b>, Western group: the qualifying
        UMAP partition (all four qualifying settings give this one) and PCA→k-means at k 5, which splits the North Atlantic
        further. Both panels are an analysis made after the result.
      </InteractiveFigure>
      <p>
        The GO does not mean what it says. The rule compared each nonlinear setting only with the linear setting sharing its
        clusterer; on this panel, density clustering on PCA coordinates fails outright, so any working nonlinear setting beat it.
        But k-means on the same PCA coordinates passes every gate and recovers the same clusters (Fig. 6a), and in the western
        group it finds more (Fig. 6b). Wild woodland strawberry has stable, geographic structure beyond the east–west split — in
        Iberia, the North Atlantic and central-southern Europe — and it is linear. The pre-registered outcome stands as recorded;
        the reading is that it does not support the hypothesis, and the rule needed a stricter linear comparison before any next
        stage.
      </p>

      <h2>On wild octoploids, UMAP reproduces PCA&apos;s partitions exactly</h2>
      <p>
        A stricter rule re-scored on the woodland strawberry would not have been a test, since the check above already showed the
        answer; so the rule was fixed first and applied to a panel it had not seen. Stage 1c genotyped structure in 102 wild
        octoploids, <em>F. chiloensis</em> and <em>F. virginiana</em>, from a public whole-genome set<Ref n={3} /> called against
        the FaRR1 (&apos;Royal Royce&apos;) reference<Ref n={2} />, whose subgenome names, 1A to 7D, are used throughout
        (Methods). Under the new rule a nonlinear partition counts only if no linear setting that passes the same gates recovers
        it — under any clusterer, and k-means at every k from 2 to 10 — either by agreeing with it or by splitting it more finely.
      </p>
      <InteractiveFigure slug="fragaria"
        n={7}
        spec="/projects/fragaria/interactive/fig7.json"
        src="/projects/fragaria/fig7_stage1c.png"
        alt="Two panels. a: 87 unrelated wild octoploids on the first two principal components; F. chiloensis forms one cluster on the right, eastern F. virginiana (mostly subspecies virginiana) a tight cluster at lower left, and western F. virginiana (subspecies platypetala and glauca) spreads upward on the left. b: for the four UMAP settings that pass the gates, agreement with the matched PCA partition: three at exactly 1.0, one at 0.63, all above the 0.5 needed to count as different."
        lead="On wild octoploids, UMAP reproduces PCA's partitions accession for accession."
      >
        <b>a</b>, The 87 unrelated wild accessions on the first two principal components, by taxon. <b>b</b>, Agreement between
        each UMAP setting that passes the gates and its matched PCA setting, on accessions both cluster. Structure counts as new
        only at 0.5 or below.
      </InteractiveFigure>
      <p>
        The panel has stable, confound-checked structure that follows taxonomy: <em>F. chiloensis</em>, eastern{" "}
        <em>F. virginiana</em>, and the western subspecies (Fig. 7a). Every UMAP setting that finds it reproduces the matched PCA
        partition, three of them exactly (Fig. 7b), so none even reached the stricter comparison. The verdict is KILL. A rerun
        made after the result, with UMAP on the standardized genotypes rather than on principal components, returned KILL again:
        no UMAP setting passed every gate — the stable, valid ones split the panel by taxonomy, as PCA does, and failed the
        missingness gate narrowly (within-source η² 0.21 against 0.20) — and even with that gate set aside they either matched
        PCA&apos;s partition (agreement 0.81–0.84) or merged its two <em>F. virginiana</em> groups, which PCA&apos;s partition
        splits further. Across a cultivated array panel, a wild diploid panel and a wild octoploid panel, the answer is the same:
        stable structure is real, it is geographic or taxonomic, and a linear embedding finds it. KILL means not detected, not
        absent; the test&apos;s limits are taken up in the Discussion.
      </p>

      <h2><em>F. chiloensis</em> carries the most variation the breeding programs lack</h2>
      <p>
        The structure just mapped has a practical use: which populations carry variation that cultivated strawberry lacks. A
        second protocol, written before Stage 1c finished, fixed the measures in advance — differentiation, private alleles, and
        the headline measure, the share of sites where a wild group carries an allele at 20% or more that the UC Davis and Florida
        breeding programs hold at under 5% (Methods). The wild groups are Stage 1c&apos;s three clusters, named by their majority
        taxon. Every ranking is distinct (Fig. 8). <em>F. chiloensis</em> supplies the most variation the programs lack, 11.9% of
        sites, then western <em>F. virginiana</em> at 7.5%, then eastern <em>F. virginiana</em> at 3.6%, which sits closest to the
        historic cultivars. Between wild groups the two measures disagree, which is the useful part: crossing eastern{" "}
        <em>virginiana</em> with <em>chiloensis</em> adds the most heterozygosity, while western <em>virginiana</em> and{" "}
        <em>chiloensis</em> together carry the most of what the programs lack. The programs themselves hold almost no private
        alleles. A rerun made after the result, with each group limited to its own species (29, 23 and 32 plants), left every
        ranking in place — <em>F. chiloensis</em> 12.0%, western and eastern <em>F. virginiana</em> 7.5% and 3.9%, each still
        distinct from the next — and removing the natural hybrids raised <em>F. chiloensis</em>&apos;s private alleles slightly
        (11.4 to 11.6 per 100 sites), so they had diluted the count rather than inflated it.
      </p>
      <InteractiveFigure slug="fragaria"
        n={8}
        spec="/projects/fragaria/interactive/fig8.json"
        src="/projects/fragaria/fig8_stage2x.png"
        alt="Three panels. a: share of sites where the wild group carries an allele at 20% or more that the breeding programs hold at under 5%: F. chiloensis 11.9%, western F. virginiana 7.5%, eastern F. virginiana 3.6%. b: private alleles per 100 sites, rarefied: F. chiloensis 11.4, western virginiana 7.3, eastern 6.7, named cultivars 2.8, Florida program 1.4, UC Davis program 0.7. c: pairwise F_ST, from 0.07 between Florida and named cultivars to 0.40 between F. chiloensis and UC Davis."
        lead="F. chiloensis holds the most variation the breeding programs lack."
      >
        <b>a</b>, Novel-allele supply for each wild group, with 95% intervals from resampling 1 Mb blocks. <b>b</b>, Alleles found
        in one group only, rarefied to equal sample size<Ref n={28} />. <b>c</b>, Hudson&apos;s F_ST between
        groups<Ref n={29} />. Unrelated plants per group: <em>F. chiloensis</em> 31, western <em>F. virginiana</em> 23, eastern
        33, UC Davis 20, Florida 15, named cultivars 24.
      </InteractiveFigure>
      <p>
        These are diversity measures: they count favorable, neutral and harmful alleles alike. Two caveats weigh on them. The
        programs contribute 15 and 20 unrelated lines, so &quot;held at under 5%&quot; means at most one or two copies. And reads
        from divergent wild plants that map to the wrong homoeolog would inflate apparent novelty most in the most divergent
        group; the ranking has not been checked against that.
      </p>

      <h2>Coda: one fruit-size locus</h2>
      <p>
        The source study<Ref n={3} /> released fruit-size and yield records for 1,787 Florida breeding lines typed on a 50K
        array. A mixed-model association scan<Ref n={20} /> found three fruit-size signals, all on homoeologous group 1, and no
        yield locus (Fig. 9a); the strongest was already among the source study&apos;s 26 fruit-size signals<Ref n={3} />, so this
        thread confirms and places a published association. Beyond that locus the two scans disagree: only 2 of the study&apos;s
        26 fruit-size signals and none of its 11 yield signals pass the Bonferroni threshold used here, and its strongest, on 6D,
        is not among them. The study&apos;s method<Ref n={21} /> fits its strongest markers as covariates and controls the false
        discovery rate instead, which finds more.
      </p>
      <InteractiveFigure slug="fragaria"
        n={9}
        spec="/projects/fragaria/interactive/fig9.json"
        src="/projects/fragaria/fig9_stage2x_b.png"
        alt="Two panels. a: association scans across the genome for fruit size, with three markers above the significance line, all on homoeologous group 1, and for yield, with none. b: for each fruit-size locus, the frequency of the size-increasing allele by group. At 1B, 4.1 Mb: F. chiloensis 0.43, eastern virginiana 0.23, western 0.09, Florida program 0.40, UC Davis 0.07, programs pooled 0.21. At 1A, 4.8 Mb: all wild groups 0.03 or less, programs pooled 0.10. At 1C, 1.2 Mb: eastern virginiana 0.27, chiloensis and western virginiana near 0, programs pooled 0.16."
        lead="Three fruit-size signals on group 1, which a follow-up test showed to be one locus."
      >
        <b>a</b>, Mixed-model association scans; dashed line, the Bonferroni threshold. <b>b</b>, Frequency of the allele that
        increases fruit size, by group, at each locus; vertical bar, the two programs pooled. Positions are each marker&apos;s
        best genome tag at this sparse first pass; the dense pass (Fig. 10) placed the signal.
      </InteractiveFigure>
      <p>
        The three signals are one. They sit on three subgenomes, which segregate independently, yet their markers are strongly
        associated (r² 0.40–0.68, against a background of 0.05), and conditioning on the strongest removes the other two. Read
        naively, Fig. 9b made <em>F. chiloensis</em> a donor of the size-increasing allele; its three genome tags disagreed about
        the wild groups, so that reading was withdrawn until the locus was placed. Inside the breeding programs, where the tags
        are read in the population they came from, Florida carries the allele at two to six times UC Davis&apos;s frequency, with
        intervals that exclude a ratio of 1.
      </p>
      <p>
        A targeted dense pass read every variant in the first 6 Mb of all four group-1 subgenomes, 585,789 sites (Methods). In
        the 52 lines typed on both platforms, the signal sits on 1B (Fig. 10a): sites that correlate 0.9 or more with the lead
        array marker cluster at 2.2 to 2.8 Mb, inside a longer haplotype that runs to 5.3 Mb. Resampling the 52 lines puts 1B
        first 99.4% of the time, though its margin over 1C clears the pre-registered bar in only two thirds of resamples. A
        public UC Davis marker table<Ref n={30} />, independent of everything above and on the same FaRR1 reference, puts the
        lead probe on 1B at 1.7 Mb and flags the 1C probe as unable to tell homoeologs apart — which explains why one locus
        looked like three. With the probe at 1.7 Mb and the dense cluster ending at 2.8 Mb, the core region is 1.7 to 2.8 Mb.
        Fine-mapping in all 1,787 lines could not narrow it: the array is too sparse.
      </p>
      <InteractiveFigure slug="fragaria"
        n={10}
        spec="/projects/fragaria/interactive/fig10.json"
        src="/projects/fragaria/fig10_stage2x_d.png"
        alt="Two panels. a: correlation with the lead array marker along the first 6 Mb of subgenomes 1A to 1D; only 1B has many sites above 0.9, clustered at 2.2 to 2.8 Mb with a few near 4 and 5 Mb; 1C has one; 1A and 1D none. b: frequency of the allele that goes with larger fruit, median over 38 sites with range: F. chiloensis 0.86, western F. virginiana 0.60, eastern F. virginiana 0.47, named cultivars 0.21, Florida program 0.33, UC Davis 0.08; black ticks mark the wild frequency of program-frequency-matched background alleles, near 0.05."
        lead="The fruit-size signal sits on subgenome 1B, and alleles linked to it in Florida lines are common in the wild."
      >
        <b>a</b>, Correlation of every dense site with the lead array marker, by subgenome; orange, sites at 0.9 or above.{" "}
        <b>b</b>, The larger-fruit allele&apos;s frequency by group: point, median over the 38 sites on 1B; line, range across
        those sites; black tick, background alleles matched on program frequency (an analysis made after the result).
      </InteractiveFigure>
      <p>
        The allele that goes with larger fruit in Florida lines is common in wild octoploids (Fig. 10b): a median over the 38
        sites of 0.86 in <em>F. chiloensis</em> (bootstrap interval 0.79–0.93), and 0.60 and 0.47 in western and eastern{" "}
        <em>F. virginiana</em>, against 0.08 at UC Davis; single sites vary far more, from about 0.2 to nearly 1.0. Background
        alleles matched on program frequency sit near 0.05 in the wild, both genome-wide and in the same stretch of 1B. Which
        allele counts as larger-fruit comes from linkage in Florida lines: whether the wild alleles sit on the Florida haplotype,
        and whether they enlarge fruit, is untested.
      </p>
      <p>
        A replication was then attempted in a public UC Davis set<Ref n={6} /> of 529 genotyped individuals with fruit weight,
        including hybrids with the wild <em>F. chiloensis</em> &apos;Del Norte&apos;, with the test fixed before the files were
        opened. The larger-fruit allele is at 0.24 across the 529, well above the 0.08 in unrelated UC Davis lines: 0.17 to 0.20
        among elite parents and crosses, and higher in hybrids with wild parents, where 44 of the 45 &apos;Del Norte&apos;
        hybrids carry one copy. Its effect is −0.18 g per copy (95% interval −1.00 to +0.64 g), against +1.2 g in Florida under
        the model used here and +0.7 g under the source study&apos;s, on the same trait scale. The test was weak: one-sided power
        was 52% at 0.7 g and 33% at 0.5 g, and both Florida estimates come from the scan that found the locus, which tends to
        inflate them<Ref n={24} />. Because the &apos;Del Norte&apos; hybrids almost all carry exactly one copy, the wild test
        could not run. Whether the array marker still tags the haplotype at UC Davis is also unresolved: across all 74 UC Davis
        lines in the genome panel the marker&apos;s best genome tag correlates with the haplotype&apos;s sites at an average r²
        of 0.43, against 0.85 in Florida, but the tag&apos;s allele is rare there and r² between sites of unequal frequency has a
        ceiling; dividing each site&apos;s r² by its own ceiling puts the programs at 0.94 and 0.79, a gap whose 95% interval
        (−0.23 to 0.24) includes zero. The replication is inconclusive.
      </p>

      <h2>Discussion</h2>
      <p>
        Across a cultivated array panel, a wild diploid panel and a wild octoploid panel, stable, confound-checked population
        structure exists, and a linear method recovers all of it. The structure follows breeding program in cultivated material,
        geography in wild woodland strawberry, and taxonomy in wild octoploids; every qualifying nonlinear partition reproduced a
        linear one, and a rerun of UMAP on the genotypes themselves found nothing more. The nonlinear hypothesis that motivated
        the project found no support. The map has a practical reading: <em>F. chiloensis</em> first, then western{" "}
        <em>F. virginiana</em>, as sources of variation the breeding programs lack. And a fruit-size association already reported
        in Florida lines<Ref n={3} /> now has a subgenome address, 1B at 1.7–2.8 Mb, with the allele linked to larger fruit
        common in the wild groups that the diversity ranking already favoured.
      </p>
      <p>
        The negative result is bounded by its test. The comparison is between partitions, so it cannot see clines or curved
        structure inside a cluster; UMAP took principal components as input in every stage except the Stage 1c rerun, building
        some agreement in; the stability score counts HDBSCAN&apos;s noise as a label, so a stably unassigned set raises it, and
        each resampling draw also resets UMAP&apos;s seed while PCA is deterministic, penalizing UMAP for seed noise. Above all,
        the pipeline has not yet been shown to return GO on data with known nonlinear structure. Until that positive control
        runs, KILL means only that nonlinear structure was not detected. The panels carry their own limits: pseudo-diploid calls
        on an octoploid with no batch records in the cultivated panel; about 2% of sites, simplified to diploid calls, in the
        wild octoploid panel, whose groups hold 23 to 33 unrelated plants each.
      </p>
      <p>
        The diversity ranking and the locus carry separate cautions. Reads from divergent wild plants can map to the wrong
        homoeolog, which would inflate apparent novelty in the ranking and bites hardest at the 1B locus, the region where one
        signal already looked like three; the 0.86 <em>F. chiloensis</em> frequency is the number most exposed to it, and the
        matched background alleles do not rule out a locus-specific artifact. The locus was found in one program&apos;s lines,
        its effect measured only there and likely inflated by the scan that found it<Ref n={[23, 24]} />; its placement rests on
        52 lines typed on both platforms; and its wild frequencies say which plants carry the allele, not whether it enlarges
        fruit in them. The pattern fits an ancestral haplotype that breeding mostly lost and Florida partly kept, but that
        history is inferred from frequencies. The replication compared programs that differ in growing environment and in trait
        definition (marketable against all fruit), and how many fruit-size loci the Florida lines hold depends on the
        association model: the source study&apos;s finds 26<Ref n={3} /> where this one finds one.
      </p>
      <p>
        Three tests would move the work forward. A positive control — simulated panels with known nonlinear structure run through
        the same gates — would let a KILL mean absent rather than missed, and a fair comparison would fix UMAP&apos;s seed across
        draws and add a measure of shape that partition agreement cannot see. A diversity ranking rerun on sites that map to one
        homoeolog only would check the novelty estimates against mismapping. And the fruit-size thread needs data that do not yet
        exist openly: lines outside Florida genotyped across the 1B haplotype itself with fruit weight, in numbers near 2,300 for
        80% power at 0.5 g, or a cross in which the wild haplotype segregates. Until then the thread pauses. Every lesson here
        went upstream into <a href="/projects/topos/">topos</a>, which now enforces them in code.
      </p>

      <h2>Methods</h2>
      <div className="endmatter">
        <p>
          <strong>Data sources.</strong> Cultivated panel: 1,520 accessions on the 50K Axiom array, with fruit-size and yield
          records for 1,787 Florida breeding lines and whole-genome calls for wild and cultivated accessions, from Fan and
          Whitaker<Ref n={3} /> (Zenodo, CC-BY 4.0), called against the FaRR1 &apos;Royal Royce&apos; reference<Ref n={2} />.
          Wild diploid panel: 202 <em>F. vesca</em> sampled across Europe<Ref n={27} /> (Dryad, CC0). Replication set: 529 UC
          Davis individuals with fruit weight<Ref n={6} /> (Dryad, CC0). Marker placements: the UC Davis 50K marker
          table<Ref n={30} /> (Zenodo, CC-BY 4.0). All computation ran on one laptop; nothing was re-called from sequencing
          reads. The 33.6 GB wild-octoploid variant file was streamed over parallel HTTP range requests and never stored; a hash
          of each site&apos;s position kept about 2%, 475,741 SNPs, and the dense group-1 pass fetched only the byte ranges of
          its 585,789 sites.
        </p>
        <p>
          <strong>Genotype decoding and quality control.</strong> Missing calls (−1 in the source file) were decoded before
          anything else, then markers were filtered for call rate, minor-allele frequency and placement: 41,691 of 42,081 pass,
          and pruning linked markers within each chromosome leaves 5,408 for structure. Whole-genome panels were filtered for
          depth and mapping quality, with calls simplified to diploid.
        </p>
        <p>
          <strong>Structure scoring and gates.</strong> The grid holds 189 settings: PCA or UMAP embeddings (UMAP on the top 10,
          30 or 50 principal components), k-means or HDBSCAN clustering, across their parameters. Stability is the median
          adjusted Rand index<Ref n={17} /> over all 190 pairs of 20 draws, each keeping 80% of accessions and 80% of markers and
          refitting everything, scored on the accessions draws share; HDBSCAN&apos;s noise points count as one more cluster
          label. A GO requires two settings from the same pipeline family to pass every gate: stability at least 0.80, validity
          (silhouette or the density-based index above zero), a missingness gate (η² of per-accession missingness across clusters
          at most 0.20; from the third protocol, tested within each germplasm source), and coherence with labels the genotypes
          never saw — germplasm source and technical replicates, which must land in the same cluster. Stage 1&apos;s
          non-redundancy rule, as tightened for Stage 1c: a nonlinear partition counts only if no linear setting that passes the
          same gates recovers it, under any clusterer and k-means at every k from 2 to 10, by agreeing with it (adjusted Rand
          above 0.5 on samples both assign) or by splitting it more finely.
        </p>
        <p>
          <strong>Relatedness control.</strong> The second protocol capped each full-sib family at three members (925 of 1,520
          kept). The third pruned by measured kinship until no two accessions were second-degree relatives or closer, leaving
          234; KING-robust kinship<Ref n={18} /> was chosen over the standard genomic relationship matrix<Ref n={26} /> because
          the latter treats the breeding program&apos;s allele frequencies as the norm, making diverse accessions look related
          for sharing alleles rare in the program (pruning with it would have kept 5 of 190 USDA accessions). Sensitivity runs
          used a looser kinship cut (480 accessions) and markers that genotype cleanly in every source. In the wild panels,
          kinship pruning kept 176 of 202 <em>F. vesca</em> and 87 of 102 wild octoploids.
        </p>
        <p>
          <strong>Diversity measures.</strong> Wild groups are Stage 1c&apos;s three clusters, named by majority taxon. Novel
          allele supply is the share of sites where a wild group carries an allele at frequency 0.20 or more that both breeding
          programs hold under 0.05, with 95% intervals from resampling 1 Mb blocks; private alleles are rarefied to equal sample
          size<Ref n={28} />; differentiation is Hudson&apos;s F<sub>ST</sub> as a ratio of averages<Ref n={29} />.
        </p>
        <p>
          <strong>Association scan and locus placement.</strong> The scan fit a mixed model with a genomic kinship
          matrix<Ref n={20} /> to fruit-size and yield BLUEs for 1,787 Florida lines, at a Bonferroni threshold. Array markers
          were tied to genome coordinates through the 52 lines typed on both platforms; the three group-1 signals were tested for
          identity by their inter-marker r² against the genome-wide background and by conditional analysis. Subgenome placement
          used the dense group-1 pass in those 52 lines, resampled to give the share of draws placing 1B first, and was checked
          against the independent marker table<Ref n={30} />. The replication fit the same model to fruit weight in the 529 UC
          Davis individuals, with cross types inferred from opposite homozygotes before testing; power was computed one-sided at
          the two Florida effect estimates.
        </p>
        <p>
          <strong>TE landscape.</strong> Described in Extended Data. Octoploid repeat annotation from one phase of the Florida
          selection FL16.33-8 (RepeatMasker, via GDR)<Ref n={31} />; <em>F. vesca</em> v4 EDTA annotation from the TIP
          preprint&apos;s repository<Ref n={34} />; gene models for FaRR1, the Florida phase and <em>F. vesca</em> v4.0.a2 from
          GDR. Where repeat hits overlap, each base takes the class of the higher-scoring hit. Subgenome letters follow Hardigan
          et al.<Ref n={2} />, mapped from the assembly&apos;s Camarosa scaffold names through the marker table<Ref n={30} />,
          which agrees chromosome for chromosome. Every source was streamed and reduced in memory; only small tables were
          written.
        </p>
        <p>
          <strong>Protocol.</strong> Six protocols and the Stage 2x amendments B to H were each committed to the project
          repository before their code, and the code before the result, with a written guess at each result; the repository is
          the only registry. Verdict rules, gates and grids were fixed in the protocol documents; deviations and analyses made
          after results are labelled in the stage documents and here. The first Stage 0&apos;s audit, and the rebuild it forced,
          are described in the Results; 56 unit tests cover the pipeline. Each Stage 0 run takes about 21 minutes on a laptop,
          Stages 1b and 1c about 7, each Stage 2x step a minute or two.
        </p>
      </div>

      <h2>Extended Data — the transposable-element landscape</h2>
      <p>
        The scored results above rest on markers; the figures below describe the repeat landscape those markers sample. None of
        this is a pre-registered test. It repeats a descriptive analysis first made for tomato, as far as strawberry data allow:
        no openly downloadable per-base TE annotation exists for FaRR1, so the octoploid numbers come from one phase of the
        Florida selection FL16.33-8<Ref n={31} /> and the diploid ones from the EDTA annotation of <em>F. vesca</em>{" "}
        v4<Ref n={34} /> (Methods).
      </p>
      <p>
        The octoploid is 39.5% repeats, but most of that is unclassified: only 13.5% of the genome carries a TE class.{" "}
        <em>F. vesca</em> v4 is 33.2% TE. The same annotation is reported at about 37% and about 30% in two versions of its
        preprint<Ref n={34} />, and published totals for these genomes run from about 30% to 53% depending on the
        pipeline<Ref n={[1, 31, 32]} />, so totals compare only loosely. The clearer result is between subgenomes. Subgenome A,
        the <em>F. vesca</em>-derived dominant one<Ref n={2} />, carries 32% repeats against 41–42% for B, C and D, and half
        their Gypsy, in all seven homoeologous groups (Extended Data Fig. 1b). Two annotations of Camarosa report the same
        pattern, 19.5% fewer TEs on the dominant subgenome<Ref n={1} /> and 50% against 57–58%<Ref n={32} />; here it holds on a
        different cultivar and a different annotation.
      </p>
      <InteractiveFigure slug="fragaria-ed"
        n={1}
        label="Extended Data Fig."
        spec="/projects/fragaria/interactive/fig11.json"
        src="/projects/fragaria/fig11_te_composition.png"
        alt="Two panels. a: share of the genome by TE class for the octoploid and for F. vesca v4; Gypsy 6.8% and 10.6%, Copia 3.3% and 3.9%, DNA/TIR 2.2% and 16.1%, and 24.6% unclassified in the octoploid. b: stacked shares by octoploid subgenome; totals A 32.1%, B 41.9%, C 41.4%, D 42.3%, with Gypsy about half as high in A."
        lead="Subgenome A, derived from F. vesca, carries the fewest repeats."
      >
        <b>a</b>, Share of the genome by TE class, one class per base: an octoploid FL16.33-8 phase (RepeatMasker) and{" "}
        <em>F. vesca</em> v4 (EDTA). The pipelines differ; &quot;Unknown&quot; is repeat sequence without a class. <b>b</b>, The
        same by octoploid subgenome, under FaRR1&apos;s names A to D, mapped from the assembly&apos;s Camarosa names through the
        UC Davis marker table<Ref n={30} />.
      </InteractiveFigure>
      <p>
        Along chromosomes, TE density rises where genes thin (Extended Data Fig. 2a). The gene-density rule that marks
        pericentromeres in tomato does not transfer: on 23 of 28 chromosomes its gene-poor block runs to a chromosome end, so it
        finds the gene-poor end of a gradient, and it is called a gene-poor region here. Gypsy is only modestly enriched there,
        1.0 to 3.3 times its density in the rest of the chromosome. Strawberry centromeres have been placed by satellite repeats
        instead<Ref n={[33, 35]} />.
      </p>
      <p>
        The finding with most bearing on the results above is where the 50K array sits (Extended Data Fig. 2b). Placed on FaRR1,
        45.5% of its probes fall in genes and 73.8% within 1 kb of one, against 36% and 55% of the genome&apos;s bases; its
        designers report 53% and 79% on Camarosa<Ref n={8} />. The cultivated structure above was measured on markers next to
        genes, and TE-rich sequence, where much structural variation lies, is thinly sampled. The structural-variant side of the
        tomato analysis could not follow: no strawberry population call set of structural variants or TE insertions, with
        genotypes for each accession, is openly downloadable, and calling one from reads is outside this project&apos;s scope.
      </p>
      <InteractiveFigure slug="fragaria-ed"
        n={2}
        label="Extended Data Fig."
        spec="/projects/fragaria/interactive/fig12.json"
        src="/projects/fragaria/fig12_te_distribution.png"
        alt="Two panels. a: 28 small line plots, one per octoploid chromosome in rows by homoeologous group and columns by subgenome, showing gene, Gypsy, Copia and unclassified repeat density along each chromosome, with a shaded gene-poor region that usually reaches one chromosome end. b: stacked bars of genic, promoter, near and distal shares for array probes and genome bases; overall 46% of probes are genic against 36% of bases, and 3% of probes are distal against 6% of bases."
        lead="TEs rise where genes thin, and the array sits close to genes."
      >
        <b>a</b>, Density of genes, Gypsy, Copia and unclassified repeats along each of the 28 chromosomes, per 1 Mb, smoothed
        over three windows and scaled to each chromosome&apos;s maximum; rows are homoeologous groups, columns subgenomes; grey,
        the gene-poor region. <b>b</b>, Where the 50K array&apos;s 38,881 probes placed on FaRR1 sit relative to its genes
        (genic; up to 2 kb upstream; within 10 kb; farther), beside the genome&apos;s own share of bases, overall and inside and
        outside the gene-poor regions.
      </InteractiveFigure>

      <div className="endmatter">
        <h2>Data availability</h2>
        <p>
          All inputs are published: the cultivated array panel, phenotypes and whole-genome calls<Ref n={3} /> (Zenodo, CC-BY
          4.0), the wild <em>F. vesca</em> panel<Ref n={27} /> (Dryad, CC0), the UC Davis replication set<Ref n={6} /> (Dryad,
          CC0), the 50K marker table<Ref n={30} /> (Zenodo, CC-BY 4.0), and the repeat and gene annotations<Ref n={[31, 34]} />{" "}
          from GDR and the TIP preprint&apos;s repository. The numbers behind every figure are committed with the project and
          readable on this page (&quot;Show the data&quot; under each figure); no genotype-level data is redistributed.
        </p>
        <h2>Code availability</h2>
        <p>
          The analysis repository is private. The protocol — questions, gates, decision rules, thresholds and grids — is
          summarized here and recorded in full in the project&apos;s stage documents; the pre-registration framework it follows
          (topos) has its own write-up on this site.
        </p>
        <h2>Pre-registration statement</h2>
        <p>
          Pre-registered means committed to the project&apos;s own repository before the analysis, not lodged with an external
          registry. Six protocols and amendments B to H were each committed before their code, with a written guess at each
          result. Stage 0 was rebuilt twice on the same panel, each time after seeing the previous failure, so its final GO is a
          result on that panel after two revisions and needs an independent panel to confirm it. Amendments B to H were each
          written after reading the result before them: every step was fixed in advance, but the path through them was not. The
          invalid first run is reported in the Results; every analysis made after the result it examines is labelled as such
          where it appears, and nothing was re-scored.
        </p>
        <h2>Competing interests</h2>
        <p>None.</p>
      </div>

      <h2 id="references">References</h2>
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
        <li>Han H, Oh Y, Jang YJ, et al. Genomic architecture of the <em>resistance to Phytophthora cactorum 2</em> (<em>RPc2</em>) locus in strawberry (<em>Fragaria</em> × <em>ananassa</em>). <em>The Plant Genome</em> 19, e70168 (2026). <a href="https://doi.org/10.1002/tpg2.70168">doi:10.1002/tpg2.70168</a>. Repeat annotation: GDR, FL16.33-8 v1.0.</li>
        <li>Lyu K, Xiao J, Lyu S, Liu R. Comparative Analysis of Transposable Elements in Strawberry Genomes of Different Ploidy Levels. <em>International Journal of Molecular Sciences</em> 24, 16935 (2023). <a href="https://doi.org/10.3390/ijms242316935">doi:10.3390/ijms242316935</a>.</li>
        <li>Jin X, Du H, Chen M, et al. A fully phased octoploid strawberry genome reveals the evolutionary dynamism of centromeric satellites. <em>Genome Biology</em> 26, 17 (2025). <a href="https://doi.org/10.1186/s13059-025-03482-0">doi:10.1186/s13059-025-03482-0</a>.</li>
        <li>Priego-Cubero S, Tolley R, Llinares-Gómez J, et al. Naturally occurring variation in gene-associated transposable elements impacts gene expression and phenotypic diversity in woodland strawberry. bioRxiv (2025). <a href="https://doi.org/10.1101/2025.03.20.644342">doi:10.1101/2025.03.20.644342</a>. Preprint, not peer reviewed; the EDTA annotation is in the authors&apos; GitHub repository.</li>
        <li>Zhou Y, Xiong J, Shu Z, et al. The telomere-to-telomere genome of <em>Fragaria vesca</em> reveals the genomic evolution of <em>Fragaria</em> and the origin of cultivated octoploid strawberry. <em>Horticulture Research</em> 10, uhad027 (2023). <a href="https://doi.org/10.1093/hr/uhad027">doi:10.1093/hr/uhad027</a>.</li>
      </ol>
    </>
  );
}
