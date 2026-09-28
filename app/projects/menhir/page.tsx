export const metadata = { title: "menhir. — shel." };

export default function MenhirPage() {
  return (
    <>
      <span className="kicker">Project — menhir · 2026–</span>
      <h1>A strength coaching platform keeps deterministic training mathematics above its generative pipeline</h1>
      <p className="byline">
        Shel Burkes, PhD<span className="sep">·</span>2026<span className="sep">·</span>Private and in use
      </p>

      <div className="abstract">
        <span className="abstract-label">Abstract</span>
        Logging apps record what happened; coaching software tells you what to do next. The gap between them is autoregulation —
        adjusting a session against how the athlete actually turned up that day, rather than against a plan written three weeks ago —
        and it hurts most the self-coached athlete who has outgrown a spreadsheet and the coach managing ten to fifty people whose
        check-ins arrive faster than they can be read. Here we describe menhir, a dual-role strength coaching platform built and
        maintained solo, in which a generative pipeline sits on top of deterministic training mathematics rather than replacing it: a
        provider abstraction spans Groq, OpenAI and Anthropic, but fourteen deterministic methodology generators and an RPE calibration
        engine enforce the training mathematics, and every generated program is validated and shown for preview before it can be
        committed or assigned. The full loop is implemented on both the athlete and the coach side — roughly 106,000 lines across 349
        files, with 25 test modules and 458 commits — and the platform is private and in use.
      </div>

      <p>
        Logging apps record what happened. Coaching software tells you what to do next. The gap between them is{" "}
        <em>autoregulation</em> — adjusting a session against how the athlete actually turned up that day, rather than against a plan
        written three weeks ago. menhir targets the two populations that gap hurts most: self-coached athletes who have outgrown a
        spreadsheet, and coaches managing ten to fifty people whose check-ins arrive faster than they can read them. It serves both
        roles from one codebase, and it is built and maintained solo.
      </p>

      <h2>Autoregulation signals adjust the session before it starts</h2>
      <p>
        Programming is driven by multiple autoregulation signals — readiness, sleep, performance trend, and calibrated RPE — combined
        into a session adjustment the athlete sees <em>before</em> they train. The adjustment is the product the platform exists to
        deliver: not a record of the session that happened, but a concrete change to the session about to happen.
      </p>

      <h2>Generation never has the last word</h2>
      <p>
        The architecturally interesting part is what sits underneath the AI. A provider abstraction spans Groq, OpenAI, and Anthropic,
        but generation never has the last word: fourteen deterministic methodology generators and an RPE calibration engine enforce the
        training mathematics, and every generated program is validated and shown for preview before it can be committed or assigned.
        Live AI can be switched off entirely, at which point the whole flow still runs against mock templates — which is also how it is
        developed.
      </p>

      <h2>The unglamorous parts carry the product</h2>
      <p>
        The rest is the unglamorous part of shipping something people depend on: Auth.js v5 OAuth with role-aware route protection,
        tiered subscription billing across five plans for both athletes and coaches, server-backed notifications and Web Push, and an
        installable PWA with cached offline reads and background-sync offline writes — so a session logged in a basement gym reconciles
        when signal returns. The data layer sits behind a single adapter seam, so the storage backend is a swap rather than a rewrite.
      </p>

      <h2>The full loop is implemented on both sides</h2>
      <p>
        The codebase stands at roughly <strong>106,000 lines across 349 files</strong>, with 25 test modules and 458 commits. The full
        loop is implemented on both sides: an athlete&apos;s pre-session check-in through live logging to a post-session summary, and a
        coach&apos;s action queue, roster management, per-athlete analytics, check-in triage, and program assignment — by template, by
        custom multi-block builder, or generated from the athlete&apos;s own intake with preview before assignment.
      </p>

      <h2>Discussion</h2>
      <p>
        menhir&apos;s central design decision is that the generative pipeline proposes while deterministic training mathematics
        disposes: the same validation-and-preview gate that keeps a generated program from reaching an athlete unchecked also makes the
        whole system developable with AI switched off, against mock templates. The platform is private and in use, which
        bounds what this account can claim: there are no public deployment figures here, only the shape of the system and the loop it
        implements.
      </p>
      <p>
        The limits are the ordinary ones of a solo-maintained production system, and the current focus is on two of them:
        documentation, and test coverage on the billing and offline-reconciliation paths.
      </p>

      <div className="endmatter">
        <h2>Code availability</h2>
        <p>The repository is private; this write-up is the public account of it.</p>
      </div>
    </>
  );
}
