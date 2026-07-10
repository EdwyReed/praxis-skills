# Source Inventory

Generated from the pre-port `master` source tree. A local migration checkout at `tmp/codex-workflows-source` is not part of the distributed repository.

| Source file | Category | Target |
| --- | --- | --- |
| `.claude/settings.local.json` | claude-config | `.codex/config.example.toml; docs/how/configure-mcp.md` |
| `.gitignore` | repo-doc | `.gitignore not required for Codex runtime` |
| `agents/documentation/architect-collector.md` | documentation-agent | `references/agents/documentation/architect-collector.md` |
| `agents/documentation/swagger-collector.md` | documentation-agent | `references/agents/documentation/swagger-collector.md` |
| `agents/documentation/system-profiler.md` | documentation-agent | `references/agents/documentation/system-profiler.md` |
| `agents/documentation/technical-collector.md` | documentation-agent | `references/agents/documentation/technical-collector.md` |
| `agents/documentation/technical-writer.md` | documentation-agent | `references/agents/documentation/technical-writer.md` |
| `agents/engineering/code-writer.md` | engineering-agent | `references/agents/engineering/code-writer.md` |
| `agents/engineering/codebase-researcher.md` | engineering-agent | `references/agents/engineering/codebase-researcher.md` |
| `agents/engineering/design-architect.md` | engineering-agent | `references/agents/engineering/design-architect.md` |
| `agents/engineering/design-reviewer.md` | engineering-agent | `references/agents/engineering/design-reviewer.md` |
| `agents/engineering/devils-advocate.md` | engineering-agent | `references/agents/engineering/devils-advocate.md` |
| `agents/engineering/implement-lead.md` | engineering-agent | `references/agents/engineering/implement-lead.md` |
| `agents/engineering/phase-planner.md` | engineering-agent | `references/agents/engineering/phase-planner.md` |
| `agents/engineering/qa-engineer.md` | engineering-agent | `references/agents/engineering/qa-engineer.md` |
| `agents/engineering/quality-gate.md` | engineering-agent | `references/agents/engineering/quality-gate.md` |
| `agents/engineering/quality-reviewer.md` | engineering-agent | `references/agents/engineering/quality-reviewer.md` |
| `agents/engineering/research-lead.md` | engineering-agent | `references/agents/engineering/research-lead.md` |
| `agents/engineering/security-reviewer.md` | engineering-agent | `references/agents/engineering/security-reviewer.md` |
| `agents/engineering/sentry-triager.md` | engineering-agent | `references/agents/engineering/sentry-triager.md` |
| `agents/engineering/task-refiner.md` | engineering-agent | `references/agents/engineering/task-refiner.md` |
| `agents/engineering/tdd-guide.md` | engineering-agent | `references/agents/engineering/tdd-guide.md` |
| `agents/engineering/test-strategist.md` | engineering-agent | `references/agents/engineering/test-strategist.md` |
| `agents/README.md` | repo-doc | `references/agents/README.md` |
| `ARCHITECTURE.md` | repo-doc | `ARCHITECTURE.md; docs/porting/codex-architecture.md` |
| `CLAUDE.md` | repo-doc | `AGENTS.md; README.md` |
| `commands/ai-debug.md` | command | `.agents/skills/praxis-ai-debug/SKILL.md` |
| `commands/design.md` | command | `.agents/skills/praxis-design/SKILL.md` |
| `commands/docs-suite.md` | command | `.agents/skills/praxis-docs-suite/SKILL.md` |
| `commands/feature.md` | command | `.agents/skills/praxis-feature-flow/SKILL.md` |
| `commands/implement.md` | command | `.agents/skills/praxis-implement/SKILL.md` |
| `commands/plan.md` | command | `.agents/skills/praxis-plan/SKILL.md` |
| `commands/pr.md` | command | `.agents/skills/praxis-pr/SKILL.md` |
| `commands/qa-checklist.md` | command | `.agents/skills/praxis-qa-checklist/SKILL.md` |
| `commands/README.md` | command | `references/source-docs/commands/README.md` |
| `commands/refine.md` | command | `.agents/skills/praxis-refine/SKILL.md` |
| `commands/research.md` | command | `.agents/skills/praxis-research/SKILL.md` |
| `commands/sentry-triage.md` | command | `.agents/skills/praxis-sentry-triage/SKILL.md` |
| `commands/skill-from-git.md` | command | `.agents/skills/praxis-skill-from-git/SKILL.md` |
| `commands/system-profile.md` | command | `.agents/skills/praxis-system-profile/SKILL.md` |
| `contexts/dev.md` | context | `references/contexts/dev.md` |
| `contexts/planning.md` | context | `references/contexts/planning.md` |
| `contexts/README.md` | context | `references/contexts/README.md` |
| `contexts/research.md` | context | `references/contexts/research.md` |
| `contexts/review.md` | context | `references/contexts/review.md` |
| `CONTRIBUTING.md` | repo-doc | `CONTRIBUTING.md` |
| `docs/comparisons/complexity-adaptive-flow.md` | source-doc | `references/source-docs/comparisons/complexity-adaptive-flow.md` |
| `docs/comparisons/documentation-agents-and-suite.md` | source-doc | `references/source-docs/comparisons/documentation-agents-and-suite.md` |
| `docs/comparisons/skill-from-git-vs-skill-creator.md` | source-doc | `references/source-docs/comparisons/skill-from-git-vs-skill-creator.md` |
| `docs/how/documentation-suite.md` | source-doc | `references/source-docs/how/documentation-suite.md` |
| `docs/how/feature-flow-reference.md` | source-doc | `references/source-docs/how/feature-flow-reference.md` |
| `docs/how/feature-flow.md` | source-doc | `references/source-docs/how/feature-flow.md` |
| `docs/how/incremental-docs-update.md` | source-doc | `references/source-docs/how/incremental-docs-update.md` |
| `docs/how/qa-checklist.md` | source-doc | `references/source-docs/how/qa-checklist.md` |
| `docs/how/sentry-triage.md` | source-doc | `references/source-docs/how/sentry-triage.md` |
| `docs/how/system-profiler.md` | source-doc | `references/source-docs/how/system-profiler.md` |
| `docs/why/header-format-standard.md` | source-doc | `references/source-docs/why/header-format-standard.md` |
| `install.sh` | script | `install.ps1; install.sh; docs/how/migrate-from-claude-code.md` |
| `README.md` | repo-doc | `README.md; docs/how/migrate-from-claude-code.md` |
| `ROADMAP.md` | repo-doc | `docs/porting/release-notes-v0.1.md` |
| `rules/coding-style.md` | rule | `references/rules/coding-style.md` |
| `rules/database.md` | rule | `references/rules/database.md` |
| `rules/git.md` | rule | `references/rules/git.md` |
| `rules/language.md` | rule | `references/rules/language.md` |
| `rules/messaging.md` | rule | `references/rules/messaging.md` |
| `rules/qa-checklist-selection.md` | rule | `references/rules/qa-checklist-selection.md` |
| `rules/security.md` | rule | `references/rules/security.md` |
| `rules/testing.md` | rule | `references/rules/testing.md` |
| `scenarios/delivery/documentation-suite.md` | scenario | `references/scenarios/delivery/documentation-suite.md` |
| `scenarios/delivery/feature-development.md` | scenario | `references/scenarios/delivery/feature-development.md` |
| `scenarios/README.md` | scenario | `references/scenarios/README.md` |
| `skills/adr-template/SKILL.md` | skill | `.agents/skills/praxis-adr-template/SKILL.md` |
| `skills/api-contracts-template/SKILL.md` | skill | `.agents/skills/praxis-api-contracts-template/SKILL.md` |
| `skills/design-template/SKILL.md` | skill | `.agents/skills/praxis-design-template/SKILL.md` |
| `skills/owasp-top-10/SKILL.md` | skill | `.agents/skills/praxis-owasp-top-10/SKILL.md` |
| `skills/security-audit-checklist/SKILL.md` | skill | `.agents/skills/praxis-security-audit-checklist/SKILL.md` |
| `skills/stoplight-docs/references/api-governance.md` | skill | `.agents/skills/praxis-stoplight-docs/references/api-governance.md` |
| `skills/stoplight-docs/references/smd-syntax.md` | skill | `.agents/skills/praxis-stoplight-docs/references/smd-syntax.md` |
| `skills/stoplight-docs/references/stoplight-api-governance.md` | skill | `.agents/skills/praxis-stoplight-docs/references/stoplight-api-governance.md` |
| `skills/stoplight-docs/SKILL.md` | skill | `.agents/skills/praxis-stoplight-docs/SKILL.md` |
| `skills/task-refinement/SKILL.md` | skill | `.agents/skills/praxis-task-refinement/SKILL.md` |
| `skills/tdd-approach/SKILL.md` | skill | `.agents/skills/praxis-tdd-approach/SKILL.md` |
| `skills/test-design-techniques/SKILL.md` | skill | `.agents/skills/praxis-test-design-techniques/SKILL.md` |
| `templates/agent-template.md` | template | `references/templates/agent-template.md` |
| `uninstall.sh` | script | `uninstall.ps1; docs/how/uninstall.md` |
