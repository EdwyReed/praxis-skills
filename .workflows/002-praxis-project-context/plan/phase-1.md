# Phase 1: Canonical profile and init skill

## Goal

Deliver a complete, independently valid `praxis-init` skill capable of creating discoverable, compact project profiles.

## Dependencies

- None.

## Changes

### New Files

| File | Type | Purpose |
|------|------|---------|
| `.agents/skills/praxis-init/references/project-schema.md` | Reference | Canonical semantics and context-budget contract |
| `.agents/skills/praxis-init/references/new-project-interview.md` | Reference | Focused interview procedure |
| `.agents/skills/praxis-init/references/existing-project-audit.md` | Reference | Evidence-first audit procedure |
| `.agents/skills/praxis-init/assets/project-template.md` | Asset | `praxis-project/v1` template |
| `.agents/skills/praxis-init/assets/agents-bootstrap.md` | Asset | Managed root `AGENTS.md` pointer |
| `.agents/skills/praxis-init/scripts/validate_project.py` | Script | Validate schema, context budget, bootstrap, and emit SHA-256 |
| `tests/audits/check-praxis-project-context.ps1` | Audit | Package and gate contract tests |

### Modified Files

| File | Type | Changes |
|------|------|---------|
| `.agents/skills/praxis-init/SKILL.md` | Skill | Replace scaffold with new/existing/refresh workflow |
| `.agents/skills/praxis-init/agents/openai.yaml` | UI metadata | Verify command-like `$praxis-init` prompt |
| `plugin/skills/praxis-init/**` | Plugin skill | Mirror source skill exactly |
| `tests/audits/run-all.ps1` | Audit runner | Add project-context audit |
| `verify-install.ps1` | Verification | Require `praxis-init` |

## TDD Approach

### Write Tests First

| # | Test | Type | Behavior | From Strategy |
|---|------|------|----------|---------------|
| 1 | `check-praxis-project-context.ps1` missing contract | structural | Given scaffold only, audit fails | #1-4 |
| 2 | Validator valid fixture | script | Given complete project profile and bootstrap, validation passes and emits SHA-256 | #10 |
| 3 | Validator oversized fixture | script | Given >2500 words, validation fails | #9 |
| 4 | System skill validator | metadata | Given completed skill, quick validation passes | #1 |

### Red-Green-Refactor Order

1. Add audit expectations and observe failure.
2. Implement references, assets, SKILL, and validator.
3. Mirror plugin package and observe audit pass.
4. Validate skill metadata and tighten wording.

## Acceptance Criteria

- [ ] `praxis-init` supports new, existing, and refresh modes.
- [ ] Root `AGENTS.md` bootstrap is mandatory and idempotent.
- [ ] Template contains early Core Contract and all schema sections.
- [ ] Validator rejects missing sections, missing bootstrap, and profiles above 2500 words.
- [ ] Validator emits the profile SHA-256.
- [ ] Source and plugin skill packages match.

## Verification

| # | Check | Command / Action | Expected |
|---|-------|------------------|----------|
| 1 | Project-context audit | Run dedicated PowerShell audit | PASS |
| 2 | Skill validation | Run `quick_validate.py` | PASS |
| 3 | Valid fixture | Run project validator on valid fixture | PASS with SHA-256 |
| 4 | Invalid fixture | Run validator on oversized/incomplete fixture | FAIL |

## Size: L
