# Codex Architecture

This port treats `tmp/praxis-skills-source` as the source snapshot and exposes the workflows through Codex-native surfaces.

## Surface mapping

| Source surface | Codex target | Notes |
| --- | --- | --- |
| `commands/*.md` | `.agents/skills/codex-*` | Slash commands become reusable skills, not custom prompts. |
| `agents/**/*.md` | `references/agents/**` | Role references are loaded by skills and may be used inline or through subagents. |
| `rules/*.md` | `AGENTS.md` + `references/rules/*` | Only always-on behavior belongs in `AGENTS.md`. |
| `contexts/*.md` | `references/contexts/*` | Mode-specific guardrails remain routed references. |
| `scenarios/**/*.md` | `references/scenarios/**` | Scenario documents define artifact chains and flow contracts. |
| `skills/*` | `.agents/skills/*` | Reusable source skills remain skills with Codex-valid frontmatter. |
| `.claude/skills/{project}-patterns` | `.agents/skills/{project}-patterns` | Project skill generation writes Codex skills. |
| Claude Agent Teams | Codex subagents or inline fallback | Skills must not require subagents to be available. |

## Distribution model

Use `.agents/skills` for repo-local authoring and testing. Use `plugin/` for installable distribution. The plugin packages the same stable skills and declares presentation metadata through `.codex-plugin/plugin.json`.

## Verification model

The port is complete only when source coverage, skill frontmatter, reference links, Claude-only active surface checks, plugin manifest checks, installer dry-runs, and workflow dry-run evidence are present and passing.
