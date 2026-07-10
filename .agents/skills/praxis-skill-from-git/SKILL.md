---
name: praxis-skill-from-git
description: Use to extract real project conventions from git history and generate a Codex project skill under `.agents/skills/{project}-patterns`.
---

# Codex Skill From Git

Analyze recent git history, changed files, tests, and docs to infer durable project conventions. Write `.agents/skills/{project}-patterns/SKILL.md` plus optional references.

Do not write to the legacy Claude skill directory. If git history is unavailable, report the missing input and suggest source files to inspect.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
