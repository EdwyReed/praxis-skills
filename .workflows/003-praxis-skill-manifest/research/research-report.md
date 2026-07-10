# Research: Praxis Skill Dependency Manifest

## Current State

- `.praxis/project.md` owns durable product and design direction and has a strict context budget.
- A managed root `AGENTS.md` block makes the profile discoverable without Praxis.
- `praxis-init` audits, creates, confirms, refreshes, and validates the profile.
- Project-scoped Praxis skills enforce a shared Project Context Gate.
- No portable record currently tells contributors where nonstandard required skill families come from.

## Constraints

- Do not turn project context into an inventory of a contributor's local environment.
- Do not auto-install executable external content.
- Preserve source/plugin/global-install parity and deterministic audits.
- Keep manifest details out of the default context unless skill selection or installation is relevant.

## Complexity

Medium: the schema and parser are bounded, but the contract touches all distribution and discovery surfaces.
