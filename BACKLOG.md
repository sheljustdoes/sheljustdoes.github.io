# Backlog

Standing queue of development work for this project, ordered by priority.
Created 2026-09-22.

**Status:** Shipped — static Next.js export on GitHub Pages

---

## P0 — Project coverage

Six projects have long-form write-up pages (`iridis`, `lambent`, `topos`, `veridian`,
`recolo`, `menhir`) while `PORTFOLIO.md` describes twenty-five.

- [x] Restructure around three product lines with flagships. Done 2026-09-25:
      `PORTFOLIO.md` and `lib/projects.ts` share six sections (three lines, three
      supporting); `/projects/` is the products index; the build enforces one flagship
      per line, listed first, with a write-up.
- [ ] Write up `argus` — results committed, pre-registered negative result, no page yet.
- [ ] Write up `fragaria` once its Stage 0 scorecard is audited (see fragaria BACKLOG):
      the only executed proof behind the topos line. Link it from the topos write-up.
- [ ] Later write-ups: `noul` after its labels are reviewed; `oncos` only if Shel opens
      its methods; `indicium` once a count has run.
- [ ] The iridis write-up has drifted from its entry: kicker says 2024– (entry 2023–2025)
      and it omits the negative finding that masking did not close the gap.
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
