# Surface Decisions

- Codex custom prompts are not used. Reusable workflows are implemented as skills because Codex documents skills as the reusable workflow format and custom prompts as deprecated.
- Role files are preserved as references rather than rewritten into always-on instructions, keeping context small and preserving source nuance.
- `AGENTS.md` contains only durable repo behavior. Technology rules, review checklists, contexts, and scenarios remain references.
- MCP servers are optional dependencies. Skills must document fallback or blocked behavior when Sentry, GitHub, Context7, OpenAI Docs, browser, or Stoplight tooling is unavailable.
- Plugin packaging happens after repo-local skills exist. The plugin is a distribution artifact, not the only source of truth.
- The npm installer is multi-agent: Codex (`.agents/skills`), Claude Code (`.claude/skills` + thin `commands/` adapters), Cursor (`.cursor/skills`), and Grok (`.grok/skills`). Skill packages remain the source of truth; slash commands only route into skills.
- Checkout `install.ps1` / `install.sh` remain Codex-oriented fallbacks. Prefer the npm CLI for multi-agent installs.
