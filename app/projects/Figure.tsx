/** One journal-style figure: wide image linking to its full-resolution file, sans caption. */
export default function Figure({ n, src, alt, lead, children }: { n: number; src: string; alt: string; lead: string; children: React.ReactNode }) {
  return (
    <figure className="wide">
      <a href={src} target="_blank" rel="noopener">
        <img src={src} alt={alt} loading="lazy" />
      </a>
      <figcaption>
        <span className="fig-lead">
          Fig. {n} | {lead}
        </span>{" "}
        {children}
      </figcaption>
    </figure>
  );
}
