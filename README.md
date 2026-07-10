# Praxis Skills

Codex-native workflow package for feature development, task refinement, research, design, implementation, documentation, QA, Sentry triage, and PR preparation.

## Project initialization

Every repository-scoped Praxis workflow requires a confirmed `.praxis/project.md`. Invoke `$praxis-init` explicitly, or let another Praxis skill invoke it when the profile is missing. New projects use a focused interview; existing projects receive an evidence-first audit and remain `needs-confirmation` until the user approves the inferred direction.

Initialization also adds a small managed block to the root `AGENTS.md`. That pointer makes Codex read the project profile even when Praxis Skills is not installed. The profile keeps its Core Contract first, stays below 2500 words, and is revalidated by SHA-256 after compaction or direction changes.

When a project depends on external nonstandard skill families, initialization also creates `.praxis/skills.yaml`. This compact manifest records only required or recommended packages, selected entrypoints, bounded roles, exact sources, and pinned Git revisions. It is not an inventory of a contributor's environment. Agents validate it with project context, load its details only for skill-related decisions, and always request approval before installing external content.

This repository is a port of the Claude Code workflow source preserved in the pre-port `master` history. A local migration checkout may exist at `tmp/codex-workflows-source`, but it is intentionally excluded from distribution. The active Codex surfaces are:

- `.agents/skills/` for reusable workflows;
- `references/` for roles, rules, contexts, scenarios, templates, and historical source docs;
- `AGENTS.md` for compact always-on repo guidance;
- `plugin/` for installable Codex plugin distribution;
- `tests/audits/` for parity and packaging verification.

Frontend feature flows use `references/rules/frontend-skill-routing.md` to select one applicable primary visual skill from the confirmed project direction, respect repository constraints, and request consent before installing a missing TasteSkill.

## Install

```powershell
pwsh ./install.ps1 --repo --dry-run
pwsh ./verify-install.ps1
```

For user-local or plugin installation, see `docs/how/install.md`.

## Verify

```powershell
pwsh tests/audits/run-all.ps1
```
