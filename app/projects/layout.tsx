export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="write-up">
      <style>{WRITEUP_CSS}</style>
      <a href="/" className="write-up-back">
        ← shel.
      </a>
      <article>{children}</article>
    </div>
  );
}

const WRITEUP_CSS = `
*, *::before, *::after { box-sizing: border-box; }
@import url('https://fonts.googleapis.com/css2?family=Outfit:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Lora:ital,wght@0,400;0,500;1,400;1,500&family=DM+Mono:wght@300;400;500&display=swap');
:root {
  --cream:#F5F1EB; --parchment:#EAE4D9; --taupe:#C8BFB0; --charcoal:#1E1C1A;
  --terracotta:#D4603A; --amber:#E8A830; --indigo:#3A4D8F; --forest:#2E5A45; --dusty-blue:#7A8FB5;
  --display:'Outfit', sans-serif; --serif:'Lora', Georgia, serif; --mono:'DM Mono', monospace;
}
.write-up { background: var(--cream); min-height: 100vh; color: var(--charcoal); font-family: var(--serif); }
.write-up-back {
  display: inline-block; margin: 32px 0 0 48px; font-family: var(--mono); font-size: 0.68rem; letter-spacing: 0.1em;
  text-transform: uppercase; color: var(--taupe); text-decoration: none;
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
article h2 {
  font-family: var(--mono); font-size: 0.7rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--taupe);
  margin: 40px 0 14px; display: flex; align-items: center; gap: 12px;
}
article h2::after { content: ''; flex: 1; height: 1px; background: var(--parchment); }
article p { margin: 0 0 16px; color: #333130; }
article strong { color: var(--indigo); font-weight: 600; }
article a { color: var(--terracotta); }
article ul, article ol { margin: 0 0 16px; padding-left: 20px; color: #333130; }
article li { margin-bottom: 6px; }
article table { width: 100%; border-collapse: collapse; margin: 0 0 24px; font-size: 0.88rem; }
article th, article td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--parchment); }
article th { font-family: var(--mono); font-size: 0.62rem; letter-spacing: 0.08em; text-transform: uppercase; color: var(--taupe); }
article .status-line {
  margin-top: 40px; padding-top: 20px; border-top: 2px solid var(--charcoal); font-family: var(--mono); font-size: 0.7rem;
  letter-spacing: 0.05em; color: #4a4540;
}
article .status-line strong { color: var(--charcoal); }
`;
