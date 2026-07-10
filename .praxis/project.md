---
schema: praxis-project/v1
status: confirmed
project_id: praxis-skills
project_type: existing
source: audit
visual_scope: none
updated: 2026-07-10
---

# Core Contract

**Concept:** Praxis Skills is a Codex-first, agent-portable, artifact-driven engineering workflow package. It turns ambiguous product and engineering requests into inspectable refinement, research, design, planning, implementation, review, documentation, QA, and PR artifacts without depending on hidden orchestration.

**Primary outcomes:** Preserve a coherent end-to-end delivery lifecycle; keep every phase independently usable; verify Codex as the primary integration while keeping the Markdown skill and artifact core portable to compatible agents; distribute the Codex integration through repo-local skills, user-global skills, and a plugin package.

**Experience:** Praxis should feel disciplined, evidence-first, transparent, calm, and proportionate to task complexity. It should make decisions and checkpoints visible without becoming ceremonial or forcing a large workflow onto small work.

**Avoid:** Magical implicit behavior, conflicting workflow families, vendor-specific legacy surfaces, mandatory subagents, silent project-direction guesses, duplicated policies, and packaging that loses referenced files.

**Non-negotiables:** Active skills use the `praxis-` namespace; project work produces inspectable artifacts; repository and user instructions outrank workflow defaults; subagents remain optional with inline fallback; installation never deletes unrelated skills; all active package surfaces pass audits before completion.

**Design route:** This is a non-visual workflow package. Primary visual skill: `none`. Frontend design skills apply only to downstream product projects through the project profile and frontend routing gate.

## Project Concept

Praxis Skills packages reusable Codex workflows for engineering delivery. Its users are people running Codex against real repositories who need consistent project understanding, explicit human checkpoints, traceable decisions, and verified implementation rather than ad hoc prompt sequences.

The package is composed of `.agents/skills`, shared and embedded references, plugin distribution, installers, audits, and `.workflows/{feature-id}` delivery artifacts.

## Product Direction

### Active directions

- Maintain a complete but complexity-adaptive feature lifecycle.
- Make project-level direction durable through `.praxis/project.md`.
- Make external nonstandard skill dependencies reproducible through bounded `.praxis/skills.yaml` manifests when they exist.
- Keep frontend art direction explicit through one selected primary visual skill.
- Preserve parity between repo-local, plugin, and user-global skill installations.
- Keep workflow contracts agent-portable where practical while treating Codex as the primary maintained and verified runtime.
- Prefer Codex-native skills and `AGENTS.md` over legacy slash-command surfaces.
- Strengthen deterministic audits around every packaging or routing contract.

### Non-goals

- Becoming an application runtime, hosted service, or project-management database.
- Replacing repository-specific architecture, coding conventions, or product decisions.
- Bundling or automatically installing unrelated design-skill families.
- Requiring agent teams for workflows that can run inline.
- Claiming compatibility with an agent runtime that has not been tested against Praxis discovery, tools, and workflow behavior.

## Experience Direction

| Dimension | Desired | Avoid |
|-----------|---------|-------|
| Workflow | Explicit phases with visible inputs, outputs, gates, and resumability | Hidden state or implied completion |
| Rigor | Evidence before decisions; verification before completion | Performative checklists without proof |
| Complexity | Small tasks stay small; large tasks receive deeper design and review | One maximum ceremony level for every task |
| Communication | Concise, direct, operational, and candid about uncertainty | Generic process prose or unexplained jargon |
| Extensibility | Specialized skills compose through narrow contracts | Multiple skills competing for the same authority |

## Design Skill Routing

| Role | Selection | Rationale |
|------|-----------|-----------|
| Visual scope | none | Praxis itself has no product UI surface |
| Primary visual skill | none | Visual direction belongs to downstream projects |
| Technical supplements | Skill Creator for skill authoring; package audits for validation | Narrow supporting responsibilities |
| Explicit-only styles | TasteSkill family in downstream visual projects | Selected through each project's confirmed profile |
| Prohibited combinations | Superpowers workflow family with Praxis | Competing lifecycle authority |

## Reference Designs and Projects

| Reference | URL or project path | Borrow | Avoid | Evidence |
|-----------|---------------------|--------|-------|----------|
| Original workflow source | Pre-port `master` history | Workflow coverage and role semantics | Claude-only invocation surfaces | Preserved Git history; local migration checkout is not distributed |
| Codex port architecture | `docs/porting/codex-architecture.md` | Codex-native packaging decisions | Unsupported compatibility assumptions | Active documentation |
| Feature scenario | `references/scenarios/delivery/feature-development.md` | Artifact chain and human checkpoints | Full flow for trivial changes | Active scenario |
| External visual references | — | None confirmed | Invented design influence | No visual product surface |

## Existing System and Assets

| Asset or system | Canonical location | Role |
|-----------------|--------------------|------|
| Repo-local skills | `.agents/skills/` | Active reusable workflow source |
| Plugin skills | `plugin/skills/` | Installable plugin mirror |
| Shared references | `references/` | Roles, rules, contexts, scenarios, templates |
| Workflow state | `.workflows/{feature-id}/` | Feature-specific evidence and phase artifacts |
| Project skill manifest | `.praxis/skills.yaml` when needed | Pinned acquisition metadata for external nonstandard skill dependencies |
| Package audits | `tests/audits/` | Structural, naming, reference, routing, and install verification |
| User installer | `install.ps1` and `install.sh` | Repo-local, user-global, and plugin setup |

## Constraints and Non-Negotiables

- Preserve the `Praxis Skills` / `praxis-skills` brand and `praxis-*` skill namespace.
- Do not add active Claude Code slash-command surfaces.
- Keep detailed references embedded in installed workflow skills when those skills load them.
- Keep subagents optional and provide equivalent inline execution.
- Do not rewrite unrelated user changes or delete unrelated skills during migration.
- Run `pwsh tests/audits/run-all.ps1` before claiming package completion.
- Keep user-facing project profiles concise and require explicit confirmation of inferred direction.
- Never inventory all locally installed skills or automatically install external packages from a project manifest.
- Keep runtime-neutral workflow semantics separate from Codex-specific discovery, plugin, and connector packaging.

## Open Questions

- Should Praxis eventually be published through a remote marketplace, or remain primarily repo-local and user-global?
- Should future non-engineering workflows live in this package or in separate Praxis-family plugins?

## Confirmation

| Field | Value |
|-------|-------|
| Status | confirmed |
| Confirmed by | Project owner |
| Confirmed on | 2026-07-10 |
| Material corrections | Confirmed Codex-first and agent-portable positioning; added bounded, consent-gated project skill dependency manifests |
