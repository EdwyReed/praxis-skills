# Changelog

## v0.4.0-beta.7 - 2026-08-09

- Optional Taste Skill full-family install: `--with-taste-skill` / `--no-taste-skill` (default off). Interactive wizard asks with default no.
- Pin catalog `distribution/taste-skill.json` for Leonxlnx/taste-skill at a fixed revision; default primary `design-taste-frontend` channel `v2-experimental`.
- Installer clones the pinned revision and copies all Taste Skill install-name packages into each selected agent skills root. Writes `praxis-taste-skill.json` pin note and receipt `tasteSkill` metadata.
- Frontend routing updated to current Taste Skill install names (`high-end-visual-design`, `stitch-design-taste`, `full-output-enforcement`, legacy `design-taste-frontend-v1`, image-gen skills). Removed invented `frontend-app-builder` requirement; documented out-of-scope fallback instead.
- Gate policy: missing Taste Skill never blocks work; present applicable skill must be used; agent offers install proactively when missing.
- Doctor checks Taste Skill family only when a receipt claims it was installed.
- Audits and docs/README aligned with tasteskill.dev naming and pin.

## v0.4.0-beta.6 - 2026-08-09

- Guided install TUI (zero-dependency, Clack-style): intro, radio for scope, checkbox multiselect for agents (↑↓ · space · a/n · enter), plan preview, confirm, and polished success outro.
- `praxis-skills install` with no flags launches the full wizard on a TTY.
- Fix installer hang after completion by releasing raw-mode stdin.
- Claude Code slash adapters are Praxis-prefixed (`/praxis-init`, `/praxis-feature`, …) to avoid colliding with native `/init`; unprefixed legacy command files are removed on install.

## v0.4.0-beta.5 - 2026-08-09

- Multi-agent installer: detect Codex, Claude Code, Cursor, and Grok homes; interactive multi-select on TTY; `--agents` / `--all-agents` for non-interactive runs.
- Claude Code support: install skills into `~/.claude/skills` (and project `.claude/skills`) plus thin slash-command adapters under `commands/` that load Praxis skills without forking workflow logic.
- New CLI command: `praxis-skills detect`.
- Codex skill invocation remains the portable source of truth; non-interactive default without `--agents` stays Codex-only.

## v0.4.0-beta.4 - 2026-07-29

- Added Praxis Clear Speech for replies, technical content, code text, and interface copy.
- Added `default`, `strict`, and `off` communication modes to new and refreshed project profiles.
- Added a structural text audit, protected-content rules, distribution parity checks, and a package baseline report.

## v0.4.0-beta.1 - 2026-07-10

- Added the zero-runtime-dependency `praxis-skills` npm CLI with user, repository, and custom-target install, doctor, dry-run, force, JSON, and safe uninstall flows.
- Added an authoritative distribution manifest, install receipts, npm packaging allowlist, cross-platform tests, and Trusted Publishing release preparation.

- Added optional `.praxis/skills.yaml` project skill dependency manifests with strict inclusion rules, pinned sources, separate hashes, missing-package consent gates, and required-package overflow justification.
- Added mandatory `.praxis/project.md` project direction, `$praxis-init`, root `AGENTS.md` discovery bootstrap, compactness validation, and workflow profile hashes.
- Added mandatory, repository-aware frontend skill routing for Praxis feature, design, plan, and implementation workflows.
- Added an audit that keeps the routing policy synchronized across repo-local and plugin skill packages.

## v0.1.0-codex-port

- Initial Codex-native port structure.
- Added repo skills, role references, plugin packaging, installers, and audits.
