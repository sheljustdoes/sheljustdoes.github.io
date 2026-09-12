export const metadata = { title: "iridis. — shel." };

export default function IridisPage() {
  return (
    <>
      <span className="kicker">Project — 2024–</span>
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
        color clusters are roughly <strong>2.5x more predictable</strong> than the clinical Fitzpatrick labels they&apos;re meant to
        summarize — 96% classification accuracy for the discovered clusters versus 36–42% for the six-bucket clinical scale, across both a
        classical (Random Forest) and an in-context (TabPFN) model. That gap is evidence the clinical scale is collapsing real, learnable
        perceptual variation, not a modeling artifact.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Active.</strong> Core pipeline (masking, featurization, clustering, benchmarking) is implemented and reproducible.
        Segmentation is being reworked with additional data before an interactive demo is built.
      </p>
    </>
  );
}
