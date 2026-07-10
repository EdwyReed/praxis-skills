# Configure MCP Dependencies

Praxis Skills can use Sentry, Context7, OpenAI Docs, GitHub, browser, and Stoplight-related tooling when those integrations are available. They are optional unless a specific workflow needs live external data.

Add MCP servers in your Codex configuration without committing secrets. See `.codex/config.example.toml` for placeholder examples.

If a dependency is missing, workflow skills should either use filesystem-only fallback behavior or report the exact missing dependency and the artifact that cannot be produced.
