# Praxis Skills Port Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` or `superpowers:executing-plans` when implementing this plan. This document is a planning artifact only; do not begin the port until explicitly asked.

**Goal:** Port upstream `ikovinski/Claude` into `EdwyReed/praxis-skills` as a first-class Praxis Skills package without losing the original workflow coverage, while upgrading it to Codex-native skills, plugins, MCP dependencies, subagents, app UX, and verification discipline.

**Architecture:** Treat the original repository as a prompt/workflow source system, not as code to run directly. Convert Claude Code slash commands, agents, rules, contexts, scenarios, and skills into Codex-native layers: `AGENTS.md` for durable repo guidance, `.agents/skills` for reusable workflows, plugin packaging for distribution, MCP declarations for external tools, and Codex subagent orchestration for multi-role execution.

**Tech Stack:** Codex Skills, Codex Plugins, `AGENTS.md`, `.codex/config.toml`, optional plugin MCP declarations, GitHub CLI, Sentry MCP, Context7/OpenAI Docs MCP, Markdown workflow artifacts.

## Global Constraints

- Do not start the port until the user explicitly asks for implementation.
- Preserve every original workflow capability unless it is replaced by a stronger Codex-native equivalent.
- Keep the fork source intact until migration tasks intentionally modify it.
- Preserve the artifact-chain concept: `.workflows/{feature-id}/` remains the workflow state and handoff directory unless a later design decision explicitly changes it.
- Prefer Codex Skills over deprecated custom prompts for reusable workflows.
- Use plugin packaging for installable distribution after the skill layout is stable.
- Keep Sentry, Context7, GitHub, browser, and docs access as MCP/app dependencies rather than hardcoded assumptions.
- Add tests and audits for the ported workflow metadata, not just prose review.

---

## Source Inventory

The source fork contains these functional surfaces that must be accounted for:

- 13 commands: `feature`, `refine`, `research`, `design`, `plan`, `implement`, `docs-suite`, `pr`, `sentry-triage`, `qa-checklist`, `system-profile`, `skill-from-git`, `ai-debug`.
- 21 agents: 16 engineering agents and 5 documentation agents.
- 9 source skills: `praxis-design-template`, `praxis-adr-template`, `praxis-api-contracts-template`, `praxis-tdd-approach`, `praxis-owasp-top-10`, `praxis-security-audit-checklist`, `praxis-test-design-techniques`, `praxis-task-refinement`, `praxis-stoplight-docs`.
- 8 rules: `language`, `git`, `coding-style`, `security`, `testing`, `database`, `messaging`, `qa-checklist-selection`.
- 4 contexts: `dev`, `review`, `research`, `planning`.
- 3 scenario families: `feature-development`, `documentation-suite`, `sentry-triage -> feature`.
- Existing docs under `docs/how`, `docs/why`, and `docs/comparisons`.
- Installer scripts that currently target `~/.claude`; these should be replaced or deprecated for Codex distribution.

## Target Codex Shape

Recommended repository layout after the port:

```text
praxis-skills/
├── .codex/
│   ├── config.example.toml
│   └── README.md
├── .agents/
│   ├── skills/
│   │   ├── praxis-feature-flow/
│   │   │   ├── SKILL.md
│   │   │   ├── references/
│   │   │   └── scripts/
│   │   ├── praxis-research/
│   │   ├── praxis-design/
│   │   ├── praxis-plan/
│   │   ├── praxis-implement/
│   │   ├── praxis-docs-suite/
│   │   ├── praxis-sentry-triage/
│   │   ├── praxis-qa-checklist/
│   │   ├── praxis-system-profile/
│   │   └── praxis-skill-from-git/
│   └── openai.yaml
├── AGENTS.md
├── plugin/
│   ├── .codex-plugin/plugin.json
│   ├── skills/
│   └── assets/
├── references/
│   ├── agents/
│   ├── rules/
│   ├── contexts/
│   ├── scenarios/
│   └── templates/
├── docs/
│   ├── porting/
│   ├── how/
│   ├── why/
│   └── comparisons/
└── tests/
    ├── metadata/
    ├── workflow-fixtures/
    └── audits/
```

## Porting Decisions

1. Commands become Codex Skills, not slash prompts.
   - Reason: Codex custom prompts are deprecated for reusable workflows; skills support implicit/explicit invocation, references, scripts, dependencies, and plugin packaging.

2. Source agents become role reference files plus subagent orchestration instructions.
   - Reason: Codex does not consume Claude Code agent files directly. The role content should be preserved in `references/agents/...` and loaded by skills when a task requires that role.

3. Source rules split between `AGENTS.md` and skill references.
   - Repo-wide behavior such as git, verification expectations, language policy, and documentation discipline belongs in `AGENTS.md`.
   - Domain-specific review checklists and conditional rules belong in skill `references/`.

4. Source contexts become mode reference files.
   - `contexts/dev.md`, `contexts/review.md`, `contexts/research.md`, and `contexts/planning.md` should remain separate and be loaded only by the skills that need them.

5. Artifact chain stays.
   - `.workflows/{feature-id}/state.json` and phase directories are one of the strongest parts of the original design. Keep them, then add schema validation and status repair utilities.

6. Plugin comes after local skills.
   - First make `.agents/skills` work in a repo checkout. Then package into a plugin for installability.

## Implementation Plan

### Task 1: Baseline Audit and Coverage Matrix

**Files:**
- Create: `docs/porting/source-inventory.md`
- Create: `docs/porting/coverage-matrix.md`
- Create: `tests/audits/expected-source-files.txt`

**Interfaces:**
- Consumes: original `agents/`, `commands/`, `contexts/`, `rules/`, `scenarios/`, `skills/`, `templates/`, `docs/`.
- Produces: a checklist that later tasks must satisfy before any source file can be removed, renamed, or converted.

Steps:
- [ ] List every source markdown file by category.
- [ ] Extract `name`, `description`, `model`, `consumes`, `produces`, `depends_on`, `allowed_tools`, `skills`, `context`, and `requires` from frontmatter where present.
- [ ] Create a source-to-target mapping table with columns: source file, source role, target Codex surface, target path, migration status, verification method.
- [ ] Mark every command, agent, rule, context, scenario, and skill as `preserve`, `merge`, `split`, or `deprecate`.
- [ ] Add an audit fixture containing the exact source file list so future work detects accidental loss.
- [ ] Commit with message: `docs: inventory source workflow surfaces`.

### Task 2: Codex Surface Design

**Files:**
- Create: `docs/porting/codex-architecture.md`
- Create: `docs/porting/surface-decisions.md`
- Create: `.codex/config.example.toml`

**Interfaces:**
- Consumes: `docs/porting/coverage-matrix.md`.
- Produces: the canonical target architecture for all conversion tasks.

Steps:
- [ ] Document how Codex will load this system through repo skills, user skills, and plugin packaging.
- [ ] Define which guidance belongs in `AGENTS.md`, which belongs in skills, and which belongs in MCP dependency declarations.
- [ ] Define naming conventions for Codex skills: `praxis-feature-flow`, `praxis-research`, `praxis-design`, `praxis-plan`, `praxis-implement`, `praxis-docs-suite`, `praxis-sentry-triage`, `praxis-qa-checklist`, `praxis-system-profile`, `praxis-skill-from-git`.
- [ ] Add example MCP config for Sentry, Context7, GitHub, and OpenAI Docs without embedding secrets.
- [ ] Document Codex app, CLI, and IDE behavior differences that affect invocation.
- [ ] Commit with message: `docs: define codex port architecture`.

### Task 3: Repository Guidance Layer

**Files:**
- Create: `AGENTS.md`
- Create: `references/rules/language.md`
- Create: `references/rules/git.md`
- Create: `references/rules/coding-style.md`
- Create: `references/rules/security.md`
- Create: `references/rules/testing.md`
- Create: `references/rules/database.md`
- Create: `references/rules/messaging.md`
- Create: `references/rules/qa-checklist-selection.md`

**Interfaces:**
- Consumes: `CLAUDE.md`, `rules/*.md`, `docs/why/header-format-standard.md`.
- Produces: durable Codex repo guidance plus routed rule references.

Steps:
- [ ] Convert only truly global behavior into `AGENTS.md`: workflow discipline, artifact chain, verification gates, git habits, documentation discipline, and how to choose skills.
- [ ] Keep technology-specific or conditional rules in `references/rules/` so they do not bloat every Codex task.
- [ ] Add routing guidance: which skill loads which rule reference.
- [ ] Preserve Ukrainian workflow terminology where it is part of the original user-facing contract; document whether future localization should include English/Russian variants.
- [ ] Verify `AGENTS.md` stays small enough to be useful as always-on context.
- [ ] Commit with message: `feat: add codex repo guidance layer`.

### Task 4: Role Library Conversion

**Files:**
- Create: `references/agents/engineering/*.md`
- Create: `references/agents/documentation/*.md`
- Create: `references/agents/README.md`
- Create: `docs/porting/role-model-map.md`

**Interfaces:**
- Consumes: `agents/engineering/*.md`, `agents/documentation/*.md`.
- Produces: Codex-loadable role references preserving all 21 original agent perspectives.

Steps:
- [ ] Copy each source agent into `references/agents/...` with frontmatter normalized for Codex reference use.
- [ ] Replace Claude-specific model labels `opus` and `sonnet` with role classes: `deep-reasoning`, `execution`, `review`, `gate`.
- [ ] Preserve each role's bias, consumes, produces, and output format.
- [ ] Add Codex orchestration notes: when to use a subagent, when to keep work inline, and when to run reviewers in parallel.
- [ ] Add a role map showing every original agent and its Codex execution strategy.
- [ ] Commit with message: `feat: preserve agent roles as codex references`.

### Task 5: Core Feature Flow Skill

**Files:**
- Create: `.agents/skills/praxis-feature-flow/SKILL.md`
- Create: `.agents/skills/praxis-feature-flow/references/scenario.md`
- Create: `.agents/skills/praxis-feature-flow/references/state-schema.md`
- Create: `.agents/skills/praxis-feature-flow/scripts/validate-state.ps1`
- Create: `tests/workflow-fixtures/feature-state-valid.json`
- Create: `tests/workflow-fixtures/feature-state-invalid.json`

**Interfaces:**
- Consumes: `commands/feature.md`, `scenarios/delivery/feature-development.md`.
- Produces: Codex-native meta-workflow for initializing, resuming, and status-checking `.workflows/{feature-id}`.

Steps:
- [ ] Write skill frontmatter with a trigger description for full feature lifecycle, resume/status, bugfix from Sentry, and refined task intake.
- [ ] Convert `/feature` behavior into imperative Codex instructions.
- [ ] Preserve `--from`, `--status`, `--resume`, complexity adaptation, human checkpoint, and fast-track override.
- [ ] Define the `state.json` schema in a reference file.
- [ ] Add a validation script that checks required keys, allowed phase states, and artifact existence.
- [ ] Add tests that validate good and bad state fixtures.
- [ ] Commit with message: `feat: port feature flow to codex skill`.

### Task 6: Phase Skills

**Files:**
- Create: `.agents/skills/praxis-refine/SKILL.md`
- Create: `.agents/skills/praxis-research/SKILL.md`
- Create: `.agents/skills/praxis-design/SKILL.md`
- Create: `.agents/skills/praxis-plan/SKILL.md`
- Create: `.agents/skills/praxis-implement/SKILL.md`
- Create: `.agents/skills/praxis-pr/SKILL.md`
- Create: `.agents/skills/*/references/`

**Interfaces:**
- Consumes: `commands/refine.md`, `commands/research.md`, `commands/design.md`, `commands/plan.md`, `commands/implement.md`, `commands/pr.md`, related agents, contexts, rules, and skills.
- Produces: one Codex skill per phase with explicit inputs, outputs, gates, and artifact contracts.

Steps:
- [ ] Port `refine` with task-refiner role, 2-3 question rounds, INVEST checks, estimation, and `refined-task.md` output.
- [ ] Port `research` with facts-only rule, complexity assessment, Sentry context, Context7 dependency, and research report gates.
- [ ] Port `design` with architecture, diagrams, ADR, API contracts, test strategy, Devil's Advocate challenge, and optional security review.
- [ ] Port `plan` with vertical slices, dependency graph, TDD approach, verification criteria, and replan handling.
- [ ] Port `implement` with Codex subagent guidance, writer/reviewer/gate roles, smoke checks, fix iterations, reviewer selection by complexity, and phase report output.
- [ ] Port `pr` with GitHub app or `gh` fallback, artifact-linked PR description, test plan, and CI verification.
- [ ] Commit after each phase skill with `feat: port <phase> skill`.

### Task 7: Documentation and Operations Skills

**Files:**
- Create: `.agents/skills/praxis-docs-suite/SKILL.md`
- Create: `.agents/skills/praxis-sentry-triage/SKILL.md`
- Create: `.agents/skills/praxis-qa-checklist/SKILL.md`
- Create: `.agents/skills/praxis-system-profile/SKILL.md`
- Create: `.agents/skills/praxis-skill-from-git/SKILL.md`
- Create: `.agents/skills/praxis-ai-debug/SKILL.md`

**Interfaces:**
- Consumes: `commands/docs-suite.md`, `commands/sentry-triage.md`, `commands/qa-checklist.md`, `commands/system-profile.md`, `commands/skill-from-git.md`, `commands/ai-debug.md`, documentation agents, QA skill, Stoplight skill.
- Produces: Codex-native supporting workflows.

Steps:
- [ ] Port `docs-suite` with full mode, update mode, cross-review, Stoplight packaging, `.meta.json`, and minimal-diff safeguards.
- [ ] Port `sentry-triage` with Sentry MCP dependency, issue grouping, severity taxonomy, and output tasks compatible with `praxis-feature-flow --from`.
- [ ] Port `qa-checklist` with input modes for text, URL, images, and documents; route spreadsheet/document parsing to existing Codex skills when needed.
- [ ] Port `system-profile` with integration registry output and onboarding/audit use cases.
- [ ] Rebuild `skill-from-git` as a Codex project-skill generator that writes `.agents/skills/{project}-patterns/SKILL.md`, not `.claude/skills/...`.
- [ ] Rebuild `ai-debug` as a workflow introspection skill that reports available Codex skills, references, MCP dependencies, plugin status, and workflow state.
- [ ] Commit after each supporting skill with `feat: port <workflow> skill`.

### Task 8: Original Skills as Codex Skills

**Files:**
- Modify/Create: `.agents/skills/praxis-design-template/SKILL.md`
- Modify/Create: `.agents/skills/praxis-adr-template/SKILL.md`
- Modify/Create: `.agents/skills/praxis-api-contracts-template/SKILL.md`
- Modify/Create: `.agents/skills/praxis-tdd-approach/SKILL.md`
- Modify/Create: `.agents/skills/praxis-owasp-top-10/SKILL.md`
- Modify/Create: `.agents/skills/praxis-security-audit-checklist/SKILL.md`
- Modify/Create: `.agents/skills/praxis-test-design-techniques/SKILL.md`
- Modify/Create: `.agents/skills/praxis-task-refinement/SKILL.md`
- Modify/Create: `.agents/skills/praxis-stoplight-docs/SKILL.md`

**Interfaces:**
- Consumes: `skills/*`.
- Produces: validated Codex skills with clean trigger descriptions and reference routing.

Steps:
- [ ] Normalize frontmatter to Codex skill expectations.
- [ ] Move long examples and tables into `references/` where they do not need to be always loaded.
- [ ] Add explicit "use when" and "do not use when" boundaries to every description.
- [ ] Preserve Stoplight references and API governance materials.
- [ ] Verify no skill frontmatter references Claude-only tools.
- [ ] Commit with message: `feat: normalize reusable skills for codex`.

### Task 9: MCP and Tool Dependency Model

**Files:**
- Create: `.agents/openai.yaml`
- Modify: `.codex/config.example.toml`
- Create: `docs/how/configure-mcp.md`
- Create: `docs/porting/tool-dependencies.md`

**Interfaces:**
- Consumes: all source `allowed_tools`, `mcp__...` mentions, and scenario MCP tables.
- Produces: explicit Codex dependency model for Sentry, Context7, GitHub, browser, OpenAI Docs, and optional Stoplight tooling.

Steps:
- [ ] Map Claude tools to Codex equivalents: `Read/Grep/Glob/Bash/Edit/Write` to local file/shell tools, `TeamCreate/SendMessage` to Codex subagents where available, MCP tools to configured MCP servers.
- [ ] Declare skill dependencies in `openai.yaml` where useful.
- [ ] Document fallback behavior when a dependency is missing.
- [ ] Add MCP setup examples without tokens or secrets.
- [ ] Add permission notes for destructive git operations, browser use, Sentry access, and PR creation.
- [ ] Commit with message: `docs: define codex mcp dependency model`.

### Task 10: Plugin Packaging

**Files:**
- Create: `plugin/.codex-plugin/plugin.json`
- Create: `plugin/skills/`
- Create: `plugin/assets/`
- Create: `docs/how/install-as-plugin.md`
- Create: `docs/porting/plugin-release-checklist.md`

**Interfaces:**
- Consumes: stable `.agents/skills` output.
- Produces: installable Codex plugin bundle.

Steps:
- [ ] Create plugin manifest with name, version, description, author, skills, optional MCP servers, and display metadata.
- [ ] Package the converted skills without duplicating stale source paths.
- [ ] Include icons/assets only if they add clarity in the Codex app plugin directory.
- [ ] Add local install and uninstall instructions.
- [ ] Add a release checklist: metadata validation, skill discovery, MCP dependency prompts, clean install, disable/enable behavior.
- [ ] Commit with message: `feat: package workflows as codex plugin`.

### Task 11: Compatibility and Migration Docs

**Files:**
- Create: `docs/how/migrate-from-claude-code.md`
- Create: `docs/comparisons/claude-code-vs-codex-surfaces.md`
- Create: `docs/why/codex-native-port.md`
- Modify: `README.md`
- Modify: `ARCHITECTURE.md`

**Interfaces:**
- Consumes: original docs and all target architecture decisions.
- Produces: user-facing explanation of the new system.

Steps:
- [ ] Explain that `install.sh`/`uninstall.sh` are Claude Code-era scripts and not the Codex path.
- [ ] Provide direct usage examples for Codex: explicit skill invocation, implicit invocation, repo-scoped installation, user-scoped installation, plugin installation.
- [ ] Document the equivalence table: original `/feature` command -> `praxis-feature-flow` skill; original agent team -> Codex subagent/reviewer pattern.
- [ ] Document what got upgraded: skill discovery, plugin packaging, dependency declarations, validation scripts, Codex app/CLI/IDE compatibility.
- [ ] Keep a short migration guide for existing users of the Claude workflow.
- [ ] Commit with message: `docs: add codex migration guide`.

### Task 12: Automated Audits

**Files:**
- Create: `tests/audits/check-skill-frontmatter.ps1`
- Create: `tests/audits/check-coverage-matrix.ps1`
- Create: `tests/audits/check-reference-links.ps1`
- Create: `tests/audits/check-no-claude-only-surfaces.ps1`
- Create: `tests/audits/run-all.ps1`

**Interfaces:**
- Consumes: all converted skills, docs, references, and inventory files.
- Produces: repeatable verification for the port.

Steps:
- [ ] Validate every `SKILL.md` has `name` and `description`.
- [ ] Validate every source file from `expected-source-files.txt` has a row in `coverage-matrix.md`.
- [ ] Validate local markdown links resolve.
- [ ] Detect remaining hard dependencies on `~/.claude`, `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS`, `TeamCreate`, `SendMessage`, or Claude-only install paths outside compatibility docs.
- [ ] Run the audit suite on Windows PowerShell.
- [ ] Commit with message: `test: add codex port audits`.

### Task 13: Dry Run Workflows

**Files:**
- Create: `tests/workflow-fixtures/sample-project/`
- Create: `docs/porting/dry-run-report.md`

**Interfaces:**
- Consumes: all converted skills and validation scripts.
- Produces: evidence that the workflows can be followed in Codex without relying on Claude Code.

Steps:
- [ ] Create a tiny sample project fixture with a few source files, tests, and docs.
- [ ] Dry-run `praxis-feature-flow` through initialize/status/resume without implementing a real feature.
- [ ] Dry-run `praxis-research` on the fixture and verify research artifacts are produced.
- [ ] Dry-run `praxis-design` and verify diagrams/ADR/test strategy references are produced.
- [ ] Dry-run `praxis-plan` and verify vertical phase files are produced.
- [ ] Dry-run `praxis-docs-suite` in fixture mode and verify docs artifacts are produced.
- [ ] Record failures and fixes in `dry-run-report.md`.
- [ ] Commit with message: `test: add dry run evidence for codex workflows`.

### Task 14: Release Preparation

**Files:**
- Create: `CHANGELOG.md`
- Create: `docs/porting/release-notes-v0.1.md`
- Modify: `README.md`
- Modify: `CONTRIBUTING.md`

**Interfaces:**
- Consumes: plugin package, docs, audits, dry-run report.
- Produces: a reviewable first Codex-native release.

Steps:
- [ ] Mark the first release as `v0.1.0-codex-port`.
- [ ] State compatibility: Codex app, Codex CLI, Codex IDE extension, plugin package status, MCP optional dependencies.
- [ ] Document known limitations and unsupported Claude-only behaviors.
- [ ] Add contribution rules for adding new workflow skills, role references, and audits.
- [ ] Tag only after all audit scripts pass.
- [ ] Commit with message: `chore: prepare codex port release`.

## Verification Strategy

Run these checks before declaring the port complete:

```powershell
pwsh tests/audits/run-all.ps1
git status --short
gh repo view EdwyReed/praxis-skills --json nameWithOwner,isFork,url,viewerPermission
```

Acceptance criteria:

- Every original source command is represented by a Codex skill or explicitly documented as merged.
- Every original source agent is preserved as a role reference or intentionally merged into a stronger role.
- Every original source skill remains a Codex skill or a referenced part of a larger skill.
- Every rule and context is reachable from at least one target skill.
- Feature development flow still supports refine, research, design, human checkpoint, plan, implement, docs, and PR.
- Sentry triage still feeds feature development through `--from`-style artifact intake.
- Documentation suite still supports full mode, update mode, cross-review, Stoplight packaging, and `.meta.json`.
- `skill-from-git` writes Codex project skills under `.agents/skills`, not `.claude/skills`.
- No user-facing install path requires `~/.claude`.
- Plugin install path and repo-local skill path are both documented.

## Risks and Mitigations

- Risk: losing role nuance while converting agents.
  - Mitigation: preserve original agent files as references first, then improve them in Codex-specific passes.

- Risk: overloading always-on `AGENTS.md`.
  - Mitigation: keep `AGENTS.md` small and route detailed rules through skills.

- Risk: Codex subagent availability differs by surface/config.
  - Mitigation: each multi-role skill must include inline fallback behavior.

- Risk: MCP dependencies are not installed.
  - Mitigation: declare dependencies and provide graceful fallback or explicit blocked state.

- Risk: port becomes a mechanical rename.
  - Mitigation: require validation scripts, plugin packaging, dependency declarations, and dry-run reports before release.

## Recommended Execution Order

1. Inventory and architecture: Tasks 1-2.
2. Guidance and references: Tasks 3-4.
3. Core workflow: Task 5.
4. Phase workflows: Task 6.
5. Supporting workflows: Task 7.
6. Reusable skills: Task 8.
7. Dependencies and plugin: Tasks 9-10.
8. Docs, audits, dry runs, release: Tasks 11-14.

This order keeps the original workflow safe while gradually making each piece Codex-native.
