import Figure from "../Figure";

export const metadata = { title: "lambent. — shel." };

export default function LambentPage() {
  return (
    <>
      <span className="kicker">Project — 2023–</span>
      <h1>lambent.</h1>
      <p className="tagline">
        The first computational quantification of skin radiance — turning a word used by dermatologists and marketers into a number that
        survives contact with expert judgment.
      </p>

      <h2>Why this exists</h2>
      <p>
        Radiance, glow, luminosity: the vocabulary around skin appearance is rich and almost entirely qualitative. Graders can rank two
        faces reliably and cannot say what they are ranking on. That is a measurement problem before it is a modeling problem — there was
        no target variable to predict, because nobody had defined what was being measured. lambent exists to construct that definition from
        physiological image features, and then to test whether it agrees with people who grade for a living.
      </p>

      <h2>Approach</h2>
      <p>
        Features are extracted per region — full face, center, forehead, both cheeks, chin — with optional face detection anchoring the
        regions, then aggregated to subject level. The feature space is deliberately interpretable rather than learned: CIE Lab and ITA for
        tone, hue statistics, texture descriptors, and explicit specular, red, and dark proxies. Composite scores are computed at image,
        subject-region, and subject level, and the composition is transparent by design — a score you cannot decompose is a score nobody
        will trust or act on. Supervised modeling is optional and only engages when grading labels are present.
      </p>
      <p>
        The methodology went through six versions, and that history is the substance of the project. Each iteration tightened what counted
        as signal versus artifact: specular highlights that read as glow but are really lighting, tone shifts that are really white
        balance, texture that is really compression. Ingestion works from either a folder hierarchy or a manifest CSV, so the pipeline is
        dataset-agnostic.
      </p>

      <h2>Key results</h2>
      <p>
        lambent was developed independently on public data. A consulting client later applied the method to its own data and
        validated it against the client&apos;s expert grading. Those figures belong to the client&apos;s data and are not reproducible
        from anything public, so the open repository does not cite them — it carries its own validation instead.
      </p>

      <h2>Validating a metric with no ground truth</h2>
      <p>
        Public dermatology datasets label skin <em>type</em>, not radiance. There is nothing to correlate a glow score against. So the
        open validation asks what can be answered without labels, by perturbation with a known dose: add a controlled specular highlight
        to a real image, or brighten it globally with a gamma curve, or add fine noise, and measure how the score tracks the dose. Gamma
        is the control that carries the argument, because it raises lightness while adding no gloss whatsoever.
      </p>
      <p>
        On 1,816 Fitzpatrick17k images stratified across all six skin types, the score tracks added gloss at median Spearman
        {" "}<strong>&rho; = 1.00</strong> — and tracks plain brightening at <strong>&rho; = 1.00</strong> as well. It does not separate
        gloss from lightness. That follows from its own definition, in which mean <code>L*</code> carries a +0.25 weight. Skin tone
        explains roughly <strong>28.5%</strong> of the score&apos;s variance, and mean glow declines monotonically from Fitzpatrick type 1
        to type 6.
      </p>
      <p>
        That gradient&apos;s <em>size</em>, though, is not established — and why not is the more interesting result.
        Fitzpatrick17k is scraped clinical photography: no controlled illumination, no camera calibration, no colour reference in frame.
        Re-scoring each image under capture changes that cannot alter how glossy skin actually is shows a quarter-stop exposure difference
        moving the score by <strong>~51%</strong> of the entire type-1-to-type-6 span, half a stop by 90%, and a 10% white-balance drift by
        ~40%. The metric is about as sensitive to the camera as to several steps of skin type, so nothing in this dataset separates the
        two. The within-image findings are untouched, because there each image is its own control and illumination is fixed by
        construction.
      </p>
      <Figure
        n={1}
        src="/projects/lambent/fig1_original.png"
        alt="Three panels. a: histogram of per-image Spearman correlations between score and dose for added gloss and for plain brightening; both pile up at 1. b: mean score by Fitzpatrick type falling from 0.37 for type I to minus 0.34 for type VI. c: score shift under capture changes as a share of that type span: exposure minus half a stop 77%, minus a quarter 50%, plus a quarter 51%, plus half 90%, white balance warmer 41%, cooler 36%."
        lead="The original score cannot tell gloss from brightness, and the camera moves it about as far as skin type does."
      >
        <b>a</b>, For 250 images, the Spearman correlation between the original score (v6) and six increasing doses of added specular
        highlight or of plain gamma brightening. Both sit at 1 for almost every image. <b>b</b>, Mean score by Fitzpatrick type on the same
        250 images; the arrow marks the type I–VI span. <b>c</b>, Mean absolute score change when each image is re-rendered under a capture
        change that leaves the skin untouched, as a share of that span. White-balance changes are 10%.
      </Figure>
      <p>
        The finding that matters most is that the obvious repair fails. Dropping the lightness term and keeping the specular one does not
        give a tone-neutral metric, because the specular detector counts pixels over an <em>absolute</em> brightness threshold and is
        itself 5.3&times; higher on the lightest skin than the darkest. A tone-independent radiance metric needs highlight contrast
        measured against each image&apos;s own baseline rather than a fixed cut — a concrete specification for the next version, arrived
        at by measurement rather than by argument.
      </p>
      <p>
        None of this makes the measurement useless. It establishes that what the metric captures is surface reflectance
        <em> including</em> lightness, under whatever illumination the photograph was taken in — a defensible thing to call radiance on a
        fixed capture rig, which is what the original engagement had and what public dermatology data does not. Exposure and white-balance
        sensitivity are now the acceptance criterion for a revised metric.
      </p>

      <h2>Letting the measurement specify its replacement</h2>
      <p>
        That gave an acceptance criterion rather than a complaint: keep the response to gloss, lose the response to brightness, bring
        capture sensitivity down. Seven variants were then scored through identical experiments, so every change was attributable rather
        than bundled. Tone dependence ends at <strong>ρ² = 0.002</strong>, down from 0.310, and worst-case capture sensitivity at
        <strong>59.4%</strong>, down from 93.2% — while the response to real gloss improves.
      </p>
      <Figure
        n={2}
        src="/projects/lambent/fig2_variants.png"
        alt="Three panels, one row per variant from v6 to v11. a: correlation with added gloss and with brightening; v6 and v6 without lightness respond to both at 1, later variants respond positively to gloss (0.74 to 0.83) and negatively to brightening. b: tone dependence, 0.310 for v6 falling to 0.002 for v11, with v7 at 0.074 and v10 at 0.044 but v8 and v9 back near 0.28. c: worst capture shift, 93% for v6 and 59% for v11, 70 to 80% in between."
        lead="Seven variants, each scored through the same experiments; the last is tone-neutral and the least sensitive to the camera."
      >
        <b>a</b>, Each variant&apos;s Spearman correlation with the dose of added gloss (circle) and of plain brightening (square). A
        good score keeps the circle high and does not follow the square. <b>b</b>, Share of score variance explained by Fitzpatrick type
        (ρ²). <b>c</b>, The worst mean score shift across the six capture changes, as a share of the score&apos;s spread across images — a
        denominator that stays comparable when a variant removes the tone gradient. v11 (highlighted) is the recommended default.
      </Figure>
      <p>
        Three of those variants are failures, and they are kept because the sequence is the argument. Deleting the lightness term does
        nothing, because the remaining terms are absolute too. Re-expressing everything as ratios fixes exposure and <em>breaks</em> white
        balance, since the specular test gates on saturation and warming an image raises saturation — repaired by von Kries normalisation,
        because an illuminant change is to first order a diagonal transform <code>R→aR, G→bG, B→cB</code>, so dividing each channel by a
        statistic of itself cancels it.
      </p>
      <p>
        The most useful failure was the next one. The residual tone dependence was hypothesised to be that same normalisation amplifying
        sensor noise on darker skin, which carries least signal above the floor. That correction was implemented in full — per-image noise
        estimation, spread terms reduced in quadrature — and changed nothing, because the measured noise floor is about 2% of the skin
        median against relative spreads of 20–37%.
      </p>
      <p>
        Ruling it out identified the real cause, and it was colour science rather than statistics. Von Kries is a <em>linear</em> model,
        and sRGB pixel values are not radiance: under a ~1/2.2 transfer curve, a fixed linear ratio maps to different encoded ratios
        depending on level — which on skin means depending on skin tone. Undoing the curve first takes the specular term&apos;s own tone
        correlation from +0.47 to −0.08. Weighting the metric onto that now-neutral term is the final variant, and it requires excluding
        clipped pixels from the measurement region: a saturated pixel is maximally bright and minimally saturated, which is precisely the
        specular signature, so without the exclusion raising exposure manufactures gloss that was never in the scene.
      </p>
      <p>
        What remains unfixed is stated alongside it. Every variant still responds to a tone curve, because gamma is not a diagonal
        transform and no per-channel gain cancels one. Residual exposure sensitivity is bounded by clipping already present in the source.
        And tone neutrality is established on a single source atlas.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed.</strong> The open repository reproduces the method, carries its own reproducible validation and the
        illumination-invariant metric that validation specified,
        generated into the repo from the run&apos;s own output so the documented numbers cannot drift from the run that produced them.
        The client engagement&apos;s figures are described but not claimed here.
      </p>
    </>
  );
}
