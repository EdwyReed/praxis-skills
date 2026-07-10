# Architecture: Project Skill Dependency Manifest

## Decision

Add optional `.praxis/skills.yaml` using schema `praxis-skills/v1`. The file is created only when the project has external nonstandard skill dependencies that are required or recommended for reproducible project work.

## Responsibility Split

| Surface | Responsibility |
|---|---|
| `.praxis/project.md` | Project intent, experience, constraints, and skill routing |
| `.praxis/skills.yaml` | Acquisition metadata for selected external skill packages |
| Root `AGENTS.md` block | Discovery when Praxis is absent |
| `praxis-init` | Audit, creation, refresh, validation, and user consent flow |
| Project Context Gate | Conditional manifest validation and missing-dependency handling |

## Inclusion Policy

Include a package only when its absence prevents or materially degrades reproduction of a confirmed workflow, visual direction, or mandatory verification. Exclude standard Codex capabilities, transitive dependencies, local preferences, one-off experiments, and a dump of installed skills.

Only `required` and `recommended` are valid. Roles are unique. Git sources require an immutable commit or release/tag revision. More than five required packages needs an explicit overflow justification on each package beyond the fifth.

## Safety

The manifest is declarative. Agents inspect and explain missing packages but never install them without explicit user approval. Applicable missing required packages block the affected work; recommended packages produce a visible recommendation without silently changing the environment.

## Context Discipline

Validate and hash the manifest with the project profile. Load its package details only when selecting, checking, or installing skills. Store `skills_manifest_sha256` in workflow state when present.
