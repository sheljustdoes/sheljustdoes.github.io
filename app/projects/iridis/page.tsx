export const metadata = { title: "iridis. — shel." };

export default function IridisPage() {
  return (
    <>
      <span className="kicker">Project — 2023–2025</span>
      <h1>iridis.</h1>
      <p className="tagline">
        Perceptual skin-tone phenotyping from open dermatology imaging data — testing whether data-driven color clusters carry more
        structure than the clinical scales used to describe them.
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
        On Fitzpatrick17k (~12.6K images) and ISIC 2018 Task 1 (~5.2K lesion-masked images), using identical Lab/LCh features, the discovered
        color clusters are <strong>2.5–2.8× more predictable</strong> than the clinical Fitzpatrick labels they&apos;re meant to
        summarize — 95.8–96.3% classification accuracy for the discovered clusters versus 34.6–42.3% for the six-bucket clinical scale,
        across both a classical (Random Forest) and an in-context (TabPFN) model, with and without masking. That gap is evidence the
        clinical scale is collapsing real, learnable perceptual variation, not a modeling artifact. The lesion-exclusion U-Net reaches
        held-out Dice 0.889 on ISIC 2018 Task 1.
      </p>
      <p>
        The second finding is negative, and it is the more interesting one: <strong>masking does not close the gap, and does not even
        help.</strong> Isolating skin from background and lesion was expected to make the clinical labels more predictable. It did not,
        which points at the labels rather than at contamination in the images.
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
        <strong>Results committed.</strong> Core pipeline (masking, featurization, clustering, benchmarking) is implemented and reproducible.
        Segmentation is being reworked with additional data before an interactive demo is built.
      </p>
    </>
  );
}
