// Post-build encryption of locked projects: those whose lib/projects.ts entry has a story
// (see scripts/locked.mjs). For each, every file under out/projects/<slug>/ and its route chunks under
// out/_next/static/chunks/app/projects/<slug>/ is encrypted with AES-GCM under a key
// derived (PBKDF2-SHA-256) from that project's password, and stored beside its old path as
// <path>.enc; each HTML page is replaced by a lock page. After unlocking, public/lock-sw.js
// decrypts the files as the browser asks for them.
//
// Passwords come from LOCK_<SLUG> environment variables (Actions secrets in the deploy).
// CI fails without one; a local build without one leaves that project readable and says so.
// Before and after encrypting, text taken from the locked source is searched for across
// out/, so a shared chunk that carries it is encrypted too and nothing ships readable.

import { createHash, randomBytes, webcrypto } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { lockedSlugs, ROOT, walk } from "./locked.mjs";

const { subtle } = webcrypto;
const OUT = join(ROOT, "out");
const ITER = 600_000;
const TEXT = /\.(html|txt|js|json|css|csv|svg|md)$/;

const slugs = lockedSlugs();
const envName = (slug) => `LOCK_${slug.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
const missing = slugs.filter((s) => !process.env[envName(s)]);
if (missing.length && process.env.CI) {
  console.error(`protect: no password for ${missing.map(envName).join(", ")}. Set the secret (gh secret set ${missing.map(envName)[0]}) ` +
    `and add \`${missing.map(envName)[0]}: \${{ secrets.${missing.map(envName)[0]} }}\` to the build step's env in .github/workflows/deploy-pages.yml`);
  process.exit(1);
}
for (const slug of slugs) {
  if (!existsSync(join(OUT, "projects", slug, "index.html"))) {
    console.error(`protect: out/projects/${slug}/ was not built; pull the locked source first (scripts/locked.mjs pull)`);
    process.exit(1);
  }
}

// ---- Leak markers: plain runs of prose from each locked project's source ----
const strip = (s) => s.replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, "");
const publicText = [
  readFileSync(join(ROOT, "PORTFOLIO.md"), "utf8"),
  ...["app", "lib", "components"].flatMap((d) =>
    walk(join(ROOT, d))
      .map((f) => join(d, f))
      .filter((f) => /\.(tsx?|mjs)$/.test(f) && !slugs.some((s) => f.startsWith(`app/projects/${s}/`)))
      .map((f) => readFileSync(join(ROOT, f), "utf8")),
  ),
].join("\n");

function markers(slug) {
  const runs = new Set();
  for (const f of walk(join(ROOT, "app/projects", slug)).filter((f) => /\.tsx?$/.test(f))) {
    const src = strip(readFileSync(join(ROOT, "app/projects", slug, f), "utf8"));
    for (const m of src.matchAll(/[A-Za-z][A-Za-z ,.;:()-]{47,}/g)) {
      const run = m[0].slice(0, 48);
      if (/ [a-z]+ [a-z]+ /.test(run) && !publicText.includes(run)) runs.add(run);
    }
  }
  return [...runs];
}

const files = walk(OUT).filter((f) => !f.endsWith(".enc"));
const read = (f) => readFileSync(join(OUT, f), "utf8");
const owned = (slug) => (f) => f.startsWith(`projects/${slug}/`) || f.startsWith(`_next/static/chunks/app/projects/${slug}/`);

const plan = new Map(); // slug → { marks, files, extra }
for (const slug of slugs) {
  const marks = markers(slug);
  const mine = files.filter(owned(slug));
  const seen = marks.filter((m) => mine.some((f) => TEXT.test(f) && read(f).includes(m)));
  if (seen.length < 5) {
    console.error(`protect: only ${seen.length} of ${marks.length} text markers for ${slug} appear in its built pages; the leak check would be blind`);
    process.exit(1);
  }
  plan.set(slug, { marks: seen, files: mine, extra: [] });
}

// Text from a locked project outside its own folders: a shared JS chunk is encrypted with
// it; anything else stops the build.
for (const f of files.filter((f) => TEXT.test(f) && !slugs.some((s) => owned(s)(f)))) {
  const body = read(f);
  const hits = slugs.filter((s) => plan.get(s).marks.some((m) => body.includes(m)));
  if (!hits.length) continue;
  if (hits.length === 1 && f.startsWith("_next/static/chunks/") && f.endsWith(".js")) {
    plan.get(hits[0]).extra.push(f);
  } else {
    console.error(`protect: ${f} carries text from ${hits.join(", ")} and cannot be locked`);
    process.exit(1);
  }
}

// ---- Encrypt ----
const b64 = (u8) => Buffer.from(u8).toString("base64");

async function keyFor(slug, password) {
  const salt = createHash("sha256").update(`sheljustdoes.github.io/lock/${slug}`).digest();
  const base = await subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveKey"]);
  const key = await subtle.deriveKey({ name: "PBKDF2", hash: "SHA-256", salt, iterations: ITER }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]);
  return { key, salt };
}

async function seal(key, bytes) {
  const iv = randomBytes(12);
  const ct = new Uint8Array(await subtle.encrypt({ name: "AES-GCM", iv }, key, bytes));
  return Buffer.concat([iv, ct]);
}

const lockPage = (slug, file) => {
  const kind = file.includes("/story/") ? "story" : "write-up";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex">
<title>${slug} · locked</title>
<link rel="stylesheet" href="/brand/tokens.css">
<style>
  body { margin: 0; background: var(--canvas); color: var(--ink); font: 16px/1.5 Outfit, system-ui, sans-serif; }
  main { max-width: 26rem; margin: 18vh auto 0; padding: 0 16px; }
  .kicker { font: 13px "DM Mono", ui-monospace, monospace; color: var(--ink-3); margin: 0 0 8px; }
  h1 { font: 500 1.6rem/1.25 Lora, Georgia, serif; margin: 0 0 24px; }
  label { display: block; font-size: 14px; color: var(--ink-2); margin-bottom: 6px; }
  .row { display: flex; gap: 8px; }
  input { flex: 1; min-width: 0; font: inherit; padding: 8px 10px; border: 1px solid var(--rule-strong); border-radius: 6px; background: var(--surface); color: var(--ink); }
  button { font: inherit; padding: 8px 16px; border: 0; border-radius: 6px; background: var(--ink); color: var(--canvas); cursor: pointer; }
  button:disabled { opacity: .5; cursor: default; }
  #msg { min-height: 1.5em; font-size: 14px; color: var(--terracotta); }
  a { color: var(--ink-2); font-size: 14px; }
</style>
</head>
<body data-slug="${slug}">
<main>
  <p class="kicker">Project — ${slug}</p>
  <h1>This ${kind} is shared by password.</h1>
  <form>
    <label for="pw">Password</label>
    <div class="row"><input id="pw" name="pw" type="password" autocomplete="current-password" required><button>Unlock</button></div>
    <p id="msg" role="status"></p>
  </form>
  <p><a href="/projects/">← All projects</a></p>
  <noscript><p>Unlocking needs JavaScript.</p></noscript>
</main>
<script src="/locks/lock.js" defer></script>
</body>
</html>
`;
};

const manifest = { iter: ITER, slugs: {}, prefixes: {}, files: {} };
for (const slug of slugs) {
  const password = process.env[envName(slug)];
  const p = plan.get(slug);
  if (!password) {
    console.warn(`protect: ${envName(slug)} not set; ${slug} left readable (local build only, do not deploy this out/)`);
    continue;
  }
  const { key, salt } = await keyFor(slug, password);
  for (const f of [...p.files, ...p.extra]) {
    const path = join(OUT, f);
    writeFileSync(`${path}.enc`, await seal(key, readFileSync(path)));
    unlinkSync(path);
    if (f.endsWith(".html")) writeFileSync(path, lockPage(slug, f));
  }
  manifest.slugs[slug] = { salt: b64(salt), check: b64(await seal(key, new TextEncoder().encode(slug))) };
  for (const dir of [`/projects/${slug}/`, `/_next/static/chunks/app/projects/${slug}/`]) manifest.prefixes[dir] = slug;
  for (const f of p.extra) manifest.files[`/${f}`] = slug;
  console.log(`protect: ${slug} locked (${p.files.length + p.extra.length} files, ${p.extra.length} shared chunks; leak check on ${p.marks.length} text markers)`);
}
mkdirSync(join(OUT, "locks"), { recursive: true });
writeFileSync(join(OUT, "locks/manifest.json"), JSON.stringify(manifest));

// ---- Verify: no locked text left in any readable file ----
const leaks = [];
for (const f of walk(OUT).filter((f) => TEXT.test(f))) {
  const body = read(f);
  for (const slug of Object.keys(manifest.slugs)) {
    const m = plan.get(slug).marks.find((m) => body.includes(m));
    if (m) leaks.push(`${f}: "${m}"`);
  }
}
if (leaks.length) {
  console.error(`protect: locked text still readable:\n  ${leaks.join("\n  ")}`);
  process.exit(1);
}
