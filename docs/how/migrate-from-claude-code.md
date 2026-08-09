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

| Slash command | Praxis skill (source of truth) |
| --- | --- |
| `/init` | `praxis-init` |
| `/feature` | `praxis-feature-flow` |
| `/refine` | `praxis-refine` |
| `/research` | `praxis-research` |
| `/design` | `praxis-design` |
| `/plan` | `praxis-plan` |
| `/implement` | `praxis-implement` |
| `/docs-suite` | `praxis-docs-suite` |
| `/pr` | `praxis-pr` |
| `/sentry-triage` | `praxis-sentry-triage` |
| `/qa-checklist` | `praxis-qa-checklist` |
| `/system-profile` | `praxis-system-profile` |
| `/skill-from-git` | `praxis-skill-from-git` |
| `/ai-debug` | `praxis-ai-debug` |
| `/clear-speech` | `praxis-clear-speech` |

Slash commands do not re-implement workflows. They route into the skill package. Codex skill invocation (`$praxis-feature-flow` / skill discovery) stays first-class.

Claude Agent Teams map to optional subagents. If subagents are not available, the skill applies the same role references inline.
