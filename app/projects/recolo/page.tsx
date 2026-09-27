import Figure from "../Figure";

export const metadata = { title: "recolo. — shel." };

export default function RecoloPage() {
  return (
    <>
      <span className="kicker">Project — 2026–</span>
      <h1>recolo.</h1>
      <p className="tagline">
        A bio-inspired memory architecture for LLM agents, in which forgetting is a tunable design parameter rather than a failure mode.
      </p>

      <h2>Why this exists</h2>
      <p>
        Context engineering answers a narrow question well: what should go into the window <em>now</em>. It says nothing about what should
        accumulate over weeks and what should be allowed to fade. Agents that run across many sessions therefore tend toward one of two
        failure modes — they remember everything, and drown in their own history, or they remember nothing, and start every session as a
        stranger. Human memory handles this tradeoff differently, because active forgetting is part of the design rather than a defect in it [16–18].
      </p>

      <h2>Approach</h2>
      <p>
        The architecture maps biological memory onto an agent explicitly. Working memory is the live context window. Episodic memory is a
        vector store of session records with metadata. Semantic memory is the set of cluster centroids produced by compressing those
        records. Hippocampal indexing [13] becomes semantic clustering as a retrieval index, and slow-wave consolidation [12] becomes a scheduled
        loop that compresses redundant episodes into semantic structure and speeds the decay of episodes it already represents, rather
        than deleting them.
      </p>
      <p>
        Two mechanisms make forgetting programmable. Episodic weights decay exponentially, <code>w(t) = e^(-λt)</code>, the shape of the classic forgetting curve [15], with λ exposed as a
        parameter rather than buried as a constant; MemoryBank already decays agent memories along such a curve [3]. Salience scoring modulates what survives, using sentiment magnitude as a proxy for
        emotional arousal — the amygdala&apos;s role in consolidating what mattered [14]. As designed, retrieval ranks on the product of similarity, decay,
        and salience, much as Generative Agents rank memories by relevance, recency and importance [2], and returns concise ranked results rather than raw embeddings.
      </p>
      <p>
        The design is grounded in two places: Xie&apos;s 2025 taxonomy of forgetting in LLMs [11], whose four dimensions — temporal dynamics,
        trigger mechanisms, controllability, functional impact — each become an explicit design choice here, and Anthropic&apos;s
        context-engineering framework, whose principle of finding the smallest set of high-signal tokens is applied across the whole memory
        lifecycle rather than to a single prompt.
      </p>
      <p>
        recolo is the direct successor to <a href="/projects/veridian/">veridian</a>. That project treated semantic clustering as a general
        meaning-compression mechanism and pointed it at external literature; recolo points the same mechanism at an agent&apos;s own
        history.
      </p>

      <h2>What the evaluation found</h2>
      <p>
        The test was LongMemEval [1]. Each question sits over a history of about 48 dated chat sessions, roughly 115,000
        tokens, and the benchmark marks which turns hold the answer. Every approach filled the same 6,000-token context from the same
        memories, one chat turn each. Claude Haiku 4.5 answered the question, and a separate Haiku call graded the answer with the
        benchmark&apos;s own prompts, an LLM-as-judge setup [9]. Settings were chosen on 39 questions. The protocol was then committed, and 99 different questions
        were scored once.
      </p>
      <p>
        <strong>As shipped, recolo answered 32% of them. Plain similarity retrieval over the same memories answered 73%.</strong> The
        ablations say why. Decay at its default six-day half-life erases evidence that is a few weeks old, and in these histories most
        answers are. Turning decay off recovered 38 points and brought recolo level with plain retrieval. Salience scoring and
        consolidation made no measurable difference either way. Decay also failed at the job it exists for. On questions where a newer
        fact replaces an older one, recolo scored 43% and plain retrieval 79%.
      </p>
      <p>
        One check rules out a bug as the cause: with every mechanism switched off, recolo and plain retrieval select exactly the same
        memories. The loss comes from the design choices themselves. The main one is that forgetting on a fixed clock assumes the
        timescale of future questions is known in advance. Here it was not, and nothing in recolo adapts to it.
      </p>
      <Figure
        n={1}
        src="/projects/recolo/fig1_v1.png"
        alt="Two panels. a: answer accuracy with 95% intervals on 99 held-out questions: plain retrieval 73%, recolo with decay off 71%, full history 43%, recolo with consolidation off 34%, with salience off 33%, as shipped 32%, most recent turns 9%. b: accuracy by question type for plain retrieval, recolo with decay off, and recolo as shipped; the shipped version is lowest on every type, 4% on multi-session questions."
        lead="As shipped, recolo lost to plain retrieval, and switching decay off recovered the whole gap."
      >
        <b>a</b>, Answer accuracy on the 99 held-out LongMemEval questions, each approach filling the same 6,000-token context from the
        same memories; 95% intervals from a bootstrap over questions. Switching off salience or consolidation changes nothing; switching
        off decay recovers 38 points. <b>b</b>, The same three approaches by question type (number of questions in brackets). Abstention
        and preference questions (six each) are omitted.
      </Figure>

      <p>
        A second protocol built decay that adapts to the history it runs on: relative to the history&apos;s span, counted in sessions
        rather than hours, or used only to break near-ties. Parameters were chosen on 61 fresh questions and tested on 119 more. On
        evidence recall, which needs no model, none beats plain similarity: span-relative decay keeps 75% of the evidence turns and
        session-counted decay 43%, against 96% for plain retrieval, while the tie-breaking mode matches it exactly. Plain retrieval
        already finds every knowledge-update evidence turn, so decay&apos;s only remaining chance is keeping superseded facts out of the
        context. The answer-accuracy run tested exactly that, once, for $2: on 119 held-out questions plain retrieval answered 76%,
        the tie-breaking mode 77% (no detectable difference), span-relative decay 55% and session-counted decay 34%. None beat plain
        retrieval on knowledge-update questions. Two protocols, one conclusion: decay, fixed or adaptive, does not help an agent answer
        from its own history. At best it does no harm.
      </p>
      <Figure
        n={2}
        src="/projects/recolo/fig2_v2.png"
        alt="Two panels. a: evidence-turn recall on the tuning set for each decay mode across its grid, from strongest to weakest decay; span-relative rises from 34% to 71%, session-counted from 15% to 44%, tie-break stays at 96 to 97%, level with plain retrieval at 97%. b: answer accuracy on 119 held-out questions: plain retrieval 76%, tie-break 77%, span-relative 55%, session-counted 34%, most recent turns 12%."
        lead="Adaptive decay only stopped hurting when it stopped decaying."
      >
        <b>a</b>, Evidence-turn recall on the 61 tuning questions for every setting of each decay mode, strongest decay on the left. Recall
        rises as decay weakens, and only the tie-break mode, which can barely move anything, matches plain retrieval (dashed line).
        <b>b</b>, Answer accuracy on 119 held-out questions for the chosen setting of each mode, with 95% intervals.
      </Figure>
      <p>
        A third protocol turned decay off and gave the other two mechanisms the form the results pointed to. Salience came from
        recurrence, a topic returning in a later session, and was allowed only to break near-ties. Consolidation stopped showing its
        keyword labels and became an index: a query that matches a cluster pulls in the cluster&apos;s member episodes. The test ran at a
        1,000-token budget, where ranking decides what the reader sees, on all 182 questions no earlier run had touched. On the tuning
        questions, every setting strong enough to change the ranking lowered recall. On the held-out questions neither mechanism beat
        plain retrieval: salience lost half a point of evidence recall, consolidation lost half a point on the multi-session questions it
        was built for, and both intervals end at zero. A gate fixed in advance sends only an arm that beats plain retrieval to the paid
        answer-accuracy step, so this protocol cost nothing.
      </p>
      <Figure
        n={3}
        src="/projects/recolo/fig3_v3.png"
        alt="Three panels. a: plain retrieval's evidence recall on the tuning set by context budget, from 72% at 500 tokens to 97% at 6,000, with multi-session questions lower, 69% at 1,000 tokens; a line marks the 1,000-token v3 budget. b: recall difference from plain retrieval for each tuning setting; the chosen weakest settings are at zero and every stronger setting is below, down to minus 19 points. c: held-out differences with 95% intervals: salience minus 0.5 points, the index minus 0.6 points on multi-session questions, both intervals ending at zero; the index overall plus 0.4, a secondary comparison."
        lead="With decay off, neither salience nor consolidation retrieves evidence better than plain similarity."
      >
        <b>a</b>, Why the budget is tight: at 6,000 tokens plain retrieval already finds 97% of the evidence on the tuning questions, so a
        ranking change has nothing to find; at 1,000 it finds 85%, and 69% on multi-session questions. <b>b</b>, Every tuning setting
        against plain retrieval. Settings strong enough to change the ranking all lower recall, so the fixed rule chose the weakest.
        <b>c</b>, The pre-registered held-out comparisons on 171 answerable questions, with 95% intervals. Neither primary comparison
        beats plain retrieval, so the gate kept the paid answer-accuracy run from spending anything.
      </Figure>
      <p>
        Three protocols, one answer: none of recolo&apos;s bio-inspired mechanisms helps an agent choose what to read from its own
        history. That is not a new finding on its own. Two recent evaluations found that a biologically inspired memory with
        consolidation, and a graph memory with decay-based pruning, matched or trailed flat vector retrieval on the same benchmark
        [19, 20]. What recolo adds is pre-registered ablations that locate the loss, and the presentation test below.
      </p>
      <p>
        A fourth protocol asked why decay never helped where it should have: on questions where a newer fact replaces an older one. It
        kept plain retrieval&apos;s context fixed and changed only how the retrieved turns were shown to the reader: with their dates, in
        time order (as in every earlier run); without dates, in time order; and without dates, shuffled. It ran on all 72 such questions
        and cost $0.69.
      </p>
      <Figure
        n={4}
        src="/projects/recolo/fig4_v4.png"
        alt="Two panels. a: answer accuracy with 95% intervals on 72 knowledge-update questions: dated and in order 82%, undated and in order 78%, undated and shuffled 67%. b: accuracy differences with 95% intervals: all time cues removed, the primary comparison, plus 15 points with an interval from plus 3 to plus 28; date stamps alone plus 4, interval crossing zero; order alone plus 11, interval crossing zero."
        lead="The reader already does recency itself, mostly from the order the memories are shown in."
      >
        <b>a</b>, Accuracy on the same retrieved turns, shown three ways. <b>b</b>, Paired differences with 95% intervals. Removing every
        time cue costs 15 points (the pre-registered primary comparison). Neither cue alone is detectable at this size, but order carries
        most of the effect.
      </Figure>

      <h2>What it taught</h2>
      <p>
        <strong>Decay lost even where it should have won.</strong> On questions where a newer fact replaces an older one, plain
        retrieval found every evidence turn the benchmark marks on the second held-out set, each stamped with its session date. Across
        both sets that paid for answers, the reader answered 76–79% of those questions correctly. No form of decay did better. The fixed-clock version scored 43%, because it threw the evidence away. The fourth
        protocol showed why: shown in time order with their dates, the retrieved memories let the reader pick the newer fact itself.
        Recency pays at presentation, not in scoring, and plain retrieval already gets it for free. That fits evidence that position in the
        context shapes what a model uses [10]; no earlier test we found separates order from date stamps.
      </p>
      <p>
        <strong>Strong enough to matter meant strong enough to hurt.</strong> Every mechanism reshaped a ranking by relevance with a signal
        that knows nothing about the question: age, recurrence, cluster membership. Across all three protocols, every setting strong enough
        to change which memories were chosen lowered evidence recall. The settings too weak to hurt changed nothing.
      </p>
      <p>
        <strong>Why the analogy failed is an open question.</strong> One explanation for human forgetting is that it answers limits:
        finite storage, and interference between memories that resemble each other [17, 18]. A vector store with a date on every record has
        neither, which may be why copying the mechanism bought nothing. Nothing here tests that explanation. The evaluation shows only
        that the mechanisms did not help.
      </p>
      <p>
        <strong>The cheap test was enough.</strong> Evidence recall needs no model and costs nothing. In both protocols that paid for
        answers, the approaches that lost evidence recall were exactly the ones that lost accuracy. In the first, it already showed full recolo trailing
        plain retrieval at every setting tried before a single answer was paid for. By the third protocol, that became a rule fixed in
        advance: no approach reaches the paid step unless it wins the free one. The whole evaluation cost $13.35.
      </p>

      <h2>Related work</h2>
      <p>
        Most memory systems for LLM agents keep past interactions in an external store and retrieve by similarity [5–7]. Several add a
        forgetting signal: Generative Agents rank memories by recency, importance and relevance [2], and MemoryBank and FadeMem decay them
        along an Ebbinghaus-style curve [3, 4, 15]. recolo borrows its analogy from neuroscience: complementary learning systems and
        hippocampal indexing for its stores [12, 13], amygdala-driven salience [14], and the view that forgetting is adaptive [16–18]. On
        LongMemEval [1], recent evaluations of bio-inspired or decay-pruned memories also matched or trailed plain vector retrieval
        [19, 20], and recolo&apos;s pre-registered results agree. Its presentation test adds that the reader resolves knowledge updates from
        memories shown in time order, in line with evidence that position in the context shapes what a model uses [10].
      </p>

      <h2>Limits</h2>
      <p>
        One benchmark, one reader, one embedder. The first held-out set was 99 questions, so its intervals run about nine points either
        way. A Haiku-class reader loses accuracy over a 115,000-token context [1, 10], which makes the full-history baseline look worse than a
        stronger reader would; that affects comparisons with full history, not those between retrieval approaches. The grader agreed with
        a manual review on 19 of 20 verdicts. Untested: memories without dates, a much weaker reader, and forgetting for storage or privacy
        rather than for answering. Decay can help where the newest item is the target and is not the most similar one [21], and
        one system reports gains from adaptive decay [4]; LongMemEval&apos;s knowledge updates were not that case here.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed.</strong> The core loop runs and is tested: both stores behind one interface over SQLite, decay computed
        at retrieval so the rate stays tunable, and consolidation that merges repeated topics and logs what it discards. Four protocols,
        each committed before scoring, cover 400 held-out questions and a presentation test, with every answer and verdict kept. Plain similarity retrieval over
        the store is now the library&apos;s default. Each mechanism is opt-in, and the designed configuration is kept for reproducing the
        results.
      </p>

      <h2>References</h2>
      <ol className="references">
        <li>Wu D, Wang H, Yu W, et al. LongMemEval: Benchmarking chat assistants on long-term interactive memory. arXiv 2410.10813 (2024). <a href="https://arxiv.org/abs/2410.10813">arXiv:2410.10813</a>.</li>
        <li>Park JS, O&apos;Brien J, Cai CJ, et al. Generative agents: Interactive simulacra of human behavior. <em>Proceedings of UIST</em>, 1–22 (2023). <a href="https://doi.org/10.1145/3586183.3606763">doi:10.1145/3586183.3606763</a>.</li>
        <li>Zhong W, Guo L, Gao Q, et al. MemoryBank: Enhancing large language models with long-term memory. <em>Proceedings of the AAAI Conference on Artificial Intelligence</em> 38, 19724–19731 (2024). <a href="https://doi.org/10.1609/aaai.v38i17.29946">doi:10.1609/aaai.v38i17.29946</a>.</li>
        <li>Wei L, Peng X, Dong X, et al. FadeMem: Biologically-inspired forgetting for efficient agent memory. arXiv 2601.18642 (2026, preprint). <a href="https://arxiv.org/abs/2601.18642">arXiv:2601.18642</a>.</li>
        <li>Packer C, Wooders S, Lin K, et al. MemGPT: Towards LLMs as operating systems. arXiv 2310.08560 (2023). <a href="https://arxiv.org/abs/2310.08560">arXiv:2310.08560</a>.</li>
        <li>Chhikara P, Khant D, Aryan S, et al. Mem0: Building production-ready AI agents with scalable long-term memory. arXiv 2504.19413 (2025). <a href="https://arxiv.org/abs/2504.19413">arXiv:2504.19413</a>.</li>
        <li>Lewis P, Perez E, Piktus A, et al. Retrieval-augmented generation for knowledge-intensive NLP tasks. arXiv 2005.11401 (2020). <a href="https://arxiv.org/abs/2005.11401">arXiv:2005.11401</a>.</li>
        <li>Xiao S, Liu Z, Zhang P, et al. C-Pack: Packed resources for general Chinese embeddings. arXiv 2309.07597 (2023). <a href="https://arxiv.org/abs/2309.07597">arXiv:2309.07597</a>.</li>
        <li>Zheng L, Chiang W-L, Sheng Y, et al. Judging LLM-as-a-judge with MT-Bench and Chatbot Arena. arXiv 2306.05685 (2023). <a href="https://arxiv.org/abs/2306.05685">arXiv:2306.05685</a>.</li>
        <li>Liu NF, Lin K, Hewitt J, et al. Lost in the middle: How language models use long contexts. <em>Transactions of the Association for Computational Linguistics</em> 12, 157–173 (2024). <a href="https://doi.org/10.1162/tacl_a_00638">doi:10.1162/tacl_a_00638</a>.</li>
        <li>Xie Y. Bio-inspired LLMs forgetting: Integrating neuroscience and computational mechanisms. <em>Proceedings of the 2025 International Conference on Artificial Intelligence, Virtual Reality and Interaction Design</em>, 153–161 (2025). <a href="https://doi.org/10.1145/3777730.3777756">doi:10.1145/3777730.3777756</a>.</li>
        <li>McClelland JL, McNaughton BL, O&apos;Reilly RC. Why there are complementary learning systems in the hippocampus and neocortex. <em>Psychological Review</em> 102, 419–457 (1995). <a href="https://doi.org/10.1037/0033-295X.102.3.419">doi:10.1037/0033-295X.102.3.419</a>.</li>
        <li>Teyler TJ, DiScenna P. The hippocampal memory indexing theory. <em>Behavioral Neuroscience</em> 100, 147–154 (1986). <a href="https://doi.org/10.1037/0735-7044.100.2.147">doi:10.1037/0735-7044.100.2.147</a>.</li>
        <li>McGaugh JL. The amygdala modulates the consolidation of memories of emotionally arousing experiences. <em>Annual Review of Neuroscience</em> 27, 1–28 (2004). <a href="https://doi.org/10.1146/annurev.neuro.27.070203.144157">doi:10.1146/annurev.neuro.27.070203.144157</a>.</li>
        <li>Murre JMJ, Dros J. Replication and analysis of Ebbinghaus&apos; forgetting curve. <em>PLOS ONE</em> 10, e0120644 (2015). <a href="https://doi.org/10.1371/journal.pone.0120644">doi:10.1371/journal.pone.0120644</a>.</li>
        <li>Anderson JR, Schooler LJ. Reflections of the environment in memory. <em>Psychological Science</em> 2, 396–408 (1991). <a href="https://doi.org/10.1111/j.1467-9280.1991.tb00174.x">doi:10.1111/j.1467-9280.1991.tb00174.x</a>.</li>
        <li>Richards BA, Frankland PW. The persistence and transience of memory. <em>Neuron</em> 94, 1071–1084 (2017). <a href="https://doi.org/10.1016/j.neuron.2017.04.037">doi:10.1016/j.neuron.2017.04.037</a>.</li>
        <li>Wixted JT. The psychology and neuroscience of forgetting. <em>Annual Review of Psychology</em> 55, 235–269 (2004). <a href="https://doi.org/10.1146/annurev.psych.55.090902.141555">doi:10.1146/annurev.psych.55.090902.141555</a>.</li>
        <li>Kerestecioglu D, Robsky A, Vasters C, et al. Human-inspired memory architecture for LLM agents. arXiv 2605.08538 (2026, preprint). <a href="https://arxiv.org/abs/2605.08538">arXiv:2605.08538</a>.</li>
        <li>Rusu T, Khanzadeh S, Alalfi M. Selective forgetting: A graph-based memory framework for long-term LLM agents. arXiv 2608.28978 (2026, preprint). <a href="https://arxiv.org/abs/2608.28978">arXiv:2608.28978</a>.</li>
        <li>Grofsky M. Freshness and the limits of heuristic trend detection in temporal RAG. arXiv 2509.19376 (2025, preprint). <a href="https://arxiv.org/abs/2509.19376">arXiv:2509.19376</a>.</li>
      </ol>
    </>
  );
}
