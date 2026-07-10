# Migrate From Claude Code

The source repository was designed for Claude Code slash commands and installed symlinks into `~/.claude`. Those scripts are historical compatibility references only.

Use these Codex equivalents:

| Claude command | Codex skill |
| --- | --- |
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

Claude Agent Teams map to optional Codex subagents. If subagents are not available, the skill applies the same role references inline.
