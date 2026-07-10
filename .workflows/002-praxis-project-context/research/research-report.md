# Research Report: Mandatory Praxis project context

## Summary

| Property | Value |
|----------|-------|
| Type | feature |
| Technology | Markdown skills, PowerShell packaging audits, Codex plugin manifest |
| Scope | Project initialization, workflow entry points, skill distribution, global guidance |
| Complexity | large |
| Sub-tasks completed | 1/1 inline scan |

## Components Involved

| Component | Path | Type | Role in Task | Impact |
|-----------|------|------|--------------|--------|
| Global package guidance | `AGENTS.md` | Instructions | Defines always-on package behavior | direct |
| Workflow entry points | `.agents/skills/praxis-*/SKILL.md` | Skills | Trigger project work | direct |
| Plugin distribution | `plugin/skills/` | Skill mirror | Distributes the same skills as a plugin | direct |
| Installer | `install.ps1`, `install.sh` | Scripts | Copies all source skill directories | indirect |
| Verification | `verify-install.ps1`, `tests/audits/` | Scripts | Checks required skills and package integrity | direct |
| Feature state | `.workflows/{feature-id}/state.json` | Artifact | Stores workflow phase state and frontend selection | indirect |
| Frontend routing | `references/rules/frontend-skill-routing.md` | Rule | Selects one visual skill after project constraints | direct |

## Data Flow

A user request triggers a Praxis workflow skill. The skill currently loads its phase-specific references and reads repository context ad hoc. Repo-local skills are copied to the user-global directory by `install.ps1`; plugin skills are maintained as a separate mirrored tree. There is no canonical `.praxis/` project context file or initialization skill in the active package before this feature.

## External Dependencies

| Service | Type | Current Usage | Relevant to Task |
|---------|------|---------------|------------------|
| Codex skill discovery | Runtime | Discovers `.agents/skills/*/SKILL.md` and plugin skills | yes |
| Git | Optional local metadata | Some Praxis research and pattern extraction flows inspect history | yes |
| Browser/UI inspection | Optional tool capability | Used by frontend workflows when a rendered interface exists | yes |

## Current Behavior (AS IS)

- Praxis contains 22 complete skills plus the newly scaffolded `praxis-init` placeholder.
- Project concept, audience, desired feel, design references, and skill decisions are not stored in a mandatory canonical file.
- `praxis-feature-flow` contains a Frontend Skill Gate, but that gate reads repository constraints without a standardized project-direction artifact.
- Direct invocations of research, design, plan, implementation, documentation, and PR workflows can start independently.
- The active repository explicitly avoids adding Claude-style slash-command surfaces.
- User-global installation copies entire skill directories, including embedded references and assets.
- The working directory does not contain Git metadata, so local commit history is unavailable.

## Test Coverage

| Component | Test File | Test Methods | Status |
|-----------|-----------|--------------|--------|
| Skill frontmatter | `tests/audits/check-skill-frontmatter.ps1` | Script checks all source skills | covered |
| Workflow embedded references | `tests/audits/check-workflow-skill-references.ps1` | Script checks reference directories | covered |
| Frontend routing | `tests/audits/check-frontend-skill-routing.ps1` | Rule and mirror parity checks | covered |
| Project context initialization | none | 0 | no tests |
| Project Context Gate | none | 0 | no tests |

## Cross-Cutting Concerns

| Concern | Affected Components | Details |
|---------|---------------------|---------|
| Precedence | Global guidance and project profile | User and repository instructions must remain authoritative |
| Confirmation | Existing-project audit | Inferred direction requires user validation |
| Packaging | Source, plugin, global installation | New skill resources must be present in every surface |
| Invocation | Skill metadata and docs | Codex-native skill invocation is the supported reusable workflow surface |
| Non-visual projects | Project schema | Design fields need an explicit not-applicable representation |

## Recent Activity

Git history is unavailable because `E:\Personal\codex-workflows` has no `.git` directory. File timestamps show the active package was modified during the current Praxis routing upgrade.

## Risks

| Risk | Description |
|------|-------------|
| Initialization recursion | The Praxis repository itself does not yet have the profile that the new gate will require |
| Excessive blocking | An unconditional gate on standalone artifact tasks could create project context where no project exists |
| Mirror divergence | Repo-local and plugin copies can differ unless explicitly audited |
| Hallucinated references | Existing-project audit could invent brand or design references not present in evidence |

## Open Questions

- Which Praxis skills count as project-scoped versus standalone artifact/reference skills?
- How should an existing but unconfirmed profile affect research and urgent diagnostic work?
- What explicit invocation should documentation present in place of a legacy slash command?
