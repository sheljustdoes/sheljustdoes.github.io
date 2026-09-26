export const metadata = { title: "noul. — shel." };

export default function NoulPage() {
  return (
    <>
      <span className="kicker">Project — 2026–</span>
      <h1>noul.</h1>
      <p className="tagline">
        Local, non-generative code search: typed scores in a single pass instead of an agent reading files, with nothing leaving the
        machine. It puts a right file in the top three for 34 of 35 queries, against 29 for keyword search, in about two seconds. At top-1
        its lead is three queries, too few to call.
      </p>

      <h2>Why this exists</h2>
      <p>
        A coding agent answers &ldquo;where is the thing that does X&rdquo; by reading files into its context, and every file it reads is
        re-sent with every later turn. TypeSafe&apos;s Jev points at an alternative: a model that returns typed, calibrated numbers
        instead of prose, in one forward pass. Jev is API-only and its architecture is unpublished. noul asks how much of that shape can
        be rebuilt from open models running locally, with no text generation and no code sent anywhere.
      </p>

      <h2>Approach</h2>
      <p>
        <code>find</code> ranks files by how well they match a plain-language description, including descriptions whose words never
        appear in the code. Files are cut into overlapping 40-line chunks; notebooks are read as code and markdown, without outputs. A
        file scores as its best chunk.
      </p>
      <p>
        It runs in two stages. BM25 and a 33M-parameter embedding model (bge-small), fused by reciprocal rank, shortlist 20 chunks. A
        568M-parameter cross-encoder (bge-reranker-v2-m3) then reads the query against only those 20. The reranker is the only model that
        sees query and code together, which is what lets it match meaning rather than words, and it is also the only expensive step. The
        shortlist exists to keep it off every chunk in the repository.
      </p>

      <h2>How it was measured</h2>
      <p>
        Two small codebases: a JavaScript web application (60 files) and <a href="/projects/iridis/">iridis</a>, a Python and notebook
        research codebase with scientific vocabulary. 41 queries in all. 35 are answerable, and 12 of those are &ldquo;gap&rdquo;
        queries whose key words do not appear in the code. The other six describe features that do not exist, to test whether a scorer
        can say &ldquo;not here&rdquo;. Each answerable query lists every file that would be a fair top answer. The measures are
        precision at 1 (the first file is right) and recall at 3 (a right file is in the top three).
      </p>
      <p>
        <strong>Who wrote the labels matters.</strong> Claude drafted them against the source. Three were widened after the first run,
        when the scorers found defensible answers the labels had missed; one of those turned up a real duplication in iridis, two
        separate implementations of the same skin-color extraction. Those three, and the two queries that accept several files, were
        then reviewed by a person and accepted as they stand. The other 36 are still as drafted. The two-stage default was chosen on
        these same queries, so its edge over its near neighbors is not a finding.
      </p>

      <h2>What it found</h2>
      <p>First, on the labels as originally drafted:</p>
      <table>
        <thead>
          <tr>
            <th>Pipeline</th>
            <th>P@1</th>
            <th>R@3</th>
            <th>Seconds per query</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>BM25 alone</td>
            <td>0.63 (22/35)</td>
            <td>0.80 (28/35)</td>
            <td>&lt; 0.01</td>
          </tr>
          <tr>
            <td>Reranker over every chunk</td>
            <td>0.66 (23/35)</td>
            <td>0.94 (33/35)</td>
            <td>6.7–25.6</td>
          </tr>
          <tr>
            <td>Two-stage</td>
            <td>0.69 (24/35)</td>
            <td>0.94 (33/35)</td>
            <td>2.2–2.3</td>
          </tr>
        </tbody>
      </table>
      <p>Then, rerun on the reviewed labels, with the code and corpus unchanged:</p>
      <table>
        <thead>
          <tr>
            <th>Pipeline</th>
            <th>P@1</th>
            <th>R@3</th>
            <th>Seconds per query</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>BM25 alone</td>
            <td>0.69 (24/35)</td>
            <td>0.83 (29/35)</td>
            <td>&lt; 0.01</td>
          </tr>
          <tr>
            <td>Two-stage</td>
            <td>0.77 (27/35)</td>
            <td>0.97 (34/35)</td>
            <td>2.1</td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>At top-1, the lead is too small to call.</strong> Two-stage is ahead of keyword search by two queries on the original
        labels and three on the reviewed ones, out of 35, which is noise at this sample size. An earlier lead for the big reranker on the
        web application did not replicate on iridis, where a 22M model did best.
      </p>
      <p>
        <strong>The replicated gain is the shortlist.</strong> On both codebases, the reranker puts a right file in the top three for 33
        of 35 queries against 28 for BM25, and 34 against 29 on the reviewed labels. That points to its role: a reranker over a shortlist, not a top-1 oracle.
      </p>
      <p>
        <strong>The two-stage pipeline keeps that gain at a fraction of the cost.</strong> Reranking every chunk costs about 0.1 s per
        chunk, 25.6 s a query on the larger codebase. Every shortlist tested kept recall at three unchanged, and the default brings a
        query to 2.3 s: a tenth of the brute-force time on the larger codebase, a third on the smaller.
      </p>
      <p>
        <strong>It cannot say &ldquo;not here&rdquo;.</strong> On each codebase, two or three answerable queries score below the
        strongest query for a feature that does not exist, and the cut-off sits at a different score in each. Raw reranker scores are
        not probabilities. Turning them into probabilities is calibration, the Jev-like part still to build.
      </p>

      <h2>Limits</h2>
      <p>
        Both codebases are small, 60 and 9 files. The shortlist of 20 chunks is 8% of one and 31% of the other, so it has not had to prove
        itself on a repository where it discards almost everything. 35 queries is a small sample, and 36 of the 41 labels are still
        unreviewed.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed, for <code>find</code> only.</strong> The two-stage pipeline, the benchmark runners, both label sets
        and every per-query result are committed. A Claude Code skill already fronts it with a small-model agent, which the local scorer
        is meant to replace for all but ambiguous cases.
      </p>
      <p>
        Next: the remaining labels reviewed, then a large open-source repository, calibration so
        &ldquo;not here&rdquo; becomes a probability, and the per-file yes/no <code>ask</code> mode. The agent it would replace will
        be scored on the same labels, so that comparison becomes a measurement rather than an anecdote.
      </p>
    </>
  );
}
