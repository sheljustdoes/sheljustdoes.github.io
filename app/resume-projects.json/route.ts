// Published as /resume-projects.json at build time. The Google Doc résumé's
// Apps Script (scripts/resume-sync.gs) reads this to rebuild its PROJECTS
// section, so the Doc lists the featured projects exactly as the site does.
//
// Every project is included with its `featured` flag, so the post-build check
// can compare the full set against PORTFOLIO.md; the Doc filters to featured.

import { AREAS, PROJECTS, displayStatus } from "@/lib/projects";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    areas: AREAS.map((a) => ({
      id: a.id,
      label: a.label,
      portfolioSection: a.portfolioSection,
      projects: PROJECTS.filter((p) => p.area === a.id).map((p) => ({
        id: p.id,
        name: p.name,
        status: p.status ?? null,
        statusLabel: p.status ? displayStatus(p.status) : null,
        date: p.date ?? null,
        summary: p.summary,
        featured: Boolean(p.featured),
      })),
    })),
  });
}
