import Figure from "../Figure";

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
        Fitzpatrick skin type — six ordinal buckets, originally designed for burn-risk classification — is the de facto skin-tone standard
        in dermatology datasets, and by extension in the AI models trained on them. It&apos;s a coarse scale being asked to do a job it
        wasn&apos;t designed for. iridis approaches the question empirically instead of by argument: extract robust color features directly
        from images, let clustering discover the structure that&apos;s actually there, and compare how well that discovered structure
        predicts against how well the clinical labels predict, from identical features.
      </p>

      <h2>Approach</h2>
      <p>
        A layered masking pipeline isolates skin from background and pathology before any color is measured — class-agnostic foreground
        segmentation, then a ResNet18-U-Net (trained on ISIC2018 lesion masks) to exclude the lesion itself, with a center-crop fallback for
        the fraction of images where segmentation degenerates. Each image is downsampled, pixel-sampled, and converted to CIE Lab; per-image
        color is the <em>median</em> over sampled pixels rather than the mean, which is far less sensitive to residual artifacts and small
        segmentation errors. <code>MiniBatchKMeans</code> produces an initial fine-grained partition, and nearby clusters are merged using
        CIEDE2000 perceptual distance — so the final categories reflect what a human eye would distinguish, not an arbitrary cluster count.
      </p>

      <h2>Key results</h2>
      <p>
        The benchmark ran on Fitzpatrick17k: 12,631 clinical photographs, 12,222 of them with a valid Fitzpatrick label, with and without
        masking, under a classical model (Random Forest) and an in-context one (TabPFN). The lesion-exclusion U-Net reaches held-out Dice
        0.889 on ISIC 2018 Task 1.
      </p>
      <p>
        <strong>Measured skin colour barely tracks Fitzpatrick type.</strong> Median lightness falls steadily from type I to type VI, but
        the spread inside each type is far wider than the steps between them. Type explains 7% of the variance in lightness and 12% in
        yellowness. Predicting type from the five colour features reaches 35–42% accuracy, where always guessing the commonest type
        scores 34%.
      </p>
      <Figure
        n={1}
        src="/projects/iridis/fig1_types.png"
        alt="Three panels. a: box plots of lightness L* for Fitzpatrick types I to VI; medians fall from 63 to 43 but the boxes overlap widely. b: box plots of b* by type, rising from I to IV and falling for V and VI. c: horizontal bars of variance explained by type: L* 7%, a* 4%, b* 12%, chroma 9%, hue 1%."
        lead="Fitzpatrick type explains little of the colour measured from the same images."
      >
        <b>a</b>, Lightness (CIE L*) of masked skin by Fitzpatrick type. Boxes span the middle half of each type, whiskers 5–95%, and each
        box is filled with that type&apos;s median measured colour; image counts are printed along the bottom. <b>b</b>, The same for b*,
        the yellow–blue axis. <b>c</b>, Share of each feature&apos;s variance explained by type (η²). All values are from uncalibrated
        clinical photographs, one per image.
      </Figure>
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
      <Figure
        n={2}
        src="/projects/iridis/fig2_clusters.png"
        alt="Three panels. a: bar chart of the 50 discovered clusters by share of images; the largest holds 68%, the rest at most 4% each. b: histogram of lightness for all images with the largest cluster overlaid, covering L* from about 36 to 90. c: accuracy dot plot; Fitzpatrick type 35 to 42% against a 34% commonest-class line; discovered cluster 96% against a 68% line."
        lead="The cluster comparison measures the clustering, not the scale."
      >
        <b>a</b>, The 50 discovered clusters (masked features), largest first, each bar in its cluster&apos;s median colour. <b>b</b>,
        Lightness of every image (light) and of the largest cluster&apos;s members (dark). <b>c</b>, Test accuracy of each model and feature
        set against the accuracy of always predicting the commonest class (black line; for clusters, from the masked clustering).
        Filled markers use masked features, open markers unmasked.
      </Figure>
      <p>
        <strong>Are there colour categories at all?</strong> A pre-registered retest replaced the chaining merge with one that cannot
        chain: two groups join only if every colour across them is within the perceptual threshold. Colour then splits into 92 clusters,
        the largest holding 3.7% of images. Refit on resampled images, they do not reproduce: the median agreement between refits is
        0.31, against the 0.80 a stable partition needs. Skin colour in this data is a continuum, and any fixed set of colour categories
        is a convenience rather than a finding. On the same test split, colour predicts Fitzpatrick type at 34.6% (95% interval
        32.6–36.5%), against 33.9% for always guessing the commonest type.
      </p>
      <p>
        What stands is the weak link between colour and type. What it means is still open: in uncalibrated photographs, a coarse scale
        and uncontrolled capture both weaken it, and this data cannot tell them apart.
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
        and the figures are drawn from its committed outputs by a script in the repository. Next: replace the transitive merge with one
        that cannot chain, test the clusters against features they were not built from, and put intervals on every accuracy. Segmentation
        is being reworked with additional data before an interactive demo is built.
      </p>
    </>
  );
}
