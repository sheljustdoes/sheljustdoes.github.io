export const metadata = { title: "menhir. — shel." };

export default function MenhirPage() {
  return (
    <>
      <span className="kicker">Project — 2026–</span>
      <h1>menhir.</h1>
      <p className="tagline">
        A dual-role strength coaching platform, built and maintained solo — where a generative pipeline sits on top of deterministic
        training mathematics rather than replacing it.
      </p>

      <h2>Why this exists</h2>
      <p>
        Logging apps record what happened. Coaching software tells you what to do next. The gap between them is{" "}
        <em>autoregulation</em> — adjusting a session against how the athlete actually turned up that day, rather than against a plan
        written three weeks ago. menhir targets the two populations that gap hurts most: self-coached athletes who have outgrown a
        spreadsheet, and coaches managing ten to fifty people whose check-ins arrive faster than they can read them.
      </p>

      <h2>Approach</h2>
      <p>
        Programming is driven by multiple autoregulation signals — readiness, sleep, performance trend, and calibrated RPE — combined into
        a session adjustment the athlete sees <em>before</em> they train. The architecturally interesting part is what sits underneath the
        AI. A provider abstraction spans Groq, OpenAI, and Anthropic, but generation never has the last word: fourteen deterministic
        methodology generators and an RPE calibration engine enforce the training mathematics, and every generated program is validated
        and shown for preview before it can be committed or assigned. Live AI can be switched off entirely, at which point the whole flow
        still runs against mock templates — which is also how it is developed.
      </p>
      <p>
        The rest is the unglamorous part of shipping something people depend on: Auth.js v5 OAuth with role-aware route protection, tiered
        subscription billing across five plans for both athletes and coaches, server-backed notifications and Web Push, and an installable
        PWA with cached offline reads and background-sync offline writes — so a session logged in a basement gym reconciles when signal
        returns. The data layer sits behind a single adapter seam, so the storage backend is a swap rather than a rewrite.
      </p>

      <h2>Key results</h2>
      <p>
        Roughly <strong>106,000 lines across 349 files</strong>, with 25 test modules and 458 commits. The full loop is implemented on both
        sides: an athlete&apos;s pre-session check-in through live logging to a post-session summary, and a coach&apos;s action queue,
        roster management, per-athlete analytics, check-in triage, and program assignment — by template, by custom multi-block builder, or
        generated from the athlete&apos;s own intake with preview before assignment.
      </p>

      <h2>Status</h2>
      <p className="status-line">
        <strong>Private and in use.</strong> The repository stays private; this write-up is the public account of it. Current focus is
        documentation and test coverage on the billing and offline-reconciliation paths.
      </p>
    </>
  );
}
