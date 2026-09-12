export const metadata = { title: "veridian. — shel." };

export default function VeridianPage() {
  return (
    <>
      <span className="kicker">Prototype — 2025–</span>
      <h1>veridian.</h1>
      <p className="tagline">
        A corpus-grounded research cognition engine: retrieve literature on a topic, discover its interpretive terrain, and reflect an
        entered understanding against what the corpus actually supports.
      </p>

      <h2>Why this exists</h2>
      <p>
        Entering an unfamiliar research domain means facing hundreds of papers with no obvious map — no visible concept hierarchy, no sense
        of which interpretations are dominant versus emerging, and no easy way to tell whether a claim you&apos;re forming is actually
        supported by the literature. Most tools either summarize, compressing away the interpretive landscape, or generate, producing claims
        ungrounded in any specific corpus. veridian does neither: it&apos;s an orientation and reflection system, not a summary engine or a
        shortcut to expertise.
      </p>

      <h2>Approach</h2>
      <p>
        A single context-engineering pipeline: retrieve abstracts from PubMed, embed and cluster them, generate a grounded thematic summary
        per cluster, extract atomic claims from a user&apos;s own free-form reasoning, align those claims to the cluster(s) they&apos;re
        closest to, extract and resolve named entities into a typed knowledge graph, and reflect which claims are well-supported, weakly
        supported, or ungrounded — without issuing a grade.
      </p>

      <h2>Key results</h2>
      <p>
        A working structural prototype with the full pipeline implemented end-to-end: PubMed retrieval, embedding and clustering, LLM
        cluster summarization, claim extraction and grounding, entity resolution into a queryable knowledge graph, and both a static
        portfolio demo mode and a live backend mode from the same frontend. The open question this prototype is built to eventually answer —
        how well corpus-relative grounding catches unsupported claims in practice — hasn&apos;t been formally evaluated yet.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Early prototype.</strong> Core pipeline is implemented and runnable; formal evaluation and an agentic reasoning layer on top
        of retrieval are planned next.
      </p>
    </>
  );
}
