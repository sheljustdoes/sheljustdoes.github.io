import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PROJECT_BY_ID } from "@/lib/projects";

/**
 * A write-up's byline, dated like a journal article. The years come from the project's résumé
 * dates (`date` in lib/projects.ts), the ground truth for when it ran; "Updated" is the
 * repository's last commit, which scripts/repo-dates.mjs records before dev and build. A project
 * with no end year, or with a commit after its end year, runs to "present". A visual story, where
 * there is one, is linked here and nowhere else on the site's lists. Children are the work's
 * milestones, on a second line.
 */
export default function Byline({ id, children }: { id: string; children?: React.ReactNode }) {
  const p = PROJECT_BY_ID[id];
  const updated = UPDATED[id];
  // "2023–2025" ran and ended, "2026–" is open, and a lone "2025" began and ended that year.
  const [start, end = start] = (p.date ?? "").split(/[–-]/).map((y) => y.trim());
  const active = !end || (updated !== undefined && updated.slice(0, 4) > end);
  return (
    <>
      <p className="byline">
        Shel Burkes, PhD
        {start && (
          <>
            <span className="sep">·</span>
            {active ? `${start}–present` : start === end ? start : `${start}–${end}`}
          </>
        )}
        {updated && (
          <>
            <span className="sep">·</span>Updated <time dateTime={updated}>{long(updated)}</time>
          </>
        )}
      </p>
      {/* The work's own milestones (pre-registered, scored), which the dates above do not replace. */}
      {children && <p className="byline byline-history">{children}</p>}
      {p.story && (
        <p className="story-link">
          <a href={p.story}>See the visual story →</a>
        </p>
      )}
    </>
  );
}

/** Slug → YYYY-MM-DD of the repository's last commit; empty when no repository could be read. */
const UPDATED: Record<string, string> = (() => {
  const file = join(process.cwd(), "lib/repo-dates.json");
  return existsSync(file) ? JSON.parse(readFileSync(file, "utf8")) : {};
})();

const long = (iso: string) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
