// Published as /resume.json at build time: the whole Google Doc résumé below its
// header, pre-formatted for the Doc. scripts/resume-sync.gs rebuilds each Doc
// section from this, so the Doc says exactly what the site says.
//
// Emphasis markers are stripped (the Doc body carries no inline bold), dates use
// the Doc's MM/YYYY form, and Projects carries the featured entries only.

import { AREAS, PROJECTS, displayStatus } from "@/lib/projects";
import { CERTIFICATIONS, EDUCATION, EXPERIENCE, PUBLICATIONS, SKILLS, SUMMARY, docDates, plain } from "@/lib/resume";

export const dynamic = "force-static";

export function GET() {
  return Response.json({
    summary: plain(SUMMARY),
    experience: EXPERIENCE.map((r) => ({
      title: r.title,
      company: r.company,
      dates: docDates(r),
      lead: r.lead ?? null,
      bullets: r.bullets.map(plain),
    })),
    // The Doc has no Publication heading, so the paper closes the Education list.
    education: [
      ...EDUCATION.map((e) => [e.degree, e.institution, e.year].filter(Boolean).join(", ")),
      ...PUBLICATIONS.map((p) => `${p.citation} doi:${p.doi}`),
    ],
    certifications: CERTIFICATIONS.map((c) => `${c.name}, ${c.note}`),
    skills: SKILLS.map((g) => `${g.group}: ${g.items.join(", ")}.`).join(" "),
    projects: AREAS.map((a) => ({
      label: a.label,
      projects: PROJECTS.filter((p) => p.area === a.id && p.featured).map((p) => ({
        name: p.name,
        meta: [p.date, p.status && displayStatus(p.status)].filter(Boolean).join(" · "),
        summary: p.resumeLine ?? p.summary,
      })),
    })).filter((a) => a.projects.length > 0),
  });
}
