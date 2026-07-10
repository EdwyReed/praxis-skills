---
name: praxis-ai-debug
description: Use to inspect Praxis Skills package status: available skills, references, plugin manifest, MCP dependencies, install state, and workflow artifacts.
---

# Codex AI Debug

Report:

- available `.agents/skills`;
- key references;
- plugin manifest status;
- optional MCP dependency status where discoverable;
- `.workflows` state if present;
- any Claude-only active surface findings from audit scripts.

Prefer running read-only audit scripts when available.
