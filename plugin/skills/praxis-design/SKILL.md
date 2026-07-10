---
name: praxis-design
description: Use for feature design: architecture, diagrams, ADRs, API contracts, test strategy, challenge review, and optional security review.
---

# Codex Design

Load `references/agents/engineering/design-architect.md`, `test-strategist.md`, `devils-advocate.md`, and optionally `security-reviewer.md`. Load rules for coding style, database, messaging, and testing as needed.

For applicable frontend work, load `references/rules/frontend-skill-routing.md` before making visual decisions. Reuse the primary visual skill recorded in `state.json` when present; otherwise complete the Mandatory Gate. Load exactly that skill and add a `Frontend Skill Selection` section with the skill name and rationale to `design/architecture.md`.

Read research artifacts and produce `.workflows/{feature-id}/design/architecture.md`, `diagrams.md`, `adr/*.md`, `api-contracts.md`, `test-strategy.md`, and `challenge-report.md`.

Use subagents for test strategy and challenge review when available. Inline fallback: apply those roles sequentially.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
