# ADR-001: Zero-dependency Node CLI with declarative payload

## Status

Accepted by the user-approved npx direction.

## Context

Praxis currently distributes 23 skills through repository and plugin mirrors plus PowerShell/Bash scripts. No npm package exists. npx requires an executable npm package, while filesystem force/uninstall operations require a narrow ownership boundary.

## Decision

Publish `praxis-skills` with a zero-runtime-dependency Node CLI. Use `plugin/skills` as the npm payload and `distribution/manifest.json` as the exact distribution and ownership contract. Keep existing scripts as supported fallbacks and enforce conformance through audits.

## Alternatives Considered

### CLI framework dependency

- Pros: mature argument parsing, help, and prompts.
- Cons: increases tarball and transitive supply-chain surface for a small command set.

### Adopt an external skill extraction package

- Pros: established extraction conventions and less custom copy code.
- Cons: does not directly cover Praxis receipts, legacy cleanup, plugin packaging, or its exact destructive-operation policy.

### Generate a standalone package payload during release

- Pros: smallest possible tarball layout.
- Cons: introduces build-time copying and another parity boundary; source/plugin mirrors already exist.

## Risks

| Risk | Probability | Impact | Mitigation |
|---|---|---|---|
| Custom parser defects | medium | medium | narrow grammar, Node built-in tests, stable help snapshots |
| Path deletion defect | low | high | strict containment, exact manifest names, temp-directory destructive tests |
| Plugin mirror drift | low | high | existing plus new full-tree parity audits |
| Node prerequisite excludes some users | medium | low | retain PowerShell/Bash checkout installers |

## Consequences

- npm is a delivery channel, not the workflow source of truth.
- CLI code remains directly executable without a build step.
- Plugin skill parity becomes a release-critical contract.
- Existing non-Node install paths remain available.
