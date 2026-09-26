# Backlog

Standing queue of development work for this project, ordered by priority.
Created 2026-09-22.

**Status:** Shipped — static Next.js export on GitHub Pages

---

## P0 — Project coverage

Eight projects have long-form write-up pages (`iridis`, `lambent`, `argus`, `topos`,
`veridian`, `recolo`, `noul`, `menhir`) while `PORTFOLIO.md` describes twenty-five.

- [x] Restructure around three product lines with flagships. Done 2026-09-25:
      `PORTFOLIO.md` and `lib/projects.ts` share six sections (three lines, three
      supporting); `/projects/` is the products index; the build enforces one flagship
      per line, listed first, with a write-up.
- [x] Write up `argus`. Done 2026-09-25: `/projects/argus/`, linked from the résumé,
      graph panel and products index.
- [x] Audit fragaria's Stage 0 scorecard. Done 2026-09-25: reproducible but uninformative
      (fragaria `docs/stage0_audit.md`); PORTFOLIO.md and the summary say so.
- [x] Rerun fragaria's Stage 0 under a rebuilt, pre-registered rubric. Done 2026-09-25:
      GO narrowly, PCA only (fragaria `build/stage0_v2/RESULTS.md`).
- [ ] Write up `fragaria` — now unblocked. Link it from the topos write-up.
- [x] Write up `noul`. Done 2026-09-25 at Shel's request, before the label review, with
      the labels disclosed as Claude-drafted and unreviewed. Update it when the review lands.
- [ ] Later write-ups: `oncos` only if Shel opens its methods; `indicium` once a count
      has run.
- [x] Bring the iridis write-up in line with its entry. Done 2026-09-25: dates, the exact
      accuracy ranges, the masking negative finding, and the single-atlas limit.
- [ ] Decide whether `PORTFOLIO.md` should render as a route on the site rather than
      existing only as a repository file.
- [x] Keep the résumé route and `PORTFOLIO.md` consistent when either changes. Done
      2026-09-24: `lib/projects.ts` feeds the résumé, the graph and the Doc feed, and the
      post-build check fails on drift.
- [x] Place graph nodes for the projects that have none: oncos, indicium, noul, legere,
      catasta, custos, bibliotheca, bibliotheca-archive, ponere, and this site. Done
      2026-09-25, with mara added too; the post-build check now fails when a featured or
      Shipped project has no node.
- [x] Role nodes in `lib/graph-data.ts` restate résumé text by hand (the teaching figures
      had drifted from `lib/resume.ts`). Done 2026-09-25: each role node names its résumé
      entry, takes its dates from it, and the build fails on any figure the entry lacks.
- [x] Squash or rewrite history to remove the client name from the old README's project
      table. Done 2026-09-25: history squashed to one commit.

## P1 — Quality

- [ ] Accessibility pass: heading order, link text, focus states, contrast in both themes.
- [ ] Lighthouse run; the fully static export should score near the ceiling and any gap is
      worth understanding.
- [ ] Open Graph and Twitter card images for the site and each project page.
- [ ] Confirm every project page reads correctly at phone width.

## P2 — Infrastructure

- [ ] CI check that the site builds before deploy, so a broken build fails on push rather
      than on Pages.
- [ ] Link checker for the external references across project pages.
- [ ] Consider hosting interactive demos here via the catasta pattern.

## Documentation

- [x] Document the content model. Done 2026-09-24: the header of `lib/projects.ts` is the
      reference, and the unused `lib/timeline-data.ts` is gone.
- [ ] Document how to add a project write-up page.
