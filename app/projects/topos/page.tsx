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

      <h2>Key results</h2>
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
            <td>fragaria</td>
            <td>Octoploid strawberry</td>
            <td>0 (complete)</td>
          </tr>
          <tr>
            <td>glyma</td>
            <td>Soybean (SoySNP50K)</td>
            <td>0 complete, 1 in progress</td>
          </tr>
          <tr>
            <td>sorghum</td>
            <td>Sorghum (TIP analysis)</td>
            <td>0 complete, 1 in progress</td>
          </tr>
        </tbody>
      </table>
      <p>
        None of the three has reached later stages yet, and that&apos;s intentional rather than a gap — the protocol is designed to keep
        projects at the cheap, falsifiable, kill-or-continue stages until they&apos;ve earned the right to more expensive ones. The
        generalizable result so far: the same eight-stage protocol applies unmodified to a polyploid crop genome, a diploid crop genome, and
        a transposable-element analysis in a third species, without needing to be reinvented per organism.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Framework active and stable.</strong> Case studies are early-stage by design; results above describe protocol validation,
        not yet biological findings.
      </p>
    </>
  );
}
