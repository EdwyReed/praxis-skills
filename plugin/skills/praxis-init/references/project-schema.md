# Praxis Project Profile Schema

The canonical direction file is `.praxis/project.md`. External skill acquisition metadata belongs in optional `.praxis/skills.yaml`; see `skill-manifest-schema.md`. Do not copy package details into the project profile.

## Frontmatter

Required fields:

- `schema: praxis-project/v1`
- `status: needs-confirmation | confirmed`
- `project_id`: stable kebab-case identifier
- `project_type: new | existing`
- `source: interview | audit | refresh`
- `visual_scope: none | limited | significant`
- `updated`: ISO date `YYYY-MM-DD`

## Required sections

1. `# Core Contract` — first and no more than 400 words. State the concept, primary outcomes, desired feel, non-negotiables, and primary skill direction.
2. `## Project Concept` — what the project is, for whom, and why it exists.
3. `## Product Direction` — current directions, priorities, and explicit non-goals.
4. `## Experience Direction` — desired and undesired qualities. Use concrete contrasts.
5. `## Design Skill Routing` — visual scope, one primary visual skill or `none`, allowed technical supplements, explicit-only style skills, and prohibited combinations.
6. `## Reference Designs and Projects` — exact URLs or project paths plus what to borrow and avoid. Empty evidence must be written as `None confirmed`.
7. `## Existing System and Assets` — established design system, code conventions, brand assets, and canonical documentation links.
8. `## Constraints and Non-Negotiables` — product, legal, accessibility, technical, operational, and language constraints.
9. `## Open Questions` — unresolved decisions. Do not hide uncertainty.
10. `## Confirmation` — status, confirmer, date, and material corrections.

## Precedence

1. Current explicit user instruction.
2. Repository `AGENTS.md` and higher-priority repository instructions.
3. Confirmed `.praxis/project.md`.
4. Praxis defaults and optional skills.

Surface contradictions to the user. Do not silently merge conflicting directions.

## Context budget

- Preferred total: 800-1800 words.
- Hard maximum: 2500 words.
- Core Contract maximum: 400 words.
- Prefer tables and short bullets over repeated prose.
- Link to detailed specifications instead of copying them.
- Do not store histories, feature backlogs, architecture inventories, or generated audit dumps.

## Traceability

Run `scripts/validate_project.py <project-root>` after every write. Record its `profile_sha256` and, when present, `skills_manifest_sha256` in active workflow state. A changed hash invalidates prior context acknowledgement and requires a reread.
