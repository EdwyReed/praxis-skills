#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
MODE_REPO=0
MODE_USER=0
MODE_PLUGIN=0
DRY_RUN=0
FORCE=0

for arg in "$@"; do
  case "$arg" in
    --repo) MODE_REPO=1 ;;
    --user) MODE_USER=1 ;;
    --plugin) MODE_PLUGIN=1 ;;
    --dry-run) DRY_RUN=1 ;;
    --force) FORCE=1 ;;
    *) echo "Unknown argument: $arg" >&2; exit 2 ;;
  esac
done

if [ "$MODE_REPO$MODE_USER$MODE_PLUGIN" = "000" ]; then
  MODE_REPO=1
fi

copy_dir() {
  src="$1"
  dst="$2"
  if [ "$DRY_RUN" = "1" ]; then echo "DRY copy $src -> $dst"; return; fi
  if [ -e "$dst" ] && [ "$FORCE" = "1" ]; then rm -rf "$dst"; fi
  if [ -e "$dst" ]; then echo "SKIP existing $dst"; return; fi
  cp -R "$src" "$dst"
}

if [ "$MODE_REPO" = "1" ]; then
  test -d "$ROOT/.agents/skills" || { echo "Missing .agents/skills" >&2; exit 1; }
  echo "Repo-local skills are present."
fi

if [ "$MODE_USER" = "1" ]; then
  target="$HOME/.agents/skills"
  if [ "$DRY_RUN" = "1" ]; then echo "DRY mkdir $target"; else mkdir -p "$target"; fi
  for skill in "$ROOT"/.agents/skills/*; do
    [ -d "$skill" ] || continue
    copy_dir "$skill" "$target/$(basename "$skill")"
  done
fi

if [ "$MODE_PLUGIN" = "1" ]; then
  test -f "$ROOT/plugin/.codex-plugin/plugin.json" || { echo "Missing plugin manifest" >&2; exit 1; }
  echo "Plugin manifest is present. Use install.ps1 for marketplace JSON generation on Windows."
fi

echo "Install step complete."
