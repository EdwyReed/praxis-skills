# Praxis Skill Dependency Manifest

The optional canonical file is `.praxis/skills.yaml` with `schema: praxis-skills/v1`. Create it only when the project depends on at least one external nonstandard skill package.

## Inclusion rule

Include a package only when its absence prevents or materially degrades reproduction of a confirmed workflow, visual direction, or mandatory verification. Derive candidates from confirmed `.praxis/project.md` routing, repository `AGENTS.md`, repository-owned skills, and established workflow artifacts.

Exclude standard Codex capabilities, transitive dependencies, a contributor's complete installed inventory, personal preferences, one-off experiments, and merely interesting recommendations.

## Package fields

- `id`: unique kebab-case package or family id.
- `requirement`: `required` or `recommended`; `optional` is intentionally invalid.
- `role`: unique project responsibility such as `primary-frontend-direction`.
- `source.type`: `git`, `marketplace`, `website`, or `local-generation`.
- `source.url`: exact HTTPS source for `git` or `website`.
- `source.revision`: pinned commit, release, or tag for `git`; floating values such as `main`, `master`, `HEAD`, or `latest` are invalid.
- `source.package`: marketplace package id when applicable.
- `source.command`: explicit project-local generation command when applicable.
- `skills`: non-empty list of selected entrypoint skills, not every skill in the source package.
- `rationale`: why this package is a project dependency.
- `applies_when`: bounded trigger for checking availability.
- `overflow_justification`: required on every required package after the fifth.

Roles must not compete. Record one package or family per responsibility and list selected entrypoints beneath it.

## Runtime policy

- Validate and hash the manifest with project context.
- Load package details only for skill selection, availability checks, or installation.
- Missing applicable `required` packages block the affected work until the user decides how to proceed.
- Missing `recommended` packages are reported but do not block unrelated work.
- Never install external content automatically. Show the source, pinned revision, rationale, and requested scope, then obtain explicit approval.

## Size policy

Five required packages is the normal ceiling. A larger set remains valid only when each required package after the fifth has a specific `overflow_justification`. Prefer one family record over separate records for every entrypoint.
