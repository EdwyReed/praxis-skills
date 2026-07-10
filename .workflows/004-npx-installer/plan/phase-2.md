# Phase 2: Installer conformance and documentation

## Scope

Make the distribution manifest authoritative for supported installers, add parity audits, and document npx as the primary path while retaining Node-free checkout fallbacks.

## Files

- `install.ps1`, `install.sh`
- `tests/audits/check-npm-distribution.ps1`, `tests/audits/run-all.ps1`
- `README.md`, `docs/how/install.md`, `docs/how/uninstall.md`, `CHANGELOG.md`
- `plugin/.codex-plugin/plugin.json`

## TDD Approach

1. RED: add an audit that fails on manifest/source/plugin/version or installer divergence.
2. GREEN: consume the manifest in PowerShell, validate it from Bash, synchronize versions, and update docs.
3. REFACTOR: keep one concise onboarding path and clearly label compatibility fallbacks.

## Verification

- `pwsh -File tests/audits/check-npm-distribution.ps1`
- `pwsh -File tests/audits/run-all.ps1`
- `npm test`
