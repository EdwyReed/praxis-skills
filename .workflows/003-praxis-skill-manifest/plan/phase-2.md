# Phase 2: Discovery, packaging, and install

## Goal

Make the dependency manifest discoverable, context-efficient, documented, and present in the user-global Praxis installation.

## Changes

- Extend the managed root bootstrap and global Codex guidance.
- Extend project-scoped gates and workflow state schema.
- Update README, changelog, install documentation, and plugin metadata.
- Run full audits, force global installation, verify, and compare hashes.

## TDD Approach

Extend structural audits first, then update every source/plugin/global surface until gate coverage, docs, installation, and parity checks pass.

## Acceptance Criteria

- Agents find the manifest without Praxis but do not load it into every task context.
- Missing applicable required packages pause affected work and ask for installation approval.
- No automatic external installation is permitted.
- Full audits and installed hash parity pass.

## Verification

Run all audits, install with `--user --force`, run install verification, and compare source/plugin/installed trees.
