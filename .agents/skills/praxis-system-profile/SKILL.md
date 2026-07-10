---
name: praxis-system-profile
description: Use to generate a business-technical system integration profile with actors, use cases, external integrations, data flows, open questions, and issues.
---

# Codex System Profile

Load `references/agents/documentation/system-profiler.md`. Reuse docs-suite artifacts when present. Otherwise inspect the codebase and write `docs/system-profile.md`.

Keep the profile factual. Mark uncertain business intent as open questions.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
