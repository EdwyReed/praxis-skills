# Architecture Design: Mandatory Praxis project context

## Overview

Add one canonical project-direction document, one initialization skill, and one gate shared by project-scoped Praxis entry points. The design keeps project context human-readable and versionable while using skill metadata as the Codex-native invocation surface.

Diagrams: see [diagrams.md](diagrams.md).

## New / Changed Components

| Component | Type | Action | Responsibility |
|-----------|------|--------|----------------|
| `.praxis/project.md` | Project artifact | NEW | Canonical concept, direction, experience, design routing, references, constraints, and confirmation status |
| `praxis-init` | Skill | NEW | Initialize, audit, refresh, and confirm the canonical project profile |
| Managed `AGENTS.md` bootstrap | Repository instruction | NEW | Make the canonical profile discoverable even when Praxis is not installed |
| Project Context Gate | Workflow rule | NEW | Require the profile before project-scoped Praxis work |
| Project profile template | Skill asset | NEW | Define stable `praxis-project/v1` structure |
| Project profile validator | Skill script | NEW | Enforce schema, size, bootstrap presence, and emit the profile hash |
| New/existing mode references | Skill references | NEW | Keep interview and audit procedures out of the compact SKILL body |
| Project-context audit | PowerShell audit | NEW | Verify skill packaging, gate coverage, template schema, and source/plugin parity |
| Praxis package guidance | `AGENTS.md`, README, manifest | MODIFY | Declare initialization as a core capability |
| User-global guidance | Codex `AGENTS.md` | MODIFY | Enforce initialization before project-scoped workflow work |

## Caller Analysis

| Component | Caller | Caller Expects | After Call |
|-----------|--------|----------------|------------|
| `praxis-init` | User via `$praxis-init` or another Praxis skill | A profile draft or confirmed profile plus a concise report | Requested workflow resumes only when the gate permits it |
| `.praxis/project.md` | All project-scoped Praxis skills | Stable project direction and confirmed decisions | Phase-specific artifacts inherit its constraints |
| Managed `AGENTS.md` bootstrap | Codex repository instruction discovery | A short mandatory pointer to the canonical profile | Agent reads the full profile even without Praxis installed |
| Project Context Gate | Workflow skill | `confirmed`, missing, or `needs-confirmation` state | Continue, invoke init, or pause direction-changing work |
| Project-context audit | Package audit runner | Binary PASS/FAIL | Package release or installation proceeds only on PASS |

## Key Design Decisions

1. `.praxis/project.md` is the single canonical file; schema version and confirmation state live in YAML frontmatter.
2. `$praxis-init` is both the explicit user invocation and the automatic workflow gate target. No separate legacy command surface is added.
3. New projects use a focused interview. Existing projects use evidence-first audit and always produce `needs-confirmation` until the user validates the inference.
4. Missing or unconfirmed context permits reconnaissance needed for initialization, but blocks Design, Plan, Implement, and other mutating project work.
5. The profile supports `visual_scope: none`, so non-visual projects are not forced to select design skills or references.
6. `praxis-init` inserts a small idempotent managed block into the root `AGENTS.md`; it points to the profile without duplicating it.
7. Every Praxis workflow records the validator-provided SHA-256 as `project_context.profile_sha256`. After context compaction, profile change, or direction change, the agent rereads and revalidates the file.

## Project Context Precedence

1. Explicit current user instruction.
2. Repository `AGENTS.md` and other higher-priority repository instructions.
3. Confirmed `.praxis/project.md` direction.
4. Phase-specific Praxis defaults and optional skills.

Contradictions between levels 2 and 3 require user clarification rather than silent reconciliation.

## Project-Scoped Entry Points

The mandatory gate applies to `praxis-feature-flow`, `praxis-refine`, `praxis-research`, `praxis-design`, `praxis-plan`, `praxis-implement`, `praxis-pr`, `praxis-docs-suite`, `praxis-sentry-triage`, `praxis-system-profile`, and `praxis-skill-from-git`. `praxis-qa-checklist` applies the gate only when operating on a repository rather than a standalone artifact. Package diagnostics and template/reference skills are exempt.

## Non-Functional Requirements

| Requirement | Target | Basis |
|-------------|--------|-------|
| Profile size | Prefer ≤2500 words | Must stay cheap enough to read at the start of project work |
| Core Contract position | First 400 words | Preserve concept, experience, non-negotiables, and skill routing under context pressure |
| Interview length | 2-3 questions per round, maximum 3 rounds | Avoid onboarding fatigue |
| Existing-project audit | Read-only until profile write | Avoid accidental product changes during initialization |
| Packaging parity | 100% source/plugin/global match for `praxis-init` | Prevent different behavior by install mode |
| Reference integrity | Preserve user-provided URLs exactly | References are decisions, not decorative copy |
| Discovery without Praxis | Managed root `AGENTS.md` block present | Codex loads repository instructions independently of optional skills |

## State Model

| Status | Meaning | Allowed Work |
|--------|---------|--------------|
| `needs-confirmation` | Draft inferred or synthesized but not accepted | Reconnaissance, profile correction, read-only diagnostics |
| `confirmed` | User explicitly accepted the current direction | Normal Praxis workflow |

An existing confirmed profile is never overwritten silently. Refresh mode writes material changes as a draft and asks for confirmation.

## Context Budget Rules

- Put the semantic Core Contract first and keep it within 400 words.
- Prefer 800-1800 words for the complete profile; reject profiles above 2500 words.
- Store feature specifications, architecture details, histories, and duplicated documentation elsewhere and link to them.
- Read the full profile once at the start of project-scoped work, then carry only task-relevant constraints into phase artifacts.
- Re-read after compaction, a profile hash change, or a task that changes product or visual direction.

## Open Questions

| Question | Status | Resolution |
|----------|--------|------------|
| Which skills are project-scoped? | resolved | Core delivery/documentation/system workflows plus conditional repository QA |
| Can work proceed with an unconfirmed profile? | resolved | Only reconnaissance, diagnostics, and profile initialization/repair |
| What replaces a slash command? | resolved | Explicit skill invocation `$praxis-init` |

## Frontend Skill Selection

Not applicable. This feature defines routing policy but has no visual frontend deliverable.
