# Install Praxis Skills

## Recommended npm path

Node.js 22 or newer is required. Install for the current user:

```bash
npx praxis-skills@beta install --user
npx praxis-skills@beta doctor --user
```

Install into a repository's `.agents/skills` directory:

```bash
npx praxis-skills@beta install --repo .
npx praxis-skills@beta doctor --repo .
```

Use `--target <skills-dir>` for a compatible agent with a different discovery location. Existing skill directories are skipped. Replacing them requires `--force` and confirmation, or `--force --yes` in automation. `--dry-run` never mutates or prompts, and `--json` provides machine-readable output.

The npm CLI copies only directories listed by `distribution/manifest.json`. It has no install lifecycle script and performs no implicit project initialization.

## Source-checkout fallback

The repository is also usable directly because Codex scans `.agents/skills` from the current working directory up to the repository root. This mode validates the checkout rather than copying it into another repository.

```powershell
pwsh ./install.ps1 --repo --dry-run
pwsh ./verify-install.ps1
```

## User-local skills

Install skills into your user skill directory:

```powershell
pwsh ./install.ps1 --user
```

On macOS or Linux use `./install.sh --user`. These scripts are compatibility fallbacks for source checkouts; prefer the npm CLI for normal installation.

## Plugin packaging

Install as a local plugin marketplace entry:

```powershell
pwsh ./install.ps1 --plugin
```

Start a new Codex thread after installing or updating skills or plugins.

## Initialize a project

In the target repository, invoke `$praxis-init`. It creates or audits `.praxis/project.md`, conditionally creates `.praxis/skills.yaml` when reproducible work depends on external nonstandard skill packages, adds a managed discovery pointer to the root `AGENTS.md`, validates both context contracts, and asks the user to confirm the project direction before mutating workflows proceed.

The `AGENTS.md` pointer remains useful if Praxis Skills is later unavailable: Codex still discovers the project profile and optional skill manifest as repository instructions. Listed external packages are never installed without explicit approval.
