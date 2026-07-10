# Research Report: TasteSkill routing for Praxis

## Summary

| Property | Value |
|----------|-------|
| Type | feature |
| Technology | Codex skill package, Markdown, PowerShell |
| Scope | Praxis workflow routing, embedded references, packaging audits |
| Complexity | small |
| Sub-tasks completed | 1/1 |

## Components Involved

| Component | Path | Type | Role in Task | Impact |
|-----------|------|------|--------------|--------|
| Package guidance | `AGENTS.md` | Instructions | Always-on repository rules | direct |
| Feature orchestration | `.agents/skills/praxis-feature-flow/SKILL.md` | Skill | Lifecycle and state routing | direct |
| Design workflow | `.agents/skills/praxis-design/SKILL.md` | Skill | Frontend design artifacts | direct |
| Planning workflow | `.agents/skills/praxis-plan/SKILL.md` | Skill | Carries implementation constraints | direct |
| Implementation workflow | `.agents/skills/praxis-implement/SKILL.md` | Skill | Loads skills used during implementation | direct |
| Plugin package | `plugin/skills/` | Distribution mirror | Plugin-installed copies of active skills | direct |
| Reference rules | `references/rules/` | Shared policy | Package-level reusable rules | direct |
| Audit runner | `tests/audits/run-all.ps1` | Verification | Executes packaging audits | direct |
| User installer | `install.ps1` | Installer | Copies `.agents/skills` into the user skill directory | indirect |

## Data Flow

The feature flow selects a Praxis phase. Frontend-capable phases load their embedded routing rule, resolve repository constraints and installed skills, persist one primary visual-skill selection, and carry that selection through design, plan, and implementation. The installer copies repo-local skills and their embedded references into the global user skill directory.

## External Dependencies

| Service | Type | Current Usage | Relevant to Task |
|---------|------|---------------|------------------|
| Codex skill discovery | Runtime catalog | Discovers installed `SKILL.md` packages | yes |
| TasteSkill packages | Optional skills | Provide frontend art direction and image-first workflows | yes |

## Current Behavior (AS IS)

Before this change, Praxis did not contain a frontend-skill selection gate. Feature, design, plan, and implementation skills did not check whether a TasteSkill was installed, did not persist a selected visual skill, and did not define consent behavior for missing skills. Repo-local and plugin skill copies were maintained as separate file trees with embedded references.

## Test Coverage

| Component | Test File | Test Methods | Status |
|-----------|-----------|--------------|--------|
| Packaging and naming | `tests/audits/run-all.ps1` and existing audit scripts | Script-based checks | covered |
| Frontend routing | none before this change | 0 | no tests |

## Cross-Cutting Concerns

| Concern | Affected Components | Details |
|---------|---------------------|---------|
| Instruction precedence | All workflow phases | Repository and user constraints can prohibit or supersede optional design skills |
| Package parity | `.agents/skills`, `plugin/skills` | Both surfaces must carry identical routing references |
| Consent | Installer interaction | Missing skills must not be installed automatically |
| Scope | Frontend workflows | Backend and minor non-visual work must not trigger frontend skill prompts |

## Recent Activity

No Git metadata is present in `E:\Personal\codex-workflows`, so repository commit history is unavailable from this directory.

## Risks

| Risk | Description |
|------|-------------|
| Over-broad activation | Requiring an entire family would combine competing visual directions and affect non-frontend tasks |
| Packaging drift | Updating only repo-local or only plugin copies would produce different installed behavior |
| Missing embedded reference | Global installations require referenced files inside each installed workflow skill |

## Open Questions

- Whether a missing dependency should offer the exact applicable skill or the entire TasteSkill bundle.
- Which skill should handle complex product UI outside the documented scope of the main TasteSkill.
