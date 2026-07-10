# ADR-001: Canonical Praxis project profile and skill-first initialization

## Status

Accepted for implementation.

## Context

Praxis has durable phase artifacts and global skill routing, but no mandatory project-level contract for concept, feel, design references, or skill direction. Skills are the active Codex-native reusable workflow surface; the package deliberately avoids Claude-specific slash commands. Repo-local and plugin installations maintain separate copies of skill packages.

## Decision

Use a single human-readable `.praxis/project.md` file with `praxis-project/v1` frontmatter. Create `praxis-init` as the explicit `$praxis-init` invocation and automatic gate target. Embed interview, audit, schema, bootstrap, and validation resources inside the skill package. Insert an idempotent managed pointer into root `AGENTS.md` so Codex discovers the profile without Praxis installed. Require confirmed context for direction-changing and mutating project workflows.

## Alternatives Considered

### Alternative A: Put everything in `AGENTS.md`

- Pros: automatically loaded; no new skill or directory.
- Cons: mixes agent-operating policy with product direction, grows global context, lacks explicit audit/confirmation lifecycle.

### Alternative B: Split context across `concept.md`, `design.md`, and `references.md`

- Pros: smaller focused files; individual sections can evolve independently.
- Cons: more discovery and synchronization overhead; easy for sessions to read only part of the contract.

### Alternative C: Add a separate slash command plus a skill

- Pros: familiar command-shaped UX for users coming from Claude Code.
- Cons: duplicates the invocation surface and conflicts with the package's Codex-native skill-first architecture.

## Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Onboarding blocks urgent work | medium | medium | Allow read-only reconnaissance and diagnostics, but not project mutation |
| Profile becomes stale | medium | high | Provide explicit refresh mode with confirmation and preserved decisions |
| Inferred direction is wrong | medium | high | Existing projects always start as `needs-confirmation` |
| One file grows too large | medium | medium | Set concise-section guidance and a preferred 2500-word ceiling |
| Source/plugin copies diverge | medium | high | Add parity and installed-resource audits |
| Agent misses the file without Praxis | medium | high | Managed root `AGENTS.md` pointer plus deterministic validation |

## Consequences

### Positive

- Every project gains one stable direction contract.
- Design-skill routing has project-specific evidence instead of session inference.
- New and existing projects receive different, appropriate onboarding.

### Negative

- First use in an existing repository requires an audit and confirmation turn.
- Multiple workflow skills need a small mandatory gate clause.

### Neutral

- `.workflows/` remains feature-delivery state; `.praxis/project.md` is long-lived project state.
