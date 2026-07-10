# Phase 2: Workflow integration and dogfooding

## Goal

Make the project profile mandatory across project-scoped Praxis work and verify real global installation.

## Dependencies

- Phase 1 completed.

## Changes

### New Files

| File | Type | Purpose |
|------|------|---------|
| `.praxis/project.md` | Dogfood profile | Existing-project audit of Praxis itself |

### Modified Files

| File | Type | Changes |
|------|------|---------|
| Project-scoped `.agents/skills/*/SKILL.md` | Skills | Add Project Context Gate |
| Matching `plugin/skills/*/SKILL.md` | Plugin skills | Keep gate parity |
| `praxis-feature-flow` state schema | Reference | Add project-context status and hash |
| `AGENTS.md` | Package guidance | Require canonical profile and managed bootstrap |
| `README.md`, `CHANGELOG.md`, plugin manifest | Documentation | Advertise initialization capability |
| `C:\Users\petyl\.codex\AGENTS.md` | Global guidance | Invoke `$praxis-init` when profile is absent |

## TDD Approach

### Write Tests First

| # | Test | Type | Behavior | From Strategy |
|---|------|------|----------|---------------|
| 1 | Gate coverage audit | structural | Given project-entry list, every source/plugin skill contains the gate | #4-5 |
| 2 | Dogfood profile validation | script | Given Praxis profile and root bootstrap, validator passes | #2, #8-10 |
| 3 | Global install verification | integration | Given user install, installed package includes all `praxis-init` resources | #6 |
| 4 | Full audit suite | regression | Given all changes, existing audits still pass | #7 |

### Red-Green-Refactor Order

1. Extend audit with gate list and observe failure.
2. Add clauses to source skills and mirror them to plugin skills.
3. Create Praxis profile and root bootstrap.
4. Update package/global guidance, install, and verify hashes.

## Acceptance Criteria

- [ ] All project-scoped entry points enforce the profile gate.
- [ ] Standalone QA artifacts remain exempt.
- [ ] Workflow state records profile status and SHA-256.
- [ ] Praxis repository has a compact `needs-confirmation` profile and managed root bootstrap.
- [ ] Global install contains the same skill package as source/plugin.
- [ ] All audits pass.

## Verification

| # | Check | Command / Action | Expected |
|---|-------|------------------|----------|
| 1 | Dedicated audit | Run project-context audit | PASS |
| 2 | Package suite | Run all audits | PASS |
| 3 | User install | Force user-global install and verify | PASS |
| 4 | Hash parity | Compare source, plugin, and installed skill tree | Equal |

## Size: L
