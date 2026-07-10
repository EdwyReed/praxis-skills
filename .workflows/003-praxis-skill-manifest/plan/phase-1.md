# Phase 1: Contract and validation

## Goal

Teach `praxis-init` to create and validate a bounded `.praxis/skills.yaml` dependency manifest.

## Changes

- Add schema reference and template asset.
- Extend init/audit/refresh instructions and UI metadata.
- Extend the Python validator with optional manifest parsing, policy checks, and SHA-256 output.
- Add valid and invalid audit fixtures before accepting implementation.

## TDD Approach

Write fixtures for valid, optional, duplicate, floating-revision, and overflow cases; observe failures; implement the parser and rules; rerun all fixtures.

## Acceptance Criteria

- Absence remains valid when no external dependency exists.
- Valid manifests emit `skills_manifest_sha256`.
- Invalid requirements, duplicates, floating Git revisions, and unjustified overflow fail clearly.
- Source/plugin packages match.

## Verification

Run the dedicated context audit, Python syntax validation, and system skill validator.
