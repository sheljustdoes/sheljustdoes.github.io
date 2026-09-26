import Figure from "../Figure";

export const metadata = { title: "veridian. — shel." };

export default function VeridianPage() {
  return (
    <>
      <span className="kicker">Prototype — 2025–</span>
      <h1>veridian.</h1>
      <p className="tagline">
        A literature review tool: map where a research field agrees and where it disagrees, then check any claim against the papers — with
        the sentences that support or contradict it.
      </p>

      <h2>Why this exists</h2>
      <p>
        Entering an unfamiliar research domain means facing hundreds of papers with no obvious map — no visible concept hierarchy, no sense
        of which interpretations are dominant versus emerging, and no easy way to tell whether a claim you&apos;re forming is actually
        supported by the literature. Most tools either summarize, compressing away the interpretive landscape, or generate, producing claims
        ungrounded in any specific corpus.
      </p>
      <p>
        veridian answers two questions against a fixed corpus instead. <strong>Explore</strong> maps the field: clusters of related work,
        the concepts that recur, and — the part worth building toward — where papers disagree. <strong>Check</strong> grounds a specific
        claim: supported, contradicted, contested or unsupported, with the sentences behind the verdict. The two are meant to meet in a map
        of disagreement, where contested claims surface and open straight into the evidence on both sides. That also fixes the original
        design&apos;s entry problem: someone new to a field has no claims of their own to check until the map gives them some.
      </p>

      <h2>The original approach</h2>
      <p>
        A single context-engineering pipeline: retrieve abstracts from PubMed, embed and cluster them, generate a thematic summary per
        cluster, extract atomic claims from a user&apos;s own free-form reasoning, align those claims to the cluster they sit closest to,
        resolve named entities into a typed knowledge graph, and reflect which claims are well-supported, weakly supported or ungrounded —
        without issuing a grade.
      </p>
      <p>
        That is the design as built, and the section below is why it was replaced. The alignment step — comparing a claim to a cluster
        centroid — is the part that does not survive scrutiny.
      </p>

      <h2>What it actually does</h2>
      <p>
        The pipeline runs end to end: PubMed retrieval, embedding and clustering, LLM cluster summarization, claim extraction, entity
        resolution into a queryable knowledge graph, and an interactive cluster map. Retrieval, projection, the map and entity resolution
        all work. It was the interpretation layer sitting on top of them that did not — and the open question the prototype was built to
        answer, how well corpus-relative grounding catches unsupported claims, was never evaluated.
      </p>

      <h2>What an audit of it found</h2>
      <p>
        Checked in September 2026 against the repository&apos;s own committed demo payloads, the claim-grounding feature — the thing the
        project is named for — <strong>does not discriminate</strong>. All six claims map to the same cluster in both payloads, every
        similarity clears the threshold, and every verdict reads identically.
      </p>
      <p>
        That is structural rather than a tuning problem. Cosine similarity between a claim and a cluster centroid measures topical
        <em> aboutness</em>, not evidential support: a claim and its negation embed almost identically, so &ldquo;X extends lifespan&rdquo;
        and &ldquo;X does not extend lifespan&rdquo; score alike against the same cluster. A centroid is also the mean of many abstracts, so
        it can never identify <em>which</em> paper supports a claim. Separately, the cluster summarizer injects the user&apos;s own search
        rationale into every cluster&apos;s prompt, so the summaries echo the query back instead of distinguishing the clusters.
      </p>
      <p>
        Retrieval, the UMAP projection, the interactive map and entity resolution all work. It was the interpretation layer on top of them
        that did not, and recording that is more useful than quietly patching it.
      </p>

      <h2>What replaced it</h2>
      <p>
        Grounding is now retrieve-then-entail. Retrieval selects candidate abstracts, those abstracts are split into sentences, the
        sentences nearest the claim are chosen, and a judge returns one typed stance per sentence. Verdicts are <em>supported</em>,
        <em> contradicted</em>, <em> contested</em> or <em> unsupported</em> — and <em>contested</em> is the one the old design could not
        express at all, despite being the normal state of a live research question.
      </p>
      <p>
        Evidence is <strong>selected, never generated</strong>. The citation is a sentence taken from the abstract, so the quoted text
        always exists in the source. That guarantees the <em>citation</em>, not the <em>reading</em>: a judge can still mistake the
        direction of an effect, miss a hedge, or credit a mouse result to a claim about humans. The hard failure mode is untouched, and
        isolating a sentence makes it harder — organism, dose and comparator usually live in other sentences. Where an abstract is
        structured, BACKGROUND sentences are excluded from evidence; most abstracts in the demo corpus are not structured, so this covers a
        minority of them.
      </p>
      <p>
        Underneath, the corpus layer now parses what PubMed always returned and the original code discarded — PMIDs, without which nothing
        can be cited; MeSH descriptors, which give the knowledge graph an authority so that &ldquo;IL-6&rdquo; and
        &ldquo;interleukin-6&rdquo; are one node; and publication types, so a verdict can distinguish a claim supported by a meta-analysis
        from one supported by a case report.
      </p>

      <h2>What the evaluation found</h2>
      <p>
        Check was scored against hand-labelled claims about the frozen 150-paper corpus. On 51 development claims, the first run of the
        rebuilt pipeline reached 55%. Its errors were diagnosed — a rule the judge was never given, and evidence that never reached it —
        and fixed in general form, which lifted development to 86%. That number is not evidence, because the fixes were made while looking
        at those claims. The evidence is the held-out set: 21 claims written before any fix and scored once, where the pipeline reached
        86% again and the original rule 48%.
      </p>
      <Figure
        n={1}
        src="/projects/veridian/fig1_check.png"
        alt="Three panels. a: accuracy with 95% intervals; development: old rule 18 of 51, first run 28 of 51, after fixes 44 of 51; held out: old rule 10 of 21, after fixes 18 of 21. b: confusion grid for the pipeline on held-out claims: supported 9 right and 1 called unsupported; contradicted 3 of 3 right; unsupported 6 right and 2 called contradicted. c: the old rule calls all 21 claims supported."
        lead="Check reaches 86% on claims it had never seen; the old rule called everything supported."
      >
        <b>a</b>, Verdict accuracy with 95% Wilson intervals. The development score after fixes (44/51) was reached while fixing
        errors found on those claims; the held-out score (18/21) was not. <b>b</b>, Held-out verdicts from the pipeline against the answer
        key. Its three errors: one supported claim called unsupported, and two unsupported claims called contradicted. <b>c</b>, The
        original rule, which answered &ldquo;supported&rdquo; to every claim, so its accuracy is just the share of supported claims. No
        claim in either key is contested, so that column is omitted.
      </Figure>
      <p>
        Explore&apos;s result is about the corpus rather than the method. Refit on resampled papers, no number of groups reproduces itself
        well enough to trust, and the groups barely separate at any number. The map in the demo says so beside it.
      </p>
      <p>
        That reading needed a test, because a method that cannot find structure would give the same answer. A pre-registered positive
        control built two more frozen corpora with known answers, each the union of three PubMed searches. On three unrelated topics
        (CRISPR base editing, malaria vaccines, the gut microbiome in depression), Explore chose three groups, stable under resampling,
        and recovered the topics exactly (adjusted Rand index 1.000). On three related aging interventions (senolytics, rapamycin,
        caloric restriction) it again chose three stable groups and recovered them closely (0.794), better than the protocol expected.
        Explore finds structure when it is there, so the metformin corpus simply has no separable subfields.
      </p>
      <Figure
        n={2}
        src="/projects/veridian/fig2_explore.png"
        alt="Two panels. a: bar chart of resampling stability by number of groups from 3 to 12; 3 groups reach 0.63, all others between 0.24 and 0.40, all below a 0.80 line; the legacy map's 10 groups reach 0.28. b: silhouette by number of groups, flat between 0.06 and 0.08."
        lead="The metformin corpus has no grouping stable enough to map with confidence."
      >
        <b>a</b>, Resampling stability of k-means partitions of the 150 abstract embeddings: median adjusted Rand index between refits on
        20 draws of 80% of the papers. The required 0.80 is never reached; three groups, the most stable, reach 0.63, and the ten groups of the
        original map reach 0.28. <b>b</b>, Cosine silhouette at each k, which stays below 0.09: the groups barely separate.
      </Figure>

      <h2>Try it</h2>
      <p>
        <a href="/demos/veridian/">Open the demo →</a> It runs entirely in your browser, with no API key and no backend. Three tabs:
      </p>
      <ul>
        <li>
          <strong>Judged examples</strong> — the full pipeline on the held-out claims: each verdict beside the answer-key label, and every
          sentence the judge counted, quoted from its paper with the judge&apos;s reasoning. Precomputed offline from a fresh run of the scored
          configuration; disagreements with the key are shown, not dropped.
        </li>
        <li>
          <strong>Retrieve evidence</strong> — over the frozen 150-paper corpus, or <em>any topic</em>: the page searches PubMed directly,
          keeps the top 10, 25 or 50 papers, and embeds them on your machine. Live topics get retrieval only, because judging needs a hosted
          model.
        </li>
        <li>
          <strong>Explore map</strong> — the frozen corpus in three groups, each named by its distinctive MeSH terms, with the papers nearest
          its centre and the findings they state. The stability evidence sits beside the map: no number of groups survives resampling, so
          the map is flagged as a sketch rather than a finding.
        </li>
      </ul>
      <p>
        The control worth pressing is <em>negate the claim</em>. It returns the same papers, because a claim and its negation embed at
        cosine 0.93. That is the argument for the whole architecture, made visible rather than asserted: retrieval is a recall device and
        cannot separate support from contradiction, which is why judgement is a separate step.
      </p>
      <p>
        <em>The demo&apos;s interface is a prototype and has not been designed.</em>
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed (Check); Explore rebuilt.</strong> Check was rebuilt first, since it was the broken half: the corpus layer,
        sentence-level grounding and the in-browser retrieval demo are built and tested. Explore was rebuilt next with nothing generated:
        clusters labelled by their distinctive MeSH terms, represented by the papers nearest their centroid, with the cluster count chosen
        by resampling stability. On this corpus no count is stable (three clusters reach 0.63; the original map&apos;s ten reach 0.28), so
        the old map was mostly arbitrary, and the new one says so, in the demo, beside the map. On 21 held-out claims, written before any fix and scored once, the rebuilt pipeline reached 86% verdict accuracy
        (95% interval 65–95%) against 48% for the original rule, which called every claim supported. A first run on development claims had
        scored 55%; its errors were diagnosed — a rule the judge was never given, and evidence that never reached it — and fixed in general
        form rather than tuned claim by claim. The legacy module is still
        the command-line entry. Retrieval is not the differentiator — general research agents do that well; calibrated judgement with a
        known error rate on a specific corpus is, and the first error rate now exists.
      </p>
    </>
  );
}
