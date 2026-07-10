# Test Strategy: Mandatory Praxis project context

## Existing Test Patterns

| Property | Value |
|----------|-------|
| Framework | PowerShell audit scripts plus system skill validator |
| Structure | `tests/audits/*.ps1` executed by `run-all.ps1` |
| Fixture pattern | Real package tree and temporary filesystem fixtures when required |
| Naming convention | `check-{contract}.ps1` |

## Testing Approach

Use structural audits for deterministic package contracts and the system `quick_validate.py` validator for the new skill. Verify repo-local, plugin, and user-global installations rather than testing prose subjectively.

## Regression Impact

| Modified Component | Existing Tests | Impact | Action |
|-------------------|----------------|--------|--------|
| Skill catalog | frontmatter and naming audits | New skill can fail metadata rules | Run existing suite and quick validator |
| Workflow skills | workflow reference and routing audits | Gate clauses can drift across surfaces | Add dedicated project-context gate audit |
| Installer verification | `verify-install.ps1` | Required skill list lacks `praxis-init` | Add it and verify global installation |

## Contract Tests

| # | Case | Given | When | Then | Priority | Risk Ref |
|---|------|-------|------|------|----------|----------|
| 1 | Skill structure valid | Source `praxis-init` exists | Run `quick_validate.py` | Validation passes | high | ADR-001 |
| 2 | Template schema complete | Project template exists | Audit required frontmatter and headings | Every required field and section is present | high | ADR-001 |
| 3 | Source/plugin parity | Both skill surfaces exist | Hash files recursively | Files match | high | Mirror drift |
| 4 | Gate coverage | Project-scoped skill list is declared | Scan SKILL files | Every required entry point contains Project Context Gate | high | Bypass |
| 5 | Conditional QA behavior | `praxis-qa-checklist` handles standalone inputs | Inspect gate clause | Gate is repository-only | medium | Excessive blocking |
| 6 | Global installation | User install completes | Run installer and verification | Installed skill contains metadata, references, and asset | high | Missing resources |
| 7 | Package regression | Existing audits exist | Run all audits | Entire suite passes | high | Regression |
| 8 | Bootstrap discovery | Praxis is absent from an initialized repository | Inspect root `AGENTS.md` | Managed block requires full profile read | high | Discovery |
| 9 | Context budget | Profile exceeds 2500 words or lacks early Core Contract | Run validator | Validation fails | high | Context pollution |
| 10 | Profile traceability | Valid profile exists | Run validator | SHA-256 is emitted for workflow state | medium | Stale context |

## What NOT to Test

- The subjective quality of user answers; the skill must preserve uncertainty visibly.
- Browser behavior; this feature has no rendered UI.
- External TasteSkill packages; only routing fields in the profile schema are verified.

## Test Data Requirements

| Data | Type | Description |
|------|------|-------------|
| Project template | asset | Canonical `praxis-project/v1` skeleton |
| Praxis repository profile | dogfood artifact | Existing-project audit example marked `needs-confirmation` |

## Coverage Expectations

| Scope | Target |
|-------|--------|
| Required template fields | 100% structural checks |
| Declared project-scoped skill gates | 100% |
| New skill package parity | 100% |
| Existing audit suite | 100% pass |
