---
name: praxis-sentry-triage
description: Use to triage Sentry issues into grouped tasks that can feed Codex feature flow through `--from` artifacts.
---

# Codex Sentry Triage

Load `references/agents/engineering/sentry-triager.md`.

Use Sentry MCP when available to list issues, inspect events and tags, group by likely root cause, and write `docs/tasks/triage-report.md` plus `docs/tasks/{issue-short-id}-{slug}/issue.md`.

If Sentry MCP is unavailable, stop with a blocked state unless the user provided exported issue data.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
