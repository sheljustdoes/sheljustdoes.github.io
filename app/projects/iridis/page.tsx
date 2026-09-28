import InteractiveFigure from "../InteractiveFigure";

export const metadata = { title: "iridis. — shel." };

export default function IridisPage() {
  return (
    <>
      <span className="kicker">Project — 2023–2025</span>
      <h1>iridis.</h1>
      <p className="tagline">
        Perceptual skin-tone phenotyping from open dermatology imaging data — testing how much of the colour measured in an image the
        clinical Fitzpatrick scale actually captures.
      </p>

      <h2>Why this exists</h2>
      <p>
        Fitzpatrick skin type — six ordinal buckets, originally designed to predict how skin responds to sun [1] — is the de facto skin-tone
        standard in dermatology datasets, and by extension in the AI models trained on them [8, 15], despite long-standing criticism as a
        measure of colour [2, 3]. It&apos;s a coarse scale being asked to do a job it
        wasn&apos;t designed for. iridis approaches the question empirically instead of by argument: extract robust color features directly
        from images, let clustering discover the structure that&apos;s actually there, and compare how well that discovered structure
        predicts against how well the clinical labels predict, from identical features.
      </p>

      <h2>Approach</h2>
      <p>
        A layered masking pipeline isolates skin from background and pathology before any color is measured — class-agnostic foreground
        segmentation, then a ResNet18-U-Net [18] (trained on ISIC2018 lesion masks [17]) to exclude the lesion itself, with a center-crop fallback for
        the fraction of images where segmentation degenerates. Each image is downsampled, pixel-sampled, and converted to CIE Lab; per-image
        color is the <em>median</em> over sampled pixels rather than the mean, which is far less sensitive to residual artifacts and small
        segmentation errors. <code>MiniBatchKMeans</code> [19] produces an initial fine-grained partition, and nearby clusters are merged using
        CIEDE2000 perceptual distance [16] — so the final categories reflect what a human eye would distinguish, not an arbitrary cluster count.
      </p>

      <h2>Key results</h2>
      <p>
        The benchmark ran on Fitzpatrick17k [8]: 12,631 clinical photographs, 12,222 of them with a valid Fitzpatrick label, with and without
        masking, under a classical model (Random Forest) and an in-context one (TabPFN [20]). The lesion-exclusion U-Net reaches held-out Dice
        0.889 on ISIC 2018 Task 1.
      </p>
      <p>
        <strong>Measured skin colour barely tracks Fitzpatrick type.</strong> Median lightness falls steadily from type I to type VI, but
        the spread inside each type is far wider than the steps between them. Type explains 7% of the variance in lightness and 12% in
        yellowness. Predicting type from the five colour features reaches 35–42% accuracy, where always guessing the commonest type
        scores 34%. Earlier work found the same: skin tone estimated from images agrees poorly with Fitzpatrick labels [9, 11, 12].
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
      <p>
        <strong>Masking does not help.</strong> Isolating skin from background and lesion was expected to make type more predictable,
        because it removes an obvious source of contamination. Accuracy stayed flat or fell slightly. The weak link is not a masking
        artefact.
      </p>
      <p>
        <strong>A correction.</strong> Earlier versions of this page reported that the discovered colour clusters were 2.5–2.8× more
        predictable than Fitzpatrick labels, 96% against 35–42%, and read that gap as evidence that the clinical scale discards real
        structure. That reading does not hold. The clusters are defined from the same colour features the classifier is given, so
        predicting them is largely true by construction. And the perceptual merge joins clusters transitively, so a chain of small steps
        pulled 62 of the 120 initial clusters into one: that cluster holds 68% of the images and spans nearly the whole lightness range.
        Against always guessing it, 96% is a smaller gain than it looks.
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
      <p>
        <strong>Are there colour categories at all?</strong> A pre-registered retest replaced the chaining merge with one that cannot
        chain: two groups join only if every colour across them is within the perceptual threshold. Colour then splits into 92 clusters,
        the largest holding 3.7% of images. Refit on resampled images, they do not reproduce: the median agreement between refits (adjusted Rand index [21]) is
        0.31, against the pre-registered bar of 0.80. Skin colour in this data is a continuum, and any fixed set of colour categories
        is a convenience rather than a finding, as the continuous individual typology angle (ITA) was designed to acknowledge [6, 7]. On the same test split, colour predicts Fitzpatrick type at 34.6% (95% interval
        32.6–36.5%), against 33.9% for always guessing the commonest type.
      </p>
      <h2>Scale or camera?</h2>
      <p>
        Fitzpatrick17k cannot say whether the weak link is the scale or the camera. A second dataset can: the MSKCC Skin Tone Labeling
        Dataset [14], from Memorial Sloan Kettering on the ISIC Archive, measures 501 skin sites with a colorimeter, three readings each,
        alongside each patient&apos;s Fitzpatrick type, two raters&apos; Monk Skin Tone [4, 5] scores and dermoscopic images taken in four modes.
      </p>
      <p>
        <strong>Against the instrument, both scales track skin colour.</strong> Fitzpatrick type correlates with the colorimeter&apos;s
        individual typology angle [6] at −0.80 and explains 66% of its variance; Monk Skin Tone does better, −0.93 and 88% (difference
        +0.125, 95% interval +0.073 to +0.208, resampling patients). <strong>The images do not.</strong> Colour measured from the
        dermoscopic images of the same sites does not reproduce the instrument&apos;s angle, and 41% of its variance comes from imaging the
        same skin under different dermoscope modes, against 1.1% between the colorimeter&apos;s own repeat readings. On lightness alone,
        checked after scoring, image and instrument agree only partly (0.63). Part of the failure is the angle itself: it divides by b*,
        and in 32% of these images b* is zero or negative, where the angle flips sign and stops meaning anything.
      </p>
      <p>
        <strong>These two results are a replication, not a discovery.</strong> The dataset&apos;s own authors reported that Monk Skin Tone
        tracks the colorimeter more closely than Fitzpatrick type, and that colour extracted from the dermoscopic images correlates poorly
        with colorimetry [13]. iridis reproduced both independently, under a protocol written before its own analysis, and adds two
        things we have not found reported: how much of the image error comes from capture alone (41% against 1.1%), and the share of
        images where the angle breaks down.
      </p>
      <p>
        So the weak link on Fitzpatrick17k is mainly the camera, not the scale, as studies of image-derived skin tone under uncontrolled
        capture also suggest [11, 12]. The measures differ between the two datasets, so the
        contrast is indicative rather than exact, but its direction is clear. One error is on the record: the first run computed the
        angle with the wrong formula, a pre-registered sanity check caught it, and the corrected run is the one reported.
      </p>

      <h2>Related work</h2>
      <p>
        Fitzpatrick skin type was introduced to predict how skin responds to sun [1] and has been criticised as a poor measure of skin
        colour, especially across racial groups [2, 3]; dermatology AI nonetheless adopted it for dataset labelling and fairness audits
        [8, 10, 15]. The individual typology angle [6, 7] and the ten-point Monk Skin Tone scale [4, 5] were proposed as more continuous or
        inclusive alternatives. When the angle is estimated from photographs rather than measured with an instrument, it agrees poorly with
        expert labels [9], disagrees across published pipelines [11], and is sensitive to lighting [12]. The MSKCC dataset&apos;s authors
        reported that Monk Skin Tone tracks a colorimeter more closely than Fitzpatrick type and that dermoscopic image colour correlates
        poorly with colorimetry [13, 14]. iridis reproduces both findings independently and adds a measure of how much of the image error
        comes from capture conditions alone.
      </p>

      <h2>Limits</h2>
      <p>
        Every Fitzpatrick17k image in the benchmark comes from a single source atlas, so the source is constant rather than confounded,
        but the result is established on that atlas only. The dataset&apos;s other atlas has a very different skin-type mix, and adding
        it needs a source audit first. The images are uncalibrated clinical photographs; lambent later showed how far capture
        conditions can move a color-derived score.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Results committed.</strong> Core pipeline (masking, featurization, clustering, benchmarking) is implemented and reproducible,
        and the figures are drawn from its committed outputs by a script in the repository. The non-chaining merge, the resampling test
        and the MSKCC reanalysis are done, each pre-registered. Segmentation is being reworked with additional data before an interactive
        demo is built.
      </p>

      <h2>References</h2>
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
