import { PROJECT_BY_ID, displayStatus } from "@/lib/projects";

export const metadata = { title: "menhir. — shel." };

// A supporting project, so a visual summary rather than a write-up: the screens and the facts.
// Screens are captured from the demo mode (APP_DEMO=1), never from production.

const p = PROJECT_BY_ID.menhir;

const SPECS: [string, string][] = [
  ["Status", `${displayStatus(p.status!)} · private beta`],
  ["Roles", "Athlete and coach, one codebase"],
  ["Stack", "Next.js (App Router), TypeScript, Stripe, Neon Postgres"],
  ["Generation", "Groq, OpenAI and Anthropic behind one interface; 14 deterministic methodology engines and an RPE calibration engine validate every program before it commits"],
  ["Platform", "Invite-based accounts, five billing plans, Web Push, offline-capable PWA"],
  ["Size", "~106K LOC · 349 files · 25 test modules"],
  ["Team", "Two partners: Shel owns code and infrastructure; a coaching partner owns the methodology"],
];

const SHOTS = [
  { src: "/projects/supporting/menhir.webp", alt: p.shot!.alt, caption: "Athlete home: coach, week schedule, and today's prescribed session." },
  { src: "/projects/supporting/menhir-session.webp", alt: "Pre-session check-in in menhir: readiness, sleep and life factors", caption: "Check-in before training. Readiness, sleep and life factors adjust the session before it starts." },
  { src: "/projects/supporting/menhir-coach.webp", alt: "menhir coach dashboard: review queue, pain flags, weekly pulse and action queue", caption: "Coach dashboard: check-ins to review, pain flags, weekly pulse and the action queue." },
];

export default function MenhirPage() {
  return (
    <>
      <span className="kicker">Supporting — production systems · {p.date}</span>
      <h1>menhir.</h1>
      <p className="tagline">{p.shot!.caption}</p>

      <dl className="specs">
        {SPECS.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>

      <ol className="shots">
        {SHOTS.map((s, i) => (
          <li key={s.src} className={i === 2 ? "wide" : undefined}>
            <a href={s.src} target="_blank" rel="noopener">
              <img src={s.src} alt={s.alt} loading={i ? "lazy" : undefined} />
            </a>
            <p>
              <span className="shot-n">{String(i + 1).padStart(2, "0")}</span> {s.caption}
            </p>
          </li>
        ))}
      </ol>

      <p className="shots-note">Screens from the demo mode, with seeded data. The repository is private.</p>

      <style suppressHydrationWarning>{CSS}</style>
    </>
  );
}

const CSS = `
article .specs { margin: 28px 0 8px; border-top: 3px solid var(--charcoal); }
article .specs div { display: grid; grid-template-columns: 120px 1fr; gap: 16px; padding: 9px 0; border-bottom: 1px solid var(--parchment); }
article .specs dt { font-family: var(--mono); font-size: 0.64rem; letter-spacing: 0.12em; text-transform: uppercase; color: var(--terracotta); padding-top: 4px; }
article .specs dd { margin: 0; font-size: 0.92rem; line-height: 1.55; }
article .shots { list-style: none; padding: 0; margin: 40px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 32px 24px; }
article .shots li.wide { grid-column: 1 / -1; }
article .shots a { display: flex; justify-content: center; background: var(--parchment); padding: 22px; }
article .shots img { max-width: 100%; max-height: 560px; box-shadow: 0 6px 18px rgba(30, 28, 26, 0.14); }
article .shots p { font-size: 0.86rem; line-height: 1.55; margin: 10px 0 0; color: #4a4540; }
article .shot-n { font-family: var(--display); font-weight: 300; font-size: 1.1rem; color: var(--terracotta); margin-right: 4px; }
article .shots-note { font-family: var(--mono); font-size: 0.66rem; letter-spacing: 0.04em; color: #8a8378; margin-top: 32px; }
@media (max-width: 560px) {
  article .shots { grid-template-columns: 1fr; }
  article .specs div { grid-template-columns: 1fr; gap: 2px; }
}
`;
