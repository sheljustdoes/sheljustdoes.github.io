import type { Metadata } from "next";

// Every project write-up (and the /projects index) stays out of search results; pages remain linkable.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="write-up">
      {/* Same reason as <body> in layout.tsx: dark-mode extensions rewrite this tag
          (adding class="native-dark-class-modified") before hydration. */}
      <style suppressHydrationWarning>{WRITEUP_CSS}</style>
      <nav aria-label="Site">
        <a href="/" className="write-up-back">
          ← shel.
        </a>
      </nav>
      <main>
        <article>{children}</article>
      </main>
    </div>
  );
}

const WRITEUP_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=DM+Mono:wght@300;400;500&display=swap');
*, *::before, *::after { box-sizing: border-box; }
:root {
  --cream:#F5F1EB; --parchment:#EAE4D9; --taupe:#C8BFB0; --charcoal:#1E1C1A;
  --terracotta:#D4603A; --amber:#E8A830; --indigo:#3A4D8F; --indigo-deep:#2F3E7A; --forest:#2E5A45; --dusty-blue:#7A8FB5;
  --display:'Outfit', sans-serif; --serif:'Lora', Georgia, serif; --mono:'DM Mono', monospace;
}
.write-up { background: var(--cream); min-height: 100vh; color: var(--charcoal); font-family: var(--serif); }
.write-up-back {
  display: inline-block; margin: 32px 0 0 48px; font-family: var(--mono); font-size: 0.75rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: #655f55; text-decoration: none;
}
.write-up-back:hover { color: var(--terracotta); }
article { max-width: 720px; margin: 0 auto; padding: 32px 32px 96px; line-height: 1.7; font-size: 1rem; }
article h1 {
  font-family: var(--display); font-size: 2.4rem; font-weight: 600; letter-spacing: -0.02em; color: var(--charcoal);
  margin: 0 0 4px;
}
article .kicker {
  font-family: var(--mono); font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--terracotta);
  margin-bottom: 16px; display: block;
}
article .tagline { font-style: italic; color: #4a4540; font-size: 1.1rem; margin-bottom: 32px; padding-bottom: 28px; border-bottom: 1px solid var(--parchment); }
article .byline {
  font-family: var(--mono); font-size: 0.72rem; color: #4a4540; margin: 0 0 24px;
}
article .byline .sep { color: var(--taupe); margin: 0 8px; }
article .abstract {
  font-size: 0.95rem; line-height: 1.65; color: #333130; margin: 0 0 36px; padding: 20px 24px;
  background: rgba(227, 220, 207, 0.28); border-top: 1px solid var(--parchment); border-bottom: 1px solid var(--parchment);
}
article .abstract .abstract-label { font-family: var(--mono); font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--taupe); display: block; margin-bottom: 8px; }
article sup.ref { font-size: 0.68em; line-height: 0; }
article sup.ref a { color: var(--terracotta); text-decoration: none; }
article sup.ref a:hover { text-decoration: underline; }
article .box {
  margin: 24px 0 28px; padding: 18px 22px; border: 1px solid var(--parchment); background: rgba(227, 220, 207, 0.18);
  font-size: 0.9rem;
}
article .box .box-lead { font-weight: 600; color: var(--charcoal); display: block; margin-bottom: 10px; }
article .box p { margin: 0 0 10px; }
article .box p:last-child { margin-bottom: 0; }
article .box dt { font-weight: 600; color: var(--charcoal); float: left; clear: left; margin-right: 8px; }
article .box dd { margin: 0 0 8px; }
article .article-table { margin: 28px 0 32px; font-size: 0.85rem; }
article .article-table figcaption { text-align: left; font-size: 0.85rem; color: #4a4540; margin-bottom: 10px; }
article .article-table .fig-lead { font-weight: 600; color: var(--charcoal); }
article .article-table table, article > table { border-collapse: collapse; width: 100%; font-size: 0.82rem; margin: 0 0 24px; }
article .article-table th, article .article-table td, article > table th, article > table td { text-align: left; padding: 6px 10px; border-top: 1px solid var(--parchment); vertical-align: top; }
article .article-table thead th, article > table thead th { border-top: none; border-bottom: 1.5px solid var(--taupe); font-weight: 600; color: var(--charcoal); }
article .article-table tbody tr:last-child td, article > table tbody tr:last-child td { border-bottom: 1.5px solid var(--taupe); }
article .article-table .footnote { font-size: 0.75rem; color: #4a4540; margin-top: 6px; }
article .endmatter { font-size: 0.85rem; color: #4a4540; }
article .endmatter p { color: #4a4540; margin-bottom: 12px; }
article h2 {
  font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--taupe);
  margin: 40px 0 14px; display: flex; align-items: center; gap: 12px;
}
article h2::after { content: ''; flex: 1; height: 1px; background: var(--parchment); }
article p { margin: 0 0 16px; color: #333130; }
article strong { color: var(--indigo); font-weight: 600; }
article a { color: #a8431f; } /* terracotta darkened to over 5:1 on cream for link text */
article ul, article ol { margin: 0 0 16px; padding-left: 20px; color: #333130; }
article li { margin-bottom: 6px; }
article table { width: 100%; border-collapse: collapse; margin: 0 0 24px; font-size: 0.88rem; }
article th, article td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--parchment); }
article th { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--taupe); }
/* Journal-style figures: wider than the text column, sans captions led by "Fig. n |". */
article figure { margin: 36px 0; }
article figure.wide { width: min(960px, calc(100vw - 32px)); position: relative; left: 50%; transform: translateX(-50%); }
article figure a { display: block; }
article figure img { display: block; width: 100%; height: auto; }
article figcaption { max-width: 720px; margin: 12px auto 0; padding: 0 32px; font-family: var(--display); font-size: 0.82rem; line-height: 1.55; color: #4a4540; }
article figure:not(.wide) figcaption { padding: 0; }
article figcaption .fig-lead { font-weight: 600; color: var(--charcoal); }
article figcaption b { font-weight: 600; color: var(--charcoal); }
@media (max-width: 640px) { article figcaption { padding: 0; } }
/* Interactive figures: the PNG shows until the chart is drawn, then gives way; print keeps the PNG. */
.ifig .ifig-box { position: relative; }
.ifig .ifig-plot { display: none; width: 100%; }
.ifig[data-state="loading"] .ifig-static { opacity: 0.55; }
.ifig[data-state="ready"] .ifig-static { display: none; }
.ifig[data-state="ready"] .ifig-plot { display: block; }
.ifig .ifig-hint { color: #8a8378; }
.ifig-data { max-width: 720px; margin: 10px auto 0; padding: 0 32px; font-family: var(--display); font-size: 0.8rem; color: #4a4540; }
.ifig-data summary { cursor: pointer; font-weight: 600; color: var(--charcoal); }
.ifig-data .ifig-table { max-height: 360px; overflow: auto; margin: 8px 0; border: 1px solid #e3dccf; }
.ifig-data table { border-collapse: collapse; width: 100%; font-family: var(--mono); font-size: 0.72rem; }
.ifig-data caption { text-align: left; padding: 6px 8px; font-family: var(--display); color: #4a4540; }
.ifig-data th, .ifig-data td { text-align: left; padding: 4px 8px; border-top: 1px solid #e3dccf; white-space: nowrap; }
.ifig-data th { position: sticky; top: 0; background: var(--cream); font-weight: 500; }
@media (max-width: 640px) { .ifig-data { padding: 0; } }
@media print { .ifig .ifig-plot { display: none !important; } .ifig .ifig-static { display: block !important; opacity: 1 !important; } .ifig-data { display: none; } }
article .status-line {
  margin-top: 40px; padding-top: 20px; border-top: 2px solid var(--charcoal); font-family: var(--mono); font-size: 0.7rem;
  letter-spacing: 0.05em; color: #4a4540;
}
article .status-line strong { color: var(--charcoal); }
article .abstract { font-size: 0.94rem; padding-left: 18px; border-left: 2px solid var(--parchment); }
article .references { font-size: 0.82rem; line-height: 1.55; color: #4a4540; padding-left: 24px; }
article .references li { margin-bottom: 8px; overflow-wrap: anywhere; }
`;
