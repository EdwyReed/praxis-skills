---
name: praxis-docs-suite
description: Use to generate or update project documentation suite with technical facts, architecture, OpenAPI, feature docs, cross-review, Stoplight packaging, and `.meta.json`.
---

# Codex Docs Suite

Load documentation role references and `references/scenarios/delivery/documentation-suite.md`. Support full mode and update mode. Preserve minimal-diff behavior for update mode.

Write artifacts under `docs/.artifacts/`, final docs under `docs/`, and update `docs/.artifacts/.meta.json` when completing a full or update run.

Use subagents for independent documentation collectors when available. Inline fallback: collect and review sequentially.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
