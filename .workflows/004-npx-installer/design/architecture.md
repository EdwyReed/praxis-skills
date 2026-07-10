# Architecture: npx installer

## Overview

Add a zero-runtime-dependency Node CLI distributed as the public `praxis-skills` npm package. The npm tarball carries the existing `plugin/skills` mirror, a declarative distribution manifest, the CLI, documentation, changelog, and license. Existing PowerShell/Bash entry points remain supported and are checked for conformance.

Diagrams: [diagrams.md](diagrams.md)

## New and Changed Components

| Component | Type | Action | Responsibility |
|---|---|---|---|
| `package.json` / lock | npm metadata | NEW | Package identity, executable, engine, files allowlist, test and release scripts |
| `distribution/manifest.json` | distribution contract | NEW | Version, payload path, exact current and legacy skill names, receipt schema |
| `bin/praxis-skills.mjs` | CLI entrypoint | NEW | Parse command line, render help, map errors to exit codes |
| `lib/installer.mjs` | install engine | NEW | Resolve targets, build plans, enforce containment, copy/remove exact skill directories, write receipts |
| `lib/output.mjs` | presenter | NEW | Human and JSON output with no mutation logic |
| `tests/npm/*.test.mjs` | integration tests | NEW | Exercise install, force, dry-run, doctor, list, uninstall, package contents, and safety |
| `.github/workflows/publish-npm.yml` | release automation | NEW | Test and publish tagged versions using npm Trusted Publishing and provenance |
| `LICENSE` | legal artifact | NEW | Materialize the MIT license already declared by plugin metadata |
| `install.ps1` | legacy installer | MODIFY | Read current/legacy skill names from the distribution manifest |
| `install.sh` | legacy installer | MODIFY | Retain Node-free fallback and validate payload/manifest parity through audits |
| package audits | verification | MODIFY | Verify manifest, package allowlist, tarball, shell parity, and no lifecycle scripts |
| README/install docs | docs | MODIFY | Document npx as primary onboarding path and checkout scripts as fallback |

## Caller Analysis

| Component | Caller | Caller expects | After call |
|---|---|---|---|
| CLI entrypoint | `npx praxis-skills ...` or direct Node execution | exit 0 with stable output; nonzero with actionable error | terminal output only |
| install engine | CLI command handler | deterministic plan before mutation; structured result | presenter renders human/JSON report |
| distribution manifest | Node CLI, PowerShell installer, audits | exact payload and ownership boundary | plan construction or validation |
| publish workflow | Git tag / manual workflow | tests and pack checks pass before publish | npm registry release with provenance |

## CLI Scope

Version 1 commands:

- `install --user | --repo [path] | --target <skills-dir>`
- `uninstall --user | --repo [path] | --target <skills-dir>`
- `doctor --user | --repo [path] | --target <skills-dir>`
- `list`
- `version`

Common options: `--force`, `--dry-run`, `--yes`, and `--json` where applicable. No `postinstall` or implicit project initialization is allowed. After installation, users invoke `$praxis-init` in their agent.

## Filesystem Safety Contract

1. Resolve the selected skills root to an absolute path.
2. Construct destinations only from manifest-owned kebab-case skill names.
3. Verify every destination is a strict child of the selected skills root.
4. Build and display a plan before mutation.
5. Skip existing targets unless `--force` is supplied.
6. Require interactive confirmation or `--yes` before force replacement or uninstall; dry-run never prompts.
7. Remove only manifest-owned current or explicitly listed legacy directories.
8. Preserve unrelated files and directories.
9. Write a receipt outside the skills directory at the corresponding `.agents` root when using user/repo presets.

## Packaging Contract

The npm `files` allowlist includes only executable/library code, `distribution/`, `plugin/skills`, plugin metadata, README, changelog, and license. `npm pack --dry-run --json` is a required gate. The package has no runtime dependencies and no lifecycle scripts.

## Release Contract

- Package name: `praxis-skills`.
- First public candidate: `0.4.0-beta.1`.
- Node engine floor: `>=22`.
- First publication requires an authenticated account-security bootstrap.
- Subsequent publication uses GitHub Actions OIDC Trusted Publishing with provenance and no long-lived npm token.
- A tag must match `package.json` version before publish.

## Non-Functional Requirements

| Requirement | Target | Basis |
|---|---|---|
| Dependencies | zero runtime npm dependencies | reduce supply-chain surface |
| Install time | local copy planning plus payload copy; no network beyond npx package fetch | payload is approximately 4 MB |
| Determinism | same manifest and package version produce the same owned destination set | receipt and tests |
| Safety | no unrelated path deletion in force or uninstall tests | exact-name containment contract |
| Portability | Windows, macOS, and Linux under Node 22+ | standard Node filesystem APIs |

## Open Questions

| Question | Status | Resolution |
|---|---|---|
| First publish authentication | ready external gate | npm account 2FA is enabled; perform the approved bootstrap publish, then configure Trusted Publishing |
| Beta vs stable | resolved | publish `0.4.0-beta.1` first |
| Node engine floor | resolved | `>=22` |
| Package name | resolved | unscoped `praxis-skills`, currently unregistered |
