import InteractiveFigure from "../InteractiveFigure";
import Ref from "../Ref";

export const metadata = { title: "lyco. — shel." };

export default function LycoPage() {
  return (
    <>
      <span className="kicker">Project — lyco · 2026</span>
      <h1>Transposable-element insertions record a distinct population history in tomato</h1>
      <p className="byline">
        Shel Burkes, PhD<span className="sep">·</span>Pre-registered 26 September 2026<span className="sep">·</span>Scored 27
        September 2026<span className="sep">·</span>Stage 1d in progress
      </p>

      <div className="abstract">
        <span className="abstract-label">Abstract</span>
        Most structural variants in tomato are made of transposable elements: in long-read assemblies of 100 accessions, 84% of
        deletions and 76% of insertions over 100 bp match a repeat<Ref n={3} />. Transposable-element insertions shape fruit traits and
        are poorly tagged by nearby SNPs<Ref n={1} />, and structural variants as a whole carry heritability that SNPs miss
        <Ref n={2} />; whether a variant&apos;s <em>origin</em> matters — whether a variant made of a transposable element behaves
        differently from any other variant of the same size and frequency — had not been asked. Here we show that TE-derived and non-TE
        structural variants, though genotyped equally well (median long-read concordance 0.984 for both), record measurably different
        population histories across 547 tomato accessions: relationship matrices from matched variants correlate at 0.991 where random
        re-splits give 0.998 ± 0.0002. The difference concentrates in Gypsy retrotransposons of intermediate age and persists in the
        recombining chromosome arms (r 0.926 against a null of 0.972), so it follows the element, not the pericentromeric regions
        where Gypsy resides. Frequency spectra through domestication do not differ. Transposable-element origin marks lines of descent
        that other variation does not; whether introgressed wild segments explain the Gypsy signal is under a pre-registered test now.
      </div>

      <p>
        Transposable-element insertions were first tested against tomato traits genome-wide by Domínguez and colleagues<Ref n={1} />,
        and structural variants against SNPs for heritability by Zhou and colleagues<Ref n={2} />; neither separates TE-derived from
        other structural variants. The closest comparison of the two classes is in rapeseed, where TE insertions lowered gene
        expression and non-TE variants did not<Ref n={9} />. In human genetics, mobile-element insertions were less enriched among
        expression-altering variants than other structural variants<Ref n={10} /> — a reminder that TE origin need not mean larger
        effects. We asked the question in tomato with published data only: graph-pangenome SV genotypes for 706 accessions
        <Ref n={2} />, independent short-read<Ref n={1} /> and long-read<Ref n={3} /> call sets for checking them, and accession
        records from the original resequencing study<Ref n={4} />. Nothing was re-called from reads, and every test was pre-registered
        and scored once (Box 1, Methods).
      </p>

      <aside className="box">
        <span className="box-lead">Box 1 | How to read the verdicts</span>
        <p>
          Every question below was written down, with its analysis grid frozen and hashed, before its result was computed, and scored
          exactly once; deviations are recorded, not silently fixed. <strong>GO / KILL / HOLD</strong> are gate verdicts: proceed, stop,
          or wait on a pre-stated criterion. A <strong>matched</strong> comparison pairs TE-derived and non-TE variants with the same
          frequency, length, type and genomic region, so the classes differ only in origin. A <strong>null of random re-splits</strong>{" "}
          takes the same matched variants, splits them in half at random 1,000 times, and asks how different two halves look by chance;
          an observed difference is called <strong>different</strong> only when it falls below the null&apos;s 0.001 quantile, and{" "}
          <strong>no detectable difference</strong> when it sits inside the null&apos;s central 95%.
        </p>
      </aside>

      <h2>Heritability partition between variant classes is unidentifiable in this panel</h2>
      <p>
        The first pre-registered question — do TE-derived variants carry more of tomato&apos;s heritability for fruit metabolites,
        flavour and expression than matched non-TE variants? — included a power check that had to pass before any trait was examined.
        It failed in every trait class, for a structural reason. Partitioning heritability between two sets of variants<Ref n={5} />{" "}
        works when the relationship matrices built from them differ; in ~300 inbred accessions spanning wild, cherry and big-fruited
        tomato, matched TE-derived and non-TE variants gave matrices correlating at 0.97, because both mostly encode population
        structure (the top three components carry 43% of each). The precision of such estimates depends on how much relatedness varies
        between pairs<Ref n={6} />, and structure makes them unreliable<Ref n={7} />; with the two components this collinear, their
        difference cannot be resolved. A per-variant redesign failed its own power check as well: a single causal variant&apos;s
        association signal spread to a median of 29 other variants on six chromosomes, so no signal could be pinned to one class. Both
        designs were stopped before any trait was looked at. The structure that blocks trait attribution is itself a record of
        population history, and the remaining questions address that record directly, in all 706 accessions and with no traits.
      </p>

      <h2>TE-derived and non-TE variants are genotyped equally well</h2>
      <p>
        Genotyping transposable-element insertions from short reads is harder than genotyping other variants, because reads from
        repeats map ambiguously; if TE-derived variants were genotyped worse, every comparison below would partly measure error. Graph
        genotypes agree with independent long-read calls<Ref n={3} /> equally well for both classes on the 66 accessions both cover:
        median concordance 0.984 for TE-derived variants (19,102 variants) and 0.984 for non-TE variants (21,514) (Fig. 1). The result
        holds for high-confidence calls only and across matching windows from 50 to 500 bp, and short-read TE insertion calls
        <Ref n={1} /> agree too (median 0.987 over 838 variants on 531 shared accessions). Most variants are rare among the shared
        accessions, so agreement on absence carries much of the median; what matters for what follows is that the two classes do not
        differ.
      </p>
      <InteractiveFigure
        n={1}
        src="/projects/lyco/fig1_gate.png"
        spec="/projects/lyco/interactive/fig1.json"
        slug="lyco"
        alt="Two overlapping curves showing the share of structural variants at or above each level of concordance with long-read calls, from 0.5 to 1. The curve for 19,102 TE-derived variants and the curve for 21,514 non-TE variants lie on top of each other; both have a median of 0.984."
        lead="Transposable-element variants are genotyped as well as any other variant."
      >
        Per-variant agreement between graph genotypes and long-read calls on the 66 accessions both cover, for TE-derived (solid) and
        non-TE (dashed) variants. Each curve shows the share of variants at or above a given concordance; the axis starts at 0.5, below
        which 0.3% of each class falls. About 28% of each class agree perfectly.
      </InteractiveFigure>

      <h2>TE-derived variants record a different population history</h2>
      <p>
        Relationship matrices built from 3,695 matched variants in each class correlate at 0.991 across the 547 accessions left after
        removing near-duplicates; random re-splits of the same variants give 0.998 ± 0.0002 (Fig. 2a), so the difference lies far
        outside chance, and it holds with 10 Mb region matching as well as 20 Mb. The difference concentrates in two places: TE
        insertions relate wild and cherry accessions more closely than other variants do, and cherry and big-fruited accessions less
        closely (Fig. 2b) — a pattern consistent with insertions inherited along particular lineages.
      </p>
      <p>
        The obvious non-biological explanation is discovery bias: if TE-derived variants had been found in a different set of assembled
        genomes from other variants, their relatedness would differ for that reason alone. The public files do not record where each
        variant was found, so we checked indirectly, by a rule fixed before it ran (Methods). Among common variants, 97% of TE-derived
        and 95% of non-TE variants are carried by an accession assembled from high-fidelity long reads, and 84% and 82% match an
        independent long-read call, so the two classes could have been discovered almost equally; restricted to variants both routes
        could see, the difference reproduces (0.992 against a null of 0.998). A test within a single discovery route was not possible,
        because almost no common variants were found by only one; by the rule as written the verdict is therefore &ldquo;partly
        explained&rdquo;, and in substance discovery bias is an unlikely explanation.
      </p>
      <InteractiveFigure
        n={2}
        src="/projects/lyco/fig2_history.png"
        spec="/projects/lyco/interactive/fig2.json"
        slug="lyco"
        alt="Two panels. a: a histogram of 1,000 random re-splits of the matched variants, tightly clustered around a correlation of 0.998, with the observed correlation between TE-derived and non-TE relationship matrices, 0.991, marked far to the left. b: residual TE-specific relatedness for six pairs of groups, each with a grey null band; wild–cherry lies above its band, cherry–big-fruited below, and cherry–cherry inside."
        lead="TE-derived variants tell a different story about who is related to whom."
      >
        <b>a</b>, Correlation between relationship matrices built from matched TE-derived and non-TE variants (orange line), against
        1,000 random re-splits of the same variants into two halves (20 Mb region matching; 547 accessions). <b>b</b>, Where the
        difference sits: relatedness the TE-derived variants add beyond the non-TE ones, averaged within and between groups, with the
        central 95% of the same quantity across the re-splits (grey). Filled points lie outside their band. Wild–cherry,
        cherry–big-fruited and big-fruited–big-fruited lie outside it at both 10 and 20 Mb matching; wild–wild and wild–big-fruited at
        one window only; cherry–cherry at neither. Among variants both discovery routes could see, the first two remain outside.
      </InteractiveFigure>

      <h2>Neither frequency spectra nor insertion ages separate the classes</h2>
      <p>
        Across wild, cherry and big-fruited groups, the share of rare variants is almost identical for the two classes (differences
        under half a percentage point). Two measures differed before correction for multiple testing — TE variants are slightly more
        differentiated between wild and cherry tomato<Ref n={8} />, and slightly less often lost between wild and cultivated — and
        neither survives correction. Taking divergence from the family&apos;s reference copy as a clock, young TE insertions (at most
        2% diverged) are private to one group 2.2 percentage points more often than old ones, and specificity falls with age; but rare
        alleles are private more often whatever their age, and young insertions are rarer. Comparing alleles carried by similar numbers
        of accessions, the difference shrinks to 0.8 points and its interval includes zero. The pre-registered test passed; the
        lineage-marker reading of insertion age is weak.
      </p>

      <h2>The signal follows the element, not the pericentromere</h2>
      <p>
        An exploratory breakdown put most of the history difference on Gypsy LTR retrotransposons of intermediate age, with DNA
        transposons near their nulls. That raises an objection: Gypsy elements crowd into the gene-poor pericentromeres, where
        recombination is rare and long blocks of DNA — including segments bred in from wild relatives — travel intact, so anything
        sitting there might record a distinct history whatever it is made of. A third pre-registration separated the two readings by
        comparing Gypsy with matched non-TE variants inside each kind of region, with the rule fixed in advance: a difference in the
        chromosome arms, where recombination is normal, would mean the element carries the signal.
      </p>
      <p>
        It does. In the arms, relationship matrices from 430 matched Gypsy and non-TE variants correlate at 0.926 against a null of
        0.972; in the pericentromeres, 0.975 against 0.996 (Fig. 3a). The same group pattern appears in both: Gypsy relates wild and
        cherry accessions more closely, and cherry and big-fruited accessions less closely, than other variants do (Fig. 3b). Other
        transposable-element variants differ from non-TE ones by about a tenth as much. The verdict holds with the independently
        published 2012 heterochromatin borders<Ref n={11} /> and with stricter matching.
      </p>
      <InteractiveFigure
        n={3}
        src="/projects/lyco/fig3_element.png"
        spec="/projects/lyco/interactive/fig3.json"
        slug="lyco"
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
      </InteractiveFigure>

      <h2>Discussion</h2>
      <p>
        Across 547 tomato accessions, structural variants made of transposable elements record a population history that matched
        variants of any other origin do not, and the signal belongs to the elements — above all Gypsy retrotransposons of intermediate
        age — rather than to the pericentromeric neighbourhoods they occupy. The two classes are genotyped equally well, their
        frequency spectra through domestication are indistinguishable, and the discovery-bias check argues against an artefactual
        origin, so the difference is most plausibly a real feature of how these insertions descended through wild, cherry and
        big-fruited tomato.
      </p>
      <p>
        Several limits bound the claim. Variant discovery was not uniform: the graph was built from 32 high-fidelity assemblies, 100
        long-read genomes and short reads, so rare variants in over-represented groups are likelier to have been found, and the
        discovery check could use only the 24 assembled accessions genotyped in this panel. The TE library derives from one reference
        genome, so families absent from it can be missed. Insertion ages rest on divergence to one reference copy per family, not on
        paired long terminal repeats. Inbred lines were treated as haploid, with heterozygous calls set to missing. And the same
        collinearity that revealed the history signal made the original trait question unanswerable in this panel: whether TE-derived
        variants carry distinct heritability remains open, and would need a design or population where the two relationship matrices
        separate.
      </p>
      <p>
        Why Gypsy in particular records a different history is not settled. One candidate mechanism is that segments introgressed from
        wild relatives during resistance breeding<Ref n={4} /> carry Gypsy insertions that arose in the donor lineage, marking wild
        origin more sharply than the older variants alongside them. A fourth pre-registration testing this — wild-segment calling from
        SNPs alone, with Lin and colleagues&apos; five introgressed loci<Ref n={4} /> as positive controls — is at the sign-off stage
        now; its design facts, including one pre-registered redesign trigger that fired and the threshold chosen in response, are in
        the stage documents.
      </p>

      <h2>Methods</h2>
      <div className="endmatter">
        <p>
          <strong>Data sources.</strong> SV genotypes for 706 accessions from the tomato graph pangenome<Ref n={2} />; independent
          short-read TE insertion calls<Ref n={1} /> and long-read SV calls<Ref n={3} /> for concordance checks; accession passports
          and group labels from the resequencing study<Ref n={4} /> and BioSample records. Nothing was re-called from sequencing
          reads, and all computation ran on one laptop.
        </p>
        <p>
          <strong>Variant labelling.</strong> Each variant&apos;s sequence was annotated against a library built from the SL5.0
          reference&apos;s repeat annotation (one exemplar per family: the longest copy within 10% divergence; 4,588 families).
          TE-derived means at least 80% of the variant covered by one known family; non-TE means at most 20% covered by any repeat;
          the remainder is ambiguous and excluded from class comparisons. Where labels could be checked against an independent
          annotation<Ref n={3} />, 7.8% of non-TE labels disagreed, under the 10% threshold pre-set for rebuilding the library.
        </p>
        <p>
          <strong>Accessions and groups.</strong> Near-duplicates were removed by identity-by-state ≥ 0.99 (706 → 547; the standard
          heterozygosity-based kinship estimator is undefined for inbred lines). Accessions were grouped as wild (PIM), cherry (CER)
          and big-fruited (BIG) from the published labels, with unlabelled accessions assigned by 10-nearest-neighbour vote requiring
          8 agreeing neighbours. Inbred lines were treated as haploid; heterozygous calls were set to missing.
        </p>
        <p>
          <strong>Matching and null construction.</strong> TE-derived and non-TE variants were matched within strata of minor-allele
          frequency, length, variant type and 20 Mb genomic region (10 Mb as sensitivity). The null re-splits the pooled matched
          variants into random halves within the same strata 1,000 times and recomputes the statistic; &ldquo;different&rdquo; requires
          the observed value below the null&apos;s 0.001 quantile.
        </p>
        <p>
          <strong>Genotype concordance.</strong> Long-read calls<Ref n={3} /> were lifted to SL5.0 by re-mapping ±500 bp flanks with
          minimap2 (MAPQ ≥ 30, ≥ 90% coverage, ≥ 95% identity) and matched to graph variants within 100 bp (50–500 bp as
          sensitivity); per-variant concordance is the share of the 66 shared accessions with equal calls. Short-read insertion
          calls<Ref n={1} /> were matched by interval containment, reflecting their split-read coordinates.
        </p>
        <p>
          <strong>Heritability-partition power check.</strong> Class-specific relationship matrices were compared by the correlation
          of their off-diagonal entries against the random-half baseline; Haseman–Elston regression with chromosome-half block
          resampling supplied the error model. The per-variant redesign was assessed by the spread of single-variant association
          signal across matched variants.
        </p>
        <p>
          <strong>Frequency spectra and ages.</strong> Site-frequency spectra were compared by hypergeometric projection within
          groups; between-group differentiation used Hudson&apos;s F<sub>ST</sub> as a ratio of averages<Ref n={8} />; multiple tests
          were Holm-corrected. Insertion age is the variant sequence&apos;s divergence from its family&apos;s reference exemplar
          (young ≤ 2%), and the age analysis compares group-privacy of young against old insertions, with a frequency-matched
          version pre-registered alongside.
        </p>
        <p>
          <strong>Pericentromeres.</strong> Defined per chromosome from gene density (midpoint rule on the bimodal 20th–80th
          percentile span; 58–71% of each chromosome), with the 2012 genome consortium&apos;s heterochromatin borders<Ref n={11} />{" "}
          lifted from SL2.40 as an independent check (nine chromosomes lifted cleanly). The element-versus-region comparison ran
          Gypsy against matched non-TE variants separately within pericentromeres and arms, with the decision rule fixed before
          scoring.
        </p>
        <p>
          <strong>Protocol.</strong> Every stage was pre-registered in the project repository: the question, eligibility, statistics,
          decision rule and seeds were committed, and the analysis grid frozen with its SHA-256 hash recorded, before any result was
          computed; each question was scored once and deviations are logged in the stage documents.
        </p>
      </div>

      <h2>Extended Data — the transposable-element landscape</h2>
      <p>
        The scored tests above compare classes of variants; the figures below describe them — what the classes are made of and where
        they sit. None of this is a pre-registered test.
      </p>
      <p>
        <strong>How much is transposable element.</strong> By the reference&apos;s own repeat annotation, 69% of the tomato genome is
        repeats, led by Gypsy (22%) and DNA transposons (21%); a published summary of the same reference gives 61% with the same
        ranking<Ref n={2} />, the gap mostly fragmentary hits that summary drops (Extended Data Fig. 1). Among structural variants over
        100 bp, 77% of deletions and 72% of insertions contain repeat sequence, close to the 84% and 76% reported from long-read
        genomes<Ref n={3} />. Variants over 1 kb are around 90% repeat, mostly several element families nested together.
      </p>
      <p>
        <strong>Which families are moving.</strong> Copia makes up 11% of the genome&apos;s transposable-element sequence but 32% of
        the sequence in variable insertions; many are 4.5–5 kb, the size of a complete element, which fits the recent activity of the
        Copia-family Rider element in tomato<Ref n={12} />. Short-read insertion calls agree: Copia is 36% of polymorphic insertions
        there, Rider the commonest single family, though Gypsy still leads by count<Ref n={1} />. Gypsy is the reverse — a third of
        the genome&apos;s element sequence, but its variable copies are mostly short fragments (Extended Data Fig. 1c).
      </p>
      <InteractiveFigure
        n={1}
        label="Extended Data Fig."
        src="/projects/lyco/fig4_proportions.png"
        spec="/projects/lyco/interactive/fig4.json"
        slug="lyco-ed"
        alt="Three panels. a: share of the genome in each transposable-element class, this annotation against a published summary; Gypsy and DNA transposons lead in both. b: stacked bars of TE-derived, ambiguous and non-TE structural variants for deletions and insertions in three size classes; the ambiguous share grows with size to about two thirds above 1 kb. c: for each family, its share of the genome's element sequence against its share of variable insertions by count and by bases; Copia is 11% of the genome but 32% of variable-insertion bases."
        lead="Transposable elements make up most of the genome and most large variants, but not every family in proportion."
      >
        <b>a</b>, Share of the reference genome in each class, one class per base, this annotation (orange) against Zhou and
        colleagues&apos; summary<Ref n={2} /> (grey). <b>b</b>, Structural variants by type and size: TE-derived (at least 80% one
        family), ambiguous and non-TE. <b>c</b>, Each family&apos;s share of the genome&apos;s element sequence (grey tick) against its
        share of TE-derived variants, by count (circles) and by bases (squares).
      </InteractiveFigure>
      <p>
        <strong>Where they sit.</strong> The gene-poor pericentromeres cover about two thirds of the genome and hold 30% of genes, but
        79% of Gypsy variants, against 43% of non-TE variants (Extended Data Fig. 2). Gypsy variants also avoid genes within the
        gene-rich arms: 10% fall inside genes, against 30% of non-TE variants. Both patterns match earlier work: tomato&apos;s
        pericentromeric heterochromatin is heavily populated by Gypsy-like elements<Ref n={14} />, and in short-read insertion calls
        about 6% of Gypsy insertions fall in genes against about 20% of Copia ones<Ref n={1} />. The avoidance is specific to Gypsy,
        not to transposable elements in general, and in tomato has been attributed to insertion preference rather than selection
        against the copies<Ref n={1} />.
      </p>
      <InteractiveFigure
        n={2}
        label="Extended Data Fig."
        src="/projects/lyco/fig5_distribution.png"
        spec="/projects/lyco/interactive/fig5.json"
        slug="lyco-ed"
        alt="Two panels. a: twelve small plots, one per chromosome, of gene density and variant density along the chromosome, with pericentromeres shaded; Gypsy variants peak inside the shaded pericentromeres, genes and non-TE variants toward the chromosome ends. b: stacked bars of variants inside genes, in promoters, within 10 kb or farther, for Gypsy, other TE and non-TE variants in arms and in pericentromeres; Gypsy is least often genic in both."
        lead="Gypsy variants crowd the pericentromeres and keep away from genes."
      >
        <b>a</b>, Density of genes and of Gypsy, other TE-derived and non-TE variants along each chromosome (1 Mb bins, smoothed over
        3 Mb, each line scaled to its own maximum); grey shading marks the pericentromere. <b>b</b>, Variants by position relative to
        the nearest gene: inside it, within 2 kb upstream, within 10 kb, or farther.
      </InteractiveFigure>
      <p>
        <strong>Chromosome by chromosome.</strong> The same picture holds on every chromosome: repeats are 61–74% of each, and Gypsy
        is three to seven times denser in each pericentromere than in its arms (Extended Data Fig. 3). Chromosome 6 stands apart, with
        the least Gypsy and the most DNA transposon sequence; chromosome 2 has the fewest repeats, partly because its ribosomal-DNA arm
        is poorly assembled. Tomato is diploid, so there are no subgenomes to compare.
      </p>
      <InteractiveFigure
        n={3}
        label="Extended Data Fig."
        src="/projects/lyco/fig7_chromosomes.png"
        spec="/projects/lyco/interactive/fig7.json"
        slug="lyco-ed"
        alt="Two panels. a: for each of the 12 chromosomes, a bar for the share of all repeats (61 to 74%) with markers for Gypsy, DNA transposons and Copia; Gypsy and DNA transposons each sit near 20%, Copia near 7%, with chromosome 6 lowest in Gypsy and highest in DNA transposons. b: for each chromosome, Gypsy's share of sequence in the arms (4 to 11%) joined to its share in the pericentromere (23 to 32%)."
        lead="Every chromosome has the same composition, and the same Gypsy-rich middle."
      >
        <b>a</b>, Share of each chromosome in repeats overall (bars) and in three element classes (markers), one class per base.{" "}
        <b>b</b>, Gypsy&apos;s share of sequence in each chromosome&apos;s arms (open) and pericentromere (filled).
      </InteractiveFigure>
      <p>
        <strong>Near known genes.</strong> For 29 well-studied genes with verified identifiers — fruit colour and size, ripening,
        flavour, plant architecture, disease resistance — every variant within 5 kb was counted (Extended Data Fig. 4).
        Complete-length Copia insertions sit near nine, including SUN, J2, PPEAT and I-3; some match transposable-element alleles
        described before, such as Copia insertions at PPEAT<Ref n={1} /> and J2, and common Copia variants near Ph-3. At SUN, a 4.9 kb
        Copia element present in the reference is missing from 78% of accessions; the well-known SUN elongation allele is a separate
        event, a Rider-driven copy of the gene on another chromosome<Ref n={13} />, which this count does not test. No
        transposable-element variant was found near PSY1; the reported insertion there is carried by only 8 of 548 accessions
        <Ref n={1} />, rare enough to be missing from the graph&apos;s assembled genomes. These are nearby candidates, not causes.
      </p>
      <InteractiveFigure
        n={4}
        label="Extended Data Fig."
        src="/projects/lyco/fig6_trait_genes.png"
        spec="/projects/lyco/interactive/fig6.json"
        slug="lyco-ed"
        alt="Horizontal stacked bars for 29 tomato trait genes showing how many Gypsy, other TE, ambiguous and non-TE variants lie within 5 kb, with green triangles marking Copia variants of at least 4 kb. TomLoxC has the most variants, about 44; complete-length Copia variants appear near SUN, ALMT9, TomLoxC, AAT1, PPEAT, SP, J2, JOINTLESS and I-3."
        lead="Complete-length Copia insertions turn up near many well-studied trait genes."
      >
        Variants within 5 kb of each gene across all 706 accessions, by class. Triangles mark Copia variants of at least 4 kb, the size
        of a complete element; a dagger marks genes with a transposable-element allele reported in the literature. Resistance genes
        whose identifiers could not be verified, or that are absent from the reference, are left out.
      </InteractiveFigure>

      <div className="endmatter">
        <h2>Data availability</h2>
        <p>
          All inputs are published: graph-pangenome SV genotypes and SNPs<Ref n={2} />, short-read TE insertion calls<Ref n={1} />,
          long-read SV calls<Ref n={3} />, and accession metadata<Ref n={4} />. The numbers behind every figure are committed with the
          project and readable on this page (&ldquo;Show the data&rdquo; under each figure); no genotype-level data is redistributed.
        </p>
        <h2>Code availability</h2>
        <p>
          The analysis repository is private. The protocol — questions, eligibility, decision rules, thresholds and seeds — is
          summarized here and recorded in full in the project&apos;s stage documents; the pre-registration framework it follows
          (topos) has its own write-up on this site.
        </p>
        <h2>Pre-registration statement</h2>
        <p>
          Pre-registered means committed to the project&apos;s own repository before scoring, not lodged with an external registry.
          Four pre-registrations to date: the trait question (stopped by its own power check before scoring), the genotyping gate, the
          history questions, and the element-versus-region test; a fifth, on introgression, is at sign-off. Analysis grids were frozen
          and hashed (SHA-256) before results; every question was scored once; the checks that stopped the first design, and a
          discovery-bias check specified before it ran, are reported above. Deviations are logged in the stage documents.
        </p>
        <h2>Competing interests</h2>
        <p>None.</p>
      </div>

      <h2 id="references">References</h2>
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
        <li>Wang Y, Tang X, Cheng Z, Mueller L, Giovannoni J, Tanksley SD. Euchromatin and pericentromeric heterochromatin: comparative composition in the tomato genome. <em>Genetics</em> 172, 2529–2540 (2006). <a href="https://doi.org/10.1534/genetics.106.055772">doi:10.1534/genetics.106.055772</a>.</li>
      </ol>
    </>
  );
}
