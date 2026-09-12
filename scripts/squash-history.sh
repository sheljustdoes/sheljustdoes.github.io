#!/usr/bin/env bash
# Keeps this repo's commit history capped at 10 commits. This is a
# portfolio site, not an actively-developed project — history depth
# has no value here and is deliberately kept short.
#
# Safe to run repeatedly: it's a no-op unless HEAD has more than 10
# commits and the working tree is clean.
set -euo pipefail

MAX_COMMITS=10
REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "$REPO_DIR"

# Only ever act on this specific repo.
remote_url="$(git remote get-url origin 2>/dev/null || true)"
case "$remote_url" in
  *sheljustdoes/sheljustdoes.github.io*) ;;
  *)
    echo "squash-history: unexpected remote ($remote_url), refusing to run" >&2
    exit 1
    ;;
esac

count="$(git rev-list --count HEAD)"
if [ "$count" -le "$MAX_COMMITS" ]; then
  exit 0
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "squash-history: working tree not clean, skipping squash (commit count: $count)" >&2
  exit 0
fi

branch="$(git branch --show-current)"
if [ -z "$branch" ]; then
  echo "squash-history: not on a branch (detached HEAD), skipping" >&2
  exit 0
fi

echo "squash-history: $count commits on '$branch' (> $MAX_COMMITS) — squashing to one." >&2

tmp_branch="squash-tmp-$$"
git checkout --orphan "$tmp_branch" >&2
git add -A
git commit -q -m "chore: squash history (auto, was $count commits)"
git branch -D "$branch" >&2
git branch -m "$branch" >&2
git push origin "$branch" --force >&2

echo "squash-history: done, $branch now has 1 commit." >&2
