# Shel Burkes, PhD

**Principal Applied Scientist · AI for Life Sciences · Computer Vision for Biological Systems**

I build AI systems that extract quantitative signal from biological and multi-modal data — measurement frameworks, classification systems, and discovery tools for problems where no prior quantification exists.

My work lives at the intersection of computational biology, computer vision, and frontier AI. I'm drawn to problems that require inventing the methodology, not just applying one: phenotypic classification from imaging data, manifold stability in high-dimensional biological space, knowledge-grounded scientific reasoning, and bio-inspired architectures for intelligent systems.

PhD in Data Science · Bioinformatics · Computer Vision · Foundation Models · Knowledge Systems

---

## Projects

Every project is described in one place, [`PORTFOLIO.md`](PORTFOLIO.md): what it does, the
approach, the stack, an honest status, and its results. It is organized as three product
lines — perceptual & imaging phenotyping, certified structure in biological data, research
cognition — each led by a flagship (iridis, topos, veridian), with everything else as
supporting evidence; [/projects/](https://sheljustdoes.github.io/projects/) shows that view.
The site reads a structured mirror
of it (`lib/projects.ts`) for the [résumé](https://sheljustdoes.github.io/resume/), the
homepage graph and the résumé document's feed, and the build fails when the three drift
apart. A featured or Shipped project with no graph node also fails the build, and so does
a graph role node quoting a figure its résumé entry in `lib/resume.ts` does not contain. Each product line must list its
flagship first, name it on PORTFOLIO.md's `**Flagship:**` line, and give it a write-up.

---

*"The most consequential ideas are hiding in plain sight."*

---

## Stack

Next.js (App Router, static export) deployed to GitHub Pages via Actions. See `app/` for the knowledge-graph homepage, résumé, and project write-up pages.

**Shared brand.** `public/brand/` is the single source of the apps' look — colours, typefaces, radii and a few shared components — served at `https://sheljustdoes.github.io/brand/`. scintilla, ponere and lumen's viewer link it at runtime, so a change there restyles all three on the next deploy of this site. See [`public/brand/README.md`](public/brand/README.md).

---

## Local development

```sh
npm run dev        # hot-reload dev server on http://localhost:3500
npm run preview    # production build, served from out/ on http://localhost:3502
npm run check      # production build + TypeScript check, no server
npm run test:ui    # drives a real browser against out/ and asserts interactions fire
```

`test:ui` exists because screenshots cannot catch broken event handling — the graph once
rendered perfectly while every click was being swallowed by a pointer-capture call on the
canvas wrapper. It needs `pip install playwright` and uses the installed Chrome, so there
is no browser download. Run it after `npm run build`.

`dev` is for iterating. **`preview` is what to look at before pushing** — it serves the
same static export that GitHub Pages will serve, so routing, trailing slashes, and the
static export of client components all behave as they will in production. `dev` can hide
export-only problems.

The suggested loop, given the branch-and-merge workflow these repos use:

```sh
git checkout -b feat/whatever
# ... edit ...
npm run preview                 # look at it
git add <paths> && git commit   # conventional commits are enforced by a hook
git checkout main && git merge --no-ff feat/whatever
git push                        # deploys via Actions
```

Note that `main` is push-protected by a local hook — commit on a branch, then merge.
