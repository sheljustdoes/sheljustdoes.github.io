import InteractiveFigure from "../InteractiveFigure";
import Ref from "../Ref";

export const metadata = { title: "veridian. — shel." };

export default function VeridianPage() {
  return (
    <>
      <span className="kicker">Prototype — veridian · 2025–</span>
      <h1>Quoted-sentence entailment grounds scientific claims where centroid similarity cannot</h1>
      <p className="byline">
        Shel Burkes, PhD<span className="sep">·</span>Held-out claims scored 24 September 2026<span className="sep">·</span>Explore
        control corpora frozen 26 September 2026
      </p>

      <div className="abstract">
        <span className="abstract-label">Abstract</span>
        Entering an unfamiliar research field means facing hundreds of papers with no map of where they agree or disagree, and most
        tools either summarize, compressing away the interpretive landscape, or generate, producing claims ungrounded in any specific
        corpus and sometimes citations that do not exist<Ref n={5} />. Whether corpus-relative grounding catches unsupported claims
        had never been measured here, and the original design could not measure it: similarity between a claim and a cluster centroid
        measures topical aboutness, not evidential support — a claim and its negation embed at cosine 0.93. Here we show that
        grounding rebuilt as retrieve-then-entail, with evidence only ever quoted from source abstracts, reaches 86% verdict accuracy
        (95% interval 65–95%) on 21 held-out claims about a frozen 150-paper corpus, against 48% for the original rule, which called
        every claim supported. The corpus map is equally honest about its limits: no grouping of the metformin corpus is stable under
        resampling (best 0.63 against a required 0.80), while pre-registered control corpora with known structure are recovered
        exactly (adjusted Rand index 1.000) and closely (0.794), so the corpus, not the method, lacks separable subfields. Calibrated
        judgement with a known error rate on a specific corpus, not retrieval, is what the tool contributes.
      </div>

      <p>
        An unfamiliar research domain offers no visible concept hierarchy, no sense of which interpretations are dominant versus
        emerging, and no easy way to tell whether a claim one is forming is actually supported by the literature. Scientific claim
        verification was formalized by SciFact, which pairs retrieval of abstracts with selection of rationale sentences and a
        supports or refutes label<Ref n={1} />; later work extended it to health claims<Ref n={2} /> and showed that full-document
        context beats isolated sentences<Ref n={3} />. Citation indexes already show supporting and contrasting statements side by
        side<Ref n={4} />, and language models are documented to fabricate citations<Ref n={5} />. veridian answers two questions
        against a fixed corpus. <strong>Explore</strong> maps the field: clusters of related work, the concepts that recur, and — the
        part worth building toward — where papers disagree. <strong>Check</strong> grounds a specific claim: supported, contradicted,
        contested or unsupported, with the sentences behind the verdict. The two are meant to meet in a map of disagreement, where
        contested claims surface and open straight into the evidence on both sides; that also fixes the original design&apos;s entry
        problem, since someone new to a field has no claims of their own to check until the map gives them some.
      </p>
      <p>
        The original design was a single context-engineering pipeline: retrieve abstracts from PubMed, embed and cluster them,
        generate a thematic summary per cluster, extract atomic claims from a user&apos;s own free-form reasoning, align those claims
        to the cluster they sit closest to, resolve named entities into a typed knowledge graph, and reflect which claims are
        well-supported, weakly supported or ungrounded — without issuing a grade. The pipeline ran end to end, and retrieval, the
        UMAP projection<Ref n={11} />, the interactive map and entity resolution all worked; the alignment step — comparing a claim
        to a cluster centroid — is the part that did not survive scrutiny, and the open question the prototype was built to answer,
        how well corpus-relative grounding catches unsupported claims, was never evaluated. Check was therefore rebuilt on the
        retrieve-then-entail structure<Ref n={[1, 2, 3]} /> rather than a structure of our own invention, and Explore on the embed,
        cluster and label pattern of BERTopic<Ref n={12} />, with labels from MeSH<Ref n={19} /> rather than generated text and a
        cluster count chosen by resampling stability<Ref n={[13, 14]} /> measured with the adjusted Rand index<Ref n={15} />. What
        veridian adds is a <em>contested</em> verdict, evidence that is only ever quoted, and an error rate measured once on held-out
        claims about a frozen corpus (Box 1, Methods).
      </p>

      <aside className="box">
        <span className="box-lead">Box 1 | How to read the verdicts</span>
        <p>
          Check returns one of four verdicts against a <strong>frozen corpus</strong>, a fixed set of papers that does not change
          between runs: <strong>supported</strong> (the evidence sentences back the claim), <strong>contradicted</strong> (they
          oppose it), <strong>contested</strong> (papers land on both sides — the normal state of a live research question), and{" "}
          <strong>unsupported</strong> (the corpus contains no evidence either way). <strong>Held-out</strong> claims were written
          before any fix to the pipeline and scored exactly once, so their accuracy was never available to tune against.{" "}
          <strong>Pre-registered</strong> means the test and its expected outcome were committed before the result was computed.{" "}
          <strong>Stability</strong> asks whether a clustering of the corpus reproduces itself when the papers are resampled,
          measured by the adjusted Rand index between refits.
        </p>
      </aside>

      <h2>Similarity to a cluster centroid does not discriminate between claims</h2>
      <p>
        Checked in September 2026 against the repository&apos;s own committed demo payloads, the claim-grounding feature — the thing
        the project is named for — does not discriminate. All six claims map to the same cluster in both payloads, every similarity
        clears the threshold, and every verdict reads identically.
      </p>
      <p>
        That is structural rather than a tuning problem. Cosine similarity between a claim and a cluster centroid measures topical{" "}
        <em>aboutness</em>, not evidential support: a claim and its negation embed almost identically, since sentence encoders are
        largely insensitive to negation<Ref n={6} />, so &ldquo;X extends lifespan&rdquo; and &ldquo;X does not extend
        lifespan&rdquo; score alike against the same cluster. A centroid is also the mean of many abstracts, so it can never identify{" "}
        <em>which</em> paper supports a claim. Separately, the cluster summarizer injects the user&apos;s own search rationale into
        every cluster&apos;s prompt, so the summaries echo the query back instead of distinguishing the clusters. Retrieval, the UMAP
        projection, the interactive map and entity resolution all work; it was the interpretation layer on top of them that did not,
        and recording that is more useful than quietly patching it.
      </p>

      <h2>Quoted-sentence verdicts reach 86% on claims the pipeline had never seen</h2>
      <p>
        Grounding is now retrieve-then-entail (Methods): retrieval selects candidate abstracts, those abstracts are split into
        sentences, the sentences nearest the claim are chosen, and a judge returns one typed stance per sentence. <em>Contested</em>{" "}
        is the verdict the old design could not express at all, despite being the normal state of a live research question; none of
        the verification benchmarks has a contested verdict, and no claim labelled contested exists here yet, so its accuracy is
        still unmeasured. Evidence is <strong>selected, never generated</strong>: the citation is a sentence taken from the abstract,
        so the quoted text always exists in the source. That guarantees the <em>citation</em>, not the <em>reading</em> — a judge can
        still mistake the direction of an effect, miss a hedge, or credit a mouse result to a claim about humans. The hard failure
        mode is untouched, and isolating a sentence makes it harder, because organism, dose and comparator usually live in other
        sentences, which is why full-abstract context improves verification<Ref n={3} />.
      </p>
      <p>
        Check was scored against hand-labelled claims about the frozen 150-paper corpus. On 51 development claims, the first run of
        the rebuilt pipeline reached 55%. Its errors were diagnosed — a rule the judge was never given, and evidence that never
        reached it — and fixed in general form rather than tuned claim by claim, which lifted development to 86%. That number is not
        evidence, because the fixes were made while looking at those claims. The evidence is the held-out set: 21 claims written
        before any fix and scored once, where the pipeline reached 86% again (Fig. 1a, b) and the original rule 48% — it called
        every claim supported (Fig. 1c).
      </p>
      <InteractiveFigure
        n={1}
        src="/projects/veridian/fig1_check.png"
        spec="/projects/veridian/interactive/fig1.json"
        slug="veridian"
        alt="Three panels. a: accuracy with 95% intervals; development: old rule 18 of 51, first run 28 of 51, after fixes 44 of 51; held out: old rule 10 of 21, after fixes 18 of 21. b: confusion grid for the pipeline on held-out claims: supported 9 right and 1 called unsupported; contradicted 3 of 3 right; unsupported 6 right and 2 called contradicted. c: the old rule calls all 21 claims supported."
        lead="Check reaches 86% on claims it had never seen; the old rule called everything supported."
      >
        <b>a</b>, Verdict accuracy with 95% Wilson intervals <Ref n={7} />. The development score after fixes (44/51) was reached while fixing
        errors found on those claims; the held-out score (18/21) was not. <b>b</b>, Held-out verdicts from the pipeline against the answer
        key. Its three errors: one supported claim called unsupported, and two unsupported claims called contradicted. <b>c</b>, The
        original rule, which answered &ldquo;supported&rdquo; to every claim, so its accuracy is just the share of supported claims. No
        claim in either key is contested, so that column is omitted.
      </InteractiveFigure>

      <h2>The metformin corpus has no separable subfields, and the method is not the reason</h2>
      <p>
        Explore&apos;s result is about the corpus rather than the method. Refit on resampled papers<Ref n={[13, 14]} />, no number of
        groups reproduces itself well enough to trust, and the groups barely separate at any number (Fig. 2). The map in the demo
        says so beside it.
      </p>
      <p>
        That reading needed a test, because a method that cannot find structure would give the same answer. A pre-registered positive
        control built two more frozen corpora with known answers, each the union of three PubMed searches. On three unrelated topics
        (CRISPR base editing, malaria vaccines, the gut microbiome in depression), Explore chose three groups, stable under resampling,
        and recovered the topics exactly (adjusted Rand index<Ref n={15} /> 1.000). On three related aging interventions (senolytics,
        rapamycin, caloric restriction) it again chose three stable groups and recovered them closely (0.794), better than the
        protocol expected. Explore finds structure when it is there, so the metformin corpus simply has no separable subfields. The
        control matters because stability alone can mislead: a partition can be stable and still wrong<Ref n={16} />, and stability
        tends to favour the fewest groups, which is where both control corpora and the metformin map landed.
      </p>
      <InteractiveFigure
        n={2}
        src="/projects/veridian/fig2_explore.png"
        spec="/projects/veridian/interactive/fig2.json"
        slug="veridian"
        alt="Two panels. a: bar chart of resampling stability by number of groups from 3 to 12; 3 groups reach 0.63, all others between 0.24 and 0.40, all below a 0.80 line; the legacy map's 10 groups reach 0.28. b: silhouette by number of groups, flat between 0.06 and 0.08."
        lead="The metformin corpus has no grouping stable enough to map with confidence."
      >
        <b>a</b>, Resampling stability of k-means partitions of the 150 abstract embeddings: median adjusted Rand index between refits on
        20 draws of 80% of the papers. The required 0.80 is never reached; three groups, the most stable, reach 0.63, and the ten groups of the
        original map reach 0.28. <b>b</b>, Cosine silhouette <Ref n={17} /> at each k, which stays below 0.09: the groups barely separate.
      </InteractiveFigure>

      <h2>Coda — a browser demo makes the negation argument visible</h2>
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
          <strong>Retrieve evidence</strong> — over the frozen 150-paper corpus, or <em>any topic</em>: the page searches PubMed directly through NCBI&apos;s E-utilities<Ref n={20} />,
          keeps the top 10, 25 or 50 papers, and embeds them on your machine with a small general-purpose sentence model<Ref n={[8, 9]} />. Live topics get retrieval only, because judging needs a hosted
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

      <h2>Discussion</h2>
      <p>
        The feature the project is named for did not work as first built, and the rebuilt version has a measured error rate: on 21
        held-out claims about a frozen 150-paper corpus, written before any fix and scored once, retrieve-then-entail grounding with
        only-quoted evidence reached 86% verdict accuracy (95% interval 65–95%) against 48% for the original rule. The map is
        similarly calibrated: on this corpus no cluster count is stable (three clusters reach 0.63; the original map&apos;s ten reach
        0.28), so the old ten-group map was mostly arbitrary, and the new one says so, in the demo, beside the map — while the
        pre-registered positive control shows the method recovers structure where structure exists.
      </p>
      <p>
        The caveats are specific. No claim labelled contested exists in either answer key yet, so the accuracy of the one verdict the
        old design could not express remains unmeasured. The judge reads isolated sentences, and organism, dose and comparator
        usually live elsewhere in the abstract, which is why full-abstract context improves verification<Ref n={3} />; where an
        abstract is structured, BACKGROUND sentences are excluded from evidence, but most abstracts in the demo corpus are not
        structured, so this covers a minority of them. Sentence-role classifiers trained on PubMed abstracts<Ref n={18} /> could
        extend it to the rest, and biomedical retrievers such as MedCPT<Ref n={10} /> are a natural alternative to the general
        sentence embeddings<Ref n={[8, 9]} /> used now. The legacy module is still the command-line entry.
      </p>
      <p>
        Retrieval is not the differentiator — general research agents do that well. Calibrated judgement with a known error rate on a
        specific corpus is, and the first error rate now exists.
      </p>

      <h2>Methods</h2>
      <div className="endmatter">
        <p>
          <strong>Corpus layer.</strong> The frozen corpus is 150 papers retrieved from PubMed about metformin. The corpus layer
          parses what PubMed always returned and the original code discarded — PMIDs, without which nothing can be cited; MeSH
          descriptors<Ref n={19} />, which give the knowledge graph an authority so that &ldquo;IL-6&rdquo; and
          &ldquo;interleukin-6&rdquo; are one node; and publication types, so a verdict can distinguish a claim supported by a
          meta-analysis from one supported by a case report.
        </p>
        <p>
          <strong>Original pipeline.</strong> Retrieve abstracts from PubMed, embed and cluster them, generate a thematic summary per
          cluster, extract atomic claims from the user&apos;s free-form reasoning, align each claim to the cluster centroid it sits
          closest to, resolve named entities into a typed knowledge graph, and reflect which claims are well-supported, weakly
          supported or ungrounded, without issuing a grade. This is the design the audit tested.
        </p>
        <p>
          <strong>Check.</strong> Retrieval selects candidate abstracts; abstracts are split into sentences; the sentences nearest
          the claim are chosen; a judge returns one typed stance per sentence, and the verdict — supported, contradicted, contested
          or unsupported — follows from the stances. Evidence is a sentence taken verbatim from the abstract. Where an abstract is
          structured, BACKGROUND sentences are excluded from evidence. Retrieval uses general sentence embeddings<Ref n={[8, 9]} />,
          known to be largely insensitive to negation<Ref n={6} />, so judgement is a separate step. The corpus layer, sentence-level
          grounding and the in-browser retrieval demo are built and tested.
        </p>
        <p>
          <strong>Check evaluation.</strong> Hand-labelled claims about the frozen corpus: 51 development claims, on which errors
          from the first run (55%) were diagnosed and fixed in general form rather than tuned claim by claim, and 21 held-out claims
          written before any fix and scored once. Intervals are 95% Wilson intervals<Ref n={7} />.
        </p>
        <p>
          <strong>Explore.</strong> The embed, cluster and label pattern of BERTopic<Ref n={12} />, with UMAP for display
          <Ref n={11} />, nothing generated: clusters are labelled by their distinctive MeSH terms and represented by the papers
          nearest their centroid. The cluster count is chosen by resampling stability<Ref n={[13, 14]} />: the median adjusted Rand
          index<Ref n={15} /> between k-means refits on 20 draws of 80% of the papers, with 0.80 required; separation is measured by
          the cosine silhouette<Ref n={17} />.
        </p>
        <p>
          <strong>Positive control.</strong> Pre-registered before scoring. Two further frozen corpora with known answers, each the
          union of three PubMed searches: one of three unrelated topics (CRISPR base editing, malaria vaccines, the gut microbiome in
          depression) and one of three related aging interventions (senolytics, rapamycin, caloric restriction). Recovery of the
          known grouping is scored by the adjusted Rand index.
        </p>
      </div>

      <div className="endmatter">
        <h2>Data availability</h2>
        <p>
          All papers are public PubMed abstracts, retrieved through NCBI&apos;s E-utilities<Ref n={20} />. The frozen 150-paper
          metformin corpus, the two positive-control corpora and the hand-labelled claim keys are committed with the project, and the
          judged held-out examples ship with the demo, precomputed from a fresh run of the scored configuration with disagreements
          shown rather than dropped.
        </p>
        <h2>Code availability</h2>
        <p>
          The analysis repository is private. The demo at <a href="/demos/veridian/">/demos/veridian/</a> is public and runs entirely
          in the browser, with no API key and no backend; the legacy module remains the command-line entry.
        </p>
        <h2>Pre-registration statement</h2>
        <p>
          Pre-registered means committed to the project&apos;s own repository before scoring, not lodged with an external registry.
          The Explore positive control was pre-registered with its expected outcome, and the related-topics corpus was recovered
          better than the protocol expected. The held-out Check claims were written before any fix to the pipeline and scored once;
          the development score reached while fixing errors is reported as such, not as evidence. The audit of the original design is
          reported as found, against the repository&apos;s own committed demo payloads.
        </p>
        <h2>Competing interests</h2>
        <p>None.</p>
      </div>

      <h2 id="references">References</h2>
      <ol className="references">
        <li>Wadden D, Lin S, Lo K, et al. Fact or Fiction: Verifying Scientific Claims. <em>Proceedings of EMNLP</em>, 7534–7550 (2020). <a href="https://doi.org/10.18653/v1/2020.emnlp-main.609">doi:10.18653/v1/2020.emnlp-main.609</a>.</li>
        <li>Sarrouti M, Ben Abacha A, Mrabet Y, et al. Evidence-based Fact-Checking of Health-related Claims. <em>Findings of EMNLP</em>, 3499–3512 (2021). <a href="https://doi.org/10.18653/v1/2021.findings-emnlp.297">doi:10.18653/v1/2021.findings-emnlp.297</a>.</li>
        <li>Wadden D, Lo K, Wang LL, et al. MultiVerS: Improving scientific claim verification with weak supervision and full-document context. <em>Findings of NAACL</em>, 61–76 (2022). <a href="https://doi.org/10.18653/v1/2022.findings-naacl.6">doi:10.18653/v1/2022.findings-naacl.6</a>.</li>
        <li>Nicholson JM, Mordaunt M, Lopez P, et al. scite: A smart citation index that displays the context of citations and classifies their intent using deep learning. <em>Quantitative Science Studies</em> 2, 882–898 (2021). <a href="https://doi.org/10.1162/qss_a_00146">doi:10.1162/qss_a_00146</a>.</li>
        <li>Walters WH, Wilder EI. Fabrication and errors in the bibliographic citations generated by ChatGPT. <em>Scientific Reports</em> 13, 14045 (2023). <a href="https://doi.org/10.1038/s41598-023-41032-5">doi:10.1038/s41598-023-41032-5</a>.</li>
        <li>Ettinger A. What BERT Is Not: Lessons from a New Suite of Psycholinguistic Diagnostics for Language Models. <em>Transactions of the Association for Computational Linguistics</em> 8, 34–48 (2020). <a href="https://doi.org/10.1162/tacl_a_00298">doi:10.1162/tacl_a_00298</a>.</li>
        <li>Wilson EB. Probable Inference, the Law of Succession, and Statistical Inference. <em>Journal of the American Statistical Association</em> 22, 209–212 (1927). <a href="https://doi.org/10.1080/01621459.1927.10502953">doi:10.1080/01621459.1927.10502953</a>.</li>
        <li>Reimers N, Gurevych I. Sentence-BERT: Sentence Embeddings using Siamese BERT-Networks. <em>Proceedings of EMNLP-IJCNLP</em>, 3980–3990 (2019). <a href="https://doi.org/10.18653/v1/D19-1410">doi:10.18653/v1/D19-1410</a>.</li>
        <li>Wang W, Wei F, Dong L, et al. MiniLM: Deep Self-Attention Distillation for Task-Agnostic Compression of Pre-Trained Transformers. arXiv 2002.10957 (2020). <a href="https://arxiv.org/abs/2002.10957">arXiv:2002.10957</a>.</li>
        <li>Jin Q, Kim W, Chen Q, et al. MedCPT: Contrastive Pre-trained Transformers with large-scale PubMed search logs for zero-shot biomedical information retrieval. <em>Bioinformatics</em> 39, btad651 (2023). <a href="https://doi.org/10.1093/bioinformatics/btad651">doi:10.1093/bioinformatics/btad651</a>.</li>
        <li>McInnes L, Healy J, Melville J. UMAP: Uniform Manifold Approximation and Projection for Dimension Reduction. arXiv 1802.03426 (2018). <a href="https://arxiv.org/abs/1802.03426">arXiv:1802.03426</a>.</li>
        <li>Grootendorst M. BERTopic: Neural topic modeling with a class-based TF-IDF procedure. arXiv 2203.05794 (2022). <a href="https://arxiv.org/abs/2203.05794">arXiv:2203.05794</a>.</li>
        <li>Ben-Hur A, Elisseeff A, Guyon I. A stability based method for discovering structure in clustered data. <em>Pacific Symposium on Biocomputing</em>, 6–17 (2002). <a href="https://pubmed.ncbi.nlm.nih.gov/11928511/">PMID:11928511</a>.</li>
        <li>Lange T, Roth V, Braun ML, et al. Stability-Based Validation of Clustering Solutions. <em>Neural Computation</em> 16, 1299–1323 (2004). <a href="https://doi.org/10.1162/089976604773717621">doi:10.1162/089976604773717621</a>.</li>
        <li>Hubert L, Arabie P. Comparing partitions. <em>Journal of Classification</em> 2, 193–218 (1985). <a href="https://doi.org/10.1007/BF01908075">doi:10.1007/BF01908075</a>.</li>
        <li>Ben-David S, von Luxburg U, Pál D. A Sober Look at Clustering Stability. <em>Learning Theory (COLT)</em>, LNCS 4005, 5–19 (2006). <a href="https://doi.org/10.1007/11776420_4">doi:10.1007/11776420_4</a>.</li>
        <li>Rousseeuw PJ. Silhouettes: A graphical aid to the interpretation and validation of cluster analysis. <em>Journal of Computational and Applied Mathematics</em> 20, 53–65 (1987). <a href="https://doi.org/10.1016/0377-0427(87)90125-7">doi:10.1016/0377-0427(87)90125-7</a>.</li>
        <li>Dernoncourt F, Lee JY. PubMed 200k RCT: a Dataset for Sequential Sentence Classification in Medical Abstracts. arXiv 1710.06071 (2017). <a href="https://arxiv.org/abs/1710.06071">arXiv:1710.06071</a>.</li>
        <li>Lipscomb CE. Medical Subject Headings (MeSH). <em>Bulletin of the Medical Library Association</em> 88, 265–266 (2000). <a href="https://pubmed.ncbi.nlm.nih.gov/10928714/">PMID:10928714</a>.</li>
        <li>Sayers EW, Bolton EE, Brister JR, et al. Database resources of the National Center for Biotechnology Information. <em>Nucleic Acids Research</em> 50, D20–D26 (2022). <a href="https://doi.org/10.1093/nar/gkab1112">doi:10.1093/nar/gkab1112</a>.</li>
      </ol>
    </>
  );
}
