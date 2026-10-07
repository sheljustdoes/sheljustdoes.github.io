#!/usr/bin/env node
// Records when each write-up's project repository was last worked on: the date of the last
// commit on its default branch. app/projects/Byline.tsx prints it as "Last updated", and marks
// a project active when that commit falls after the end year its résumé dates give.
//
// The repositories are private, so CI reads them through the GitHub API with REPOS_TOKEN
// (fine-grained, read-only on the project repositories). Without the token, as in local dev,
// it reads the clones beside this repo in ~/Github/sheljustdoes/. A repository it can reach by
// neither way is left out, and its byline omits the date; this script never fails a build.

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "lib/repo-dates.json");
const OWNER = "sheljustdoes";
const token = process.env.REPOS_TOKEN;

/** Slugs with a write-up page, present once scripts/locked.mjs has pulled them in. */
const slugs = readdirSync(join(ROOT, "app/projects"), { withFileTypes: true })
  .filter((d) => d.isDirectory() && existsSync(join(ROOT, "app/projects", d.name, "page.tsx")))
  .map((d) => d.name);

async function fromApi(slug) {
  const res = await fetch(`https://api.github.com/repos/${OWNER}/${slug}/commits?per_page=1`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) return null;
  const [last] = await res.json();
  return last?.commit?.committer?.date?.slice(0, 10) ?? null;
}

function fromClone(slug) {
  const repo = join(ROOT, "..", slug);
  if (!existsSync(join(repo, ".git"))) return null;
  for (const branch of ["main", "master"]) {
    try {
      return execFileSync("git", ["log", "-1", "--format=%cs", branch], { cwd: repo, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() || null;
    } catch {}
  }
  return null;
}

const dates = {};
for (const slug of slugs) {
  const when = token ? await fromApi(slug) : fromClone(slug);
  if (when) dates[slug] = when;
}
writeFileSync(OUT, `${JSON.stringify(dates, null, 2)}\n`);
const missing = slugs.filter((s) => !dates[s]);
console.log(
  `repo-dates: ${Object.keys(dates).length} of ${slugs.length} write-ups dated from ${token ? "the GitHub API" : "local clones"}` +
    (missing.length ? `; no date for ${missing.join(", ")}` : ""),
);
