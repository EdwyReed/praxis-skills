---
name: praxis-plan
description: Use to decompose a researched/designed feature into vertical implementation phases with TDD approach, dependencies, and verification criteria.
---

# Codex Plan

Load `references/contexts/planning.md`, `references/agents/engineering/phase-planner.md`, and `.agents/skills/praxis-tdd-approach/SKILL.md`.

For applicable frontend work, load `references/rules/frontend-skill-routing.md`. Reuse or resolve the primary visual skill before the plan commits to a visual direction. Record it in the overview or single phase plan and do not introduce a second competing primary visual skill.

For small features, write a single phase plan from research. For larger features, write `.workflows/{feature-id}/plan/overview.md` and `phase-{N}.md` files. Include acceptance criteria, test approach, dependencies, and verification commands.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
