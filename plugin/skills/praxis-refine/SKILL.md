---
name: praxis-refine
description: Use to clarify vague product or engineering tasks into structured refined-task artifacts with user stories, acceptance criteria, risk flags, and estimation.
---

# Codex Refine

Load `references/agents/engineering/task-refiner.md`, `references/rules/language.md`, and `.agents/skills/praxis-task-refinement/SKILL.md`.

Ask focused clarification questions when requirements are ambiguous. Keep questions business-readable. Produce `.workflows/{feature-id}/refinement/refined-task.md` with user stories, acceptance criteria, open questions, risk flags, and T-shirt estimate.

If Sentry or documentation MCP tools are unavailable, use local artifacts and clearly mark missing external context.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
