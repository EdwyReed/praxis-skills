# Refined Task: Mandatory Praxis project context

## Meta

| Property | Value |
|----------|-------|
| Date | 2026-07-10 |
| PM Input | Introduce a mandatory `.praxis/` project profile and an initialization workflow for new and existing projects |
| Estimation | L · 12-24h development + 4-8h testing |
| Confidence | high |

## Description

Every project using Praxis must have one concise, durable source of project direction. The profile must explain the project concept, product and experience direction, desired and undesired feel, design-skill routing, and concrete references. A dedicated initialization skill must create this profile through an interview for new projects or an evidence-based audit and user confirmation for existing projects.

## WWA

**Why:** Praxis currently governs delivery phases but does not provide a canonical project-level direction contract, so separate sessions can infer different product and visual intent.

**What:** Add `.praxis/project.md`, a `praxis-init` skill, and a mandatory Project Context Gate across project-scoped Praxis workflows.

**Acceptance:** Praxis cannot enter direction-changing phases without a project profile, while new and existing projects receive appropriate initialization flows and explicit user confirmation.

## Non-Goals

- Add a legacy slash-command directory or Claude-specific command surface.
- Install or activate frontend design skills automatically.
- Overwrite an existing confirmed project profile without explicit update intent.

## Requirements

### Must-Have (P0)

**R1. Canonical project profile**
- Define `.praxis/project.md` with versioned frontmatter and required sections for concept, direction, experience, design skills, references, constraints, and confirmation.
- Acceptance criteria:
  - [ ] The template supports both visual and non-visual projects.
  - [ ] The profile has an explicit confirmation status.

**R2. New-project initialization**
- `praxis-init` interviews the user in focused rounds and writes the profile from confirmed answers.
- Acceptance criteria:
  - [ ] Questions cover audience, outcomes, feel, anti-feel, references, constraints, and design routing.
  - [ ] Unknown answers remain visible as open questions rather than guesses.

**R3. Existing-project initialization**
- `praxis-init` audits documentation, code, UI/design assets, project instructions, and available history before writing a draft.
- Acceptance criteria:
  - [ ] The draft is marked `needs-confirmation`.
  - [ ] The agent reports inferred direction and asks the user to confirm or correct it.

**R4. Mandatory workflow gate**
- Project-scoped Praxis entry points require `.praxis/project.md` and invoke `praxis-init` when it is absent.
- Acceptance criteria:
  - [ ] Research may bootstrap or refresh context.
  - [ ] Design, Plan, and Implement do not proceed with an unconfirmed profile, except when creating or repairing the profile itself.

**R5. Distribution and verification**
- Package `praxis-init` in repo-local, plugin, and user-global skill surfaces with automated audits.
- Acceptance criteria:
  - [ ] Source and plugin copies match.
  - [ ] Global installation contains the skill and its resources.
  - [ ] All package audits pass.

### Nice-to-Have (P1)

**R6. Refresh mode**
- Let users explicitly re-audit an existing profile while preserving confirmed decisions and showing material changes.
- Acceptance criteria:
  - [ ] Existing content is not silently replaced.

## Technical Context

| Area | Details |
|------|---------|
| Likely affected components | `.agents/skills`, `plugin/skills`, `AGENTS.md`, global Codex `AGENTS.md`, audits, installer verification |
| Related existing features | Praxis feature-flow, frontend skill routing, embedded skill references |
| Database impact | none |
| API impact | none |
| External dependencies | Codex skill discovery only |

## Estimation

| Parameter | Value |
|-----------|-------|
| T-shirt size | **L** |
| Development | 12-24 hours |
| Testing | 4-8 hours |
| Total | 16-32 hours |
| Confidence | high |

## Success Metrics

| Metric | Current | Target | How to Measure |
|--------|---------|--------|----------------|
| Canonical project profile coverage | No defined profile | One schema and template | Package audit |
| Project-scoped workflow gate coverage | 0 entry points | All declared project entry points | Gate audit |
| Packaged `praxis-init` surfaces | 0 | Repo-local, plugin, user-global | Hash and install verification |

## Risk Flags

| Risk | Severity | Mitigation |
|------|----------|------------|
| Workflow friction for trivial tasks | medium | Gate only project-scoped work and allow reconnaissance for bootstrap |
| Incorrect inferred direction | high | Existing projects remain `needs-confirmation` until user approval |
| Package mirror drift | medium | Add source/plugin/resource parity audit |

## Open Questions

- None blocking. The canonical filename and Codex-native invocation surface are resolved in Design.
