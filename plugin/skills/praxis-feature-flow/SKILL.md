---
name: praxis-feature-flow
description: Use for Codex feature lifecycle orchestration: initialize, status, resume, Sentry/refined-task intake, complexity-adaptive flow, human checkpoints, and `.workflows/{feature-id}` state management.
---

# Codex Feature Flow

Use this skill when the user asks for a full feature workflow, resumes a feature, checks status, or starts from a Sentry/refinement artifact.

## Inputs

- Feature id or short task description.
- Optional `--from <path>` artifact from Sentry triage or task refinement.
- Optional `--status` or `--resume`.

## Workflow

1. Load `references/scenarios/delivery/feature-development.md`.
2. If the task includes applicable frontend work, load `references/rules/frontend-skill-routing.md` and complete its Mandatory Gate before Design, Plan, or Implement begins. Persist the result under `frontend` in `state.json`.
3. Ensure `.workflows/{feature-id}/state.json` exists for initialized features.
4. For `--from`, copy the source artifact into the matching workflow phase:
   - Sentry issue -> `research/sentry-context.md`.
   - Refined task -> `refinement/refined-task.md`.
5. For status, inspect artifact existence and update phase states.
6. For resume, use `complexity` from state:
   - `small`: suggest Research -> Implement -> PR and mark Design/Plan skipped only after user accepts fast track.
   - `medium`: suggest lighter Design/Plan and fewer reviewers.
   - `large`: keep the full flow.
7. Preserve human checkpoints before implementation when design artifacts exist.

## Outputs

- `.workflows/{feature-id}/state.json`
- Next recommended skill invocation.
- Updated workflow phase status.

## Subagent policy

This skill coordinates other skills. It does not require subagents. If subagents are unavailable, run each phase skill inline.

## Project Context Gate

Before repository-scoped work, check `.praxis/project.md`. If it is missing, invoke `praxis-init`; permit only the read-only reconnaissance needed for initialization until the profile exists. Read the profile fully and require `status: confirmed` before project mutations or external delivery actions. Record its validator-provided hash as `project_context.profile_sha256` in workflow state or the produced artifact. Re-read and revalidate after context compaction, a hash change, or a request that changes product or visual direction. If `.praxis/skills.yaml` exists, validate it in the same pass and record `project_context.skills_manifest_sha256`, but load package details only when selecting, checking, or installing skills. Never install an external package automatically; when an applicable `required` package is missing, pause the affected work, show its source, revision, and rationale, and ask for explicit approval.
