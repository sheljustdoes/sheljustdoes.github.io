import Ref from "../Ref";

export const metadata = { title: "topos. — shel." };

export default function ToposPage() {
  return (
    <>
      <span className="kicker">Framework — topos · 2025–</span>
      <h1>A gated protocol decides when latent structure in biological data has earned enough evidence to act on</h1>
      <p className="byline">
        Shel Burkes, PhD<span className="sep">·</span>First committed 21 February 2026<span className="sep">·</span>Last revised 27
        September 2026<span className="sep">·</span>Implemented (Stage 0 checks)
      </p>

      <div className="abstract">
        <span className="abstract-label">Abstract</span>
        High-dimensional biological analysis has a well-known failure mode: embed the data, cluster it, find something that looks
        structured, and interpret it. Nonlinear methods are very good at finding <em>a</em> structure, and offer no built-in signal for
        whether that structure would survive a different sample, preprocessing choice, or equally defensible embedding. The individual
        remedies — stability under resampling, confound auditing, structure-robust kinship — are established, but nothing combines them
        into a decision. Here we describe topos, an eight-stage protocol that treats &ldquo;is this structure real&rdquo; as a
        certification problem rather than a modeling choice: each stage gates entry into the next, each stage&apos;s rules are written
        down before its data is analysed, and a final value audit issues an explicit GO/KILL/HOLD verdict. Stability under resampling is
        a necessary gate, never a sufficient one, and heavy compute is conditional on a candidate structure surviving the cheaper stages
        first. In its first case study, on strawberry, the protocol invalidated its own first GO on audit, then closed the
        nonlinear-structure question with a KILL: the stable structure was real, and a linear embedding found it. A protocol built to
        make kills cheap has, so far, delivered exactly that.
      </div>

      <p>
        High-dimensional biological analysis has a well-known failure mode: embed, cluster, find something that looks structured, and
        interpret it<Ref n={[10, 13]} />. Nonlinear methods are very good at finding <em>a</em> structure, and offer no built-in signal
        for whether that structure would survive a different sample, preprocessing choice, or equally defensible embedding
        <Ref n={[1, 2, 3]} />.
      </p>
      <p>
        The pieces of an answer exist. Assessing whether a clustering is stable under resampling of the data is well established
        <Ref n={[1, 2, 3, 4]} />, with the adjusted Rand index<Ref n={5} /> as a standard agreement measure. In population genetics PCA
        remains the linear baseline<Ref n={[6, 7]} />; UMAP and HDBSCAN have been applied to large genotype cohorts
        <Ref n={[8, 9, 11]} />, and both low-dimensional embeddings and STRUCTURE-style bar plots are known to invite
        over-interpretation<Ref n={[10, 13]} />. Genotype-specific artefacts are known too: batch effects and differential missingness
        create spurious structure<Ref n={[14, 15]} />, array ascertainment biases diversity estimates<Ref n={16} />, and ordinary
        relationship estimates confuse population structure with kinship, which KING&apos;s robust estimator corrects<Ref n={12} />.
        The closest existing tool, CARVE<Ref n={20} />, selects a clustering from a grid by resampling; it does not issue a go/kill
        decision, audit confounds, or compare matched linear and nonlinear pipelines.
      </p>
      <p>
        topos adds no new statistics. It combines these checks with pre-registration<Ref n={18} /> and the stability principle of
        veridical data science<Ref n={19} /> into a gated protocol with an explicit decision, treating &ldquo;is this structure
        real&rdquo; as a certification problem rather than a modeling choice (Box 1).
      </p>

      <aside className="box">
        <span className="box-lead">Box 1 | The verdict vocabulary</span>
        <p>
          topos is where these terms are defined; its case studies and the write-ups that follow the protocol use them without further
          gloss. A <strong>stage</strong> is one of eight fixed steps, each gating entry into the next, with its rules written down
          before its data is analysed. <strong>GO / KILL / HOLD</strong> are the verdicts a gate issues: proceed to the next stage,
          stop — the question is closed — or wait on a pre-stated criterion. <strong>Stability</strong> is agreement between partitions
          of resampled data, scored as the adjusted Rand index (ARI); it is necessary for a GO, never sufficient, since a wrong
          partition can be perfectly stable. A <strong>matched-model comparison</strong> runs matched linear and nonlinear pipelines on
          the same question, so a structure a nonlinear method finds is always checked against what a linear one finds. A <strong>confound audit</strong>{" "}
          tests whether the candidate structure is explained by something other than biology, and a confound that cannot be tested
          blocks a GO.
        </p>
      </aside>

      <h2>Eight stages order the evidence from cheap to expensive</h2>
      <p>
        The protocol runs eight stages, each gating entry into the next: data landscape audit, structural plausibility, methodological
        gap analysis, nonlinear structure certification, robustness stress testing, cross-modal validation, representation-space
        agreement, and a final value audit issuing an explicit go/kill/hold decision. Matched-model comparison, density-aware
        validation, and mandatory confound auditing<Ref n={[14, 15]} /> run throughout. Each stage&apos;s rules are written down before
        its data is analysed<Ref n={18} />, in the spirit of the stability and documentation principles of veridical data science
        <Ref n={19} />. Heavy compute — genome foundation model embeddings, long-context reasoning — is evidence-gated: conditional on
        a candidate structure surviving the earlier, cheaper stages first.
      </p>

      <h2>One case study has run, and it killed its own question</h2>
      <p>
        <strong>Table 1 | Where the case studies stand.</strong>
      </p>
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
        Only fragaria has run anything (Table 1). It passed Stage 0 and then answered its structural question in the negative: across
        three panels, the stable structure was real and a linear embedding found it. That is the protocol working as intended, since a
        kill at a cheap stage is its purpose, but it means topos still has no nonlinear biological finding of its own.
      </p>

      <h2>An invalid first run rewrote the protocol&apos;s rules</h2>
      <p>
        fragaria&apos;s first Stage 0 returned GO, and an audit found it invalid. Its missing calls were never decoded, three rubric
        criteria passed by construction, and the pipeline that won was chosen by the same metric that made it look perfect. Two
        pre-registered rebuilds followed; the second, on accessions pruned to no relatives, returns a GO that holds across sensitivity
        runs, for structure that PCA<Ref n={[6, 7]} /> and UMAP with HDBSCAN<Ref n={[8, 11]} /> agree on exactly wherever both cluster.
        The rules that came out of it now belong to the protocol rather than to one case study:
      </p>
      <ul>
        <li>
          Missing-value codes are declared and decoded at load, and a declared-missing value surviving into the analysis is an error:
          differential missingness is a known source of spurious structure<Ref n={[14, 15]} />.
        </li>
        <li>
          Stability comes from resampling the data<Ref n={[1, 2, 4]} />, scored as the adjusted Rand index between resampled partitions
          <Ref n={5} />. Agreement across seeds says nothing about a deterministic pipeline, where it is perfect by construction.
          Stability is necessary, not sufficient: a wrong partition can be perfectly stable<Ref n={3} />.
        </li>
        <li>
          A confound with no variance is untestable and blocks a GO, and external coherence is never defined as the confound result.
          Associations are scored with Cramér&apos;s V and a permutation test; the uncorrected V runs high in small samples
          <Ref n={17} />, so the permutation p, not V, carries the decision.
        </li>
        <li>
          Parameter grids are deduplicated before a rule counts settings, and missingness is tested within groups when it may be
          biological, as array ascertainment<Ref n={16} /> made it in strawberry.
        </li>
        <li>
          Relatedness is capped with a structure-robust kinship estimator<Ref n={12} />. The standard relationship matrix read
          population structure as kinship, and pruning with it would have removed almost all of the diverse accessions.
        </li>
        <li>
          Non-redundancy is measured on the rows both pipelines cluster, with coverage reported beside it. Over all rows,
          fragaria&apos;s linear and nonlinear partitions disagreed (ARI 0.68); on the rows both clustered they were identical. The
          difference was coverage, not structure, though the rows both methods cluster are also the easiest to separate, which is why
          coverage is reported too.
        </li>
      </ul>

      <h2>Discussion</h2>
      <p>
        topos is a certification protocol, and what its first certification produced was a kill: in strawberry the stable structure
        was real, a linear embedding found it, and the nonlinear-structure question was closed at a cheap stage. That is the
        intended behaviour — the protocol exists to make kills cheap and GOs earned — but it also fixes the honest bound on what topos
        has shown: it has certified rigour, not yet a nonlinear biological finding of its own. The invalid first GO is part of the same
        account. It was caught by audit, not by the metric that produced it, and each of its failure modes — undecoded missing values,
        criteria passed by construction, a pipeline selected by its own success metric — was converted into a standing rule rather than
        a one-off fix.
      </p>
      <p>
        The protocol&apos;s scope is currently narrower than its specification. Eight stage specifications exist, but the tested Python
        package (27 tests) implements the Stage 0 checks: its modules enforce the rules above — loading, stability, confounds, kinship,
        grids, matched comparison and the decision record. fragaria&apos;s scored stages run on the package, and the port reproduces
        every committed Stage 0 result byte for byte. Use has begun to spread beyond its own case studies: veridian&apos;s Explore uses
        the package to choose a cluster count.
      </p>
      <p>
        What comes next is set by the case studies, not the framework: glyma and sorghum have their early stages specified and not yet
        run (Table 1), and Stage 3&apos;s nonlinear-structure certification gets built when a case study reaches it.
      </p>

      <div className="endmatter">
        <h2>Code availability</h2>
        <p>
          The topos repository is private; this write-up is its public account. The stage specifications and the standing rules above
          summarize the protocol, and the case studies that run on it report their results in their own write-ups, beginning with{" "}
          <a href="/projects/fragaria/">fragaria</a>.
        </p>
        <h2>Competing interests</h2>
        <p>None.</p>
      </div>

      <h2 id="references">References</h2>
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
