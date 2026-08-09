# Install Praxis Skills

## Recommended npm path

Node.js 22 or newer is required. Install for the current user:

```bash
npx praxis-skills@beta install --user
npx praxis-skills@beta doctor --user
```

On an interactive TTY, prefer the guided installer:

```bash
npx praxis-skills@beta install
```

It walks through scope (user-global vs this repo), agent checkboxes (arrow keys · space · enter), a plan summary, and confirm — no comma-separated number lists. You can still pass `--user` / `--repo` to skip the scope step; agent checkboxes still appear unless `--agents` / `--yes` / `--json` is set. Non-interactive runs without `--agents` install **Codex only** for backward compatibility.

Detect agents without installing:

```bash
npx praxis-skills@beta detect
npx praxis-skills@beta detect --json
```

Install for specific agents (user-global):

```bash
# Codex skill discovery (~/.agents/skills)
npx praxis-skills@beta install --user --agents codex

# Claude Code skills + thin slash-command adapters
npx praxis-skills@beta install --user --agents claude-code

# Several at once
npx praxis-skills@beta install --user --agents codex,claude-code,cursor,grok
npx praxis-skills@beta install --user --all-agents
```

Supported agents:

| Agent id | Skills path (user) | Extra surfaces |
|---|---|---|
| `codex` | `~/.agents/skills` | Codex / AGENTS skill discovery |
| `claude-code` | `~/.claude/skills` | Slash commands in `~/.claude/commands` as **`/praxis-*`** (`/praxis-feature`, `/praxis-init`, …) that load the matching Praxis skill |
| `cursor` | `~/.cursor/skills` | Cursor Agent Skills |
| `grok` | `~/.grok/skills` | Grok Build skills |

Slash commands are **adapters**, not a second workflow implementation. Each command points at the corresponding `praxis-*` skill package. Codex skill invocation remains the primary portable contract. Disable adapters with `--no-slash-commands`, or force them (when a commands root exists) with `--with-slash-commands`.

Install into a repository (agent-specific project paths):

```bash
npx praxis-skills@beta install --repo . --agents codex,claude-code
npx praxis-skills@beta doctor --repo . --agents codex,claude-code
```

- Codex / Grok repo skills → `.agents/skills`
- Claude Code repo skills → `.claude/skills` (+ `.claude/commands` adapters)
- Cursor repo skills → `.cursor/skills`

Use `--target <skills-dir>` for a one-off skills directory. Optionally pass `--commands-target <dir>` with `--with-slash-commands` to emit Claude-style command adapters next to a custom target. Existing skill directories are skipped. Replacing them requires `--force` and confirmation, or `--force --yes` in automation. `--dry-run` never mutates or prompts, and `--json` provides machine-readable output.

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
