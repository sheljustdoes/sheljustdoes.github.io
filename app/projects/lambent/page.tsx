import InteractiveFigure from "../InteractiveFigure";

export const metadata = { title: "lambent. — shel." };

export default function LambentPage() {
  return (
    <>
      <span className="kicker">Project — 2023–</span>
      <h1>lambent.</h1>
      <p className="tagline">
        An interpretable, capture-audited measure of skin radiance — turning a word used by dermatologists and marketers into a number that
        survives contact with expert judgment and with the camera.
      </p>

      <h2>Why this exists</h2>
      <p>
        Radiance, glow, luminosity: the vocabulary around skin appearance is rich and almost entirely qualitative. Graders can rank two
        faces reliably and cannot say what they are ranking on. That is a measurement problem before it is a modeling problem, a question of
        construct validity [16]. Radiance has been quantified before, with optical devices, image models calibrated to expert and consumer
        grading, and polarized imaging on controlled rigs [1–4]; there is still no shared definition that transfers to ordinary photographs.
        lambent builds a transparent one from physiological image features, tests whether it agrees with people who grade for a living, and
        audits how far the camera moves it.
      </p>

      <h2>Approach</h2>
      <p>
        Features are extracted per region — full face, center, forehead, both cheeks, chin — with optional face detection anchoring the
        regions, then aggregated to subject level. The feature space is deliberately interpretable rather than learned: CIE Lab and ITA [7, 8] for
        tone, hue statistics, texture descriptors, and explicit specular, red, and dark proxies; the specular proxy follows the dichromatic reflection model, in which highlights
        carry the illuminant&apos;s colour [11]. Composite scores are computed at image,
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
        On 1,816 Fitzpatrick17k images [5] stratified across all six skin types [6], the score tracks added gloss at median Spearman
        {" "}<strong>&rho; = 1.00</strong> — and tracks plain brightening at <strong>&rho; = 1.00</strong> as well. It does not separate
        gloss from lightness. That follows from its own definition, in which mean <code>L*</code> carries a +0.25 weight. The weight is not
        arbitrary: perceived radiance depends on both a surface (gloss) and a subsurface, lightness-like component [3], and perceived gloss
        and lightness share the same luminance cues [12]. Whether lightness belongs in the construct is a choice, and the variants below make
        it explicitly. Skin tone
        explains roughly <strong>28.5%</strong> of the score&apos;s variance, and mean glow declines monotonically from Fitzpatrick type 1
        to type 6.
      </p>
      <p>
        That gradient&apos;s <em>size</em>, though, is not established — and why not is the more interesting result.
        Fitzpatrick17k is scraped clinical photography: no controlled illumination, no camera calibration, no colour reference in frame, and
        tone estimates from such images are known to track capture as well as skin [9, 10].
        Re-scoring each image under capture changes that cannot alter how glossy skin actually is shows a quarter-stop exposure difference
        moving the score by <strong>~51%</strong> of the entire type-1-to-type-6 span, half a stop by 90%, and a 10% white-balance drift by
        ~40%. The metric is about as sensitive to the camera as to several steps of skin type, so nothing in this dataset separates the
        two. The within-image findings are untouched, because there each image is its own control and illumination is fixed by
        construction.
      </p>
      <InteractiveFigure
        n={1}
        src="/projects/lambent/fig1_original.png"
        spec="/projects/lambent/interactive/fig1.json"
        slug="lambent"
        alt="Three panels. a: histogram of per-image Spearman correlations between score and dose for added gloss and for plain brightening; both pile up at 1. b: mean score by Fitzpatrick type falling from 0.37 for type I to minus 0.34 for type VI. c: score shift under capture changes as a share of that type span: exposure minus half a stop 77%, minus a quarter 50%, plus a quarter 51%, plus half 90%, white balance warmer 41%, cooler 36%."
        lead="The original score cannot tell gloss from brightness, and the camera moves it about as far as skin type does."
      >
        <b>a</b>, For 250 images, the Spearman correlation between the original score (v6) and six increasing doses of added specular
        highlight or of plain gamma brightening. Both sit at 1 for almost every image. <b>b</b>, Mean score by Fitzpatrick type on the same
        250 images; the arrow marks the type I–VI span. <b>c</b>, Mean absolute score change when each image is re-rendered under a capture
        change that leaves the skin untouched, as a share of that span. White-balance changes are 10%.
      </InteractiveFigure>
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
        fixed capture rig, which is how earlier radiance studies worked [1, 3, 15], which is what the original engagement had and what public dermatology data does not. Exposure and white-balance
        sensitivity are now the acceptance criterion for a revised metric.
      </p>

      <h2>Letting the measurement specify its replacement</h2>
      <p>
        That gave an acceptance criterion rather than a complaint: keep the response to gloss, lose the response to brightness, bring
        capture sensitivity down. Seven variants were then scored through identical experiments, so every change was attributable rather
        than bundled. Tone dependence ends at <strong>ρ² = 0.002</strong>, down from 0.310, and worst-case capture sensitivity at
        <strong>59.4%</strong>, down from 93.2% — while the response to real gloss improves.
      </p>
      <InteractiveFigure
        n={2}
        src="/projects/lambent/fig2_variants.png"
        spec="/projects/lambent/interactive/fig2.json"
        slug="lambent"
        alt="Three panels, one row per variant from v6 to v11. a: correlation with added gloss and with brightening; v6 and v6 without lightness respond to both at 1, later variants respond positively to gloss (0.74 to 0.83) and negatively to brightening. b: tone dependence, 0.310 for v6 falling to 0.002 for v11, with v7 at 0.074 and v10 at 0.044 but v8 and v9 back near 0.28. c: worst capture shift, 93% for v6 and 59% for v11, 70 to 80% in between."
        lead="Seven variants, each scored through the same experiments; the last is tone-neutral and the least sensitive to the camera."
      >
        <b>a</b>, Each variant&apos;s Spearman correlation with the dose of added gloss (circle) and of plain brightening (square). A
        good score keeps the circle high and does not follow the square. <b>b</b>, Share of score variance explained by Fitzpatrick type
        (ρ²). <b>c</b>, The worst mean score shift across the six capture changes, as a share of the score&apos;s spread across images — a
        denominator that stays comparable when a variant removes the tone gradient. v11 (highlighted) is the recommended default.
      </InteractiveFigure>
      <p>
        Three of those variants are failures, and they are kept because the sequence is the argument. Deleting the lightness term does
        nothing, because the remaining terms are absolute too. Re-expressing everything as ratios fixes exposure and <em>breaks</em> white
        balance, since the specular test gates on saturation and warming an image raises saturation — repaired by von Kries normalisation [13], a standard colour-constancy step in dermatology imaging [14],
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

      <h2>Related work</h2>
      <p>
        Skin radiance has been quantified before, with optical reflectance devices [1], digital image models calibrated to expert and
        consumer grading [2], and fractal analysis of luminance and colour evenness [4]. Using polarized imaging [15], Matsubara and
        colleagues showed that graded radiance depends on both a surface-reflection (gloss) component and a subsurface, lightness-like one
        [3], consistent with evidence that perceived gloss and lightness share luminance-histogram cues [12], and with why lambent&apos;s
        original score could not separate them. Those studies worked on controlled rigs. lambent instead audits a transparent metric on
        uncontrolled public photographs [5], where tone estimates such as ITA [7, 8] track capture conditions as well as skin [9, 10], and
        its capture repairs rest on the dichromatic reflection model [11], von Kries adaptation [13] and colour constancy practice in
        dermatology imaging [14]. We found no earlier radiance or gloss metric audited by dose-response perturbation and capture
        sensitivity, nor a measurement of how tone-dependent a fixed-threshold specular detector is, though the search was by keyword.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed.</strong> The open repository reproduces the method, carries its own reproducible validation and the
        illumination-invariant metric that validation specified,
        generated into the repo from the run&apos;s own output so the documented numbers cannot drift from the run that produced them.
        The client engagement&apos;s figures are described but not claimed here.
      </p>

      <h2>References</h2>
      <ol className="references">
        <li>Petitjean A, Sainthillier JM, Mac-Mary S, et al. Skin radiance: how to quantify? Validation of an optical method. <em>Skin Research and Technology</em> 13, 2–8 (2007). <a href="https://doi.org/10.1111/j.1600-0846.2006.00174.x">doi:10.1111/j.1600-0846.2006.00174.x</a>.</li>
        <li>Baret M, Bensimon N, Coronel S, et al. Characterization and quantification of the skin radiance through new digital image analysis. <em>Skin Research and Technology</em> 12, 254–260 (2006). <a href="https://doi.org/10.1111/j.0909-752X.2006.00158.x">doi:10.1111/j.0909-752X.2006.00158.x</a>.</li>
        <li>Matsubara A, Liang Z, Sato Y, Uchikawa K. Analysis of human perception of facial skin radiance by means of image histogram parameters of surface and subsurface reflections from the skin. <em>Skin Research and Technology</em> 18, 265–271 (2012). <a href="https://doi.org/10.1111/j.1600-0846.2011.00570.x">doi:10.1111/j.1600-0846.2011.00570.x</a>.</li>
        <li>Haeri M, Phamduy T, Cafone N, et al. Novel digital image analysis using fractal dimension for assessment of skin radiance. <em>Skin Research and Technology</em> 25, 564–571 (2019). <a href="https://doi.org/10.1111/srt.12687">doi:10.1111/srt.12687</a>.</li>
        <li>Groh M, Harris C, Soenksen L, et al. Evaluating deep neural networks trained on clinical images in dermatology with the Fitzpatrick 17k dataset. <em>Proceedings of the IEEE/CVF CVPR Workshops</em>, 1820–1828 (2021). <a href="https://doi.org/10.1109/CVPRW53098.2021.00201">doi:10.1109/CVPRW53098.2021.00201</a>.</li>
        <li>Fitzpatrick TB. The validity and practicality of sun-reactive skin types I through VI. <em>Archives of Dermatology</em> 124, 869–871 (1988). <a href="https://doi.org/10.1001/archderm.1988.01670060015008">doi:10.1001/archderm.1988.01670060015008</a>.</li>
        <li>Chardon A, Cretois I, Hourseau C. Skin colour typology and suntanning pathways. <em>International Journal of Cosmetic Science</em> 13, 191–208 (1991). <a href="https://doi.org/10.1111/j.1467-2494.1991.tb00561.x">doi:10.1111/j.1467-2494.1991.tb00561.x</a>.</li>
        <li>Del Bino S, Bernerd F. Variations in skin colour and the biological consequences of ultraviolet radiation exposure. <em>British Journal of Dermatology</em> 169, 33–40 (2013). <a href="https://doi.org/10.1111/bjd.12529">doi:10.1111/bjd.12529</a>.</li>
        <li>Groh M, Harris C, Daneshjou R, et al. Towards transparency in dermatology image datasets with skin tone annotations by experts, crowds, and an algorithm. <em>Proceedings of the ACM on Human-Computer Interaction</em> 6, 1–26 (2022). <a href="https://doi.org/10.1145/3555634">doi:10.1145/3555634</a>.</li>
        <li>Kinyanjui NM, Odonga T, Cintas C, et al. Fairness of classifiers across skin tones in dermatology. <em>MICCAI 2020</em>, Lecture Notes in Computer Science, 320–329 (2020). <a href="https://doi.org/10.1007/978-3-030-59725-2_31">doi:10.1007/978-3-030-59725-2_31</a>.</li>
        <li>Shafer SA. Using color to separate reflection components. <em>Color Research &amp; Application</em> 10, 210–218 (1985). <a href="https://doi.org/10.1002/col.5080100409">doi:10.1002/col.5080100409</a>.</li>
        <li>Motoyoshi I, Nishida S, Sharan L, Adelson EH. Image statistics and the perception of surface qualities. <em>Nature</em> 447, 206–209 (2007). <a href="https://doi.org/10.1038/nature05724">doi:10.1038/nature05724</a>.</li>
        <li>West G, Brill MH. Necessary and sufficient conditions for von Kries chromatic adaptation to give color constancy. <em>Journal of Mathematical Biology</em> 15, 249–258 (1982). <a href="https://doi.org/10.1007/BF00275077">doi:10.1007/BF00275077</a>.</li>
        <li>Barata C, Celebi ME, Marques JS. Improving dermoscopy image classification using color constancy. <em>IEEE Journal of Biomedical and Health Informatics</em> 19, 1146–1152 (2015). <a href="https://doi.org/10.1109/JBHI.2014.2336473">doi:10.1109/JBHI.2014.2336473</a>.</li>
        <li>Anderson RR. Polarized light examination and photography of the skin. <em>Archives of Dermatology</em> 127, 1000–1005 (1991). <a href="https://doi.org/10.1001/archderm.1991.01680060074007">doi:10.1001/archderm.1991.01680060074007</a>.</li>
        <li>Cronbach LJ, Meehl PE. Construct validity in psychological tests. <em>Psychological Bulletin</em> 52, 281–302 (1955). <a href="https://doi.org/10.1037/h0040957">doi:10.1037/h0040957</a>.</li>
      </ol>
    </>
  );
}
