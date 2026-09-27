export const metadata = { title: "topos. — shel." };

export default function ToposPage() {
  return (
    <>
      <span className="kicker">Framework — 2025–</span>
      <h1>topos.</h1>
      <p className="tagline">
        A protocol for deciding when latent structure in high-dimensional biological data has earned enough evidence to act on, with
        stability under resampling as a necessary gate, not a sufficient one.
      </p>

      <h2>Why this exists</h2>
      <p>
        High-dimensional biological analysis has a well-known failure mode: embed, cluster, find something that looks structured, and
        interpret it [10, 13]. Nonlinear methods are very good at finding <em>a</em> structure, and offer no built-in signal for whether that
        structure would survive a different sample, preprocessing choice, or equally defensible embedding [1–3]. topos treats &ldquo;is
        this structure real&rdquo; as a certification problem rather than a modeling choice.
      </p>

      <h2>Approach</h2>
      <p>
        An eight-stage protocol, each stage gating entry into the next: data landscape audit, structural plausibility, methodological gap
        analysis, nonlinear structure certification, robustness stress testing, cross-modal validation, representation-space agreement, and
        a final value audit issuing an explicit go/kill/hold decision. Matched-model comparison, density-aware validation, and mandatory
        confound auditing [14, 15] run throughout. Each stage&apos;s rules are written down before its data is analysed [18], in the spirit
        of the stability and documentation principles of veridical data science [19]. Heavy compute — genome foundation model embeddings,
        long-context reasoning — is evidence-gated: conditional on a candidate structure surviving the earlier, cheaper stages first.
      </p>

      <h2>Where the case studies stand</h2>
      <table>
        <thead>
          <tr>
            <th>Case study</th>
            <th>Organism</th>
            <th>Stage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <a href="/projects/fragaria/">fragaria</a>
            </td>
            <td>Strawberry, cultivated and wild</td>
            <td>0 GO; nonlinear-structure question closed (KILL) on two wild panels; crossing value reported; paused</td>
          </tr>
          <tr>
            <td>glyma</td>
            <td>Soybean (SoySNP50K)</td>
            <td>0 specified, not yet run</td>
          </tr>
          <tr>
            <td>sorghum</td>
            <td>Sorghum (TIP analysis)</td>
            <td>0–1 specified, not yet run</td>
          </tr>
        </tbody>
      </table>
      <p>
        Only fragaria has run anything. It passed Stage 0 and then answered its structural question in the negative: across three panels,
        the stable structure was real and a linear embedding found it. That is the protocol working as intended, since a kill at a cheap
        stage is its purpose, but it means topos still has no nonlinear biological finding of its own.
      </p>

      <h2>What the first case study taught the protocol</h2>
      <p>
        fragaria&apos;s first Stage 0 returned GO, and an audit found it invalid. Its missing calls were never decoded, three rubric
        criteria passed by construction, and the pipeline that won was chosen by the same metric that made it look perfect. Two
        pre-registered rebuilds followed; the second, on accessions pruned to no relatives, returns a GO that holds across sensitivity
        runs, for structure that PCA [6, 7] and UMAP with HDBSCAN [8, 11] agree on exactly wherever both cluster. The rules that came out of it
        now belong to the protocol rather than to one case study:
      </p>
      <ul>
        <li>
          Missing-value codes are declared and decoded at load, and a declared-missing value surviving into the analysis is an error:
          differential missingness is a known source of spurious structure [14, 15].
        </li>
        <li>
          Stability comes from resampling the data [1, 2, 4], scored as the adjusted Rand index between resampled partitions [5]. Agreement
          across seeds says nothing about a deterministic pipeline, where it is perfect by construction. Stability is necessary, not
          sufficient: a wrong partition can be perfectly stable [3].
        </li>
        <li>
          A confound with no variance is untestable and blocks a GO, and external coherence is never defined as the confound result.
          Associations are scored with Cramér&apos;s V and a permutation test; the uncorrected V runs high in small samples [17], so the
          permutation p, not V, carries the decision.
        </li>
        <li>
          Parameter grids are deduplicated before a rule counts settings, and missingness is tested within groups when it may be
          biological, as array ascertainment [16] made it in strawberry.
        </li>
        <li>
          Relatedness is capped with a structure-robust kinship estimator [12]. The standard relationship matrix read population structure
          as kinship, and pruning with it would have removed almost all of the diverse accessions.
        </li>
        <li>
          Non-redundancy is measured on the rows both pipelines cluster, with coverage reported beside it. Over all rows, fragaria&apos;s
          linear and nonlinear partitions disagreed (ARI 0.68); on the rows both clustered they were identical. The difference was
          coverage, not structure, though the rows both methods cluster are also the easiest to separate, which is why coverage is
          reported too.
        </li>
      </ul>

      <h2>Related work</h2>
      <p>
        Assessing whether a clustering is stable under resampling of the data is well established [1–4], with the adjusted Rand index [5]
        as a standard agreement measure. In population genetics PCA remains the linear baseline [6, 7]; UMAP and HDBSCAN have been applied to
        large genotype cohorts [8, 9, 11], and both low-dimensional embeddings and STRUCTURE-style bar plots are known to invite
        over-interpretation [10, 13]. Genotype-specific artefacts are known too: batch effects and differential missingness create spurious
        structure [14, 15], array ascertainment biases diversity estimates [16], and ordinary relationship estimates confuse population
        structure with kinship, which KING&apos;s robust estimator corrects [12]. topos does not add new statistics. It combines these checks
        with pre-registration [18] and the stability principle of veridical data science [19] into a gated protocol with an explicit
        decision. The closest existing tool, CARVE [20], selects a clustering from a grid by resampling; it does not issue a go/kill
        decision, audit confounds, or compare matched linear and nonlinear pipelines.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Implemented (Stage 0 checks).</strong> Eight stage specifications and a tested Python package (27 tests) whose modules
        enforce the rules above: loading, stability, confounds, kinship, grids, matched comparison and the decision record. fragaria&apos;s
        scored stages run on the package, and the port reproduces every committed Stage 0 result byte for byte. veridian&apos;s Explore uses
        it to choose a cluster count. Stage 3&apos;s certification gets built when a case study reaches it.
      </p>

      <h2>References</h2>
      <ol className="references">
        <li>Ben-Hur A, Elisseeff A, Guyon I. A stability based method for discovering structure in clustered data. <em>Pacific Symposium on Biocomputing</em> 7, 6–17 (2002). <a href="https://doi.org/10.1142/9789812799623_0002">doi:10.1142/9789812799623_0002</a>.</li>
        <li>Lange T, Roth V, Braun ML, et al. Stability-based validation of clustering solutions. <em>Neural Computation</em> 16, 1299–1323 (2004). <a href="https://doi.org/10.1162/089976604773717621">doi:10.1162/089976604773717621</a>.</li>
        <li>von Luxburg U. Clustering stability: an overview. <em>Foundations and Trends in Machine Learning</em> 2, 235–274 (2010). <a href="https://doi.org/10.1561/2200000008">doi:10.1561/2200000008</a>.</li>
        <li>Hennig C. Cluster-wise assessment of cluster stability. <em>Computational Statistics &amp; Data Analysis</em> 52, 258–271 (2007). <a href="https://doi.org/10.1016/j.csda.2006.11.025">doi:10.1016/j.csda.2006.11.025</a>.</li>
        <li>Hubert L, Arabie P. Comparing partitions. <em>Journal of Classification</em> 2, 193–218 (1985). <a href="https://doi.org/10.1007/BF01908075">doi:10.1007/BF01908075</a>.</li>
        <li>Patterson N, Price AL, Reich D. Population structure and eigenanalysis. <em>PLoS Genetics</em> 2, e190 (2006). <a href="https://doi.org/10.1371/journal.pgen.0020190">doi:10.1371/journal.pgen.0020190</a>.</li>
        <li>Novembre J, Johnson T, Bryc K, et al. Genes mirror geography within Europe. <em>Nature</em> 456, 98–101 (2008). <a href="https://doi.org/10.1038/nature07331">doi:10.1038/nature07331</a>.</li>
        <li>Diaz-Papkovich A, Anderson-Trocmé L, Ben-Eghan C, et al. UMAP reveals cryptic population structure and phenotype heterogeneity in large genomic cohorts. <em>PLoS Genetics</em> 15, e1008432 (2019). <a href="https://doi.org/10.1371/journal.pgen.1008432">doi:10.1371/journal.pgen.1008432</a>.</li>
        <li>Diaz-Papkovich A, Zabad S, Snell H, et al. Topological stratification of continuous genetic variation in large biobanks. <em>PLoS Genetics</em> 22, e1012068 (2026). <a href="https://doi.org/10.1371/journal.pgen.1012068">doi:10.1371/journal.pgen.1012068</a>.</li>
        <li>Chari T, Pachter L. The specious art of single-cell genomics. <em>PLoS Computational Biology</em> 19, e1011288 (2023). <a href="https://doi.org/10.1371/journal.pcbi.1011288">doi:10.1371/journal.pcbi.1011288</a>.</li>
        <li>Campello RJGB, Moulavi D, Sander J. Density-based clustering based on hierarchical density estimates. <em>Advances in Knowledge Discovery and Data Mining (PAKDD)</em>, LNCS 7819, 160–172 (2013). <a href="https://doi.org/10.1007/978-3-642-37456-2_14">doi:10.1007/978-3-642-37456-2_14</a>.</li>
        <li>Manichaikul A, Mychaleckyj JC, Rich SS, et al. Robust relationship inference in genome-wide association studies. <em>Bioinformatics</em> 26, 2867–2873 (2010). <a href="https://doi.org/10.1093/bioinformatics/btq559">doi:10.1093/bioinformatics/btq559</a>.</li>
        <li>Lawson DJ, van Dorp L, Falush D. A tutorial on how not to over-interpret STRUCTURE and ADMIXTURE bar plots. <em>Nature Communications</em> 9, 3258 (2018). <a href="https://doi.org/10.1038/s41467-018-05257-7">doi:10.1038/s41467-018-05257-7</a>.</li>
        <li>Leek JT, Scharpf RB, Bravo HC, et al. Tackling the widespread and critical impact of batch effects in high-throughput data. <em>Nature Reviews Genetics</em> 11, 733–739 (2010). <a href="https://doi.org/10.1038/nrg2825">doi:10.1038/nrg2825</a>.</li>
        <li>Clayton DG, Walker NM, Smyth DJ, et al. Population structure, differential bias and genomic control in a large-scale, case-control association study. <em>Nature Genetics</em> 37, 1243–1246 (2005). <a href="https://doi.org/10.1038/ng1653">doi:10.1038/ng1653</a>.</li>
        <li>Albrechtsen A, Nielsen FC, Nielsen R. Ascertainment biases in SNP chips affect measures of population divergence. <em>Molecular Biology and Evolution</em> 27, 2534–2547 (2010). <a href="https://doi.org/10.1093/molbev/msq148">doi:10.1093/molbev/msq148</a>.</li>
        <li>Bergsma W. A bias-correction for Cramér&apos;s V and Tschuprow&apos;s T. <em>Journal of the Korean Statistical Society</em> 42, 323–328 (2013). <a href="https://doi.org/10.1016/j.jkss.2012.10.002">doi:10.1016/j.jkss.2012.10.002</a>.</li>
        <li>Nosek BA, Ebersole CR, DeHaven AC, et al. The preregistration revolution. <em>Proceedings of the National Academy of Sciences</em> 115, 2600–2606 (2018). <a href="https://doi.org/10.1073/pnas.1708274114">doi:10.1073/pnas.1708274114</a>.</li>
        <li>Yu B, Kumbier K. Veridical data science. <em>Proceedings of the National Academy of Sciences</em> 117, 3920–3929 (2020). <a href="https://doi.org/10.1073/pnas.1901326117">doi:10.1073/pnas.1901326117</a>.</li>
        <li>Wycik KR, Tang TM, Zikry TM, et al. Cluster analysis with resampling for validation and exploration (CARVE). arXiv 2606.00327 (2026, preprint). <a href="https://doi.org/10.48550/arXiv.2606.00327">doi:10.48550/arXiv.2606.00327</a>.</li>
      </ol>
    </>
  );
}
