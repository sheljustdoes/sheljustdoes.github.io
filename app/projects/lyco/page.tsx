import Figure from "../Figure";

export const metadata = { title: "lyco. — shel." };

export default function LycoPage() {
  return (
    <>
      <span className="kicker">Project — 2026–</span>
      <h1>lyco.</h1>
      <p className="tagline">
        What transposable-element insertions record about tomato&apos;s history that other structural variants do not, worked out
        from published pangenome call sets on one laptop, with every question pre-registered before it was scored.
      </p>

      <h2>Why this exists</h2>
      <p>
        Most structural variants in tomato are made of transposable elements: in long-read assemblies of 100 accessions, 84% of
        deletions and 76% of insertions over 100 bp match a repeat [3]. Transposable element insertions are known to shape fruit traits
        and to be poorly tagged by nearby SNPs [1], and structural variants as a whole carry heritability that SNPs miss [2]. What had not
        been asked is whether an SV&apos;s origin matters: does a variant made of a transposable element behave differently from any other
        variant of the same size and frequency?
      </p>
      <p>
        The project uses only published data: SV genotypes for 706 accessions from a graph pangenome [2], independent short-read [1] and
        long-read [3] call sets for checking them, and accession records from the original resequencing study [4]. Nothing is
        re-called from reads. Each variant was labelled TE-derived (at least 80% covered by one transposable-element family), non-TE (at
        most 20% covered by any repeat) or ambiguous, using the reference genome&apos;s own repeat annotation. Where the labels could be
        checked against an independent annotation, 7.8% of non-TE labels disagreed, under a 10% threshold set in advance for rebuilding
        the library.
      </p>

      <h2>The first question, and why it was never scored</h2>
      <p>
        lyco began as a trait question: do TE-derived variants carry more of tomato&apos;s heritability for fruit metabolites, flavour
        and gene expression than matched non-TE variants? The pre-registration included a power check that had to pass before any trait
        was examined. It failed in every trait class.
      </p>
      <p>
        <strong>The reason is structural, not statistical noise.</strong> Splitting heritability between two sets of variants [5] works when
        the relationship matrices built from them differ. In about 300 inbred accessions spanning wild, cherry and big-fruited tomato,
        they barely do: matched TE-derived and non-TE variants gave relationship matrices that correlate at 0.97, because both mostly
        encode population structure (the top three components carry 43% of each). The precision of such estimates depends on how much
        relatedness varies between pairs of individuals [6], and structure makes these estimates unreliable [7]; with two components this
        collinear, their difference cannot be resolved. A per-variant redesign failed its own power check too: a single causal variant&apos;s
        association signal spread to a median of 29 other variants on six chromosomes, so no signal could be pinned to one class.
      </p>
      <p>
        Both designs were stopped before any trait was looked at. The structure that made trait attribution impossible is also a record
        of population history, so the project turned to that instead, using all 706 accessions and no traits.
      </p>

      <h2>The gate: are TE variants genotyped as well as other variants?</h2>
      <p>
        Genotyping transposable-element insertions from short reads is harder than genotyping other variants, since reads from repeats
        map ambiguously. If TE-derived variants were genotyped worse, every comparison below would partly measure error. So the first
        pre-registered test compared the graph genotypes against independent long-read calls [3] on the 66 accessions both cover, after
        lifting the long-read calls onto the same reference.
      </p>
      <p>
        <strong>They agree equally well: median concordance 0.984 for TE-derived variants (19,102 variants) and 0.984 for non-TE variants
        (21,514).</strong> The result holds for high-confidence calls only and across matching windows from 50 to 500 bp. Short-read TE
        insertion calls [1] agree too (median 0.987 over 838 variants on 531 shared accessions). Most variants are rare among the shared
        accessions, so agreement on absence carries much of the median; what matters for what follows is that the two classes do not
        differ.
      </p>
      <Figure
        n={1}
        src="/projects/lyco/fig1_gate.png"
        alt="Two overlapping curves showing the share of structural variants at or above each level of concordance with long-read calls, from 0.5 to 1. The curve for 19,102 TE-derived variants and the curve for 21,514 non-TE variants lie on top of each other; both have a median of 0.984."
        lead="Transposable-element variants are genotyped as well as any other variant."
      >
        Per-variant agreement between graph genotypes and long-read calls on the 66 accessions both cover, for TE-derived (solid) and
        non-TE (dashed) variants. Each curve shows the share of variants at or above a given concordance; the axis starts at 0.5, below
        which 0.3% of each class falls. About 28% of each class agree perfectly.
      </Figure>

      <h2>What the history questions found</h2>
      <p>
        Three questions were pre-registered together, with a frozen analysis grid, and each was scored once on 547 accessions left after
        removing near-duplicates.
      </p>
      <p>
        <strong>TE-derived variants record a measurably different population history.</strong> Relationship matrices from 3,695 matched
        variants in each class correlate at 0.991. Random re-splits of the same variants give 0.998 ± 0.0002, so the difference lies far
        outside chance, and it holds with 10 Mb region matching as well as 20 Mb. The difference concentrates in two places: TE insertions
        relate wild and cherry accessions more closely than other variants do, and cherry and big-fruited accessions less closely. That
        pattern would fit insertions inherited along particular lineages.
      </p>
      <p>
        The obvious non-biological explanation is discovery bias: if TE-derived variants had been found in a different set of assembled
        genomes from other variants, their relatedness would differ for that reason alone. The public files do not record where each
        variant was found, so this was checked indirectly, with a rule written down before running it. Among common variants, 97% of
        TE-derived and 95% of non-TE variants are carried by one of the accessions assembled from high-fidelity long reads, and 84% and
        82% match an independent long-read call, so the two classes could have been discovered almost equally. Restricted to variants
        both routes could see, the difference reproduces (0.992 against a null of 0.998). A test within a single discovery route was
        not possible, because almost no common variants were found by only one; by the rule as written, the verdict is therefore
        &ldquo;partly explained&rdquo;. In substance, discovery bias is an unlikely explanation.
      </p>
      <Figure
        n={2}
        src="/projects/lyco/fig2_history.png"
        alt="Two panels. a: a histogram of 1,000 random re-splits of the matched variants, tightly clustered around a correlation of 0.998, with the observed correlation between TE-derived and non-TE relationship matrices, 0.991, marked far to the left. b: residual TE-specific relatedness for six pairs of groups, each with a grey null band; wild–cherry lies above its band, cherry–big-fruited below, and cherry–cherry inside."
        lead="TE-derived variants tell a different story about who is related to whom."
      >
        <b>a</b>, Correlation between relationship matrices built from matched TE-derived and non-TE variants (orange line), against
        1,000 random re-splits of the same variants into two halves (20 Mb region matching; 547 accessions). <b>b</b>, Where the
        difference sits: relatedness the TE-derived variants add beyond the non-TE ones, averaged within and between groups, with the
        central 95% of the same quantity across the re-splits (grey). Filled points lie outside their band. Wild–cherry,
        cherry–big-fruited and big-fruited–big-fruited lie outside it at both 10 and 20 Mb matching; wild–wild and wild–big-fruited at
        one window only; cherry–cherry at neither. Among variants both discovery routes could see, the first two remain outside.
      </Figure>
      <p>
        <strong>Their frequency spectra through domestication do not differ.</strong> Across wild, cherry and big-fruited groups, the
        share of rare variants is almost identical for the two classes (differences under half a percentage point). Two measures
        differed before correction for multiple testing: TE variants are slightly more differentiated between wild and cherry tomato
        [8], and slightly less often lost between wild and cultivated. Neither survives correction.
      </p>
      <p>
        <strong>Young insertions look lineage-specific, mostly because they are rare.</strong> Taking divergence from the family&apos;s
        reference copy as a clock, young TE insertions (at most 2% diverged) are private to one group 2.2 percentage points more often
        than old ones, and specificity falls with age. But rare alleles are private more often whatever their age, and young insertions
        are rarer. Comparing alleles carried by similar numbers of accessions, the difference shrinks to 0.8 points and its interval
        includes zero. The pre-registered test passed; the lineage-marker reading is weak.
      </p>

      <h2>Related work</h2>
      <p>
        Transposable element insertions were first tested against tomato traits genome-wide by Domínguez and colleagues [1], and SVs
        against SNPs for heritability by Zhou and colleagues [2]; neither separates TE-derived from other SVs. The closest comparison of
        the two classes is in rapeseed, where TE insertions lowered gene expression and non-TE variants did not [9]. In human genetics,
        mobile-element insertions were less enriched among expression-altering variants than other SVs [10], a reminder that TE origin
        need not mean larger effects.
      </p>

      <h2>Limits</h2>
      <p>
        Variant discovery was not uniform: the graph was built from 32 high-fidelity assemblies, 100 long-read genomes and short reads,
        so rare variants in over-represented groups are likelier to have been found. The discovery check used 24 of the 32 assembled
        accessions, the ones genotyped in this panel. The TE library comes from one reference genome, so
        families absent from it can be missed. Ages come from divergence to one reference copy per family, not from paired long terminal
        repeats. Inbred lines were treated as haploid, and heterozygous calls as missing.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed.</strong> Three pre-registrations: the trait question, stopped by its power check before scoring; the
        genotyping gate, passed; and the history questions, each scored once. Every protocol was committed before its result, including
        the checks that stopped the first design, and a discovery-bias check specified before it ran. Next: which transposable-element
        families drive the wild–cherry and cherry–big-fruited differences.
      </p>

      <h2>References</h2>
      <ol className="references">
        <li>Domínguez M, Dugas E, Benchouaia M, et al. The impact of transposable elements on tomato diversity. <em>Nature Communications</em> 11, 4058 (2020). <a href="https://doi.org/10.1038/s41467-020-17874-2">doi:10.1038/s41467-020-17874-2</a>.</li>
        <li>Zhou Y, Zhang Z, Bao Z, et al. Graph pangenome captures missing heritability and empowers tomato breeding. <em>Nature</em> 606, 527–534 (2022). <a href="https://doi.org/10.1038/s41586-022-04808-9">doi:10.1038/s41586-022-04808-9</a>.</li>
        <li>Alonge M, Wang X, Benoit M, et al. Major impacts of widespread structural variation on gene expression and crop improvement in tomato. <em>Cell</em> 182, 145–161 (2020). <a href="https://doi.org/10.1016/j.cell.2020.05.021">doi:10.1016/j.cell.2020.05.021</a>.</li>
        <li>Lin T, Zhu G, Zhang J, et al. Genomic analyses provide insights into the history of tomato breeding. <em>Nature Genetics</em> 46, 1220–1226 (2014). <a href="https://doi.org/10.1038/ng.3117">doi:10.1038/ng.3117</a>.</li>
        <li>Yang J, Manolio TA, Pasquale LR, et al. Genome partitioning of genetic variation for complex traits using common SNPs. <em>Nature Genetics</em> 43, 519–525 (2011). <a href="https://doi.org/10.1038/ng.823">doi:10.1038/ng.823</a>.</li>
        <li>Visscher PM, Hemani G, Vinkhuyzen AAE, et al. Statistical power to detect genetic (co)variance of complex traits using SNP data in unrelated samples. <em>PLOS Genetics</em> 10, e1004269 (2014). <a href="https://doi.org/10.1371/journal.pgen.1004269">doi:10.1371/journal.pgen.1004269</a>.</li>
        <li>Krishna Kumar S, Feldman MW, Rehkopf DH, Tuljapurkar S. Limitations of GCTA as a solution to the missing heritability problem. <em>PNAS</em> 113, E61–E70 (2016). <a href="https://doi.org/10.1073/pnas.1520109113">doi:10.1073/pnas.1520109113</a>.</li>
        <li>Hudson RR, Slatkin M, Maddison WP. Estimation of levels of gene flow from DNA sequence data. <em>Genetics</em> 132, 583–589 (1992). <a href="https://doi.org/10.1093/genetics/132.2.583">doi:10.1093/genetics/132.2.583</a>.</li>
        <li>Yildiz G, Zanini SF, Weber S, et al. Graphical pangenomics-enabled characterization of structural variant impact on gene expression in <em>Brassica napus</em>. <em>Theoretical and Applied Genetics</em> 138, 91 (2025). <a href="https://doi.org/10.1007/s00122-025-04867-2">doi:10.1007/s00122-025-04867-2</a>.</li>
        <li>Scott AJ, Chiang C, Hall IM. Structural variants are a major source of gene expression differences in humans and often affect multiple nearby genes. <em>Genome Research</em> 31, 2249–2257 (2021). <a href="https://doi.org/10.1101/gr.275488.121">doi:10.1101/gr.275488.121</a>.</li>
      </ol>
    </>
  );
}
