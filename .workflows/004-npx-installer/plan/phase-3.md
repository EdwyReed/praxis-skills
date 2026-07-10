# Phase 3: Release automation and distribution verification

## Scope

Add Trusted Publishing automation, enforce tarball boundaries, and validate the exact artifact that will become the beta package.

## Files

- `.github/workflows/publish-npm.yml`
- package/audit tests and release documentation as required by verification findings

## TDD Approach

1. RED: extend distribution audits to reject unexpected tarball files, version/tag mismatch, lifecycle scripts, dependencies, or missing provenance permissions.
2. GREEN: add the minimal GitHub Actions OIDC workflow and package allowlist configuration.
3. REFACTOR: remove redundant release mechanisms and keep the bootstrap publish explicitly separated from subsequent trusted releases.

## Verification

- `npm pack --dry-run --json`
- Create a local tarball outside the repository and execute `list --json` plus isolated install/doctor smoke checks through npm.
- Full Node tests and Praxis audit suite remain green.
- Public `npm publish` waits at the explicit external-action gate.
