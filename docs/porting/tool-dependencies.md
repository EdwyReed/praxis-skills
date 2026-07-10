# Tool Dependencies

## Claude to Codex mapping

| Claude-era reference | Codex behavior |
| --- | --- |
| `Read`, `Grep`, `Glob` | Local filesystem reads and `rg`-based search. |
| `Write`, `Edit` | Normal Codex file editing with scoped patches. |
| `Bash` | Shell commands with current approval and sandbox policy. |
| `AskUserQuestion` | Ask the user directly or use available user-input tooling. |
| `TeamCreate`, `TeamDelete`, `SendMessage` | Codex subagents when explicitly available, otherwise inline role execution. |
| `mcp__sentry__*` | Optional Sentry MCP dependency. |
| `mcp__context7__*` | Optional Context7 documentation MCP dependency. |

## Dependency policy

Workflows should continue without optional MCP servers when possible. If live production data is essential, the skill should stop with a clear blocked state instead of inventing data.
