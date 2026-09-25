# veridian demo — provisional

Deployed so it can be opened and shared. **The interface is not designed yet.**

What is settled: the mechanism. The demo corpus and its embeddings are precomputed offline;
a live corpus is fetched from PubMed E-utilities (CORS-open) and embedded in the browser;
a reader's claim is embedded client-side by the same model. No key and no backend. The
"negate the claim" control returns the same papers, which is the architecture's own argument
made visible. `examples.json` holds judged held-out claims, precomputed offline.

What is not settled: everything about how it looks and how it is structured. The styling
here borrows the site's tokens (`--cream` / `--charcoal` / `--terracotta`, and the
serif-is-voice / display-is-structure / mono-is-utility rule) so it does not clash on this
domain, but it is a holding pass, not a design. It is a hand-written static page rather
than a route, deliberately: nothing here commits to a component structure, and deleting
this directory removes it cleanly.

It is linked from the veridian write-up with a prototype note, and not from the graph.

Source of truth for the page and the payload builder is the private `veridian` repo
(`web/`, `scripts/build_payload.py`). Regenerate `payload.json` and `examples.json` there and copy them across.
