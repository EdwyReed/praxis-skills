---
name: praxis-implement
description: Use to implement one planned phase with writer, reviewer, and quality-gate roles; supports subagents but always keeps an inline fallback.
---

# Codex Implement

Load `references/contexts/dev.md`, `references/contexts/review.md`, and role references for implement lead, code writer, TDD guide, security reviewer, quality reviewer, design reviewer, and quality gate.

For applicable frontend work, load `references/rules/frontend-skill-routing.md`. Reuse the primary visual skill from state, design, or plan; resolve the gate if none is recorded, then load that skill before writing visual code. When delegating, include the selected skill and rationale in the writer task and require the writer to load it. Never delegate multiple competing primary visual skills.

Implement only the selected phase scope. Run smoke checks before review. Select reviewers by complexity: quality for small, security+quality for medium, security+quality+design for large. Write phase reports under `.workflows/{feature-id}/implement/`.

If subagents are unavailable, apply the roles sequentially inline and still write each expected report.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
