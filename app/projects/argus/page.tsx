import InteractiveFigure from "../InteractiveFigure";
import Ref from "../Ref";

export const metadata = { title: "argus. — shel." };

export default function ArgusPage() {
  return (
    <>
      <span className="kicker">Project — argus · 2026–</span>
      <h1>Image embeddings outperform a cell count only in wells a knockout has already thinned</h1>
      <p className="byline">
        Shel Burkes, PhD<span className="sep">·</span>Pre-registered 25–26 September 2026<span className="sep">·</span>Fourth run
        scored 26 September 2026
      </p>

      <div className="abstract">
        <span className="abstract-label">Abstract</span>
        High-content screens image millions of wells, and an anomaly detector trained only on normal wells could flag the few
        perturbations that matter without a label for every phenotype in advance. That promise is easy to overstate: a knockout that
        stops cell division leaves fewer cells, and counting cells alone matches many image-based bioactivity benchmarks, so a global
        score may be measuring little more than a count. Whether an image-based detector sees more than a cell count had, for this
        design and dataset, no measured answer. Here we show, across four pre-registered protocols on Recursion&apos;s public
        RxRx3-core, that a dual-branch detector failed as designed — the reconstruction-error branch scored below chance (ROC-AUC
        0.324) and fusion inherited the failure (0.532) — and that embedding-based detection tied a nuclei count on every global
        comparison (0.711 against 0.712) yet, compared only against controls of matching cell count, kept signal the count cannot
        explain (0.690 against 0.521, a difference of 0.169, 95% CI 0.113–0.222). Under the strictest match, drawn within each
        experiment, the effect narrows to 0.608 and disappears in wells with more nuclei than the median control (0.508). What the
        embeddings see beyond a count is real, and confined to wells the knockouts have already thinned.
      </div>

      <p>
        Cell Painting<Ref n={1} /> and its large public successors, including RxRx3<Ref n={[2, 3]} /> and the JUMP genetic map
        <Ref n={16} />, have made image-based detection of genetic perturbations routine, though only a subset of perturbations yields
        a detectable profile<Ref n={[16, 17]} />. An anomaly detector trained only on normal wells could flag the few that matter
        without needing a label for every phenotype in advance<Ref n={11} />. The promise is easy to overstate. A knockout that stops
        cell division leaves fewer cells in the well, and almost any image score will notice that; cell density shapes cellular
        phenotypes generally<Ref n={10} />, and Seal and colleagues recently showed that counting cells alone matches many image-based
        bioactivity benchmarks, recommending a cell-count baseline for any image-based model<Ref n={9} />. Technical variation across
        plates and experiments is a known dominant signal in these data<Ref n={[6, 7, 8]} />, which is why evaluation frameworks
        compare perturbations with same-plate controls<Ref n={18} />. None of these points is new here. What we add is a measurement
        under pre-registered protocols<Ref n={15} /> with plate-level intervals<Ref n={14} />: for this design and dataset, how much
        of a global AUC is cell count and experiment, as the shortcut-learning literature would predict<Ref n={13} />, and what is
        left once both are matched.
      </p>
      <p>
        RxRx3 images six fluorescent channels, a variant of Cell Painting<Ref n={[1, 2]} />. Hoechst, the DNA stain, is excited in the
        UV at about 350 nm; the other five are excited in the visible range. We gave the nuclear channel its own detector, a
        convolutional autoencoder scored by reconstruction error, and covered the rest with an Isolation Forest<Ref n={5} /> over the
        pre-computed OpenPhenom embeddings released with the dataset<Ref n={3} />, from a masked-autoencoder model of the kind
        described by Kraus and colleagues<Ref n={4} />, fusing the two scores by averaging their ranks. One caveat surfaced while the
        first protocol was being written: OpenPhenom embeds all six channels, Hoechst included, so the embedding branch was never
        UV-free, and the fusion question became narrower — does a Hoechst-only autoencoder add anything to a model that has already
        seen Hoechst? Four protocols were fixed in advance and each test set was scored once (Box 1, Methods).
      </p>

      <aside className="box">
        <span className="box-lead">Box 1 | How to read the verdicts</span>
        <p>
          <strong>Pre-registered</strong> means each protocol was committed before its detectors were trained or its test wells
          loaded: the split, the settings, the direction of every score, the comparisons that matter, and a written expectation of the
          result. Each <strong>held-out</strong> test set consists of experiments no earlier run had touched, and was{" "}
          <strong>scored once</strong>; wrong expectations stay in the protocol as written, and any analysis made after seeing a score
          is labelled <strong>after scoring</strong>. Intervals come from a <strong>plate bootstrap</strong>, which resamples whole
          plates because wells on a plate share a batch. A <strong>matched</strong> comparison scores each knockout well only against
          control wells with a similar cell count, so a score that only counts cells has almost nothing to work with.
        </p>
      </aside>

      <h2>Reconstruction error scores depleted wells as more normal, not less</h2>
      <p>
        On the first held-out set — 848 wells on 54 plates from six experiments, scored once (Methods) — the autoencoder reached an
        AUC of 0.324 (Table 1, Fig. 1a), well below chance: knockout wells reconstructed <em>better</em> than controls. Fewer nuclei
        leave more empty background, which an autoencoder reproduces easily, so &ldquo;higher error means more anomalous&rdquo; fails
        for exactly the phenotype it was meant to catch. Deep generative models are known to score simpler inputs as more normal
        <Ref n={12} />; control-trained anomaly methods that work on Cell Painting score features, not pixels<Ref n={11} />. The
        protocol fixed the direction before scoring, so the score was not flipped afterwards. It carries signal, but it is not an
        anomaly detector as designed.
      </p>
      <p>
        Fusion inherited that failure. Rank-averaging a reversed score with a good one landed near chance at 0.532, 0.179 below the
        embedding branch alone (95% CI 0.152–0.206) — and this was the comparison the whole design rested on. The embeddings
        themselves saw about as much as a cell count: overall they tied the baseline, 0.711 against 0.712, better on PLK1 and worse on
        MTOR. The score distributions show why: the embeddings catch a tail of strongly shifted knockout wells, but most knockouts
        overlap the controls. The Isolation Forest added nothing over a plain distance to the normal centroid (+0.004, CI −0.001 to
        +0.009).
      </p>
      <p>
        <strong>Table 1 | First run.</strong> ROC-AUC for flagging PLK1 and MTOR knockouts against control wells on six held-out
        experiments, with 95% intervals from a bootstrap over plates.
      </p>
      <table>
        <thead>
          <tr>
            <th>Detector</th>
            <th>ROC-AUC (95% CI)</th>
            <th>PLK1</th>
            <th>MTOR</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nuclei count (baseline)</td>
            <td>0.712 (0.686–0.740)</td>
            <td>0.787</td>
            <td>0.638</td>
          </tr>
          <tr>
            <td>Embeddings, Isolation Forest</td>
            <td>0.711 (0.676–0.745)</td>
            <td>0.831</td>
            <td>0.591</td>
          </tr>
          <tr>
            <td>Embeddings, centroid distance</td>
            <td>0.707 (0.672–0.741)</td>
            <td>0.825</td>
            <td>0.589</td>
          </tr>
          <tr>
            <td>Fused</td>
            <td>0.532 (0.498–0.568)</td>
            <td>0.559</td>
            <td>0.505</td>
          </tr>
          <tr>
            <td>UV autoencoder</td>
            <td>0.324 (0.297–0.348)</td>
            <td>0.233</td>
            <td>0.415</td>
          </tr>
        </tbody>
      </table>
      <p>
        The written expectation was partly wrong, and it stays in the protocol as written. It predicted near-perfect separation of
        PLK1 by the embeddings (they reached 0.83), weaker MTOR (true), an autoencoder that mostly tracks cell count (it tracks it
        inversely), and no gain from fusion (true, and worse than expected).
      </p>

      <h2>The failure replicated, and linear regression could not remove the cell count</h2>
      <p>
        Two repairs followed from the first result, and both were designed after seeing it. Scoring them on the same held-out
        experiments would reuse a test set that had already shaped them, so the second protocol scored them once on eight experiments
        nobody had touched: 1,150 wells, 862 knockouts, 72 plates. The first result replicated: on new experiments the whole-image
        autoencoder scored in the wrong direction again, and the embeddings tied the cell count again (Table 2, Fig. 1b). Scoring
        nuclear pixels removed the inversion and left nothing — once empty background could no longer lower the error, the autoencoder
        sat at chance, 0.22 below the cell count.
      </p>
      <p>
        <strong>Table 2 | Second run.</strong> ROC-AUC on eight experiments no earlier run had scored, with 95% intervals from the
        plate bootstrap.
      </p>
      <table>
        <thead>
          <tr>
            <th>Detector</th>
            <th>ROC-AUC (95% CI)</th>
            <th>MTOR (95% CI)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Nuclei count (baseline)</td>
            <td>0.703 (0.676–0.731)</td>
            <td>0.615 (0.586–0.645)</td>
          </tr>
          <tr>
            <td>Embeddings, Isolation Forest</td>
            <td>0.724 (0.693–0.757)</td>
            <td>0.598 (0.554–0.644)</td>
          </tr>
          <tr>
            <td>Embeddings, cell count regressed out</td>
            <td>0.712 (0.676–0.748)</td>
            <td>0.584 (0.534–0.634)</td>
          </tr>
          <tr>
            <td>UV autoencoder, nuclear pixels only</td>
            <td>0.480 (0.448–0.512)</td>
            <td>0.499 (0.467–0.532)</td>
          </tr>
          <tr>
            <td>UV autoencoder, whole image (v1)</td>
            <td>0.321 (0.293–0.348)</td>
            <td>0.424 (0.393–0.453)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Removing cell count did not remove it. The pre-registered check passed: with cell count regressed out of the embeddings, MTOR
        knockouts still scored above chance (0.58). But a check made after scoring showed the residualized score still tracked cell
        count almost as strongly as before (Spearman −0.48, against −0.51), and ranked wells almost exactly as the original did. A
        linear regression per embedding dimension cannot remove a nonlinear dependence, so that 0.58 cannot be called signal beyond
        cell count. The control did not do its job, and we report that rather than the pass.
      </p>

      <InteractiveFigure
        n={1}
        src="/projects/argus/fig1_runs.png"
        spec="/projects/argus/interactive/fig1.json"
        slug="argus"
        alt="Three panels, one per test set, each showing ROC-AUC with 95% intervals. In all three the nuclei count and the embeddings sit at about 0.70 inside the same band; the whole-image autoencoder sits at 0.32 in v1 and v2; the nuclear-pixel autoencoder at about 0.48 to 0.50; fusion at 0.53 in v1."
        lead="Across three sets of experiments, nothing beats counting nuclei when wells are compared overall."
      >
        ROC-AUC for flagging PLK1 and MTOR knockouts against control wells, with 95% intervals from a bootstrap over plates. The shaded
        band is the nuclei count&apos;s interval; the dotted line is chance. <b>a</b>, v1, six held-out experiments. <b>b</b>, v2, eight
        experiments nobody had scored. <b>c</b>, v3, fifteen more, compared without matching (the matched comparison is Fig. 2). Each
        test set was scored once.
      </InteractiveFigure>

      <h2>Compared only with controls of matching cell count, the embeddings keep their signal</h2>
      <p>
        Regression tried to take cell count out of the score. The third protocol takes it out of the comparison instead: control wells
        are cut into ten bins by nuclei fraction, and each knockout is compared only with controls in its own bin. Inside a bin, a
        score that only counts nuclei has almost nothing to work with, so the protocol builds in a check — the cell count itself must
        score between 0.45 and 0.55, or the bins did not do their job. It was scored once on fifteen more experiments nobody had
        touched: 2,108 wells on 135 plates, with 1,533 of 1,578 knockouts having a control with a matching count.
      </p>
      <p>
        The check passed, and the embeddings kept their signal (Table 3). With count matched, the cell count fell to 0.521, as it
        should. The embeddings held at 0.690, 0.169 above it (95% CI 0.113–0.222), and the subtler MTOR knockouts stayed above chance
        at 0.579. This is the first argus result a cell count cannot explain. Unmatched, the embeddings tied the count for the third
        time (Fig. 1c), which is exactly why the earlier runs could not see the difference: a global metric rewards whatever shortcut
        the data offers<Ref n={13} />.
      </p>
      <p>
        <strong>Table 3 | Third run.</strong> AUC with each knockout compared only against controls in its own nuclei-fraction decile,
        on fifteen experiments no earlier run had scored, with 95% intervals from the plate bootstrap.
      </p>
      <table>
        <thead>
          <tr>
            <th>Detector</th>
            <th>Matched AUC (95% CI)</th>
            <th>MTOR matched (95% CI)</th>
            <th>Unmatched</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Embeddings, Isolation Forest</td>
            <td>0.690 (0.651–0.724)</td>
            <td>0.579 (0.540–0.615)</td>
            <td>0.700</td>
          </tr>
          <tr>
            <td>UV autoencoder, nuclear pixels only</td>
            <td>0.555 (0.516–0.594)</td>
            <td>0.551 (0.515–0.586)</td>
            <td>0.500</td>
          </tr>
          <tr>
            <td>Nuclei count (baseline)</td>
            <td>0.521 (0.480–0.562)</td>
            <td>0.491 (0.453–0.527)</td>
            <td>0.686</td>
          </tr>
        </tbody>
      </table>
      <InteractiveFigure
        n={2}
        src="/projects/argus/fig2_matched.png"
        spec="/projects/argus/interactive/fig2.json"
        slug="argus"
        alt="Three panels. a: stacked bars of wells per nuclei-fraction decile; about 53 controls in each, and the first decile holding 412 PLK1 and 184 MTOR wells. b: AUC within each decile; the nuclei count stays between 0.44 and 0.59; the embeddings reach 0.85, 0.74 and 0.68 in deciles 1 to 3 and 0.39 to 0.63 in the rest. c: unmatched versus matched AUC; the nuclei count falls from 0.69 to 0.52, the embeddings stay at 0.69, MTOR at 0.58; post hoc within-experiment matching gives 0.59 and 0.55."
        lead="Matched on cell count, the embeddings still separate knockouts, mostly among the most depleted wells."
      >
        <b>a</b>, Wells in each decile of the controls&apos; nuclei fraction: every decile holds about 53 controls, and PLK1 knockouts pile
        into the first. <b>b</b>, AUC inside each decile. The nuclei count has almost nothing to work with anywhere (0.44–0.59); the
        embeddings are strongest in the three lowest-count deciles and near chance above them. This per-decile view was drawn after
        scoring. <b>c</b>, Each detector unmatched (open) and matched (filled, 95% interval). Light markers: deciles drawn within each
        experiment, a stricter match checked after scoring.
      </InteractiveFigure>
      <p>
        Figure 2b, drawn after scoring, adds a qualification. The embeddings&apos; matched signal is concentrated among the wells with the
        fewest nuclei: 0.85, 0.74 and 0.68 in the three lowest deciles, between 0.39 and 0.63 in the other seven. What they see beyond a
        count is mostly in wells the knockouts have already thinned, not across the whole range.
      </p>
      <p>
        Two expectations were wrong. The protocol predicted that most PLK1 wells would have fewer nuclei than any control and drop out
        of the comparison; only 30 of 791 did. PLK1 thins wells without emptying them. It also predicted the nuclear-pixel autoencoder
        would stay at chance; matched on count, it came out slightly above (0.555). A further check made after scoring, labelled as
        such: twenty bins instead of ten change nothing, but bins drawn within each experiment — a stricter match with only about 35
        controls per experiment — shrink the effect to 0.588 overall, still above chance, while MTOR alone falls to 0.548, with an
        interval that includes 0.5. The overall finding survives every binning tried; the MTOR finding survives only the one fixed in
        advance, which is why the next run made the stricter match its primary test.
      </p>

      <h2>Under the strictest match, the signal remains, and only in depleted wells</h2>
      <p>
        The fourth protocol took the two checks made after the third run and fixed them in advance, on fifteen more experiments nobody
        had scored: 2,064 wells on 135 plates. Controls are binned by decile within each experiment, so a knockout is only ever compared
        with controls from its own experiment and its own cell-count range, as profiling benchmarks compare perturbations with
        same-plate controls<Ref n={18} />. Inside those bins the nuclei count scored 0.490, so the match held.
      </p>
      <p>
        <strong>Table 4 | Fourth run.</strong> Matched AUC for the embedding branch on fifteen further experiments, with controls
        binned by decile within each experiment; 95% intervals from the plate bootstrap.
      </p>
      <table>
        <thead>
          <tr>
            <th>Comparison, embeddings</th>
            <th>Matched AUC (95% CI)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>All knockouts, within experiment</td>
            <td>0.608 (0.559–0.649)</td>
          </tr>
          <tr>
            <td>MTOR alone</td>
            <td>0.545 (0.490–0.596)</td>
          </tr>
          <tr>
            <td>Wells with more nuclei than the median control</td>
            <td>0.508 (0.428–0.588)</td>
          </tr>
          <tr>
            <td>Global deciles, as in the third run</td>
            <td>0.689 (0.656–0.719)</td>
          </tr>
        </tbody>
      </table>
      <p>
        Every expectation written into the protocol held (Table 4). Under the strictest match tried, the embeddings still see
        something beyond cell count, but only among wells a knockout has already thinned: above the median count they are at chance.
        The subtler MTOR phenotype is not detected, per well and from one imaging site; Recursion uses MTOR as a positive control,
        which suggests it becomes visible when many wells and guides are aggregated. That is a narrower claim than the third run
        suggested, and a firmer one.
      </p>

      <h2>Discussion</h2>
      <p>
        Across four pre-registered protocols on RxRx3-core, the dual-branch design failed its own test — reconstruction error scored
        depleted wells as more normal, and fusion with the reversed score fell to near chance — while the embedding branch tied a
        nuclei count on every global comparison and beat it only once the comparison was restricted to controls of the same cell
        count. What the embeddings see beyond a count is real, replicated under two matching schemes, and confined to wells the
        knockouts have already thinned; above the median cell count they are at chance, and the subtler MTOR phenotype is not detected
        per well from one imaging site.
      </p>
      <p>
        Several limits bound the claim. One cell type, one imaging site per well, 54 of 176 CRISPR experiments across four test sets,
        and two anomaly genes. The autoencoder runs at 128 × 128, which may lose nuclear detail. The embeddings are OpenPhenom&apos;s
        alone; no image model was trained on the visible channels. None of this rescues the design: the autoencoder&apos;s failure
        comes from what reconstruction error rewards, not from sample size.
      </p>
      <p>
        The open question is what the embeddings see in depleted wells. The next step is to name it, by comparing knockouts and
        controls within the lowest-count bins on interpretable features such as nuclear size, shape and intensity.
      </p>

      <h2>Methods</h2>
      <div className="endmatter">
        <p>
          <strong>Data.</strong> Recursion&apos;s public RxRx3-core<Ref n={3} />: HUVEC cells imaged in six fluorescent channels, a
          variant of Cell Painting<Ref n={[1, 2]} />, at one imaging site per well, from the 16 CRISPR experiments that sit entirely
          inside two dataset shards. Normal wells carry intron and exon control guides, which target no gene function. Anomalous wells
          are the PLK1 and MTOR knockouts that every experiment includes as positive controls: PLK1 stops cell division<Ref n={19} />;
          MTOR&apos;s phenotype, a change in cell size<Ref n={20} />, is subtler.
        </p>
        <p>
          <strong>Detectors.</strong> A convolutional autoencoder on the Hoechst (nuclear) channel at 128 × 128, scored by
          reconstruction error; an Isolation Forest<Ref n={5} /> over the pre-computed OpenPhenom embeddings released with the
          dataset<Ref n={3} />, with a plain distance to the normal centroid as a comparator; and a fused score averaging the two
          branches&apos; ranks. The fixed baseline is the fraction of Hoechst-bright pixels: a cell count, nothing more.
        </p>
        <p>
          <strong>First protocol.</strong> Committed before any detector was trained<Ref n={15} />. It fixed the split by experiment
          (10 to fit, 6 held out), the settings, the direction of every score, the three comparisons that matter, and a written
          expectation of the result. Detectors were fitted on 359 normal wells and never saw a knockout. The held-out set — 848 wells
          on 54 plates — was scored once.
        </p>
        <p>
          <strong>Uncertainty.</strong> Intervals come from a bootstrap that resamples whole plates<Ref n={14} />, because wells on a
          plate share a batch, and batch effects are a dominant signal in these data<Ref n={[6, 7, 8]} />.
        </p>
        <p>
          <strong>Second protocol.</strong> Two repairs designed after the first result — scoring the autoencoder on nuclear pixels
          only, and regressing cell count out of each embedding dimension — scored once on eight experiments no earlier run had
          touched: 1,150 wells, 862 knockouts, 72 plates.
        </p>
        <p>
          <strong>Third protocol.</strong> Control wells cut into ten bins by nuclei fraction; each knockout compared only with
          controls in its own bin, with the built-in check that the cell count itself score between 0.45 and 0.55. Scored once on
          fifteen further experiments: 2,108 wells on 135 plates; 1,533 of 1,578 knockouts had a control with a matching count.
        </p>
        <p>
          <strong>Fourth protocol.</strong> The two checks made after the third run, fixed in advance: deciles drawn within each
          experiment, so a knockout is compared only with controls from its own experiment and cell-count range<Ref n={18} />, and
          the above-median comparison. Scored once on fifteen more experiments: 2,064 wells on 135 plates; the within-bin nuclei count
          scored 0.490.
        </p>
        <p>
          <strong>Verification.</strong> All four protocols, the detectors, the plate bootstrap and the results are committed with 14
          unit tests, and the whole evaluation reruns in about a minute on a laptop.
        </p>
      </div>

      <div className="endmatter">
        <h2>Data availability</h2>
        <p>
          We used the RxRx3-core dataset, available from Recursion Pharmaceuticals at{" "}
          <a href="https://www.rxrx.ai" target="_blank" rel="noopener">
            rxrx.ai
          </a>
          , under Recursion&apos;s licensing terms. The dataset was not modified. No images or trained models are committed with the
          project, because the dataset licence treats trained models as derivative technology.
        </p>
        <h2>Code availability</h2>
        <p>
          The analysis repository is private. The four protocols — settings, score directions, comparisons and written expectations —
          are summarized here and recorded in full in the project&apos;s protocol documents, alongside the committed results and unit
          tests.
        </p>
        <h2>Pre-registration statement</h2>
        <p>
          Pre-registered means committed to the project&apos;s own repository before the corresponding detectors were trained or test
          wells loaded, not lodged with an external registry. Four protocols to date, each scored once on experiments no earlier run
          had touched; wrong written expectations stay in the protocols as written, and every analysis made after seeing a score is
          labelled as such above. The one deviation was an Apple-silicon training crash fixed before any score was produced; no
          setting changed.
        </p>
        <h2>Competing interests</h2>
        <p>None.</p>
      </div>

      <h2 id="references">References</h2>
      <ol className="references">
        <li>Bray MA, Singh S, Han H, et al. Cell Painting, a high-content image-based assay for morphological profiling using multiplexed fluorescent dyes. <em>Nature Protocols</em> 11, 1757–1774 (2016). <a href="https://doi.org/10.1038/nprot.2016.105">doi:10.1038/nprot.2016.105</a>.</li>
        <li>Fay MM, Kraus O, Victors M, et al. RxRx3: Phenomics map of biology. <em>bioRxiv</em> (2023). <a href="https://doi.org/10.1101/2023.02.07.527350">doi:10.1101/2023.02.07.527350</a>.</li>
        <li>Kraus O, Comitani F, Urbanik J, et al. RxRx3-core: Benchmarking drug-target interactions in high-content microscopy. arXiv 2503.20158 (2025). <a href="https://arxiv.org/abs/2503.20158">arXiv:2503.20158</a>. Data: <a href="https://huggingface.co/datasets/recursionpharma/rxrx3-core">recursionpharma/rxrx3-core</a>, Recursion licence.</li>
        <li>Kraus O, Kenyon-Dean K, Saberian S, et al. Masked autoencoders for microscopy are scalable learners of cellular biology. <em>Proceedings of IEEE/CVF CVPR</em>, 11757–11768 (2024). <a href="https://doi.org/10.1109/CVPR52733.2024.01117">doi:10.1109/CVPR52733.2024.01117</a>.</li>
        <li>Liu FT, Ting KM, Zhou ZH. Isolation Forest. <em>Proceedings of IEEE ICDM</em>, 413–422 (2008). <a href="https://doi.org/10.1109/ICDM.2008.17">doi:10.1109/ICDM.2008.17</a>.</li>
        <li>Caicedo JC, Cooper S, Heigwer F, et al. Data-analysis strategies for image-based cell profiling. <em>Nature Methods</em> 14, 849–863 (2017). <a href="https://doi.org/10.1038/nmeth.4397">doi:10.1038/nmeth.4397</a>.</li>
        <li>Arevalo J, Su E, Ewald JD, et al. Evaluating batch correction methods for image-based cell profiling. <em>Nature Communications</em> 15, 6516 (2024). <a href="https://doi.org/10.1038/s41467-024-50613-5">doi:10.1038/s41467-024-50613-5</a>.</li>
        <li>Sypetkowski M, Rezanejad M, Saberian S, et al. RxRx1: A dataset for evaluating experimental batch correction methods. <em>Proceedings of IEEE/CVF CVPR Workshops</em>, 4285–4294 (2023). <a href="https://doi.org/10.1109/CVPRW59228.2023.00451">doi:10.1109/CVPRW59228.2023.00451</a>.</li>
        <li>Seal S, Dee W, Shah A, et al. Counting cells can accurately predict small-molecule bioactivity benchmarks. <em>Nature Communications</em> 17, 2436 (2026). <a href="https://doi.org/10.1038/s41467-026-68725-5">doi:10.1038/s41467-026-68725-5</a>.</li>
        <li>Snijder B, Sacher R, Rämö P, et al. Population context determines cell-to-cell variability in endocytosis and virus infection. <em>Nature</em> 461, 520–523 (2009). <a href="https://doi.org/10.1038/nature08282">doi:10.1038/nature08282</a>.</li>
        <li>Shpigler A, Kolet N, Golan S, et al. Anomaly detection for high-content image-based phenotypic cell profiling. <em>Cell Systems</em> 16, 101429 (2025). <a href="https://doi.org/10.1016/j.cels.2025.101429">doi:10.1016/j.cels.2025.101429</a>.</li>
        <li>Nalisnick E, Matsukawa A, Teh YW, et al. Do deep generative models know what they don&apos;t know? <em>ICLR</em> (2019). <a href="https://arxiv.org/abs/1810.09136">arXiv:1810.09136</a>.</li>
        <li>Geirhos R, Jacobsen JH, Michaelis C, et al. Shortcut learning in deep neural networks. <em>Nature Machine Intelligence</em> 2, 665–673 (2020). <a href="https://doi.org/10.1038/s42256-020-00257-z">doi:10.1038/s42256-020-00257-z</a>.</li>
        <li>Field CA, Welsh AH. Bootstrapping clustered data. <em>Journal of the Royal Statistical Society Series B</em> 69, 369–390 (2007). <a href="https://doi.org/10.1111/j.1467-9868.2007.00593.x">doi:10.1111/j.1467-9868.2007.00593.x</a>.</li>
        <li>Nosek BA, Ebersole CR, DeHaven AC, et al. The preregistration revolution. <em>Proceedings of the National Academy of Sciences</em> 115, 2600–2606 (2018). <a href="https://doi.org/10.1073/pnas.1708274114">doi:10.1073/pnas.1708274114</a>.</li>
        <li>Chandrasekaran SN, Alix E, Arevalo J, et al. Morphological map of under- and overexpression of genes in human cells. <em>Nature Methods</em> 22, 1742–1752 (2025). <a href="https://doi.org/10.1038/s41592-025-02753-9">doi:10.1038/s41592-025-02753-9</a>.</li>
        <li>Rohban MH, Singh S, Wu X, et al. Systematic morphological profiling of human gene and allele function via Cell Painting. <em>eLife</em> 6, e24060 (2017). <a href="https://doi.org/10.7554/eLife.24060">doi:10.7554/eLife.24060</a>.</li>
        <li>Kalinin AA, Arevalo J, Serrano E, et al. A versatile information retrieval framework for evaluating profile strength and similarity. <em>Nature Communications</em> 16, 5181 (2025). <a href="https://doi.org/10.1038/s41467-025-60306-2">doi:10.1038/s41467-025-60306-2</a>.</li>
        <li>Sumara I, Giménez-Abián JF, Gerlich D, et al. Roles of polo-like kinase 1 in the assembly of functional mitotic spindles. <em>Current Biology</em> 14, 1712–1722 (2004). <a href="https://doi.org/10.1016/j.cub.2004.09.049">doi:10.1016/j.cub.2004.09.049</a>.</li>
        <li>Fingar DC, Salama S, Tsou C, et al. Mammalian cell size is controlled by mTOR and its downstream targets S6K1 and 4EBP1/eIF4E. <em>Genes &amp; Development</em> 16, 1472–1487 (2002). <a href="https://doi.org/10.1101/gad.995802">doi:10.1101/gad.995802</a>.</li>
      </ol>
    </>
  );
}
