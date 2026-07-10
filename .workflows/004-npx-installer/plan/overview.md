# Implementation Plan: npx installer

## Goal

Ship `praxis-skills` as a zero-runtime-dependency npm CLI without weakening the existing checkout installers or the exact ownership boundary of the skill payload.

## Phases

1. [Package contract and CLI core](phase-1.md)
2. [Installer conformance and documentation](phase-2.md)
3. [Release automation and distribution verification](phase-3.md)

## Dependencies

Phase 1 establishes the manifest and executable contract used by phases 2 and 3. Phase 2 aligns existing entry points and user-facing guidance. Phase 3 packages the result, exercises the real tarball, and prepares the external beta publication gate.

## Completion Criteria

- All commands and destructive-operation guards from the design contract are implemented.
- Manifest, source tree, plugin mirror, package version, and plugin version agree.
- Node tests, PowerShell audits, npm audit, pack inspection, and tarball smoke checks pass.
- No npm lifecycle scripts, runtime dependencies, bundled credentials, or unrelated package files exist.
