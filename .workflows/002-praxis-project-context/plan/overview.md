# Implementation Plan: Mandatory Praxis project context

## Source

- Research: `.workflows/002-praxis-project-context/research/research-report.md`
- Architecture: `.workflows/002-praxis-project-context/design/architecture.md`
- ADR: `.workflows/002-praxis-project-context/design/adr/001-canonical-project-profile.md`
- Test Strategy: `.workflows/002-praxis-project-context/design/test-strategy.md`

## Phases

| # | Phase | Description | Dependencies | Size | Risk |
|---|-------|-------------|--------------|------|------|
| 1 | Canonical profile and init skill | Complete `praxis-init`, schema assets, bootstrap, validator, plugin mirror, and structural audit | — | L | high |
| 2 | Workflow integration and dogfooding | Add gates to project entry points, initialize Praxis itself, update package/global guidance, install and verify | Phase 1 | L | high |

## Dependency Graph

```mermaid
flowchart LR
    P1["Phase 1: Profile and Init Skill"] --> P2["Phase 2: Workflow Integration"]
```

## Execution Strategy

| Wave | Phases | Execution | Rationale |
|------|--------|-----------|-----------|
| 1 | Phase 1 | sequential | Gate integration depends on the finalized skill and schema |
| 2 | Phase 2 | sequential | Uses the profile template and validator from Phase 1 |

**Critical path:** Phase 1 → Phase 2

## Risk Mitigation

| Phase | Risk | Impact | Mitigation |
|-------|------|--------|------------|
| Phase 1 | Skill is verbose or incomplete | Context pollution or weak initialization | Keep SKILL concise, use references/assets, enforce hard validator limits |
| Phase 2 | Gate bypass or excessive blocking | Inconsistent context or workflow friction | Audit an explicit project-entry list and conditional standalone QA behavior |
| Phase 2 | Existing projects ignore profile without Praxis | Lost direction contract | Managed root `AGENTS.md` bootstrap |

## Scope Summary

| Metric | Value |
|--------|-------|
| Total phases | 2 |
| New files | ~12 plus package mirror |
| Modified files | ~30 across source/plugin/global guidance |
| New audits | 1 structural audit plus validator scenarios |
| High-risk phases | 1, 2 |

## Frontend Skill Selection

Not applicable; no visual frontend is implemented.
