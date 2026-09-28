import InteractiveFigure from "../InteractiveFigure";
import Ref from "../Ref";

export const metadata = { title: "iridis. — shel." };

export default function IridisPage() {
  return (
    <>
      <span className="kicker">Project — iridis · 2023–2025</span>
      <h1>The camera, not the Fitzpatrick scale, is the weak link in image-derived skin tone</h1>
      <p className="byline">
        Shel Burkes, PhD<span className="sep">·</span>Pre-registered 26 September 2026<span className="sep">·</span>Scored 26 September
        2026
      </p>

      <div className="abstract">
        <span className="abstract-label">Abstract</span>
        Fitzpatrick skin type — six ordinal buckets designed to predict how skin responds to sun<Ref n={1} /> — is the de facto
        skin-tone standard in dermatology datasets and the AI models trained on them<Ref n={[8, 15]} />, despite long-standing
        criticism as a measure of colour<Ref n={[2, 3]} />. Whether the scale or the photographs limit image-derived skin tone had not
        been separated. Here we show that on 12,222 labelled clinical photographs, Fitzpatrick type explains 7% of the variance in
        measured lightness and 12% in yellowness, colour features predict type at 34.6% (95% interval 32.6–36.5%) against 33.9% for
        always guessing the commonest type, and colour categories discovered without labels do not reproduce on resampled images
        (median adjusted Rand index 0.31 against a pre-registered bar of 0.80) — skin colour in these images is a continuum. On 501
        skin sites measured with a colorimeter, both Fitzpatrick type (−0.80) and Monk Skin Tone (−0.93) track the instrument, while
        colour from dermoscopic images of the same sites does not: 41% of its variance comes from capture mode alone, against 1.1%
        between the instrument&apos;s repeat readings. The weak link in uncontrolled photographs is mainly the camera, not the scale.
      </div>

      <p>
        Fitzpatrick skin type was introduced to predict how skin responds to sun<Ref n={1} /> and has been criticised as a poor
        measure of skin colour, especially across racial groups<Ref n={[2, 3]} />; dermatology AI nonetheless adopted it for dataset
        labelling and fairness audits<Ref n={[8, 10, 15]} />. The individual typology angle<Ref n={[6, 7]} /> and the ten-point Monk
        Skin Tone scale<Ref n={[4, 5]} /> were proposed as more continuous or inclusive alternatives, but when the angle is estimated
        from photographs rather than measured with an instrument, it agrees poorly with expert labels<Ref n={9} />, disagrees across
        published pipelines<Ref n={11} />, and is sensitive to lighting<Ref n={12} />. It was therefore unclear how much of the colour
        measured in an image the clinical scale actually captures — a coarse scale being asked to do a job it was not designed for.
        We approached the question empirically rather than by argument: we extracted robust colour features directly from images, let
        clustering discover the structure actually present, and compared how well that discovered structure and the clinical labels
        predict from identical features (Box 1, Methods). A colorimeter-labelled dataset<Ref n={14} /> then let us separate what the
        photographs contribute from what the scale does.
      </p>

      <aside className="box">
        <span className="box-lead">Box 1 | How to read the measurements</span>
        <p>
          <strong>Fitzpatrick type</strong> is a six-level clinical scale (I lightest to VI darkest) of sun reactivity, used here as a
          skin-tone label. <strong>CIE L*a*b*</strong> expresses colour as lightness (L*), a red–green axis (a*) and a yellow–blue axis
          (b*); <strong>CIEDE2000</strong> is a perceptual distance between two colours, sized so equal distances look equally
          different. The <strong>individual typology angle (ITA)</strong> is a continuous skin-tone measure computed from L* and b*.{" "}
          <strong>η²</strong> is the share of a feature&apos;s variance a label explains; a <strong>Spearman correlation</strong>{" "}
          measures how well one quantity tracks another&apos;s ordering, from −1 to 1. The <strong>adjusted Rand index</strong>{" "}
          measures agreement between two clusterings, 1 for identical and near 0 for chance. Accuracy figures are quoted against the{" "}
          <strong>commonest-class baseline</strong> — the accuracy of always predicting the most frequent label.
        </p>
      </aside>

      <h2>Measured skin colour barely tracks Fitzpatrick type</h2>
      <p>
        Median lightness of masked skin fell steadily from type I to type VI, but the spread inside each type was far wider than the
        steps between them (Fig. 1a, b). Type explained 7% of the variance in lightness and 12% in yellowness (Fig. 1c). Predicting
        type from the five colour features reached 35–42% accuracy, where always guessing the commonest type scores 34%. Earlier work
        found the same: skin tone estimated from images agrees poorly with Fitzpatrick labels<Ref n={[9, 11, 12]} />. Masking did not
        help. Isolating skin from background and lesion was expected to make type more predictable, because it removes an obvious
        source of contamination; accuracy stayed flat or fell slightly. The weak link is not a masking artefact.
      </p>
      <InteractiveFigure
        n={1}
        src="/projects/iridis/fig1_types.png"
        spec="/projects/iridis/interactive/fig1.json"
        slug="iridis"
        alt="Three panels. a: box plots of lightness L* for Fitzpatrick types I to VI; medians fall from 63 to 43 but the boxes overlap widely. b: box plots of b* by type, rising from I to IV and falling for V and VI. c: horizontal bars of variance explained by type: L* 7%, a* 4%, b* 12%, chroma 9%, hue 1%."
        lead="Fitzpatrick type explains little of the colour measured from the same images."
      >
        <b>a</b>, Lightness (CIE L*) of masked skin by Fitzpatrick type. Boxes span the middle half of each type, whiskers 5–95%, and each
        box is filled with that type&apos;s median measured colour; image counts are printed along the bottom. <b>b</b>, The same for b*,
        the yellow–blue axis. <b>c</b>, Share of each feature&apos;s variance explained by type (η²). All values are from uncalibrated
        clinical photographs, one per image.
      </InteractiveFigure>

      <h2>The cluster comparison measured the clustering, not the scale</h2>
      <p>
        A correction. Earlier versions of this page reported that the discovered colour clusters were 2.5–2.8× more predictable than
        Fitzpatrick labels, 96% against 35–42%, and read that gap as evidence that the clinical scale discards real structure. That
        reading does not hold. The clusters are defined from the same colour features the classifier is given, so predicting them is
        largely true by construction. And the perceptual merge joins clusters transitively, so a chain of small steps pulled 62 of the
        120 initial clusters into one: that cluster holds 68% of the images and spans nearly the whole lightness range (Fig. 2a, b).
        Against always guessing it, 96% is a smaller gain than it looks (Fig. 2c).
      </p>
      <InteractiveFigure
        n={2}
        src="/projects/iridis/fig2_clusters.png"
        spec="/projects/iridis/interactive/fig2.json"
        slug="iridis"
        alt="Three panels. a: bar chart of the 50 discovered clusters by share of images; the largest holds 68%, the rest at most 4% each. b: histogram of lightness for all images with the largest cluster overlaid, covering L* from about 36 to 90. c: accuracy dot plot; Fitzpatrick type 35 to 42% against a 34% commonest-class line; discovered cluster 96% against a 68% line."
        lead="The cluster comparison measures the clustering, not the scale."
      >
        <b>a</b>, The 50 discovered clusters (masked features), largest first, each bar in its cluster&apos;s median colour. <b>b</b>,
        Lightness of every image (light) and of the largest cluster&apos;s members (dark). <b>c</b>, Test accuracy of each model and feature
        set against the accuracy of always predicting the commonest class (black line; for clusters, from the masked clustering).
        Filled markers use masked features, open markers unmasked.
      </InteractiveFigure>

      <h2>Skin colour in these photographs is a continuum, not a set of categories</h2>
      <p>
        A pre-registered retest replaced the chaining merge with one that cannot chain: two groups join only if every colour across
        them is within the perceptual threshold. Colour then split into 92 clusters, the largest holding 3.7% of images. Refit on
        resampled images, they did not reproduce: the median agreement between refits (adjusted Rand index<Ref n={21} />) was 0.31,
        against the pre-registered bar of 0.80. Skin colour in this data is a continuum, and any fixed set of colour categories is a
        convenience rather than a finding, as the continuous individual typology angle was designed to acknowledge<Ref n={[6, 7]} />.
        On the same test split, colour predicted Fitzpatrick type at 34.6% (95% interval 32.6–36.5%), against 33.9% for always
        guessing the commonest type.
      </p>

      <h2>Both scales track instrument-measured colour; images of the same skin do not</h2>
      <p>
        Fitzpatrick17k cannot say whether the weak link is the scale or the camera. A second dataset can: the MSKCC Skin Tone Labeling
        Dataset<Ref n={14} />, from Memorial Sloan Kettering on the ISIC Archive, measures 501 skin sites with a colorimeter, three
        readings each, alongside each patient&apos;s Fitzpatrick type, two raters&apos; Monk Skin Tone<Ref n={[4, 5]} /> scores and
        dermoscopic images taken in four modes. Against the instrument, both scales tracked skin colour: Fitzpatrick type correlated
        with the colorimeter&apos;s individual typology angle<Ref n={6} /> at −0.80 and explained 66% of its variance; Monk Skin Tone
        did better, −0.93 and 88% (difference +0.125, 95% interval +0.073 to +0.208, resampling patients). The images did not. Colour
        measured from the dermoscopic images of the same sites did not reproduce the instrument&apos;s angle, and 41% of its variance
        came from imaging the same skin under different dermoscope modes, against 1.1% between the colorimeter&apos;s own repeat
        readings. On lightness alone, checked after scoring, image and instrument agreed only partly (0.63). Part of the failure is
        the angle itself: it divides by b*, and in 32% of these images b* is zero or negative, where the angle flips sign and stops
        meaning anything.
      </p>
      <p>
        These two results are a replication, not a discovery. The dataset&apos;s own authors reported that Monk Skin Tone tracks the
        colorimeter more closely than Fitzpatrick type, and that colour extracted from the dermoscopic images correlates poorly with
        colorimetry<Ref n={13} />. We reproduced both independently, under a protocol written before our own analysis, and add two
        things we have not found reported: how much of the image error comes from capture alone (41% against 1.1%), and the share of
        images where the angle breaks down. One error is on the record: the first run computed the angle with the wrong formula, a
        pre-registered sanity check caught it, and the corrected run is the one reported.
      </p>

      <h2>Discussion</h2>
      <p>
        The weak link on Fitzpatrick17k is mainly the camera, not the scale, as studies of image-derived skin tone under uncontrolled
        capture also suggest<Ref n={[11, 12]} />. Fitzpatrick type explains little of the colour measured from uncalibrated clinical
        photographs, but the same images fail against a colorimeter that both clinical scales track well, so the photographs — not
        the scale&apos;s coarseness — carry most of the disagreement. The measures differ between the two datasets, so the contrast
        is indicative rather than exact, but its direction is clear. And the pre-registered retest argues that no fixed set of colour
        categories, clinical or discovered, is a finding in this data: skin colour there is a continuum.
      </p>
      <p>
        Several limits bound the claim. Every Fitzpatrick17k image in the benchmark comes from a single source atlas, so the source
        is constant rather than confounded, but the result is established on that atlas only; the dataset&apos;s other atlas has a
        very different skin-type mix, and adding it needs a source audit first. The images are uncalibrated clinical photographs; a
        companion project, lambent, later measured how far capture conditions can move a colour-derived score. Segmentation is being
        reworked with additional data before an interactive demo is built.
      </p>

      <h2>Methods</h2>
      <div className="endmatter">
        <p>
          <strong>Masking.</strong> A layered masking pipeline isolated skin from background and pathology before any colour was
          measured: class-agnostic foreground segmentation, then a ResNet18-U-Net<Ref n={18} /> trained on ISIC 2018 lesion
          masks<Ref n={17} /> to exclude the lesion itself, with a center-crop fallback for the fraction of images where segmentation
          degenerates. The lesion-exclusion U-Net reaches held-out Dice 0.889 on ISIC 2018 Task 1.
        </p>
        <p>
          <strong>Colour features.</strong> Each image was downsampled, pixel-sampled, and converted to CIE Lab; per-image colour is
          the <em>median</em> over sampled pixels rather than the mean, which is far less sensitive to residual artifacts and small
          segmentation errors.
        </p>
        <p>
          <strong>Clustering.</strong> <code>MiniBatchKMeans</code><Ref n={19} /> produced an initial fine-grained partition, and
          nearby clusters were merged using CIEDE2000 perceptual distance<Ref n={16} />, so the final categories reflect what a human
          eye would distinguish, not an arbitrary cluster count. The pre-registered retest replaced this transitive merge with a
          complete-linkage rule that cannot chain, and assessed reproducibility by refitting on resampled images and scoring
          agreement between refits with the adjusted Rand index<Ref n={21} />.
        </p>
        <p>
          <strong>Benchmark.</strong> The benchmark ran on Fitzpatrick17k<Ref n={8} />: 12,631 clinical photographs, 12,222 of them
          with a valid Fitzpatrick label, with and without masking, under a classical model (Random Forest) and an in-context one
          (TabPFN<Ref n={20} />). Accuracies are reported against the commonest-class baseline.
        </p>
        <p>
          <strong>MSKCC reanalysis.</strong> The MSKCC Skin Tone Labeling Dataset<Ref n={14} /> supplies 501 skin sites with three
          colorimeter readings each, patient Fitzpatrick type, two raters&apos; Monk Skin Tone scores, and dermoscopic images in four
          modes. Scale-versus-instrument comparisons used the colorimeter&apos;s individual typology angle<Ref n={6} />; the interval
          on the Monk–Fitzpatrick difference resampled patients. Image colour was extracted from the dermoscopic images of the same
          sites, and capture variance was partitioned between dermoscope modes and compared with the variance between the
          colorimeter&apos;s repeat readings. The lightness-only agreement (0.63) was checked after scoring and is labelled as such.
        </p>
        <p>
          <strong>Protocol.</strong> The non-chaining retest and the MSKCC reanalysis were each pre-registered: the protocol was
          committed to the project repository on 26 September 2026, before the analysis was run, and each was scored once. A
          pre-registered sanity check caught a wrong angle formula in the first MSKCC run; the corrected run is the one reported.
        </p>
      </div>

      <div className="endmatter">
        <h2>Data availability</h2>
        <p>
          All inputs are published: Fitzpatrick17k clinical photographs and labels<Ref n={8} />, the MSKCC Skin Tone Labeling
          Dataset<Ref n={14} /> (CC-BY, ISIC Archive), and ISIC 2018 Task 1 lesion masks<Ref n={17} /> for segmentation training.
        </p>
        <h2>Code availability</h2>
        <p>
          The analysis repository is private. The core pipeline — masking, featurization, clustering, benchmarking — is implemented
          and reproducible there, and the figures on this page are drawn from its committed outputs by a script in the repository.
        </p>
        <h2>Pre-registration statement</h2>
        <p>
          Pre-registered means committed to the project&apos;s own repository before scoring, not lodged with an external registry.
          The original benchmark and clustering were exploratory; the correction they required is reported above, not silently
          replaced. Two later analyses were pre-registered on 26 September 2026 and scored once each: the non-chaining cluster retest
          and the MSKCC reanalysis, including the sanity check that caught the first run&apos;s angle-formula error.
        </p>
        <h2>Competing interests</h2>
        <p>None.</p>
      </div>

      <h2 id="references">References</h2>
      <ol className="references">
        <li>Fitzpatrick TB. The validity and practicality of sun-reactive skin types I through VI. <em>Archives of Dermatology</em> 124, 869–871 (1988). <a href="https://doi.org/10.1001/archderm.1988.01670060015008">doi:10.1001/archderm.1988.01670060015008</a>.</li>
        <li>Okoji UK, Taylor SC, Lipoff JB. Equity in skin typing: why it is time to replace the Fitzpatrick scale. <em>British Journal of Dermatology</em> 185, 198–199 (2021). <a href="https://doi.org/10.1111/bjd.19932">doi:10.1111/bjd.19932</a>.</li>
        <li>Ware OR, Dawson JE, Shinohara MM, Taylor SC. Racial limitations of Fitzpatrick skin type. <em>Cutis</em> 105, 77–80 (2020). <a href="https://pubmed.ncbi.nlm.nih.gov/32186531/">PMID:32186531</a>.</li>
        <li>Monk E. The Monk Skin Tone Scale. <em>SocArXiv</em> (2023). <a href="https://doi.org/10.31235/osf.io/pdf4c">doi:10.31235/osf.io/pdf4c</a>.</li>
        <li>Heldreth CM, Monk EP, Clark AT, et al. Which skin tone measures are the most inclusive? An investigation of skin tone measures for artificial intelligence. <em>ACM Journal on Responsible Computing</em> 1, 1–21 (2024). <a href="https://doi.org/10.1145/3632120">doi:10.1145/3632120</a>.</li>
        <li>Chardon A, Cretois I, Hourseau C. Skin colour typology and suntanning pathways. <em>International Journal of Cosmetic Science</em> 13, 191–208 (1991). <a href="https://doi.org/10.1111/j.1467-2494.1991.tb00561.x">doi:10.1111/j.1467-2494.1991.tb00561.x</a>.</li>
        <li>Del Bino S, Bernerd F. Variations in skin colour and the biological consequences of ultraviolet radiation exposure. <em>British Journal of Dermatology</em> 169, 33–40 (2013). <a href="https://doi.org/10.1111/bjd.12529">doi:10.1111/bjd.12529</a>.</li>
        <li>Groh M, Harris C, Soenksen L, et al. Evaluating deep neural networks trained on clinical images in dermatology with the Fitzpatrick 17k dataset. <em>Proceedings of the IEEE/CVF CVPR Workshops</em>, 1820–1828 (2021). <a href="https://doi.org/10.1109/CVPRW53098.2021.00201">doi:10.1109/CVPRW53098.2021.00201</a>. Data: <a href="https://github.com/mattgroh/fitzpatrick17k">github.com/mattgroh/fitzpatrick17k</a>.</li>
        <li>Groh M, Harris C, Daneshjou R, et al. Towards transparency in dermatology image datasets with skin tone annotations by experts, crowds, and an algorithm. <em>Proceedings of the ACM on Human-Computer Interaction</em> 6, 1–26 (2022). <a href="https://doi.org/10.1145/3555634">doi:10.1145/3555634</a>.</li>
        <li>Kinyanjui NM, Odonga T, Cintas C, et al. Fairness of classifiers across skin tones in dermatology. <em>MICCAI 2020</em>, LNCS 12266, 320–329 (2020). <a href="https://doi.org/10.1007/978-3-030-59725-2_31">doi:10.1007/978-3-030-59725-2_31</a>.</li>
        <li>Kalb T, Kushibar K, Cintas C, et al. Revisiting skin tone fairness in dermatological lesion classification. arXiv 2308.09640 (2023). <a href="https://arxiv.org/abs/2308.09640">arXiv:2308.09640</a>.</li>
        <li>Alipour N, Burke T, Courtney J. Limitations of ITA for skin type estimation under uncontrolled imaging conditions. <em>Skin Research and Technology</em> 32, e70374 (2026). <a href="https://doi.org/10.1111/srt.70374">doi:10.1111/srt.70374</a>.</li>
        <li>Weir VR, Li Y, Gillis MC, et al. Evaluating skin tone scales for dermatologic dataset labeling: a prospective-comparative study. <em>npj Digital Medicine</em> 8, 787 (2025). <a href="https://doi.org/10.1038/s41746-025-02245-2">doi:10.1038/s41746-025-02245-2</a>.</li>
        <li>Memorial Sloan Kettering Cancer Center. MSKCC Skin Tone Labeling Dataset. <em>ISIC Archive</em> (2025). <a href="https://doi.org/10.34970/962049">doi:10.34970/962049</a>, CC-BY.</li>
        <li>Daneshjou R, Vodrahalli K, Novoa RA, et al. Disparities in dermatology AI performance on a diverse, curated clinical image set. <em>Science Advances</em> 8, eabq6147 (2022). <a href="https://doi.org/10.1126/sciadv.abq6147">doi:10.1126/sciadv.abq6147</a>.</li>
        <li>Sharma G, Wu W, Dalal EN. The CIEDE2000 color-difference formula: implementation notes, supplementary test data, and mathematical observations. <em>Color Research &amp; Application</em> 30, 21–30 (2005). <a href="https://doi.org/10.1002/col.20070">doi:10.1002/col.20070</a>.</li>
        <li>Codella N, Rotemberg V, Tschandl P, et al. Skin lesion analysis toward melanoma detection 2018: a challenge hosted by the International Skin Imaging Collaboration (ISIC). arXiv 1902.03368 (2019). <a href="https://arxiv.org/abs/1902.03368">arXiv:1902.03368</a>.</li>
        <li>Ronneberger O, Fischer P, Brox T. U-Net: convolutional networks for biomedical image segmentation. <em>MICCAI 2015</em>, LNCS 9351, 234–241 (2015). <a href="https://doi.org/10.1007/978-3-319-24574-4_28">doi:10.1007/978-3-319-24574-4_28</a>.</li>
        <li>Sculley D. Web-scale k-means clustering. <em>Proceedings of WWW</em>, 1177–1178 (2010). <a href="https://doi.org/10.1145/1772690.1772862">doi:10.1145/1772690.1772862</a>.</li>
        <li>Hollmann N, Müller S, Purucker L, et al. Accurate predictions on small data with a tabular foundation model. <em>Nature</em> 637, 319–326 (2025). <a href="https://doi.org/10.1038/s41586-024-08328-6">doi:10.1038/s41586-024-08328-6</a>.</li>
        <li>Hubert L, Arabie P. Comparing partitions. <em>Journal of Classification</em> 2, 193–218 (1985). <a href="https://doi.org/10.1007/BF01908075">doi:10.1007/BF01908075</a>.</li>
      </ol>
    </>
  );
}
