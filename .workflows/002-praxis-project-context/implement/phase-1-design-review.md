# Phase 1 Design Review

## Verdict

PASS

## Conformance

- The canonical contract is `.praxis/project.md` with schema `praxis-project/v1`.
- Discovery is independent of Praxis installation through a compact managed block in root `AGENTS.md`.
- The profile separates a small Core Contract from deeper on-demand sections.
- Confirmation state and content hash make stale or inferred direction visible.
- The explicit `$praxis-init` invocation follows current Codex skill conventions rather than adding a legacy slash-command surface.
