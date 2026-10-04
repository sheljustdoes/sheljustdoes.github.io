# Backlog

Standing queue of development work for this project, ordered by priority.
Created 2026-09-22.

**Status:** Shipped — static Next.js export on GitHub Pages

---

## P0 — Résumé, version A (Staff Applied Scientist, ML & LLM Systems)

Broadened 2026-10-01 at Shel's request: the work is not only bio-based. Headline now
"Applied ML & LLM Systems"; summary leads with ML and LLM systems across pharma, consumer
and genomics; skills regrouped with an LLM systems group; selected projects are veridian,
recolo, noul, menhir and mara (lambent and argus stay on /projects/).

Stage 1 done 2026-09-30: new headline in one place (`HEADLINE` in `lib/resume.ts`), summary
rewritten to the dated 9+ years, Boehringer entry as a dated contract role with six
past-tense bullets, consulting cut to six bullets under one title, generic bullets cut,
projects cut to three selected (`featured` plus a short `resumeLine`), skills cut to 24 in
four groups, the paper on its own line, RepBox's unsupported 7% figure replaced with the
paper's result, em dashes and "real-time" removed, GitHub and ORCID linked in the header.

Stage 2 done 2026-09-30 with the facts Shel could share: Boehringer proof of concept
handed off, financial model scoped to livestock and farming commercial excellence, two
juniors mentored; consulting as a contract data scientist for an unnamed startup with two
primary clients (described, never named, on this public site); Syngenta markers in corn and
tomato, platform "led" rather than "launched" (Shel left before launch); postdoc in the
Cooper Lab, TE insertions in tomato; dissertation title; teaching corrected to the lab of a
graduate course. No further figures can be shared, so the 10-numbered-bullets target is
dropped.

Principal reframe done 2026-10-01: headline "Principal Data Scientist", matching the
Boehringer contract title (Principal Applied Scientist); summary and bullets lead with
ownership and decisions; project lines read as evaluations that drove a call; menhir is
described as two partners (Shel owns code and infrastructure), not solo.

- [x] GAANN fellowship 2020 to 2021; course confirmed as BINF 8100 on the program page. Done 2026-10-01.
- [ ] Certifications: which exam is closest, its target month, and its verification link;
      then show at most one in-progress item.
- [x] Google Doc header: paste "Principal Data Scientist | Applied ML & LLM Systems" by
      hand, remove the email line, add github.com/sheljustdoes (the sync never touches it).
- [ ] Google Doc header: replace the title line with "Staff Applied Scientist | ML & LLM Systems"
      (headline moved from Principal Data Scientist on 2026-10-01; Staff matches the scope of
      the record, and Applied Scientist matches the title held).
- [x] Google Doc: run Résumé → Force sync once. Summary is blocked because the closing
      "Looking for…" sentence was deleted in the Doc; the site now drops it too.
- [ ] Google Doc: the Boehringer and consulting lead lines each sit in a one-cell table, which
      ATS parsers can skip. Turn both back into paragraphs; the sync copies the Doc's styling.
- [x] menhir case study on the write-up page: what Shel owns, the decisions, the results.
- [x] menhir moved from Shipped to Implemented on every surface (2026-10-01): it is not yet
      open to users.
- [ ] menhir: flip back to Shipped when open beta starts, on every surface together:
      `PORTFOLIO.md`, `lib/projects.ts` (status, summary, `resumeLine`), the spec line in
      `app/projects/menhir/page.tsx`, the résumé summary in `lib/resume.ts`, and menhir's
      README status line.
- [ ] menhir figures (~106K LOC, 349 files, 25 test modules, 458 commits) predate the Neon move; recount with one documented method and update every surface together.
- [ ] Versions B, C and D as private files (`Shel-Burkes-Resume-[version]-[date]`), never in
      this public repo.

## P0 — Project coverage

Nine projects have long-form write-up pages (`iridis`, `lambent`, `argus`, `topos`,
`fragaria`, `veridian`, `recolo`, `noul`, `lyco`) while `PORTFOLIO.md` describes twenty-five.
Supporting projects are a screenshot grid on `/projects/` instead, and menhir's page is a
visual summary.

- [x] Supporting projects as a screenshot grid, menhir's write-up replaced by a visual
  summary. Done 2026-10-01; shots in `public/projects/supporting/`, from demo modes
  (`APP_DEMO=1`) or public pages only.
- [ ] Recapture lumen's tile from its web app once that lands on `main`; it shows the
  catalog viewer for now because the web app is a placeholder.
- [ ] Keep the capture repeatable: commit the Playwright capture script (demo logins,
  hidden Next dev badge, mara's client name hidden) so shots can be refreshed when a UI
  changes.

- [x] Restructure around three product lines with flagships. Done 2026-09-25:
      `PORTFOLIO.md` and `lib/projects.ts` share six sections (three lines, three
      supporting); `/projects/` is the products index; the build enforces one flagship
      per line, listed first, with a write-up.
- [x] Frameworks section first (topos, veridian, recolo, noul), always open; Research
      cognition dissolved; fragaria leads Certified structure. Done 2026-09-29.
- [x] Write up `argus`. Done 2026-09-25: `/projects/argus/`, linked from the résumé,
      graph panel and products index.
- [x] Audit fragaria's Stage 0 scorecard. Done 2026-09-25: reproducible but uninformative
      (fragaria `docs/stage0_audit.md`); PORTFOLIO.md and the summary say so.
- [x] Rerun fragaria's Stage 0 under a rebuilt, pre-registered rubric. Done 2026-09-25:
      GO narrowly, PCA only (fragaria `build/stage0_v2/RESULTS.md`).
- [x] Write up `fragaria`, with journal-style figures. Done 2026-09-26: `/projects/fragaria/`,
      linked from the topos write-up, whose table and status were corrected to match
      PORTFOLIO.md (glyma and sorghum had been shown as Stage 0 complete).
- [x] Write up `noul`. Done 2026-09-25 at Shel's request, before the label review, with
      the labels disclosed as Claude-drafted and unreviewed. Update it when the review lands.
- [x] No oncos write-up: decided by Shel 2026-09-26 — the work stays private, no methods or
      numbers, until Shel understands it better. Do not re-ask.
- [x] Bring the iridis write-up in line with its entry. Done 2026-09-25: dates, the exact
      accuracy ranges, the masking negative finding, and the single-atlas limit.
- [ ] Decide whether `PORTFOLIO.md` should render as a route on the site rather than
      existing only as a repository file.
- [x] Keep the résumé route and `PORTFOLIO.md` consistent when either changes. Done
      2026-09-24: `lib/projects.ts` feeds the résumé, the graph and the Doc feed, and the
      post-build check fails on drift.
- [x] Place graph nodes for the projects that have none: oncos, noul, legere,
      catasta, custos, bibliotheca, bibliotheca-archive, ponere, and this site. Done
      2026-09-25, with mara added too; the post-build check now fails when a featured or
      Shipped project has no node.
- [x] Role nodes in `lib/graph-data.ts` restate résumé text by hand (the teaching figures
      had drifted from `lib/resume.ts`). Done 2026-09-25: each role node names its résumé
      entry, takes its dates from it, and the build fails on any figure the entry lacks.
- [x] Squash or rewrite history to remove the client name from the old README's project
      table. Done 2026-09-25: history squashed to one commit.

## P0 — Data-visual stories (D3)

Every write-up page shows static PNGs plus Plotly JSON. Plotly is good for inspection but
cannot animate a change of state, which is where custom D3 earns its place. Planned
2026-10-03, ranked by story strength, data on hand, and what D3 adds. Each story is a
scroll-driven route beside its write-up (`/projects/<name>/story`).

- [ ] **iridis** — in progress on `feat/iridis-story`: color as a continuum, Fitzpatrick
      and Monk against a colorimeter, capture as the weak link.
- [ ] Extract the scroll-step engine from `app/projects/iridis/story/Story.tsx` into a
      shared component once iridis ships, so later stories cost data and copy, not
      plumbing.
- [ ] **fragaria** — the strongest arc on the site: an invalid analysis that passed every
      check, clusters that turn out to be families, structure that holds once relatives
      are removed, PCA and UMAP landing on the same groups, geography in wild strawberry.
      D3 moments: the pedigree as a force network, relatives removed live, points morphing
      from PCA to UMAP coordinates, a `d3-geo` map of wild accessions.
      2026-10-03: built at `/projects/fragaria/story`, "What the wild kept", 15 frames on a
      breeder's arc: the parents' journey on a world map, the cultivated cloud, families and
      kinship as the first obstacle, PCA and UMAP agreeing, the invalid first run, woodland
      strawberry on a map of Europe, the wild octoploids, their plants flowing into the
      novel-variant bars, and the fruit-size coda. Data from fragaria
      `scripts/story_export.py`. Not yet linked from the write-up, pending Shel's read.
- [ ] **topos gate ledger** — the topos page has no figures. Draw the eight stage gates,
      then every pre-registered run across the portfolio (fragaria, lyco, argus, recolo,
      noul, iridis) flowing through them to GO / KILL / HOLD. Fast, and it shows negative
      results, which few portfolios do.
- [ ] **recolo explorable** — the reader drags decay rate and salience and watches
      episodic weights fade and retrieval accuracy fall against plain retrieval. Needs
      parameter sweeps exported from the recolo repo; the figure JSON holds summary points
      only.
- [ ] **lyco** — chromosome ideogram of TE insertions linked to the population-history
      panel: the signal follows the element, not the pericentromere.
- [ ] **lambent** (optional) — exposure slider moving the score as far as the skin-tone
      span; seven variants as small multiples. Second skin-domain piece after iridis, so
      only if the portfolio can carry it.
- [ ] Lower priority: veridian resampling-instability animation; noul and argus are
      mostly tables and AUCs.

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
- [ ] Consider hosting interactive demos here via the demo pattern in `custos/demos/`.

## Documentation

- [x] Document the content model. Done 2026-09-24: the header of `lib/projects.ts` is the
      reference, and the unused `lib/timeline-data.ts` is gone.
- [ ] Document how to add a project write-up page.
