# Implementation Plan: Praxis Skill Dependency Manifest

## Phases

| # | Phase | Value | Dependencies | Size | Risk |
|---|---|---|---|---|---|
| 1 | Contract and validation | Contributors receive a safe, deterministic manifest contract | — | M | medium |
| 2 | Discovery, packaging, and install | Every Praxis surface understands and distributes the contract | Phase 1 | M | medium |

## Execution

Sequential: Phase 1 defines the behavior that Phase 2 routes, documents, audits, and installs.

## Deferred

- Automatic third-party installation.
- A remote registry or resolver.
- Tracking transitive dependencies.
