# Migrate From Claude Code

The source repository was designed for Claude Code slash commands and installed symlinks into `~/.claude`. The historical checkout installer is obsolete.

Current multi-agent install:

```bash
npx praxis-skills@beta install --user --agents claude-code
# or interactively:
npx praxis-skills@beta install --user
```

This installs:

- full skill packages into `~/.claude/skills/praxis-*` (and project `.claude/skills` with `--repo`);
- thin slash-command adapters into `~/.claude/commands/` that load those skills.

Codex remains available in parallel:

```bash
npx praxis-skills@beta install --user --agents codex,claude-code
```

| Slash command (prefixed) | Praxis skill (source of truth) |
| --- | --- |
| `/praxis-init` | `praxis-init` |
| `/praxis-feature` | `praxis-feature-flow` |
| `/praxis-refine` | `praxis-refine` |
| `/praxis-research` | `praxis-research` |
| `/praxis-design` | `praxis-design` |
| `/praxis-plan` | `praxis-plan` |
| `/praxis-implement` | `praxis-implement` |
| `/praxis-docs-suite` | `praxis-docs-suite` |
| `/praxis-pr` | `praxis-pr` |
| `/praxis-sentry-triage` | `praxis-sentry-triage` |
| `/praxis-qa-checklist` | `praxis-qa-checklist` |
| `/praxis-system-profile` | `praxis-system-profile` |
| `/praxis-skill-from-git` | `praxis-skill-from-git` |
| `/praxis-ai-debug` | `praxis-ai-debug` |
| `/praxis-clear-speech` | `praxis-clear-speech` |

Unprefixed names (`/init`, `/feature`, …) are intentionally not installed — they collide with Claude Code built-ins. The installer removes those legacy adapters if present.

Slash commands do not re-implement workflows. They route into the skill package. Codex skill invocation (`$praxis-feature-flow` / skill discovery) stays first-class.

Claude Agent Teams map to optional subagents. If subagents are not available, the skill applies the same role references inline.
