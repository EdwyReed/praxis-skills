# Install Praxis Skills

## Repo-local use

The repository is usable directly from a checkout because Codex scans `.agents/skills` from the current working directory up to the repository root.

```powershell
pwsh ./install.ps1 --repo --dry-run
pwsh ./verify-install.ps1
```

## User-local skills

Install skills into your user skill directory:

```powershell
pwsh ./install.ps1 --user
```

## Plugin packaging

Install as a local plugin marketplace entry:

```powershell
pwsh ./install.ps1 --plugin
```

Start a new Codex thread after installing or updating skills or plugins.

## Initialize a project

In the target repository, invoke `$praxis-init`. It creates or audits `.praxis/project.md`, conditionally creates `.praxis/skills.yaml` when reproducible work depends on external nonstandard skill packages, adds a managed discovery pointer to the root `AGENTS.md`, validates both context contracts, and asks the user to confirm the project direction before mutating workflows proceed.

The `AGENTS.md` pointer remains useful if Praxis Skills is later unavailable: Codex still discovers the project profile and optional skill manifest as repository instructions. Listed external packages are never installed without explicit approval.
