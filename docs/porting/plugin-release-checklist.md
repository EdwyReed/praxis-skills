# Plugin Release Checklist

- `plugin/.codex-plugin/plugin.json` has valid `name`, `version`, `description`, `author.name`, `skills`, and `interface`.
- `plugin/skills` contains every packaged workflow skill.
- No plugin manifest field points to a missing companion file.
- `pwsh tests/audits/check-plugin-manifest.ps1` passes.
- `pwsh ./install.ps1 --plugin --dry-run` passes.
- `pwsh ./verify-install.ps1` passes for repo-local structure.
- Start a new Codex thread after reinstalling the plugin.
