# Architecture

Praxis Skills is a prompt and workflow package, not an application runtime.

## Layers

- `AGENTS.md`: compact durable Codex guidance.
- `.agents/skills`: active repo-local Codex skills.
- `references`: detailed roles, rules, contexts, scenarios, templates, and historical docs.
- `praxis-clear-speech`: independent clear-writing policy and structural audit tooling.
- `plugin`: installable Codex plugin package.
- `tests/audits`: static parity and packaging gates.
- `tmp/praxis-skills-source`: source snapshot used for coverage verification.

## Runtime behavior

Codex loads repo skills through normal skill discovery. A selected workflow skill loads only the references it needs, preserving progressive disclosure. Multi-role workflows can use subagents when available, but every skill keeps an inline fallback path.

The managed `AGENTS.md` block reads the project's `clear_speech` mode. It applies the default policy across replies and human-readable product surfaces, or disables automatic use when the mode is `off`.
