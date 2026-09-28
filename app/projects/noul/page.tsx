import InteractiveFigure from "../InteractiveFigure";
import Ref from "../Ref";

export const metadata = { title: "noul. — shel." };

export default function NoulPage() {
  return (
    <>
      <span className="kicker">Project — noul · 2026</span>
      <h1>A local, non-generative scorer solves single-file code search and loses multi-file answers at the shortlist</h1>
      <p className="byline">
        Shel Burkes, PhD<span className="sep">·</span>Benchmarked 24 September 2026<span className="sep">·</span>Pre-registered
        held-out test scored 26 September 2026
      </p>

      <div className="abstract">
        <span className="abstract-label">Abstract</span>
        A coding agent answers &ldquo;where is the thing that does X&rdquo; by reading files into its context, turn by
        turn<Ref n={[5, 6, 8]} />, and every file it reads is re-sent with every later turn. TypeSafe&apos;s Jev points at an
        alternative — typed, calibrated numbers instead of prose, in one forward pass — but is API-only, with its architecture
        unpublished. We asked how much of that shape can be rebuilt from open models running locally, with no text generation and no
        code sent anywhere. Here we show that a two-stage pipeline — BM25 and a 33M-parameter embedding model shortlisting 20 chunks
        for a 568M-parameter cross-encoder — puts a right file in the top three for 33 of 35 queries across two codebases, against 28
        for keyword search, at 2.2–2.3 s per query, a tenth of the brute-force reranking time; its top-1 lead of two to three queries
        is too small to call. Under a strict rule counting a query only when every correct file reaches the top five, all 26
        single-file queries pass, but only 4 of 9 multi-file queries do, fewer than keyword search&apos;s 5; a pre-registered fix
        spreading the shortlist across files made no difference on a held-out codebase (16 of 17 complete either way). The shortlist,
        not the reranker, is where multi-file answers are lost.
      </div>

      <p>
        Describing code in natural language and retrieving it is the semantic code search task, benchmarked by
        CodeSearchNet<Ref n={1} />, CoSQA<Ref n={2} /> and CoIR<Ref n={3} />, where learned code encoders such as
        UniXcoder<Ref n={4} /> compete with lexical baselines. Repository-level localization for SWE-bench<Ref n={5} /> is usually
        done by LLM agents that read files turn by turn, such as SWE-agent<Ref n={6} /> and LocAgent<Ref n={8} />, or by the simpler
        staged pipeline of Agentless<Ref n={7} />, which already argued that an agent is not required; LLMs can also serve as the
        reranker itself<Ref n={17} />. Every file an agent reads is re-sent with every later turn. TypeSafe&apos;s Jev points at an
        alternative: a model that returns typed, calibrated numbers instead of prose, in one forward pass. Jev is API-only and its
        architecture is unpublished. We asked a narrower question: how far a local, non-generative scorer gets on that task, with no
        text generation and no code sent anywhere, measured by a strict every-correct-file rule and a pre-registered held-out test
        (Box 1, Methods). None of the architecture is new — the first stage combines BM25<Ref n={9} /> with a small BGE embedding
        model<Ref n={10} /> by reciprocal rank fusion<Ref n={11} />, and the second follows the retrieve-then-rerank design of
        cross-encoder rerankers<Ref n={13} />; the question is what that stack delivers locally.
      </p>

      <aside className="box">
        <span className="box-lead">Box 1 | How to read the measurements</span>
        <p>
          <strong>P@1</strong> counts a query as right when the first file returned is a correct answer; <strong>R@3</strong> when a
          correct file appears in the top three — both count <em>any</em> correct file, as in code retrieval
          benchmarks<Ref n={[1, 4]} />. The <strong>complete-in-top-5</strong> rule is stricter: a query passes only when{" "}
          <em>every</em> file in its answer reaches the top five, which is what separates single-file from multi-file performance.{" "}
          <strong>Development queries</strong> are the 35 on which the pipeline and its default settings were chosen, so results on
          them can be partly tuning; the <strong>held-out</strong> test ran on a fresh codebase labelled before noul ever ran on it,
          under a protocol committed in advance — <strong>pre-registered</strong><Ref n={15} /> here means committed to the
          project&apos;s own repository before scoring, not lodged with a registry — and was scored once.{" "}
          <strong>Gap queries</strong> are those whose key words never appear in the code, the case that defeats keyword search by
          construction.
        </p>
      </aside>

      <h2>At top-1 the lead over keyword search is too small to call; the replicated gain is the shortlist</h2>
      <p>
        We benchmarked three retrievers on 41 queries over two small codebases — a JavaScript web application and a Python-and-notebook
        research codebase with scientific vocabulary — 35 of them answerable (Methods). On the labels as originally drafted, the
        two-stage pipeline led BM25 keyword search at top-1 by two queries; rerun on the current labels, after three disclosed
        widenings, by three (Tables 1 and 2). Out of 35, both leads are noise at this sample size, and an earlier lead for the big
        reranker on the web application did not replicate on the research codebase, where a 22M-parameter model did best. The gain
        that did replicate is recall into a shortlist: on both codebases, the reranker puts a right file in the top three for 33 of 35
        queries against 28 for BM25, and 34 against 29 on the current labels. That points to its role — a reranker over a shortlist,
        not a top-1 oracle. The two-stage default was chosen on these same queries, so its edge over its near neighbors is not a
        finding.
      </p>
      <p>
        <strong>Table 1 | Retrieval on the labels as originally drafted.</strong> 35 answerable queries over the two development
        codebases; P@1 and R@3 count any correct file (Box 1). Timing ranges span the two codebases.
      </p>
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
      <p>
        <strong>Table 2 | The same benchmark on the current labels.</strong> Rerun after the three label widenings (Methods), code and
        corpus unchanged.
      </p>
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

      <h2>The two-stage pipeline keeps the gain at a fraction of the cost</h2>
      <p>
        Reranking every chunk costs about 0.1 s per chunk, 25.6 s a query on the larger codebase. Every shortlist tested kept recall
        at three unchanged, and the default brings a query to 2.3 s: a tenth of the brute-force time on the larger codebase, a third
        on the smaller. The reranker is the only model that sees query and code together, which is what lets it match meaning rather
        than words, and it is also the only expensive step; the shortlist exists to keep it off every chunk in the repository, the
        standard retrieve-then-rerank design<Ref n={13} />.
      </p>

      <h2>Multi-file answers fail the strict rule, and the pre-registered fix did not replicate</h2>
      <p>
        The measures above count a query as right if <em>any</em> correct file appears. Counting it only when <em>every</em> correct
        file is in the top five, every single-file query passes (26 of 26), but only 4 of the 9 queries with several correct files do,
        fewer than keyword search (5) and brute force (6) (Fig. 1a). The shortlist keeps the best 20 chunks, which tend to come from
        one dominant file, so secondary files never reach the reranker. A pre-registered<Ref n={15} /> fix spread the shortlist
        across files, in the spirit of diversity-based reranking<Ref n={14} />: on these queries it lifted multi-file completeness
        from 4 to 6 of 9 (Fig. 1b), but on a fresh held-out codebase, labelled before noul ever ran on it with every label backed by
        a cited line, it made no difference — 16 of 17 complete either way (Fig. 1c). The default stays as it was. The one held-out
        miss was a source file pushed out of the top five by test files that mention the same functions, which is what gets measured
        next. Per-query retrievals behind these counts are in Extended Data Fig. 1.
      </p>
      <InteractiveFigure
        n={1}
        src="/projects/noul/fig1_find.png"
        spec="/projects/noul/interactive/fig1.json"
        slug="noul"
        alt="Three panels showing the share of queries with every correct file in the top five, split into single-file and multi-file answers. a: on 35 development queries, BM25 22 of 26 single and 5 of 9 multi; reranking every chunk 26 of 26 and 6 of 9; two-stage 26 of 26 and 4 of 9. b: shortlist variants on the same queries: top 20 chunks 4 of 9 multi-file, one or two chunks per file 6 of 9, top 50 chunks 6 of 9 at 5.2 seconds a query against 2.1. c: on 17 held-out queries, top 20 chunks and one chunk per file both 10 of 10 single and 6 of 7 multi."
        lead="Single-file answers are solved; multi-file answers are where the shortlist loses files, and the fix did not replicate."
      >
        Share of queries whose every correct file is in the top five, by whether the answer spans one file (squares) or several
        (circles). <b>a</b>, Three retrievers on the 35 development queries (two codebases). <b>b</b>, Shortlist variants for the
        two-stage pipeline on the same queries, with seconds per query on the larger codebase. The spread-across-files variants were
        designed after these queries exposed the problem, so their gain here is partly tuning. <b>c</b>, The pre-registered test on a
        third codebase, scored once: no difference. Development labels are Claude-drafted and unverified; held-out labels each carry a
        cited line checked by script.
      </InteractiveFigure>

      <h2>Raw scores cannot say &ldquo;not here&rdquo;</h2>
      <p>
        On each codebase, two or three answerable queries score below the strongest query for a feature that does not exist, and the
        cut-off sits at a different score in each. Raw reranker scores are not probabilities. Turning them into probabilities is
        calibration<Ref n={16} />, the Jev-like part still to build; for reranker scores there is no established recipe to borrow.
      </p>

      <h2>Discussion</h2>
      <p>
        On these benchmarks, a local, non-generative two-stage scorer put every single-file answer in its top five in about two
        seconds, and its replicated gain over keyword search was recall into the shortlist rather than precision at top-1. Its
        weakness is equally specific: under the every-correct-file rule, multi-file answers come back complete less often than with
        plain keyword search, because the shortlist concentrates on one dominant file, and the pre-registered spread-across-files fix
        that helped on the development queries made no difference held-out.
      </p>
      <p>
        The claim is bounded by the benchmark. Both development codebases are small, 60 and 9 files; the shortlist of 20 chunks is 8%
        of one and 31% of the other, so it has not had to prove itself on a repository where it discards almost everything. 35
        development queries is a small sample, their labels are Claude&apos;s reading of the code and not independently verified, and
        the two-stage default was chosen on them. The held-out test is the stronger evidence, and it is one codebase of 17 queries.
      </p>
      <p>
        The next tests are set: keep test files from crowding out source files; more held-out codebases with cited labels; then a
        large open-source repository, the scale localization benchmarks use<Ref n={[5, 8]} />; calibration so &ldquo;not here&rdquo;
        becomes a probability; and the per-file yes/no <code>ask</code> mode. A Claude Code skill already fronts the pipeline with a
        small-model agent, which the local scorer is meant to replace for all but ambiguous cases; that agent will be scored on the
        same labels, so the comparison becomes a measurement rather than an anecdote.
      </p>

      <h2>Methods</h2>
      <div className="endmatter">
        <p>
          <strong>Pipeline.</strong> <code>find</code> ranks files by how well they match a plain-language description, including
          descriptions whose words never appear in the code, the task semantic code search benchmarks measure<Ref n={[1, 2, 3]} />.
          Files are cut into overlapping 40-line chunks; notebooks are read as code and markdown, without outputs. A file scores as
          its best chunk. Retrieval runs in two stages: BM25<Ref n={9} /> and a 33M-parameter embedding model
          (bge-small<Ref n={10} />), fused by reciprocal rank<Ref n={11} />, shortlist 20 chunks, and a 568M-parameter cross-encoder
          (bge-reranker-v2-m3, built on the M3 backbone<Ref n={12} />) then reads the query against only those 20.
        </p>
        <p>
          <strong>Benchmark.</strong> Two small codebases: a JavaScript web application (60 files) and{" "}
          <a href="/projects/iridis/">iridis</a>, a Python and notebook research codebase with scientific vocabulary. 41 queries in
          all. 35 are answerable, and 12 of those are &ldquo;gap&rdquo; queries whose key words do not appear in the code. The other
          six describe features that do not exist, to test whether a scorer can say &ldquo;not here&rdquo;. Each answerable query
          lists every file that would be a fair top answer. The measures are precision at 1 and recall at 3, as in code retrieval
          benchmarks<Ref n={[1, 4]} />, and the strict complete-in-top-5 rule (Box 1).
        </p>
        <p>
          <strong>Labels.</strong> Who wrote the labels matters. Claude drafted them against the source. Three were widened after the
          first run, when the scorers found defensible answers the labels had missed; one of those turned up a real duplication in
          iridis, two separate implementations of the same skin-color extraction. None of the 41 development labels has been
          independently verified: they are Claude&apos;s reading of the code. The held-out codebase was labelled before noul ever ran
          on it, with every label backed by a cited line checked by script.
        </p>
      </div>

      <h2>Extended Data — every query, every retrieval</h2>
      <p>
        The counts above aggregate over queries; Extended Data Fig. 1 shows each of the 52 answerable benchmark queries individually,
        with the files it asked for and the five that came back, under each shortlist variant.
      </p>
      <InteractiveFigure
        n={1}
        label="Extended Data Fig."
        src="/projects/noul/fig2_queries.png"
        spec="/projects/noul/interactive/fig2.json"
        slug="noul-ed"
        alt="A dot per benchmark query, 52 answerable queries across three repos, showing the share of that query's correct files in the top five. Almost every dot sits at 100%; a handful of multi-file queries sit at 50% or below. Buttons switch between four shortlist variants."
        lead="Every benchmark query, one row each: which files were asked for, and what came back."
      >
        The 52 answerable queries across the three benchmark repos, under each shortlist variant (buttons). Squares are single-file
        answers, circles multi-file; the position is the share of that query&apos;s correct files in the top five. Hovering a dot shows
        the query, its gold files, and the five files actually retrieved with their scores — the fastest way to see <i>which</i> file a
        multi-file answer loses.
      </InteractiveFigure>

      <div className="endmatter">
        <h2>Data availability</h2>
        <p>
          Both label sets — the development labels with their disclosed widenings, and the held-out labels with their cited lines —
          the benchmark runners and every per-query result are committed with the project. All scoring ran locally; no code left the
          machine.
        </p>
        <h2>Code availability</h2>
        <p>
          The noul repository is private. The pipeline, benchmark construction, label provenance and decision rules are summarized
          here; the two-stage pipeline described in Methods is the committed default, with results for <code>find</code> only.
        </p>
        <h2>Pre-registration statement</h2>
        <p>
          Pre-registered means committed to the project&apos;s own repository before scoring, not lodged with an external
          registry<Ref n={15} />. The held-out test of the spread-across-files shortlist was pre-registered: the third codebase was
          labelled before noul ever ran on it, every label backed by a cited line checked by script, and the test was scored once.
          The development results were not held out — the pipeline and its default were chosen on those same queries, and label
          widenings after the first run are disclosed above.
        </p>
        <h2>Competing interests</h2>
        <p>None.</p>
      </div>

      <h2 id="references">References</h2>
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
