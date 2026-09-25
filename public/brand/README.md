# brand

The one place the apps' look is defined. Edit here, push the site, and every app that
links these files restyles with the next Pages deploy — no app redeploys. GitHub Pages
caches for up to ten minutes.

| File | What it holds |
|---|---|
| `tokens.css` | Colours (light and dark), typefaces (loads Outfit, Lora and DM Mono), radii |
| `components.css` | Opt-in `b-` classes: eyebrow, meta, wordmark, pill, button, card, dot stepper, book (collapsible subject with chapters) |

## Who links it

| App | How |
|---|---|
| scintilla | `index.html` links both files; the service worker caches them for offline use; `vercel.json`'s CSP allows this origin |
| ponere | `app/layout.tsx` links `tokens.css`; `globals.css` maps its older names (`--bg`, `--charcoal`, `--taupe`, …) onto the tokens |
| lumen | `viewer/` (the local catalog viewer) links both files |

Link them as `<link rel="stylesheet" crossorigin="anonymous" href="https://sheljustdoes.github.io/brand/tokens.css">`,
before the app's own stylesheet. `crossorigin` lets a service worker cache the response.

## Rules

- **Change values freely; rename or remove a token only with every app updated.** A
  missing variable fails silently, so search the three repos for it first.
- **Keep contrast.** `--ink`, `--ink-2` and `--ink-3` must stay WCAG AA (4.5:1) on
  `--canvas`, `--band` and `--surface`, in both themes, as must `--terracotta` used as text.
  scintilla's end-to-end test runs axe against these values.
- **Dark theme** follows the system unless the page sets `data-theme="light"` on `<html>`.
  An app without dark styles (ponere, for now) must set it.
- **Nothing app-specific here.** Layout and screens stay in each app; only what should look
  the same everywhere belongs in this folder.
