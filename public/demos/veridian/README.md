# veridian demo: hair fiber literature map

The citation map from veridian's `hair_fiber` run: 1,199 papers the LLM screen included,
placed by a PCA layout and grouped into four stable groups, with citation edges between
them. Click a paper for its abstract, the screen's reason and the papers it cites and is
cited by in the map; highlight papers by MeSH major term or journal. Static page, no key, no backend.

Group names and overlays are built from MeSH terms with ancestry and country terms removed;
paper titles and abstracts are shown as published.

Source of truth is the private `veridian` repo: `web/map.html` (copied here as
`index.html`) and `web/hair_fiber.json`, written by `python scripts/run.py runs/hair_fiber/run.toml web`.
Regenerate there and copy both files across. The page reads `?run=<name>`, default
`hair_fiber`.

This replaces the earlier Check demo (claim-to-evidence ranking, now parked), retired on
2026-10-16.
