# Phase 1: Package contract and CLI core

## Scope

Create npm metadata, the authoritative distribution manifest, the zero-dependency CLI, and isolated Node integration tests.

## Files

- `package.json`, `package-lock.json`, `.gitignore`, `LICENSE`
- `distribution/manifest.json`
- `bin/praxis-skills.mjs`
- `lib/installer.mjs`, `lib/output.mjs`
- `tests/npm/cli.test.mjs`

## TDD Approach

1. RED: write tests for list/version, target selection, install, skip, force confirmation, dry-run, uninstall, doctor, containment, and JSON output.
2. GREEN: implement argument parsing, manifest validation, plan construction, safe filesystem mutations, receipts, and presenters with standard Node APIs only.
3. REFACTOR: separate mutation-free planning from execution and keep terminal formatting outside the installer engine.

## Verification

- `npm test`
- `npm audit --omit=dev`
- No runtime dependencies or lifecycle scripts in `package.json`.
