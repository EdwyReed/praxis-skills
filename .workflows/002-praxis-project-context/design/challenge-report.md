# Challenge Report: Mandatory Praxis project context

## Summary

- Challenges raised: 4
- Critical: 0
- Significant: 3
- Minor: 1

## Architecture Challenges

### Challenge A-1: Mandatory gate can overreach

**Severity:** SIGNIFICANT
**Target:** Project-scoped entry points
**Issue:** Standalone QA or artifact tasks may run inside a directory that is not meaningfully a project.
**Required response:** Make repository-bound scope explicit and keep standalone artifact processing exempt.

### Challenge A-2: Confirmation can deadlock bootstrap

**Severity:** SIGNIFICANT
**Target:** State model
**Issue:** The Praxis repository itself lacks the profile required by the new rule.
**Required response:** Permit initialization/repair and read-only reconnaissance while status is unconfirmed.

## ADR Challenges

### Challenge ALT-1: Single file size

**Severity:** MINOR
**Target:** Alternative B
**Issue:** A single file can become bloated if agents add implementation detail.
**Required response:** Define a concise ceiling and exclude feature-level specifications.

### Challenge R-1: Staleness

**Severity:** SIGNIFICANT
**Target:** Profile lifecycle
**Issue:** A once-confirmed profile can silently diverge from the product.
**Required response:** Add explicit refresh mode that preserves accepted decisions and returns material changes to `needs-confirmation`.

## Implicit Assumptions Found

| # | Assumption | Where Found | Risk If Wrong |
|---|------------|-------------|---------------|
| 1 | Every current directory represents a project | Mandatory gate | Unnecessary onboarding for standalone artifacts |
| 2 | User confirmation is always immediately available | Existing-project flow | Requested work can remain paused |
| 3 | One Markdown file remains concise | Canonical artifact | Context inflation |

## Verdict

PASS WITH CONDITIONS

The design is viable after explicitly limiting the gate to project-scoped work, allowing bootstrap reconnaissance, and defining refresh and size rules. These conditions are incorporated into `architecture.md`.
