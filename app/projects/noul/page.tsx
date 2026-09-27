import Figure from "../Figure";

export const metadata = { title: "noul. — shel." };

export default function NoulPage() {
  return (
    <>
      <span className="kicker">Project — 2026–</span>
      <h1>noul.</h1>
      <p className="tagline">
        Local, non-generative code search: typed scores in a single pass instead of an agent reading files, with nothing leaving the
        machine. Every single-file answer lands in its top five, in about two seconds. Answers that span several files come back
        complete less often than with plain keyword search, and that is the next thing to fix.
      </p>

      <h2>Why this exists</h2>
      <p>
        A coding agent answers &ldquo;where is the thing that does X&rdquo; by reading files into its context, turn by turn [5, 6, 8], and
        every file it reads is re-sent with every later turn. TypeSafe&apos;s Jev points at an alternative: a model that returns typed, calibrated numbers
        instead of prose, in one forward pass. Jev is API-only and its architecture is unpublished. noul asks how much of that shape can
        be rebuilt from open models running locally, with no text generation and no code sent anywhere.
      </p>

      <h2>Approach</h2>
      <p>
        <code>find</code> ranks files by how well they match a plain-language description, including descriptions whose words never
        appear in the code, the task semantic code search benchmarks measure [1–3]. Files are cut into overlapping 40-line chunks; notebooks are read as code and markdown, without outputs. A
        file scores as its best chunk.
      </p>
      <p>
        It runs in two stages. BM25 [9] and a 33M-parameter embedding model (bge-small [10]), fused by reciprocal rank [11], shortlist 20 chunks. A
        568M-parameter cross-encoder (bge-reranker-v2-m3, built on the M3 backbone [12]) then reads the query against only those 20. The reranker is the only model that
        sees query and code together, which is what lets it match meaning rather than words, and it is also the only expensive step. The
        shortlist exists to keep it off every chunk in the repository: the standard retrieve-then-rerank design [13].
      </p>

      <h2>How it was measured</h2>
      <p>
        Two small codebases: a JavaScript web application (60 files) and <a href="/projects/iridis/">iridis</a>, a Python and notebook
        research codebase with scientific vocabulary. 41 queries in all. 35 are answerable, and 12 of those are &ldquo;gap&rdquo;
        queries whose key words do not appear in the code. The other six describe features that do not exist, to test whether a scorer
        can say &ldquo;not here&rdquo;. Each answerable query lists every file that would be a fair top answer. The measures are
        precision at 1 (the first file is right) and recall at 3 (a right file is in the top three), as in code retrieval benchmarks [1, 4].
      </p>
      <p>
        <strong>Who wrote the labels matters.</strong> Claude drafted them against the source. Three were widened after the first run,
        when the scorers found defensible answers the labels had missed; one of those turned up a real duplication in iridis, two
        separate implementations of the same skin-color extraction. None of the 41 labels has been independently verified: they are
        Claude&apos;s reading of the code. The two-stage default was chosen on these same queries, so its edge over its near neighbors is
        not a finding.
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
      <p>Then, rerun on the current labels (with the three widenings), code and corpus unchanged:</p>
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
        labels and three on the current ones, out of 35, which is noise at this sample size. An earlier lead for the big reranker on the
        web application did not replicate on iridis, where a 22M model did best.
      </p>
      <p>
        <strong>The replicated gain is the shortlist.</strong> On both codebases, the reranker puts a right file in the top three for 33
        of 35 queries against 28 for BM25, and 34 against 29 on the current labels. That points to its role: a reranker over a shortlist, not a top-1 oracle.
      </p>
      <p>
        <strong>The two-stage pipeline keeps that gain at a fraction of the cost.</strong> Reranking every chunk costs about 0.1 s per
        chunk, 25.6 s a query on the larger codebase. Every shortlist tested kept recall at three unchanged, and the default brings a
        query to 2.3 s: a tenth of the brute-force time on the larger codebase, a third on the smaller.
      </p>
      <p>
        <strong>On a strict rule, multi-file answers are the weakness.</strong> The measures above count a query as right if <em>any</em>
        correct file appears. Counting it only when <em>every</em> correct file is in the top five, every single-file query passes (26 of
        26), but only 4 of the 9 queries with several correct files do, fewer than keyword search (5) and brute force (6). The shortlist
        keeps the best 20 chunks, which tend to come from one dominant file, so secondary files never reach the reranker. A
        pre-registered [15] fix spread the shortlist across files, in the spirit of diversity-based reranking [14]: on these queries it lifted multi-file completeness from 4 to 6 of 9, but
        on a fresh held-out codebase, labelled before noul ever ran on it with every label backed by a cited line, it made no
        difference (16 of 17 complete either way). The default stays as it was. The one held-out miss was a source file pushed out of
        the top five by test files that mention the same functions, which is what gets measured next.
      </p>
      <Figure
        n={1}
        src="/projects/noul/fig1_find.png"
        alt="Three panels showing the share of queries with every correct file in the top five, split into single-file and multi-file answers. a: on 35 development queries, BM25 22 of 26 single and 5 of 9 multi; reranking every chunk 26 of 26 and 6 of 9; two-stage 26 of 26 and 4 of 9. b: shortlist variants on the same queries: top 20 chunks 4 of 9 multi-file, one or two chunks per file 6 of 9, top 50 chunks 6 of 9 at 5.2 seconds a query against 2.1. c: on 17 held-out queries, top 20 chunks and one chunk per file both 10 of 10 single and 6 of 7 multi."
        lead="Single-file answers are solved; multi-file answers are where the shortlist loses files, and the fix did not replicate."
      >
        Share of queries whose every correct file is in the top five, by whether the answer spans one file (squares) or several
        (circles). <b>a</b>, Three retrievers on the 35 development queries (two codebases). <b>b</b>, Shortlist variants for the
        two-stage pipeline on the same queries, with seconds per query on the larger codebase. The spread-across-files variants were
        designed after these queries exposed the problem, so their gain here is partly tuning. <b>c</b>, The pre-registered test on a
        third codebase, scored once: no difference. Development labels are Claude-drafted and unverified; held-out labels each carry a
        cited line checked by script.
      </Figure>
      <p>
        <strong>It cannot say &ldquo;not here&rdquo;.</strong> On each codebase, two or three answerable queries score below the
        strongest query for a feature that does not exist, and the cut-off sits at a different score in each. Raw reranker scores are
        not probabilities. Turning them into probabilities is calibration [16], the Jev-like part still to build; for reranker scores there is no
        established recipe to borrow.
      </p>

      <h2>Related work</h2>
      <p>
        Describing code in natural language and retrieving it is the semantic code search task, benchmarked by CodeSearchNet [1], CoSQA [2]
        and CoIR [3], where learned code encoders such as UniXcoder [4] compete with lexical baselines. noul&apos;s first stage combines BM25 [9]
        with a small BGE embedding model [10] by reciprocal rank fusion [11]; its second follows the retrieve-then-rerank design of
        cross-encoder rerankers [13]. None of that architecture is new. Repository-level localization for SWE-bench [5] is usually done by LLM
        agents that read files turn by turn, such as SWE-agent [6] and LocAgent [8], or by the simpler staged pipeline of Agentless [7],
        which already argued that an agent is not required; LLMs can also serve as the reranker itself [17]. What noul asks is narrower:
        how far a local, non-generative scorer gets on that task, measured by a strict every-correct-file rule and a pre-registered
        held-out test.
      </p>

      <h2>Limits</h2>
      <p>
        Both codebases are small, 60 and 9 files. The shortlist of 20 chunks is 8% of one and 31% of the other, so it has not had to prove
        itself on a repository where it discards almost everything. 35 queries is a small sample, and the labels are not independently
        verified.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed, for <code>find</code> only.</strong> The two-stage pipeline, the benchmark runners, both label sets
        and every per-query result are committed. A Claude Code skill already fronts it with a small-model agent, which the local scorer
        is meant to replace for all but ambiguous cases.
      </p>
      <p>
        Next: keep test files from crowding out source files; more held-out codebases with cited labels; then a large open-source
        repository, the scale localization benchmarks use [5, 8], calibration so
        &ldquo;not here&rdquo; becomes a probability, and the per-file yes/no <code>ask</code> mode. The agent it would replace will
        be scored on the same labels, so that comparison becomes a measurement rather than an anecdote.
      </p>

      <h2>References</h2>
      <ol className="references">
        <li>Husain H, Wu H-H, Gazit T, et al. CodeSearchNet Challenge: Evaluating the State of Semantic Code Search. arXiv 1909.09436 (2019). <a href="https://arxiv.org/abs/1909.09436">arXiv:1909.09436</a>.</li>
        <li>Huang J, Tang D, Shou L, et al. CoSQA: 20,000+ Web Queries for Code Search and Question Answering. <em>Proceedings of ACL-IJCNLP</em>, 5690–5700 (2021). <a href="https://doi.org/10.18653/v1/2021.acl-long.442">doi:10.18653/v1/2021.acl-long.442</a>.</li>
        <li>Li X, Dong K, Lee YQ, et al. CoIR: A Comprehensive Benchmark for Code Information Retrieval Models. <em>Proceedings of ACL</em>, 22074–22091 (2025). <a href="https://doi.org/10.18653/v1/2025.acl-long.1072">doi:10.18653/v1/2025.acl-long.1072</a>.</li>
        <li>Guo D, Lu S, Duan N, et al. UniXcoder: Unified Cross-Modal Pre-training for Code Representation. <em>Proceedings of ACL</em>, 7212–7225 (2022). <a href="https://doi.org/10.18653/v1/2022.acl-long.499">doi:10.18653/v1/2022.acl-long.499</a>.</li>
        <li>Jimenez CE, Yang J, Wettig A, et al. SWE-bench: Can Language Models Resolve Real-World GitHub Issues? <em>ICLR</em> (2024). <a href="https://arxiv.org/abs/2310.06770">arXiv:2310.06770</a>.</li>
        <li>Yang J, Jimenez CE, Wettig A, et al. SWE-agent: Agent-Computer Interfaces Enable Automated Software Engineering. <em>NeurIPS</em> (2024). <a href="https://arxiv.org/abs/2405.15793">arXiv:2405.15793</a>.</li>
        <li>Xia CS, Deng Y, Dunn S, Zhang L. Demystifying LLM-Based Software Engineering Agents (Agentless). <em>Proceedings of the ACM on Software Engineering</em> 2 (FSE), 801–824 (2025). <a href="https://doi.org/10.1145/3715754">doi:10.1145/3715754</a>.</li>
        <li>Chen Z, Tang X, Deng G, et al. LocAgent: Graph-Guided LLM Agents for Code Localization. <em>Proceedings of ACL</em>, 8697–8727 (2025). <a href="https://doi.org/10.18653/v1/2025.acl-long.426">doi:10.18653/v1/2025.acl-long.426</a>.</li>
        <li>Robertson S, Zaragoza H. The Probabilistic Relevance Framework: BM25 and Beyond. <em>Foundations and Trends in Information Retrieval</em> 3, 333–389 (2009). <a href="https://doi.org/10.1561/1500000019">doi:10.1561/1500000019</a>.</li>
        <li>Xiao S, Liu Z, Zhang P, et al. C-Pack: Packed Resources For General Chinese Embeddings. <em>Proceedings of SIGIR</em>, 641–649 (2024). <a href="https://doi.org/10.1145/3626772.3657878">doi:10.1145/3626772.3657878</a>.</li>
        <li>Cormack GV, Clarke CLA, Buettcher S. Reciprocal Rank Fusion Outperforms Condorcet and Individual Rank Learning Methods. <em>Proceedings of SIGIR</em>, 758–759 (2009). <a href="https://doi.org/10.1145/1571941.1572114">doi:10.1145/1571941.1572114</a>.</li>
        <li>Chen J, Xiao S, Zhang P, et al. M3-Embedding: Multi-Linguality, Multi-Functionality, Multi-Granularity Text Embeddings Through Self-Knowledge Distillation. <em>Findings of ACL</em>, 2318–2335 (2024). <a href="https://doi.org/10.18653/v1/2024.findings-acl.137">doi:10.18653/v1/2024.findings-acl.137</a>.</li>
        <li>Nogueira R, Cho K. Passage Re-ranking with BERT. arXiv 1901.04085 (2019). <a href="https://arxiv.org/abs/1901.04085">arXiv:1901.04085</a>.</li>
        <li>Carbonell J, Goldstein J. The Use of MMR, Diversity-Based Reranking for Reordering Documents and Producing Summaries. <em>Proceedings of SIGIR</em>, 335–336 (1998). <a href="https://doi.org/10.1145/290941.291025">doi:10.1145/290941.291025</a>.</li>
        <li>Nosek BA, Ebersole CR, DeHaven AC, et al. The preregistration revolution. <em>Proceedings of the National Academy of Sciences</em> 115, 2600–2606 (2018). <a href="https://doi.org/10.1073/pnas.1708274114">doi:10.1073/pnas.1708274114</a>.</li>
        <li>Guo C, Pleiss G, Sun Y, Weinberger KQ. On Calibration of Modern Neural Networks. <em>ICML</em> (2017). <a href="https://arxiv.org/abs/1706.04599">arXiv:1706.04599</a>.</li>
        <li>Sun W, Yan L, Ma X, et al. Is ChatGPT Good at Search? Investigating Large Language Models as Re-Ranking Agents. <em>Proceedings of EMNLP</em>, 14918–14937 (2023). <a href="https://doi.org/10.18653/v1/2023.emnlp-main.923">doi:10.18653/v1/2023.emnlp-main.923</a>.</li>
      </ol>
    </>
  );
}
