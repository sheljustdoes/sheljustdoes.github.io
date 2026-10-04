// Private write-up source. Every project folder under app/projects/ and public/projects/
// (except public/projects/supporting/) is kept out of this public repo: the source lives in
// the private apotheca repo under site/, mirroring the paths here, and is copied in before a
// build. Projects whose lib/projects.ts entry has a `story` are also locked: they ship
// encrypted behind a per-project password (scripts/protect.mjs).
//
//   node scripts/locked.mjs pull [--force] [--soft]   apotheca → this checkout
//   node scripts/locked.mjs push [--force]            this checkout → apotheca's working tree
//   node scripts/locked.mjs ship -m "<commit msg>"    push, commit and merge in apotheca, push it, redeploy the site
//   node scripts/locked.mjs status                    list files that differ
//   node scripts/locked.mjs check                     fail if any project folder is tracked or not ignored here
//
// --from/--to DIR overrides the apotheca checkout ($APOTHECA, else ~/Github/sheljustdoes/apotheca).
// pull refuses to overwrite local edits, and push refuses to overwrite apotheca changes made
// since this checkout last pulled (.locked-base records that commit); --force overrides both.
// --soft (used by `npm run dev`) only warns instead of failing.

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const ROOTS = ["app/projects", "public/projects"];
const PUBLIC = new Set(["public/projects/supporting"]);
const SITE_REPO = "sheljustdoes/sheljustdoes.github.io";
const BASE = join(ROOT, ".locked-base");

/** Slugs of projects with a story, read from lib/projects.ts. */
export function lockedSlugs() {
  const src = readFileSync(join(ROOT, "lib/projects.ts"), "utf8");
  const slugs = [...src.matchAll(/story:\s*"\/projects\/([a-z0-9-]+)\/story\/"/g)].map((m) => m[1]);
  return [...new Set(slugs)].sort();
}

/** Every file under dir, as paths relative to it. */
export function walk(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.name === ".DS_Store") return [];
    return d.isDirectory() ? walk(p, base) : [relative(base, p)];
  });
}

/** Project folders (app/projects/<slug>, public/projects/<slug>) present under base. */
function projectDirs(base) {
  return ROOTS.flatMap((r) =>
    existsSync(join(base, r))
      ? readdirSync(join(base, r), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => `${r}/${d.name}`)
      : [],
  ).filter((d) => !PUBLIC.has(d));
}

function diff(a, b) {
  const fa = new Set(walk(a)), fb = new Set(walk(b));
  const changed = [];
  for (const f of new Set([...fa, ...fb])) {
    if (!fa.has(f) || !fb.has(f)) changed.push(f);
    else if (!readFileSync(join(a, f)).equals(readFileSync(join(b, f)))) changed.push(f);
  }
  return changed.sort();
}

function mirror(from, to) {
  rmSync(to, { recursive: true, force: true });
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true, filter: (p) => !p.endsWith(".DS_Store") });
}

const git = (cwd, ...args) => execFileSync("git", args, { cwd, encoding: "utf8" }).trim();
const head = (repo) => (existsSync(join(repo, ".git")) ? git(repo, "rev-parse", "HEAD") : null);

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  const has = (flag) => process.argv.includes(flag);
  const repo = resolve(arg("--from", arg("--to", process.env.APOTHECA || join(homedir(), "Github/sheljustdoes/apotheca"))));
  const store = join(repo, "site");
  const fail = (msg) => {
    console.error(`locked: ${msg}`);
    process.exit(has("--soft") ? 0 : 1);
  };
  if (cmd !== "check" && !existsSync(store)) fail(`${store} not found; clone apotheca or pass --from`);

  /** Files that differ between the two copies, per project folder present on the given side. */
  const changes = (dirs) => dirs.flatMap((d) => diff(join(store, d), join(ROOT, d)).map((f) => `${d}/${f}`));

  function push() {
    const base = existsSync(BASE) ? readFileSync(BASE, "utf8").trim() : null;
    const moved = base && head(repo) && git(repo, "diff", "--name-only", base, "HEAD", "--", "site");
    if (moved && !has("--force")) {
      fail(`apotheca's site/ changed since this checkout last pulled:\n  ${moved.split("\n").join("\n  ")}\n` +
        "Pull first (your edits would be overwritten: copy them aside), or push --force to overwrite.");
    }
    const dirs = projectDirs(ROOT);
    for (const d of dirs) mirror(join(ROOT, d), join(store, d));
    return dirs;
  }

  if (cmd === "pull") {
    const dirs = projectDirs(store);
    const pending = dirs.filter((d) => existsSync(join(ROOT, d))).flatMap((d) => changes([d]));
    if (pending.length && !has("--force")) {
      fail(`these files differ from apotheca and were not overwritten:\n  ${pending.join("\n  ")}\n` +
        "Run `npm run locked:push` to keep the local edits, or `node scripts/locked.mjs pull --force` to drop them.");
    }
    for (const d of dirs) mirror(join(store, d), join(ROOT, d));
    const sha = head(repo);
    if (sha) writeFileSync(BASE, `${sha}\n`);
    console.log(`locked: pulled ${dirs.length} project folders from ${store}`);
  } else if (cmd === "status") {
    const dirs = [...new Set([...projectDirs(store), ...projectDirs(ROOT)])];
    changes(dirs).forEach((f) => console.log(f));
  } else if (cmd === "push") {
    const dirs = push();
    console.log(`locked: pushed ${dirs.length} project folders to ${store}; commit them there, or use ship`);
  } else if (cmd === "ship") {
    const msg = arg("-m");
    if (!msg) fail('ship needs a commit message: ship -m "docs(iridis): ..."');
    if (git(repo, "branch", "--show-current") !== "main") fail("apotheca is not on main; finish what is open there first");
    git(repo, "pull", "-q", "--ff-only");
    push();
    if (git(repo, "status", "--porcelain", "--", "site")) {
      const branch = `site/${new Date().toISOString().replace(/\D/g, "").slice(0, 12)}`;
      git(repo, "switch", "-q", "-c", branch);
      git(repo, "add", "site");
      git(repo, "commit", "-q", "-m", msg);
      git(repo, "switch", "-q", "main");
      git(repo, "merge", "-q", "--no-ff", branch, "-m", `Merge branch '${branch}'`);
      git(repo, "branch", "-q", "-d", branch);
      git(repo, "push", "-q");
      writeFileSync(BASE, `${head(repo)}\n`);
      console.log(`locked: committed and pushed to apotheca (${head(repo).slice(0, 7)})`);
    } else {
      console.log("locked: nothing changed in apotheca's site/");
    }
    const env = { ...process.env };
    env.GH_TOKEN ||= execFileSync("gh", ["auth", "token", "--user", "sheljustdoes"], { encoding: "utf8" }).trim();
    execFileSync("gh", ["workflow", "run", "deploy-pages.yml", "-R", SITE_REPO], { env, stdio: "inherit" });
    console.log(`locked: site deploy started; gh run watch -R ${SITE_REPO}`);
  } else if (cmd === "check") {
    const bad = [];
    const tracked = git(ROOT, "ls-files", ...ROOTS).split("\n").filter(Boolean);
    for (const f of tracked) {
      const d = f.split("/").slice(0, 3).join("/");
      if (f.split("/").length > 3 && !PUBLIC.has(d)) bad.push(`${f} is tracked`);
    }
    for (const d of projectDirs(ROOT)) {
      try {
        git(ROOT, "check-ignore", "-q", `${d}/page.tsx`);
      } catch {
        bad.push(`${d}/ is not git-ignored`);
      }
    }
    if (bad.length) fail(`project source must stay out of this public repo (it lives in apotheca/site):\n  ${bad.join("\n  ")}`);
    console.log("locked: project source kept out of git");
  } else {
    fail("usage: node scripts/locked.mjs pull|push|ship|status|check");
  }
}
