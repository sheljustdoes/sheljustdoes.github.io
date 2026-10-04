// Locked projects: every project in lib/projects.ts that has a `story` is shared by
// password. Its write-up, story and assets are kept out of this public repo: the source
// lives in the private apotheca repo under site/, mirroring the paths here
// (site/app/projects/<slug>/, site/public/projects/<slug>/), is copied in before a build,
// and ships encrypted (scripts/protect.mjs). Both paths are git-ignored here.
//
//   node scripts/locked.mjs pull [--from DIR] [--force]   apotheca → this checkout
//   node scripts/locked.mjs push [--to DIR]               this checkout → apotheca (then commit there)
//   node scripts/locked.mjs status [--from DIR]           list files that differ
//   node scripts/locked.mjs check                         fail if any locked path is tracked or not ignored
//
// DIR defaults to $APOTHECA, else ~/Github/sheljustdoes/apotheca.

import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Slugs of projects with a story, read from lib/projects.ts. */
export function lockedSlugs() {
  const src = readFileSync(join(ROOT, "lib/projects.ts"), "utf8");
  const slugs = [...src.matchAll(/story:\s*"\/projects\/([a-z0-9-]+)\/story\/"/g)].map((m) => m[1]);
  return [...new Set(slugs)].sort();
}

/** The site paths a locked project owns. */
export const lockedDirs = (slug) => [`app/projects/${slug}`, `public/projects/${slug}`];

/** Every file under dir, as paths relative to it. */
export function walk(dir, base = dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((d) => {
    const p = join(dir, d.name);
    if (d.name === ".DS_Store") return [];
    return d.isDirectory() ? walk(p, base) : [relative(base, p)];
  });
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
  if (!existsSync(from)) return;
  mkdirSync(dirname(to), { recursive: true });
  cpSync(from, to, { recursive: true, filter: (p) => !p.endsWith(".DS_Store") });
}

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i > 0 ? process.argv[i + 1] : fallback;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const cmd = process.argv[2];
  const store = join(resolve(arg("--from", arg("--to", process.env.APOTHECA || join(homedir(), "Github/sheljustdoes/apotheca")))), "site");
  const slugs = lockedSlugs();

  if (cmd === "pull" || cmd === "status") {
    const pending = [];
    for (const slug of slugs) {
      for (const dir of lockedDirs(slug)) {
        const src = join(store, dir), dst = join(ROOT, dir);
        if (!existsSync(src)) {
          console.error(`locked: ${relative(ROOT, src) || src} is missing; ${slug} has a story but no locked source`);
          process.exit(1);
        }
        const changed = existsSync(dst) ? diff(src, dst) : [];
        if (cmd === "status") changed.forEach((f) => console.log(`${dir}/${f}`));
        else if (changed.length && !process.argv.includes("--force")) pending.push(...changed.map((f) => `${dir}/${f}`));
      }
    }
    if (cmd === "pull") {
      if (pending.length) {
        console.error(`locked: these files differ from apotheca and would be overwritten:\n  ${pending.join("\n  ")}\n` +
          "Run `node scripts/locked.mjs push` to keep the local edits, or pull --force to drop them.");
        process.exit(1);
      }
      for (const slug of slugs) for (const dir of lockedDirs(slug)) mirror(join(store, dir), join(ROOT, dir));
      console.log(`locked: pulled ${slugs.join(", ")} from ${store}`);
    }
  } else if (cmd === "push") {
    for (const slug of slugs) for (const dir of lockedDirs(slug)) mirror(join(ROOT, dir), join(store, dir));
    console.log(`locked: pushed ${slugs.join(", ")} to ${store}; commit the change there`);
  } else if (cmd === "check") {
    const bad = [];
    for (const slug of slugs) {
      for (const dir of lockedDirs(slug)) {
        const tracked = execFileSync("git", ["ls-files", dir], { cwd: ROOT, encoding: "utf8" }).trim();
        if (tracked) bad.push(`${dir} has tracked files`);
        try {
          execFileSync("git", ["check-ignore", "-q", `${dir}/page.tsx`], { cwd: ROOT });
        } catch {
          bad.push(`${dir}/ is not in .gitignore`);
        }
      }
    }
    if (bad.length) {
      console.error(`locked: a project with a story must stay out of this public repo:\n  ${bad.join("\n  ")}`);
      process.exit(1);
    }
    console.log(`locked: ${slugs.join(", ")} kept out of git`);
  } else {
    console.error("usage: node scripts/locked.mjs pull|push|status|check");
    process.exit(1);
  }
}
