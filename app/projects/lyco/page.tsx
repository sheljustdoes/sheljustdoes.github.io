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

      <h2>The element, or where it sits?</h2>
      <p>
        An exploratory breakdown put most of the history difference on Gypsy LTR retrotransposons of intermediate age, with DNA
        transposons near their nulls. That raised an obvious objection. Gypsy elements crowd into the gene-poor pericentromeres, where
        recombination is rare and long blocks of DNA, including segments bred in from wild relatives, travel intact. Anything sitting
        there might record a distinct history, whatever it was made of.
      </p>
      <p>
        A third pre-registration tested this by comparing Gypsy with matched non-TE variants inside each kind of region separately.
        Pericentromeres were defined from gene density on the current reference (58–71% of each chromosome), with the 2012 genome
        consortium&apos;s heterochromatin borders [11], lifted from an older assembly, as a check. The rule was fixed in advance: a
        difference in the chromosome arms, where recombination is normal, would mean the element carries the signal.
      </p>
      <p>
        <strong>It does.</strong> In the arms, relationship matrices from 430 matched Gypsy and non-TE variants correlate at 0.926
        against a null of 0.972; in the pericentromeres, 0.975 against 0.996. The same group pattern appears in both: Gypsy relates wild
        and cherry accessions more closely, and cherry and big-fruited accessions less closely, than other variants do. Other
        transposable-element variants differ from non-TE ones by about a tenth as much. The verdict holds with the older borders and
        with stricter matching. Why Gypsy in particular records a different history is not settled; one candidate is that segments
        introgressed from wild relatives carry Gypsy insertions that arose in the donor lineage, which mark origin more sharply than
        older variants alongside them. That is the next question, not a finding.
      </p>
      <Figure
        n={3}
        src="/projects/lyco/fig3_element.png"
        alt="Two panels. a: for Gypsy and for other transposable-element variants, distance from a random-split null in standard deviations, in pericentromeres and arms under four definitions or matching schemes; every Gypsy point lies between 8 and 42 standard deviations out, every other-TE point between 4 and 10, all right of a threshold near 3. b: Gypsy-specific relatedness by group pair in arms and pericentromeres; wild–cherry and big-fruited–big-fruited lie above their null bands and cherry–big-fruited below, in both regions."
        lead="Gypsy's different history holds outside the pericentromeres."
      >
        <b>a</b>, How far each comparison lies from its own null of 1,000 random re-splits, in null standard deviations, for Gypsy
        (circles) and other transposable-element variants (squares) against matched non-TE variants; the dotted line is the
        pre-registered threshold. Rows cover both regions under the gene-density definition, the 2012 borders (nine chromosomes),
        matching within chromosome arms, and 20 Mb windows. Gypsy&apos;s difference is larger in the arms (a correlation drop of 0.046,
        against 0.020 in pericentromeres) but sits fewer standard deviations out, because the arms hold fewer matched variants and
        their null is noisier. <b>b</b>, Gypsy-specific relatedness by group pair, in arms (circles) and pericentromeres (diamonds),
        with the null&apos;s central 95% in grey; filled points lie outside it.
      </Figure>

      <h2>The TE landscape</h2>
      <p>
        The tests above compare classes of variants; this section describes them, so the reader can see what those classes are and
        where they sit. None of it is a pre-registered test.
      </p>
      <p>
        <strong>How much is transposable element.</strong> By the reference&apos;s own repeat annotation, 69% of the tomato genome is
        repeats, led by Gypsy (22%) and DNA transposons (21%). A published summary of the same reference gives 61% with the same
        ranking [2]; the file used here keeps fragmentary hits that summary drops, which accounts for most of the gap. Among structural
        variants over 100 bp, 77% of deletions and 72% of insertions contain repeat sequence, close to the 84% and 76% reported from
        long-read genomes [3]; a library built from one reference finds a little less. Variants over 1 kb are around 90% repeat, mostly
        several element families nested together.
      </p>
      <p>
        <strong>Which families are moving.</strong> Families are not represented among variable sites in proportion to their share of
        the genome. Copia makes up 11% of the genome&apos;s transposable-element sequence but 32% of the sequence in variable
        transposable-element insertions: many are about 4.5–5 kb, the size of a complete element, which fits the recent activity of the
        Copia-family Rider element in tomato [12]. Gypsy is the reverse: a third of the genome&apos;s element sequence, but its variable
        copies are mostly short fragments.
      </p>
      <Figure
        n={4}
        src="/projects/lyco/fig4_proportions.png"
        alt="Three panels. a: share of the genome in each transposable-element class, this annotation against a published summary; Gypsy and DNA transposons lead in both. b: stacked bars of TE-derived, ambiguous and non-TE structural variants for deletions and insertions in three size classes; the ambiguous share grows with size to about two thirds above 1 kb. c: for each family, its share of the genome's element sequence against its share of variable insertions by count and by bases; Copia is 11% of the genome but 32% of variable-insertion bases."
        lead="Transposable elements make up most of the genome and most large variants, but not every family in proportion."
      >
        <b>a</b>, Share of the reference genome in each class, one class per base, this annotation (orange) against Zhou and colleagues&apos;
        summary [2] (grey). <b>b</b>, Structural variants by type and size: TE-derived (at least 80% one family), ambiguous and non-TE.
        <b>c</b>, Each family&apos;s share of the genome&apos;s element sequence (grey tick) against its share of TE-derived variants, by
        count (circles) and by bases (squares).
      </Figure>
      <p>
        <strong>Where they sit.</strong> The gene-poor pericentromeres cover about two thirds of the genome and hold 30% of genes, but
        79% of Gypsy variants, against 43% of non-TE variants. Gypsy variants also avoid genes within the gene-rich arms: 10% fall inside
        genes, against 30% of non-TE variants. That fits Gypsy&apos;s known preference for heterochromatin and selection against insertions
        into genes; this description cannot tell the two apart.
      </p>
      <Figure
        n={5}
        src="/projects/lyco/fig5_distribution.png"
        alt="Two panels. a: twelve small plots, one per chromosome, of gene density and variant density along the chromosome, with pericentromeres shaded; Gypsy variants peak inside the shaded pericentromeres, genes and non-TE variants toward the chromosome ends. b: stacked bars of variants inside genes, in promoters, within 10 kb or farther, for Gypsy, other TE and non-TE variants in arms and in pericentromeres; Gypsy is least often genic in both."
        lead="Gypsy variants crowd the pericentromeres and keep away from genes."
      >
        <b>a</b>, Density of genes and of Gypsy, other TE-derived and non-TE variants along each chromosome (1 Mb bins, smoothed over
        3 Mb, each line scaled to its own maximum); grey shading marks the pericentromere. <b>b</b>, Variants by position relative to the
        nearest gene: inside it, within 2 kb upstream, within 10 kb, or farther.
      </Figure>
      <p>
        <strong>Near known genes.</strong> For 29 well-studied genes with verified identifiers, from fruit colour and size to ripening,
        flavour, plant architecture and disease resistance, every variant within 5 kb was counted. Complete-length Copia insertions sit
        near nine of them, including SUN, J2, PPEAT and I-3. Some match transposable-element alleles described before: Copia insertions
        at PPEAT [1] and J2, and common Copia variants near Ph-3. At SUN, a 4.9 kb Copia element present in the reference is missing from
        78% of accessions; the well-known SUN elongation allele is a separate event, a Rider-driven copy of the gene on another
        chromosome [13], which this count does not test. No transposable-element variant was found near PSY1. These are nearby
        candidates, not causes.
      </p>
      <Figure
        n={6}
        src="/projects/lyco/fig6_trait_genes.png"
        alt="Horizontal stacked bars for 29 tomato trait genes showing how many Gypsy, other TE, ambiguous and non-TE variants lie within 5 kb, with green triangles marking Copia variants of at least 4 kb. TomLoxC has the most variants, about 44; complete-length Copia variants appear near SUN, ALMT9, TomLoxC, AAT1, PPEAT, SP, J2, JOINTLESS and I-3."
        lead="Complete-length Copia insertions turn up near many well-studied trait genes."
      >
        Variants within 5 kb of each gene across all 706 accessions, by class. Triangles mark Copia variants of at least 4 kb, the size
        of a complete element; a dagger marks genes with a transposable-element allele reported in the literature. Resistance genes whose
        identifiers could not be verified, or that are absent from the reference, are left out.
      </Figure>

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
        <strong>Results committed.</strong> Four pre-registrations: the trait question, stopped by its power check before scoring; the
        genotyping gate, passed; and the history questions and the element-or-region test, each scored once. Every protocol was committed before its result, including
        the checks that stopped the first design, and a discovery-bias check specified before it ran. A third pre-registration then showed the Gypsy signal holds
        outside the pericentromeres too. Next: whether introgressed wild segments explain why.
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
              <li>Tomato Genome Consortium. The tomato genome sequence provides insights into fleshy fruit evolution. <em>Nature</em> 485, 635–641 (2012). <a href="https://doi.org/10.1038/nature11119">doi:10.1038/nature11119</a>.</li>
        <li>Benoit M, Drost H-G, Catoni M, et al. Environmental and epigenetic regulation of Rider retrotransposons in tomato. <em>PLOS Genetics</em> 15, e1008370 (2019). <a href="https://doi.org/10.1371/journal.pgen.1008370">doi:10.1371/journal.pgen.1008370</a>.</li>
        <li>Xiao H, Jiang N, Schaffner E, Stockinger EJ, van der Knaap E. A retrotransposon-mediated gene duplication underlies morphological variation of tomato fruit. <em>Science</em> 319, 1527–1530 (2008). <a href="https://doi.org/10.1126/science.1153040">doi:10.1126/science.1153040</a>.</li>
</ol>
    </>
  );
}
