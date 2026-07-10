# Coverage Matrix

Every non-git file in the source snapshot must appear here. Status values are intentionally conservative: `ported`, `preserved`, `replaced`, or `documented`.

| Source file | Category | Target Praxis surface | Status | Verification method |
| --- | --- | --- | --- | --- |
| `.claude/settings.local.json` | claude-config | `.codex/config.example.toml; docs/how/configure-mcp.md` | replaced | install dry-run audit + no-claude-only audit |
| `.gitignore` | repo-doc | `.gitignore not required for Codex runtime` | preserved | source coverage audit + reference link audit |
| `agents/documentation/architect-collector.md` | documentation-agent | `references/agents/documentation/architect-collector.md` | preserved | source coverage audit + reference link audit |
| `agents/documentation/swagger-collector.md` | documentation-agent | `references/agents/documentation/swagger-collector.md` | preserved | source coverage audit + reference link audit |
| `agents/documentation/system-profiler.md` | documentation-agent | `references/agents/documentation/system-profiler.md` | preserved | source coverage audit + reference link audit |
| `agents/documentation/technical-collector.md` | documentation-agent | `references/agents/documentation/technical-collector.md` | preserved | source coverage audit + reference link audit |
| `agents/documentation/technical-writer.md` | documentation-agent | `references/agents/documentation/technical-writer.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/code-writer.md` | engineering-agent | `references/agents/engineering/code-writer.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/codebase-researcher.md` | engineering-agent | `references/agents/engineering/codebase-researcher.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/design-architect.md` | engineering-agent | `references/agents/engineering/design-architect.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/design-reviewer.md` | engineering-agent | `references/agents/engineering/design-reviewer.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/devils-advocate.md` | engineering-agent | `references/agents/engineering/devils-advocate.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/implement-lead.md` | engineering-agent | `references/agents/engineering/implement-lead.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/phase-planner.md` | engineering-agent | `references/agents/engineering/phase-planner.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/qa-engineer.md` | engineering-agent | `references/agents/engineering/qa-engineer.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/quality-gate.md` | engineering-agent | `references/agents/engineering/quality-gate.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/quality-reviewer.md` | engineering-agent | `references/agents/engineering/quality-reviewer.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/research-lead.md` | engineering-agent | `references/agents/engineering/research-lead.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/security-reviewer.md` | engineering-agent | `references/agents/engineering/security-reviewer.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/sentry-triager.md` | engineering-agent | `references/agents/engineering/sentry-triager.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/task-refiner.md` | engineering-agent | `references/agents/engineering/task-refiner.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/tdd-guide.md` | engineering-agent | `references/agents/engineering/tdd-guide.md` | preserved | source coverage audit + reference link audit |
| `agents/engineering/test-strategist.md` | engineering-agent | `references/agents/engineering/test-strategist.md` | preserved | source coverage audit + reference link audit |
| `agents/README.md` | repo-doc | `references/agents/README.md` | preserved | source coverage audit + reference link audit |
| `ARCHITECTURE.md` | repo-doc | `ARCHITECTURE.md; docs/porting/codex-architecture.md` | preserved | source coverage audit + reference link audit |
| `CLAUDE.md` | repo-doc | `AGENTS.md; README.md` | preserved | source coverage audit + reference link audit |
| `commands/ai-debug.md` | command | `.agents/skills/praxis-ai-debug/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/design.md` | command | `.agents/skills/praxis-design/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/docs-suite.md` | command | `.agents/skills/praxis-docs-suite/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/feature.md` | command | `.agents/skills/praxis-feature-flow/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/implement.md` | command | `.agents/skills/praxis-implement/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/plan.md` | command | `.agents/skills/praxis-plan/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/pr.md` | command | `.agents/skills/praxis-pr/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/qa-checklist.md` | command | `.agents/skills/praxis-qa-checklist/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/README.md` | command | `references/source-docs/commands/README.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/refine.md` | command | `.agents/skills/praxis-refine/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/research.md` | command | `.agents/skills/praxis-research/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/sentry-triage.md` | command | `.agents/skills/praxis-sentry-triage/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/skill-from-git.md` | command | `.agents/skills/praxis-skill-from-git/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `commands/system-profile.md` | command | `.agents/skills/praxis-system-profile/SKILL.md` | ported | skill-frontmatter audit + source coverage audit |
| `contexts/dev.md` | context | `references/contexts/dev.md` | preserved | source coverage audit + reference link audit |
| `contexts/planning.md` | context | `references/contexts/planning.md` | preserved | source coverage audit + reference link audit |
| `contexts/README.md` | context | `references/contexts/README.md` | preserved | source coverage audit + reference link audit |
| `contexts/research.md` | context | `references/contexts/research.md` | preserved | source coverage audit + reference link audit |
| `contexts/review.md` | context | `references/contexts/review.md` | preserved | source coverage audit + reference link audit |
| `CONTRIBUTING.md` | repo-doc | `CONTRIBUTING.md` | preserved | source coverage audit + reference link audit |
| `docs/comparisons/complexity-adaptive-flow.md` | source-doc | `references/source-docs/comparisons/complexity-adaptive-flow.md` | preserved | source coverage audit + reference link audit |
| `docs/comparisons/documentation-agents-and-suite.md` | source-doc | `references/source-docs/comparisons/documentation-agents-and-suite.md` | preserved | source coverage audit + reference link audit |
| `docs/comparisons/skill-from-git-vs-skill-creator.md` | source-doc | `references/source-docs/comparisons/skill-from-git-vs-skill-creator.md` | preserved | source coverage audit + reference link audit |
| `docs/how/documentation-suite.md` | source-doc | `references/source-docs/how/documentation-suite.md` | preserved | source coverage audit + reference link audit |
| `docs/how/feature-flow-reference.md` | source-doc | `references/source-docs/how/feature-flow-reference.md` | preserved | source coverage audit + reference link audit |
| `docs/how/feature-flow.md` | source-doc | `references/source-docs/how/feature-flow.md` | preserved | source coverage audit + reference link audit |
| `docs/how/incremental-docs-update.md` | source-doc | `references/source-docs/how/incremental-docs-update.md` | preserved | source coverage audit + reference link audit |
| `docs/how/qa-checklist.md` | source-doc | `references/source-docs/how/qa-checklist.md` | preserved | source coverage audit + reference link audit |
| `docs/how/sentry-triage.md` | source-doc | `references/source-docs/how/sentry-triage.md` | preserved | source coverage audit + reference link audit |
| `docs/how/system-profiler.md` | source-doc | `references/source-docs/how/system-profiler.md` | preserved | source coverage audit + reference link audit |
| `docs/why/header-format-standard.md` | source-doc | `references/source-docs/why/header-format-standard.md` | preserved | source coverage audit + reference link audit |
| `install.sh` | script | `install.ps1; install.sh; docs/how/migrate-from-claude-code.md` | replaced | install dry-run audit + no-claude-only audit |
| `README.md` | repo-doc | `README.md; docs/how/migrate-from-claude-code.md` | preserved | source coverage audit + reference link audit |
| `ROADMAP.md` | repo-doc | `docs/porting/release-notes-v0.1.md` | preserved | source coverage audit + reference link audit |
| `rules/coding-style.md` | rule | `references/rules/coding-style.md` | preserved | source coverage audit + reference link audit |
| `rules/database.md` | rule | `references/rules/database.md` | preserved | source coverage audit + reference link audit |
| `rules/git.md` | rule | `references/rules/git.md` | preserved | source coverage audit + reference link audit |
| `rules/language.md` | rule | `references/rules/language.md` | preserved | source coverage audit + reference link audit |
| `rules/messaging.md` | rule | `references/rules/messaging.md` | preserved | source coverage audit + reference link audit |
| `rules/qa-checklist-selection.md` | rule | `references/rules/qa-checklist-selection.md` | preserved | source coverage audit + reference link audit |
| `rules/security.md` | rule | `references/rules/security.md` | preserved | source coverage audit + reference link audit |
| `rules/testing.md` | rule | `references/rules/testing.md` | preserved | source coverage audit + reference link audit |
| `scenarios/delivery/documentation-suite.md` | scenario | `references/scenarios/delivery/documentation-suite.md` | preserved | source coverage audit + reference link audit |
| `scenarios/delivery/feature-development.md` | scenario | `references/scenarios/delivery/feature-development.md` | preserved | source coverage audit + reference link audit |
| `scenarios/README.md` | scenario | `references/scenarios/README.md` | preserved | source coverage audit + reference link audit |
| `skills/adr-template/SKILL.md` | skill | `.agents/skills/praxis-adr-template/SKILL.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/api-contracts-template/SKILL.md` | skill | `.agents/skills/praxis-api-contracts-template/SKILL.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/design-template/SKILL.md` | skill | `.agents/skills/praxis-design-template/SKILL.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/owasp-top-10/SKILL.md` | skill | `.agents/skills/praxis-owasp-top-10/SKILL.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/security-audit-checklist/SKILL.md` | skill | `.agents/skills/praxis-security-audit-checklist/SKILL.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/stoplight-docs/references/api-governance.md` | skill | `.agents/skills/praxis-stoplight-docs/references/api-governance.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/stoplight-docs/references/smd-syntax.md` | skill | `.agents/skills/praxis-stoplight-docs/references/smd-syntax.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/stoplight-docs/references/stoplight-api-governance.md` | skill | `.agents/skills/praxis-stoplight-docs/references/stoplight-api-governance.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/stoplight-docs/SKILL.md` | skill | `.agents/skills/praxis-stoplight-docs/SKILL.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/task-refinement/SKILL.md` | skill | `.agents/skills/praxis-task-refinement/SKILL.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/tdd-approach/SKILL.md` | skill | `.agents/skills/praxis-tdd-approach/SKILL.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `skills/test-design-techniques/SKILL.md` | skill | `.agents/skills/praxis-test-design-techniques/SKILL.md` | ported | skill-frontmatter audit + plugin manifest audit |
| `templates/agent-template.md` | template | `references/templates/agent-template.md` | preserved | source coverage audit + reference link audit |
| `uninstall.sh` | script | `uninstall.ps1; docs/how/uninstall.md` | replaced | install dry-run audit + no-claude-only audit |
