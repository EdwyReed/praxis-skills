# Praxis Skills

## Working agreements

- Treat this repository as a Codex-first workflow package. Codex skill packages under `.agents/skills/*/SKILL.md` remain the source of truth.
- Claude Code slash commands are allowed only as thin install-time adapters that load the matching Praxis skill. Do not fork workflow logic into command files.
- Multi-agent install targets (Codex, Claude Code, Cursor, Grok) are declared in `distribution/manifest.json` and implemented by the npm CLI. Keep agent path detection filesystem-based and dry-run friendly.
- Use `.agents/skills/*/SKILL.md` for reusable workflows. Keep detailed role, rule, context, and scenario material in `references/` and load it only when the selected skill needs it.
- Preserve the workflow artifact chain under `.workflows/{feature-id}/`. Feature work should produce inspectable research, design, plan, implementation, documentation, and PR artifacts.
- Prefer repo-local validation before user-global installation. Installers must be dry-run friendly and must not delete unrelated skills or plugins.
- Treat subagents as optional. Any workflow that can use subagents must also describe an inline fallback path.
- Require a confirmed `.praxis/project.md` before project mutations. Use `praxis-init` to create, audit, refresh, or confirm it and record its validated SHA-256 in workflow state.
- Keep external nonstandard project skill dependencies in optional `.praxis/skills.yaml`; never derive it from a contributor's complete installed inventory or install listed packages without explicit approval.
- For visually significant frontend work, enforce `references/rules/frontend-skill-routing.md`: repository constraints come first, exactly one primary visual skill is selected, and installation always requires user consent.
- Before reporting port completion, run `pwsh tests/audits/run-all.ps1` and record any dry-run limitations.

## Git and verification

- Do not rewrite unrelated user changes. Keep generated migration edits scoped to Codex workflow packaging.
- Do not mention AI vendors or assistants in commit messages.
- Verify source coverage whenever adding, removing, or moving ported workflow files.
- Install paths may target Claude, Cursor, or Grok homes when the user selects those agents. Do not hard-require a Claude home for Codex-only installs.

## Language

- Preserve Ukrainian workflow terminology from the source where it is part of output contracts.
- Migration and compatibility documentation may explain terms in English or Russian, but should not silently rewrite source semantics.

<!-- praxis:project-context:start -->
## Praxis Project Context

Before any project-scoped work, read `.praxis/project.md` fully and treat its confirmed decisions as project constraints. If it is missing, initialize it before modifying the project. If its status is `needs-confirmation`, limit work to read-only reconnaissance, diagnostics, or profile correction until the user confirms it. If `.praxis/skills.yaml` exists, validate it with project context. Read package details only before you select, check, or install skills.

Never install an external package automatically. Explain any applicable missing package and ask for explicit approval. After context compaction, a direction-changing request, or a context hash change, read the affected file again.

Resolve `clear_speech` from the project profile before you write eligible text. A missing value means `default`. In `default` mode, apply Praxis Clear Speech Core to replies, documentation, human-readable code text, and interface copy. Apply its English Technical Profile to English technical text.

In `strict` mode, apply that English profile to all eligible English prose. In `off` mode, do not load or apply Praxis Clear Speech or its audits automatically. A current explicit user request can enable the skill for one task or require a different style. Load `praxis-clear-speech` when you need the full policy or an audit. Preserve identifiers, API fields, exact quotations, legal text, trademarks, external contracts, and approved project terms.
<!-- praxis:project-context:end -->
