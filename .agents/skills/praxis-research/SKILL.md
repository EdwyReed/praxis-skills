---
name: praxis-research
description: Use for AS-IS codebase research before a change; produces facts-only research artifacts and complexity assessment without proposing a solution.
---

# Codex Research

Load `references/contexts/research.md`, `references/agents/engineering/research-lead.md`, and `references/agents/engineering/codebase-researcher.md`.

Produce facts only. Write `.workflows/{feature-id}/research/research-report.md` and any focused scan artifacts. Update `state.json` with `complexity` and `complexity_reason` when present.

Use subagents for independent scan areas only when available and useful. Inline fallback: perform the scans sequentially and keep outputs in the same artifact paths.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
