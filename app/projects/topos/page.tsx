export const metadata = { title: "topos. — shel." };

export default function ToposPage() {
  return (
    <>
      <span className="kicker">Framework — 2025–</span>
      <h1>topos.</h1>
      <p className="tagline">
        A stability-certified protocol for deciding when latent structure in high-dimensional biological data is real enough to act on.
      </p>

      <h2>Why this exists</h2>
      <p>
        High-dimensional biological analysis has a well-known failure mode: embed, cluster, find something that looks structured, and
        interpret it. Nonlinear methods are very good at finding <em>a</em> structure, and offer no built-in signal for whether that
        structure would survive a different seed, preprocessing choice, or equally defensible embedding. topos treats &ldquo;is this
        structure real&rdquo; as a certification problem rather than a modeling choice.
      </p>

      <h2>Approach</h2>
      <p>
        An eight-stage protocol, each stage gating entry into the next: data landscape audit, structural plausibility, methodological gap
        analysis, nonlinear structure certification, robustness stress testing, cross-modal validation, representation-space agreement, and
        a final value audit issuing an explicit go/kill/hold decision. Matched-model comparison, density-aware validation, and mandatory
        confound auditing run throughout. Heavy compute — genome foundation model embeddings, long-context reasoning — is evidence-gated:
        conditional on a candidate structure surviving the earlier, cheaper stages first.
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
            <td>Octoploid strawberry</td>
            <td>0 run three times; GO, holds across sensitivities</td>
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
        Only fragaria has run anything, and only Stage 0. That is by design — projects stay at the cheap, falsifiable stages until they
        have earned the expensive ones — but it also means topos has no biological finding of its own yet.
      </p>

      <h2>What the first case study taught the protocol</h2>
      <p>
        fragaria&apos;s first Stage 0 returned GO, and an audit found it invalid. Its missing calls were never decoded, three rubric
        criteria passed by construction, and the pipeline that won was chosen by the same metric that made it look perfect. Two
        pre-registered rebuilds followed; the second, on accessions pruned to no relatives, returns a GO that holds across sensitivity
        runs, for structure that PCA and UMAP agree on exactly wherever both cluster. The rules that came out of it now belong to the
        protocol rather than to one case study:
      </p>
      <ul>
        <li>Missing-value codes are declared and decoded at load, and a declared-missing value surviving into the analysis is an error.</li>
        <li>
          Stability comes from resampling the data. Agreement across seeds says nothing about a deterministic pipeline, where it is
          perfect by construction.
        </li>
        <li>
          A confound with no variance is untestable and blocks a GO, and external coherence is never defined as the confound result.
        </li>
        <li>
          Parameter grids are deduplicated before a rule counts settings, and missingness is tested within groups when it may be
          biological, as array ascertainment made it in strawberry.
        </li>
        <li>
          Relatedness is capped with a structure-robust kinship estimator. The standard relationship matrix read population structure
          as kinship, and pruning with it would have removed almost all of the diverse accessions.
        </li>
        <li>
          Non-redundancy is measured on the rows both pipelines cluster. Over all rows, fragaria&apos;s linear and nonlinear partitions
          disagreed (ARI 0.68); on the rows both clustered they were identical. The difference was coverage, not structure.
        </li>
      </ul>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Implemented (Stage 0 checks).</strong> Eight stage specifications and a tested Python package (27 tests) whose modules
        enforce the rules above: loading, stability, confounds, kinship, grids, matched comparison and the decision record. veridian&apos;s
        Explore already uses it to choose a cluster count. Next: fragaria&apos;s own scripts move onto it, and Stage 3&apos;s certification
        gets built when a case study reaches it.
      </p>
    </>
  );
}
