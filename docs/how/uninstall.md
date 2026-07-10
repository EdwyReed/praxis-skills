# Uninstall Praxis Skills

For an npm installation, preview the exact owned directories first:

```bash
npx praxis-skills uninstall --user --dry-run
```

Then remove them explicitly:

```bash
npx praxis-skills uninstall --user --yes
npx praxis-skills uninstall --repo . --yes
```

For checkout-based installs or a local Codex plugin marketplace entry:

```powershell
pwsh ./uninstall.ps1 --user --dry-run
pwsh ./uninstall.ps1 --user
pwsh ./uninstall.ps1 --plugin
```

The uninstallers remove only current and known legacy names declared by Praxis. Unrelated skill directories are preserved.
