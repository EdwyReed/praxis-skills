# Feature State Schema

Required keys:

- `feature_id`: string
- `source`: string or null
- `complexity`: `small`, `medium`, `large`, or null
- `complexity_reason`: string or null
- `phases`: object keyed by phase name

Optional frontend gate:

- `frontend.applicable`: boolean
- `frontend.status`: `not-applicable`, `selected`, `prohibited`, `declined`, `awaiting-install-consent`, or `missing-continued`
- `frontend.primary_skill`: install-name string or null (default marketing: `design-taste-frontend`)
- `frontend.channel`: `v2-experimental`, `stable`, `legacy-v1`, or null
- `frontend.rationale`: string or null
- `frontend.taste_skill_offered`: boolean when an install offer was made

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
