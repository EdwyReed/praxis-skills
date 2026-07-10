# Feature State Schema

Required keys:

- `feature_id`: string
- `source`: string or null
- `complexity`: `small`, `medium`, `large`, or null
- `complexity_reason`: string or null
- `phases`: object keyed by phase name

Optional frontend gate:

- `frontend.applicable`: boolean
- `frontend.status`: `not-applicable`, `selected`, `prohibited`, `declined`, or `awaiting-install-consent`
- `frontend.primary_skill`: string or null
- `frontend.rationale`: string or null

Required project context acknowledgement:

- `project_context.status`: `needs-confirmation` or `confirmed`
- `project_context.profile_sha256`: SHA-256 string from `praxis-init/scripts/validate_project.py`
- `project_context.skills_manifest_sha256`: SHA-256 string for optional `.praxis/skills.yaml`, or `null` when absent
- `project_context.validated_at`: ISO date-time string

Allowed phase states:

- `pending`
- `in_progress`
- `done`
- `skipped`
- `blocked`

Expected phases:

- `refinement`
- `research`
- `design`
- `design_review`
- `plan`
- `implement`
- `docs`
- `pr`
