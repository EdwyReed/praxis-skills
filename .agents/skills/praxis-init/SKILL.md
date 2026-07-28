---
name: praxis-init
description: Initialize, audit, confirm, or refresh the mandatory `.praxis/project.md` project-direction profile, optional `.praxis/skills.yaml` external skill dependency manifest, and root `AGENTS.md` discovery bootstrap. Use when starting work in a repository, when Praxis context is missing or unconfirmed, when a required skill family is unavailable, or when project direction, design routing, references, constraints, or skill sources change.
---

# Praxis Init

Create one compact, confirmed source of project direction before project-scoped work proceeds.

## Workflow

1. Resolve the project root from Git when available; otherwise use the active workspace root.
2. If `.praxis/project.md` exists, read it fully and run `scripts/validate_project.py <project-root>`.
3. Choose a mode:
   - **New project:** load `references/new-project-interview.md`.
   - **Existing project:** load `references/existing-project-audit.md` and audit before asking questions.
   - **Refresh:** preserve confirmed decisions, identify material drift, and return changes to `needs-confirmation`.
4. Load `references/project-schema.md`, `references/clear-speech.md`, and `assets/project-template.md` as the profile contract.
5. Write `.praxis/project.md` with `status: needs-confirmation`. Set `clear_speech` to `default`, `strict`, or `off`. Never infer `strict`. The user can select `off`. Never invent reference URLs, product facts, or design decisions.
6. Determine whether the project has external nonstandard skill dependencies. Load `references/skill-manifest-schema.md` only when candidates exist. Create `.praxis/skills.yaml` from `assets/skills-template.yaml` only when at least one package passes the inclusion policy; otherwise leave it absent.
7. Ensure the root `AGENTS.md` contains exactly one managed AGENTS.md bootstrap from `assets/agents-bootstrap.md`. Preserve all unrelated instructions. Create `AGENTS.md` if absent.
8. Run the validator. Keep the complete profile at 2500 words or fewer and the leading Core Contract at 400 words or fewer.
9. Present the inferred Core Contract, communication mode, design-skill routing, external skill dependencies, references, constraints, and open questions. Ask the user to confirm or correct them.
10. Only after explicit confirmation, set `status: confirmed`, update the Confirmation section, rerun validation, and report `profile_sha256` plus `skills_manifest_sha256` when present.

## Project Context Gate

- Treat a missing profile as requiring `praxis-init`.
- Permit read-only reconnaissance, diagnostics, and profile initialization while the profile is missing or `needs-confirmation`.
- Do not begin Design, Plan, Implement, or other project mutations until the profile is `confirmed`, except when creating or repairing Praxis context itself.
- Record the validator-provided hash as `project_context.profile_sha256` in active workflow state or reports.
- If `.praxis/skills.yaml` exists, validate it during the gate but load package details only when selecting, checking, or installing skills. Record `project_context.skills_manifest_sha256` when present.
- Never install an external package automatically. If an applicable `required` package is missing, pause the affected work, explain the package, source, revision, and rationale, and ask for explicit installation approval. Treat missing `recommended` packages as visible advice, not a silent environment change.
- Re-read and revalidate after context compaction, a hash change, or a task that changes product or visual direction.

## Context Discipline

- Keep the Core Contract first. It must preserve the project concept, outcomes, desired feel, non-negotiables, and primary design-skill route under context pressure.
- Keep feature specifications, architecture, changelogs, inventories, and implementation detail outside this file; link to canonical documents instead.
- Prefer 800-1800 words. Treat 2500 words as a hard limit, not a target.
- Read the full file once per project-scoped task and carry only task-relevant constraints into downstream artifacts.

## Existing Profiles

Never silently overwrite a confirmed profile. In refresh mode, preserve still-valid decisions and exact user-provided URLs, summarize material changes, mark the profile `needs-confirmation`, and wait for approval.

Never build `.praxis/skills.yaml` from the contributor's complete installed-skill inventory. Derive candidates only from confirmed project routing, repository instructions, repository-owned skills, and established workflow artifacts. Exclude standard Codex capabilities, transitive dependencies, personal preferences, and one-off experiments.
