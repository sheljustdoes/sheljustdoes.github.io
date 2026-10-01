export const metadata = { title: "menhir. — shel." };

export default function MenhirPage() {
  return (
    <>
      <span className="kicker">Project — menhir · 2026–</span>
      <h1>A strength coaching platform keeps deterministic training mathematics above its generative pipeline</h1>
      <p className="byline">
        Shel Burkes, PhD<span className="sep">·</span>2026<span className="sep">·</span>Private beta
      </p>

      <div className="abstract">
        <span className="abstract-label">Abstract</span>
        Logging apps record what happened; coaching software tells you what to do next. The gap between them is autoregulation —
        adjusting a session against how the athlete actually turned up that day, rather than against a plan written three weeks ago —
        and it hurts most the self-coached athlete who has outgrown a spreadsheet and the coach managing ten to fifty people whose
        check-ins arrive faster than they can be read. Here we describe menhir, a dual-role strength coaching platform built by two
        partners, one owning the code and infrastructure and the other the training methodology, in which a generative pipeline sits on top of deterministic training mathematics rather than replacing it: a
        provider abstraction spans Groq, OpenAI and Anthropic, but fourteen deterministic methodology generators and an RPE calibration
        engine enforce the training mathematics, and every generated program is validated and shown for preview before it can be
        committed or assigned. Before launch, the storage backend moved from a spreadsheet-backed script to Postgres through a single
        adapter seam, deleting about 4,300 lines of the old backend. The full loop is implemented on both the athlete and the coach
        side — roughly 106,000 lines across 349 files, with 25 test modules and 458 commits — and the platform is in private beta.
      </div>

      <p>
        Logging apps record what happened. Coaching software tells you what to do next. The gap between them is{" "}
        <em>autoregulation</em> — adjusting a session against how the athlete actually turned up that day, rather than against a plan
        written three weeks ago. menhir targets the two populations that gap hurts most: self-coached athletes who have outgrown a
        spreadsheet, and coaches managing ten to fifty people whose check-ins arrive faster than they can read them. It serves both
        roles from one codebase, and two partners build it: Shel owns the code and infrastructure, and a coaching partner owns the
        training methodology and content.
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

      <h2>The storage backend was replaced through one adapter seam before launch</h2>
      <p>
        The first version stored everything through a Google Apps Script web app: one JSON file per profile in Drive, and session logs
        in Sheets. Cold starts took 20 seconds or more, which the code worked around with a 25-second call budget, a warm-up ping and
        redirect handling. Shared writes had no locking, and the coach roster was stored twice, once on the coach and once on each
        athlete; keeping the two in step by hand had already caused two shipped bugs.
      </p>
      <p>
        We moved the backend to Neon Postgres before launch rather than after the training-program audit. With no users yet, the
        migration needed no data moved, and any hardening of the old backend would have been thrown away. The audit was the reason
        to wait, because it will keep changing the shape of program data, and a hybrid schema removed that reason: identity, rosters
        and logs went into tables with constraints, while programs, training-system documents and AI outputs went into{" "}
        <code>jsonb</code>, which absorbs shape changes without migrations. Neon won over Supabase because only the Next.js server
        connects to the database, so Supabase&apos;s own sign-in and row-level security would have gone unused, and Neon&apos;s free
        tier resumes an idle database on the next query, where Supabase&apos;s pauses one after a week and needs restoring by hand.
      </p>
      <p>
        Every caller already went through one 55-method data interface, so the move was a new adapter, not a rewrite. The new adapter
        matches the old one&apos;s observable behaviour with three deliberate differences: the roster has a single source of truth,
        multi-row changes run in one transaction, and roster transitions follow rules the partners agreed for the move. Logic that had
        lived only in the Apps Script (ID generation, idempotent writes, personal-record lookup, roster offboarding) was ported to
        TypeScript, where it is now tested: 32 contract tests run the adapter against real Postgres in memory. Production cut over on
        30 September 2026, and the change that deleted the old backend removed about 4,300 lines.
      </p>

      <h2>Two partners decide in writing before they build</h2>
      <p>
        menhir has two owners with different expertise, so decisions live in the repository rather than in chat. A single decision
        register records each decision with an owner and a reviewer: the coaching partner owns methodology and content, and Shel owns
        code and infrastructure. Large and medium changes need an accepted decision record and an approved specification before any
        code is written, and every change goes through a pull request reviewed by the other partner, with tests, lint and a production
        build run on each one. The register&apos;s first principle is that code is the source of truth, so decisions cite the file and
        line they rest on.
      </p>
      <p>
        The same split governs the training content. The platform never invents it: exercises and programs come from the movement
        library, the training-system documents or the coaching partner&apos;s sources. The audit of the program library scores each
        program twice, for content fidelity, judged by the coaching partner, and for runtime fidelity, judged by Shel, and rebuilds the
        engines one family at a time, with the most complex method last.
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
        whole system developable with AI switched off, against mock templates. The second decision was timing: infrastructure work is
        nearly free before launch, so the backend moved to Postgres while there was no data to carry. The platform is in private
        beta, which bounds what this account can claim: there are no public usage figures here, only the shape of the system and the
        loop it implements.
      </p>
      <p>
        The limits are the ordinary ones of a small-team production system: documentation, and test coverage on the billing and
        offline-reconciliation paths. Two changes come next. Google sign-in gives way to an email-and-password accounts core shared
        with Shel&apos;s other apps, and the program audit rebuilds the engines family by family.
      </p>

      <div className="endmatter">
        <h2>Code availability</h2>
        <p>The repository is private; this write-up is the public account of it.</p>
      </div>
    </>
  );
}
