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
        stranger. Human memory does not face this tradeoff, because active forgetting is part of the design rather than a defect in it.
      </p>

      <h2>Approach</h2>
      <p>
        The architecture maps biological memory onto an agent explicitly. Working memory is the live context window. Episodic memory is a
        vector store of session records with metadata. Semantic memory is the set of cluster centroids produced by compressing those
        records. Hippocampal indexing becomes semantic clustering as a retrieval index, and slow-wave consolidation becomes a scheduled
        loop that compresses redundant episodes into semantic structure and prunes what falls below threshold.
      </p>
      <p>
        Two mechanisms make forgetting programmable. Episodic weights decay exponentially, <code>w(t) = e^(-λt)</code>, with λ exposed as a
        parameter rather than buried as a constant. Salience scoring modulates what survives, using sentiment magnitude as a proxy for
        emotional arousal — the amygdala&apos;s role in consolidating what mattered. Retrieval ranks on the product of similarity, decay,
        and salience, and returns concise ranked results rather than raw embeddings.
      </p>
      <p>
        The design is grounded in two places: Xie&apos;s 2025 taxonomy of forgetting in LLMs, whose four dimensions — temporal dynamics,
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
        The test was LongMemEval (Wu et al., 2024). Each question sits over a history of about 48 dated chat sessions, roughly 115,000
        tokens, and the benchmark marks which turns hold the answer. Every approach filled the same 6,000-token context from the same
        memories, one chat turn each. Claude Haiku 4.5 answered the question, and a separate Haiku call graded the answer with the
        benchmark&apos;s own prompts. Settings were chosen on 39 questions. The protocol was then committed, and 99 different questions
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

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed.</strong> The core loop runs and is tested: both stores behind one interface over SQLite, decay computed
        at retrieval so the rate stays tunable, and consolidation that merges repeated topics and logs what it discards. The evaluation
        is committed with its protocol, dev and held-out splits, every answer and verdict, and a spot-check of the grader. It cost
        $10.65 to run.
      </p>
      <p>
        The next protocol built decay that adapts to the history it runs on: relative to the history&apos;s span, counted in sessions
        rather than hours, or used only to break near-ties. Parameters were chosen on 61 fresh questions and tested on 119 more. On
        evidence recall, which needs no model, none beats plain similarity: span-relative decay keeps 75% of the evidence turns and
        session-counted decay 43%, against 96% for plain retrieval, while the tie-breaking mode matches it exactly. Plain retrieval
        already finds every knowledge-update evidence turn, so decay&apos;s only remaining chance is keeping superseded facts out of the
        context. The answer-accuracy run tested exactly that, once, for $2: on 119 held-out questions plain retrieval answered 76%,
        the tie-breaking mode 77% (no detectable difference), span-relative decay 55% and session-counted decay 34%. None beat plain
        retrieval on knowledge-update questions. Two protocols, one conclusion: decay, fixed or adaptive, does not help an agent answer
        from its own history. At best it does no harm.
      </p>
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
      <p>
        Three protocols, one answer: none of recolo&apos;s bio-inspired mechanisms helps an agent choose what to read from its own
        history. The store and retrieval loop are sound, and plain similarity retrieval over them is the configuration that works, so it is
        now the library&apos;s default; each mechanism is opt-in, and the designed configuration is kept for reproducing the results.
      </p>
    </>
  );
}
