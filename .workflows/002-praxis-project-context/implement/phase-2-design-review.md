# Phase 2 Design Review

## Verdict

PASS

## Conformance

- The root `AGENTS.md` bridge makes discovery survive an absent Praxis installation and competes for very little context.
- Re-read triggers cover compaction, profile hash changes, and direction-changing requests.
- Workflow state persists the exact profile revision used for a run.
- The profile is mandatory for repository mutation but still permits read-only reconnaissance and profile repair.
- Praxis dogfoods the contract with an audited, compact `needs-confirmation` profile.
