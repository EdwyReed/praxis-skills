# Surface Decisions

- Codex custom prompts are not used. Reusable workflows are implemented as skills because Codex documents skills as the reusable workflow format and custom prompts as deprecated.
- Role files are preserved as references rather than rewritten into always-on instructions, keeping context small and preserving source nuance.
- `AGENTS.md` contains only durable repo behavior. Technology rules, review checklists, contexts, and scenarios remain references.
- MCP servers are optional dependencies. Skills must document fallback or blocked behavior when Sentry, GitHub, Context7, OpenAI Docs, browser, or Stoplight tooling is unavailable.
- Plugin packaging happens after repo-local skills exist. The plugin is a distribution artifact, not the only source of truth.
- The historical Claude installer is not a Codex installer. Codex install scripts target `.agents/skills`, user skill directories, or local plugin marketplace entries.
