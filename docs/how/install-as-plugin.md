# Install As Plugin

The plugin bundle lives in `plugin/` and contains `.codex-plugin/plugin.json` plus packaged skills under `plugin/skills`.

Use:

```powershell
pwsh ./install.ps1 --plugin --dry-run
pwsh ./install.ps1 --plugin
pwsh ./verify-install.ps1
```

The installer writes a local marketplace entry under `.agents/plugins/marketplace.json` for repo-local testing. It does not require the legacy Claude home directory.

After installation, use `$praxis-init` once per project to create or audit the mandatory `.praxis/project.md` direction profile and, when needed, the optional `.praxis/skills.yaml` external dependency manifest.
