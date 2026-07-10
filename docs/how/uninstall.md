# Uninstall Praxis Skills

Use dry-run first:

```powershell
pwsh ./uninstall.ps1 --dry-run
```

Then remove installed user-local skills or repo-local plugin marketplace entries created by this repository:

```powershell
pwsh ./uninstall.ps1 --user
pwsh ./uninstall.ps1 --plugin
```

The uninstaller removes only paths matching this package's expected skill and plugin names.
