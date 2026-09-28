/** Superscript citation marker(s): <Ref n={2} /> → ², <Ref n={[1, 3]} /> → ¹,³.
 * Each number links to that entry in the page's numbered reference list
 * (<ol className="references" id="references">). */
export default function Ref({ n }: { n: number | number[] }) {
  const ns = Array.isArray(n) ? n : [n];
  return (
    <sup className="ref">
      {ns.map((k, i) => (
        <span key={k}>
          {i > 0 && ","}
          <a href="#references" aria-label={`Reference ${k}`}>{k}</a>
        </span>
      ))}
    </sup>
  );
}
