---
name: praxis-pr
description: Use to prepare or create a pull request from workflow artifacts, including summary, test plan, design links, review evidence, and CI verification.
---

# Codex PR

Read workflow artifacts from research, design, plan, and implementation. Build a PR description with summary, changes, test plan, risks, and artifact links.

Prefer available GitHub app tooling. Fall back to `gh` when available. If no PR tool is available, write a ready-to-use PR body and report the missing dependency.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
