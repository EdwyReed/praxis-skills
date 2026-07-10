# Claude Code vs Codex Surfaces

| Concern | Claude-era source | Codex-native port |
| --- | --- | --- |
| Entry point | Slash commands in `commands/` | Skills in `.agents/skills/` |
| Durable guidance | `CLAUDE.md` | `AGENTS.md` |
| Agent roles | `agents/**/*.md` | `references/agents/**/*.md` |
| Multi-agent work | Agent Teams | Optional Codex subagents with inline fallback |
| Install path | `~/.claude` symlinks | Repo skills, user skills, or plugin marketplace |
| Distribution | Git checkout plus symlinks | Codex plugin bundle |
